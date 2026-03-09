# Mariko OC Guide

*Made with love by Dominatorul. Some parts of this guide belong to ChanseyIsTheBest, Lightos_ and Souldbminer*

---

## Table of Contents
- [Safety Disclaimer](#safety-disclaimer)
- [Mariko Limits](#mariko-limits)
- [Monitoring Your Switch](#monitoring-your-switch)
- [Checking Speedo and RAM Type](#checking-speedo-and-ram-type)
- [RAM Tiers](#ram-tiers-higher-is-better)
- [OC Settings for Horizon-OC](#oc-settings-for-horizon-oc)
   - [CPU Settings](#cpu-settings)
   - [GPU Settings](#gpu-settings)
   - [RAM Settings](#ram-settings)
- [Clock Settings](#clock-settings)
   - [Mariko Max Safe on Battery](#mariko-max-safe-on-battery-hac-001-01-heg-001)
   - [Switch Lite Max Safe Clocks on Battery](#switch-lite-max-safe-clocks-on-battery-hdh-001)
   - [Mariko Max Clocks Docked and Plugged](#mariko-max-clocks-docked-and-plugged-hac-001-01-heg-001)
   - [Switch Lite Max Clocks Plugged](#switch-lite-max-clocks-plugged-hdh-001)
- [Troubleshooting](#troubleshooting)
- [How to test stability](https://rentry.co/howtoteststability)

---

# Safety Disclaimer
::: info
Overclocking is inherently risky as it pushes the system beyond its original design. The risk level depends on how much you overclock and whether you stay within the limits of the chip and hardware.
:::

::: danger
Unstable RAM overclocking can cause sysNAND/emuNAND corruption and SD card corruption, particularly if done on sysNAND. Test the overclock settings on emuNAND and back up your sysNAND, emuNAND and PRODINFO before installing horizon-oc.
:::

---

# Mariko Limits

### Mariko PMIC Limits
- Mariko uses a **5A CPU / 10A GPU PMIC** for power delivery.  
- Staying within these limits is essential for safe operation.  
  - Exceeding the **PMIC limit** slightly is possible, but not recommended and should be done with caution.

Reducing the voltage (**undervolting, UV**) decreases power draw, current, heat and helps avoid exceeding pmic limit.

### Charger IC Limit:
- 18W limit restricts overclocking for both Erista and Mariko units (12W on Switch Lite). This is the main limiting factor, but the PMIC current limits for CPU and GPU will be reached first.
- Setting a Charge Current Override will NOT bypass this limit

### GPU Scheduling

This setting adjusts how much of your GPU can be utilized:

- **On:** Limits GPU usage to ~96.7%
- **Off:** Limits GPU usage to ~99.7% (up to ~5% performance boost)
- **Recommended:** GPU scheduling **off**.
::: warning Warning
Disabling GPU Scheduling will slightly increase power draw. Use it with caution.
:::

---

# Monitoring Your Switch
- Use the Horizon OC Monitor to indicate if you've bypassed the charger IC limit (e.g., -1W displayed while charging).
- To get the best results, be sure your battery is 10-90% to display the real charging

---

# Checking Speedo and RAM Type

1. Boot Hekate.
2. Go to Console Info > HW & Fuses.
3. Note your DRAM ID, along with your CPU, GPU and SoC Speedo.
   - Speedos typically range from 1450 to 1810. A higher speedo means less voltage is needed for the same clock speed. A speedo of 1650 is generally considered good.

**Speedo Brackets**
>  - Speedos are divided into **brackets**.  
>  - **CPU UV mode** depends on the position within your bracket, but the resulting **voltage** depends on your specific speedo.
>  - It doesn’t matter how high you can set CPU UV mode — what matters is using your **maximum possible** CPU UV mode.

---

#  RAM Tiers (Higher is better)

| Tier        | RAM ID           |
|-------------|------------------|
| GOD-tier    | NEI/NEE, WT:B          |
| S-tier      |  AA-MGCR, AA-MGCL           |
| A-tier      |WT:F   |
| B-tier      | AM-MGCJ, WT:E    |
| C-tier      | AB-MGCL     |
| D-tier      | NME     |

---

# OC Settings for Horizon-OC
## General settings

- **Uncapped Clocks:**
  - Removes the clock cappings. Use with caution, especially on handheld mode. Recommended: ON

- **Overwrite Boost Mode:**
  - Allows boost mode to be overwritten with a custom profile. Recommended: OFF

- **Thermal Throttle:**
  - Lowers clocks when a certain temperature threshold is reached (by default 70C/158F). Recommended: ON

- **Handheld TDP:**
  - Lowers clocks when the power being pulled from the battery exceeds a threshold (by default 8600mW on regular consoles, 6400mW on lite). Recommended: ON

- **Enforce Board Limit:**
  - Lowers clocks when the board/charging IC limit is exceeded. Recommended: OFF (this feature still has issues)

- **Charge Current Override:**
  - Allows overriding the charge current. Recommended: Disabled

- **Display Refresh Rate Changing:**
  - Allows changing the display refresh rate via profiles. Recommended: ON (This conflicts with FPSLocker's display refresh rate features, if you intend to use those, keep it OFF)

- **Allow Display Unsafe Frequencies:**
  - Allows changing the display refresh rate to unsafe frequencies. Recommended: OFF

- **CPU Max Display Clock:**
  - Determines the maximum clock you will be able to set manually (without Boost Mode). Recommended to keep at your maximum safe clock. This will NOT affect your CPU Max Clock.

## CPU Settings

- **Boost Clock**
  - Whatever is within **Voltage Limit**.
 > **Note** Exeeding the PMIC Limit in boost mode is *usually* fine as it is only active for short periods of time.

- **UV Table:** 1683Mhz Tbreak
  - If you cannot even do **High Freq UV1**, try **1581Mhz Tbreak**.
    -  Tbreak describes the frequency where the low and high UV modes split.
  - Extreme UV table may provide lower voltages on some units but may cause issues, testing is advised.

- **Low Undervolt Mode:** 1-8 (start with 4).
  - Increase gradually if stable and find your highest stable value.
  - If the console fails to boot, lower the value.

- **High UV:** 5-12 (find your highest stable value).

- **CPU Max Clock:**
  - Sets the maximum allowed clockspeed.

- **Low Freq Vmin:** 590 mV
  - In case you experience issues with low Freq UV, try raising Low Freq Vmin to 610-620mV.
  - Going below 590mV is not recommended as it may mess up the cpu table.

- **High Freq Vmin:** 720–750 mV, 850-870 may be required for high ram clocks

- **Voltage Limit:**
  - **1120 mV:** Safe - recommended
  - **1160-1180 mV:** Use with caution

## GPU Settings

- **Undervolt Table:** HiOPT Table

TODO: auto vmin/gpu ram dvfs is not implemented into hoc-clk currently
- **GPU DVFS:**
  - When RAM is overclocked, the minimum GPU voltage requirement is raised.
  - Auto vmin automatically adjusts your vmin based on your ram clock.
  - When using the base ram clocks (1600 MHz), **GPU DVFS** is not active.
    - **2 (Hijack method):** Recommended - provides the lowest value possible.
    - **1 (Official service method):** Use only if you encounter issues with mode 2.

 - **GPU DVFS Offset:** Auto

- **Vmin:** 550-620+ mV
  - Higher ram clocks need higher GPU vMIN.
  - You can use [this calculator](https://horizon-oc.github.io/Web-vMin-Calculator/) to determine your vMIN for a given RAM frequency.

- **Vmax:** 800 mV

- **Voltage Offset:** 0

## RAM Settings

- **HP Mode** ON
  > **ℹ️ Tip:** HP Mode improves latency by disabling power down, but some RAM modules may not handle it well.
  > - First, find your max RAM clocks and timings with **HP Mode** disabled.
  > - Then test with enabled **HP Mode**. If stable, use it - otherwise disable it.

- **DVB Shift:** 1–10
  - Boosts SoC voltage to help stabilize RAM, especially at high frequencies (2400 MHz+ and 3000Mhz+).
  - It's adviced to start of with a DVB shift of 8-10 and only lower it to 2-6 after finding your max ram speed.
  - Higher DVB shift does not increase power draw, but it is going to increase heat slightly.

### RAM Configuration Based on Tier for Different Base Latency

#### 2133/1866 Base Latency Tier List (Recommended docked)
| Tier | RAM ID              | Ram Clock (MHz)         | VDD2   | VDDQ  | Common Timings      | Super‑Tight (ST) Timings |
|------|---------------------|-------------------------|--------|-------|---------------------|--------------------------|
| GOD  | WT:B                | 3066–3200               | 1175 mV| 600 mV| (4‑4‑5) 4‑2‑6‑5‑6   | (6‑6‑7) 6‑2‑6‑5‑6        |
| GOD  | NEI/NEE             | 3100–3300               | 1175 mV| 640 mV| (3‑3‑3) 1‑5‑5‑4‑6   | (4‑4‑4) 2‑7‑6‑6‑6        |
| S    | AA‑MGCL/MGCR        | 2766–3100               | 1175 mV| 640 mV| (4‑4‑5) 4‑5‑6‑7‑6   | (4‑4‑8) 5‑5‑7‑8‑6        |
| A    | MGCJ                | 2633–2933               | 1175 mV| 640 mV| (3‑2‑4) 1‑4‑4‑4‑6   | (4‑3‑8) 2‑5‑4‑4‑6          |
| B    | WT:F                | 2633–2800               | 1175 mV| 600 mV| (4‑4‑2) 4‑4‑6‑3‑6   | (5‑5‑4) 4‑5‑6‑5‑6        |
| C    | AB‑MGCL             | 2500-2766                  | 1175 mV| 640 mV| (4‑4‑4) 3‑4‑5‑6‑6   | (4‑4‑8) 4‑5‑6‑8‑6        |
| D    | NME                 | 2500–2766               | 1175 mV| 640 mV| (2‑2‑1) 0‑1‑4‑3‑6   | (3‑3‑4) 0‑1‑4‑4‑6        |

> You may use 1866 read/write latency to improve performance although it could require increased voltages

#### 1600 Base Latency Tier List
| Tier | RAM ID              | Ram Clock (MHz) | VDD2   | VDDQ  | Common Timings        | Super Tight (ST) Timings |
|------|---------------------|-----------------|--------|-------|-----------------------|--------------------------|
| GOD  | NEI/NEE/x267        | 2500–2933       | 1175 mV| 640 mV| (3‑3‑3) 1‑5‑5‑4‑6     | (4‑4‑4) 2‑7‑6‑5‑6        |
| GOD  | WT:B                | 2466–2600       | 1175 mV| 600 mV| (4‑4‑5) 4‑2‑6‑5‑6     | (6‑6‑7) 6‑2‑6‑5‑6        |
| S    | AA‑MGCL/MGCR        | 2300–2600       | 1175 mV| 640 mV| (4‑4‑5) 4‑5‑6‑7‑6     | (4‑4‑8) 5‑5‑7‑8‑6        |
| A    | WT:F                | 2400–2533       | 1175 mV| 600 mV| (4‑4‑2) 4‑4‑6‑3‑6     | (5‑5‑4) 4‑5‑6‑5‑6        |
| B    | AM‑MGCJ             | 2300–2466       | 1175 mV| 640 mV| (3‑2‑4) 1‑4‑4‑4‑6     | (4‑3‑8) 1‑5‑4‑4‑6        |
| B    | WT:E                | 2300–2466       | 1175 mV| 600 mV| (2‑2‑2) 1‑4‑4‑4‑6     | (3‑5‑3) 2‑5‑4‑5‑6        |
| C    | AB‑MGCL             | 2133–2500       | 1175 mV| 640 mV| (4‑4‑4) 3‑4‑5‑6‑6     | (4‑4‑8) 4‑5‑6‑8‑6        |
| D    | NME                 | 2133–2333       | 1175 mV| 640 mV| (2‑2‑1) 0‑1‑4‑3‑6     | (3‑3‑4) 0‑1‑4‑4‑6        |

::: tip Note
1333tWRL achieves better performance but tops out at a lower frequency (often 300-500MHz less compared to 1600tWRL), recommended to test for handheld.
:::

::: tip Note
2533MHz is known to cause issues due to timing changes, and thus may need looser timings compared to other frequencies. Test with caution.
:::

::: tip Note
If your RAM clock goes significantly lower than the target, you may be experiencing a "PLL drop" (where the memory controller is unable to handle the high ram frequency). These drops become more frequent at high SoC temperatures, so monitor your RAM clock carefully! The only way to avoid such PLL drops other than keeping your SoC's temperature low is to get a Switch with a higher SoC Speedo, as a higher SoC speedo generally means the PLL can handle more frequency. This phenomenon generally occurs when pushing your RAM above 3000MHz.
:::

# RAM Tuning Notes

> **💡 Extra Headroom:** For tighter timings or base latency reduction, you may use slight overvoltage. Note that too much overvoltage can cause instability.

> **🧪 Testing Method:**
> 1. Start by setting **DVB = 8** using the common preset.
> 2. Test **ST (Super Tight) timings**.
> 3. If ST fails, relax timings one by one in this order: `t8 → t1 → t2 → t3 → t6 → t7 → t4 → t5`.
> 4. For pushing beyond ST, apply the same incremental approach.
> 5. Lower **DVB**
> **⚡ Performance:** ST timings provide enhanced performance over common timings.

> **⚠️ Stability Notes:**
> - Lower **T5** or **T6** if you encounter issues.
> - RAM contributes the most to overall performance - prioritize finding your maximum frequency first.
> - Rarely, some modules may fail even with common timings. If so, lower timings until stable.

# Clock Settings (Safe)

### Mariko Max Safe on Battery [HAC-001(-01), HEG-001]
*Switch units available from August 2019 and beyond, includes OLED & requires modchip*
- **CPU:** 1963 MHz
- **GPU:** 998 MHz
- **RAM:** 2133 MHz - 2500+ MHz (use whatever is stable; 2400 MHz recommended for best battery life-to-performance ratio)
 ::: warning Note
 Drawing over 8.6W on battery will cause battery issues. Please avoid doing that for extended periods!
 :::

### Switch Lite Max Safe Clocks on Battery [HDH-001]
- **CPU:** 1785 MHz
- **GPU:** 921 MHz
- **RAM:** 2133 MHz - 2500+ MHz (use whatever is stable; 2400 MHz recommended for best battery life-to-performance ratio)
 ::: warning Note
 Drawing over 6.5W on battery will cause battery issues. Please avoid doing that for extended periods!
 :::

::: tip Note
Switch Lite limits are lower due to the 12W board power limit, but counts as Mariko for all other purposes.
:::

### Mariko Max Clocks Docked and Plugged [HAC-001(-01), HEG-001]
*Switch units available from

 August 2019 and beyond, includes OLED & requires modchip*
- **CPU:** 
  - 2397 MHz: Safe to use.
  - 2499 MHz: May exceed **PMIC limit**, use carefully.
  - 2601 MHz: Exceeds pmic limit on most switches unless the voltage is kept low, around **1070 mV**.
> Determining truly safe voltages is difficult; we are only working with estimates.
> However, no damage has been reported from these recommendations.
- **GPU:**
  - Sched **off**: 1228 MHz (safe with 1228 MHz voltage < 800 mV, otherwise use 1152 MHz)
  -  Sched **on**: 1267 MHz (safe with 1228 MHz voltage < 800 mV)
  - 1228 MHz sched **off** outperforms 1267 MHz sched **on**, so it's recommended.
 - **RAM:**
   - 2133 MHz-3300 MHz+ (whatever is stable)

### Switch Lite Max Clocks Plugged [HDH-001]
- **CPU:**
  - 2397 MHz: Safe to use.
  - 2499 MHz: May exceed **PMIC limit**, use carefully.
  - 2601 MHz: Exceeds pmic limit on most switches unless the voltage is kept low, around **1070 mV**.
    - When running at higher clock speeds, monitor power consumption to ensure it stays below the **12W** limit.
> Determining truly safe voltages is difficult; we are only working with estimates.
> However, no damage has been reported from these recommendations.
- **GPU:**
  - Sched **off**: 1228 MHz (safe with 1228 MHz voltage < 800 mV, otherwise use 1152 MHz)
  -  Sched **on**: 1267 MHz (safe with 1228 MHz voltage < 800 mV)
  - 1228 MHz sched **off** outperforms 1267 MHz sched **on**, so it's recommended.
- **RAM:**
  - 2133 MHz-2800 MHz+ (whatever is stable)

::: tip Note
Switch Lite limits are lower due to the 12W board power limit, but counts as Mariko for all other purposes.
:::

---
## Display Underclocking
- Display Underclocking helps keep framepacing, which makes lower framerates look smoother.
- Ideally, your display refresh rate should be set to your target framerate, or a exact multiple of it in docked mode (45FPS->90Hz, as most TVs don't support refresh rates that aren't multiples of 10).
---

# Troubleshooting

**My Switch won't boot after I have installed Horizon-OC:**

- Your Atmosphere version is likely not up-to-date, update your Atmosphere version.
- CPU UV level is too high, lower it or set it to 0.

**My configs are not being applied:**
- Ensure you reboot your console after changing settings in Horizon-OC.
- Ensure you click the "Save KIP Settings" button on Horizon-OC.

**I can't set my clocks above 1785/921/1600:**
- Your kip is not being loaded, check if it is located in `/atmosphere/kips`
- Your hekate_ipl.ini file is not set up correctly:
   - Validate that your boot entry contains `kip1=atmosphere/kips/hoc.kip`
   - It has to be below `pkg3=atmosphere/package3` (or fss0)

# Need Help with Setup?

### Follow this [guide](https://rentry.co/howtoget60fps) for a step-by-step setup.