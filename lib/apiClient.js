// NOTE: Orders-related helpers below (getOrders, getNextStatuses, updateOrderStatus, getOrderHistory)
// still use in-memory mock data for now. They can be wired to real POS/order APIs later.

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const TOKEN_COOKIE = "token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function setTokenCookie(token) {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax`;
}

export function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + TOKEN_COOKIE + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }

  const data = await res.json();
  if (data.token) setTokenCookie(data.token);
  return data;
}

export async function registerRestaurant(restaurantData) {
  const res = await fetch(`${API_BASE}/api/auth/register-restaurant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restaurantData)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Registration failed");
  }

  const data = await res.json();
  if (data.token) setTokenCookie(data.token);
  return data;
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

// DASHBOARD & REPORTS (tenant)

export async function getOverview() {
  const summary = await apiFetch("/api/admin/dashboard/summary");
  return {
    totalOrders: summary.todaysOrdersCount ?? 0,
    pendingOrders: summary.todaysOrdersCount ?? 0, // placeholder until live order statuses are wired
    revenue: summary.todaysRevenue ?? 0,
    lowStockItems: summary.lowStockItems ?? []
  };
}

export async function getSalesReport({ from, to } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/admin/reports/sales${query}`);
}

export async function getMenu() {
  return apiFetch("/api/admin/menu");
}

export async function createCategory(data) {
  return apiFetch("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateCategory(id, data) {
  return apiFetch(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export async function deleteCategory(id) {
  await apiFetch(`/api/admin/categories/${id}`, {
    method: "DELETE"
  });
  return true;
}

export async function createItem(data) {
  return apiFetch("/api/admin/items", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      categoryId: data.categoryId
    })
  });
}

export async function updateItem(id, data) {
  return apiFetch(`/api/admin/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export async function deleteItem(id) {
  await apiFetch(`/api/admin/items/${id}`, {
    method: "DELETE"
  });
  return true;
}

// USER MANAGEMENT

export async function getUsers() {
  return apiFetch("/api/admin/users");
}

export async function createUser(data) {
  return apiFetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateUser(id, data) {
  return apiFetch(`/api/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export async function deleteUser(id) {
  await apiFetch(`/api/admin/users/${id}`, {
    method: "DELETE"
  });
  return true;
}

// INVENTORY (tenant)

export async function getInventory() {
  return apiFetch("/api/admin/inventory");
}

export async function createInventoryItem(data) {
  return apiFetch("/api/admin/inventory", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateInventoryItem(id, data) {
  return apiFetch(`/api/admin/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

// WEBSITE SETTINGS (tenant)

export async function getWebsiteSettings() {
  return apiFetch("/api/admin/website");
}

export async function updateWebsiteSettings(data) {
  return apiFetch("/api/admin/website", {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

// SUPER ADMIN

export async function getRestaurantsForSuperAdmin() {
  return apiFetch("/api/super/restaurants");
}

export async function createRestaurantForSuperAdmin(data) {
  return apiFetch("/api/super/restaurants", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateRestaurantSubscription(id, data) {
  return apiFetch(`/api/super/restaurants/${id}/subscription`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
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

