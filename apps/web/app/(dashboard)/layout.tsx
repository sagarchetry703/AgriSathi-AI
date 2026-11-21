import {
  CloudSun, Droplets, History, Home, Leaf, MessageSquare,
  Sprout, TrendingUp, UserRound,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/diagnose", label: "Crop Scan", icon: Leaf },
  { href: "/chat", label: "Ask AI", icon: MessageSquare },
  { href: "/weather", label: "Weather", icon: CloudSun },
  { href: "/profile", label: "My Farm", icon: UserRound },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f7f2]">
      <header className="sticky top-0 z-40 border-b border-[#dfe7dc] bg-white/95 backdrop-blur-sm lg:ml-64">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sprout className="h-7 w-7 text-[#2d7d46]" />
            <span className="font-heading text-lg font-bold text-[#153f27]">AgriSathi AI</span>
          </Link>
          <Link href="/profile" className="rounded-full bg-[#edf6ed] p-2 text-[#2d7d46]">
            <UserRound className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[#dfe7dc] bg-[#153f27] p-5 lg:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 text-white">
          <div className="rounded-xl bg-white/10 p-2"><Sprout className="h-7 w-7" /></div>
          <div><div className="font-heading font-bold">AgriSathi</div><div className="text-xs text-green-200">Northeast farming</div></div>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-green-50 hover:bg-white/10">
              <item.icon className="h-5 w-5" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link href="/soil" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-green-50 hover:bg-white/10"><Droplets className="h-5 w-5" />Soil Doctor</Link>
          <Link href="/advisor" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-green-50 hover:bg-white/10"><Leaf className="h-5 w-5" />Crop Advisor</Link>
          <Link href="/flood" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-green-50 hover:bg-white/10"><History className="h-5 w-5" />Flood Safety</Link>
          <Link href="/prices" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-green-50 hover:bg-white/10"><TrendingUp className="h-5 w-5" />Market Prices</Link>
        </div>
      </aside>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:ml-64 lg:px-8">
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-[#dfe7dc] bg-white px-1 pb-safe lg:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] text-[#4f6756]">
            <item.icon className="h-5 w-5" />{item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
