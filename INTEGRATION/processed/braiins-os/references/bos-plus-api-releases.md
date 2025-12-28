# Releases

Version history for this repository (18 releases).

## 1.8.0: 1.8.0
**Published:** 2025-11-25

## [1.8.0] - 2025-11-25
Version **1.8.0** introduces new Upgrade service `braiins.bos.v1.UpgradeService` and relative power/hashrate target configuration.

### Added
* Introduced new field `uid` in the `braiins.bos.v1.PoolGroup` message to get group uid.
* Introduced new service `braiins.bos.v1.UpgradeService` with methods:
  * `UpdateAutoUpgradeConfig` - enables/disables AutoUpgrade feature and configures upgrade schedule
  * `GetAutoUpgradeStatus` - retrieves current AutoUpgrade configuration and execution status
* Introduced new messages for AutoUpgrade scheduling:
  * `units.DayOfWeek` enum and custom `upgrade.UpgradeTime` message for schedule configuration
  * `DailySchedule` - schedule upgrades to run daily at a specific time
  * `WeeklySchedule` - schedule upgrades to run weekly on a specific day of the week at a specific time
  * `MonthlySchedule` - schedule upgrades to run monthly on a specific day of the month (1-28) at a specific time
  * `AutoUpgradeSchedule` - oneof message that can contain any of the schedule types
  * `UpdateAutoUpgradeConfigRequest` - request message to update AutoUpgrade configuration
  * `UpdateAutoUpgradeConfigResponse` - response message containing enabled status and next execution timestamp
  * `GetAutoUpgradeStatusRequest` - request message to get AutoUpgrade status
  * `GetAutoUpgradeStatusResponse` - response message containing enabled status, schedule, next execution, and last execution timestamps
* Introduced new enumeration `RelativeTargetReference` with `NOMINAL`, `MIN`, `MAX` and `CURRENT` variants.
* Introduced new message `SetRelativeTargetRequest` with `save_action`, `percentage` and `reference` fields.
* Introduced new methods `SetRelativePowerTarget` and `SetRelativeHashrateTarget`. User can now set power and hashrate targets relative to a reference value

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.8.0)

---

## 1.7.0: 1.7.0
**Published:** 2025-08-10

## [1.7.0] - 2025-08-10
Version **1.7.0** introduces changes to `braiins.bos.v1.PoolGroupConfiguration` and `braiins.bos.v1.PoolConfiguration`.

### Added
* Introduced new enumeration `braiins.bos.v1.FanPauseMode` with `FAN_PAUSE_MODE_AUTO` and `FAN_PAUSE_MODE_MANUAL` variants.
* Introduced new field `default_fan_pause_mode` in the `braiins.bos.v1.CoolingConstraints` message to get default fan pause mode.
* Introduced new messages `braiins.bos.v1.SetQuickRampingRequest`, `braiins.bos.v1.QuickRampingResponse` and `braiins.bos.v1.SetDefaultQuickRampingRequest`.
* Introduced new method `SetQuickRamping` in the `braiins.bos.v1.PerformanceService`. User can now set quick ramping time up and down values.
* Introduced new method `SetDefaultQuickRamping` in the `braiins.bos.v1.PerformanceService`. User can now set quick ramping time up and down to default.
* Introduced new fields `quick_ramping_time_up_s` and `quick_ramping_time_down_s` in the `braiins.bos.v1.HashboardPerformanceConfiguration` message to get quick ramping time up and down values.
* Introduced new field `quick_ramping_time_s` in the `braiins.bos.v1.HashboardConstraints` message to get quick ramping time constraints.

### Changed
* Mark `uid` for `braiins.bos.v1.PoolGroupConfiguration` and `braiins.bos.v1.PoolConfiguration` as optional. This change allows to create new pool group or pool without providing empty `uid` value. When new entity is created `uid` is generated automatically. When updating existing Pool Group with `UpdatePoolGroup` method, `uid` is required, otherwise error is returned back to the user.


[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.7.0)

---

## 1.6.0: 1.6.0
**Published:** 2025-06-10

## [1.6.0] - 2025-06-10
Version **1.6.0** introduces enhanced control of fan behavior during cooling mode curtailment and adds ability to apply Custom Contracts.

### Added
* Introduced new messages `PauseMode`, `AutoPauseMode` and `ManualPauseMode`.
* Introduced new field `pause_mode` in the `braiins.bos.v1.CoolingAutoMode` message to set and get pause cooldown fan speed for automatic cooling mode.
* Introduced new field `pause_mode` in the `braiins.bos.v1.CoolingManualMode` message to set and get pause cooldown fan speed for manual cooling mode.
* Introduced new field `pause_cooldown_fan_speed_ratio` in the `braiins.bos.v1.CoolingConstraints` message to get pause cooldown fan speed constraints.
* Introduced new method `ApplyContractKey` in the `braiins.bos.v1.LicenseService`. User can now apply contract key to miner and get licence.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.6.0)

