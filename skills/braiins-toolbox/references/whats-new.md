# What's new

## 25.10

Braiins Toolbox Release 25.10 brings expanded temperature configuration options, detailed hardware information, and more.

### CLI

- Feature Temperature Control for BOS: Toolbox now supports comprehensive temperature management via CLI mode, allowing configuration of cooling mode, temperature settings, and fan settings.

### GUI

- Feature Temperature Attributes in Device List (BOS): The GUI now displays BOS temperature-related information, including cooling mode, temperature, and fan attributes for each device.
- Feature Hardware Attributes in Device List (BOS): Toolbox now shows additional hardware details such as Control Board (CB), Hash Board (HB), and Power Supply Unit (PSU) attributes directly in the Device List.

### CLI & GUI

- Feature Whatsminer API V3 (Beta): Toolbox adds beta support for the new Whatsminer API V3, expanding compatibility with the latest miner firmware.
- Fix Optimized Miner Detection: Enhanced miner discovery for faster and more accurate detection across mixed environments.
- Fix General Bug Fixes and Optimizations: Various stability and performance improvements across both CLI and GUI.
- Info Firmware Restore Scope Update: The command for restoring stock firmware now supports uninstallation of Braiins OS only.

## 25.03.2

Braiins Toolbox 25.03.2 is a bugfix release that includes optimized logic for upgrading to Braiins OS, helping to minimize “No space left on device” errors.

## 25.03.1

Braiins Toolbox 25.03.1 is a bugfix release improving compatibility with Antminer stock firmware and Iceriver miners.

### CLI & GUI

- Fix Antminer Stock Firmware Compatibility Fix: Resolved an issue that prevented reading and configuring pool settings on Antminers running stock firmware versions from 2025 and newer.
- Fix Iceriver Attribute Reading Fix: Fixed incorrect or missing readings of several device attributes reported by Iceriver miners.

## 25.03

Braiins Toolbox Release 25.03 introduces support for Avalon miners, a new DPS mode option, and more.

### CLI & GUI

- Feature Avalon Miner Detection and Control (Beta): Toolbox now  offers beta support Avalon miners. In addition, you can manage these devices with actions such as pause, resume, reboot, and change pool settings.
- Feature Support for DPS Boost Mode: Toolbox now supports the new DPS boost mode introduced in Braiins OS version 25.01. Learn more about this power mode enhancement in the Braiins OS release notes for 25.01.
- Feature Extended Pool Username Variables: The pool username variables now include {{miner.ip_x}}, representing the miner’s IP address with a custom “x” separator instead of a dot.
- Fix BOS Upgrade Disk Space Issue: Resolved an issue where BOS upgrades could fail due to insufficient disk space on miners.

```
{{miner.ip_x}}
```

### GUI

- Feature Enhanced CSV Export: The CSV export functionality now respects filtering, sorting, column visibility, and order. Note: Only static data can be exported.
- Fix GUI Target Column Sorting: Fixed the incorrect sorting of the Target column.

## 24.12.1

Braiins Toolbox Release 24.12.1 is a bugfix release that addresses issues with sorting and custom password removal.

### GUI

- Fix User can now remove custom password via GUI
- Fix Fix a bug in sorting by pools configuration

### CLI

- Fix Fix a wording while using --all-devices flag during scan

```
--all-devices
```

## 24.12

Braiins Toolbox Release 24.12 introduces new features and improvements.

### CLI & GUI

- Feature Users can now view all discovered devices, including unrecognized and password-protected ones, providing a comprehensive overview for improved farm management
- Feature Added basic support for Iceriver miners, including detection, pause/resume mining, pool configuration, and reboot functionality
- Fix Resolved an issue where the immersion configuration was not functioning correctly during advanced installation
- Fix Optimized Braiins OS upgrades to prevent failures caused by full disk space on the miner

### GUI

