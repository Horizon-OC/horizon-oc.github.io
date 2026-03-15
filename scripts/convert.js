#!/usr/bin/env node

/**
 * convert-to-vitepress.js
 *
 * Converts markdown files using !!! / ??? admonition syntax (MkDocs/rentry style)
 * into VitePress-compatible ::: custom container syntax.
 *
 * Can fetch markdown directly from rentry.co pages (bypasses raw block by
 * scraping the edit page's <textarea>).
 *
 * Conversions performed:
 *   !!! type ** Title:** content   →  ::: mappedType Title\ncontent\n:::
 *   !!! type ** bold content **    →  ::: mappedType\ncontent\n:::
 *   !!! type "Title" content       →  ::: mappedType Title\ncontent\n:::
 *   !!! type inline content        →  ::: mappedType [defaultTitle]\ncontent\n:::
 *   !!! type\n    indented block   →  ::: mappedType\nblock\n:::
 *   ??? type ...                   →  ::: details ...\n:::
 *
 * Type mapping:
 *   note → tip (title defaults to "Note")
 *   caution/failure/error/bug → danger
 *   important/question → warning
 *   abstract/summary/quote → info
 *   success/check → tip
 *   example → details
 *   info/warning/danger/tip → kept as-is
 *
 * If a ** Title:** is extracted and the title matches a VitePress container
 * type (tip/info/warning/danger/details), the container type is remapped
 * to that type. e.g. !!! danger ** Warning:** text → ::: warning Warning
 *
 * Usage:
 *   node scripts/convert-to-vitepress.js <input.md> [output.md]
 *   node scripts/convert-to-vitepress.js https://rentry.co/mariko [output.md]
 *   node scripts/convert-to-vitepress.js rentry.co/mariko docs/mariko.md
 *   cat input.md | node scripts/convert-to-vitepress.js > output.md
 *   node scripts/convert-to-vitepress.js input.md --in-place
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Container types natively supported by VitePress */
const VITEPRESS_TYPES = new Set([
  "tip",
  "info",
  "warning",
  "danger",
  "details",
]);

/** Map non-VitePress admonition keywords → VitePress container type */
const TYPE_MAP = {
  // MkDocs built-in types
  note: "tip",
  caution: "danger",
  important: "warning",
  abstract: "info",
  summary: "info",
  tldr: "info",
  success: "tip",
  check: "tip",
  done: "tip",
  question: "warning",
  help: "warning",
  faq: "warning",
  failure: "danger",
  fail: "danger",
  missing: "danger",
  error: "danger",
  bug: "danger",
  example: "details",
  quote: "info",
  cite: "info",
};

