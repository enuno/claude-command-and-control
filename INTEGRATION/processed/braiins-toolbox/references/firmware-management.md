# Firmware Management

- GUI
- CLI

## GUI

Firmware management capabilities allow user to perform essential actions such as:

- install Braiins OS
- uninstall Braiins OS
- upgrade Braiins OS

All these actions are related to the mining firmware. Braiins OS installation is shown in the video below.

Before initiating the Braiins OS installation, hardware compatibility checks are performed to prevent installation on unsupported hardware.

## CLI

The equivalent to the firmware management capabilities in CLI is a firmware command, which consists of 3 firmware-related subcommands:

```
firmware
```

- install
- restore
- upgrade

In Toolbox version 24.04, a new command, custom-contract, was introduced. Although it stands separately next to the firmware command, both are related to Braiins OS firmware.

```
custom-contract
```

```
firmware
```

- custom-contract

### Install

The install subcommand serves as a command for batch Braiins OS installation. The format for this command is:

```
install
```

```
$ ./braiins-toolbox firmware install [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that firmware install command is used tells the Toolbox that it should run installation(s)
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and installation
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
[OPTIONS]
```

```
[IP_LIST]
```

```
<O1>.<O2>.<O3>.<O4>
```

```
<Oi>
```

```
0
```

```
255
```

```
range
```

```
*
```

```
[IP_LIST]
```

```
--ip-file <FILE>
```

#### Options

Available options are the global one, see here, as well as the installation-specific options:

- --concurrency is an option, which controls the maximum number of parallel installations
- --url: an option for setting pool URLs on selected miners during Braiins OS installation
- --url-file: an option for defining a path to a file containing a list of pool URLs, one per line
- --dps: an option to enable Dynamic Power Scaling (DPS) on selected miners during Braiins OS installation
- --power-step: an optional DPS related value representing a power step for the upscale/downscale of power consumption
- --min-power-target: an optional value representing nominal power consumption, at which the DPS stops downscaling
- --hashrate-step: an optional DPS related value representing a hashrate step for the upscale/downscale of power consumption
- --min-hashrate-target: an optional value representing nominal hashrate value in TH/s, at which the DPS stops downscaling
- --shutdown-enabled: an optional DPS related boolean value, which manages if the miner should be temporarily turned off in case the minimal power target is reached (true), or not (false)
- --shutdown-duration: an optional DPS related integer value related to the --shutdown-enabled, which represents the time (in hours) for which the miner should turn off when the minimal power target is reached and --shutdown-enabled is set to be true
- --cooling-mode: an option for setting cooling mode on selected miners during Braiins OS installation
- --power: an option for defining a power target on selected miners during Braiins OS installation
- --hashrate: an option for defining a hashrate target on selected miners during Braiins OS installation
- --target-version. If the user doesn’t use this option, the latest Braiins OS version is automatically used. Nevertheless, users can use this option to install the specified Braiins OS version. The version is defined by versioning nomenclature YY.MM.patchlevel, where YY stands for year, MM for month and patchlevel as integer (possibly not used). See all the Braiins OS versions here.
- --contract-code: argument to set contract code for BOS installation

```
--concurrency
```

```
--url
```

```
--url-file
```

```
--dps
```

```
--power-step
```

```
--min-power-target
```

```
--hashrate-step
```

```
--min-hashrate-target
```

```
--shutdown-enabled
```

```
true
```

```
false
```

```
--shutdown-duration
```

```
--shutdown-enabled
```

```
--shutdown-enabled
```

```
true
```

```
--cooling-mode
```

```
--power
```

```
--hashrate
```

```
--target-version
```

```
YY.MM.patchlevel
```

```
YY
```

```
MM
```

```
patchlevel
```

```
--contract-code
```

If users enter an incorrect configuration value during the advanced installation process, such as setting power-step outside the allowable range, they will not receive a notification in the Braiins Toolbox. Nevertheless, the installation process will still be successful, and default configuration values will be applied. Information about such events can be retrieved from the BOSer logs, /var/log/boser/boser.log or through the BOS GUI.

