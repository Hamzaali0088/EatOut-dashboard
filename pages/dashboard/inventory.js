import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getInventory, createInventoryItem, updateInventoryItem, SubscriptionInactiveError } from "../../lib/apiClient";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    unit: "kg",
    initialStock: "",
    lowStockThreshold: ""
  });

  const [suspended, setSuspended] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getInventory();
        setItems(data);
      } catch (err) {
        if (err instanceof SubscriptionInactiveError) {
          setSuspended(true);
        } else {
          console.error("Failed to load inventory:", err);
          setError(err.message || "Failed to load inventory");
        }
      }
    })();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.unit) return;
    const created = await createInventoryItem({
      name: form.name,
      unit: form.unit,
      initialStock: form.initialStock ? Number(form.initialStock) : 0,
      lowStockThreshold: form.lowStockThreshold
        ? Number(form.lowStockThreshold)
        : 0
    });
    setItems(prev => [...prev, created]);
    setForm({
      name: "",
      unit: "kg",
      initialStock: "",
      lowStockThreshold: ""
    });
  }

  async function handleAdjustStock(id, delta) {
    const updated = await updateInventoryItem(id, { stockAdjustment: delta });
    setItems(prev => prev.map(i => (i.id === id ? updated : i)));
  }

  return (
    <AdminLayout title="Inventory Management" suspended={suspended}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
        <Card
          title="Add inventory item"
          description="Register ingredients or packaged items to track in stock."
        >
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-gray-700 dark:text-neutral-300 text-[11px]">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e =>
                  setForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Tomato, Burger Bun, Oil..."
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-gray-700 dark:text-neutral-300 text-[11px]">Unit</label>
                <select
                  value={form.unit}
                  onChange={e =>
                    setForm(prev => ({ ...prev, unit: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                >
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="piece">piece</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-700 dark:text-neutral-300 text-[11px]">Initial stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.initialStock}
                  onChange={e =>
                    setForm(prev => ({ ...prev, initialStock: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-700 dark:text-neutral-300 text-[11px]">
                  Low stock threshold
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.lowStockThreshold}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      lowStockThreshold: e.target.value
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
                />
              </div>
            </div>
            <Button type="submit" className="text-xs">
              Save item
            </Button>
          </form>
        </Card>

        <Card
          title="Current stock levels"
          description="Monitor what&apos;s in store and quickly adjust when you restock."
        >
          <div className="max-h-96 overflow-y-auto text-xs">
            <table className="w-full text-xs">
              <thead className="text-[11px] uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-right">Stock</th>
                  <th className="py-2 text-right">Low stock at</th>
                  <th className="py-2 text-right">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-3">
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Unit: {item.unit}
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {item.lowStockThreshold || 0} {item.unit}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 text-[11px]"
                          onClick={() => {
                            const delta = Number(
                              prompt("Add how much stock?", "1") || "0"
                            );
                            if (!Number.isNaN(delta) && delta > 0) {
                              handleAdjustStock(item.id, delta);
                            }
                          }}
                        >
                          + Add
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 text-[11px] text-amber-300"
                          onClick={() => {
                            const delta = Number(
                              prompt("Remove how much stock?", "1") || "0"
                            );
                            if (!Number.isNaN(delta) && delta > 0) {
                              handleAdjustStock(item.id, -delta);
                            }
                          }}
                        >
                          − Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-xs text-neutral-500"
                    >
                      No inventory items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

