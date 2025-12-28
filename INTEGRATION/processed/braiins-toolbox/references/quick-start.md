# Quick Start

- GUI
- CLI

## GUI

The Graphical User Interface (GUI) mode of Toolbox offers a user-friendly interface that allows you to efficiently manage your bitcoin mining operations. To launch the application, simply follow the steps below:

### Windows

Double-click the Toolbox icon to open it in your default browser.

### macOS

Double-click the Toolbox icon to open it in your default browser.

### Linux

- Open a terminal or command prompt on your system.
- Navigate to the Braiins Toolbox directory.
- Type the following command and press Enter:

```
$ ./braiins-toolbox
```

This command will open the Toolbox application in your default web browser.

## CLI

In addition to the GUI mode, Braiins Toolbox also provides a Command Line Interface (CLI) version, allowing you to interact with the application using text-based commands. The CLI version can be run from the same binary as the GUI version, providing a unified experience.

To get started with the CLI mode, follow the steps below:

- Open a terminal or command prompt on your system.
- Navigate to the Toolbox installation directory.

Windows and macOS have their own specific commands to be run in CLI mode:

- For Windows, run it as braiins-toolbox.exe --version without the ./ at the beginning.
- For macOS, the CLI app is stored here: /Applications/Braiins\ Toolbox.app/Contents/MacOS/braiins-toolbox

```
braiins-toolbox.exe --version
```

```
./
```

```
/Applications/Braiins\ Toolbox.app/Contents/MacOS/braiins-toolbox
```

This is a quick summary of the most important commands.

### Scan your network

```
$ ./braiins-toolbox scan '10.10.10-11.*'
```

### Firmware commands

```
# Install Braiins OS$ ./braiins-toolbox firmware install '10.10.10-11.*'
# Install Braiins OS with a contract key XYZ$ ./braiins-toolbox firmware install --contract-code 'XYZ' '10.10.10-11.*'
# Uninstall back to the factory firmware$ ./braiins-toolbox firmware uninstall '10.10.10-11.*'
```

### System commands

```
# Reboot devices$ ./braiins-toolbox system reboot '10.10.10-11.*'
# Collect HW data and logs from Antminers S19 with Braiins OS or Bitmain factory firmware$ ./braiins-toolbox system collect-data '10.10.10-11.*'
# Locate device$ ./braiins-toolbox system locate-device on '10.10.10.1'
```

### Miner commands:

```
# Set Pool URLs$ ./braiins-toolbox miner set-pool-urls --url 'stratum+tcp://user@stratum.braiins.com:3333' '10.10.10-11.*'
# Start mining$ ./braiins-toolbox miner start '10.10.10-11.*'
# Stop mining$ ./braiins-toolbox miner stop '10.10.10-11.*'
```

### Tuner commands

```
# Set power target to 3318 Watts$ ./braiins-toolbox tuner target --power 3318 '10.10.10-11.*'
# Add 20 TH/s$ ./braiins-toolbox tuner target --hashrate iii '10.10.10-11.*'
# Set DPS ON$ ./braiins-toolbox tuner set-dps on '10.10.10-11.*'
```

### Cooling commands

```
# Set cooling mode to auto on Braiins OS devices$ ./braiins-toolbox cooling set --mode auto '10.10.10.10'
# Set hot temperature to 75°C on Braiins OS devices$ ./braiins-toolbox cooling set --hot-temp 75 '10.10.10.10'
# Require at least 4 fans to be operational and set auto cooling mode on Braiins OS devices$ ./braiins-toolbox cooling set --mode auto --min-required-fans 4 '10.10.10.10'
```

### Custom Contract commands

```
# Apply contract key XYZ on Braiins OS devices$ ./braiins-toolbox custom-contract apply --contract-code 'XYZ' '10.10.10-11.*'
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/overview/
**Scraped**: 2025-12-28
