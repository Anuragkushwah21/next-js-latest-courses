"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoadingUsers(true);
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to load users");
        }
        setUsers(data.data || []);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || "Error loading users");
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  async function toggleActive(user: User) {
    try {
      setUpdatingId(user._id);
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to update user");
      }

      const updated: User = data.data;
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      );
      toast.success(
        updated.isActive ? "User activated successfully" : "User deactivated successfully"
      );
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Error updating user");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        {loadingUsers ? (
          <p className="text-sm text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Email
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Role
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="px-3 py-2">{u.name}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2 capitalize">{u.role}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          u.isActive
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => toggleActive(u)}
                        disabled={updatingId === u._id}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          u.isActive
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {updatingId === u._id
                          ? "Updating..."
                          : u.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}