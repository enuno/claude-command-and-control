# Rewards & Payouts

- Payouts & Fees
- Rewards & Payouts customization
- Lightning Payouts
- FPPS Specification

## Payouts & Fees

Braiins Pool currently applies the following fee to provide the pool mining service.

- Proceeds from transaction (network) fees are shared with miners.
- Payouts are created daily at 9.00 UTC. Confirmation for on-chain payouts typically takes 1-2 hours, but in times of high network fees it can take longer. Lightning payouts are confirmed within couple of minutes.
- Payout threshold for withdrawals can be customized for each of the Financial Accounts in Payout Settings section of the account overview page.

## Rewards & Payouts customization

All necessary information about the Funds, Financial accounts, wallets and payout settings.

### Financial Account

A Financial Account is a place where your mining rewards are stored once confirmed.

### Funds

The Funds tab is a part of the Braiins Pool platform where you can see and manage all of your Financial Accounts (where you receive payouts) and their available balances.

### Payout Rule

A payout rule allows you to customize when and how you receive your coins from your Financial Account. You can choose to receive payouts at regularly scheduled time intervals (e.g. monthly, weekly, or daily), or when you reach a certain threshold of coins (e.g. receive the payout as soon as the account balance reaches 0.1 BTC). You can also select the network to be used for sending your coins. Either BTC network (onchain) or Lightning Network.

### Reward Split

