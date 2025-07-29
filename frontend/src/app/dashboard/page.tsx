"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Leaf,
  DollarSign,
  Droplets,
  Search,
  BarChart3,
  Calendar,
  Target,
} from "lucide-react";
import FoodWasteAPI, { AnalysisResult, USDASearchResult } from "../lib/api";

interface DashboardStats {
  totalScans: number;
  totalWaste: number;
  carbonSaved: number;
  moneySaved: number;
  compostableItems: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    totalWaste: 0,
    carbonSaved: 0,
    moneySaved: 0,
    compostableItems: 0,
  });
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<USDASearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration - in real app, this would come from your backend
  useEffect(() => {
    // Simulate loading dashboard data
    setStats({
      totalScans: 47,
      totalWaste: 23.5,
      carbonSaved: 12.8,
      moneySaved: 89.5,
      compostableItems: 31,
    });

    // Mock recent analyses
    setRecentAnalyses([
      {
        class_name: "Organic",
        confidence_score: 95,
        instruction: "Place in green bin or compost pile.",
        wasteImpact: {
          carbonFootprint: 0.5,
          waterUsage: 100,
          costEstimate: 2.5,
          compostingPotential: true,
        },
      },
      {
        class_name: "Recycle",
        confidence_score: 87,
        instruction: "Place in blue bin after rinsing.",
        wasteImpact: {
          carbonFootprint: 1.2,
          waterUsage: 50,
          costEstimate: 1.8,
          compostingPotential: false,
        },
      },
    ]);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await FoodWasteAPI.searchFood(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track your food waste and environmental impact
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Scans"
            value={stats.totalScans}
            icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Waste (lbs)"
            value={stats.totalWaste}
            icon={<TrendingUp className="h-6 w-6 text-red-600" />}
            color="bg-red-100"
          />
          <StatCard
            title="CO₂ Saved (kg)"
            value={stats.carbonSaved}
            icon={<Leaf className="h-6 w-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Money Saved"
            value={`$${stats.moneySaved}`}
            icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
            color="bg-yellow-100"
          />
        </div>

        {/* Search Section */}
        <Card className="mb-8 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Food Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-green-700 hover:bg-green-800"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-gray-900">Search Results:</h4>
                {searchResults.slice(0, 5).map((result, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {result.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      Category: {result.foodCategory || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {analysis.class_name}
                      </h4>
                      <span className="text-sm text-gray-600">
                        {analysis.confidence_score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {analysis.instruction}
                    </p>
                    {analysis.wasteImpact && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Leaf className="h-3 w-3 text-green-600" />
                          <span>
                            {analysis.wasteImpact.carbonFootprint} kg CO₂
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-600" />
                          <span>{analysis.wasteImpact.waterUsage}L water</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Compostable Items
                    </p>
                    <p className="text-sm text-gray-600">
                      Items that can be composted
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.compostableItems}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Water Saved</p>
                    <p className="text-sm text-gray-600">
                      Liters of water conserved
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">1,250L</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Money Saved</p>
                    <p className="text-sm text-gray-600">
                      Estimated cost savings
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    ${stats.moneySaved}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
