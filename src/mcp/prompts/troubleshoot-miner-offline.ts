/**
 * Troubleshoot Miner Offline Prompt
 *
 * Step-by-step guided workflow to diagnose and fix offline miners.
 * Provides multi-turn conversation with diagnostic steps and tool suggestions.
 *
 * URI: troubleshoot_miner_offline
 *
 * @module mcp/prompts/troubleshoot-miner-offline
 */

import type { MCPPromptDefinition, PromptContext, PromptMessage } from './types';

export const troubleshootMinerOfflinePrompt: MCPPromptDefinition = {
  name: 'troubleshoot_miner_offline',
  description: 'Step-by-step guide to diagnose and fix offline miners with actionable recommendations',
  arguments: [
    {
      name: 'minerId',
      description: 'The unique identifier of the offline miner to troubleshoot',
      required: true,
    },
  ],

  handler: async (args: Record<string, string>, context: PromptContext): Promise<PromptMessage[]> => {
    const { minerId } = args;

    if (!minerId) {
      return [
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: 'Error: minerId is required. Please provide the ID of the miner you want to troubleshoot.',
          },
        },
      ];
    }

    try {
      // Attempt to get miner status
      const minerStatus = await context.minerService.getMinerStatus(minerId);

      // Build diagnostic conversation
      const diagnosticText = `I'll help troubleshoot miner ${minerId}. Let me run through comprehensive diagnostics:

**Step 1: Check Last Known Status**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Miner ID: ${minerStatus.id}
Name: ${minerStatus.name}
Host: ${minerStatus.host}
Status: ${minerStatus.online ? '✅ ONLINE' : '❌ OFFLINE'}
Last Updated: ${minerStatus.lastUpdated}

${minerStatus.info ? `
Hardware Info:
- Model: ${minerStatus.info.miner_identity.model}
- MAC Address: ${minerStatus.info.mac_address}
- Firmware: ${minerStatus.info.bos_version.current || 'Unknown'}
` : ''}

${minerStatus.hashboards ? `
Hashboards Status:
${minerStatus.hashboards.hashboards.map((hb, idx) => {
  const hashrate = hb.stats?.hashrate?.gigahash_per_second ?? 0;
  const temp = hb.highest_chip_temp?.celsius ?? 0;
  const enabled = hb.enabled ? 'Enabled' : 'Disabled';
  return `- Board ${idx + 1}: ${enabled} (${hashrate.toFixed(2)} GH/s, ${temp.toFixed(1)}°C)`;
}).join('\n')}
` : ''}

${minerStatus.pools ? `
Pool Status:
${minerStatus.pools.flatMap((group) =>
  group.pools.map((pool, idx) =>
    `- Pool ${idx + 1}: ${pool.url} (${pool.active ? 'Active' : pool.alive ? 'Alive' : 'Inactive'})`
  )
).join('\n')}
` : ''}

${minerStatus.errors && minerStatus.errors.errors.length > 0 ? `
⚠️  Active Errors:
${minerStatus.errors.errors.map(err => `- ${err.message}`).join('\n')}
` : ''}

**Step 2: Diagnostic Workflow**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${!minerStatus.online ? `
❌ **Miner appears OFFLINE**

Please try these steps in order:

1. **Verify Network Connectivity**
   → Use tool: get_miner_info({ minerId: "${minerId}" })
   This will attempt to reach the miner and fetch current information.

2. **Check Physical Connections**
   - Verify power cable is connected and power supply LED is on
   - Check Ethernet cable is securely connected
   - Verify network switch/router port has link light
   - Confirm miner's LED indicators show normal operation

3. **Test Network Path**
   - Verify miner's IP address (${minerStatus.host}) is correct
   - Check if IP address has changed (DHCP lease renewal)
   - Test if other miners on same network are reachable
   - Check firewall rules allow gRPC traffic (port 50051)

4. **Review Recent Changes**
   - Check if firmware update was recently attempted
   - Verify no network configuration changes
   - Review if pool configuration was modified

5. **Hard Reset (Last Resort)**
   - Power cycle the miner (unplug for 30 seconds)
   - After reboot, use: get_miner_status({ minerId: "${minerId}", refresh: true })
   - Monitor for successful reconnection
` : `
✅ **Miner is ONLINE**

${minerStatus.errors && minerStatus.errors.errors.length > 0 ? `
However, there are active errors that need attention:

**Error Analysis:**
${minerStatus.errors.errors.map(err => `
- **Error:** ${err.message}
  **Timestamp:** ${err.timestamp}
  **Suggestion:** Check hardware connections and cooling
`).join('\n')}

**Recommended Actions:**
1. Review error details for hardware issues
2. Check temperature levels (hashboard temps above 80°C indicate cooling issues)
3. Verify all hashboards are operational
4. Consider rebooting if errors persist: reboot_miner({ minerId: "${minerId}" })
` : `
Miner is operating normally with no detected issues.

**Performance Summary:**
${minerStatus.hashboards ? `
- Total Hashrate: ${minerStatus.hashboards.hashboards.reduce((sum, hb) => {
  const hashrate = hb.stats?.hashrate?.gigahash_per_second ?? 0;
  return sum + hashrate;
}, 0).toFixed(2)} GH/s
- Average Temperature: ${(minerStatus.hashboards.hashboards.reduce((sum, hb) => {
  const temp = hb.highest_chip_temp?.celsius ?? 0;
  return sum + temp;
}, 0) / minerStatus.hashboards.hashboards.length).toFixed(1)}°C
` : ''}

**Next Steps for Optimization:**
1. Review power efficiency: Use prompt optimize_power_efficiency
2. Check if firmware updates available
3. Monitor hashrate trends over time
`}
`}

**Step 3: Next Actions**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on the current status, here are your options:

${!minerStatus.online ? `
🔧 **Immediate Actions:**
- Test connectivity with get_miner_info tool
- Review network infrastructure
- Check physical miner hardware

📊 **Monitoring:**
- Set up alerts for when miner comes back online
- Check fleet status: Use resource braiins:///fleet/summary
` : `
✅ **Monitoring & Optimization:**
- Continue monitoring with get_miner_status
- Optimize settings with optimize_power_efficiency prompt
- Check fleet-wide metrics: Use resource braiins:///fleet/summary
- Configure pool settings if needed
`}

Would you like me to proceed with any of these diagnostic steps?`;

      return [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `My miner ${minerId} is not working properly. Can you help me troubleshoot it?`,
          },
        },
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: diagnosticText,
          },
        },
      ];
    } catch (error) {
      // Miner not found or unreachable
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `My miner ${minerId} is offline. Can you help me fix it?`,
          },
        },
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: `I'll help troubleshoot miner ${minerId}, but I'm unable to retrieve current status.

**Error:** ${errorMessage}

**Step 1: Verify Miner Registration**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The miner may not be registered in the system or is completely unreachable.

**Troubleshooting Steps:**

1. **Check if miner is registered:**
   → Use tool: get_fleet_status({})
   This will show all registered miners. Verify ${minerId} is in the list.

2. **If miner is NOT registered:**
   → Use tool: register_miner({
       id: "${minerId}",
       name: "Miner ${minerId}",
       host: "192.168.1.XXX",  // Replace with actual IP
       username: "root",
       password: "admin"
     })

3. **If miner IS registered but unreachable:**

   a) **Network Diagnostics:**
      - Ping the miner's IP address from your network
      - Check if miner's web interface is accessible (http://MINER_IP)
      - Verify firewall allows connections to port 50051 (gRPC)

   b) **Physical Checks:**
      - Verify miner power supply is on (LED indicators)
      - Check Ethernet cable connection
      - Confirm network switch shows link light for miner's port

   c) **IP Address Verification:**
      - Miner's IP may have changed (DHCP)
      - Check router/DHCP server for miner's current IP
      - Consider setting static IP or DHCP reservation

4. **Recent Changes:**
   - Was firmware recently updated?
   - Did network configuration change?
   - Were pool settings modified?

**Step 2: Recovery Actions**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Option A: Soft Recovery (if miner is registered)**
1. Update registration with correct IP/credentials
2. Use get_miner_status with refresh flag
3. Monitor for reconnection

**Option B: Hard Recovery (if miner is powered on but not responding)**
1. Access miner's web interface directly
2. Check Braiins OS status page
3. Review system logs for errors
4. Consider factory reset if corruption suspected

**Option C: Hardware Diagnosis (if completely unresponsive)**
1. Power cycle the miner (unplug for 60 seconds)
2. Check control board LED patterns
3. Listen for fan startup (indicates power to boards)
4. Check if hashboards are properly seated

**Step 3: Next Steps**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Once the miner is reachable:
1. Run get_miner_status to verify operation
2. Check for errors or warnings
3. Monitor hashrate and temperature
4. Consider using optimize_power_efficiency prompt

Would you like help with any of these specific steps?`,
          },
        },
      ];
    }
  },
};