A reward split allows you to automatically split your mining rewards between your Financial Accounts. For example, you can send 50% to your primary payout account and 25% each to two other Financial Accounts (or any other ratio you choose for as many Financial Accounts as you'd like).

### Wallet

A wallet is an external destination — a bitcoin wallet address — at which you can receive your payouts from the pool.

Answers for the questions and much more information below you can find in FAQ's:

- How can I add a new payout address (wallet) to my account?
- How can I change my wallet address (registered payout address)?
- What are the Lightning payouts and how to use them?
- Are there any limits for Lightning payouts?

### Basic settings

Your mining rewards are distributed to your Financial Account(s) according to your Reward Split settings. By default, your rewards are distributed to a single Financial Account created during your sign-up. You can customize this to split the rewards among any number of Financial Accounts you desire.

Each of your Financial Accounts has customizable Payout Rules. You can choose to receive payouts to your wallet at regularly scheduled time intervals, such as daily, weekly, or monthly. Alternatively, you can choose to receive payouts whenever your account balance reaches a certain threshold, such as 0.1 BTC.

In all cases, our system evaluates the Payout Rules and sends the payouts once a day. Once the Payout Rules are satisfied, your payment will be triggered.

Alternatively, if the balance of your Financial Account exceeds the minimum payout limit, you may also request an Immediate Payout.

To explore advanced setup options view FAQ's > Rewards.

## Lightning Payouts

### Basics

Lightning network is a 2nd layer network built upon Bitcoin blockchain with the aim to transfer Bitcoin transactions instantly for nearly zero cost and at a scale. Such transactions use peer-to-peer channels for transfer between point A and point B. For a lightning payout to work the sending and receiving party needs to have a route between them. Braiins Pool runs its own Lighning node which has open channels to the most frequent wallet operators or routing nodes. To accept such a payment users need to use a wallet of their choice or to run their own Lightning Node with channel(s) connected to Lightning network.

### Payment Options

There are two types of Lightning payouts available at Braiins Pool:

- **Regular payouts** - wallet with support of Lightning Address needs to be used. Lightning address has the same format as an email address. It gets translated into the URL, which returns a lightning invoice in the background. This usually works well with custodial wallets. Self-custodial (a.k.a. non-custodial) wallets can run into troubles (read below). Regular payouts are triggered daily at 9.00 UTC.
- **Manual withdrawals** - this is the very basic lightning payment request where your wallet generates an invoice for a predefined amount of sats and you paste this invoice into our web. You can request manual withdrawal 1x per 24 hours. It gets processed within 60 minutes (usually 5 minutes after each hour).

We don't support LNURL withdrawals.

### Wallet Compatibility

Every transaction via lightning network requires the receiving node to be online in order to reach your wallet. This is pretty easy with custodial wallets. The node is not yours, but it's run by a custodian. Typically by the wallet operator. Such nodes are almost always online and lightning transaction works like a charm. You don't have to create any channels, but you have to trust the custodian as the sats are not under your control.

With self-custodial wallets you control the node. You can run them on a dedicated computer or on your mobile phone. Whenever your node goes offline, you are not able to accept transactions (this happens quite a lot on mobile phones). There's also an initial cost you have to pay in order to have a channel created to send or receive sats (as the channel creation is an on-chain transaction). Therefore self-custodial wallets are more useful for people using lightning on day-to-day basis.

Not all the wallets support lightning addresses but all the wallets support invoices. You can check wallet support of lightning addresses here. Since the lightning address requires the destination node to provide the invoice just in time when the transaction is created, some self-custodial wallets use pregenerated HODL invoices (your node pregenerates number of blank invoices and shares them with the wallet provider). Once the invoice exists (directly or through lightning address) and is used for a lightning transaction, it tries to reach the destination node (yours or your custodian).

Every invoice has an expiration period. If the destination node does not come online before the period ends, the invoice expires. Braiins returns all the funds to your balance in such a case and mark payout as failed. You should make sure that invoice generated by your self-custodial wallet has expiration period long enough so you can claim it (custodial wallets accept the payout right away). Recommended expiration time is 24 hours, minimum is 1-2 hours (we generate manual withdrawals every hour + some extra time for you to claim it in case of self-custodial wallets, for the daily automatic payout the time starts ticking at the time we generate it). You can use a lightning decoder to check expiration of any invoice.

## FPPS Specification

The Full Pay Per Share (FPPS) model follows the rule that every unit of work (share) delivered to the pool is guaranteed a mining reward.

This reward is calculated daily once the day is over. It is based on all the blocks mined by the whole network for the given day (UTC time), but recalculated as if the average 144 blocks had been mined. That means the miners receive steady rewards regardless how many blocks are found during a day.

This reward consists of two parts:

- **Coinbase reward cut** - mining reward defined by Bitcoin network and stable between halvings proportional to submitted shares for a given difficulty.
- **Transaction fees cut** - average block fees determined by usage of the network and demand for block space proportional to submitted shares for a given difficulty.

The final reward payable to the miner is the reward calculated according to the rules below, from which the amount equal to the pool fee (a percentage of the calculated reward) is subtracted.

### Coinbase reward cut calculation

Final coinbase reward cut (CRC) awarded to the miner depends on the number of accepted shares (S) the miner delivered to the pool, difficulty of the network (D) and coinbase block reward (C):

```
CRC = (S × C) / (D × 2^32)
```

#### Example 1

Miner with 1 TH/s produces approximately 20,116,568 shares a day (S). Difficulty (D) on 30th November 2023 was 67,957,790,298,897. The current coinbase block reward is 6.25 BTC (C). Coinbase reward cut for 1 TH/s is 0.00000185 BTC (185 sats).

It gets more complex when there is a difficulty and/or halving on the corresponding day of the calculation. In such a case the day is split into 2 (or 3, in the case that both happen on the same day) time slots where difficulty and CRC is calculated for all of them.

#### Example 2

There is a difficulty change at 6 a.m. S from the previous example is split to S₁ = 5,029,142 and S₂ = 15,087,426. Old difficulty D₁ = 64,678,587,803,496, new difficulty D₂ = 67,957,790,298,897. C is the same for both time slots. CRC = CRC₁ + CRC₂ = 0.00000049 + 0.00000139 = 0.00000187 (187 sats).

#### Example 3

There is a halving at 6 a.m. S₁ = 5,029,142 and S₂ = 15,087,426. There is only one difficulty D = 67,957,790,298,897. C₁ = 6.25 BTC and C₂ = 3.125 BTC. CRC = CRC₁ + CRC₂ = 0.00000049 + 0.00000069 = 0.00000116 (116 sats).

### Transaction fees cut calculation

We calculate the trimmed average mining fee from the blocks and award them proportionally to the miner as transaction fees cut (TFC):

```
TFC = (AF × S) / (D × 2^32)
```

where:
- TFC: Transaction fees cut
- AF: Average mining fee
- S: shares delivered to a pool for a given day
- D: difficulty of the network

Again the day is split into 2 periods if a difficulty changes during the day. The halving does not affect the calculation of average mining proceeds.

#### Example 4

Average mining fee (AF) for 30th November 2023 = 0.49862314. Using the number of shares from Example 1 the TFC = 0.00000015 BTC (15 sats).

### FPPS reward

Total FPPS reward (TR) combines both parts calculated previously, thus:

```
TR = Σ(CRCᵢ) + Σ(TFCⱼ)
```

where:
- CRCᵢ: coinbase reward cuts for all difficulty and/or halving time slots during the day (most of the day it's only one period)
- TFCⱼ: transaction fees cuts for all difficulty time slots during the day (most of the day it's only one period)
- n: number of difficulty and halving time slots during the day (1, 2 or 3)
- m: number of difficulty time slots during the day (1 or 2)

#### Example 5

Total FPPS reward for 1 TH/s for 30th November 2023 therefore combines examples 1 and 4 giving TR = CRC + TFC = 0.00000185 + 0.00000015 = 0.00000200 BTC. This FPPS reward is a gross reward. The pool fee is deducted giving a net profitability of 0.00000195 BTC per 1 TH/s in case of a 2.5% fee.

---

**Source**: https://academy.braiins.com/en/braiins-pool/rewards-and-payouts/
**Scraped**: 2025-12-28
