export type CardKey = 
  | 'goal'
  | 'timeSavings'
  | 'costSavings'
  | 'kpiRevenue'
  | 'kpiCommission'
  | 'kpiOpenOrders'
  | 'kpiTimeSaved'
  | 'cccTrend'
  | 'shipTrend'
  | 'vendorRegion'
  | 'suggestions'
  | 'heatmap';

export type CardConfig = {
  key: CardKey;
  visible: boolean;
  size?: 'sm' | 'md' | 'lg';
  metric?: string;
};

export type LayoutState = CardConfig[];

export const defaultLayout: LayoutState = [
  { key: 'goal', visible: true, size: 'lg' },
  { key: 'timeSavings', visible: true },
  { key: 'costSavings', visible: true },
  { key: 'kpiRevenue', visible: true },
  { key: 'kpiCommission', visible: true },
  { key: 'kpiOpenOrders', visible: true },
  { key: 'kpiTimeSaved', visible: true },
  { key: 'cccTrend', visible: true, size: 'lg' },
  { key: 'shipTrend', visible: true, size: 'lg' },
  { key: 'vendorRegion', visible: true },
  { key: 'suggestions', visible: true },
  { key: 'heatmap', visible: true, size: 'lg' },
];

export function saveLayout(layout: LayoutState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sla_dashboard_layout_v1', JSON.stringify(layout));
  }
}

export function loadLayout(): LayoutState {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sla_dashboard_layout_v1');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultLayout;
      }
    }
  }
  return defaultLayout;
}
