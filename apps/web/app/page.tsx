import Link from "next/link";
import {
  Sprout,
  MessageSquare,
  Camera,
  CloudSun,
  TrendingUp,
  Users,
  ArrowRight,
  Mic,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Crop Advisor",
    description:
      "Chat with our AI for personalized crop advice, pest management, and fertilizer recommendations.",
    href: "/chat",
    color: "text-brand-500",
    bg: "bg-brand-50",
  },
  {
    icon: Camera,
    title: "Disease Detection",
    description:
      "Upload a photo of your plant and get instant AI-powered disease diagnosis with treatment suggestions.",
    href: "/diagnose",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: CloudSun,
    title: "Weather Forecast",
    description:
      "Hyper-local weather forecasts with actionable farming alerts for sowing, irrigation, and harvesting.",
    href: "/weather",
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  {
    icon: TrendingUp,
    title: "Mandi Prices",
    description:
      "Real-time market prices from eNAM and local mandis. Set alerts to sell at the best price.",
    href: "/prices",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Users,
    title: "Expert Connect",
    description:
      "Connect with agricultural experts and fellow farmers. Ask questions and share knowledge.",
    href: "/community",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Globe,
    title: "Your Language",
    description:
      "Available in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, and more regional languages.",
    href: "#languages",
    color: "text-earth-500",
    bg: "bg-earth-50",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-brand-500" />
            <span className="font-heading text-xl font-bold text-brand-800">
              AgriSathi AI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 transition-colors"
            >
              <Mic className="h-4 w-4" />
              Voice Chat
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-5" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Sprout className="h-4 w-4" />
              AI-Powered Agriculture
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your Smart
              <span className="text-brand-500"> Farming Companion</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Get expert crop advice, diagnose plant diseases instantly, track
              weather &amp; market prices — all powered by AI, in your language,
              and accessible offline.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                <MessageSquare className="h-5 w-5" />
                Start Chatting
              </Link>
              <Link
                href="/diagnose"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-200 bg-white px-6 py-3 text-base font-semibold text-brand-700 hover:border-brand-300 hover:bg-brand-50 transition-all"
              >
                <Camera className="h-5 w-5" />
                Scan Plant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Everything You Need for Smart Farming
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Powerful AI tools designed specifically for Indian farmers
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className={`inline-flex rounded-xl ${feature.bg} p-3 mb-4`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Sprout className="h-4 w-4 text-brand-500" />
            <span>
              AgriSathi AI — Empowering Indian Farmers with Artificial
              Intelligence
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
