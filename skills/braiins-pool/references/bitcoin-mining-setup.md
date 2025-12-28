# Bitcoin Mining Setup

Figure out how to connect to Braiins Pool by following these steps:

- Get suitable hardware
- Sign-up for a Braiins Pool account
- Configure your mining device
- Register your payout address
- Check if you are mining

## Get suitable hardware

✓ Bitcoin can be efficiently mined with: ASIC (SHA-256 algorithm)

✘ Bitcoin cannot be efficiently mined with (unsupported): GPU, CPU, mobile phone

While mining with unsupported hardware might be possible, it will almost certainly be unprofitable. Also, keep in mind that our support team will not be resolving issues related to unsupported hardware.

## Sign-up for a Braiins Pool account

You can use an existing account if you have one.

- Sign-up to the pool, wait for the confirmation email and log into your account.

## Configure your mining device

Individual hardware manufacturers may have specific settings requirements and different settings interfaces. Please follow their official documentation when setting up your miners. This also applies to cloud mining services.

The mining configuration needed for your miner should look like this:

Remember to configure the credentials for each device. The User ID is mandatory and is used to pair the device with your account. Password is not used, it can be anything. User ID consists of userName (same as your Braiins Pool account name) and workerName (any device identifier). If workerName is empty, [auto] worker is created for you. We recommend connecting each mining device with a separate workerName for efficient monitoring.

- **User ID**: `userName.workerName`
- **userName**: Same as your Braiins Pool account name
- **workerName**: Any device identifier (optional, defaults to `[auto]`)

Only one URL is now used by our Pool. Braiins Pool servers are located all around the world and automatically selected based on your location. For best efficiency we advise stop using location-specific URLs used in the past (e.g. Europe, USA, Canada, Brazil, Singapore, Russia, etc.).

**Note**: Set old slushpool.com address (stratum.slushpool.com) if you're using Braiins OS version older than 22.08.1 for successful application of 0% mining fee on Braiins Pool.

## Stratum V2

For Stratum V2 connection guide see the Stratum V2 manual section. You need to run our Braiins OS firmware which supports Stratum V2 (stock manufacturing firmware currently does not support this new protocol).

**Note**: Set old slushpool.com address (v2.stratum.slushpool.com) if you're using Braiins OS version older than 22.08.1 for successful application of 0% mining fee on Braiins Pool.

### Example configuration

Let's say there is a miner with username bigMiner and his worker is named strongDevice. The configuration information for this miner would look like the following (configure accordingly):

## Register your payout address

To collect your reward you have to set up a payout address in the Funds > Wallets menu and define a payout rule in the Funds > Account detail. Once you reach the minimum threshold, your rewards will be sent there. You can start mining even without this address being registered, but it is highly recommended that you register it straight away.

If you do not have an address yet, you need to get a wallet first. We recommend the Trezor Hardware Wallet for maximum security. Other usable wallets are listed on Bitcoin.org.

Alternatively, if you decide to use Lightning payouts instead, you can do so with Braiins Pool. Make sure to use a Lightning wallet which is capable of providing a Lightning address to you. Lightning payouts requested via invoice are not supported.

## Check if you are mining

Open your Dashboard on the Mining tab for the coin that you are mining. Then check your hash rate in the Recent Hash Rate graph section below. Please be patient; it can take up to an hour until you see the full hashing power of your newly connected device. You can also look through our article "How to check if I'm mining" in Troubleshooting section.

---

**Source**: https://academy.braiins.com/en/braiins-pool/btc-mining-setup/
**Scraped**: 2025-12-28
