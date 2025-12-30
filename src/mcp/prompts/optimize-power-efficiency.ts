/**
 * Optimize Power Efficiency Prompt
 *
 * Guided workflow to optimize miner power settings for better efficiency.
 * Analyzes current power usage and provides recommendations for optimization.
 *
 * URI: optimize_power_efficiency
 *
 * @module mcp/prompts/optimize-power-efficiency
 */

import type { MCPPromptDefinition, PromptContext, PromptMessage } from './types';

export const optimizePowerEfficiencyPrompt: MCPPromptDefinition = {
  name: 'optimize_power_efficiency',
  description: 'Guided workflow to optimize miner power settings for maximum efficiency',
  arguments: [
    {
      name: 'minerId',
      description: 'The unique identifier of the miner to optimize',
      required: true,
    },
    {
      name: 'targetEfficiency',
      description: 'Target power efficiency in W/TH (optional, will calculate optimal if not provided)',
      required: false,
    },
  ],

  handler: async (args: Record<string, string>, context: PromptContext): Promise<PromptMessage[]> => {
    const { minerId, targetEfficiency } = args;

    if (!minerId) {
      return [
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: 'Error: minerId is required. Please provide the ID of the miner you want to optimize.',
          },
        },
      ];
    }

    try {
      // Get current miner status
      const minerStatus = await context.minerService.getMinerStatus(minerId);

      // Calculate current metrics
      const hashboards = minerStatus.hashboards?.hashboards ?? [];
      const totalHashrateGhs = hashboards.reduce((sum, hb) => {
        const ghs = hb.stats?.hashrate?.gigahash_per_second ?? 0;
        return sum + ghs;
      }, 0);
      const totalHashrateThs = totalHashrateGhs / 1000;

      // Get tuner state for power information
      const tunerState = minerStatus.tunerState;
      const currentPowerWatts = tunerState?.mode_state?.powertargetmodestate?.current_target?.watt ?? 0;
      const currentEfficiency = totalHashrateThs > 0 ? currentPowerWatts / totalHashrateThs : 0;

      // Parse target efficiency if provided
      const targetEfficiencyValue = targetEfficiency ? parseFloat(targetEfficiency) : null;

      const optimizationText = `I'll help optimize power efficiency for miner ${minerId}.

**Step 1: Current Performance Analysis**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Miner ID: ${minerStatus.id}
Name: ${minerStatus.name}
Status: ${minerStatus.online ? '✅ ONLINE' : '❌ OFFLINE'}

**Current Metrics:**
${totalHashrateThs > 0 ? `
- Hashrate: ${totalHashrateThs.toFixed(2)} TH/s
- Power Consumption: ${currentPowerWatts} W
- Current Efficiency: ${currentEfficiency.toFixed(2)} W/TH
${minerStatus.info?.sticker_hashrate?.terahash_per_second ? `
- Rated Hashrate: ${minerStatus.info.sticker_hashrate.terahash_per_second} TH/s
- Performance: ${((totalHashrateThs / minerStatus.info.sticker_hashrate.terahash_per_second) * 100).toFixed(1)}% of rated
` : ''}
` : 'Unable to calculate current metrics - miner may be offline or initializing'}

**Hashboard Details:**
${hashboards.length > 0 ? hashboards.map((hb, idx) => {
  const ghs = hb.stats?.hashrate?.gigahash_per_second ?? 0;
  const temp = hb.highest_chip_temp?.celsius ?? 0;
  const voltage = hb.current_voltage?.millivolt ?? 0;
  const frequency = hb.current_frequency?.mhz ?? 0;
  return `- Board ${idx + 1}: ${hb.enabled ? 'Enabled' : 'Disabled'}
  Hashrate: ${ghs.toFixed(2)} GH/s
  Temperature: ${temp}°C
  Voltage: ${voltage}mV
  Frequency: ${frequency}MHz`;
}).join('\n') : 'No hashboard data available'}

**Step 2: Efficiency Analysis**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${currentEfficiency > 0 ? `
**Current Efficiency Rating:**
${currentEfficiency < 30 ? '✅ Excellent (< 30 W/TH)' :
  currentEfficiency < 35 ? '✅ Good (30-35 W/TH)' :
  currentEfficiency < 40 ? '⚠️  Moderate (35-40 W/TH)' :
  '❌ Poor (> 40 W/TH) - Optimization recommended'}

**Industry Benchmarks:**
- Excellent: < 30 W/TH (Latest generation miners)
- Good: 30-35 W/TH (Mid-range efficiency)
- Moderate: 35-40 W/TH (Older generation)
- Poor: > 40 W/TH (Consider hardware upgrade)

${targetEfficiencyValue ? `
**Your Target:** ${targetEfficiencyValue} W/TH
**Gap:** ${(currentEfficiency - targetEfficiencyValue).toFixed(2)} W/TH
**Action:** ${currentEfficiency > targetEfficiencyValue ? 'Reduction needed' : 'Already meeting target'}
` : `
**Recommended Target:** ${currentEfficiency > 35 ? '32 W/TH' : (currentEfficiency - 2).toFixed(2) + ' W/TH'}
**Potential Improvement:** ${currentEfficiency > 35 ? (currentEfficiency - 32).toFixed(2) : '2.00'} W/TH
`}
` : `
⚠️  Unable to calculate efficiency - ensure miner is running and hashing.

**Troubleshooting:**
1. Check if miner is online: get_miner_status({ minerId: "${minerId}" })
2. Verify hashboards are enabled and operational
3. Ensure miner is connected to a mining pool
4. Review tuner state is active
`}

**Step 3: Optimization Recommendations**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${currentEfficiency > 0 ? `
**Option A: Power Target Optimization (Recommended)**

${currentEfficiency > 35 ? `
Your current efficiency (${currentEfficiency.toFixed(2)} W/TH) suggests room for improvement.

**Recommended Action:**
1. Calculate optimal power target:
   - Current: ${currentPowerWatts}W → ${totalHashrateThs.toFixed(2)} TH/s
   - Target efficiency: 32 W/TH
   - Optimal power: ${(totalHashrateThs * 32).toFixed(0)}W

2. Apply new power target:
   → Use tool: set_power_target({
       minerId: "${minerId}",
       watt: ${(totalHashrateThs * 32).toFixed(0)}
     })

3. Monitor results (wait 10-15 minutes for stabilization):
   → Use tool: get_miner_status({ minerId: "${minerId}", refresh: true })

4. Fine-tune if needed:
   - If hashrate drops too much: Increase power by 50-100W
   - If efficiency still poor: Decrease power by 50-100W
` : `
Your efficiency (${currentEfficiency.toFixed(2)} W/TH) is already good!

**Fine-Tuning Options:**
1. **Conservative approach** (maximize stability):
   - Reduce power by 2-3%: ${(currentPowerWatts * 0.97).toFixed(0)}W
   - Expected efficiency: ${(currentEfficiency * 0.97).toFixed(2)} W/TH

2. **Aggressive approach** (maximize efficiency):
   - Reduce power by 5-7%: ${(currentPowerWatts * 0.93).toFixed(0)}W
   - Expected efficiency: ${(currentEfficiency * 0.93).toFixed(2)} W/TH
   - ⚠️  May reduce hashrate by 3-5%

**Apply optimization:**
→ Use tool: set_power_target({
    minerId: "${minerId}",
    watt: ${(currentPowerWatts * 0.97).toFixed(0)}  // Conservative
  })
`}

**Option B: Hashrate Target Optimization**

Instead of setting power directly, optimize for specific hashrate:

1. Choose target hashrate (current: ${totalHashrateThs.toFixed(2)} TH/s):
   - Maximum: ${(totalHashrateThs * 1.05).toFixed(2)} TH/s (may increase power)
   - Efficient: ${(totalHashrateThs * 0.95).toFixed(2)} TH/s (reduces power)

2. Apply hashrate target:
   → Use tool: set_hashrate_target({
       minerId: "${minerId}",
       terahash_per_second: ${(totalHashrateThs * 0.95).toFixed(2)}
     })

**Option C: Advanced Tuning**

For maximum optimization:
1. Enable autotuning (if not already active)
2. Set conservative power target
3. Monitor for 24-48 hours
4. Review performance profiles
5. Adjust based on actual efficiency data

**Option D: Environmental Optimization**

1. **Cooling improvements:**
   ${hashboards.some(hb => (hb.highest_chip_temp?.celsius ?? 0) > 75) ? `
   ⚠️  High temperatures detected (> 75°C)
   - Clean dust from intake fans
   - Verify ambient temperature < 35°C
   - Check fan operation
   - Consider additional cooling
   ` : `
   ✅ Temperatures are good
   - Continue monitoring
   - Maintain clean air intake
   `}

2. **Network optimization:**
   - Verify stable pool connection
   - Minimize rejected shares
   - Reduce network latency

` : `
**Prerequisites for Optimization:**

Before optimizing, ensure:
1. ✅ Miner is online and hashing
2. ✅ Connected to stable mining pool
3. ✅ All hashboards operational
4. ✅ Tuner is active (not disabled)
5. ✅ Adequate cooling (temps < 80°C)

**Next Steps:**
1. Get miner online: troubleshoot_miner_offline prompt
2. Configure pool: Update pool configuration
3. Enable tuner: Check tuner state
4. Return to optimization once prerequisites met
`}

**Step 4: Monitoring & Validation**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After applying power optimization:

**Immediate Monitoring (0-30 minutes):**
1. Watch for tuner stabilization
2. Check if all hashboards remain active
3. Verify no error messages appear
4. Monitor temperature changes

**Short-term Validation (1-4 hours):**
1. Measure actual hashrate average
2. Calculate real efficiency (W/TH)
3. Compare to target metrics
4. Check pool share acceptance rate

**Long-term Optimization (24-48 hours):**
1. Review 24h average hashrate
2. Verify sustained efficiency gains
3. Check for hardware errors
4. Fine-tune if needed

**Tools for Monitoring:**
- Real-time status: get_miner_status({ minerId: "${minerId}", refresh: true })
- Fleet comparison: Use resource braiins:///fleet/summary
- Historical data: Review miner logs and pool statistics

**Step 5: Next Actions**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${currentEfficiency > 0 ? `
**Recommended workflow:**
1. Choose optimization approach (Power Target recommended)
2. Apply settings using suggested tool
3. Wait 15 minutes for stabilization
4. Validate results with get_miner_status
5. Fine-tune if necessary
6. Monitor for 24 hours
7. Repeat for fleet optimization

Would you like me to help apply these settings?
` : `
**Recommended workflow:**
1. Ensure miner is operational
2. Verify tuner is active
3. Return to this prompt once ready
4. Apply optimization settings

Would you like help troubleshooting the miner first?
`}`;

      return [
        {
          role: 'user',
          content: {
            type: 'text',
            text: targetEfficiencyValue
              ? `I want to optimize miner ${minerId} to achieve ${targetEfficiencyValue} W/TH efficiency.`
              : `I want to optimize the power efficiency of miner ${minerId}.`,
          },
        },
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: optimizationText,
          },
        },
      ];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `I want to optimize miner ${minerId} for better power efficiency.`,
          },
        },
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: `I'm unable to analyze miner ${minerId} for power optimization.

**Error:** ${errorMessage}

**Troubleshooting Steps:**

1. **Verify miner is registered:**
   → Use tool: get_fleet_status({})
   Check if ${minerId} appears in the list.

2. **Check miner connectivity:**
   → Use tool: get_miner_status({ minerId: "${minerId}" })
   Ensure miner is reachable.

3. **Review miner status:**
   If miner is offline, use: troubleshoot_miner_offline prompt

4. **Once miner is operational:**
   Return to this prompt for power optimization

**Power Efficiency Best Practices:**

While we resolve the connection issue, here are general optimization guidelines:

**Target Efficiency Ranges:**
- Excellent: < 30 W/TH (Latest ASICs like S19 XP, M50S++)
- Good: 30-35 W/TH (S19 series, M30S++)
- Moderate: 35-40 W/TH (S17 series, M20S)
- Poor: > 40 W/TH (S9, older models)

**Optimization Strategies:**
1. **Power Target Method:**
   - Start with manufacturer recommended power
   - Reduce by 5% increments
   - Monitor hashrate and efficiency
   - Find optimal balance

2. **Environmental Factors:**
   - Maintain ambient temp < 35°C
   - Ensure proper airflow
   - Clean dust regularly
   - Verify fan operation

3. **Firmware Optimization:**
   - Use latest Braiins OS firmware
   - Enable autotuning
   - Review performance profiles
   - Consider custom configurations

4. **Pool Configuration:**
   - Use low-latency pools
   - Minimize rejected shares
   - Configure backup pools
   - Monitor connection stability

Would you like help troubleshooting the connection issue?`,
          },
        },
      ];
    }
  },
};