```
power-step
```

```
/var/log/boser/boser.log
```

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox firmware install --helpInstall Braiins OS on miners
Usage: braiins-toolbox firmware install [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...          List of IP addresses or ranges
```

#### Usage Examples

Install on defined IP address(es)

```
$ ./braiins-toolbox firmware install '10.10.10.2'
​2023-01-11T11:19:42.170019Z  INFO braiins_toolbox::install: scanning 1 ip addresses...​2023-01-11T11:19:46.822966Z  INFO braiins_toolbox::install: discovered 1 miners​2023-01-11T11:19:46.822983Z  INFO braiins_toolbox::install: installation is supported for 1/1 miners​Do you want to continue with installation? (YES/no): yes​2023-01-11T11:26:08.666060Z  INFO braiins_toolbox::install: 1/1 miners installed successfully
$ ./braiins-toolbox firmware install '10.10.10.*'
```

Install on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox firmware install --ip-file 'input.txt'
​2023-01-11T11:19:42.170019Z  INFO braiins_toolbox::install: scanning 1 ip addresses...​2023-01-11T11:19:46.822966Z  INFO braiins_toolbox::install: discovered 1 miners​2023-01-11T11:19:46.822983Z  INFO braiins_toolbox::install: installation is supported for 1/1 miners​Do you want to continue with installation? (YES/no): yes​2023-01-11T11:26:08.666060Z  INFO braiins_toolbox::install: 1/1 miners installed successfully
```

Install on defined IP address(es) with a password

```
$ ./braiins-toolbox firmware install '10.10.10.2' --password 'miner:miner'
​2023-01-11T11:19:42.170019Z  INFO braiins_toolbox::install: scanning 1 ip addresses...​2023-01-11T11:19:46.822966Z  INFO braiins_toolbox::install: discovered 1 miners​2023-01-11T11:19:46.822983Z  INFO braiins_toolbox::install: installation is supported for 1/1 miners​Do you want to continue with installation? (YES/no): yes​2023-01-11T11:26:08.666060Z  INFO braiins_toolbox::install: 1/1 miners installed successfully
```

Install target version of Braiins OS on defined IP address(es)

```
$ ./braiins-toolbox firmware install '10.10.10.2' --target-version '23.12'
​2023-01-11T11:19:42.170019Z  INFO braiins_toolbox::install: scanning 1 ip addresses...​2023-01-11T11:19:46.822966Z  INFO braiins_toolbox::install: discovered 1 miners​2023-01-11T11:19:46.822983Z  INFO braiins_toolbox::install: installation is supported for 1/1 miners​Do you want to continue with installation? (YES/no): yes​2023-01-11T11:26:08.666060Z  INFO braiins_toolbox::install: 1/1 miners installed successfully
```

Install on defined IP address(es) together with setting a mining pool and enabling DPS

```
$ ./braiins-toolbox firmware install --url 'stratum+tcp://user1.{{miner.mac}}@stratum.braiins.com:3333' --power 3000 --dps 'on' 10.10.10.2
​2023-12-12T17:39:04.863177Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-12-12T17:39:12.604722Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-12-12T17:39:12.604772Z  INFO scan: braiins_toolbox::scanner: installation is supported for 1/1 minersDo you want to continue with the installation? (YES/no): yes​2023-12-12T17:39:15.398945Z  INFO braiins_toolbox::commands: running installation on 1 miners...​2023-12-12T17:43:14.041507Z  INFO braiins_toolbox::commands: 1/1 miners installed successfully
```

Install Braiins OS and apply a contract key XYZ

```
$ ./braiins-toolbox firmware install --contract-code 'XYZ' 10.10.10.2
​2023-12-12T17:39:04.863177Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-12-12T17:39:12.604722Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-12-12T17:39:12.604772Z  INFO scan: braiins_toolbox::scanner: installation is supported for 1/1 minersDo you want to continue with the installation? (YES/no): yes​2023-12-12T17:39:15.398945Z  INFO braiins_toolbox::commands: running installation on 1 miners...​2023-12-12T17:43:14.041507Z  INFO braiins_toolbox::commands: 1/1 miners installed successfully
```

Unsuccessful installation

```
$ ./install-tool install '10.10.10.2'
​2022-11-09T16:19:36.560002Z  INFO braiins_toolbox::install: scanning 1 ip addresses...​2022-11-09T16:19:36.563002Z  INFO braiins_toolbox::install: discovered 1 miners​2022-11-09T16:19:36.564002Z  INFO braiins_toolbox::install: installation is supported for 1/1 miners​Do you want to continue with installation? (YES/no): yes​2022-11-09T16:19:37.013002Z  INFO braiins_toolbox: running installation procedure on 1 devices​2022-11-09T16:23:23.231004Z ERROR install{addr=10.10.10.2}: braiins_toolbox: installation timed out​2022-11-09T16:23:45.231101Z  INFO braiins_toolbox: 0/1 devices installed successfully
```

Install on defined IP address(es) with a concurrency of 100

```
$ ./braiins-toolbox firmware install --concurrency 100 '10.10.*.*'
​2023-05-07T18:58:55.049467Z  INFO braiins_toolbox::firmware::install: discovered 15843 miners​2023-05-07T18:58:55.049489Z  INFO braiins_toolbox::firmware::install: installation is supported for 873/15843 miners​2023-05-07T18:58:59.235987Z  INFO braiins_toolbox::firmware::install: 873/873 miners installed successfully
```

#### Installation Time

Considering reasonable network capacity and concurrency 100, one installation batch shall take approx. 5 minutes to finish. This means that 100 miners are installed in 5 minutes, 2 000 in 100 minutes, etc.

### Restore

The restore subcommand can be used to batch uninstall aftermarket firmware. The device will return to running the factory firmware without the user having to take any further action.

```
restore
```

The invocation form of the command is:

```
$ ./braiins-toolbox firmware restore [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that firmware restore command is used tells the Toolbox that it should run uninstallation of the firmware to the factory condition
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and uninstallation
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
firmware restore
```

```
[OPTIONS]
```

```
[IP_LIST]
```

```
<O1>.<O2>.<O3>.<O4>
```

```
<Oi>
```

```
0
```

```
255
```

```
range
```

```
*
```

```
[IP_LIST]
```

```
--ip-file <FILE>
```

#### Options

Available options are the global one, see here, as well as the uninstallation-specific options:

- --concurrency is an option, which controls the maximum number of parallel firmware uninstallations

```
--concurrency
```

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox firmware restore --helpRestore the stock firmware of the device
Usage: braiins-toolbox firmware restore [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Uninstall firmware on defined IP address(es)

```
$ ./braiins-toolbox firmware restore '10.10.10.2'
​2023-05-07T18:58:55.049467Z  INFO braiins_toolbox::firmware::restore: discovered 1 miners​2023-05-07T18:58:55.049489Z  INFO braiins_toolbox::firmware::restore: restore is supported for 1/1 miners​2023-05-07T18:58:59.235987Z  INFO braiins_toolbox::firmware::restore: 1/1 miners restored successfully
$ ./braiins-toolbox firmware restore '10.10.10.*'
​2023-05-07T18:58:55.049467Z  INFO braiins_toolbox::firmware::restore: discovered 10 miners
```

Restore on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox firmware restore --ip-file 'input.txt'
​2023-05-07T18:58:55.049467Z  INFO braiins_toolbox::firmware::restore: discovered 1 miners​2023-05-07T18:58:55.049489Z  INFO braiins_toolbox::firmware::restore: restore is supported for 1/1 miners​2023-05-07T18:58:59.235987Z  INFO braiins_toolbox::firmware::restore: 1/1 miners restored successfully
```

Restore on defined IP address(es) with a password

```
$ ./braiins-toolbox firmware restore '10.10.10.2' --password 'root:root'
​2023-05-07T18:58:55.049467Z  INFO braiins_toolbox::firmware::restore: discovered 1 miners​2023-05-07T18:58:55.049489Z  INFO braiins_toolbox::firmware::restore: restore is supported for 1/1 miners​2023-05-07T18:58:59.235987Z  INFO braiins_toolbox::firmware::restore: 1/1 miners restored successfully
```

Restore on defined IP address(es) with concurrency 100

```
$ ./braiins-toolbox firmware restore --concurrency 300 '10.10.*.*'
​2023-05-07T18:58:55.049467Z  INFO braiins_toolbox::firmware::restore: discovered 15843 miners​2023-05-07T18:58:55.049489Z  INFO braiins_toolbox::firmware::restore: restore is supported for 873/15843 miners​2023-05-07T18:58:59.235987Z  INFO braiins_toolbox::firmware::restore: 873/873 miners restored successfully
```

### Upgrade

Remote batch upgrading to the latest version of Braiins OS can be performed using the following command:

```
$ ./braiins-toolbox firmware upgrade [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that firmware upgrade command is used, tells the Toolbox that it should run upgrade to the latest Braiins OS
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and upgrade
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
firmware upgrade
```

```
[OPTIONS]
```

```
[IP_LIST]
```

```
<O1>.<O2>.<O3>.<O4>
```

```
<Oi>
```

```
0
```

```
255
```

```
*
```

```
[IP_LIST]
```

```
--ip-file <FILE>
```

#### Options

Available options are only the global ones, see here, and 2 upgrade-related:

- --concurrency is an option which controls the maximum number of parallel firmware upgrades
- --target-version. If the user doesn’t use this option, the firmware is automatically upgraded to the latest Braiins OS version. Nevertheless, users can use this option to upgrade or downgrade to the specified Braiins OS version. The version is defined by versioning nomenclature YY.MM.patchlevel, where YY stands for year, MM for month and patchlevel as integer (possibly not used). See all the Braiins OS versions here.

```
--concurrency
```

```
--target-version
```

```
YY.MM.patchlevel
```

```
YY
```

```
MM
```

```
patchlevel
```

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox firmware upgrade --helpUpgrade Braiins OS miners
Usage: braiins-toolbox firmware upgrade [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Upgrade to the latest Braiins OS on defined IP address(es)

```
$ ./braiins-toolbox firmware upgrade '10.10.10.2'
​2023-05-07T19:45:02.165054Z  INFO braiins_toolbox::firmware::upgrade: scanning 1 ip addresses...​2023-05-07T19:45:02.976861Z  INFO braiins_toolbox::firmware::upgrade: discovered 1 miners​2023-05-07T19:45:02.976885Z  INFO braiins_toolbox::firmware::upgrade: upgrade is supported for 1/1 miners​Miners will be upgraded to FW:​  1. BBB/NAND: firmware_2023-05-04-0-9b223345-23.03.1-plus_omap.tar​Do you want to continue with the upgrade? (YES/no): yes​2023-05-07T19:45:04.139757Z  INFO braiins_toolbox::firmware::upgrade: running system-upgrade on 1 miners...
```

Upgrade to the latest Braiins OS on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox firmware upgrade --ip-file 'input.txt'
​2023-05-07T19:45:02.165054Z  INFO braiins_toolbox::firmware::upgrade: scanning 1 ip addresses...​2023-05-07T19:45:02.976861Z  INFO braiins_toolbox::firmware::upgrade: discovered 1 miners​2023-05-07T19:45:02.976885Z  INFO braiins_toolbox::firmware::upgrade: upgrade is supported for 1/1 miners​Miners will be upgraded to FW:​  1. BBB/NAND: firmware_2023-05-04-0-9b223345-23.03.1-plus_omap.tar
```

Upgrade to the specific Braiins OS version on defined IP address(es)

```
$ ./braiins-toolbox firmware upgrade --target-version '23.03.1' '10.10.10.2'
​2023-05-07T19:40:22.643917Z  INFO braiins_toolbox::firmware::upgrade: scanning 1 ip addresses...​2023-05-07T19:40:23.623777Z  INFO braiins_toolbox::firmware::upgrade: discovered 1 miners​2023-05-07T19:40:23.623798Z  INFO braiins_toolbox::firmware::upgrade: upgrade is supported for 1/1 miners​Miners will be upgraded to FW:​  1. BBB/NAND: firmware_2023-05-04-0-9b223345-23.03.1-plus_omap.tar​Do you want to continue with the upgrade? (YES/no): yes​2023-05-07T19:40:25.530018Z  INFO braiins_toolbox::firmware::upgrade: running system-upgrade on 1 miners...
```

Downgrade to the specific Braiins OS version on IP address(es)

```
$ ./braiins-toolbox firmware upgrade --target-version '23.03' '10.10.10.2'
​2023-05-07T19:40:22.643917Z  INFO braiins_toolbox::firmware::upgrade: scanning 1 ip addresses...​2023-05-07T19:40:23.623777Z  INFO braiins_toolbox::firmware::upgrade: discovered 1 miners​2023-05-07T19:40:23.623798Z  INFO braiins_toolbox::firmware::upgrade: upgrade is supported for 1/1 miners​Miners will be upgraded to FW:​  1. BBB/NAND: firmware_2023-04-20-0-0ce150e9-23.03-plus_omap.tar​Do you want to continue with the upgrade? (YES/no): yes​2023-05-07T19:40:25.530018Z  INFO braiins_toolbox::firmware::upgrade: running system-upgrade on 1 miners...
```

### Custom Contract

Remote batch application of a contract key to miners with Braiins OS can be performed using the following command:

```
$ ./braiins-toolbox custom-contract apply [OPTIONS] --contract-code <CODE> <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that custom-contract apply command is used, tells the Toolbox that it should apply contract key on the selected miner, which are on Braiins OS
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and command execution
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
custom-contract apply
```

```
[OPTIONS]
```

```
[IP_LIST]
```

```
<O1>.<O2>.<O3>.<O4>
```

```
<Oi>
```

```
0
```

```
255
```

```
*
```

```
[IP_LIST]
```

```
--ip-file <FILE>
```

#### Options

Available options are only the global ones, see here, and 2 upgrade-related:

- --concurrency is an option which controls the maximum number of parallel firmware upgrades
- --contract-code s an option that needs to be used to apply the contract key

```
--concurrency
```

```
--contract-code
```

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox custom-contract apply --helpApply custom contract
Usage: braiins-toolbox custom-contract apply [OPTIONS] --contract-code <CODE> <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Apply contract key XYZ on defined IP address(es)

```
$ ./braiins-toolbox custom-contract apply --contract-code 'XYZ' '10.10.10.2'
​2023-05-07T19:45:02.165054Z  INFO braiins_toolbox::toolbox_cli::scanner: scanning 1 ip addresses...​2023-05-07T19:45:02.976861Z  INFO braiins_toolbox::toolbox_cli::scanner: discovered 1 miners​2023-05-07T19:45:02.976885Z  INFO braiins_toolbox::toolbox_cli::scanner: custom contract application is supported for 1/1 miners​2023-05-07T19:45:04.139757Z  INFO braiins_toolbox::toolbox_cli::commands: running custom contract application on 1 miners...​2023-05-07T19:47:23.538552Z  INFO braiins_toolbox::toolbox_cli::commands: 1/1 miners with custom contract applied successfully
```

Apply contract key XYZ on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox custom-contract apply --contract-code 'XYZ' --ip-file 'input.txt'
​2023-05-07T19:45:02.165054Z  INFO braiins_toolbox::toolbox_cli::scanner: scanning 1 ip addresses...​2023-05-07T19:45:02.976861Z  INFO braiins_toolbox::toolbox_cli::scanner: discovered 1 miners​2023-05-07T19:45:02.976885Z  INFO braiins_toolbox::toolbox_cli::scanner: custom contract application is supported for 1/1 miners​2023-05-07T19:45:04.139757Z  INFO braiins_toolbox::toolbox_cli::commands: running custom contract application on 1 miners...​2023-05-07T19:47:23.538552Z  INFO braiins_toolbox::toolbox_cli::commands: 1/1 miners with custom contract applied successfully
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/cmd-firmware/
**Scraped**: 2025-12-28
