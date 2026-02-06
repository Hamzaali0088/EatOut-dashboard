import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import { getOrderHistory } from "../../lib/apiClient";
import { Filter } from "lucide-react";

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED"
];

export default function HistoryPage() {
  const [filters, setFilters] = useState({
    status: "ALL",
    from: "",
    to: ""
  });
  const [orders, setOrders] = useState([]);

  async function loadHistory(newFilters = filters) {
    const data = await getOrderHistory(newFilters);
    setOrders(data);
  }

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApplyFilters(e) {
    e.preventDefault();
    await loadHistory(filters);
  }

  function handleResetFilters() {
    const reset = { status: "ALL", from: "", to: "" };
    setFilters(reset);
    loadHistory(reset);
  }

  return (
    <AdminLayout title="Order History">
      <Card
        title="Filters"
        description="Narrow down historical orders by status and date range."
      >
        <form
          onSubmit={handleApplyFilters}
          className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] items-end text-xs mb-4"
        >
          <div className="space-y-1">
            <label className="text-neutral-300 text-[11px]">Status</label>
            <select
              value={filters.status}
              onChange={e =>
                setFilters(prev => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s === "ALL"
                    ? "All statuses"
                    : s
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/(^|\s)\S/g, c => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300 text-[11px]">From</label>
            <input
              type="date"
              value={filters.from}
              onChange={e =>
                setFilters(prev => ({ ...prev, from: e.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300 text-[11px]">To</label>
            <input
              type="date"
              value={filters.to}
              onChange={e =>
                setFilters(prev => ({ ...prev, to: e.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            />
          </div>

          <Button type="submit" className="gap-1">
            <Filter className="w-3 h-3" />
            Apply
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleResetFilters}
            className="text-neutral-300"
          >
            Reset
          </Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[11px] uppercase text-neutral-500 border-b border-neutral-800">
              <tr>
                <th className="py-2 text-left">Order</th>
                <th className="py-2 text-left">Customer</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-neutral-950/60">
                  <td className="py-3 pr-3">
                    <div className="font-medium text-neutral-100">{order.id}</div>
                  </td>
                  <td className="py-3 pr-3">{order.customerName}</td>
                  <td className="py-3 pr-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 pr-3 text-right font-semibold">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3 pr-3 text-neutral-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-xs text-neutral-500"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}

