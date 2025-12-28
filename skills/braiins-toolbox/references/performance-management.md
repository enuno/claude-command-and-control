# Performance Management

- GUI
- CLI

## GUI

The performance management capabilities focus on the ability to set power consumption targets for your mining machines. Managing power consumption is crucial for optimizing the efficiency and cost-effectiveness of your mining operations. The user has the flexibility to set a default power target, increase or decrease the power consumption by a specific number of watts, or define a specific nominal value for the desired power target.

Users can also remove tuned profiles for miners running Braiins OS directly from the Toolbox GUI. This feature comes in handy in the event of a new release of Braiins OS that introduces tuner improvements. By removing the tuned profiles, miners can retune the chips.

Bitmain stock firmware lacks the feature to set arbitrary power targets. However, it does support discrete power modes such as Normal, Sleep, and Low. The Toolbox GUI also provides support for configuring these modes under the Performance button.

Another crucial feature is Dynamic Performance Scaling, a Braiins OS ability to decrease/increase power consumption to prevent overheating, which implies thermal cycling of the miners. The feature is explained here.

Warning: Overclocking may damage your device. Proceed at your own risk!

## CLI

The equivalent to the performance capabilities in CLI is a tuner command, which consists of 3 tuner-related subcommands:

```
tuner
```

- target
- set-dps
- remove-profiles

The commands only work on devices with Braiins OS version 23.03 or newer. The help option gives the user a quick overview of the command capabilities:

```
$ ./braiins-toolbox tuner --helpTuner-related commands - set hashrate/power target, set DPS ...
Usage: braiins-toolbox tuner [OPTIONS] <COMMAND>
Commands:  target           Set hashrate/power target on Braiins OS miners  set-dps          Set DPS mode on Braiins OS miners  remove-profiles  Remove all tuned profiles from Braiins OS miners
```

### Target

Users can configure the tuner target remotely in a batch by performing the tuner subcommand:

```
tuner
```

```
$ ./braiins-toolbox tuner target [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that tuner target command is used, tells the Toolbox that the defined devices should configure a new value of tuner target
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and tuner setting
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
tuner target
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

Available options are the global ones, see here, or tuner target specific

- --power: User can either set with this option the power target as an integer number, or can use a characters for increase/decrease power target by steps of 250 Watt:

ddd: decrease power target by 750 Watts
dd: decrease power target by 500 Watts
d: decrease power target by 250 Watts
i: increase power target by 250 Watts
ii: increase power target by 500 Watts
iii: increase power target by 750Watts
- ddd: decrease power target by 750 Watts
- dd: decrease power target by 500 Watts
- d: decrease power target by 250 Watts
- i: increase power target by 250 Watts
- ii: increase power target by 500 Watts
- iii: increase power target by 750Watts
- --hashrate: User can either set with this option the hashrate target as a float number, or can use a characters for increase/decrease hashrate target by steps of 5 TH/s:

ddd: decrease hashrate target by 20 TH/s
dd: decrease hashrate target by 15 TH/s
d: decrease hashrate target by 10 TH/s
i: increase hashrate target by 10 TH/s
ii: increase hashrate target by 15 TH/s
iii: increase hashrate target by 20 TH/s
- ddd: decrease hashrate target by 20 TH/s
- dd: decrease hashrate target by 15 TH/s
- d: decrease hashrate target by 10 TH/s
- i: increase hashrate target by 10 TH/s
- ii: increase hashrate target by 15 TH/s
- iii: increase hashrate target by 20 TH/s

```
--power
```

- ddd: decrease power target by 750 Watts
- dd: decrease power target by 500 Watts
- d: decrease power target by 250 Watts
- i: increase power target by 250 Watts
- ii: increase power target by 500 Watts
- iii: increase power target by 750Watts

```
ddd
```

```
dd
```

```
d
```

```
i
```

```
ii
```

```
iii
```

```
--hashrate
```

- ddd: decrease hashrate target by 20 TH/s
- dd: decrease hashrate target by 15 TH/s
- d: decrease hashrate target by 10 TH/s
- i: increase hashrate target by 10 TH/s
- ii: increase hashrate target by 15 TH/s
- iii: increase hashrate target by 20 TH/s

```
ddd
```

```
dd
```

```
d
```

```
i
```

```
ii
```

```
iii
```

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox tuner target --helpSet power target on Braiins OS miners
Usage: braiins-toolbox tuner target [OPTIONS] <--power <POWER>|--hashrate <HASHRATE>> <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Set tuner target on defined IP address(es)

```
$ ./braiins-toolbox tuner target --power 3318 '10.10.10.2'
​2023-05-07T21:16:52.170131Z  INFO scan: toolbox_cli::scanner: scanning 1 ip addresses...​2023-05-07T21:16:52.279867Z  INFO scan: toolbox_cli::scanner: discovered 1 miners​2023-05-07T21:16:52.279888Z  INFO scan: toolbox_cli::scanner: tuner target configuration is supported for 1/1 miners​2024-05-07T21:16:52.293395Z  INFO toolbox_cli::commands: running configuration of tuner target on 1 miners...​2023-05-07T21:16:52.334861Z  INFO toolbox_cli::commands: 1/1 miners configured successfully
$ ./braiins-toolbox tuner target --hashrate 120 '10.10.10.2'
```

Set tuner target on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox tuner target --power 3318 --ip-file 'input.txt'
​2023-05-07T21:16:52.170131Z  INFO scan: toolbox_cli::scanner: scanning 1 ip addresses...​2023-05-07T21:16:52.279867Z  INFO scan: toolbox_cli::scanner: discovered 1 miners​2023-05-07T21:16:52.279888Z  INFO scan: toolbox_cli::scanner: tuner target configuration is supported for 1/1 miners​2024-05-07T21:16:52.293395Z  INFO toolbox_cli::commands: running configuration of tuner target on 10 miners...​2023-05-07T21:16:52.334861Z  INFO toolbox_cli::commands: 1/1 miners configured successfully
$ ./braiins-toolbox tuner target --hashrate 120 --ip-file 'input.txt'
```

