# Network Scan

- GUI
- CLI

## GUI

The network scanning functionality allows user to initiate a scan to discover on your network:

### Braiins

- Braiins Mini Miner family

### Antminers

- S21 family
- S19 family
- S17 family

### Whatsminers

- M5x family
- M3x family
- M2x family

### Avalons (Beta Support)

- A15xy family
- A14xy family
- A13xy family
- A12xy family
- A11xy family
- A10xy family

### Icerivers

- KAS family

The output of the scan procedure is a comprehensive list of the discovered devices, which is presented in the Device List tab.

Since Braiins Toolbox version 24.02 the device list in the GUI is periodically refreshed to ensure it stays up-to-date.

## CLI

The equivalent to the scanning functionality in CLI is a scan command. The progress of the discovery procedure is displayed in the terminal. The format for this command is:

```
scan
```

```
$ ./braiins-toolbox scan [OPTIONS] <IP_LIST|--ip-file <FILE>>
```

where:

- the fact that scan command is used tells the Toolbox that it should scan the network defined by IP range(s)
- [OPTIONS] is a (possibly empty) list of options to be used during discovery scanning
- [IP_LIST] is a list of IP addresses or ranges separated by space(s) with each member having the form of <O1>.<O2>.<O3>.<O4>, where each <Oi> is either an integer number between 0 and 255, range of two integers between 0 and 255 (i.e., I1-I2 with I1 ≤ I2) or symbol * representing the whole range
- or instead of [IP_LIST] it is possible to apply IP addresses as an input from a text file with --ip-file

```
scan
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
--ip-file
```

### Options

Available options are the global ones, see here, or the scan specific:

- --ip-file, which defines a path to a file containing a list of IP addresses or ranges, one per line
- --include-public-ips is a switch that removes the default restriction of scanning only private and link-local IP addresses
- --all-devices is a switch that includes unrecognized and password-protected devices in the output
- --installable-only,which displays devices where it is possible to install Braiins OS (i.e., supported devices with stock manufacturer firmware)
- --format, which defines the format of the output (output is called “device list”)

table: default format, detailed device list
plain: lightweight device list in form of a list of discovered IP addresses
csv: full device list in the csv format
- table: default format, detailed device list
- plain: lightweight device list in form of a list of discovered IP addresses
- csv: full device list in the csv format
- --output, where the user defines the path to the file for saving the device list

```
--ip-file
```

```
--include-public-ips
```

```
--all-devices
```

```
--installable-only
```

```
--format
```

- table: default format, detailed device list
- plain: lightweight device list in form of a list of discovered IP addresses
- csv: full device list in the csv format

```
table
```

```
plain
```

```
csv
```

```
--output
```

### Help

The help option gives the user a quick overview of the command capabilities:

```
$ ./braiins-toolbox scan --help
Scan the provided IP addresses or ranges and print all discovered miners to stdout
Usage: braiins-toolbox scan [OPTIONS] <IP_LIST|--ip-file <FILE>>Arguments:  [IP_LIST]...  List of IP addresses or ranges
```

### Usage Examples

#### Scan 1 IP range

```
$ ./braiins-toolbox scan '10.10.*.2'
​2023-05-01T19:09:16.812095Z  INFO braiins_toolbox::scan: scanning 256 ip addresses...​MAC Address        Device ID         IP Address  Firmware      Mode  Model             Control Board  Hostname      Version​FE:75:73:15:D3:C7  41pOfSAFanNwZUMr  10.10.5.2   Braiins OS    SD    Antminer S19      Zynq           Antminer      2023-04-21-0-aa63b2b7-23.04-plus-rc​3C:A3:08:6E:8B:7A  SbXSNNYaIknbbTtm  10.10.12.2  Braiins OS    SD    Antminer S19 XP   BBB            Antminer      2023-04-24-0-b2cc5307-23.03.1-plus-rc​DA:0F:06:4B:3D:60  -                 10.10.8.2   Bitmain Stock -     Antminer S19 XP   CVITEK         Antminer      Fri Oct 28 12:56:58 CST 2022​04:BB:DB:7F:82:51  3cMGBTRfSFan7Nd0  10.10.51.2  Braiins OS    SD    Antminer S9       Zynq           miner-7f8251  2022-09-27-0-26ba61b9-22.08.1-plus​2023-05-01T19:09:20.026977Z  INFO braiins_toolbox::scan: discovered 4 miners(0 installable)
```

#### Scan 2 IP ranges

