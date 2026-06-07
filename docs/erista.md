# Erista OC Guide

*Made with love by Dominatorul. Some parts of this guide belong to ChanseyIsTheBest, Lightos_ and Samybigio.*

---

## Table of Contents
- [Safety Disclaimer](#safety-disclaimer)
- [Erista Limits](#erista-limits)
- [Monitoring Your Switch](#monitoring-your-switch)
- [Checking Speedo and RAM Type](#checking-speedo-and-ram-type)
- [RAM Types](#ram-types)
- [OC Settings for Horizon OC](#oc-settings-for-Horizon-OC)
   - [CPU Settings](#cpu-settings)
   - [GPU Settings](#gpu-settings)
   - [RAM Settings](#ram-settings)
- [Clock Settings](#clock-settings)
   - [Erista Max Plugged](#erista-max-plugged-hac-001-01-heg-001)
   - [Erista Max Safe Clocks on Battery](#erista-max-safe-clocks-on-battery-hdh-001)
- [Troubleshooting & Advice](#troubleshooting)
- [How to test stability](https://rentry.co/howtoteststability)
---

# Safety Disclaimer
::: info
All overclocking is unsafe as you are pushing the system outside of its original design, however the level of risk is dependent on how much you overclock and stay within the limits of the chip and the hardware.
:::

::: danger
Unstable RAM overclocking can cause SYSNAND/EMUNAND corruption and SD card corruption, particularly if done on SYSNAND. Test the overclock settings on EMUNAND and back it up before installing Horizon OC.
:::

---

# Erista Limits

### Charger IC Limit:
- Erista has a 15A PMIC, usually this limit won't be reached during overclocking.
- The main limiting factor for Erista units is the 18W limit.

### Erista CPU Limits:
- The board limit of 18W is reached at 1785 MHz without any UV or 2091 MHz with CPU UV1.

### Erista GPU Limits:
- The board limit of 18W is reached at 921 MHz without GPU UV with moderate speedos.

Reducing the voltage (**undervolting, UV**) decreases power draw, current, heat and helps avoid exceeding the board limit.

### GPU Scheduling:
- **On:** Caps gpu usage at ~96.7%
- **Off:** Caps gpu usage at  ~99.7%
- **Recommended:** GPU scheduling **on**.
::: warning Warning
Disabling GPU Scheduling will slightly increase power draw. Use it with caution.
:::
---

# Monitoring Your Switch
- Use status monitor overlay to indicate if you've bypassed the charger IC limit (e.g., -1W displayed while charging).
- To get the best results, be sure your battery is 10-90% to display the real charging.
- If the battery is above 90%, power drawn from the charger gets reduced.
- A slight negative power draw (roughly -0.1W) is fine if the battery is above 90%.
- A higher negative power draw (~-0.5W) is not safe.
- For accurate results, test with a lower battery.

---

# Checking Speedo and RAM Type

1. Boot Hekate.
2. Go to Console Info > HW & Fuses.
3. Note your DRAM ID, CPU Speedo, GPU Speedo, and SoC Speedo.

CPU/GPU Speedos range from approximately 1980 to 2200, with SoC speedos ranging from approximately 1899 to 2050. An Erista with a higher speedo requires less voltage to meet the same clock speed compared to another Switch with a lower speedo. A CPU/GPU speedo of 2100 is generally considered good.

**Speedo Brackets**
>  - Speedos are divided into **brackets**.
>  - **CPU UV mode** depends on the position within your bracket, but the resulting **voltage** depends on your specific speedo.
>  - It doesn't matter how high you can set CPU UV Mode, but rather the **resulting voltage**, since two consoles with the same UV Mode can have different CPU voltages.

---

# RAM Types

There are various RAM types for Erista, and better types can reach higher clocks, require lower voltages, and support tighter timings at the same clocks compared to worse types. Not only do RAM types matter, but RAM bin matters, meaning that worse RAM types can outperform higher RAM types. Here are some RAM types:

- Samsung MGCH
- Hynix NLE
- Micron WT:C

Almost all Erista units have Samsung MGCH RAM. Hynix NLE and Micron WT:C are rare but can potentially achieve slightly higher clocks, test carefully.

---

# OC Settings for Horizon OC

### CPU Settings

- **CPU Boost Clock:**
  - Recommended: **2091 MHz:**
  - **2295 Mhz** may be used with good binning, but could cause instability.

- **CPU Undervolt Mode:** 1–5 (use the maximum stable value)

- **CPU VMIN:** 800 mV

- **CPU Max Voltage:** 1225 mV

> **ℹ️ Note:** Exceeding the PMIC limit during **Boost Mode** is safe, as it only occurs for short bursts (typically under 30 seconds), preventing long-term hardware stress.

### GPU Settings

- **GPU Undervolt Mode:** HiOpt Table

- **GPU VMIN:** 740–780 mV

- **GPU Voltage Offset:** 0

- **GPU DVFS:**
  - When RAM is overclocked, the minimum GPU voltage requirement is raised.
  - **DVFS** automatically adjusts your vmin based on your ram clock.
  - When using the base ram clocks (1600 MHz), **GPU DVFS** is not active.

 - **GPU DVFS Offset:** 0

> **⚠️ Note:** To safely use a **998 MHz GPU clock**, keep GPU voltage **below 950 mV** (exact value may vary slightly depending on IDDQ and temperature).


## RAM Settings

- **HP Mode**: Disables RAM Power Down

  > **ℹ️ Tip:** **HP Mode** improves latency, but some RAM modules - especially on Erista - may not handle it well.
  > - First, find your maximum RAM clocks and timings with **HP Mode** **off**.
  > - Then test **HP Mode** enabled. If stable, use it. Otherwise, stick with it **disabled**.

- **DVB Shift:** 1-5 (boosts SoC voltage to help stabilize RAM).
  - In most cases, a shift of **2** is sufficient.

 - **Base Latency: (tRWL)**
   - Read Latency: **2133**
   - Write Latency: **2133**
     - A higher base latency allows for a higher frequency at a small latency cost.
     - Find your maximum frequency using **2133** base latency.
     - You may tighten base latency once you find your __maximum__ frequency and tightest timings.
        - Tightening base latency is **only** worth it if you can maintain the same ram frequency.
        - **Write latency** can usually be tightened further than **read latency**.

#### Samsung MGCH RAM

- **RAM Clock:** 1862–2133+ MHz
  - Maximum frequency will vary a lot due to RAM binning.
  - With overvolting, a higher RAM clock may be possible.
  - You can configure up to 3 unique ram frequencies.
::: danger
Due to a bug (possibly in the official sysmodule), setting two configured RAM frequencies within **20 MHz** of each other may cause system crashes. This will **hopefully** be fixed in the future, but for now ensure that each configured frequency differs by **at least 30 MHz** from the others.
:::

- **VDD2:** 1175–1237 mV
  - Rated for **1175 mV** (guaranteed safe).
  - You can overvolt slightly for a frequency / timings boost (1237 mV is allowed in L4T and assumed to be safe).

- **Timings:**
  - **Common:** (4-4-4) 0-1-5-4-6
  - **Super Tight (ST):** (4-5-9) 1-2-6-4-6
  - ST timings provide **enhanced performance** compared to common timings.

> **🧪 Testing Method:**
> 1. Start with **DVB = 2** using common preset.
> 2. Test **ST timings**.
> 3. If ST fails, relax timings incrementally in this order: `t8 → t1 → t2 → t3 → t6 → t7 → t4 → t5`.
> 4. To push beyond ST timings, apply the same incremental approach.

::: tip Note
`t6` and `t7` timings are heavily frequency dependant and may need adjustments.
:::

> **⚡ Performance:** Super Tight timings deliver improved performance compared to common timings.

> **⚠️ Stability Notes:**
> - Relax your timings in the order mentioned before if you encounter issues.
> - RAM contributes the most to overall performance — prioritize maximizing frequency first.

## Fine Tuning (GPU)
This section is optional but recommended as it may lower voltages further.
- **GPU Voltage Offset:**
  - The High UV table by default is very tight but it is slightly loose in some cases.
  - GPU Voltage Offset can be used to tighten it further. 
  - Test with -5, -10, -15 or -20 when using High Uv.
  - Some GPUs might not be able to go below **0** without becoming unstable.
  - With very rare speedo bracket positions, higher UV offsets may work, test carefully.

 - **GPU DVFS Offset:**
   - Auto at first, lower it as much as possible once you find your maximum ram frequency.
   - Test **Auto VMIN Offset** stability at a low frequency (``420 MHz`` for instance), otherwise the GPU voltage may dominate over the **GPU DVFS** voltage.
   - This helps improving battery in handheld mode with high RAM OC.
   - It's possible to add positive offset, but this shouldn't be used unless you have issues.

## Fine Tuning (RAM)

This section is optional, but recommended as it can improve performance.
- **Ram Latency**
  - Allows you to configure read and write latency (tRWL)
    - By default:
       - 1866 tRWL is used up to and including 1866 MHz
       - 2133 tRWL is used above that
   - You can shift where the higher latency profile begins by setting the maximum frequency for 1866 tRWL
   - You can disable specific latency profiles by setting them to `-`
   - Disabling all custom values restores default behavior
::: danger
Read and write latencies are always separate and can be tuned independently.
:::

> **Performance notes:**
> - 1866 tRWL may offer slightly better performance than 2133 max, but only if your RAM can handle it without requiring a frequency reduction
> - The same applies to 1600 and 1333 tRWL profiles
> - 1333 tRWL is often useful for handheld systems, but typically only scales reliably up to ~2133–2400 MHz (heavily dependent on your RAM silicon)
> - Read and write latencies can be tuned separately
> - Write latency can usually be tuned more aggressively (lower) than read latency

# Clock Settings

### Erista [HAC-001] Max Plugged
- **CPU:** 2091 MHz (Use only with decent binning), else use 1785 MHz
	- Very good binning may use **2295 MHz**, but it may be unstable or require high voltage and is not adviced.
- **GPU:** 998 MHz (Use it only with UV2, try to avoid going over 950 mV), 921 MHz (safe, use it with undervolt)
- **RAM:** 1862 MHz-2133 MHz+ (whatever is stable and within 1175 mV VDD2) (HEAVILY DEPENDENT ON RAM TYPE)

### Erista [HAC-001] Max Safe Clocks on Battery
- **CPU:** 1785 MHz
- **GPU:** 460 MHz
- **RAM:** 1862 MHz-2133 MHz+ (whatever is stable and within 1175 mV VDD2) (HEAVILY DEPENDENT ON RAM TYPE)
 - If you have a good ram module that can hit 2208 MHz+, it's recommended to use at most 2188 MHz to safe battery.
 - The SoC cannot handle high frequencies very well and power draw skyrockets past said frequency.
::: warning Note
Drawing over 8.6W on battery will cause battery issues. Please avoid doing that for extended periods!
:::

---

# Stability

For stability testing, follow this [guide](https://rentry.co/howtoteststability/).

# Troubleshooting

**My Switch won't boot into EMUNAND after I have installed HOC:**
- Your atmosphere or HOC version is likely not up-to-date, update your atmosphere or HOC version.
- CPU UV level is too high, lower it or set it to 0.

**My configs are not being applied:**
- Ensure you reboot your console after changing settings in Horizon OC.

**I can't set my clocks above 1785/921/1600:**
- Your kip is not being loaded, check if it is located in `/atmosphere/kips`
- Your hekate_ipl.ini file is not set up correctly:
   - Validate that your boot entry contains `kip1=atmosphere/kips/*`
   - It has to be below `pkg3=atmosphere/package3` (or fss0)

# Need Help with Setup?

### Follow this [guide](https://rentry.co/howtoget60fps) for a step-by-step setup.