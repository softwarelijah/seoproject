'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, PieChart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
      <div className="bg-white text-gray-900">
        {/* ─────────────────── Hero ─────────────────── */}
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-white px-6 py-24 text-center">
          {/* background accent blur */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-green-100 blur-[120px]" />
          </div>

          <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl"
          >
            Track & <span className="text-green-700">Reduce</span> Your Food Waste
          </motion.h1>

          <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-gray-700"
          >
            Visualize what’s going into the trash, discover smarter shopping habits,
            and save money — all in one dashboard.
          </motion.p>

          <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
                asChild
                size="lg"
                className="bg-green-700 hover:bg-green-800 text-white"
            >
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
            <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <a
                  href="https://github.com/your-org/food-waste-tracker"
                  target="_blank"
                  rel="noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </motion.div>

          {/* hero image */}
          <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-16 w-full max-w-4xl"
          >
            <Image
                src="/seoherodashboard.png"
                alt="Dashboard screenshot"
                width={1600}
                height={900}
                className="rounded-2xl shadow-xl ring-1 ring-gray-200 bg-white"
                priority
            />
          </motion.div>
        </section>

        {/* ─────────────────── Feature Highlights ─────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-24 bg-white rounded-xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Why you’ll love it
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-700">
              From quick logging to data-rich insights, every pixel is designed to
              nudge you toward zero waste.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
                icon={<Trash2 className="h-7 w-7 text-green-600" />}
                title="One-Tap Logging"
                description="Scan receipts or speak an item — we’ll timestamp, classify, and calculate the impact automatically."
            />
            <FeatureCard
                icon={<PieChart className="h-7 w-7 text-green-600" />}
                title="Actionable Insights"
                description="Interactive charts surface your biggest waste categories so you know exactly where to cut back."
            />
            <FeatureCard
                icon={<Leaf className="h-7 w-7 text-green-600" />}
                title="Eco-Savings Score"
                description="See CO₂ and dollar savings accumulate in real time as you improve your habits."
            />
          </div>
        </section>

        {/* ─────────────────── CTA Banner ─────────────────── */}
        <section className="py-24 text-center bg-white">
          <h3 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900">
            Ready to waste less and save more?
          </h3>
          <Button
              asChild
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white"
          >
            <Link href="/dashboard">Create Your Free Account</Link>
          </Button>
        </section>
      </div>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
      <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
            {icon}
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-700">{description}</p>
        </CardContent>
      </Card>
  );
}
