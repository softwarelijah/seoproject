"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  TrendingDown,
  Leaf,
  DollarSign,
  Droplets,
  Lightbulb,
  BarChart3,
  Calendar,
  Target,
  Award,
  Zap,
} from "lucide-react";
import FoodWasteAPI, { AnalysisResult, USDASearchResult } from "../lib/api";

interface InsightData {
  weeklyWaste: number;
  monthlySavings: number;
  carbonReduction: number;
  waterSaved: number;
  compostingRate: number;
  topWasteCategories: Array<{ name: string; percentage: number }>;
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

export default function InsightsPage() {
  const [insightData, setInsightData] = useState<InsightData>({
    weeklyWaste: 0,
    monthlySavings: 0,
    carbonReduction: 0,
    waterSaved: 0,
    compostingRate: 0,
    topWasteCategories: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading insights data
    setTimeout(() => {
      setInsightData({
        weeklyWaste: 5.2,
        monthlySavings: 45.8,
        carbonReduction: 8.4,
        waterSaved: 850,
        compostingRate: 65,
        topWasteCategories: [
          { name: "Fruits & Vegetables", percentage: 35 },
          { name: "Bread & Grains", percentage: 25 },
          { name: "Dairy Products", percentage: 20 },
          { name: "Meat & Fish", percentage: 15 },
          { name: "Other", percentage: 5 },
        ],
        recommendations: [
          {
            title: "Plan Your Meals",
            description:
              "Create a weekly meal plan to reduce impulse purchases and food waste.",
            impact: "Save $15-25 per week",
          },
          {
            title: "Store Food Properly",
            description:
              "Use proper storage techniques to extend the shelf life of perishables.",
            impact: "Reduce waste by 30%",
          },
          {
            title: "Compost More",
            description:
              "Increase composting of organic waste to reduce landfill contribution.",
            impact: "Save 2.5 kg CO₂ per week",
          },
          {
            title: "Buy in Smaller Quantities",
            description:
              "Purchase smaller portions to avoid spoilage and waste.",
            impact: "Save $10-20 per week",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const ProgressBar = ({
    percentage,
    color,
  }: {
    percentage: number;
    color: string;
  }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  const InsightCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Insights & Analytics
          </h1>
          <p className="text-gray-600">
            Discover patterns and optimize your waste reduction strategy
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InsightCard
            title="Weekly Waste"
            value={`${insightData.weeklyWaste} lbs`}
            subtitle="This week"
            icon={<TrendingDown className="h-6 w-6 text-red-600" />}
            color="bg-red-100"
          />
          <InsightCard
            title="Monthly Savings"
            value={`$${insightData.monthlySavings}`}
            subtitle="Cost savings"
            icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
            color="bg-yellow-100"
          />
          <InsightCard
            title="Carbon Reduction"
            value={`${insightData.carbonReduction} kg`}
            subtitle="CO₂ saved"
            icon={<Leaf className="h-6 w-6 text-green-600" />}
            color="bg-green-100"
          />
          <InsightCard
            title="Water Saved"
            value={`${insightData.waterSaved}L`}
            subtitle="Liters conserved"
            icon={<Droplets className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100"
          />
        </div>

        {/* Waste Categories and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Waste Categories */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Waste Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insightData.topWasteCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {category.percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      percentage={category.percentage}
                      color={
                        index === 0
                          ? "bg-red-500"
                          : index === 1
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Composting Rate */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Composting Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-green-600"
                      strokeDasharray={`${
                        insightData.compostingRate * 3.52
                      } 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {insightData.compostingRate}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">
                  of organic waste is being composted
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insightData.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {recommendation.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {recommendation.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Week's Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                <p className="text-sm text-gray-600">Meal planning sessions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">5</div>
                <p className="text-sm text-gray-600">Composting days</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  $15
                </div>
                <p className="text-sm text-gray-600">Savings target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