/** When a type is mapped, optionally assign a default title */
const DEFAULT_TITLES = {
  note: "Note",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map a raw admonition type string to its VitePress equivalent.
 */
function mapType(rawType) {
  const lower = rawType.toLowerCase();
  if (VITEPRESS_TYPES.has(lower)) return lower;
  return TYPE_MAP[lower] || lower;
}

/**
 * Parse the inline portion of an admonition line and return
 * { type, title, content }.
 */
function parseAdmonition(rawType, rawContent) {
  let type = mapType(rawType);
  let title = DEFAULT_TITLES[rawType.toLowerCase()] || "";
  let content = rawContent.trim();

  // ── Pattern 1: ** Title:** rest  (bold title with colon) ──────────────
  const titleColonMatch = content.match(/^\*\*\s*(.+?):\s*\*\*\s*(.*)/);
  if (titleColonMatch) {
    const extracted = titleColonMatch[1].trim();
    content = titleColonMatch[2].trim();

    // If the title itself is a VitePress type, remap the container type
    if (VITEPRESS_TYPES.has(extracted.toLowerCase())) {
      type = extracted.toLowerCase();
      title = extracted; // preserve original casing
    } else {
      title = extracted;
    }
    return { type, title, content };
  }

  // ── Pattern 2: ** bold content **  (no colon → content only) ──────────
  const boldWrapMatch = content.match(/^\*\*\s*(.*?)\s*\*\*\s*$/);
  if (boldWrapMatch) {
    content = boldWrapMatch[1].trim();
    return { type, title, content };
  }

  // ── Pattern 3: "Quoted Title" rest  (MkDocs style) ───────────────────
  const quotedTitleMatch = content.match(/^"(.+?)"\s*(.*)/);
  if (quotedTitleMatch) {
    title = quotedTitleMatch[1];
    content = quotedTitleMatch[2].trim();
    return { type, title, content };
  }

  // ── Fallback: plain inline content ────────────────────────────────────
  return { type, title, content };
}

// ---------------------------------------------------------------------------
// Core conversion
// ---------------------------------------------------------------------------

/**
 * Fix headings that are missing the required space after '#' markers.
 * e.g. "###Foo" → "### Foo"
 */
function fixHeadingSpacing(markdown) {
  return markdown.replace(/^(#{1,6})([^ #\n])/gm, "$1 $2");
}

/**
 * Convert all !!! / ??? admonitions in `markdown` to VitePress ::: containers.
 */
function convertAdmonitions(markdown) {
  markdown = fixHeadingSpacing(markdown);
  const lines = markdown.split("\n");
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Match  !!! type  or  ??? type  (with optional leading whitespace)
    const admMatch = line.match(/^(\s*)([!?]{3})\s+(\w+)\s*(.*)/);

    if (!admMatch) {
      result.push(line);
      i++;
      continue;
    }

    const [, indent, markers, rawType, rawContent] = admMatch;
    const isCollapsible = markers === "???";

    let { type, title, content } = parseAdmonition(rawType, rawContent);

    // ??? always maps to the details container
    if (isCollapsible) {
      type = "details";
    }

    // Emit opening fence
    const titlePart = title ? ` ${title}` : "";
    result.push(`${indent}::: ${type}${titlePart}`);

    // Emit inline content (if any)
    if (content) {
      result.push(`${indent}${content}`);
    }

    i++;

    // ── Collect MkDocs-style indented continuation lines ────────────────
    const baseIndentLen = indent.length;

    while (i < lines.length) {
      const nextLine = lines[i];

      // Blank line – include if followed by more indented content
      if (nextLine.trim() === "") {
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === "") j++;
        if (
          j < lines.length &&
          lines[j].match(/^(\s*)/)[1].length > baseIndentLen
        ) {
          result.push(nextLine);
          i++;
          continue;
        }
        break;
      }

      const nextIndentLen = nextLine.match(/^(\s*)/)[1].length;

      // Content indented deeper than the !!! line → continuation
      if (nextIndentLen > baseIndentLen) {
        // Strip the admonition-level indentation (typically 4 spaces)
        const stripped = nextLine.slice(
          Math.min(baseIndentLen + 4, nextLine.length)
        );
        result.push(`${indent}${stripped}`);
        i++;
      } else {
        break;
      }
    }

    // Emit closing fence
    result.push(`${indent}:::`);
  }

  return result.join("\n");
}

// ---------------------------------------------------------------------------
// Rentry.co fetching
// ---------------------------------------------------------------------------

/** Known HTML entities that rentry encodes in the textarea */
const HTML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
  "&#x2F;": "/",
  "&apos;": "'",
  "&nbsp;": " ",
};

const ENTITY_RE = new RegExp(Object.keys(HTML_ENTITIES).join("|"), "g");

/**
 * Decode HTML entities found in rentry's textarea content back to raw chars.
 */
function decodeHTMLEntities(str) {
  // Named / numeric entities rentry uses
  let result = str.replace(ENTITY_RE, (match) => HTML_ENTITIES[match]);
  // Catch any remaining numeric entities (&#123; or &#x1a;)
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  result = result.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );
  return result;
}

/**
 * Check if a string looks like a rentry.co URL or shorthand.
 * Accepts:  https://rentry.co/slug  |  rentry.co/slug  |  rentry.org/slug
 */
function isRentryUrl(str) {
  return /^(https?:\/\/)?(www\.)?rentry\.(co|org)\/[a-zA-Z0-9_-]+\/?$/i.test(
    str
  );
}

/**
 * Normalise any rentry reference to a full edit-page URL.
 *   "rentry.co/mariko"  →  "https://rentry.co/mariko/edit"
 */
