# Stratum V2 Manual

Stratum V2 is a new protocol for pooled mining that we developed in collaboration with Bitcoin developer Matt Corallo. It improves efficiency, prevents man-in-the-middle attacks, and will eventually enable miners to work on their own block templates. Stratum V2 is implemented in our firmware Braiins OS, and will be the new open standard in mining. However, it is still possible to mine with Stratum V1 if you prefer.

You don't have to specify an explicit port for Stratum V2 on Braiins Pool (default port 3336 is used). Simply use a Stratum V2 URL for your pool URL and it will work the same as a V1 URL.

However, there is a new required element of the URL in the path and that is the public key advertised by the pool that the mining software uses to verify the authenticity of the mining endpoint that it connects to. This prevents man-in-the-middle-attacks that attempt to steal hashrate. Any such attempt results in failed verification and the software refuses to use the given pool entry.

Only one URL is now used by our Pool. Braiins Pool servers are located all around the world and automatically selected based on your location. For best efficiency we advise stop using location-specific URLs used in the past (e.g. Europe, USA, Canada, Brazil, Singapore, Russia, etc.).

You need to run our Braiins OS firmware which supports Stratum V2 (stock manufacturing firmware currently does not support this protocol).

**Note**: Set old slushpool.com address (v2.stratum.slushpool.com) if you're using Braiins OS version older than 22.08.1 for successful application of 0% mining fee on Braiins Pool.

---

**Source**: https://academy.braiins.com/en/braiins-pool/stratum-v2-manual/
**Scraped**: 2025-12-28
