# Shipping Plans Execution Feature

## Overview

Sprint 1 implementation of the Shipping Plans Execution feature, enabling users to apply shipping plans, create shipments, manage RFQs, accept quotes, generate documents, track milestones, manage tasks, record costs, and monitor exceptions—all from the Shipping Plans page.

## Scope (Sprint 1)

### Core Functionality
- **Apply Plan**: Convert recommended routes into shipments with legs, containers, allocations, and planned costs
- **RFQ Workflow**: Create RFQs for selected providers, send emails, track quotes
- **Quote Acceptance**: Accept quotes, create bookings, update shipment status
- **Document Generation**: Generate ASN, CI, PL documents (placeholder implementation)
- **Milestone Tracking**: Manual milestone creation/update with ETA delta recalculation
- **Task Management**: Create tasks linked to shipments/exceptions
- **Cost Tracking**: Record planned vs actual costs with variance calculation
- **Exception Handling**: Automatic exception creation based on thresholds
- **KPIs**: Aggregated metrics dashboard (savings, transit time, on-time %, etc.)

## Component Tree

```
features/shipping-plans-exec/
├── README.md
├── constants.ts
├── featureFlag.ts
├── types.ts
├── data/
│   ├── shipments.ts
│   ├── quotes.ts
│   ├── documents.ts
│   ├── costs.ts
│   ├── exceptions.ts
│   ├── tasks.ts
│   ├── milestones.ts
│   ├── audit.ts
│   └── schedules/
│       └── static-sailings.json
├── actions/
│   ├── applyPlan.ts
│   ├── createRFQ.ts
│   ├── acceptQuote.ts
│   ├── generateDocument.ts
│   ├── upsertMilestone.ts
│   ├── createTask.ts
│   └── upsertCost.ts
├── components/
│   ├── ExecutionConsole.tsx
│   ├── ShipmentDrawer.tsx
│   └── ShippingKPIs.tsx
└── rules/
    └── exceptions.ts
```

## Data Contracts

### Core Entities
- `Shipment`: Main shipment record with origin, destination, carrier, status, ETAs, costs
- `ShipmentLeg`: Individual leg of a multi-leg shipment
- `Container`: Container assignment to shipment
- `ContainerItem`: SKU allocation within container
- `Allocation`: Inventory reservation against SKUs/suppliers/warehouses
- `Quote`: RFQ quote from provider
- `Booking`: Booking record after quote acceptance
- `Document`: Generated document (ASN, CI, PL) with versioning
- `Cost`: Planned or actual cost component
- `Exception`: Exception record for threshold violations
- `Task`: Task linked to shipment/exception
- `Milestone`: Milestone with planned/actual dates

### Status Enums
- `ShipmentStatus`: 'draft' | 'planned' | 'booked' | 'in_transit' | 'delivered' | 'cancelled'
- `BookingStatus`: 'pending' | 'confirmed' | 'cancelled'
- `TaskStatus`: 'open' | 'in_progress' | 'completed' | 'cancelled'
- `QuoteStatus`: 'rfq' | 'quoted' | 'accepted' | 'rejected' | 'expired'

## Event Flows

### Apply Plan Flow
1. User selects route cards → clicks "Apply"
2. `applyPlan` action validates plans
3. Creates shipments + legs + containers + allocations + planned costs (single transaction)
4. Writes audit log
5. Returns shipment summaries
6. Toast notification: "Plan applied successfully"

### RFQ Flow
1. User selects shipments → clicks "Create RFQ" → selects providers
2. `createRFQ` action creates quotes in 'rfq' status
3. Sends email via Resend to each provider
4. Writes audit log
5. Toast notification: "RFQ sent to {count} providers"

### Accept Quote Flow
1. User reviews quotes → clicks "Accept Quote"
2. `acceptQuote` action updates quote status → 'accepted'
3. Creates booking with sailing info from static JSON
4. Updates shipment status → 'booked'
5. Writes audit log
6. Toast notification: "Quote accepted, booking created"

### Document Generation Flow
1. User clicks "Generate {ASN|CI|PL}"
2. `generateDocument` action creates placeholder PDF
3. Stores in Supabase Storage (if configured)
4. Upserts documents record with versioning
5. Writes audit log
6. Toast notification: "{DocumentType} generated successfully"

## Database Schema

See `docs/shipping_exec_tables.sql` for complete schema.

Key tables:
- `shipments`, `shipment_legs`, `containers`, `container_items`, `allocations`
- `quotes`, `bookings`, `documents`, `costs`, `exceptions`, `tasks`, `milestones`
- `audit_logs`

All tables use `owner_user_id` (UUID) for multi-tenancy. RLS disabled, application-level security enforced.

## API Routes / Server Actions

All actions located in `features/shipping-plans-exec/actions/`:
- `applyPlan`: Creates shipments from plans
- `createRFQ`: Creates quotes and sends emails
- `acceptQuote`: Accepts quote and creates booking
- `generateDocument`: Generates documents (placeholder)
- `upsertMilestone`: Creates/updates milestones
- `createTask`: Creates tasks
- `upsertCost`: Records costs and evaluates exceptions

## Feature Flag

Controlled by `NEXT_PUBLIC_FEATURE_SHIPPING_EXEC`:
- Default: **ON** in development, **OFF** in production
- Set to `1` to enable in production
- All new UI components gated behind flag check

## How to Demo Sprint 1 (3 minutes)

1. Navigate to `/dashboard/plan/shipping`
2. Ensure feature flag is enabled (check `NEXT_PUBLIC_FEATURE_SHIPPING_EXEC=1`)
3. Click "Apply" on a route card → shipment created
4. Open Execution Console → see shipment in Activity tab
5. Click "Create RFQ" → select providers → RFQ sent
6. Click "Accept Quote" on a quote → booking created
7. Click "Generate ASN" → document generated
8. Update milestone date → exception evaluated
9. View KPIs → see aggregated metrics

## Future Enhancements (Post-Sprint 1)

- Mapbox integration for interactive map
- Real PDF generation (replace placeholder)
- Containerization manual adjustment
- Advanced allocation management
- Task assignment and mentions
- Cost variance reporting
- Exception resolution workflow
- Daily digest cron job

