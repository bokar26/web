# Inventory Execution Feature

## Overview

Sprint 1 implementation of the Inventory Execution feature, enabling users to generate replenishment plans, create purchase orders, manage transfers, track cycle counts, post adjustments, and monitor inventory KPIs—all from the Inventory Plans page.

## Scope (Sprint 1)

### Core Functionality
- **Generate Plans**: Calculate replenishment recommendations based on reorder policies and forecasts
- **Purchase Orders**: Create POs from plans or manually, track status
- **Transfers**: Create inter-warehouse transfers with line items
- **Adjustments**: Post stock adjustments with reasons (damage, shrink, found, other)
- **Cycle Counts**: Schedule and finalize cycle counts with variance tracking
- **Policy Management**: Create/update reorder policies (minmax, ss-dlt, periodic)
- **Exception Handling**: Automatic exception creation for stockout risk, overstock, negative on-hand
- **KPIs**: Working capital impact, safety stock coverage, stockout/overstock risks

## Component Tree

```
features/inventory-exec/
├── README.md
├── constants.ts
├── featureFlag.ts
├── types.ts
├── data/
│   ├── warehouses.ts
│   ├── snapshots.ts
│   ├── transactions.ts
│   ├── policies.ts
│   ├── forecasts.ts
│   ├── plans.ts
│   ├── pos.ts
│   ├── transfers.ts
│   ├── adjustments.ts
│   ├── counts.ts
│   └── audit.ts
├── actions/
│   ├── generateReplenishmentPlans.ts
│   ├── acceptReplan.ts
│   ├── createPO.ts
│   ├── createTransfer.ts
│   ├── postAdjustment.ts
│   ├── upsertPolicy.ts
│   ├── scheduleCycleCount.ts
│   ├── finalizeCycleCount.ts
│   ├── getInventoryExecutionData.ts
│   └── dismissPlan.ts
└── components/
    ├── InventoryConsole.tsx
    ├── SKUDrawer.tsx
    ├── POModal.tsx
    └── TransferModal.tsx
```

## Data Contracts

### Core Entities
- `Warehouse`: Warehouse location with code, name, address
- `InventorySnapshot`: Current inventory levels (on_hand, reserved, on_order, backorder)
- `InventoryTransaction`: Transaction record (receipt, issue, return, adjust, transfer_in, transfer_out)
- `ReorderPolicy`: Reorder policy configuration (method, safety_stock, reorder_point, etc.)
- `Forecast`: Demand forecast for SKU/warehouse
- `ReplenishmentPlan`: Generated replenishment recommendation
- `PurchaseOrder`: PO header with supplier, status, expected_date
- `POLine`: PO line item (sku, qty, price, warehouse, promised_date)
- `Transfer`: Inter-warehouse transfer header
- `TransferLine`: Transfer line item (sku, qty)
- `CycleCount`: Cycle count schedule/result
- `CountLine`: Count line with system vs counted qty
- `StockAdjustment`: Adjustment record with reason

### Status Enums
- `POStatus`: 'draft' | 'confirmed' | 'closed' | 'cancelled'
- `TransferStatus`: 'planned' | 'in_transit' | 'received' | 'cancelled'
- `CycleCountStatus`: 'scheduled' | 'in_progress' | 'posted' | 'cancelled'
- `PlanStatus`: 'new' | 'accepted' | 'dismissed' | 'ordered'
- `PlanPriority`: 'low' | 'medium' | 'high'
- `TransactionType`: 'receipt' | 'issue' | 'return' | 'adjust' | 'transfer_in' | 'transfer_out'
- `AdjustmentReason`: 'damage' | 'shrink' | 'found' | 'other'
- `PolicyMethod`: 'minmax' | 'ss-dlt' | 'periodic'

## Event Flows

