/**
 * Batch Firmware Update Prompt
 *
 * Step-by-step guided workflow for updating firmware on multiple miners.
 * Includes pre-flight checks, progress monitoring, and failure recovery.
 *
 * URI: batch_firmware_update
 *
 * @module mcp/prompts/batch-firmware-update
 */

import type { MCPPromptDefinition, PromptContext, PromptMessage } from './types';

export const batchFirmwareUpdatePrompt: MCPPromptDefinition = {
  name: 'batch_firmware_update',
  description: 'Step-by-step workflow for safely updating firmware on multiple miners with rollback guidance',
  arguments: [
    {
      name: 'minerIds',
      description: 'Comma-separated list of miner IDs to update (or "all" for entire fleet)',
      required: true,
    },
    {
      name: 'version',
      description: 'Target firmware version (e.g., 2.0.1)',
      required: true,
    },
  ],

  handler: async (args: Record<string, string>, context: PromptContext): Promise<PromptMessage[]> => {
    const { minerIds: minerIdsArg, version } = args;

    if (!minerIdsArg || !version) {
      return [
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: 'Error: Both minerIds and version are required. Example: minerIds="miner-1,miner-2,miner-3" version="2.0.1"',
          },
        },
      ];
    }

    // Validate firmware version format
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(version)) {
      return [
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: `Error: Invalid firmware version format "${version}". Version must follow semantic versioning (e.g., 2.0.1).`,
          },
        },
      ];
    }

    try {
      // Parse miner IDs
      let minerIds: string[];
      if (minerIdsArg.toLowerCase() === 'all') {
        // Get all registered miners
        const fleetStatus = await context.minerService.getFleetStatus();
        minerIds = fleetStatus.miners.map((m) => m.id);

        if (minerIds.length === 0) {
          return [
            {
              role: 'assistant',
              content: {
                type: 'text',
                text: 'No miners are currently registered. Please register miners before attempting firmware updates.',
              },
            },
          ];
        }
      } else {
        minerIds = minerIdsArg.split(',').map((id) => id.trim()).filter((id) => id.length > 0);
      }

      if (minerIds.length === 0) {
        return [
          {
            role: 'assistant',
            content: {
              type: 'text',
              text: 'Error: No valid miner IDs provided. Please specify at least one miner ID or use "all".',
            },
          },
        ];
      }

      if (minerIds.length > 100) {
        return [
          {
            role: 'assistant',
            content: {
              type: 'text',
              text: `Error: Batch limit exceeded. You specified ${minerIds.length} miners, but maximum is 100 per batch. Consider splitting into multiple batches.`,
            },
          },
        ];
      }

      // Pre-flight check: Get status of all miners
      const minerStatusChecks = await Promise.allSettled(
        minerIds.map(async (minerId) => {
          const status = await context.minerService.getMinerStatus(minerId);
          return { minerId, status };
        })
      );

      const successfulChecks = minerStatusChecks.filter((r) => r.status === 'fulfilled') as Array<{
        status: 'fulfilled';
        value: { minerId: string; status: { online: boolean; info?: { bos_version: { current: string } } } };
      }>;
      const failedChecks = minerStatusChecks.filter((r) => r.status === 'rejected');

      const onlineMiners = successfulChecks.filter((r) => r.value.status.online);
      const offlineMiners = successfulChecks.filter((r) => !r.value.status.online);
      const unreachableMiners = failedChecks.length;

      const workflowText = `I'll help you update firmware to version ${version} on ${minerIds.length} miner(s).

**Step 1: Pre-Flight Checks**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Fleet Status:**
- Total miners selected: ${minerIds.length}
- Online and ready: ${onlineMiners.length} ✅
- Offline: ${offlineMiners.length} ${offlineMiners.length > 0 ? '⚠️' : ''}
- Unreachable/Not found: ${unreachableMiners} ${unreachableMiners > 0 ? '❌' : ''}

${offlineMiners.length > 0 ? `
**Offline Miners:**
${offlineMiners.map((m) => `- ${m.value.minerId}`).join('\n')}

⚠️  **Recommendation:** Bring offline miners online before updating, or exclude them from this batch.
` : ''}

${unreachableMiners > 0 ? `
⚠️  **Warning:** ${unreachableMiners} miner(s) could not be reached.
This may indicate registration issues or network problems.

**Action Required:** Review and fix unreachable miners before proceeding.
→ Use tool: get_fleet_status({}) to identify unreachable miners
` : ''}

**Current Firmware Versions:**
${onlineMiners.length > 0 ? onlineMiners.map((m) => {
  const currentVersion = m.value.status.info?.bos_version.current ?? 'Unknown';
  const needsUpdate = currentVersion !== version;
  return `- ${m.value.minerId}: ${currentVersion} ${needsUpdate ? '→ ' + version + ' (UPDATE)' : '(CURRENT)'}`;
}).join('\n') : 'No version information available'}

**Step 2: Risk Assessment**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Update Scope:**
- Number of miners: ${minerIds.length}
- Risk level: ${minerIds.length < 5 ? 'Low (< 5 miners)' :
               minerIds.length < 20 ? 'Moderate (5-20 miners)' :
               minerIds.length < 50 ? 'High (20-50 miners)' :
               'Very High (50+ miners)'}

**Firmware Update Risks:**
${minerIds.length > 20 ? `
⚠️  **Large Batch Warning:**
- Updating ${minerIds.length} miners simultaneously may:
  * Cause significant temporary hashrate loss
  * Strain network bandwidth if miners download simultaneously
  * Make troubleshooting individual failures difficult

**Recommendation:** Consider phased rollout:
1. Test on 3-5 miners first
2. Verify success before proceeding
3. Update remainder in batches of 20-30
` : `
✅ Batch size is manageable for simultaneous update.
`}

**Critical Reminders:**
- Miners will reboot during firmware update (5-10 minutes downtime per miner)
- Pool connection will be temporarily lost
- Network bandwidth required for firmware download
- Update is typically irreversible without manual intervention

**Prerequisites Checklist:**
${onlineMiners.length === minerIds.length ? '✅' : '❌'} All miners online
${unreachableMiners === 0 ? '✅' : '❌'} All miners reachable
${minerIds.length <= 30 ? '✅' : '⚠️ '} Batch size manageable
${onlineMiners.some(m => m.value.status.info?.bos_version.current === version) ? '⚠️  Some miners already on target version' : '✅ All miners need update'}

**Step 3: Execution Plan**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${onlineMiners.length > 0 && unreachableMiners === 0 && offlineMiners.length === 0 ? `
✅ **Ready to proceed!**

**Execution Strategy:**

**Option A: Full Batch Update (All at once)**
→ Use tool: update_miner_firmware({
    minerIds: ${JSON.stringify(minerIds.slice(0, 3))}${minerIds.length > 3 ? `, ...${minerIds.length - 3} more` : ''},
    version: "${version}"
  })

**Option B: Phased Rollout (Recommended for ${minerIds.length}+ miners)**

Phase 1: Test Group (3-5 miners)
  → Update: ${JSON.stringify(minerIds.slice(0, Math.min(3, minerIds.length)))}
  → Verify: Wait 15 minutes, check for issues
  → Tool: update_miner_firmware({ minerIds: [first batch], version: "${version}" })

Phase 2: Main Rollout
  → Update: Remaining ${Math.max(0, minerIds.length - 3)} miners
  → Tool: update_miner_firmware({ minerIds: [remaining batch], version: "${version}" })

**What happens during update:**
1. Tool returns job ID immediately
2. Update runs in background (5-10 min per miner)
3. Miners download firmware
4. Automatic reboot and flash
5. Miners reconnect to pool

**Monitoring progress:**
→ Use tool: check_job_status({ jobId: "JOB_ID_FROM_UPDATE" })
Poll every 30-60 seconds for progress updates
` : `
❌ **Prerequisites not met - Cannot proceed safely**

**Issues to resolve:**

${offlineMiners.length > 0 ? `
1. **Offline Miners (${offlineMiners.length}):**
   ${offlineMiners.map((m) => `→ ${m.value.minerId}: Use troubleshoot_miner_offline prompt`).join('\n   ')}
` : ''}

${unreachableMiners > 0 ? `
2. **Unreachable Miners (${unreachableMiners}):**
   → Verify miner registration
   → Check network connectivity
   → Use get_fleet_status to identify miners
` : ''}

**Once resolved:**
- Re-run this prompt with same parameters
- Or exclude problematic miners from batch
`}

**Step 4: Monitoring & Validation**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**During Update (0-15 minutes):**

1. **Monitor job progress:**
   → Tool: check_job_status({ jobId: "YOUR_JOB_ID" })
   - Check every 60 seconds
   - Watch for completion status
   - Note any failures

2. **Expected timeline:**
   - Firmware download: 1-2 minutes per miner
   - Flash and reboot: 3-5 minutes per miner
   - Reconnect and initialize: 1-2 minutes per miner
   - **Total per miner: 5-10 minutes**
   - **Batch of ${minerIds.length}: ${Math.ceil(minerIds.length * 7)} minutes estimated**

3. **Failure indicators:**
   - Miner doesn't reconnect after 15 minutes
   - Job status shows failures
   - Hashrate doesn't recover

**Post-Update Validation (15-30 minutes):**

1. **Verify firmware versions:**
   → Tool: get_fleet_status({})
   - Confirm all miners on version ${version}
   - Check for version mismatches

2. **Verify mining operation:**
   - All miners back online
   - Hashrate recovered to pre-update levels
   - No new error messages
   - Pool connections active

3. **Performance check:**
   → Tool: get_miner_status({ minerId: "MINER_ID", refresh: true })
   - Check each miner's status
   - Verify hashboards operational
   - Confirm temperatures normal

**Step 5: Failure Recovery**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**If some miners fail to update:**

1. **Identify failed miners:**
   → check_job_status will list failures
   - Note which miners failed
   - Review error messages

2. **Common failure scenarios:**

   **Scenario A: Download failed**
   - Cause: Network issues, slow connection
   - Fix: Retry update for failed miners only
   - Tool: update_miner_firmware({ minerIds: [failed list], version: "${version}" })

   **Scenario B: Flash failed**
   - Cause: Insufficient storage, corruption
   - Fix:
     1. Reboot miner: reboot_miner({ minerId: "FAILED_MINER" })
     2. Wait for recovery
     3. Retry update

   **Scenario C: Won't reconnect after update**
   - Cause: Update successful but startup issue
   - Fix:
     1. Wait 15 minutes for auto-recovery
     2. Power cycle if no recovery
     3. Check physical miner status
     4. Use: troubleshoot_miner_offline prompt

3. **Rollback (if critical issues):**
   ⚠️  **Warning:** Braiins OS firmware updates are typically one-way.

   If you must downgrade:
   - Access miner web interface directly
   - Use Braiins OS firmware flasher
   - May require SD card reflash
   - Contact Braiins support for assistance

**Step 6: Next Actions**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${onlineMiners.length > 0 && unreachableMiners === 0 && offlineMiners.length === 0 ? `
**Ready to proceed! Choose your approach:**

1. **Full Batch (Quick, All at once):**
   Execute update tool with all ${minerIds.length} miners

2. **Phased Rollout (Safer, Recommended):**
   Test with ${Math.min(3, minerIds.length)} miners first, then proceed with rest

3. **Abort and Reschedule:**
   Postpone update to maintenance window

**To proceed with full batch:**
\`\`\`
update_miner_firmware({
  minerIds: ${JSON.stringify(minerIds)},
  version: "${version}"
})
\`\`\`

Would you like me to help you execute the update?
` : `
**Prerequisites not met. Next steps:**

1. Resolve offline/unreachable miners
2. Re-run this prompt
3. Or adjust miner selection to exclude problematic units

Would you like help troubleshooting the offline miners?
`}`;

      return [
        {
          role: 'user',
          content: {
            type: 'text',
            text: minerIdsArg.toLowerCase() === 'all'
              ? `I need to update firmware to version ${version} on all my miners. Can you guide me through the process?`
              : `I need to update firmware to version ${version} on these miners: ${minerIds.join(', ')}. Can you help?`,
          },
        },
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: workflowText,
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
            text: `I want to update firmware to version ${version} on my miners.`,
          },
        },
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: `I encountered an error while preparing the firmware update workflow.

