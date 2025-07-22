"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart as PieIcon, List, Leaf, Plus } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Image from "next/image";

ChartJS.register(ArcElement, Tooltip, Legend);

// Mock Data
const recentLogs = [
  {
    id: 1,
    date: "2024-06-01",
    item: "Banana Peel",
    category: "Produce",
    quantity: 1,
    image: "/seoherodashboard.png",
    detectedBy: "OpenCV",
  },
  {
    id: 2,
    date: "2024-06-01",
    item: "Bread Crust",
    category: "Bakery",
    quantity: 2,
    image: "/seoherodashboard.png",
    detectedBy: "OpenCV",
  },
  {
    id: 3,
    date: "2024-05-31",
    item: "Chicken Bones",
    category: "Meat",
    quantity: 3,
    image: "/seoherodashboard.png",
    detectedBy: "OpenCV",
  },
];

const wasteByCategory = {
  labels: ["Produce", "Bakery", "Meat"],
  datasets: [
    {
      label: "Waste (items)",
      data: [1, 2, 3],
      backgroundColor: [
        "rgba(34,197,94,0.7)", // green
        "rgba(253,224,71,0.7)", // yellow
        "rgba(239,68,68,0.7)", // red
      ],
      borderColor: [
        "rgba(34,197,94,1)",
        "rgba(253,224,71,1)",
        "rgba(239,68,68,1)",
      ],
      borderWidth: 2,
    },
  ],
};

const ecoSavings = {
  co2: 2.4, // kg
  dollars: 5.75,
  items: 6,
};

export default function DashboardPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Header */}
      <section className="relative flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-green-100 blur-[120px]" />
        </div>
        <h1 className="mb-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Welcome to your <span className="text-green-700">Dashboard</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-700">
          Track your food waste, view insights, and see your eco-savings in real
          time.
        </p>
        <Button
          size="lg"
          className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Waste Entry
        </Button>
      </section>

      {/* Dashboard Cards */}
      <section className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {/* Recent Logs */}
        <DashboardCard
          icon={<List className="h-7 w-7 text-green-600" />}
          title="Recent Logs"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Qty</th>
                  <th className="py-2 pr-4">Image</th>
                  <th className="py-2 pr-4">Detected By</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b last:border-0 hover:bg-green-50 transition"
                  >
                    <td className="py-2 pr-4 whitespace-nowrap">{log.date}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{log.item}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {log.category}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {log.quantity}
                    </td>
                    <td className="py-2 pr-4">
                      <Image
                        src={log.image}
                        alt={log.item}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {log.detectedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* Insights (Pie Chart) */}
        <DashboardCard
          icon={<PieIcon className="h-7 w-7 text-green-600" />}
          title="Insights"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <Pie
              data={wasteByCategory}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
            <div className="mt-4 text-xs text-gray-500">
              Waste by Category (last 3 entries)
            </div>
          </div>
        </DashboardCard>

        {/* Eco-Savings */}
        <DashboardCard
          icon={<Leaf className="h-7 w-7 text-green-600" />}
          title="Eco-Savings"
        >
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="flex items-center gap-2 text-3xl font-bold text-green-700">
              <Leaf className="h-7 w-7" />
              {ecoSavings.co2}{" "}
              <span className="text-base font-normal text-gray-500">
                kg CO₂
              </span>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
              ${ecoSavings.dollars}
              <span className="text-base font-normal text-gray-500">saved</span>
            </div>
            <div className="flex items-center gap-2 text-lg text-gray-700">
              {ecoSavings.items} items logged
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Estimates based on your recent activity
            </div>
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      <CardContent className="flex flex-col gap-4 p-6 flex-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        {children}
      </CardContent>
    </Card>
  );
}
