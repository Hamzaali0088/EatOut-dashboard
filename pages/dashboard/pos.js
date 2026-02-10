import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getMenu } from "../../lib/apiClient";
import { ShoppingCart, Plus, Minus, Trash2, Receipt, CreditCard, Banknote } from "lucide-react";

export default function POSPage() {
  const [menu, setMenu] = useState({ categories: [], items: [] });
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      const data = await getMenu();
      setMenu(data);
    } catch (err) {
      console.error("Failed to load menu:", err);
    }
  }

  const filteredItems = menu.items.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const addToCart = (item) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    
    // TODO: Call backend API to create order
    console.log("Processing order:", {
      customerName,
      items: cart,
      paymentMethod,
      total
    });
    
    alert("Order placed successfully!");
    setCart([]);
    setCustomerName("");
    setShowCheckout(false);
  };

  return (
    <AdminLayout title="Point of Sale">
      <div className="grid gap-4 lg:grid-cols-[1fr_400px] h-[calc(100vh-180px)]">
        {/* Menu Items Section */}
        <div className="flex flex-col bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {/* Search & Category Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-neutral-800 space-y-3">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-800"
                }`}
              >
                All Items
              </button>
              {menu.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.name
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="flex flex-col p-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 hover:border-primary hover:shadow-md transition-all text-left"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">{item.category}</p>
                  <p className="text-sm font-bold text-primary mt-2">PKR {item.price}</p>
                </button>
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400 dark:text-neutral-500">No items found</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="flex flex-col bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Current Order</h2>
            <span className="ml-auto text-xs text-gray-500 dark:text-neutral-400">{cart.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-neutral-700 mb-2" />
                <p className="text-sm text-gray-500 dark:text-neutral-400">Cart is empty</p>
                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">Add items from the menu</p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">PKR {item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700"
                    >
                      <Minus className="w-3 h-3 text-gray-700 dark:text-neutral-300" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700"
                    >
                      <Plus className="w-3 h-3 text-gray-700 dark:text-neutral-300" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white w-20 text-right">
                    PKR {(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-neutral-800 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-neutral-800">
                  <span>Total</span>
                  <span>PKR {total.toFixed(0)}</span>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-red-500 transition-colors"
                >
                  <Receipt className="w-4 h-4" />
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Customer name (optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod("CASH")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        paymentMethod === "CASH"
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod("CARD")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        paymentMethod === "CARD"
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Card
                    </button>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                  >
                    Complete Order
                  </button>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 text-sm hover:bg-gray-200 dark:hover:bg-neutral-800"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
