import {
  MessageSquare,
  Camera,
  CloudSun,
  TrendingUp,
  BookOpen,
  Bell,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    icon: MessageSquare,
    label: "Ask AI",
    description: "Get farming advice",
    href: "/chat",
    color: "bg-brand-500",
  },
  {
    icon: Camera,
    label: "Scan Plant",
    description: "Detect diseases",
    href: "/diagnose",
    color: "bg-red-500",
  },
  {
    icon: CloudSun,
    label: "Weather",
    description: "Today's forecast",
    href: "/weather",
    color: "bg-sky-500",
  },
  {
    icon: TrendingUp,
    label: "Prices",
    description: "Mandi rates",
    href: "/prices",
    color: "bg-amber-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl gradient-brand p-6 text-white">
        <h1 className="font-heading text-2xl font-bold">
          नमस्ते! Good Morning 🌾
        </h1>
        <p className="mt-1 text-brand-100">
          Your crops are looking great. Here&apos;s what you need to know today.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div
                className={`rounded-full ${action.color} p-3 text-white`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Placeholder Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CloudSun className="h-5 w-5 text-sky-500" />
            <h3 className="font-heading font-semibold">Weather Today</h3>
          </div>
          <p className="text-sm text-gray-500">
            Weather data will appear here once the OpenWeatherMap API is
            connected.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-amber-500" />
            <h3 className="font-heading font-semibold">Price Alerts</h3>
          </div>
          <p className="text-sm text-gray-500">
            Set up mandi price alerts to get notified when prices reach your
            target.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm sm:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-brand-500" />
            <h3 className="font-heading font-semibold">Today&apos;s Tips</h3>
          </div>
          <p className="text-sm text-gray-500">
            AI-generated daily farming tips will be shown here based on your
            crop, season, and location.
          </p>
        </div>
      </div>
    </div>
  );
}
