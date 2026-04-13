// app/admin/contacts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Contact = {
  _id: string;
  name: string;
  city: string;
  address: string;
  email: string;
  message: string;
  createdAt?: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/contacts");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to load messages");
        }
        setContacts(data.data || []);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || "Error loading messages");
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>

        {loading ? (
          <p className="text-sm text-gray-500">Loading messages...</p>
        ) : contacts.length === 0 ? (
          <p className="text-sm text-gray-500">No messages found.</p>
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
                    City
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Created
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id} className="border-b last:border-0 align-top">
                    <td className="px-3 py-2">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">
                        {c.address}
                      </div>
                    </td>
                    <td className="px-3 py-2">{c.email}</td>
                    <td className="px-3 py-2">{c.city}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-3 py-2 max-w-xs">
                      <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                        {c.message}
                      </p>
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