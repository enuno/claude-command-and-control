# System Management

- GUI
- CLI

## GUI

The system management capabilities cover operations such as

- collect device info
- reboot device
- locate device
- run a command

These functions allow you to manage your devices easily. Example video bellow shows system rebooting, which can be helpful in various scenarios, such as troubleshooting issues.

## CLI

The equivalent to the system management capabilities in CLI is a system command consists of 3 system-related subcommands:

```
system
```

- collect-data
- reboot
- locate-device
- execute
- set-network

The help option gives the user a quick overview of the command capabilities:

```
$ ./braiins-toolbox system --helpSystem-related commands - data collection, reboot, exec, ...
Usage: braiins-toolbox system [OPTIONS] <COMMAND>
Commands:  collect-data   Collect data from miners  reboot         Reboot miners  locate-device  Enable/Disable locate device mode
```

### Collect Data

The user can collect data from the Antminer S19 series of devices (running on the stock manufacturer firmware or Braiins OS), by using the collect-data subcommand. This command comes in handy for the user to analyze the hardware data from the Antminers S19 of interest. It is recommended to collect the data and send it to the Braiins support before the first batch of installations.

```
collect-data
```

This can be achieved using the following command:

```
$ ./braiins-toolbox system collect-data [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that system collect-data command is used, tells the Toolbox that it should collect data from the miners
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
system collect-data
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

Note: The data is stored in a folder called collected-data.

```
collected-data
```

#### Options

Available options are only the global ones, see here, as well as the collect-data specific:

- --concurrency is an option, which controls the maximum number of parallel collect-data operations
- --output-dir is an option, which defines where the resulting archive should be stored

```
--concurrency
```

```
--output-dir
```

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox system collect-data --helpCollect data from miners
Usage: braiins-toolbox system collect-data [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...          List of IP addresses or ranges
```

#### Usage Examples

Collect data from the defined IP address(es)

```
$ ./braiins-toolbox system collect-data '10.10-11.*.2'
​2023-05-07T20:00:35.504393Z  INFO braiins_toolbox::system::collect_data: discovered 29 miners​2023-05-07T20:00:35.504432Z  INFO braiins_toolbox::system::collect_data: data could be collected from 3/29 miners​2023-05-07T20:00:35.506136Z  INFO braiins_toolbox::system::collect_data: collecting data from 3 miners...​2023-05-07T20:00:37.025965Z  INFO braiins_toolbox::system::collect_data: 3/3 miners collected successfully​2023-05-07T20:00:37.026015Z  INFO braiins_toolbox::system::collect_data: Collected data are stored in file "collected_data/collected_data_2023-05-07_20:00:35.tar.gz"
```

### Reboot

Users can reboot devices by running the reboot subcommand as follows. The command works on devices with Braiins OS version 23.03 or newer, or Bitmain stock FW, or MicroBT stock FW.

```
reboot
```

