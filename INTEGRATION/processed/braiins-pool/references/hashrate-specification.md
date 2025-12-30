# Hashrate Specification

Hashrate is the number of hashes computed per second by your mining hardware. You can observe the hashrate of your mining devices in your Braiins Pool dashboard. There is a difference between a nominal hashrate shown in the manual of your mining device and an effective hashrate shown on your Braiins Pool dashboard. It's important for you to understand the difference between these two.

- Nominal hashrate
- Effective Hashrate (Displayed on Dashboard)
- Scoring Hashrate

## Nominal hashrate

The nominal hashrate of 1 Th/s means that your device is capable of computing 1 trillion hashes per second — regardless of whether they match any extra criteria such as meeting a specified difficulty target.

## Effective Hashrate (Displayed on Dashboard)

The effective hashrate (shown in the chart above) is calculated based on hashes submitted by your devices to our pool. Only a small portion of the hashes generated hashes by your devices get sent, as they must fit certain criteria assigned by the pool (see: Braiins Pool FAQ's — What is Share in proof of work).

Most of the time, the effective hashrate will be somewhat lower than the nominal hashrate. This is because your effective hashrate depends on the "luck" of your mining device (i.e., the variance in producing shares that can be submitted to the pool) and the quality (stability) of your internet connection to the pool server. If you have experienced connection issues, then your effective hashrate will be lower than the nominal hashrate in that period of time.

Occasionally, you can be more lucky and find more valid hashes than usual. That is what gives you a slightly higher effective hashrate compared to nominal hashrate.

## Scoring Hashrate

This value is no longer used. It was used before Braiins Pool changed the reward model to FPPS (see FPPS reward system). Scoring hash rate was a value derived from effective hash rate. You can understand scoring hash rate as an exponential moving average of the effective hash rate.

---

**Source**: https://academy.braiins.com/en/braiins-pool/hashrate-specification/
**Scraped**: 2025-12-28
