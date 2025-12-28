# Limitations

## Braiins OS Version

Please refer to the list of commands below for which commands are backwards compatible with older versions of Braiins OS and which are not supported by older versions of Braiins OS. All the commands below work with Braiins OS 23.03 or newer.

```
scan
```

```
firmware install
```

```
firmware uninstall
```

```
firmware upgrade
```

```
system collect-data
```

```
system reboot
```

```
system locate-device
```

```
system execute
```

```
system set-network
```

```
miner start
```

```
miner stop
```

```
miner restart
```

```
miner pause
```

```
miner resume
```

```
miner set-pool-urls
```

```
tuner target
```

```
tuner set-dps
```

```
tuner remove-profiles
```

```
cooling set
```

```
cooling set-mode
```

```
cooling set
```

```
custom-contract
```

The legacy cooling set-mode command remains functional for backward compatibility but is deprecated.
It is internally mapped to cooling set --mode with limited values (standard, immersion) and will emit a deprecation warning.

```
cooling set-mode
```

```
cooling set --mode
```

```
standard
```

```
immersion
```

## Support Of Different Firmwares

Overview table showing what feature is supported for different firmwares.

To manage Whatsminers, they need to have the API enabled, a process that can be accomplished using the Whatsminer tool, available for download here.

The Whatsminer API may encounter issues with some of its endpoints. Therefore, we provide the firmware versions corresponding to each Toolbox feature for Whatsminer firmware.

- reboot works on version 20230911.12 and 20221009.17
- locate device works on versions 20221009.17 and 20220422.18
- pause works on version 20230911.12 and 20221009.17 and newer
- resume works on version 20230911.12 and 20221009.17 and newer
- set pools works on version 20230911.12 and newer
- set power target works on version 20230911.12 and 20221009.17 and newer

```
reboot
```

```
locate device
```

```
pause
```

```
resume
```

```
set pools
```

```
set power target
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/limitations/
**Scraped**: 2025-12-28
