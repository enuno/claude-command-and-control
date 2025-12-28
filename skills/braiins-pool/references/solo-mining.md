# Solo Mining

## Why solo mining?

Solo mining is all about taking your shot at finding a block on your own. Yes, the odds might be 1-in-a-million, but for some, that's the thrill. Unlike mining in pool, where you earn small, steady rewards, solo mining only pays out if you find a block yourself.

You might have a mini miner with just a few TH/s when earning a few sats a day does not justify the device and/or electricity costs. You may have a reasonable mining operation, and you just want to try your luck with a few machines. The payouts are high, and chances are scarce. But that does not mean you won't find that lucky hash!

## How does that work?

In solo mining, each user attempts to mine their own block. The block for each user differs primarily in the output of the coinbase transaction, where the user's own bitcoin address is used. The coinbase reward goes directly to this address without any middleman. The rest of the blocks are the same for all solo miners — they all confirm the same set of transactions within the block.

The logic of mining remains the same. You still connect the mining devices under a worker name, and you still monitor your hashrate to see if your device is working properly. However, there are no sats being accumulated for you until you hit the jackpot and compute a hash that fulfills the network difficulty. In such a case, you will be rewarded with 3.125 BTC (valid for the current halving epoch) as a reward, plus any applicable transaction fees.

We only take away 0.5% of the overall reward to credit the authors of the CKPool software stack, which we currently use to provide solo mining for you. That's also the reason why you'll find two outputs in the coinbase transaction.

## What do I need to do to setup the Solo mining?

Set one of the following addresses as the Pool URL on your miner:

```
stratum+tcp://solo.stratum.braiins.com:3333
stratum+tcp://solo.stratum.braiins.com:443
stratum+tcp://solo.stratum.braiins.com:25
```

Since your bitcoin address (public key) needs to be in the block template, you will use that as username. A workername suffix might help you to distinguish between multiple devices, but it's optional.

Format: `<bitcoin_address>.<optional_workername>`

## Check your performance

Just visit https://solo.braiins.com and search for your bitcoin address to see your stats or check the summary stats of whole Solo mining. More convenient way is to access your profile directly as `https://solo.braiins.com/stats/<bitcoin address>`

There's also an option to query the raw data using curl utility:

```bash
curl https://solo.braiins.com/pool.status
curl https://solo.braiins.com/users/<bitcoin address>
```

## Can I use weak mining devices?

Our Solo mining node provides an initial mining job difficulty of 8000. The minimum difficulty is 512. Difficulty is dynamically adjusted to ensure that your mining device produces shares in roughly 5-second intervals. If you have a weak miner failing to produce results in 5 seconds (e.g. below 500 GH/s), there's no harm to your chances of finding a block. It affects only reporting of hashrate when short time hashrate figures won't be very precise. The submitted shares are not very important in Solo mining unless they fulfill the much higher difficulty — the difficulty of the entire bitcoin network (110451907374649 at the time of writing) - which means that you've found the block. Submitted shares are only there for your convenience to check that the mining device is working correctly.

## Do I need to register with Braiins Pool in order to Solo mine?

No. Braiins Pool registration is for miners who want to receive steady rewards. We will integrate Solo Mining for our Pool clients soon. But nature of Solo mining does not require any registration and will remain anonymous.

---

**Source**: https://academy.braiins.com/en/braiins-pool/solo-mining/
**Scraped**: 2025-12-28
