import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getUsers, createUser, updateUser, deleteUser } from "../../lib/apiClient";
import { UserPlus, Trash2, Edit3, Shield, UserCircle2 } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Employee" },
  { value: "customer", label: "Customer" }
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "employee"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  function resetForm() {
    setForm({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "employee"
    });
  }

  function startEdit(user) {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || (!form.id && !form.password)) {
      return;
    }
    setLoading(true);
    try {
      if (form.id) {
        const updated = await updateUser(form.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {})
        });
        setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      } else {
        const created = await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        });
        setUsers(prev => [created, ...prev]);
      }
      resetForm();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (form.id === id) resetForm();
  }

  function roleBadge(role) {
    const base =
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border";
    if (role === "admin") {
      return (
        <span className={`${base} border-red-500/60 bg-red-500/10 text-red-300`}>
          <Shield className="w-3 h-3" />
          Admin
        </span>
      );
    }
    if (role === "employee") {
      return (
        <span
          className={`${base} border-amber-400/60 bg-amber-400/10 text-amber-200`}
        >
          <UserCircle2 className="w-3 h-3" />
          Employee
        </span>
      );
    }
    return (
      <span
        className={`${base} border-neutral-600 bg-neutral-800/60 text-neutral-200`}
      >
        Customer
      </span>
    );
  }

  return (
    <AdminLayout title="User Management">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
        <Card
          title={form.id ? "Edit User" : "Create User"}
          description="Invite admins and employees or register customers manually."
        >
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-gray-700 dark:text-neutral-300 text-[11px]">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Full name"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-700 dark:text-neutral-300 text-[11px]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@example.com"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-700 dark:text-neutral-300 text-[11px]">
                {form.id ? "Password (optional, to reset)" : "Password"}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e =>
                  setForm(prev => ({ ...prev, password: e.target.value }))
                }
                placeholder={form.id ? "Leave blank to keep existing" : "Minimum 6 characters"}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-700 dark:text-neutral-300 text-[11px]">Role</label>
              <select
                value={form.role}
                onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-xs text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              >
                {ROLE_OPTIONS.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="gap-1" disabled={loading}>
                <UserPlus className="w-3 h-3" />
                {form.id ? "Save changes" : "Create user"}
              </Button>
              {form.id && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="text-neutral-300"
                >
                  Cancel edit
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card
          title="Existing Users"
          description="View and manage all users with system access."
        >
          <div className="max-h-96 overflow-y-auto text-xs">
            <table className="w-full text-xs">
              <thead className="text-[11px] uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Role</th>
                  <th className="py-2 text-left">Created</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-3">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="py-2 pr-3 text-gray-700">{user.email}</td>
                    <td className="py-2 pr-3">{roleBadge(user.role)}</td>
                    <td className="py-2 pr-3 text-neutral-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2"
                          onClick={() => startEdit(user)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 text-red-400 border-red-500/40 hover:bg-red-500/10"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-xs text-neutral-500"
                    >
                      No users yet. Invite your first team member on the left.
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

