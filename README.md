# Horizon OC Wiki

The main [VitePress](https://vitepress.dev/) 2.0.0 website wiki for the Horizon OC project.

## Project structure

- `docs/` - Contains the markdown documentation and public assets.
- `scripts/convert.js` - Only script, copies https://rentry.co/mariko or erista markdown guides.

### Installation

Install [Node.JS](https://nodejs.org/en) (CI builds with 26.1.0)

Clone the repository and install dependencies:

```shell
git clone https://github.com/Horizon-OC/horizon-oc.github.io
cd horizon-oc.github.io
npm install
```

### Local dev

To start the dev web server:

```shell
npm run dev
```

The website should be running on <http://localhost:5173/>.

### Building for prod

To build the static site:

```shell
npm run build
```

The output will be generated in `docs/.vitepress/dist`.

## Contributing

Contributions are welcome, beware that mariko.md and erista.md are mostly automated to match the rentry guides.

## License

This project is licensed under [Creative Commons Attribution 4.0 International](LICENSE).