import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import {
  getOrders,
  getNextStatuses,
  updateOrderStatus
} from "../../lib/apiClient";
import { ChevronRight, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  async function handleUpdateStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminLayout title="Orders Management">
      <Card
        title="Live Orders"
        description="Update order status step-by-step. Forward-only transitions enforced."
      >
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[11px] uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-2 text-left">Order</th>
                <th className="py-2 text-left">Customer</th>
                <th className="py-2 text-left">Items</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Next Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => {
                const nextStatuses = getNextStatuses(order.status);
                const isTerminal =
                  order.status === "COMPLETED" || order.status === "CANCELLED";

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-3">
                      <div className="font-medium text-gray-900">{order.id}</div>
                      <div className="text-[11px] text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-top">{order.customerName}</td>
                    <td className="py-3 pr-3 align-top text-gray-700">
                      <ul className="space-y-1">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between gap-2">
                            <span>{item.name}</span>
                            <span className="text-neutral-500">x{item.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 pr-3 text-right align-top font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 align-top">
                      {isTerminal ? (
                        <span className="text-[11px] text-neutral-500">
                          Order is complete. Actions disabled.
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {nextStatuses.map(status => (
                            <Button
                              key={status}
                              variant="subtle"
                              disabled={updatingId === order.id}
                              onClick={() =>
                                handleUpdateStatus(order.id, status)
                              }
                              className="flex items-center gap-1"
                            >
                              {updatingId === order.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                              {status
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/(^|\s)\S/g, c => c.toUpperCase())}
                            </Button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-xs text-neutral-500"
                  >
                    No orders yet.
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

