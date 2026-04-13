"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StatsResponse = {
  users: number;
  courses: number;
  blogs: number;
  typingEntries: number;
  monthlyTypingCounts: { month: string; count: number }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stats from API
  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/statas");
        const data = await res.json();
        setStats(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const usersCount = stats?.users ?? 0;
  const coursesCount = stats?.courses ?? 0;
  const blogsCount = stats?.blogs ?? 0;
  const typingCount = stats?.typingEntries ?? 0;
  const monthly = stats?.monthlyTypingCounts ?? [];

  // Simple SVG bar chart dimensions
  const chartWidth = 600;
  const chartHeight = 220;
  const maxValue =
    monthly.length > 0 ? Math.max(...monthly.map((m) => m.count)) || 1 : 1;
  const barWidth = monthly.length > 0 ? chartWidth / (monthly.length * 1.5) : 0;

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">
              Manage typing data, blogs, courses, users and contact messages from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/typing"
              className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Manage Typing
            </Link>
            <Link
              href="/admin/blog"
              className="px-3 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              Manage Blogs
            </Link>
            <Link
              href="/admin/courses"
              className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Manage Courses
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-2 text-sm rounded-md bg-gray-800 text-white hover:bg-gray-900"
            >
              View Users
            </Link>
            <Link
              href="/admin/contacts"
              className="px-3 py-2 text-sm rounded-md bg-pink-600 text-white hover:bg-pink-700"
            >
              View Contacts
            </Link>
          </div>
        </header>

        {/* Top cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={loading ? "-" : usersCount.toString()}
            color="bg-blue-50"
            accent="text-blue-600"
          />
          <StatCard
            title="Total Courses"
            value={loading ? "-" : coursesCount.toString()}
            color="bg-emerald-50"
            accent="text-emerald-600"
          />
          <StatCard
            title="Total Blogs"
            value={loading ? "-" : blogsCount.toString()}
            color="bg-purple-50"
            accent="text-purple-600"
          />
          <StatCard
            title="Typing Entries"
            value={loading ? "-" : typingCount.toString()}
            color="bg-orange-50"
            accent="text-orange-600"
          />
        </section>

        {/* Management cards */}
        <section className="grid gap-4 lg:grid-cols-4">
          <ManageCard
            title="Typing Data"
            description="Create or update typing records for students in Hindi and English."
            href="/admin/typing"
            cta="Go to Typing Management"
          />
          <ManageCard
            title="Blog Posts"
            description="Publish new blog posts and manage existing articles."
            href="/admin/blog"
            cta="Go to Blogs"
          />
          <ManageCard
            title="Courses"
            description="Add new courses, edit details, and manage pricing."
            href="/admin/courses"
            cta="Go to Courses"
          />
          <ManageCard
            title="Contact Messages"
            description="View and review messages sent from the contact form."
            href="/admin/contacts"
            cta="View Messages"
          />
        </section>

        {/* Graph */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Typing Entries per Month
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Simple overview of how many typing records were added each month.
          </p>

          {monthly.length === 0 ? (
            <p className="text-sm text-gray-500">
              No typing data yet. Add some entries from the Typing page.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <svg
                width={chartWidth}
                height={chartHeight}
                className="bg-gray-50 rounded-lg border border-gray-200"
              >
                {monthly.map((item, index) => {
                  const barHeight =
                    (item.count / maxValue) * (chartHeight - 40);
                  const x = 40 + index * (barWidth * 1.5);
                  const y = chartHeight - barHeight - 20;

                  return (
                    <g key={item.month}>
                      {/* bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill="#2563eb"
                      />
                      {/* label value */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 4}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#374151"
                      >
                        {item.count}
                      </text>
                      {/* label month */}
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight - 6}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6b7280"
                      >
                        {item.month}
                      </text>
                    </g>
                  );
                })}

                {/* y-axis line */}
                <line
                  x1={30}
                  y1={10}
                  x2={30}
                  y2={chartHeight - 20}
                  stroke="#d1d5db"
                  strokeWidth={1}
                />
                {/* x-axis line */}
                <line
                  x1={30}
                  y1={chartHeight - 20}
                  x2={chartWidth - 10}
                  y2={chartHeight - 20}
                  stroke="#d1d5db"
                  strokeWidth={1}
                />
              </svg>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  color,
  accent,
}: {
  title: string;
  value: string;
  color: string;
  accent: string;
}) {
  return (
    <div className={`rounded-xl ${color} p-4 shadow-sm border border-white`}>
      <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function ManageCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {cta}
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}