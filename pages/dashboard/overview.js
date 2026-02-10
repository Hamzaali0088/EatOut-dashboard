import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import { getOverview, SubscriptionInactiveError } from "../../lib/apiClient";
import { DollarSign, ShoppingBag, Timer } from "lucide-react";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });

  const [suspended, setSuspended] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getOverview();
        setStats(data);
      } catch (err) {
        if (err instanceof SubscriptionInactiveError) {
          setSuspended(true);
        } else {
          console.error("Failed to load overview:", err);
          setError(err.message || "Failed to load overview");
        }
      }
    })();
  }, []);

  return (
    <AdminLayout title="Overview" suspended={suspended}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card title="Total Orders">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">{stats.totalOrders}</div>
              <div className="text-xs text-neutral-400 mt-1">All-time orders</div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-primary">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
        </Card>

        <Card title="Pending Orders">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">{stats.pendingOrders}</div>
              <div className="text-xs text-neutral-400 mt-1">Awaiting action</div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-amber-400">
              <Timer className="w-4 h-4" />
            </div>
          </div>
        </Card>

        <Card title="Revenue">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">
                ${stats.revenue.toFixed(2)}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Completed order revenue
              </div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-green-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Operations Snapshot"
          description="Track live service health and bottlenecks."
        >
          <ul className="text-xs space-y-2 text-gray-600 dark:text-neutral-300">
            <li className="flex justify-between">
              <span>Average prep time</span>
              <span className="font-medium text-gray-900 dark:text-neutral-100">18 min</span>
            </li>
            <li className="flex justify-between">
              <span>Orders in kitchen</span>
              <span className="font-medium text-gray-900 dark:text-neutral-100">
                {stats.pendingOrders}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Cancellation rate</span>
              <span className="font-medium text-green-400">2.1%</span>
            </li>
          </ul>
        </Card>

        <Card
          title="Admin Tips"
          description="Best practices for clean, safe operations."
        >
          <ul className="text-xs list-disc list-inside text-gray-600 dark:text-neutral-300 space-y-2">
            <li>Always move orders forward in the status flow – never backwards.</li>
            <li>Review completed orders daily in Order History for anomalies.</li>
            <li>Keep menu availability updated to prevent guest disappointment.</li>
            <li>Use Deals to shift demand to off-peak hours.</li>
          </ul>
        </Card>
      </div>
    </AdminLayout>
  );
}

