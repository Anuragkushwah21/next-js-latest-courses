"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoadingUsers(true);
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

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
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="px-3 py-2">{u.name}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2 capitalize">{u.role}</td>
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