---

## 1.5.0: 1.5.0
**Published:** 2025-04-09

## [1.5.0] - 2025-04-09
Version **1.5.0** extends Hashboard message to provide lowest inlet and highest outlet temperatures. And HW info including miner serial number from stock FW.

### Added
* Introduced new fields `lowest_inlet_temp`, `highest_outlet_temp` in the `braiins.bos.v1.Hashboard` message to get the lowest inlet and highest outlet temperature for a specific hashboard.
* Introduced new fields `serial_number`, `board_name` and `chip_type` in the `braiins.bos.v1.Hashboard` message.
* Introduced new `PsuInfo` message and added it to the `braiins.bos.v1.GetMinerDetailsResponse` message.
* Introduced new `ControlBoardSocFamily` enumeration and added it to the `braiins.bos.v1.GetMinerDetailsResponse` message.
* Introduced new field `serial_number` in the `braiins.bos.v1.GetMinerDetailsResponse` message.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.5.0)

---

## 1.4.0: 1.4.0
**Published:** 2025-02-27

## [1.4.0] - 2025-02-26
Version **1.4.0** introduces possibility to set DPS mode to `normal` or `boost`. It also extends cooling configuration with new values `immersion` and `hydro`.

### Added
* Introduced new enumeration `braiins.bos.v1.DPSMode` with `DPS_MODE_NORMAL` and `DPS_MODE_BOOST` variants.
* Introduced new field `mode` in the `braiins.bos.v1.DPSConfiguration`, `braiins.bos.v1.SetDPSRequest`, `braiins.bos.v1.SetDPSResponse` message to get or set DPS mode.
* Introduced new field `mode` in the `braiins.bos.v1.DPSConstraints` message to get the default value for DPS mode.
* Introduced new method `SetCoolingMode` in the `braiins.bos.v1.CoolingService`. User can now set cooling mode to `automatic`, `manual`, `hydro` or `immersion`. It gives user possibility to set specific temperature and fan settings for each mode.
* Introduced new field `min_fan_speed` in the `braiins.bos.v1.CoolingAutoMode` to set minimum fan speed for automatic cooling mode.
* Introduced new field `max_fan_speed` in the `braiins.bos.v1.CoolingAutoMode` to set maximum fan speed for automatic cooling mode.
* Introduced new field `min_fan_speed` in the `braiins.bos.v1.CoolingConstraints` to get default value for minimum fan speed for automatic cooling mode.
* Introduced new field `max_fan_speed` in the `braiins.bos.v1.CoolingConstraints` to get default value for maximum fan speed for automatic cooling mode.
* Introduced new field `target_temperature` in the `braiins.bos.v1.CoolingManualMode` to set target temperature for manual cooling mode.

### Changed
* Mark `SetImmersionMode` method as deprecated in `CoolingService`. Instead of this method, user should use `SetCoolingMode` with `immersion` mode.
* Extend `CoolingConfiguration` mode with new value `immersion` that represents immersion cooling mode.
* Extend `CoolingConfiguration` mode with new value `hydro` that represents hydro cooling mode.
* Mark `disabled` cooling mode as deprecated in `CoolingConfiguration` mode.
* Mark `minimum_required_fans` field as deprecated in `CoolingConfiguration`. Instead user should use `minimum_required_fans` field in `CoolingAutoMode` or `CoolingManualMode`.
* Extend `CoolingAutoMode` with new field `minimum_required_fans`.
* Extend `CoolingManualMode` with new field `minimum_required_fans`.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.4.0)

---

## 1.3.0: 1.3.0
**Published:** 2024-10-22

# [1.3.0] - 2024-10-22
Version **1.3.0** introduces few small improvements.

### Changed
* Extended `braiins.bos.v1.Platform` enumeration with `PLATFORM_STM32MP157C_II2_BMM1` variant,
* Extended `braiins.bos.v1.SupportArchiveFormat` enumeration with `SUPPORT_ARCHIVE_FORMAT_ZIP_ENCRYPTED` variant.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.3.0)

---

## 1.2.0: 1.2.0
**Published:** 2024-07-17

# [1.2.0] - 2024-07-17
Version **1.2.0** introduces the possibility to configure all pool groups at once and read Braiins OS errors.

### Added
* Introduced new field `model` in the `braiins.bos.v1.Hashboard` message that contains hashboard name,
* Introduced new method `GetErrors` in the `braiins.bos.v1.MinerService` to get all miner errors,
* Introduced new method `SetPoolGroups` in the `braiins.bos.v1.PoolService` to set all Pool groups at once.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.2.0)

---

## 1.1.0: 1.1.0
**Published:** 2024-05-09