- Feature Users can now control Toolbox entirely via keyboard shortcuts, enabling miner selection, quick access to all actions and configurations, and simplified navigation without the need for a mouse or touchpad
- Fix Braiins OS updates now correctly display the list of supported platforms for each release in the “Braiins OS Updates” tab

## 24.09

Braiins Toolbox Release 24.09 introduces new features and improvements.

### CLI & GUI

- Feature Hashrate target tuner mode is now fully supported, allowing for batch hashrate target setting on Braiins OS devices, during Braiins OS installation, and Dynamic Power Scaling (DPS) configuration

### GUI

- Feature New data fields such as sticker hashrate, power target and license name added to the device list. Sorting and filtering options expanded
- Feature View the latest Braiins OS versions directly in the new “Braiins OS Updates” tab
- Feature Added link to Braiins Toolbox Academy documentation

## 24.07.1

Braiins Toolbox Release 24.07.1 is a bugfix release that addresses issues with upgrading Braiins OS on the Braiins Control Board BCB100.

## 24.07

Braiins Toolbox Release 24.07 introduces new features and improvements.

### CLI & GUI

- Feature IP ranges can now be defined using CIDR notation

### GUI

- Fix Significant performance improvements have been made to support large mining sites
- Fix Fixed the issue of an empty device list appearing after running for a long time

### CLI

- Feature Hashrate target can now be configured in batch on Braiins OS devices
- Feature Hashrate target and DPS can now be configured in batch during Braiins OS installation
- Fix Fixed the issue where the confirmation prompt message was not being bypassed in CLI commands

## 24.06

Braiins Toolbox Release 24.06 introduces new features and improvements.

### CLI & GUI

- Fix Fixed configuration issue for pools when no pool group is defined

### GUI

- Feature IP ranges for the scanner can now be uploaded as a list of IP addresses in a CSV file
- Feature Continuous refresh of the Device List can now be disabled by the user
- Feature Performance filter for the Device List now includes an N/A option
- Fix Corrected active Device List filters when Toolbox is restarted
- Fix Resolved automatic booting of Braiins OS on Cvitek control boards after device reboot
- Fix Fixed misleading 0 0 0 0 fan RPM display for hydro machines

```
N/A
```

```
0 0 0 0
```

## 24.05

This update introduces new features and improvements for better device management and system performance.

### CLI & GUI

- Feature Users can now discover devices with LuxOS firmware and restore them to stock firmware using both CLI and GUI

### CLI

- Fix The system collect-data command no longer generates invalid empty .tar.gz files

```
system collect-data
```

```
.tar.gz
```

### GUI

- Feature Specifying multiple labels in the device list filters will now find all devices matching at least one label, instead of requiring all labels to match
- Fix Fixed slow configuration saving for multiple IP ranges
- Fix Enhanced performance during compatibility checks before installing Braiins OS
- Fix Improved the Pool URLs column design on the device list to enhance readability

## 24.04

Braiins Toolbox Release 24.04 introduces new features for both GUI and CLI, along with several improvements to enhance system stability and performance.

### CLI & GUI

- Feature Custom Contract Codes - Users can now easily apply their custom contract codes both during and after the installation of Braiins OS in GUI and CLI
- Feature Public IP Filtering - Automatically exclude all public IPs from defined ranges to enhance security and scanning speed

To apply a custom contract code when installing Braiins OS or applying it post-installation, the previous method of adding it to the suffix of the Braiins Toolbox name has been decommissioned. Users must now enter the custom contract code directly in the GUI during installation of Braiins OS or by using the new “Apply Contract Key” command. In the CLI, users can apply the contract code as described here.

### CLI

- Feature Bypass Confirmation Dialog - New -y or --yes flag allows users to bypass confirmation dialogs, facilitating smoother operations for scripting

```
-y
```

```
--yes
```

### GUI

- Feature Enhanced Installation - Configure Braiins OS during the initial setup to start mining immediately. This includes selecting the specific release, applying custom contract codes, configuring the pool, and adjusting power and cooling settings
- Feature Disabling IP Ranges - Temporarily disable specific IP ranges without deleting them

