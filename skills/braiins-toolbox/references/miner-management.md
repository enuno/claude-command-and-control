# Miner Management

- GUI
- CLI

## GUI

The miner management capabilities cover operations such as

- starting mining
- stopping mining
- restarting mining
- pausing mining
- resuming mining
- set up pool settings

These functions allow you to have fine-grained control over the mining process. Change of pool settings is showed in the video below.

It is also possible to use workername variables when configuring pool settings through the GUI. For example, users can use a miner hostname as a workername when configuring the pool settings.

## CLI

The equivalent to the management capabilities in CLI is a miner command, which consists of 8 miner-related subcommands:

```
miner
```

- start
- stop
- restart
- pause
- resume
- set-pool-urls
- set-mode
- set-power-limit

The command works on devices with Braiins OS version 23.03 and newer. Commands pause, resume and set-pool-urls work for Bitmain and MicroBT firmware as well. Command set-mode works only with Bitmain FW. Command set-power-limit is compatible only with MicroBT FW.

```
pause
```

```
resume
```

```
set-pool-urls
```

```
set-mode
```

```
set-power-limit
```

The help option gives the user a quick overview of the command capabilities:

```
$ ./braiins-toolbox miner --helpMiner-related commands - pool urls, start, stop, restart, ...
Usage: braiins-toolbox miner [OPTIONS] <COMMAND>
Usage: braiins-toolbox miner [OPTIONS] <COMMAND>
Commands:  start            Start Braiins OS miners
```

### Start

Users can use the start to start mining remotely in a batch. The format of the command is as follows:

```
start
```

```
$ ./braiins-toolbox miner start [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner start command is used tells the Toolbox that the defined devices should start mining
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and start
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e. I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner start
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

Available options are just the global one, see here.

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner start --helpStart Braiins OS miners
Usage: braiins-toolbox miner start [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Start mining on defined IP address(es)

```
$ ./braiins-toolbox miner start '10.10.10.2'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner start is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner start on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners started successfully
$ ./braiins-toolbox miner start '10.10.10.*'
```

Start mining on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner start --ip-file 'input.txt'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner start is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner start on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners started successfully
```

### Stop

Users can stop mining remotely in a batch by using the stop subcommand as follows:

```
stop
```

```
$ ./braiins-toolbox miner stop [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner stop command is used tells the Toolbox that the defined devices should stop mining
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and stop
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner stop
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

Available options are just the global one, see here.

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner stop --helpStop Braiins OS miners
Usage: braiins-toolbox miner stop [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Stop mining on defined IP address(es)

```
$ ./braiins-toolbox miner stop '10.10.10.2'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner stop is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner stop on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners stopped successfully
$ ./braiins-toolbox miner stop '10.10.10.*'
```

Stop mining on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner stop --ip-file 'input.txt'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner stop is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner stop on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners stopped successfully
```

### Restart

Users can restart mining remotely in a batch by using the restart command as follows:

```
restart
```

```
$ ./braiins-toolbox miner restart [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner restart command is used tells the Toolbox that the defined devices should restart mining
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and restart
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner restart
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

Available options are just the global one, see here.

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner restart --helpRestart Braiins OS miners
Usage: braiins-toolbox miner restart [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Restart mining on defined IP address(es)

```
$ ./braiins-toolbox restart '10.10.10.2'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner restart is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner restart on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners restarted successfully
$ ./braiins-toolbox miner restart '10.10.10.*'
```

Restart mining on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner restart --ip-file 'input.txt'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner restart is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner restart on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners restarted successfully
```

### Pause

Users can pause mining remotely in a batch by using the pause subcommand as follows:

```
pause
```

```
$ ./braiins-toolbox miner pause [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner pause command is used tells the Toolbox that the defined devices should pause mining
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and pause
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e. I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner pause
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

Available options are just the global one, see here.

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner pause --helpPause mining
Usage: braiins-toolbox miner pause [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Pause mining on defined IP address(es)

```
$ ./braiins-toolbox miner pause '10.10.10.2'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner pause is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner pause on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners paused successfully
$ ./braiins-toolbox miner pause '10.10.10.*'
```

Pause mining on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner pause --ip-file 'input.txt'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner pause is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner pause on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners paused successfully
```

### Resume

Users can resume mining remotely in a batch by using the resume subcommand as follows:

```
resume
```

```
$ ./braiins-toolbox miner resume [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner resume command is used tells the Toolbox that the defined devices should resume mining
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and resume
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e. I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner resume
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

Available options are just the global one, see here.

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner resume --helpResume mining
Usage: braiins-toolbox miner resume [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
Options:
```

#### Usage Examples

Resume mining on defined IP address(es)

```
$ ./braiins-toolbox miner resume '10.10.10.2'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner resume is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner resume on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners resumed successfully
$ ./braiins-toolbox miner resume '10.10.10.*'
```

