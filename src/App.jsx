import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Volume",
    value: "$12,450",
    change: "+18.3%",
    trend: "up",
  },
  {
    label: "Pending Requests",
    value: "12",
    change: "-4 this week",
    trend: "down",
  },
  {
    label: "Active Customers",
    value: "45",
    change: "+6 new",
    trend: "up",
  },
];

const recentTransactions = [
  {
    customer: "Acme Corp",
    amount: "$1,250.00",
    status: "Paid",
    date: "Feb 24, 2026",
  },
  {
    customer: "Brightline Media",
    amount: "$980.00",
    status: "Pending",
    date: "Feb 24, 2026",
  },
  {
    customer: "Nova Retail",
    amount: "$430.50",
    status: "Paid",
    date: "Feb 23, 2026",
  },
  {
    customer: "Orbit Logistics",
    amount: "$2,100.00",
    status: "Paid",
    date: "Feb 22, 2026",
  },
  {
    customer: "Skyline Ventures",
    amount: "$760.75",
    status: "Pending",
    date: "Feb 21, 2026",
  },
];

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Transactions", icon: CreditCard },
  { name: "Customers", icon: Users },
  { name: "Settings", icon: Settings },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-[#0f3460] text-white">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800/70">
            <div className="h-9 w-9 rounded-xl bg-[#e94560] flex items-center justify-center">
              <span className="text-white font-semibold text-lg">P</span>
            </div>
            <div>
              <p className="font-semibold tracking-tight">PayCollect</p>
              <p className="text-xs text-slate-400">Unified payment requests</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;

              return (
                <button
                  key={item.name}
                  className={classNames(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-[#0f3460]"
                      : "text-slate-200 hover:bg-slate-800/70 hover:text-white",
                  )}
                >
                  <span
                    className={classNames(
                      "flex h-8 w-8 items-center justify-center rounded-lg border text-xs",
                      isActive
                        ? "border-[#0f3460]/10 bg-[#0f3460]/5 text-[#0f3460]"
                        : "border-slate-600/70 bg-slate-900/40 text-slate-200 group-hover:border-slate-400",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-5 pb-5 pt-2 border-t border-slate-800/70 text-xs text-slate-400">
            <p className="font-medium text-slate-300">Settlement status</p>
            <div className="mt-2 flex items-center justify-between">
              <span>Today</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                • On track
              </span>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-navy flex items-center justify-center">
              <span className="text-white font-semibold text-sm">P</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                PayCollect
              </p>
              <p className="text-[11px] text-slate-500">
                Secure payment requests
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full bg-brandRed px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-brandRed/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandRed/60">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Request</span>
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-5 md:px-8 md:py-8">
            {/* Top bar (desktop) */}
            <div className="hidden items-center justify-between md:flex">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Real-time insight into your PayCollect requests and settlement
                  health.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 md:inline-flex">
                  Today · USD
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-brandRed px-4 py-2 text-xs md:text-sm font-medium text-white shadow-sm hover:bg-brandRed/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandRed/60">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Payment Request</span>
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={classNames(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
                        stat.trend === "up"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600",
                      )}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={classNames(
                        "h-full rounded-full",
                        stat.trend === "up"
                          ? "bg-navy/90"
                          : "bg-amber-400/80",
                      )}
                      style={{
                        width:
                          stat.label === "Total Volume"
                            ? "74%"
                            : stat.label === "Pending Requests"
                              ? "36%"
                              : "58%",
                      }}
                    />
                  </div>
                </article>
              ))}
            </section>

            {/* Recent transactions */}
            <section className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Recent Transactions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Latest payment requests flowing through PayCollect.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-600">
                    ● Paid
                  </span>
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 font-medium text-amber-600">
                    ● Pending
                  </span>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-500">
                      <th className="py-2 pr-6 font-medium">Customer</th>
                      <th className="py-2 pr-6 font-medium">Amount</th>
                      <th className="py-2 pr-6 font-medium">Status</th>
                      <th className="py-2 pr-6 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentTransactions.map((tx, index) => (
                      <tr
                        key={tx.customer + index}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="py-3 pr-6">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {tx.customer}
                            </span>
                            <span className="text-xs text-slate-500">
                              Payment request · #{String(2730 + index).padStart(
                                4,
                                "0",
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-6 text-slate-900">
                          {tx.amount}
                        </td>
                        <td className="py-3 pr-6">
                          <span
                            className={classNames(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                              tx.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700",
                            )}
                          >
                            <span className="text-[9px]">●</span>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 pr-6 text-slate-500">
                          {tx.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

