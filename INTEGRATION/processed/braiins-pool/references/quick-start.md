# Quick Start

## Configure your mining device

Individual hardware manufacturers may have specific settings requirements and different settings interfaces. Please follow their official documentation when setting up your miners. This also applies to cloud mining services.

The mining configuration needed for your miner should look like this:

Remember to configure the credentials for each device. The User ID is mandatory and is used to pair the device with your account. Password is not used, it can be anything. User ID consists of userName (same as your Braiins Pool account name) and workerName (any device identifier). If workerName is empty, [auto] worker is created for you. We recommend connecting each mining device with a separate workerName for efficient monitoring.

- **User ID**: `userName.workerName`
- **userName**: Same as your Braiins Pool account name
- **workerName**: Any device identifier (optional, defaults to `[auto]`)

Only one URL is now used by our Pool. Braiins Pool servers are located all around the world and automatically selected based on your location. For best efficiency we advise stop using location-specific URLs used in the past (e.g. Europe, USA, Canada, Brazil, Singapore, Russia, etc.).

**Note**: Set old slushpool.com address (stratum.slushpool.com) if you're using Braiins OS version older than 22.08.1 for successful application of 0% mining fee on Braiins Pool.

---

**Source**: https://academy.braiins.com/en/braiins-pool/quick-start/
**Scraped**: 2025-12-28
