const mockCategories = [
  { id: "c1", name: "Starters", description: "Small bites to start", createdAt: "2024-11-01" },
  { id: "c2", name: "Mains", description: "Hearty main courses", createdAt: "2024-11-02" },
  { id: "c3", name: "Desserts", description: "Sweet treats", createdAt: "2024-11-03" }
];

const mockItems = [
  { id: "i1", name: "Bruschetta", price: 8.5, categoryId: "c1", available: true },
  { id: "i2", name: "Margherita Pizza", price: 14, categoryId: "c2", available: true },
  { id: "i3", name: "Tiramisu", price: 9, categoryId: "c3", available: false }
];

let categories = [...mockCategories];
let items = [...mockItems];

let orders = [
  {
    id: "O-1001",
    customerName: "John Doe",
    total: 52.4,
    status: "PENDING",
    createdAt: "2026-02-06T10:05:00Z",
    items: [
      { name: "Bruschetta", qty: 2 },
      { name: "Margherita Pizza", qty: 1 }
    ]
  },
  {
    id: "O-1002",
    customerName: "Jane Smith",
    total: 34.9,
    status: "CONFIRMED",
    createdAt: "2026-02-06T09:45:00Z",
    items: [{ name: "Tiramisu", qty: 2 }]
  },
  {
    id: "O-1003",
    customerName: "David Lee",
    total: 89.1,
    status: "COMPLETED",
    createdAt: "2026-02-05T19:30:00Z",
    items: [
      { name: "Margherita Pizza", qty: 2 },
      { name: "Bruschetta", qty: 1 }
    ]
  }
];

export async function login(email, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }

  return res.json();
}

export async function getOverview() {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;
  const revenue = orders
    .filter(o => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.total, 0);

  return {
    totalOrders,
    pendingOrders,
    revenue
  };
}

export async function getOrders() {
  return [...orders];
}

const STATUS_FLOW = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

export function getNextStatuses(currentStatus) {
  const idx = STATUS_FLOW.indexOf(currentStatus);
  if (idx === -1) return [];
  if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") return [];
  return STATUS_FLOW.slice(idx + 1);
}

export async function updateOrderStatus(orderId, newStatus) {
  orders = orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
  return orders.find(o => o.id === orderId);
}

export async function getMenu() {
  return {
    categories: [...categories],
    items: [...items]
  };
}

export async function createCategory(data) {
  const newCat = {
    id: `c${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
    ...data
  };
  categories.push(newCat);
  return newCat;
}

export async function updateCategory(id, data) {
  categories = categories.map(c => (c.id === id ? { ...c, ...data } : c));
  return categories.find(c => c.id === id);
}

export async function deleteCategory(id) {
  categories = categories.filter(c => c.id !== id);
  items = items.filter(i => i.categoryId !== id);
  return true;
}

export async function createItem(data) {
  const newItem = {
    id: `i${Date.now()}`,
    available: true,
    ...data
  };
  items.push(newItem);
  return newItem;
}

export async function updateItem(id, data) {
  items = items.map(i => (i.id === id ? { ...i, ...data } : i));
  return items.find(i => i.id === id);
}

export async function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  return true;
}

export async function getDeals() {
  return [
    {
      id: "d1",
      name: "Lunch Combo",
      description: "Any main + drink",
      discountPercent: 15,
      active: true
    },
    {
      id: "d2",
      name: "Happy Hour",
      description: "50% off starters 4–6pm",
      discountPercent: 50,
      active: false
    }
  ];
}

export async function getOrderHistory({ status, from, to } = {}) {
  let result = [...orders];

  if (status && status !== "ALL") {
    result = result.filter(o => o.status === status);
  }

  if (from) {
    const fromDate = new Date(from);
    result = result.filter(o => new Date(o.createdAt) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    result = result.filter(o => new Date(o.createdAt) <= toDate);
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

