---
title: Getting Started
description: Guide to installing Horizon OC
---

# Getting Started

Getting started is easy, so long as you have a modded Switch with Atmosphere.

**Currently supported Atmosphere version:** `1.11.1`
Please check that your Atmosphere version matches before proceeding, otherwise you will get a black screen.

::: warning IMPORTANT
Whenever you install HOC, we recommend doing it through **Haze MTP**, **Hekate UMS**, or any **FTP server**. Do not remove the SD card from the slot, as frequent removal can harm the reader.
:::

1. Download latest dist.zip at **[Horizon-OC GitHub](https://github.com/Horizon-OC/Horizon-OC/releases/)**.
2. Alternatively, we also have nightly builds available through **[GitHub actions](https://github.com/Horizon-OC/Horizon-OC/actions/workflows/build.yml)**. We also plan to add nightly.link support in the future. However, those builds haven't been tested and are unsupported, so use them only if you have a specific reason.
3. Once you've downloaded it, the extracted contents are drag-n-drop. You can let it overwrite contents on the SD card if prompted.

::: info NOTE
This will overwrite your current version of `sys-clk`. If you must keep your specific version, copy only `atmosphere/kips/hoc.kip` to the SD card in its respective folder. However, rest assured `hoc-clk` has many more features and is the supported version going forward.
:::

### Configuration

Once the files are moved, open `bootloader/hekate_ipl.ini`. Find the instance you want to run Horizon OC on.

**Example (do not copy and paste this exactly):**
```ini
[Atmosphere EmuNAND]
pkg3=atmosphere/package3
emummcforce=1
icon=bootloader/res/emu_boot.bmp
```

Add the following line to the bottom of your chosen profile:
```ini
kip1=atmosphere/kips/hoc.kip
secmon=atmosphere/exosphere.bin
```

::: tip Safety Instance
You can also make a separate instance to boot without the .kip. In case an unstable overclock config causes instability, you can boot into this "clean" instance to fix your config.

Example:
```ini
[Atmosphere EmuNAND Safe Mode]
pkg3=atmosphere/package3
emummcforce=1
icon=bootloader/res/emu_boot.bmp
```
Note the lack of `kip1`. While `hoc-clk`, the sysmodule, and the overlay will still boot, the overclock configurations will **not** be applied.
:::

### Running the Overlay

You're ready to go! After booting, if it succeeded, you can open your overlay (we highly recommend **Ultrahand**, as it's the only one supported, because hoc-clk builds upon libultrahand) generally by pressing <kbd>ZL</kbd> + <kbd>ZR</kbd> + <kbd>D-Pad Down</kbd>. Then, you will find both Horizon OC and Horizon OC Monitor in the list.

Depending on your Switch model, refer to the specific configuration guide:

*   **Mariko (V2, Lite, OLED):** [Mariko Config Guide](/mariko.md)
*   **Erista (2017-2018 Unpatched/Patched):** [Erista Config Guide](/erista.md)