Decrease the power target on defined IP address(es) by 250-750 Watts

```
$ ./braiins-toolbox tuner target --power d '10.10.10.2'
​2023-05-07T21:16:52.170131Z  INFO scan: toolbox_cli::scanner: scanning 1 ip addresses...​2023-05-07T21:16:52.279867Z  INFO scan: toolbox_cli::scanner: discovered 1 miners​2023-05-07T21:16:52.279888Z  INFO scan: toolbox_cli::scanner: tuner target configuration is supported for 1/1 miners​2024-05-07T21:16:52.293395Z  INFO toolbox_cli::commands: running configuration of tuner target on 1 miners...​2023-05-07T21:16:52.334861Z  INFO toolbox_cli::commands: 1/1 miners configured successfully
$ ./braiins-toolbox tuner target --power dd '10.10.10.*'
```

Increase the hashrate target on defined IP address(es) by 10-20 TH/s

```
$ ./braiins-toolbox tuner target --hashrate i '10.10.10.2'
​2023-05-07T21:16:52.170131Z  INFO scan: toolbox_cli::scanner: scanning 1 ip addresses...​2023-05-07T21:16:52.279867Z  INFO scan: toolbox_cli::scanner: discovered 1 miners​2023-05-07T21:16:52.279888Z  INFO scan: toolbox_cli::scanner: tuner target configuration is supported for 1/1 miners​2024-05-07T21:16:52.293395Z  INFO toolbox_cli::commands: running configuration of tuner target on 1 miners...​2023-05-07T21:16:52.334861Z  INFO toolbox_cli::commands: 1/1 miners configured successfully
$ ./braiins-toolbox tuner target --hashrate ii '10.10.10.*'
```

### Set Dynamic Performance Scaling

Users can configure Dynamic Performance Scaling, which is a Braiins OS specific feature designed to avoid thermal cycling of the mining HW in challenging weather conditions. The feature is explained here.

```
$ ./braiins-toolbox tuner set-dps [OPTIONS] <on|off> <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that tuner set-dps command is used, tells the Toolbox that the defined devices should configure a DPS
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and DPS setting
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
tuner set-dps
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

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox tuner set-dps --helpSet DPS mode on Braiins OS miners
Usage: braiins-toolbox tuner set-dps [OPTIONS] <COMMAND>
Commands:  off  Turn off DPS  on   Turn on or configure DPS
```

The set-dps command consists of a subcommand, either on or off. If the user wants to enable DPS, she calls on subcommand.

```
set-dps
```

```
on
```

```
off
```

```
on
```

