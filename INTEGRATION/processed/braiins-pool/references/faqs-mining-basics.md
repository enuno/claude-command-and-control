# FAQ's: Mining Basics

- Mining Basics
- Connection
- Account
- Rewards & Payouts
- Worker Management
- Pool

## Mining Basics

### What is an ASIC miner?

An ASIC (application-specific integrated circuit) miner is a device specialized only for a specific type of work. In the cryptocurrency space, ASICs are capable of hashing certain mining algorithms (e.g. SHA-256 on Bitcoin) with high efficiency.

These workers represent an upgrade from CPU/GPU chips, which usually become obsolete for any given mining algorithm after ASICs are developed and introduced to the market.

Visit asicminervalue.com for a comprehensive list of ASIC miners for different coins. Don't forget to check which algorithm the selected device is made for and which coins can be mined with it, in our case:

- ASIC miners that support SHA-256 algorithm for Bitcoin mining

### What mining hardware should I buy?

**Which hardware do you need?**

In order to mine a particular cryptocurrency, you will need a hardware device suited to mine that cryptocurrency's mining algorithm. Depending on the coin, you will either need an ASIC miner (computer exclusively designed for mining specific coins) or a PC with a powerful GPU (graphics card) or CPU (processor) in some cases.

Each coin requires different hardware (depending on the algorithm used) that may or may not be used to mine other cryptocurrencies! You must always ensure that your mining equipment is suitable to mine your chosen cryptocurrency. Mining cryptocurrencies with unsuitable hardware will either be extremely unprofitable or it won't work at all.

**Comparing mining hardware**

For a comparison of ASIC miners we recommend asicminervalue.com. There are dozens of devices listed with complete specifications and profit estimates.

For mining with Braiins Pool, you should look for:
- ASIC miners that support SHA-256 algorithm for Bitcoin mining

**General tips**

We do not recommend any particular manufacturer. However, there are a few good pieces of advice which we can give you:

- Be wary of suspiciously good deals for hashrate/price and unknown companies
- Consider the hardware's power consumption and the power bills you have to pay.
- Later shipping dates usually mean that your estimated profitability will decrease due to rising difficulty over time.
- Double check that the website url is correct before sharing your personal information or buying any hardware as some scam websites are set up at slightly different urls to impersonate manufacturers and resellers.

### What is the Bitcoin halving / halvening?

Every Bitcoin block value consists of the block reward (new coins issued) and the fees from transactions contained in the block. The block reward is hard coded for each block and, in the case of Bitcoin, its value is halved at intervals of 210,000 blocks (approximately once every four years).

When Bitcoin was created in 2009, the initial reward was 50 BTC per block mined. After the latest halving that happened on April 19, 2024 the mining reward is 3.125 BTC and it is going to be cut in half to 1.5625 BTC in the spring of 2028 (see countdown). The halving process will continue until the final supply of coins - slightly less than 21 million - is reached.

**Halving vs halvening. Which is correct?**

Both terms refer to the same event. The proper name for the event is the halving but the community sometimes uses the word halvening instead (as a nickname) which was created by a merger of "to halve" and "to happen" — the halving which is happening is the halvening.

### How to check if I'm mining?

To check that your miner is configured correctly, you should look for the following clues:

- The miner is submitting shares in the mining software. For most of the miners, the submission rate should be around 1 share every 5 seconds.
- Your 5 minute Hash Rate on your Dashboard is a non-zero value.
- You see block rewards on the Statistics page for every closed round (solved block). This may be zero if you stopped mining during the round.

### Is it worth it to start mining Bitcoin these days?

Nowadays, Bitcoin mining is a specialized business and not profitable for everyone. Therefore, we strongly encourage anyone interested in mining to do his/her own research and make the necessary calculations before investing any money into the operation.

This short overview of Bitcoin miner profiles can give you an idea of how much strategy and understanding is required to mine successfully in the modern industry.

The most important factor is, of course, electricity prices. For the majority of households, prices are simply too high, making Bitcoin mining unprofitable. You can check the current break-even electricity price for every popular Bitcoin ASIC with our Cost to Mine 1 BTC tool.

To estimate your mining profitability, try our Bitcoin Mining Profitability Calculator.

### Can I solo mine on Braiins Pool?

Yes, you can mine Solo with Braiins. Check Solo Mining section for information how to do it.

### What is a stale rate?

Stale rate is number of shares submitted after the previous block has already been found and pool has moved to the next block. If everything works correctly, it should be a very low number. Several factors can increase your stale rate:

**Network Latency**

On slower networks (or when there is a network issue on the path from your miner to the pool), it takes more time for a miner to receive notification about a new block.

However, the miner still keeps submitting results to an old block for some time and these are being rejected by the pool as stale shares

**Slower Mining Device**

Miners can only handle one task at a time. Before taking on a new job, they need to finish the previous one. While others are generating shares for a new block already, these miners are producing shares for the old block that cannot be accepted by the pool anymore. Such results are also called stale shares.

### How can I get 0% fees on Braiins Pool with Braiins OS?

By default, miners who connect to Braiins Pool while mining with Braiins OS will not pay any pool fees.

If you choose to mine with Braiins Pool while using Braiins OS, you'll receive a full rebate on the pool fee collected.

### What is an Orphan block?

An orphan block (block A) is a valid block, but it is not a part of a blockchain. An orphan block is created when two miners find a valid block (block A and block B) at around the same time and broadcast them both to the network.

The orphan block (block A) is at first accepted (confirmed) by some nodes (which are usually geographically closer to the miner) but the other block (block B) accumulates more proof of work—it is is accepted by more nodes and becomes a parent block for the next one. The orphan block (block A) is then marked as invalid because it is not part of the longest chain. The miners do not receive a reward for such a block.

---

**Source**: https://academy.braiins.com/en/braiins-pool/faqs/mining-basics/
**Scraped**: 2025-12-28