Resume mining on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner resume --ip-file 'input.txt'
​2023-05-07T20:32:49.227703Z  INFO scan: braiins_toolbox::scanner: scanning 1 ip addresses...​2023-05-07T20:32:49.395999Z  INFO scan: braiins_toolbox::scanner: discovered 1 miners​2023-05-07T20:32:49.396000Z  INFO scan: braiins_toolbox::scanner: miner resume is supported for 1/1 miners​2023-05-07T20:32:49.396025Z  INFO braiins_toolbox::commands: running miner resume on 1 miners...​2023-05-07T20:32:49.524623Z  INFO braiins_toolbox::commands: 1/1 miners resumed successfully
```

### Set Pool URLs

Users can set pool URLs remotely in a batch by using the set-pool-urls command as follows:

```
set-pool-urls
```

```
$ ./braiins-toolbox miner set-pool-urls [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner set-pool-urls command is used tells the Toolbox that the defined devices should change pool settings
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and pools configuration
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner set-pool-urls
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

Within this feature it is supported to use pool username templates as well. See for more details in the Help below.

#### Options

Available options are the global ones, see here, or pool specific:

- option --url serves for defining the pool URL, mining protocol, pool username and pool password
- option --url-file serves a path to the file, where the pool URL, mining protocol, pool username and pool password are defined in the same form as in the option --url

```
--url
```

```
--url-file
```

```
--url
```

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner set-pool-urls --helpSet pool URLs on Braiins OS, Antminers and Whatsminers. For Braiins OS set the first pool group
Usage: braiins-toolbox miner set-pool-urls [OPTIONS] <--url <URL>|--url-file <FILE>> <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...          List of IP addresses or ranges
```

#### Usage Examples:

Set pool URL on defined IP address(es)

```
$ ./braiins-toolbox miner set-pool-urls --url 'stratum+tcp://user@stratum.braiins.com:3333' '10.10.10.2'
​2023-05-07T20:54:57.826828Z  INFO braiins_toolbox::miner::set_pool_urls: scanning 1 ip addresses...​2023-05-07T20:54:57.940910Z  INFO braiins_toolbox::miner::set_pool_urls: discovered 1 miners​2023-05-07T20:54:57.940925Z  INFO braiins_toolbox::miner::set_pool_urls: pool URLs configuration is supported for 1/1 miners​2023-05-07T20:54:58.056905Z  INFO braiins_toolbox::miner::set_pool_urls: 1/1 miners configured successfully with new pool URLs
$ ./braiins-toolbox miner set-pool-urls --url 'stratum+tcp://user@stratum.braiins.com:3333' '10.10.10.*'
```

Set pool URL on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner set-pool-urls --url 'stratum+tcp://user@stratum.braiins.com:3333' --ip-file 'input.txt'
​2023-05-07T20:54:57.826828Z  INFO braiins_toolbox::miner::set_pool_urls: scanning 1 ip addresses...​2023-05-07T20:54:57.940910Z  INFO braiins_toolbox::miner::set_pool_urls: discovered 1 miners​2023-05-07T20:54:57.940925Z  INFO braiins_toolbox::miner::set_pool_urls: pool URLs configuration is supported for 1/1 miners​2023-05-07T20:54:58.056905Z  INFO braiins_toolbox::miner::set_pool_urls: 1/1 miners configured successfully with new pool URLs
```

Set several pool URLs on defined IP address(es)

```
$ ./braiins-toolbox miner set-pool-urls --url 'stratum+tcp://user1@stratum.braiins.com:3333' --url 'stratum+tcp://user2@eu.stratum.braiins.com:3333' '10.10.10.2'
​2023-05-07T21:01:03.711721Z  INFO braiins_toolbox::miner::set_pool_urls: scanning 1 ip addresses...​2023-05-07T21:01:03.858566Z  INFO braiins_toolbox::miner::set_pool_urls: discovered 1 miners​2023-05-07T21:01:03.858582Z  INFO braiins_toolbox::miner::set_pool_urls: pool URLs configuration is supported for 1/1 miners​2023-05-07T21:01:03.987328Z  INFO braiins_toolbox::miner::set_pool_urls: 1/1 miners configured successfully with new pool URLs
```

Set several pool URLs defined in the file pools.txt on defined IP address(es)

```
$ ./braiins-toolbox miner set-pool-urls --url-file 'pools.txt' '10.10.10.2'
​2023-05-07T21:01:03.711721Z  INFO braiins_toolbox::miner::set_pool_urls: scanning 1 ip addresses...​2023-05-07T21:01:03.858566Z  INFO braiins_toolbox::miner::set_pool_urls: discovered 1 miners​2023-05-07T21:01:03.858582Z  INFO braiins_toolbox::miner::set_pool_urls: pool URLs configuration is supported for 1/1 miners​2023-05-07T21:01:03.987328Z  INFO braiins_toolbox::miner::set_pool_urls: 1/1 miners configured successfully with new pool URLs
```

Set pool URL with a miner MAC address as a username

```
$ ./braiins-toolbox miner set-pool-urls --url 'stratum+tcp://user1.{{miner.mac}}@stratum.braiins.com:3333' '10.10.10.2'
​2023-05-07T21:01:03.711721Z  INFO braiins_toolbox::miner::set_pool_urls: scanning 1 ip addresses...​2023-05-07T21:01:03.858566Z  INFO braiins_toolbox::miner::set_pool_urls: discovered 1 miners​2023-05-07T21:01:03.858582Z  INFO braiins_toolbox::miner::set_pool_urls: pool URLs configuration is supported for 1/1 miners​2023-05-07T21:01:03.987328Z  INFO braiins_toolbox::miner::set_pool_urls: 1/1 miners configured successfully with new pool URLs
```

### Set Mode

Users can set power mode remotely in a batch by using the set-mode command as follows (only for Bitmain stock FW):

```
set-mode
```

```
$ ./braiins-toolbox miner set-mode [OPTIONS] <MODE> <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner set-mode command is used tells the Toolbox that the defined devices should change power mode
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and pools configuration
- <MODE> defines one of the available power modes for Bitmain stock FW: Normal or Low or Sleep
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner set-mode
```

```
[OPTIONS]
```

```
<MODE>
```

```
Normal
```

```
Low
```

```
Sleep
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

Available options are the global ones, see here, or pool specific:

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner set-mode --helpSet miner mode on Bitmain Stock (Antminer) and MicroBT Stock (WhatsMiner)
Usage: braiins-toolbox miner set-mode [OPTIONS] <MODE> <IP_LIST|--ip-file <FILE>>Arguments:  <MODE>        Miner mode [possible values: high, normal, low, sleep]  [IP_LIST]...  List of IP addresses or ranges
```

#### Usage Examples:

Set low power mode on defined IP address(es)

```
$ ./braiins-toolbox miner set-mode low '10.10.10.2'
​2023-10-18T10:27:39.047416Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-10-18T10:27:39.568047Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-10-18T10:27:39.568134Z  INFO scan: braiins_toolbox::scanner: miner mode is supported for 1/1 miners​2023-10-18T10:27:39.578577Z  INFO braiins_toolbox::commands: running configuration of miner mode on 1 miners...​2023-10-18T10:27:53.646000Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
$ ./braiins-toolbox miner set-mode low '10.10.10.*'
```

Set low power mode on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner set-mode low --ip-file 'input.txt'
​2023-10-18T10:27:39.047416Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-10-18T10:27:39.568047Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-10-18T10:27:39.568134Z  INFO scan: braiins_toolbox::scanner: miner mode is supported for 1/1 miners​2023-10-18T10:27:39.578577Z  INFO braiins_toolbox::commands: running configuration of miner mode on 1 miners...​2023-10-18T10:27:53.646000Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
```

### Set Power Limit

Users can set power limit remotely in a batch by using the set-power-limit command as follows (only for MicroBT stock FW):

```
set-power-limit
```

```
$ ./braiins-toolbox miner set-power-limit [OPTIONS] <POWER_LIMIT> <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that miner set-power-limit command is used tells the Toolbox that the defined devices should change power limit on Whatsminers with a supported version of MicroBT firmware
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning and pools configuration
- <POWER_LIMIT> is a positive integer number which will define power limit value to be used by the miners
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file <FILE>

```
miner set-power-limit
```

```
[OPTIONS]
```

```
<POWER_LIMIT>
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

Available options are the global ones, see here, or pool specific:

#### Help

Calling help command serves as a quick description of the command:

```
$ ./braiins-toolbox miner set-power-limit --helpSet power limit on MicroBT Stock (WhatsMiner)
Usage: braiins-toolbox miner set-power-limit [OPTIONS] <POWER_LIMIT> <IP_LIST|--ip-file <FILE>>Arguments:  <POWER_LIMIT>  Positive integer number between 0-99999  [IP_LIST]...   List of IP addresses or ranges
```

#### Usage Examples:

Set power limit 3000 Watts on defined IP address(es)

```
$ ./braiins-toolbox miner set-power-limit 3000 '10.10.10.2'
​2023-10-18T10:27:39.047416Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-10-18T10:27:39.568047Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-10-18T10:27:39.568134Z  INFO scan: braiins_toolbox::scanner: power limit is supported for 1/1 miners​2023-10-18T10:27:39.578577Z  INFO braiins_toolbox::commands: running configuration of power limit on 1 miners...​2023-10-18T10:27:53.646000Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
$ ./braiins-toolbox miner set-power-limit 3000 '10.10.10.*'
```

Set power limit 3000 Watts on IP address(es) defined in the text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox miner set-power-limit 3000 --ip-file 'input.txt'
​2023-10-18T10:27:39.047416Z  INFO scan: braiins_toolbox::scanner: scanning 1 IP addresses...​2023-10-18T10:27:39.568047Z  INFO scan: braiins_toolbox::scanner: discovered 1 online miners​2023-10-18T10:27:39.568134Z  INFO scan: braiins_toolbox::scanner: miner mode is supported for 1/1 miners​2023-10-18T10:27:39.578577Z  INFO braiins_toolbox::commands: running configuration of miner mode on 1 miners...​2023-10-18T10:27:53.646000Z  INFO braiins_toolbox::commands: 1/1 miners configured successfully
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/cmd-miner/
**Scraped**: 2025-12-28