# [1.1.0] - 2024-05-09
Version **1.1.0** introduce possibility to read network configuration, changes in authentication and few more changes. 

### Added
* Introduced new field `last_share_time` in the `braiins.bos.v1.PoolStats` that provides info about last share time,
* Introduced new field `token` in the `braiins.bos.v1.LoginResponse` that provides info created authentication token that was till now available only in response header,
* Introduced new field `timeout_s` in the `braiins.bos.v1.LoginResponse` that provides info about authentication token expiration time,
* Introduced new method `GetNetworkInfo` in the `braiins.bos.v1.NetworkService` to get current network configuration for the default network interface,
* Introduced new field `kernel_version` in the `braiins.bos.v1.GetMinerDetailsResponse` that provides info about Kernel version.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.1.0)

---

## 1.0.0: 1.0.0
**Published:** 2024-03-27

## [1.0.0] - 2024-03-27
The first stable release of the Public API incorporates minor enhancements.

### Added
* Introduced new field `enabled` in the `braiins.bos.v1.DPSConfiguration` that provides info, if DPS is enabled by default or not.
* Introduced new field `enabled` in the `braiins.bos.v1.TunerConstraints` that provides info, if DPS is enabled by default or not.
* Introduced new field `default_mode` in the `braiins.bos.v1.TunerConstraints` that provides info about the default tuner mode.
* Introduced new field `status` in the `braiins.bos.v1.GetMinerDetailsResponse` that provides info about the current miner status.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0)

---

## 1.0.0-beta.6: 1.0.0-beta.6
**Published:** 2024-03-05

## [1.0.0-beta.6] - 2024-03-05
Version **1.0.0-beta.6** contains one new feature Network configuration.

### Added
New `braiins.bos.v1.NetworkService` with `GetNetworkConfiguration` and `SetNetworkConfiguration` methods


[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-beta.6)

---

## 1.0.0-beta.5: 1.0.0-beta.5
**Published:** 2023-12-18

# [1.0.0-beta.5] - 2023-12-19
Version **1.0.0-beta.5** contains one small extension.

### Added
Extension of the `braiins.bos.v1.Platform` enumeration with new value for Zynq.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-beta.5)

---

## 1.0.0-beta.4: 1.0.0-beta.4
**Published:** 2023-11-23

## [1.0.0-beta.4] - 2023-11-23
Version **1.0.0-beta.4** contains one new feature and one breaking change.

### Added
* We added option to clean tuner profiles by adding `braiins.bos.v1.PerformanceService::RemoveTunedProfiles`
* Introduced a new field `system_uptime_s` in the `braiins.bos.v1.GetMinerDetailsResponse` that replaces `system_uptime`(marked as deprecated) to keep the best practice that a field name should also describe the unit (when applicable).

### Breaking Changes:
* We reverted removing `braiins.bos.v1.MinerModel` enumeration from the previous release because this change was causing troubles to our users.
  Instead of dropping enumeration, we decided to mark it as deprecated and introduce new field `miner_model` for string representation.


[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-beta.4)

---

## 1.0.0-beta.3: 1.0.0-beta.3
**Published:** 2023-11-02

Version **1.0.0-beta.3** contains a few minor improvements.

### Added
* Extension of the `braiins.bos.v1.GetMinerDetailsResponse` message with `bosminer_uptime_s` field that contains bosminer uptime.

### Breaking Changes:
* We removed `braiins.bos.v1.MinerModel` enumeration and changed type of `model` field in `braiins.bos.v1.MinerIdentity` to `string`. Replacing model enumeration with string eliminates the need to release a new version every time we add support for new model,

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-beta.3)

---

## 1.0.0-beta.2: 1.0.0-beta.2
**Published:** 2023-08-11

New version 1.0.0-beta.2 extends performance management and Pool Group management possibilities. It also introduces an API to get Mining Status.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-beta.2)

---

## 1.0.0-beta.1: 1.0.0-beta.1
**Published:** 2023-08-11

New version **1.0.0-beta.1**, enhances the authentication functionalities while also introducing two new features: Device Location and Support Archive.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-beta.1)

---

## 1.0.0-beta: 1.0.0-beta
**Published:** 2023-08-11

New version 1.0.0-beta, introduces a significant addition: the all-new BOS+ License feature.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-beta)

---

## 1.0.0-alpha.1: 1.0.0-alpha.1
**Published:** 2023-08-07

New version 1.0.0-alpha.1 extends authentication options and introduces new features, **Locate Device** and **Support Archive**.


[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-alpha.1)

---

## 1.0.0-alpha: 1.0.0-alpha
**Published:** 2023-05-05

First release for new Braiins OS+ Public API.

[View on GitHub](https://github.com/braiins/bos-plus-api/releases/tag/1.0.0-alpha)

---

