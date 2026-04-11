// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Course } from "@/lib/models/Course";
import { Blog } from "@/lib/models/Blog";
import TypingRecord from "@/lib/models/TypingRecord";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    // basic counts
    const [users, courses, blogs, typingEntries] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Blog.countDocuments(),
      TypingRecord.countDocuments(),
    ]);

    // last 6 months (including current)
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6 months ago, start of month

    const rawAgg = await TypingRecord.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Convert aggregation result to a map: "YYYY-MM" -> count
    const countsMap = new Map<string, number>();
    for (const item of rawAgg) {
      const y = item._id.year;
      const m = item._id.month.toString().padStart(2, "0");
      const key = `${y}-${m}`;
      countsMap.set(key, item.count);
    }

    // Build last 6 months array with zero-fill
    const monthlyTypingCounts: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const key = `${y}-${m}`;

      const label = d.toLocaleString("en-US", { month: "short" }); // Jan, Feb...
      monthlyTypingCounts.push({
        month: label,
        count: countsMap.get(key) || 0,
      });
    }

    return NextResponse.json(
      {
        data: {
          users,
          courses,
          blogs,
          typingEntries,
          monthlyTypingCounts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/stats error", error);
    return NextResponse.json(
      { message: "Failed to load stats" },
      { status: 500 }
    );
  }
}