```
$ ./braiins-toolbox tuner set-dps on --helpTurn on or configure DPS
Usage: braiins-toolbox tuner set-dps on [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

Available options are the global ones, see here, as well as the DPS on specific ones:

```
on
```

- --mode: an optional value representing the DPS mode for the device’s power scaling settings. The supported modes include normal and boost. If the option is omitted, the DPS setting will not change the current DPS mode, meaning it remains as is. DPS mode was introduced in Braiins OS version 25.01
- --power-step: an optional value representing a power step for the upscale/downscale of power consumption
- --min-power-target: an optional value representing nominal power consumption, at which the DPS stops downscaling
- --hashrate-step: an optional value representing a hashrate step for the upscale/downscale of clock speed
- --min-hashrate-target: an optional value representing a hashrate, at which the DPS stops downscaling
- --shutdown-enabled: an optional boolean value, which manages if the miner should be temporarily turned off in case the minimal power target is reached (true), or not (false)
- --shutdown-duration: an optional integer value related to the --shutdown-enabled, which represents the time (in hours) for which the miner should turn off when the minimal power target is reached and --shutdown-enabled is set to be true

```
--mode
```

```
normal
```

```
boost
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

The user can also disable DPS with the off subcommand.

```
off
```

```
$ ./braiins-toolbox tuner set-dps off --helpTurn off DPS
Usage: braiins-toolbox tuner set-dps off [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

Available options are only the global ones, see here.

#### Usage Examples

Set power set-dps on

```
power set-dps on
```

```
# Set DPS with Braiins OS defaults$ ./braiins-toolbox tuner set-dps on 10.34.14.2
​2023-08-07T13:07:03.004289Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-08-07T13:07:03.278728Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-08-07T13:07:03.278755Z  INFO scan: braiins_toolbox::scanner: configuration of dps is supported for 1/1 miners​2023-08-07T13:07:03.292690Z  INFO braiins_toolbox::commands: running configuration of DPS on 1 miners...​2023-08-07T13:07:03.333585Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
```

Set power set-dps off

```
power set-dps off
```

```
$ ./braiins-toolbox tuner set-dps off 10.34.14.2
​2023-08-07T13:06:12.911807Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-08-07T13:06:13.155776Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-08-07T13:06:13.155821Z  INFO scan: braiins_toolbox::scanner: configuration of dps is supported for 1/1 miners​2023-08-07T13:06:13.176783Z  INFO braiins_toolbox::commands: running configuration of DPS on 1 miners...​2023-08-07T13:06:13.220070Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
```

### Remove Tuned Profiles

In some cases, users may wish to conduct new tuning and create updated profiles. This is a specific use case, especially when there is a new release of BOS with an enhanced tuner. To simplify the user’s experience, the option to remove tuned profiles is available through a dedicated command.

```
$ ./braiins-toolbox tuner remove-profiles [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the execution of the tuner remove-profiles command indicates to the Toolbox that the specified devices should have their tuned profiles removed
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and DPS setting
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
tuner remove-profiles
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

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox tuner remove-profiles --helpRemove all tuned profiles from Braiins OS miners
Usage: braiins-toolbox tuner remove-profiles [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Remove tuned profiles on defined IP address(es)

```
$ ./braiins-toolbox tuner remove-profiles 10.10.10.1​2023-11-29T21:17:08.501347Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-11-29T21:17:08.917105Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-11-29T21:17:08.917157Z  INFO scan: braiins_toolbox::scanner: removal of tuned profiles is supported for 1/1 miners​2023-11-29T21:17:08.928757Z  INFO braiins_toolbox::commands: running tuned profiles removal on 1 miners...​2023-11-29T21:17:20.120560Z  INFO braiins_toolbox::commands: 1/1 miners removed successfully
$ ./braiins-toolbox tuner remove-profiles '10.10.10.*'​2023-11-29T21:17:08.501347Z  INFO scan: braiins_toolbox::scanner: scanning 256 IP addresses...
```

Remove tuned profiles on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox tuner remove-profiles --ip-file 'input.txt'​2023-11-29T21:17:08.501347Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-11-29T21:17:08.917105Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-11-29T21:17:08.917157Z  INFO scan: braiins_toolbox::scanner: removal of tuned profiles is supported for 1/1 miners​2023-11-29T21:17:08.928757Z  INFO braiins_toolbox::commands: running tuned profiles removal on 1 miners...​2023-11-29T21:17:20.120560Z  INFO braiins_toolbox::commands: 1/1 miners removed successfully
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/cmd-tuner/
**Scraped**: 2025-12-28
