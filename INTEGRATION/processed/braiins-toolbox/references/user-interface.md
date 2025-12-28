# User Interface

- GUI
- CLI

## GUI

The GUI of Braiins Toolbox offers a user-friendly interface, composed of three segments represented by tabs. Let’s explore the layout and structure of these tabs:

- Device List: This tab displays the list of detected bitcoin mining devices on your network. It provides an overview of device information and mining status.
- Device Management: Upon opening the app, you are directed to this tab. Here, you can define the network to be scanned for devices, allowing you to specify the range or specific IP addresses.
- Pool Presets: Define pool configurations for your mining pools and save them as presets. Quickly apply these presets when configuring pools on your miners for added efficiency.
- Braiins OS Updates: Access the latest Braiins OS firmware versions along with a “What’s New” section to easily track changes and updates in the most recent Braiins OS releases.
- Logs: This tab allows you to access and review logs related to user’s actions, including action logs and system logs.
- Shortcuts: Use the shortcut cheat sheet to control your Toolbox entirely with keyboard shortcuts, eliminating the need for a mouse or touchpad.
- Manual: Redirect to the Braiins Toolbox Manual in Braiins Academy for detailed guidance and resources.

By navigating between these tabs, you can efficiently manage your mining devices, configure settings, and access important information.

### Device List

The Device List tab displays all detected miners, shown page by page with pagination support. Users can customize which data columns are visible, change their order, and sort or filter the list based on available attributes.

There are two types of data displayed:

#### Static Data

Static data includes miner attributes that remain consistent unless changed manually or through user-triggered actions. This data is available for all scanned miners and is included in both filtering options and CSV exports. Common static data includes:

- Miner model and firmware version
- MAC and IP addresses
- Pool configurations
- Control board and PSU details

#### Live Data

Live data consists of continuously changing metrics, typically related to real-time performance and environment. These values are refreshed at intervals, which depend on the number of miners shown and network conditions. To optimize performance, Toolbox fetches live data only for miners visible on the current device list page. Live data is therefore:

- Not filterable
- Not included in CSV exports

Examples of live data:

- Hashrate
- Power consumption
- Temperature
- Fan speed

Live data columns are marked with a special icon in the device list menu to distinguish them visually.

### Shortcuts

Toolbox now offers the ability to control everything via keyboard shortcuts, making it faster and easier to manage your mining fleet. Whether you’re opening the Command Palette to navigate and confirm actions or using shortcuts on the Device List, these options allow seamless miner selection, quick access to actions and configurations, and effortless navigation — all without a mouse or touchpad.

With these shortcuts, you can:

- Access the Command Palette (Ctrl + P / ⌘ + P) to effortlessly navigate Toolbox tabs, explore Batch Actions, and confirm selections to apply changes seamlessly.
- Utilize shortcuts in the Device List to quickly search, select, and manage devices.

```
Ctrl + P
```

```
⌘ + P
```

Check out the GIF below to see it in action!

- Command Palette Shortcuts
- Device List Shortcuts

```
⌘ + P
```

```
Ctrl + P
```

```
Tab
```

```
Shift + Tab
```

```
Tab
```

```
Shift + Tab
```

```
↑
```

```
↓
```

```
↑
```

```
↓
```

```
⏎
```

```
Enter
```

```
Esc
```

```
Esc
```

```
⌘ + F
```

```
Ctrl + F
```

```
⌘ + A
```

```
Ctrl + A
```

```
⌘ + ←
```

```
⌘ + →
```

```
Ctrl + ←
```

```
Ctrl + →
```

## CLI

The CLI consists of 8 commands:

- scan
- firmware
- system
- miner
- tuner
- cooling
- custom-contract
- self

```
scan
```

```
firmware
```

```
system
```

```
miner
```

```
tuner
```

```
cooling
```

```
custom-contract
```

```
self
```

The commands consist of other related subcommands (except for the scan command, which is standalone).

```
scan
```

Users can use the command below to see a list of options and commands that are possible in Braiins Toolbox.

```
$ ./braiins-toolbox --help
Usage: braiins-toolbox [OPTIONS] [COMMAND]
Commands:  scan             Scan the provided IP addresses or ranges and print all discovered miners to stdout  firmware         Firmware-related commands - install, uninstall, upgrade, ...  system           System-related commands - data collection, reboot, exec, ...  miner            Miner-related commands - pool urls, start, stop, restart, ...
```

## Global Options

Users can apply the following global options to any batched operations:

- --gui-listen-address for setting the address to listen on the Braiins Toolbox. Default is 127.0.0.1:8888.
- --gui-config-path servers for defining the path for the configuration of GUI. Default config file is stored in .config/braiins-toolbox/config.toml.
- --pool-presets-file-path represents the path to the file with pool presets.
- --password, which is used if the default web password of the miner(s) is changed to the custom password.
- --timeout, which is a timeout for network operations with a default value of 8 seconds.
- --scan-rate is an option, which controls the number of scanned IP addresses per second. Default is 2000.
- --logfile-path for setting the path for the Toolbox log file.
- --max-log-size defines the maximum size of all rolling Toolbox log files combined, default is 1GB.
- --help, which displays the list of possible options and commands.
- --version, which displays the Toolbox version.

```
--gui-listen-address
```

```
127.0.0.1:8888
```

```
--gui-config-path
```

```
.config/braiins-toolbox/config.toml
```

```
--pool-presets-file-path
```

```
--password
```

```
--timeout
```

```
--scan-rate
```

```
--logfile-path
```

```
--max-log-size
```

```
--help
```

```
--version
```

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

**Source**: https://academy.braiins.com/en/braiins-toolbox/running/
**Scraped**: 2025-12-28