**Error:** ${errorMessage}

**Troubleshooting Steps:**

1. **Verify miner registration:**
   → Use tool: get_fleet_status({})
   Ensure all miners are registered and reachable.

2. **Check miner IDs:**
   Verify the miner IDs are correct:
   ${minerIdsArg}

3. **Verify firmware version:**
   Version "${version}" must:
   - Follow semantic versioning (e.g., 2.0.1)
   - Be a valid Braiins OS version
   - Be available for download

**Valid Firmware Version Format:**
- ✅ Good: 2.0.1, 1.9.3, 2.1.0
- ❌ Bad: v2.0.1, 2.0, latest, 2.0.1-beta

**General Firmware Update Best Practices:**

**Before Update:**
- Backup miner configurations
- Choose maintenance window (low mining demand)
- Verify network stability
- Ensure adequate bandwidth for downloads
- Have physical access to miners (in case of issues)

**During Update:**
- Monitor progress continuously
- Don't power off miners mid-update
- Keep network connection stable
- Document any failures

**After Update:**
- Verify all miners online
- Check firmware versions match
- Monitor hashrate recovery
- Check for new errors
- Test pool connections

**Recommended Update Strategy:**

For fleets with 10+ miners:
1. **Phase 1:** Update 3-5 test miners
2. **Phase 2:** Validate test miners (24 hours)
3. **Phase 3:** Update 20-30% of fleet
4. **Phase 4:** Complete remaining miners

For fleets with < 10 miners:
- Can update all simultaneously
- Still recommend testing on 1-2 first

Would you like help resolving the error and trying again?`,
          },
        },
      ];
    }
  },
};
