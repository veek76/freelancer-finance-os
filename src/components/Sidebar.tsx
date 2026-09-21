import React from 'react';
import {
  LayoutDashboard,
  Users,
  Receipt,
  PieChart,
  CheckSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  X,
  Layers,
} from 'lucide-react';
import { ActiveTab, FinancialMetrics } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  metrics: FinancialMetrics;
  onResetData: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  onResetData,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients-projects', label: 'Clients & Projects', icon: Users },
    {
      id: 'invoices',
      label: 'Invoices & Payments',
      icon: Receipt,
      badge: metrics.overdueRevenue > 0 ? 'Alert' : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    { id: 'expenses', label: 'Expenses & Profit', icon: PieChart },
    { id: 'tax-checklist', label: 'Tax & Write-Offs', icon: CheckSquare },
    {
      id: 'ai-insights',
      label: 'AI Business Insights',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Fixed Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-500/20 text-white font-bold">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
                  Freelancer <span className="text-emerald-400 font-bold">OS</span>
                </h1>
                <p className="text-xs text-slate-400">Financial Operating System</p>
              </div>
            </div>

            <button
              id="sidebar-close-mobile-btn"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Real-time mini glance card */}
          <div className="mx-4 my-4 rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Live Net Profit
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                {metrics.profitMarginPercent}% Margin
              </span>
            </div>
            <div className="text-xl font-bold tracking-tight text-white">
              ${metrics.netProfit.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Gross: ${metrics.grossRevenue.toLocaleString()}</span>
              <span>Exp: ${metrics.totalExpenses.toLocaleString()}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/80 p-4 space-y-3">
          {/* Overdue Alert banner if any */}
          {metrics.overdueRevenue > 0 && (
            <div
              onClick={() => handleSelectTab('invoices')}
              className="cursor-pointer rounded-lg bg-rose-950/40 border border-rose-800/50 p-2.5 text-xs text-rose-300 flex items-start gap-2 hover:bg-rose-950/60 transition"
            >
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-200">Overdue Invoices</div>
                <div className="text-[11px] text-rose-300/80">
                  ${metrics.overdueRevenue.toLocaleString()} awaiting payment
                </div>
              </div>
            </div>
          )}

          {/* Freelancer Profile & Reset Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 flex items-center justify-center font-bold text-xs">
                FL
              </div>
              <div className="leading-tight">
                <div className="text-xs font-semibold text-white">Freelance Pro</div>
                <div className="text-[11px] text-slate-400">Independent Studio</div>
              </div>
            </div>

            <button
              id="reset-demo-data-btn"
              onClick={onResetData}
              title="Reset to default mock data"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
