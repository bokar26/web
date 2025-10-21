export type ActivityItem = { 
  time: string; 
  activity: string; 
  user: string; 
  type: 'success' | 'warning' | 'info' 
};

export const dailyActivity: ActivityItem[] = generateDailyActivity();

function generateDailyActivity(): ActivityItem[] {
  const activities = [
    { activity: 'New supplier added', user: 'Sarah Chen', type: 'success' as const },
    { activity: 'PO #12345 approved', user: 'Mike Johnson', type: 'success' as const },
    { activity: 'Shipment delayed', user: 'Lisa Wang', type: 'warning' as const },
    { activity: 'Cost analysis completed', user: 'David Kim', type: 'info' as const },
    { activity: 'Quality check passed', user: 'Anna Rodriguez', type: 'success' as const },
    { activity: 'Inventory updated', user: 'Tom Wilson', type: 'info' as const },
    { activity: 'Supplier contacted', user: 'Emma Davis', type: 'info' as const },
    { activity: 'Order processed', user: 'James Brown', type: 'success' as const },
  ];

  return activities.map((item, index) => ({
    ...item,
    time: `${9 + index}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
  }));
}
