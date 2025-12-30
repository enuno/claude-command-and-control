# Cooling Management

- GUI
- CLI

## GUI

The cooling management capabilities enable the user to manage the cooling method by choosing either air cooling or immersion cooling.

## CLI

Starting with Toolbox 25.10, the cooling command has been extended beyond basic mode switching to include full configuration of cooling parameters such as temperature thresholds and fan settings.

The CLI now supports two subcommands:

- set: configure cooling mode, temperatures, and fan parameters (new)
- set-mode: legacy command for switching between standard and immersion modes (deprecated)

```
set
```

```
set-mode
```

```
$ ./braiins-toolbox cooling --helpCooling management - cooling configuration
Usage: braiins-toolbox cooling [OPTIONS] <COMMAND>
Commands:  set       Set cooling mode  set-mode  Set cooling mode. Command is DEPRECATED, please use `set` command instead
```

### Set

The new set subcommand provides unified configuration for all thermal management parameters on supported Braiins OS devices (≥ 25.01).

```
set
```

```
$ ./braiins-toolbox cooling set [OPTIONS] [--mode <MODE>] [--target-temp <°C>] [--hot-temp <°C>] [--dangerous-temp <°C>] [--fixed-fan-speed <%>] [--min-required-fans <N>] [--custom-fan-range <MIN%>-<MAX%>] [--fan-paused-mode <auto|manual>] [--fan-paused-pwm <%>] <IP_LIST|--ip-file <FILE>>
```

#### Supported Parameters

```
--mode
```

```
auto
```

```
manual
```

```
immersion
```

```
braiins-toolbox cooling set --mode auto 192.168.1.10
```

```
--target-temp
```

```
--target-temp 70
```

```
--hot-temp
```

```
--hot-temp 85
```

```
--dangerous-temp
```

```
--dangerous-temp 95
```

```
--fixed-fan-speed
```

```
--mode manual --fixed-fan-speed 70
```

```
--min-required-fans
```

```
--min-required-fans 2
```

```
--custom-fan-range
```

```
--mode auto --custom-fan-range 30-90
```

```
--fan-paused-mode
```

```
auto
```

```
manual
```

```
--fan-paused-mode manual
```

```
--fan-paused-pwm
```

```
--fan-paused-mode manual
```

```
--fan-paused-mode manual --fan-paused-pwm 50
```

#### Validation and Behavior

- Conflicting parameters (e.g., --fixed-fan-speed with --mode auto) cause immediate CLI errors.
- Devices running unsupported BOS versions are skipped with explanatory CLI messages.
- For immersion/hydro models, fan parameters are ignored with warnings.

```
--fixed-fan-speed
```

```
--mode auto
```

#### Examples

Set manual mode with fixed fan speed at 70%:

```
$ ./braiins-toolbox cooling set --mode manual --fixed-fan-speed 70 192.168.1.10
```

Set automatic mode with custom fan range 30–90% and target temperature 70 °C:

```
$ ./braiins-toolbox cooling set --mode auto --custom-fan-range 30-90 --target-temp 70 192.168.1.10
```

Set paused fan mode to manual with PWM 50% (BOS ≥ 25.05):

```
$ ./braiins-toolbox cooling set --fan-paused-mode manual --fan-paused-pwm 50 192.168.1.10
```

Apply all configurations on IPs listed in a text file:

```
$ ./braiins-toolbox cooling set --mode auto --target-temp 70 --custom-fan-range 30-90 --ip-file devices.txt
```

#### Version Requirements Summary

```
--mode
```

```
--target-temp
```

```
--hot-temp
```

```
--dangerous-temp
```

```
--fixed-fan-speed
```

```
--min-required-fans
```

```
--custom-fan-range
```

```
--fan-paused-mode
```

```
--fan-paused-pwm
```

### Set Mode (Deprecated)

- ⚠️ Deprecated — use cooling set instead.
- The legacy command remains functional for backward compatibility but will be removed in future releases.

```
cooling set
```

The previous CLI command for switching between cooling modes:

```
$ ./braiins-toolbox cooling set-mode [OPTIONS] <MODE> <IP_LIST|--ip-file <FILE>>
```

Possible values for <MODE>:

```
<MODE>
```

- standard: suitable for air-cooled devices
- immersion: suitable for immersion-cooled devices

```
standard
```

```
immersion
```

#### Examples

Set immersion mode on a single IP:

```
$ ./braiins-toolbox cooling set-mode immersion '10.10.10.2'
```

Set standard mode on a range of IPs:

```
$ ./braiins-toolbox cooling set-mode standard '10.10.10.1-10'
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

**Source**: https://academy.braiins.com/en/braiins-toolbox/cmd-cooling/
**Scraped**: 2025-12-28
