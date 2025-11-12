/**
 * Exception evaluation rules
 * Evaluates shipments against thresholds and returns exceptions to create
 */

import { Shipment, Exception, ExceptionType, ExceptionSeverity } from '../types'
import { THRESHOLDS } from '../constants'

/**
 * Evaluate shipment for exceptions based on thresholds
 */
export function evaluateShipmentExceptions(shipment: Shipment): Exception[] {
  const exceptions: Exception[] = []

  // ETA slip check (> 24h)
  if (shipment.planned_eta && shipment.actual_eta) {
    const planned = new Date(shipment.planned_eta)
    const actual = new Date(shipment.actual_eta)
    const hoursDiff = (actual.getTime() - planned.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > THRESHOLDS.ETA_SLIP_HOURS) {
      exceptions.push({
        id: '', // Will be set by data service
        shipment_id: shipment.id,
        exception_type: 'eta_slip' as ExceptionType,
        severity: hoursDiff > 48 ? 'high' : 'medium' as ExceptionSeverity,
        message: `ETA slip of ${Math.round(hoursDiff)} hours exceeds threshold of ${THRESHOLDS.ETA_SLIP_HOURS} hours`,
        threshold_value: THRESHOLDS.ETA_SLIP_HOURS,
        actual_value: hoursDiff,
        resolved_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  // Check milestones for ETA slips
  if (shipment.milestones) {
    for (const milestone of shipment.milestones) {
      if (milestone.planned_date && milestone.actual_date) {
        const planned = new Date(milestone.planned_date)
        const actual = new Date(milestone.actual_date)
        const hoursDiff = (actual.getTime() - planned.getTime()) / (1000 * 60 * 60)

        if (hoursDiff > THRESHOLDS.ETA_SLIP_HOURS) {
          exceptions.push({
            id: '',
            shipment_id: shipment.id,
            exception_type: 'eta_slip' as ExceptionType,
            severity: hoursDiff > 48 ? 'high' : 'medium' as ExceptionSeverity,
            message: `Milestone "${milestone.milestone_type}" slip of ${Math.round(hoursDiff)} hours`,
            threshold_value: THRESHOLDS.ETA_SLIP_HOURS,
            actual_value: hoursDiff,
            resolved_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      }
    }
  }

  // Check costs for variance (> 8%)
  if (shipment.costs) {
    for (const cost of shipment.costs) {
      if (cost.variance_pct && Math.abs(cost.variance_pct) > THRESHOLDS.COST_VARIANCE_PERCENT) {
        exceptions.push({
          id: '',
          shipment_id: shipment.id,
          exception_type: 'cost_variance' as ExceptionType,
          severity: Math.abs(cost.variance_pct) > 15 ? 'high' : 'medium' as ExceptionSeverity,
          message: `Cost variance of ${cost.variance_pct.toFixed(1)}% for ${cost.cost_type} exceeds threshold of ${THRESHOLDS.COST_VARIANCE_PERCENT}%`,
          threshold_value: THRESHOLDS.COST_VARIANCE_PERCENT,
          actual_value: Math.abs(cost.variance_pct),
          resolved_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    }
  }

  // Check booking for free time (< 48h)
  if (shipment.booking && shipment.booking.cutoff_date && shipment.booking.sailing_date) {
    const cutoff = new Date(shipment.booking.cutoff_date)
    const sailing = new Date(shipment.booking.sailing_date)
    const hoursDiff = (sailing.getTime() - cutoff.getTime()) / (1000 * 60 * 60)

    if (hoursDiff < THRESHOLDS.FREE_TIME_HOURS) {
      exceptions.push({
        id: '',
        shipment_id: shipment.id,
        exception_type: 'free_time_low' as ExceptionType,
        severity: hoursDiff < 24 ? 'high' : 'medium' as ExceptionSeverity,
        message: `Free time of ${Math.round(hoursDiff)} hours is below threshold of ${THRESHOLDS.FREE_TIME_HOURS} hours`,
        threshold_value: THRESHOLDS.FREE_TIME_HOURS,
        actual_value: hoursDiff,
        resolved_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  return exceptions
}

