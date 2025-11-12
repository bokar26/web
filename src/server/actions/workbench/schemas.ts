import { z } from 'zod'

export const runForecastSchema = z.object({
  modelId: z.string().optional(),
  scope: z.object({
    period: z.string(),
    channel: z.string().optional(),
    category: z.string().optional(),
  }),
  confidence: z.number().min(0).max(1),
  horizonDays: z.number().positive().optional(),
})

export const forecastOverrideSchema = z.object({
  skuId: z.string(),
  horizonDate: z.string(),
  overrideValue: z.number(),
  reason: z.string().optional(),
})

export const publishForecastSchema = z.object({
  runId: z.string(),
  version: z.string().optional(),
})

export const resolveExceptionSchema = z.object({
  exceptionId: z.string(),
  exceptionType: z.enum(['forecast', 'general']),
  resolutionNote: z.string().optional(),
})

export const createReplenishmentPlanSchema = z.object({
  skuIds: z.array(z.string()),
  warehouseId: z.string(),
  parameters: z.object({
    method: z.enum(['minmax', 'ss-dlt', 'periodic']).optional(),
    safetyStock: z.number().optional(),
    reorderPoint: z.number().optional(),
    leadTimeDays: z.number().optional(),
    serviceLevelPct: z.number().optional(),
  }),
  applyPolicies: z.boolean().optional(),
})

export const createShippingBookingSchema = z.object({
  originPortId: z.string().optional(),
  destinationPortId: z.string().optional(),
  freightForwarderId: z.string().optional(),
  carrierId: z.string().optional(),
  legs: z.array(
    z.object({
      origin: z.string(),
      destination: z.string(),
      estimatedDeparture: z.string().optional(),
      estimatedArrival: z.string().optional(),
    })
  ),
  containers: z
    .array(
      z.object({
        containerType: z.string(),
        items: z.array(
          z.object({
            skuId: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .optional(),
})

export const simulateCostSchema = z.object({
  skuIds: z.array(z.string()),
  originPortId: z.string().optional(),
  destinationPortId: z.string().optional(),
  freightForwarderId: z.string().optional(),
  quantity: z.number().optional(),
})

export const raisePOSchema = z.object({
  supplierId: z.string(),
  lines: z.array(
    z.object({
      skuId: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ),
  documentIds: z.array(z.string()).optional(),
})

export const uploadDocumentSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number().nonnegative(),
  fileUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
})

export const linkDocumentSchema = z.object({
  documentId: z.string(),
  entityType: z.enum(['purchase_order', 'shipment', 'published_forecast']),
  entityId: z.string(),
})

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  linkedExceptionId: z.string().optional(),
  linkedRunId: z.string().optional(),
  assignedTo: z.string().optional(),
})

export const updateTaskSchema = z.object({
  taskId: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedTo: z.string().optional(),
})