```
$ ./braiins-toolbox scan '10.10.*.2' '10.11.0-255.2'
​2023-05-01T19:15:21.040511Z  INFO braiins_toolbox::scan: scanning 512 ip addresses...​MAC Address        Device ID         IP Address  Firmware      Mode  Model             Control Board  Hostname      Version​FE:75:73:15:D3:C7  41pOfSAFanNwZUMr  10.10.5.2   Braiins OS    SD    Antminer S19      Zynq           Antminer      2023-04-21-0-aa63b2b7-23.04-plus-rc​3C:A3:08:6E:8B:7A  SbXSNNYaIknbbTtm  10.10.12.2  Braiins OS    SD    Antminer S19 XP   BBB            Antminer      2023-04-24-0-b2cc5307-23.03.1-plus-rc​DA:0F:06:4B:3D:60  -                 10.10.8.2   Bitmain Stock -     Antminer S19 XP   CVITEK         Antminer      Fri Oct 28 12:56:58 CST 2022​04:BB:DB:7F:82:51  3cMGBTRfSFan7Nd0  10.10.51.2  Braiins OS    SD    Antminer S9       Zynq           miner-7f8251  2022-09-27-0-26ba61b9-22.08.1-plus
```

#### Scan network with an input in a text file input.txt

```
input.txt
```

```
$ ./braiins-toolbox scan --ip-file 'input.txt'
​2023-05-01T19:15:21.040511Z  INFO braiins_toolbox::scan: scanning 307 ip addresses...​MAC Address        Device ID         IP Address  Firmware      Mode  Model            Control Board  Hostname      Version​FE:75:73:15:D3:C7  41pOfSAFanNwZUMr  10.10.5.2   Braiins OS    SD    Antminer S19     Zynq           Antminer      2023-04-21-0-aa63b2b7-23.04-plus-rc​3C:A3:08:6E:8B:7A  SbXSNNYaIknbbTtm  10.10.12.2  Braiins OS    SD    Antminer S19 XP  BBB            Antminer      2023-04-24-0-b2cc5307-23.03.1-plus-rc​DA:0F:06:4B:3D:60  -                 10.10.8.2   Bitmain Stock -     Antminer S19 XP  CVITEK         Antminer      Fri Oct 28 12:56:58 CST 2022​04:BB:DB:7F:82:51  3cMGBTRfSFan7Nd0  10.35.51.2  Braiins OS    SD    Antminer S9      Zynq           miner-7f8251  2022-09-27-0-26ba61b9-22.08.1-plus
```

#### Scan the network only for installable devices (unsupported as well as devices with Braiins OS installed on them are not displayed.)

```
$ ./braiins-toolbox scan --installable-only '10.10.*.2'
​2023-05-01T19:42:50.982704Z  INFO braiins_toolbox::scan: scanning 256 ip addresses...​2023-05-01T19:42:54.298224Z  INFO braiins_toolbox::scan: discovered 29 miners(0 installable)
```

#### Scan network with output in csv format

```
$ ./braiins-toolbox scan --format csv '10.10.*.2'
​2023-05-01T19:48:19.511154Z  INFO braiins_toolbox::scan: scanning 256 ip addresses...​csv​mac_address,device_id,ip_address,firmware,mode,model,control_board,hostname,version​csv​00:0A:35:FF:FF:FF,9v1WmwbeWThnpvdc,10.10.1.2,Braiins OS,NAND,Antminer S9,Zynq,miner-ffffff,2022-09-27-0-26ba61b9-22.08.1-plus​csv​4E:4E:7C:F3:8C:FD,bPgNWlauzsUhGFoR,10.10.11.2,Braiins OS,NAND,Antminer S9,Zynq,miner-f38cfd,2022-03-26-0-5091157d-22.03-plus-nightly​csv​00:0A:35:FF:FF:FF,2IK68av6jahk8bAd,10.10.10.2,Braiins OS,SD,Antminer S9,Zynq,miner-ffffff,2022-09-27-0-26ba61b9-22.08.1-plus​csv​52:0C:21:E5:F2:48,vyaebpIIfrkj4r9I,10.10.6.2,Braiins OS,NAND,Antminer S9,Zynq,miner-e5f248,2022-04-05-0-ddf6a75b-22.04-plus-nightly​csv​42:95:B0:C4:1C:E9,65r7DH9bWxvNrwzy,10.10.3.2,Braiins OS,SD,Antminer S9,Zynq,miner-c41ce9,2022-09-27-0-26ba61b9-22.08.1-plus
```

#### Scan network with output in plain format

```
$ ./braiins-toolbox scan --format plain '10.10.*.2'
​2023-05-01T19:51:36.222566Z  INFO braiins_toolbox::scan: scanning 256 ip addresses...​10.10.3.2​10.10.1.2​10.10.6.2​10.10.11.2​10.10.4.2​10.10.10.2
```

#### Scan network and persist the result in the file out.txt

```
out.txt
```

```
$ ./braiins-toolbox scan --format plain '10.10.*.2' --output 'out.txt'
​2023-05-01T20:00:36.609877Z  INFO braiins_toolbox::scan: scanning 256 ip addresses...​2023-05-01T20:00:39.803100Z  INFO braiins_toolbox::scan: discovered 9 miners(0 installable)
$ cat 'out.txt'
​10.10.1.2​10.10.6.2
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/cmd-scan/
**Scraped**: 2025-12-28
