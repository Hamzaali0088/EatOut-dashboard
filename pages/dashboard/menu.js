import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  getMenu,
  createCategory,
  updateCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem
} from "../../lib/apiClient";
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from "lucide-react";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    categoryId: ""
  });

  useEffect(() => {
    getMenu().then(({ categories, items }) => {
      setCategories(categories);
      setItems(items);
      if (!itemForm.categoryId && categories[0]) {
        setItemForm(prev => ({ ...prev, categoryId: categories[0].id }));
      }
    });
  }, []);

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!catForm.name.trim()) return;

    const created = await createCategory(catForm);
    setCategories(prev => [...prev, created]);
    setCatForm({ name: "", description: "" });
  }

  async function handleCreateItem(e) {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.price || !itemForm.categoryId) return;

    const created = await createItem({
      ...itemForm,
      price: parseFloat(itemForm.price)
    });
    setItems(prev => [...prev, created]);
    setItemForm(prev => ({ ...prev, name: "", price: "" }));
  }

  async function handleToggleAvailability(item) {
    const updated = await updateItem(item.id, { available: !item.available });
    setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
  }

  async function handleDeleteCategory(id) {
    if (!confirm("Delete category and its items?")) return;
    await deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    setItems(prev => prev.filter(i => i.categoryId !== id));
  }

  async function handleDeleteItem(id) {
    if (!confirm("Delete this menu item?")) return;
    await deleteItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <AdminLayout title="Menu Management">
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card
          title="Categories"
          description="Organize your menu into easy-to-browse groups."
        >
          <form onSubmit={handleCreateCategory} className="space-y-2 mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name"
                value={catForm.name}
                onChange={e =>
                  setCatForm(prev => ({ ...prev, name: e.target.value }))
                }
                className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              />
              <Button type="submit" className="gap-1">
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>
            <textarea
              rows={2}
              placeholder="Optional description"
              value={catForm.description}
              onChange={e =>
                setCatForm(prev => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            />
          </form>

          <ul className="space-y-2 text-xs">
            {categories.map(cat => (
              <li
                key={cat.id}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-neutral-950 border border-neutral-800"
              >
                <div>
                  <div className="font-medium text-neutral-100 flex items-center gap-2">
                    {cat.name}
                    <span className="text-[10px] text-neutral-500">
                      Created {cat.createdAt}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                      setCatForm({ name: cat.name, description: cat.description || "" })
                    }
                    className="px-2"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="px-2 text-red-400 border-red-500/40 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </li>
            ))}

            {categories.length === 0 && (
              <li className="text-neutral-500 text-xs">
                No categories yet. Create your first above.
              </li>
            )}
          </ul>
        </Card>

        <Card
          title="Menu Items"
          description="Manage availability and pricing per item."
        >
          <form onSubmit={handleCreateItem} className="space-y-2 mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Item name"
                value={itemForm.name}
                onChange={e =>
                  setItemForm(prev => ({ ...prev, name: e.target.value }))
                }
                className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={itemForm.price}
                onChange={e =>
                  setItemForm(prev => ({ ...prev, price: e.target.value }))
                }
                className="w-24 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={itemForm.categoryId}
                onChange={e =>
                  setItemForm(prev => ({ ...prev, categoryId: e.target.value }))
                }
                className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button type="submit" className="gap-1">
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>
          </form>

          <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
            {items.map(item => {
              const category = categories.find(c => c.id === item.categoryId);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg bg-neutral-950 border border-neutral-800"
                >
                  <div>
                    <div className="font-medium text-neutral-100">
                      {item.name}{" "}
                      <span className="text-neutral-500">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {category ? category.name : "Uncategorized"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item)}
                      className="inline-flex items-center gap-1 text-[11px] text-neutral-300"
                    >
                      {item.available ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-green-400" />
                          Available
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-neutral-500" />
                          Unavailable
                        </>
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-2 text-red-400 border-red-500/40 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="text-neutral-500 text-xs">
                No menu items yet. Add dishes above.
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

