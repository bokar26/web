/**
 * Feature flags for the application
 * 
 * Feature flags are controlled via environment variables:
 * - NEXT_PUBLIC_FEATURE_* = '1' to enable, '0' to disable
 * - Default behavior: enabled in development, disabled in production
 */

import { isShippingPlansExecEnabled } from '@/features/shipping-plans-exec/featureFlag'
import { isInventoryExecEnabled } from '@/features/inventory-exec/featureFlag'
import { isDemandExecEnabled } from '@/features/forecast/featureFlag'
import { isCostProjectionsV1Enabled } from '@/features/cost-projections/featureFlag'

export function isNewShellNavEnabled(): boolean {
  return process.env.NEXT_PUBLIC_NEW_SHELL_NAV === '1'
}

export function isWorkbenchEnabled(): boolean {
  // Default to enabled, can be disabled with NEXT_PUBLIC_FEATURE_WORKBENCH=0
  const flag = process.env.NEXT_PUBLIC_FEATURE_WORKBENCH
  return flag !== '0' // Enabled by default unless explicitly disabled
}

export function isTimelineEnabled(): boolean {
  // Must be explicitly enabled with NEXT_PUBLIC_FEATURE_TIMELINE=1
  return process.env.NEXT_PUBLIC_FEATURE_TIMELINE === '1'
}

// Lazy getter function to avoid module-level evaluation
export function getFeatures() {
  return {
  shippingPlansExec: isShippingPlansExecEnabled(),
  inventoryExec: isInventoryExecEnabled(),
  demandExec: isDemandExecEnabled(),
  costProjectionsV1: isCostProjectionsV1Enabled(),
    newShellNav: isNewShellNavEnabled(),
    workbench: isWorkbenchEnabled(),
    timeline: isTimelineEnabled(),
  }
}

// Lazy features object - only evaluated when accessed (not at module load time)
// Use individual functions (isWorkbenchEnabled, etc.) instead when possible
// This uses getters to defer evaluation until the property is actually accessed
const _featuresLazy = {
  get shippingPlansExec() { return isShippingPlansExecEnabled() },
  get inventoryExec() { return isInventoryExecEnabled() },
  get demandExec() { return isDemandExecEnabled() },
  get costProjectionsV1() { return isCostProjectionsV1Enabled() },
  get newShellNav() { return isNewShellNavEnabled() },
  get workbench() { return isWorkbenchEnabled() },
  get timeline() { return isTimelineEnabled() },
}

export const features = _featuresLazy