## 24.03

Braiins Toolbox 24.03 introduces several enhancements, including an expanded device list, improved pool settings, installation of the Braiins OS target version, and support for the Antminer S21 series. Additionally, it offers network configuration capabilities for the miners, along with various performance and stability improvements.

### CLI & GUI

- Feature Support for Antminer S21, including detection and Braiins OS installation
- Feature Installation of the target version of Braiins OS to provide enhanced control over the installation process
- Feature Pool presets allow for defining desired pools and using them during installation and pool configuration

### CLI

- Feature Configuration of dynamic or static network settings on the selected miners in batch

### GUI

- Feature Extensive device list with details like current hashrate, uptime, and maximum temperature, alongside enhanced full-text search and filtering features

## 24.02

New Braiins Toolbox release featuring automatic device list update, support for Whatsminer devices, workername templating in the GUI, tuner profile removal in GUI, Braiins OS installation eligibility checks and more.

### CLI & GUI

- Feature Support of the Whatsminers on a stock firmware (pause, resume, pool configuration, reboot, locate device)
- Feature Hardware compatibility checks before initiating Braiins OS installation to prevent installation on unsupported hardware

### CLI

- Feature Set power limit for Whatsminers on stock firmware

### GUI

- Feature Automatic refresh of the device list to ensure it stays up-to-date
- Feature Empower toolbox GUI users with the ability to incorporate username variables when configuring pool usernames
- Feature Efficiently clean tuned profiles for miners operating on Braiins OS via Toolbox GUI

## 23.12

New Braiins Toolbox with enhanced support for remote installation on new Antminer control boards, advanced installation features, and more.

### CLI & GUI

- Feature Remote installation of Braiins OS on miners with Cvitek (CV1835) or Zynq control boards
- Fix Addressed the issue of DPS configuration failures occurring when immersion mode is enabled
- Fix Resolved the issue with detecting miners operating on Braiins OS 23.03

### CLI

- Feature Simplified configuration process for miners during remote installation of Braiins OS with a streamlined one-step multiconfiguration
- Feature MAC address (miner.mac) username variable in pool configuration settings
- Fix Restored proper CLI character display for the Windows build

```
miner.mac
```

### GUI

- Fix Mitigated various GUI issues

## 23.11

New Braiins Toolbox release 23.11 packed with enhanced features, improved support for Bitmain Stock FW, new CLI capabilities, and various refinements.

### CLI & GUI

- Feature Configure pools for miners with Bitmain stock FW
- Feature Adjust power modes for miners with Bitmain stock FW
- Feature Reboot miners with Bitmain stock FW effortlessly
- Feature Easily locate miners running Bitmain stock FW
- Fix Implemented several graphical enhancements on both CLI and GUI interfaces

### CLI

- Feature Empower toolbox CLI users with the ability to incorporate username variables when configuring pool usernames
- Feature Efficiently clean tuned profiles for miners operating on Braiins OS

### GUI

- Fix Resolved an issue with incorrect date display in the actions list in the GUI
- Fix Addressed a naming discrepancy for command/script execution stdout files in the GUI

## 23.10.3

Introducing the long-awaited Braiins Toolbox for Windows, featuring graphical fixes in the GUI.

### CLI & GUI

- Feature Braiins Toolbox for Windows

### GUI

- Fix GUI improvements

## 23.10.2

Introducing Braiins Toolbox for macOS, compatible with Monterey 12.4 and newer, and featuring stability improvements.

### CLI & GUI

- Feature Braiins Toolbox for macOS
- Fix Stability improvements

## 23.10.1

Introducing Braiins OS remote installation on newly supported Atnminer models, along with a one bug fix.

### CLI & GUI

- Feature Braiins Toolbox can now batch-install Braiins OS on the following newly supported Antminer models: S19j Pro+, S19k Pro, S19 Pro-A, and S19j Pro-A
- Fix Fixed uninstallation command for improved functionality in specific cases

