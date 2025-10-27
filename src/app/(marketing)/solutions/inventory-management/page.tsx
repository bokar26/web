import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export default function InventoryManagementPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white">Inventory Management</h1>
          <p className="mt-4 text-lg text-gray-300">
            Balance stock levels with AI-driven demand forecasts. Track and manage inventory across all warehouses, optimize purchase orders, monitor risks, and reduce overstock and stockouts while optimizing working capital for maximum efficiency.
          </p>
        </div>

        {/* Purchase Order Management Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Purchase Order Management</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Centralized PO Tracking</h3>
              <p className="text-gray-300">
                Track and manage all purchase orders in one unified platform. Get real-time visibility into PO status, expected delivery dates, and supplier performance. Automatically sync POs with inventory levels to ensure timely reordering without manual intervention.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">127</div>
                  <div className="text-sm text-gray-400">Active POs</div>
                  <div className="text-xs text-gray-500 mt-1">In transit</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">SKU #8432 low stock (42 units remaining) - Create PO for 500 units to arrive in 12 days</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Automated PO Creation</h3>
              <p className="text-gray-300">
                Set up automated purchase order creation based on reorder points, demand forecasts, and safety stock requirements. SLA monitors inventory levels continuously and generates POs when stock reaches predefined thresholds, ensuring you never run out of critical items.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">PO Variance Analysis</h3>
              <p className="text-gray-300">
                Compare ordered quantities to received quantities and track discrepancies. Identify patterns in supplier performance, monitor fulfillment accuracy, and make data-driven decisions about which suppliers to prioritize for future orders.
              </p>
            </div>
          </div>
        </section>

        {/* Inventory Availability Tracking Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Inventory Availability Tracking</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Multi-Warehouse Visibility</h3>
              <p className="text-gray-300">
                Get real-time visibility into inventory availability across all your warehouse locations. See exactly how much stock you have, where it's located, and what's reserved versus available for sale. SLA provides a unified view of your entire inventory network.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">98.3%</div>
                  <div className="text-sm text-gray-400">Inventory Accuracy</div>
                  <div className="text-xs text-gray-500 mt-1">Across all locations</div>
                </div>
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">5</div>
                  <div className="text-sm text-gray-400">Warehouse Locations</div>
                  <div className="text-xs text-gray-500 mt-1">Fully integrated</div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Available-to-Promise (ATP) Calculations</h3>
              <p className="text-gray-300">
                Calculate available-to-promise inventory by subtracting reserved stock from available stock. Know exactly how much inventory you can commit to new orders, preventing overselling and maintaining service level commitments across all sales channels.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Cross-Warehouse Inventory Visibility</h3>
              <p className="text-gray-300">
                View inventory levels across all warehouses in one dashboard. Quickly identify where products are available, which locations need replenishment, and optimal transfer opportunities between warehouses to balance stock efficiently.
              </p>
            </div>
          </div>
        </section>

        {/* Inventory Planning Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Inventory Planning</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Demand Forecasting</h3>
              <p className="text-gray-300">
                Use machine learning to predict demand patterns, seasonality, and market trends by SKU, season, and sales channel. Historical sales data, market signals, and external factors inform accurate forecasts that help you optimize inventory levels and reduce carrying costs.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00FF7F]">92%</div>
                  <div className="text-sm text-gray-400">Forecast Accuracy</div>
                  <div className="text-xs text-gray-500 mt-1">Last quarter</div>
                </div>
              </div>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Seasonal planning: Increase stock for Winter Collection by 35% starting September 1</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Optimal Reorder Points & Safety Stock</h3>
              <p className="text-gray-300">
                Automatically calculate optimal reorder points and order quantities based on lead times, demand variability, and your service level requirements. Ensure sufficient safety stock to prevent stockouts while avoiding excessive overstock that ties up working capital.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Working Capital Optimization</h3>
              <p className="text-gray-300">
                Understand the cash impact of inventory decisions and optimize your working capital allocation across SKUs and categories. Balance stock levels with available funds, ensuring you have the right products in the right quantities without over-investing in inventory.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">ABC/XYZ Classification</h3>
              <p className="text-gray-300">
                Automatically classify your inventory using ABC (value) and XYZ (demand predictability) analysis. Prioritize your planning efforts on high-value, unpredictable items while standardizing processes for routine items. Make data-driven decisions about where to focus inventory management resources.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Seasonal Planning & Preparation</h3>
              <p className="text-gray-300">
                Plan ahead for seasonal demand spikes and promotional events. SLA analyzes historical patterns, market trends, and upcoming campaigns to recommend inventory build-up strategies, ensuring you're prepared for peak demand periods without overstocking during off-seasons.
              </p>
            </div>
          </div>
        </section>

        {/* Risk Monitoring & Mitigation Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Risk Monitoring & Mitigation</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Stockout Risk Identification</h3>
              <p className="text-gray-300">
                Proactively identify SKUs at risk of stockout based on current inventory levels, forecasted demand, and supplier lead times. Receive automated alerts before stockouts occur, giving you time to take corrective action such as expediting orders or adjusting forecasts.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex flex-col bg-neutral-900 border border-[#00FF7F]/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">3</div>
                  <div className="text-sm text-gray-400">At-Risk SKUs</div>
                  <div className="text-xs text-gray-500 mt-1">Action required</div>
                </div>
              </div>
              <div className="bg-red-500/5 border-l-4 border-red-400 p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-red-400 mr-2">🚨</span>
                  <div>
                    <div className="font-semibold text-white mb-1">Stockout Alert</div>
                    <p className="text-gray-300 text-sm">SKU #5201 has 8 units remaining - expected stockout in 4 days. Expedite order to prevent loss of sales.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Overstock Detection & Recommendations</h3>
              <p className="text-gray-300">
                Identify slow-moving and potentially obsolete inventory before it becomes a cash trap. SLA analyzes sales velocity, aging inventory, and market trends to flag items at risk of overstock, suggesting actions like promotional campaigns, markdowns, or return to supplier.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Expiration Date Monitoring</h3>
              <p className="text-gray-300">
                For perishable goods, track expiration dates and get automated alerts before products expire. Prioritize sales of items nearing expiration dates and implement first-expired-first-out (FEFO) fulfillment strategies to minimize waste and maximize revenue.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Warehouse Risk Balancing</h3>
              <p className="text-gray-300">
                Distribute risk across warehouse locations to prevent total inventory loss from regional issues, natural disasters, or operational problems. SLA helps you maintain backup stock in multiple locations while optimizing overall inventory allocation.
              </p>
            </div>
          </div>
        </section>

        {/* Warehouse Management Integration Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Warehouse Management Integration</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Centralized Multi-Warehouse View</h3>
              <p className="text-gray-300">
                Manage inventory across all warehouse locations from one central dashboard. See consolidated and location-specific views, understand inventory distribution, and make informed decisions about where to hold stock for optimal fulfillment efficiency.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Inter-Warehouse Transfer Optimization</h3>
              <p className="text-gray-300">
                SLA suggests optimal transfers between warehouses based on demand patterns, fulfillment costs, and stock levels. Automatically identify opportunities to balance inventory across locations, reducing stockouts in high-demand areas and excess inventory in low-demand locations.
              </p>
              <div className="bg-[#00FF7F]/5 border-l-4 border-[#00FF7F] p-4 rounded-r-lg my-4">
                <div className="flex items-start">
                  <span className="text-[#00FF7F] mr-2">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">SLA Suggestion</div>
                    <p className="text-gray-300 text-sm">Transfer 450 units from Warehouse A to B - Reduce stockout risk in high-demand region, save $2,100 in lost sales</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Location-Specific Inventory Strategies</h3>
              <p className="text-gray-300">
                Implement different inventory strategies for different warehouse locations based on local demand patterns, customer proximity, and service level requirements. Optimize each location independently while maintaining an overall efficient inventory network.
              </p>
            </div>
          </div>
        </section>

        {/* Performance Metrics & Analytics Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Performance Metrics & Analytics</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Inventory Turnover Analysis</h3>
              <p className="text-gray-300">
                Track inventory turnover rates to measure how efficiently you're converting stock into sales. Identify fast-moving items that deserve more investment and slow-moving items that need attention. Benchmark against industry standards and continuously improve.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Days on Hand (DOH)</h3>
              <p className="text-gray-300">
                Monitor days of inventory on hand to assess carrying costs and stock level appropriateness. Understand how long it takes to sell through your inventory and optimize reorder frequencies to balance cash flow with service levels.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Fill Rate & Service Levels</h3>
              <p className="text-gray-300">
                Measure and optimize fill rates to ensure you're meeting customer demand expectations. Track on-time in-full (OTIF) performance and service level achievement across all SKUs and categories. Use these metrics to inform inventory planning decisions.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Cash Conversion Cycle</h3>
              <p className="text-gray-300">
                Understand how long it takes to convert your inventory investment into cash through sales. Optimize inventory levels to shorten the cash conversion cycle, freeing up working capital for growth initiatives while maintaining service levels.
              </p>
            </div>
            <div className="border-l-4 border-[#00FF7F] pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Carrying Cost Analysis</h3>
              <p className="text-gray-300">
                Track total carrying costs including storage, insurance, obsolescence, and opportunity cost of capital tied up in inventory. Use this analysis to make informed decisions about appropriate stock levels that balance carrying costs against stockout costs.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Optimize Your Inventory?</h3>
            <p className="text-gray-300 mb-6">
              Experience how SLA's comprehensive inventory management can help you track stock across all warehouses, optimize purchase orders, mitigate risks, and maximize working capital efficiency. Book a demo to see how we can transform your inventory operations.
            </p>
            <Link 
              href="/book-demo" 
              className="inline-block rounded-lg bg-[#00FF7F] px-8 py-3 text-black border border-white/10 hover:brightness-95 active:scale-95 transition-transform font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}