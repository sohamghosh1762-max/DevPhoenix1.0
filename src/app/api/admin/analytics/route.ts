import { NextRequest } from "next/server";
import { leadsService, programsService } from "@/services/mongodb/db.service";
import { hasMongoConfig, getDb } from "@/services/mongodb/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { Lead } from "@/types";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<Lead>("leads.json");

export async function GET(req: NextRequest) {
  try {
    let leads: Lead[] = [];
    let programsList: any[] = [];

    if (hasMongoConfig) {
      try {
        const db = await getDb();
        const leadsCol = db.collection("leads");
        const docs = await leadsCol.find({}).sort({ created_at: -1 }).toArray();
        leads = docs.map((d) => {
          const { _id, ...rest } = d;
          return rest as Lead;
        });

        // Retrieve programs
        programsList = await programsService.getAll();
      } catch (err) {
        console.error("MongoDB analytics query failed, falling back to cache:", err);
        leads = cache.read();
      }
    } else {
      leads = cache.read();
    }

    // 1. Metric summaries
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === "New" || !l.status).length;
    const contactedLeads = leads.filter((l) => l.status === "Contacted").length;
    const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
    const consultationLeads = leads.filter((l) => l.status === "Consultation Scheduled" || (l.status as string) === "Consultation").length;
    const convertedLeads = leads.filter((l) => l.status === "Converted").length;
    const lostLeads = leads.filter((l) => l.status === "Lost").length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    
    // ₹1,249 average enrollment fee
    const estLeadValue = 1249;
    const totalRevenue = convertedLeads * estLeadValue;

    // 2. Sparklines and Interactive line chart (7d, 30d, 90d daily counts)
    const dailyMap: Record<string, number> = {};
    leads.forEach((l) => {
      if (l.created_at) {
        const dateStr = l.created_at.slice(0, 10);
        dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
      }
    });

    const getDailyDataArray = (days: number) => {
      const arr: number[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        arr.push(dailyMap[dateStr] || 0);
      }
      return arr;
    };

    const chartData = {
      "7d": getDailyDataArray(7),
      "30d": getDailyDataArray(30),
      "90d": getDailyDataArray(90),
    };

    // 3. Lead Sources Shares
    const sources = {
      "Website": 0,
      "Social Media": 0,
      "Referrals": 0,
      "Direct / Email": 0
    };

    leads.forEach((l) => {
      const src = (l.source_page || "").toLowerCase();
      const camp = (l.source_campaign || "").toLowerCase();
      if (src.includes("referral") || camp.includes("referral")) {
        sources["Referrals"]++;
      } else if (
        camp.includes("social") || 
        camp.includes("insta") || 
        camp.includes("facebook") || 
        camp.includes("linkedin") || 
        camp.includes("twitter")
      ) {
        sources["Social Media"]++;
      } else if (
        src === "modal" || 
        src.includes("program") || 
        src.includes("home") || 
        src.includes("contact") ||
        src.includes("enquiry")
      ) {
        sources["Website"]++;
      } else {
        sources["Direct / Email"]++;
      }
    });

    const leadSources = [
      { label: 'Website', count: sources["Website"], pct: `${totalLeads > 0 ? Math.round((sources["Website"] / totalLeads) * 100) : 0}%`, color: 'bg-[#FF6B00]', stroke: '#FF6B00' },
      { label: 'Social Media', count: sources["Social Media"], pct: `${totalLeads > 0 ? Math.round((sources["Social Media"] / totalLeads) * 100) : 0}%`, color: 'bg-[#2563EB]', stroke: '#2563EB' },
      { label: 'Referrals', count: sources["Referrals"], pct: `${totalLeads > 0 ? Math.round((sources["Referrals"] / totalLeads) * 100) : 0}%`, color: 'bg-[#10B981]', stroke: '#10B981' },
      { label: 'Direct / Email', count: sources["Direct / Email"], pct: `${totalLeads > 0 ? Math.round((sources["Direct / Email"] / totalLeads) * 100) : 0}%`, color: 'bg-[#8B5CF6]', stroke: '#8B5CF6' }
    ];

    // 4. Program Performance (top programs sorted by lead volume)
    // If programsList is empty, seed it with standard categories
    if (programsList.length === 0) {
      programsList = [
        { id: "1", title: "Full Stack Development", category: "Development", price: "₹4,999" },
        { id: "2", title: "Cloud & DevOps Masterclass", category: "Cloud", price: "₹5,999" },
        { id: "3", title: "AI & Automation Bootcamp", category: "AI", price: "₹6,999" }
      ];
    }

    const programMetrics = programsList.map((prog) => {
      const progLeads = leads.filter((l) => l.program === prog.title);
      const count = progLeads.length;
      const converted = progLeads.filter((l) => l.status === "Converted").length;
      const conv = count > 0 ? Math.round((converted / count) * 100) : 0;
      const revVal = converted * estLeadValue;

      return {
        id: prog.id,
        title: prog.title,
        category: prog.category || "Development",
        price: prog.price || "₹4,999",
        count,
        conv,
        revVal
      };
    });

    // Sort by lead count descending
    programMetrics.sort((a, b) => b.count - a.count);

    // 5. Monthly Revenue analysis (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6Months.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        name: monthNames[d.getMonth()],
        count: 0
      });
    }

    leads.forEach((l) => {
      if (l.status === "Converted" && l.created_at) {
        const lDate = new Date(l.created_at);
        const m = lDate.getMonth();
        const y = lDate.getFullYear();
        const matched = last6Months.find((mObj) => mObj.monthIndex === m && mObj.year === y);
        if (matched) {
          matched.count++;
        }
      }
    });

    const maxCount = Math.max(...last6Months.map((m) => m.count), 1);
    const revenueAnalysis = last6Months.map((m) => ({
      m: m.name,
      val: Math.round((m.count / maxCount) * 100) || 5, // minimum 5% height for grid visuals
      revenue: m.count * estLeadValue
    }));

    return apiResponse.success({
      kpis: {
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
        consultationLeads,
        convertedLeads,
        lostLeads,
        conversionRate,
        totalRevenue
      },
      chartData,
      leadSources,
      programMetrics,
      revenueAnalysis
    });

  } catch (error: any) {
    console.error("Dashboard Analytics failed:", error);
    return apiResponse.error(error.message || "Failed to query analytics dashboard metrics", "SERVER_ERROR");
  }
}
