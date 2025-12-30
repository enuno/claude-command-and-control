# Monitoring

- Device Monitoring
- Mobile App
- API configuration

## Device Monitoring

Have your finger on the pulse.

### Why should I care?

Since mining is usually considered as an investment, we believe that monitoring should be an essential part of your mining operation. Although your rewards are not directly affected by any monitoring settings, they can be better managed with few simple tools we have developed so far.

Monitoring helps you supervise how your miners work in time and minimizes losses caused by connection issues or mining hardware/software failures.

### How can monitoring help?

Monitoring allows you to be alerted once a mining device starts misbehaving. Notifications are sent via e-mail or in your mobile app. E.g. there are communication issues between your miner and our pool. Such alerts will help you to react faster and therefore minimize the financial impact of the outage.

Outages may typically have the following causes:

- Internet connectivity issues
- Hardware power-supply (PSU) failures
- Mining hardware overheating
- Mining software issues

Below you can find simple step-by-step instructions how to setup monitoring in order to keep track of how your mining equipment is doing.

### How to enable monitoring?

- Enable sending monitoring emails (Mining > Settings > Reporting) or notifications (Mobile app).
- You can enable worker monitoring on each worker profile separately.
- Once the worker monitoring is enabled, the Alert limit can be set:
  - **Automatically** - our system selects the Alert Limit based on the past performance of the worker
  - **Manually** - You can set your own Alert Limit value

Once you enable monitoring for your workers you will see each worker in one of these states: OK, Low, Offline, Disabled.

Permanently Low or Offline worker states can be caused by a weak worker. We recommend to switch off monitoring for such workers. If it is not the case please do not hesitate to contact our support.

**Please note**: The pool keeps track of mining devices on a worker basis. This means that if you have more than one mining device connected to the pool as a single worker, monitoring and issue reporting covers all the mining devices in bulk. On the other hand, when you setup a designated worker name for every mining device you have (and connect them correctly), the pool can track down hash rate drops and report them to you for each mining device separately.

### How does monitoring work?

The pool takes a snapshot of the effective hash rate for all your workers every 5 minutes. This value is then compared to Alert Limit (you setup this value while enabling the monitoring).

The period of 5 minutes is sufficient for collecting just enough data to calculate all the values with a certain accuracy without clogging our servers. With a Vardiff introduced, even a slow miner can submit sufficient amount of results.

### Device monitoring states

There are 4 possible states of your worker, regarding monitoring. Every worker is always in one of the following states.

## Mobile App

The mobile application offers a convenient overview of your mining and allows you to receive notifications for significant events of your choice such as:

- worker issues (see device monitoring article for more details)
- new block found
- payout sent

Download the official application for Braiins Pool for free – available for Android and Apple iOS for iPhone.

**Please be aware that our mobile app is not a mining app** – it is an account monitoring tool. You will not be able to mine any coins with it.

### How to set up the mobile app?

To monitor your user account in our official mobile app, please follow these steps:

1. Download the application on your mobile device.
2. On the Braiins Pool website go to User menu > Devices.
3. Fill in the New device label field with a name of your choice and confirm by clicking on Connect.
4. Connect the mobile app to your user account by either scanning the QR code in the mobile app or manually entering the token value in the mobile app.

### How to unlink my phone from the app?

In case you lost your mobile device, or you no longer want it to have access to your account, you can unlink the device in the Devices section. All device management options can be found in the Settings > Devices menu.

## API configuration

Do you want to pull the mining stats/data and analyze them yourself? The pool API is here for you!

- Overview
- Pool Stats API
- User Profile API
- Daily Reward API
- Daily Hashrate API
- Block Rewards API
- Worker API
- Payouts API

### Overview

The pool API provides data in JSON fills on four endpoints: stats, profile, workers and payouts. You have to include the abbreviation of the selected coin (e.g. btc) and your access token in every API URL.

To acquire access token (API key) needed for API authentication, please follow these steps:

1. Go to Settings > Access Profiles
2. Select one of your access profiles or create a new one
3. Select Allow access to web APIs in the access profile detail
4. Click on Generate New token
5. Save the changes

Each access profile has its own access token (in case API access is enabled). Access tokens can be regenerated any time, effectively canceling the former access token belonging to the selected access profile.

### API authentication

An access profile token has to be included in the HTTP header field named `Pool-Auth-Token` or `X-Pool-Auth-Token` to authenticate your requests.

Example request using cURL:

```bash
curl https://pool.braiins.com/stats/json/btc/ -H "Pool-Auth-Token: <your access token>"
```

### API request limit

The API allows for approximately one request per five seconds (safe value). When you transiently exceed this limit, some of your requests will be ignored. In case the allowed request rate is exceeded greatly or over a longer period of time, your IP address might get banned. If that is the case, please contact us to resolve the situation.

### Pool Stats API

Provides information about pool performance and recently found blocks.

**URL**: `https://pool.braiins.com/stats/json/btc`

### User Profile API

Provides information about users performance and rewards.

**URL**: `https://pool.braiins.com/accounts/profile/json/btc/`

### Daily Reward API

Provides information about about rewards for the selected time period. Returns last 90 days by default.

**URL**: `https://pool.braiins.com/accounts/rewards/json/btc?from=[from]&to=[to]`

- COIN: BTC
- FROM: string representation of date in ISO format (YYYY-MM-DD)
- TO: string representation of date in ISO format (YYYY-MM-DD)

Example: `https://pool.braiins.com/accounts/rewards/json/btc?from=2024-11-30&to=2024-12-02`

### Daily Hashrate API

Provides information about daily averages of hashrate for user or user group.

**URL**: `https://pool.braiins.com/accounts/hash_rate_daily/json/[group]/btc`

Example: `https://pool.braiins.com/accounts/hash_rate_daily/json/group/btc`

### Block Rewards API

Provides information about block rewards.

**URL**: `https://pool.braiins.com/accounts/block_rewards/json/btc?from=[from]&to=[to]`

Example: `https://pool.braiins.com/accounts/block_rewards/json/btc?from=2022-05-01&to=2022-05-07`

### Worker API

Provides performance data for each one of users worker.

**URL**: `https://pool.braiins.com/accounts/workers/json/btc`

### Payouts API

Provides data for payouts transactions.

**URL**: `https://pool.braiins.com/accounts/payouts/json/btc?from=[from]&to=[to]`

Example: `https://pool.braiins.com/accounts/payouts/json/btc?from=2022-05-01&to=2022-05-07`

---

**Source**: https://academy.braiins.com/en/braiins-pool/monitoring/
**Scraped**: 2025-12-28
