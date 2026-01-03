# Releases

Version history for this repository (10 releases).

## dotnet-v1.0.0: .NET NuGet v1.0.0
**Published:** 2025-01-23

## This update brings the .NET SDK binding to 1.0!

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/dotnet-v1.0.0)

---

## python-v1.0.0: Python v1.0.0
**Published:** 2024-09-30

## This update brings the Python SDK binding to 1.0! Notable and breaking changes:

- Renames access_token_login function to login_access_token, placed within auth
- Refactors Secrets and Projects Create and Update functions
- Adds two Secrets functions, get_by_ids and sync
- Other changes behind the scenes

**NOTE:** Most of these breaking changes were included in the 0.1.1 release, this is the correct semver bump

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/python-v1.0.0)

---

## napi-v1.0.0: napi v1.0.0
**Published:** 2024-09-30

## This update brings the NAPI SDK binding to 1.0! Notable and breaking changes:

- Renames accessTokenLogin function to loginAccessToken, placed within auth
- Refactors Secrets and Projects Create and Update functions
- Adds two Secrets functions, getByIds and sync
- Other changes behind the scenes

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/napi-v1.0.0)

---

## bws-v1.0.0: bws CLI v1.0.0
**Published:** 2024-09-26

- Bug fixes

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/bws-v1.0.0)

---

## bws-v0.5.0: bws CLI v0.5.0
**Published:** 2024-04-29

### Added
- Add a `BWS_CONFIG_FILE` environment variable to specify the location of the config file (#571)
- The `bws` CLI is now available as a Docker image (`docker run -it bitwarden/bws --help`) (#305)
- The `bws` CLI releases are now code signed on Windows and Mac (#534, #535)

### Fixed
- Re-add output options to the help menu after they were accidentally removed (#477)

### Changed
- Switched TLS backend to `rusttls`, removing the dependency on OpenSSL (#374)
- Updated MSRV for `bws` to `1.71.0` (#589)

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/bws-v0.5.0)

---

## bws-v0.4.0: bws CLI v0.4.0
**Published:** 2023-12-22

Added
- Ability to output secrets in an `env` format with `bws` (#320)
- Basic state to avoid reauthenticating every run, used when setting the `state_file_dir` key in the config (#388)

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/bws-v0.4.0)

---

## bws-v0.3.1: bws CLI v0.3.1
**Published:** 2023-10-24

Added
- Support for shell autocompletion with the bws completions command (#103)
- When running bws with no args, the help text is now printed to stderr instead of stdout to be consistent with bws subcommand behavior (#190)

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/bws-v0.3.1)

---

## bws-v0.3.0: bws CLI v0.3.0
**Published:** 2023-07-26

### Deprecated

- Switched command order from `action type` to `type action`, please re-read the help documentation (#76)

### Added
- Ability to create and edit projects (#53)
- Ability to create and edit secrets (#77)
- Support `NO_COLOR` environment variable to disable CLI colors (#61)
- Support for `CLICOLOR_FORCE` (#74)

### Fixed
- Improve login error handling (#109)
- Respect users color choice for errors (#61)

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/bws-v0.3.0)

---

## bws-v0.2.1: bws CLI v0.2.1
**Published:** 2023-03-22

- Bug fixes

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/bws-v0.2.1)

---

## bws-cli-v0.2.0: bws CLI v0.2.0
**Published:** 2023-03-21

Initial release of secrets manager CLI :partying_face:

[View on GitHub](https://github.com/bitwarden/sdk-sm/releases/tag/bws-cli-v0.2.0)

---