### Generate Plans Flow
1. User clicks "Generate Plans" → `generateReplenishmentPlans` action
2. Queries all reorder policies for owner
3. For each (sku, warehouse): calculates SS, DLT, ROP, net, recommended_qty
4. Upserts `replenishment_plans` with status='new'
5. Writes audit log
6. Toast notification: "Generated {count} replenishment plans"

### Create PO Flow
1. User clicks "Generate PO" on plan card → opens `POModal`
2. Selects supplier, confirms lines (sku, qty, price, warehouse, promised_date)
3. `createPO` action generates PO number, inserts `purchase_orders + po_lines`
4. Writes audit log
5. Toast notification: "Purchase order created"

### Create Transfer Flow
1. User clicks "Create Transfer" on plan card → opens `TransferModal`
2. Selects from/to warehouses, confirms lines (sku, qty)
3. `createTransfer` action inserts `transfers + transfer_lines`
4. Writes audit log
5. Toast notification: "Transfer created"

### Post Adjustment Flow
1. User opens SKUDrawer → Adjust tab → enters qty_delta, reason
2. `postAdjustment` action inserts `stock_adjustments + inventory_transactions`
3. Updates `inventory_snapshots.on_hand`
4. Writes audit log
5. Toast notification: "Adjustment posted"

### Cycle Count Flow
1. User schedules count → `scheduleCycleCount` creates `cycle_counts + count_lines`
2. User enters counted quantities → `finalizeCycleCount` calculates variances
3. Creates `inventory_transactions` (adjust) for each variance
4. Updates `cycle_counts.status = 'posted'`
5. Writes audit log
6. Toast notification: "Cycle count finalized"

## Database Schema

See `docs/inventory_exec_tables.sql` for complete schema.

Key tables:
- `warehouses`, `inventory_snapshots`, `inventory_transactions`
- `reorder_policies`, `forecasts`, `replenishment_plans`
- `purchase_orders`, `po_lines`, `transfers`, `transfer_lines`
- `cycle_counts`, `count_lines`, `stock_adjustments`
- `audit_logs` (reused from shipping)

All tables use `owner_user_id` (UUID) for multi-tenancy. RLS enabled but app-level security enforced.

## API Routes / Server Actions

All actions located in `features/inventory-exec/actions/`:
- `generateReplenishmentPlans`: Calculates and creates replenishment plans
- `acceptReplan`: Accepts plan and returns staged PO/Transfer DTOs
- `createPO`: Creates purchase order with lines
- `createTransfer`: Creates transfer with lines
- `postAdjustment`: Posts adjustment and creates transaction
- `upsertPolicy`: Creates/updates reorder policy
- `scheduleCycleCount`: Schedules cycle count
- `finalizeCycleCount`: Finalizes count and posts adjustments
- `getInventoryExecutionData`: Fetches all execution data for console/drawer
- `dismissPlan`: Dismisses replenishment plan

## Feature Flag

Controlled by `NEXT_PUBLIC_FEATURE_INVENTORY_EXEC`:
- Default: **ON** in development, **OFF** in production
- Set to `1` to enable in production
- All new UI components gated behind flag check

## How to Demo Sprint 1 (3 minutes)

1. Navigate to `/dashboard/plan/inventory`
2. Ensure feature flag is enabled (check `NEXT_PUBLIC_FEATURE_INVENTORY_EXEC=1`)
3. Click "Generate Plans" → plans created
4. Click on Safety Stock item → opens SKUDrawer
5. Click "Generate PO" on plan card → creates PO
6. Click "Create Transfer" on plan card → creates transfer
7. Open InventoryConsole → see Plans, POs, Transfers tabs
8. Post adjustment from SKUDrawer → transaction created
9. Schedule cycle count → finalize with variances

## Future Enhancements (Post-Sprint 1)

- Real-time inventory sync from WMS
- Advanced forecasting models
- Automated exception resolution
- PO approval workflow
- Transfer tracking with status updates
- Batch operations (bulk PO creation, bulk transfers)
- Inventory valuation and costing
- ABC/XYZ analysis integration