## 23.10

This release brings exciting new features and enhancements that will make your farm management even more seamless and efficient.

### CLI & GUI

- Feature Braiins Toolbox can be now directly upgraded once a new version is out
- Feature Linux commands execution in batch directly on miners
- Feature Support for pause/resume actions for Bitmain stock firmware (Braiins OS is already supported)
- Feature Full support for the Braiins control board
- Feature Whatsminer detection
- Fix Smoother Braiins OS installation
- Fix Improvement of collected device info, ensuring it is efficiently compressed and encrypted

## 23.08.1

This bug fix release addresses the issue where unsupported Antminer models were incorrectly displayed as Installable in the Toolbox.

```
Installable
```

### CLI & GUI

- Fix Unsupported Antminer models are not displayed as Installable and Braiins OS cannot be installed

```
Installable
```

## 23.08

Introduction of the new miner, system and performance management features.

Toolbox 23.08 uses the newest version of Public API 1.0.0-beta.2 that contains several breaking changes (more info on GitHub).

```
1.0.0-beta.2
```

### CLI & GUI

- Feature Mining pause (Braiins OS)
- Feature Mining resume (Braiins OS)
- Feature Locate the device(s) (Braiins OS)
- Feature Collect device data
- Feature Dynamic performance scaling configuration (Braiins OS)
- Feature Cvitek and BCB100 controlboards detection

```
Cvitek
```

```
BCB100
```

## 23.05.1

Patch release resolving a power target related bug.

### GUI

- Fix Fix issues with the relative change of the power target in the GUI

## 23.05

First version of the long-awaited GUI version. This new interface enhances the user experience and provides a more intuitive way to interact with our powerful command-line tool, while still retaining full functionality from the Linux terminal.

With the new GUI, you can now enjoy the benefits of a visually appealing and user-friendly interface, making it easier than ever to navigate and utilize the extensive capabilities of Braiins Toolbox. The GUI is designed to streamline your workflow and simplify complex operations, ensuring a seamless experience from start to finish.

### GUI

- Feature Network scan
- Feature Braiins OS installation
- Feature Braiins OS uninstallation
- Feature Braiins OS upgrade
- Feature Reboot of the system (Braiins OS)
- Feature Power target configuration (Braiins OS)
- Feature Pool settings configuration (Braiins OS)
- Feature Miner actions: start/stop/restart (Braiins OS)
- Feature Cooling mode configuration (Braiins OS)

## 23.04.1

Patch release bringing small changes and bug fixes.

### CLI

- Info Argument --scan-rate became a global argument
- Info Subcommand restore renamed to uninstall
- Info Argument --input renamed to --ip-file
- Fix Braiins OS upgrade over major version(s)

```
--scan-rate
```

```
restore
```

```
uninstall
```

```
--input
```

```
--ip-file
```

## 23.04

Introducing Braiins Toolbox: the groundbreaking software designed exclusively for efficient management of Bitcoin mining farms at scale. This highly anticipated release marks the software’s debut, offering a command-line interface (CLI) and a specialized focus on batch management for Braiins OS firmware. Experience unparalleled control and optimization for your mining operations with Braiins Toolbox.

### CLI

- Feature Network scan
- Feature Braiins OS installation
- Feature Braiins OS uninstallation
- Feature Braiins OS upgrade
- Feature Reboot of the system (Braiins OS)
- Feature Power target configuration (Braiins OS)
- Feature Pool settings configuration (Braiins OS)
- Feature Miner actions: start/stop/restart (Braiins OS)
- Feature Cooling mode configuration (Braiins OS)

- Braiins.com
- Braiins Pool
- Braiins Manager
- Braiins OS
- Toolbox
- Mining Insights
- Farm Proxy

- Product Updates
- Blog
- Braiins Design Language

- Terms & Policies
- Contact

---

**Source**: https://academy.braiins.com/en/braiins-toolbox/whats-new/
**Scraped**: 2025-12-28
