# Troubleshooting

## Troubleshooting

### Logs

In case of any errors, logs can be downloaded from the GUI.

They are otherwise stored in the following folder locations:

- Windows: C:\Users\<USERNAME>\AppData\Local\braiins-toolbox\logs
- Linux: ~/.local/share/braiins-toolbox,
- macOS: /Users/<user>/Library/Application\ Support/braiins-toolbox/logs, where <user> stands for the user (e.g. admin).

```
C:\Users\<USERNAME>\AppData\Local\braiins-toolbox\logs
```

```
~/.local/share/braiins-toolbox
```

```
/Users/<user>/Library/Application\ Support/braiins-toolbox/logs
```

```
<user>
```

```
admin
```

If necessary, contact Braiins support for the help.

### Slow Network

In case of problems with slow network, it is recommended to use following arguments modified appropriately (decrease of concurrency, decrease of scan rate and increase of timeout) the values with respect to default values:

- concurrency - maximum number of parallel operations (install, uninstall, upgrade), default value for both is 10. Argument manages a number of parallel actions.
- scan rate - argument manages a number of scanned IP addresses per second, default value is 2000.
- timeout - timeout for network operations, default value is 8s.

### List Of Miners Supported For Braiins OS Installation

The list of supported miner models for remote installation can be found in this table.

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

**Source**: https://academy.braiins.com/en/braiins-toolbox/troubleshooting/
**Scraped**: 2025-12-28