```
$ ./braiins-toolbox system reboot [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that system reboot command is used, tells the Toolbox that it should reboot the devices
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and reboot
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
system reboot
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

Available options are the global ones, see here, as well as the system specific:

- --concurrency is an option, which controls the maximum number of parallel reboot operations

```
--concurrency
```

#### Help

Calling the help command serves as a quick description of the command:

```
$ ./braiins-toolbox system reboot --helpReboot miners
Usage: braiins-toolbox system reboot [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Reboot system on defined IP address(es)

```
$ ./braiins-toolbox system reboot '10.10.10.2'
​2023-05-07T20:14:56.669104Z  INFO braiins_toolbox::system::reboot: scanning 1 ip addresses...​2023-05-07T20:14:56.864285Z  INFO braiins_toolbox::system::reboot: discovered 1 miners​2023-05-07T20:14:56.864320Z  INFO braiins_toolbox::system::reboot: reboot is supported for 1/1 miners​2023-05-07T20:16:31.539243Z  INFO braiins_toolbox::system::reboot: 1/1 miners rebooted successfully
$ ./braiins-toolbox system reboot '10.10.10.*'
```

Reboot system on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox system reboot --ip-file 'input.txt'
​2023-05-07T20:14:56.669104Z  INFO braiins_toolbox::system::reboot: scanning 1 ip addresses...​2023-05-07T20:14:56.864285Z  INFO braiins_toolbox::system::reboot: discovered 1 miners​2023-05-07T20:14:56.864320Z  INFO braiins_toolbox::system::reboot: reboot is supported for 1/1 miners​2023-05-07T20:16:31.539243Z  INFO braiins_toolbox::system::reboot: 1/1 miners rebooted successfully
```

### Locate Device

Users can locate their devices with turning ON LED blinking. The blinking LEDs can also be turned OFF.

```
$ ./braiins-toolbox system locate-device [OPTIONS] <STATUS> <IP_LIST|--ip-file <FILE>>
```

where:

- system locate-device tells the Toolbox to turn on (or off) the “Locate Device” function on selected miners running supported version of Braiins OS, Bitmain stock FW or MicroBT stock FW
- <STATUS> sets locate device mode on or off
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and locating devices
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e. I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
system locate-device
```

```
<STATUS>
```

```
on
```

```
off
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

Available options are the global ones, see here.

#### Help

Calling the help command serves as a quick description of the command:

```
$ ./braiins-toolbox system locate-device --helpEnable/Disable locate device mode
Usage: braiins-toolbox system locate-device [OPTIONS] <STATUS> <IP_LIST|--ip-file <FILE>>Arguments:  <STATUS>      Set locate device mode on or off [possible values: on, off]  [IP_LIST]...  List of IP addresses or ranges
```

#### Usage Examples

Locate device on defined IP address(es)

```
$ ./braiins-toolbox system locate-device on '10.10.10.2'
​2023-05-07T20:14:56.669104Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-05-07T20:14:56.864285Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-05-07T20:14:56.864320Z  INFO scan: braiins_toolbox::scanner: locate device is supported for 1/1 miners​2023-05-07T20:14:57.539243Z  INFO braiins_toolbox::commands: running configuration of locate device status on 1 miners...​2023-05-07T20:14:57.549243Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
$ ./braiins-toolbox system locate-device on '10.10.10.*'
```

Turn off locate-device on defined IP address(es)

```
locate-device
```

```
$ ./braiins-toolbox system locate-device off '10.10.10.2'
​2023-05-07T20:14:56.669104Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-05-07T20:14:56.864285Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-05-07T20:14:56.864320Z  INFO scan: braiins_toolbox::scanner: locate device is supported for 1/1 miners​2023-05-07T20:14:57.539243Z  INFO braiins_toolbox::commands: running configuration of locate device status on 1 miners...​2023-05-07T20:14:57.549243Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
$ ./braiins-toolbox system locate-device off '10.10.10.*'
```

Locate a device on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox system locate-device on --ip-file 'input.txt'
​2023-05-07T20:14:56.669104Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-05-07T20:14:56.864285Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-05-07T20:14:56.864320Z  INFO scan: braiins_toolbox::scanner: locate device is supported for 1/1 miners​2023-05-07T20:14:57.539243Z  INFO braiins_toolbox::commands: running configuration of locate device status on 1 miners...​2023-05-07T20:14:57.549243Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
```

### Execute

Users can execute a command or a script on their miners. Supported are Antminers with Braiins OS and Bitmain stock firmware.

```
$ ./braiins-toolbox system execute [OPTIONS] <IP_LIST|--ip-file <FILE>> <--command <COMMAND>|--script <SCRIPT_PATH>>
```

where:

- system execute tells the Toolbox to run a command or a script on selected miners
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and locating devices
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e. I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>
- command serves as keyword, after which the user types the command, which (s)he wants to execute on the selected miners
- or instead of command it is possible to call a script keyword, after which the path to the script file has to be provided

```
system execute
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

```
command
```

```
command
```

```
script
```

#### Options

Available options are the global ones, see here, as well as the system execute specific:

- --command is an option, with which a user defines a string representing a shell command
- --script is an option, with which a user provides a path to a file containing a shell script to be executed
- --concurrency is an option, which controls the maximum number of parallel reboot operations
- --command-timeout is an option, which controls timeout for the command execution [default: 30s]

```
--command
```

```
--script
```

```
--concurrency
```

```
--command-timeout
```

```
[default: 30s]
```

#### Help

Calling the help command serves as a quick description of the command:

```
$ ./braiins-toolbox system execute --helpExecute command or script on miner
Usage: braiins-toolbox system execute [OPTIONS] <IP_LIST|--ip-file <FILE>> <--command <COMMAND>|--script <SCRIPT_PATH>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Run a command on defined IP address(es)

```
$ ./braiins-toolbox system execute 10.10.10.2 --command "cat /etc/bos_version"
​2023-10-14T21:02:30.312799Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-10-14T21:02:30.522346Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-10-14T21:02:30.522391Z  INFO scan: braiins_toolbox::scanner: execute is supported for 1/1 miners​2023-10-14T21:02:30.535665Z  INFO braiins_toolbox::commands: running execute on 1 miners...​2023-10-14T21:02:30.615163Z  INFO braiins_toolbox::commands: 1/1 miners executed successfully​2023-10-14T21:02:30.624131Z  INFO braiins_toolbox::commands::system::execute: exec output is stored in file: ./system_execute_2023-10-14T21:02:30Z.out"
```

Run a script on defined IP address(es)

```
$ ./braiins-toolbox system execute 10.10.10.2 --script ./script.sh
​2023-10-14T21:13:05.619833Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-10-14T21:13:05.941429Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-10-14T21:13:05.941663Z  INFO scan: braiins_toolbox::scanner: execute is supported for 1/1 miners​2023-10-14T21:13:05.958084Z  INFO braiins_toolbox::commands: running execute on 1 miners...​2023-10-14T21:13:06.162900Z  INFO braiins_toolbox::commands: 1/1 miners executed successfully​2023-10-14T21:13:06.174878Z  INFO braiins_toolbox::commands::system::execute: exec output is stored in file: ./system_execute_2023-10-14T21:13:05Z.out"
```

### Set Network

Users can set network on their miners. Supported are Antminers with Braiins OS and Bitmain stock firmware.

The network configuration feature is intended exclusively for power users proficient in network settings. Please proceed with caution and use it at your own risk!

```
$ ./braiins-toolbox system set-network <dhcp|static>[OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- system set-network tells the Toolbox that it should change network configuration for miners running supported version of Braiins OS or Bitmain stock FW as requested
- where first argument <dhcp|static> defines network protocol to be set on devices
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and locating devices
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e. I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
system set-network
```

```
<dhcp|static>
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

Available options are the global ones, see here.

#### Help

Calling the help command serves as a quick description of the command:

```
$ ./braiins-toolbox system set-network --helpSet network configuration
Usage: braiins-toolbox system set-network [OPTIONS] <COMMAND>
Commands:  dhcp    Set DHCP network configuration  static  Set static network configuration.
```

The set-network command consists of a subcommand, either dhcp or static. If the user wants to set dynamic network, she calls dhcp subcommand.

```
set-network
```

```
dhcp
```

```
static
```

```
dhcp
```

```
$ ./braiins-toolbox system set-network dhcp --helpSet DHCP network configuration
Usage: braiins-toolbox system set-network dhcp [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...          List of IP addresses or ranges
```

Available options are the global ones, see here, as well as the system execute specific:

- --hostname: an optional value representing a hostname of the device

```
--hostname
```

The user can set static network on the selected miners.

```
static
```

```
$ ./braiins-toolbox system set-network static --helpBe very careful, incorrect configuration may disrupt your operations and cause your devices to be unreachable
Set static network configuration.
You must specify all the options (except hostname) when switching from DHCP mode.If devices are already in Static mode, you can leave out options you don't want to modify.
Examples (make sure to replace example values with real values):
```

Available options are the global ones, see here, as well as the system execute specific:

- --hostname: an optional value representing a hostname of the device.
- --ip: value representing IP range for assigning new IP addresses (e.g. 192.168.1.2 for single device or 192.168.1.2-10 for multiple devices). Predefined variable {{miner.ip}} can be used when you want to keep current IP. Make sure IP range does not overlap with the gateway IP to avoid network disruptions. Size of IP range must be equal or greater than number of selected devices.
- --netmask: value, which defines network size and the range of possible IP addresses within it (e.g. 255.255.255.0). Make sure all selected devices use the same netmask.
- --gateway: value, which defines IP of a device which is used for forwarding network packets to other networks. Typically, it’s a network router (e.g. 192.168.1.1). Make sure all selected devices use the same gateway.
- --dns: value for specifying DNS server(s). To specify multiple DNS servers, repeat the option for each (e.g. —dns 1.1.1.1 —dns 8.8.8.8).

```
--hostname
```

```
--ip
```

```
{{miner.ip}}
```

```
--netmask
```

```
--gateway
```

```
--dns
```

#### Usage Examples

Convert current DHCP to STATIC, where IP address does not change, applied on miners defined in the input file iplist.txt

```
$ ./braiins-toolbox system set-network static --ip {{miner.ip}} --netmask 255.255.255.0 --gateway 10.35.1.1 --hostname MyMiner --dns 8.8.8.8 --dns 1.1.1.1 -i iplist.txt
​2024-03-27T08:40:38.887860Z  WARN braiins_toolbox::commands::system::set_network: WARNING: Incorrect network configuration may cause your device to be unreachable. Proceed at your own risk!Do you want to continue? (yes/NO): yes​2024-03-27T08:40:42.009924Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2024-03-27T08:40:43.553614Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2024-03-27T08:40:43.553699Z  INFO scan: braiins_toolbox::scanner: configuration of network is supported for 1/1 miners​2024-03-27T08:40:43.565590Z  INFO braiins_toolbox::commands: running configuration of network on 1 miners...​2024-03-27T08:40:43.932422Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
```

Set different STATIC IP on 8 selected devices defined in the input file iplist.txt

```
$ ./braiins-toolbox system set-network static --ip 10.35.1.2-10 --netmask 255.255.255.0 --gateway 10.35.1.1 --hostname MyMiner --dns 8.8.8.8 --dns 1.1.1.1 -i iplist.txt
​2024-03-27T08:40:38.887860Z  WARN braiins_toolbox::commands::system::set_network: WARNING: Incorrect network configuration may cause your device to be unreachable. Proceed at your own risk!Do you want to continue? (yes/NO): yes​2024-03-27T08:40:42.009924Z  INFO scan: braiins_toolbox::scanner: scanning 8 IP addresses...​2024-03-27T08:40:43.553614Z  INFO scan: braiins_toolbox::scanner: discovered 8 online miners​2024-03-27T08:40:43.553699Z  INFO scan: braiins_toolbox::scanner: configuration of network is supported for 8/8 miners​2024-03-27T08:40:43.565590Z  INFO braiins_toolbox::commands: running configuration of network on 1 miners...​2024-03-27T08:40:43.932422Z  INFO braiins_toolbox::commands: 8/8 miners configured successfully
```

Changing STATIC to DHCP on one selected miner:

```
$ ./braiins-toolbox system set-network dhcp 10.10.10.1
​2024-03-27T08:42:49.752361Z  WARN braiins_toolbox::commands::system::set_network: WARNING: Incorrect network configuration may cause your device to be unreachable. Proceed at your own risk!Do you want to continue? (yes/NO): yes​2024-03-27T08:42:52.469737Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2024-03-27T08:42:54.388399Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2024-03-27T08:42:54.388452Z  INFO scan: braiins_toolbox::scanner: configuration of network is supported for 1/1 miners​2024-03-27T08:42:54.400671Z  INFO braiins_toolbox::commands: running configuration of network on 1 miners...​2024-03-27T08:42:54.937232Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/cmd-system/
**Scraped**: 2025-12-28