function toRentryEditUrl(str) {
  let url = str.trim().replace(/\/+$/, "");
  // Strip trailing /edit or /raw if someone passed it
  url = url.replace(/\/(edit|raw)$/i, "");
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return url + "/edit";
}

/**
 * Fetch a URL, following up to `maxRedirects` redirects.
 * Returns a Promise<string> of the response body.
 */
function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects < 0) return reject(new Error("Too many redirects"));

    const transport = url.startsWith("https") ? https : http;

    transport
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        // Follow redirects
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          const next = new URL(res.headers.location, url).href;
          return resolve(fetchUrl(next, maxRedirects - 1));
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(
            new Error(`HTTP ${res.statusCode} fetching ${url}`)
          );
        }

        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

/**
 * Fetch markdown from a rentry.co page by scraping its /edit textarea.
 * Returns a Promise<string> with the raw markdown.
 */
async function fetchRentryMarkdown(input) {
  const editUrl = toRentryEditUrl(input);
  console.error(`Fetching: ${editUrl}`);

  const html = await fetchUrl(editUrl);

  // Extract content from <textarea ... id="id_text" ...>CONTENT</textarea>
  // The textarea may have attributes in any order, so we match generously.
  const textareaMatch = html.match(
    /<textarea[^>]*\bid="id_text"[^>]*>([\s\S]*?)<\/textarea>/i
  );

  if (!textareaMatch) {
    throw new Error(
      "Could not find the markdown textarea on the rentry edit page.\n" +
      "The page may require authentication or the URL may be invalid."
    );
  }

  const raw = textareaMatch[1];
  return decodeHTMLEntities(raw);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printUsage() {
  console.log(`
Usage:
  node convert-to-vitepress.js <input> [output.md]
  node convert-to-vitepress.js <input> --in-place
  cat input.md | node convert-to-vitepress.js > output.md

<input> can be:
  - A local markdown file path       (e.g. README.md)
  - A rentry.co URL                  (e.g. https://rentry.co/mariko)
  - A rentry shorthand               (e.g. rentry.co/mariko)

Options:
  --in-place, -i    Overwrite the input file (local files only)
  --help, -h        Show this help message

Examples:
  # Fetch from rentry and write to docs/
  node scripts/convert-to-vitepress.js rentry.co/mariko docs/mariko.md

  # Fetch from rentry and print to stdout
  node scripts/convert-to-vitepress.js https://rentry.co/mariko

  # Convert a local file and print to stdout
  node scripts/convert-to-vitepress.js README.md

  # Convert a local file in place
  node scripts/convert-to-vitepress.js README.md --in-place
`.trim());
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const inPlace = args.includes("--in-place") || args.includes("-i");
  const positional = args.filter((a) => !a.startsWith("-"));

  // ── No arguments → read from stdin ────────────────────────────────────
  if (positional.length === 0) {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => {
      process.stdout.write(convertAdmonitions(input));
    });
    return;
  }

  const source = positional[0];
  let markdown;

  // ── Rentry URL → fetch from edit page ─────────────────────────────────
  if (isRentryUrl(source)) {
    try {
      markdown = await fetchRentryMarkdown(source);
      console.error(`Fetched ${markdown.length} chars of markdown.`);
    } catch (err) {
      console.error(`Error fetching from rentry: ${err.message}`);
      process.exit(1);
    }
  } else {
    // ── Local file ──────────────────────────────────────────────────────
    const inputPath = path.resolve(source);

    if (!fs.existsSync(inputPath)) {
      console.error(`Error: File not found: ${inputPath}`);
      process.exit(1);
    }

    markdown = fs.readFileSync(inputPath, "utf8");
  }

  const converted = convertAdmonitions(markdown);

  // ── Write output ──────────────────────────────────────────────────────
  if (inPlace) {
    if (isRentryUrl(source)) {
      console.error("Error: --in-place cannot be used with a URL source.");
      process.exit(1);
    }
    const inputPath = path.resolve(source);
    fs.writeFileSync(inputPath, converted, "utf8");
    console.log(`Converted in place: ${inputPath}`);
  } else if (positional[1]) {
    const outputPath = path.resolve(positional[1]);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, converted, "utf8");
    console.log(`Converted: ${source} → ${outputPath}`);
  } else {
    process.stdout.write(converted);
  }
}

main();
