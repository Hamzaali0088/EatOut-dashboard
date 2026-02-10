import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import {
  getOrders,
  getNextStatuses,
  updateOrderStatus
} from "../../lib/apiClient";
import { ChevronRight, Loader2 } from "lucide-react";

const PAYMENT_METHODS = ["All Payment Methods", "Card", "Cash", "Foodpanda"];
const ORDER_SOURCES = ["All Sources", "POS", "App", "Foodpanda"];
const ORDER_TYPES = ["All Order Types", "Dine-in", "Delivery", "Takeaway"];
const ORDER_STATUSES = ["All Orders", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Methods");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [typeFilter, setTypeFilter] = useState("All Order Types");
  const [sortOrder, setSortOrder] = useState("Newest First");

  useEffect(() => {
    // For now we reuse mock orders from apiClient and enrich them
    getOrders().then(base => {
      const enriched = base.map((o, idx) => ({
        ...o,
        source: idx % 3 === 0 ? "Foodpanda" : idx % 2 === 0 ? "App" : "POS",
        type: idx % 3 === 0 ? "delivery" : idx % 2 === 0 ? "takeaway" : "dine-in",
        paymentMethod: idx % 2 === 0 ? "Card" : "Cash",
        paymentStatus: "PAID"
      }));
      setOrders(enriched);
    });
  }, []);

  async function handleUpdateStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, ...updated } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = useMemo(() => {
    return orders
      .filter(o => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
          o.id.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term)
        );
      })
      .filter(o =>
        statusFilter === "All Orders" ? true : o.status === statusFilter
      )
      .filter(o =>
        paymentFilter === "All Payment Methods"
          ? true
          : o.paymentMethod === paymentFilter
      )
      .filter(o =>
        sourceFilter === "All Sources" ? true : o.source === sourceFilter
      )
      .filter(o =>
        typeFilter === "All Order Types" ? true : o.type === typeFilter
      )
      .sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sortOrder === "Newest First" ? db - da : da - db;
      });
  }, [orders, search, statusFilter, paymentFilter, sourceFilter, typeFilter, sortOrder]);

  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: val => (
        <span className="font-medium text-gray-900">{val}</span>
      )
    },
    {
      key: "customerName",
      header: "Customer",
      render: val => <span className="text-gray-800">{val}</span>
    },
    {
      key: "createdAt",
      header: "Date",
      render: val => (
        <span className="text-[11px] text-gray-600">
          {new Date(val).toLocaleString()}
        </span>
      )
    },
    {
      key: "type",
      header: "Type",
      render: val => (
        <span className="text-[11px] uppercase text-neutral-500">
          {val}
        </span>
      )
    },
    {
      key: "source",
      header: "Source",
      render: val => (
        <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 text-[10px] font-medium">
          {val}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: val => <StatusBadge status={val} />
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      render: val => (
        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium">
          {val}
        </span>
      )
    },
    {
      key: "paymentMethod",
      header: "Payment Method",
      render: val => (
        <span className="text-[11px] text-neutral-600">{val}</span>
      )
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: val => (
        <span className="font-semibold text-gray-900">Rs {val.toFixed(0)}</span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (_val, row) => {
        return (
          <div className="flex flex-wrap gap-1 justify-end">
            <Button
              type="button"
              variant="subtle"
              className="px-2 py-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            >
              View
            </Button>
            <Button
              type="button"
              variant="subtle"
              className="px-2 py-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="subtle"
              className="px-2 py-1 text-[11px] bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
            >
              Print
            </Button>
            <Button
              type="button"
              variant="subtle"
              disabled={updatingId === row.id}
              onClick={() => handleUpdateStatus(row.id, "CANCELLED")}
              className="px-2 py-1 text-[11px] bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              {updatingId === row.id ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Cancel"
              )}
            </Button>
          </div>
        );
      },
      align: "right"
    }
  ];

  return (
    <AdminLayout title="Order Management">
      <Card
        title="Search Orders"
        description="Search by order ID, customer name, status, payment method, or source."
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_auto] items-end mb-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700 dark:text-neutral-300">
              Search Orders
            </label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID, customer, phone, email, status..."
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700 dark:text-neutral-300">
              Payment Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white"
            >
              {ORDER_STATUSES.map(s => (
                <option key={s} value={s}>
                  {s === "All Orders" ? s : s.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700 dark:text-neutral-300">
              Payment Method
            </label>
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white"
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700 dark:text-neutral-300">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white"
            >
              {ORDER_SOURCES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700 dark:text-neutral-300">
              Order Type
            </label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white"
            >
              {ORDER_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-gray-700 dark:text-neutral-300">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={row => row.id}
          emptyMessage="No orders match your filters."
        />
      </Card>
    </AdminLayout>
  );
}

