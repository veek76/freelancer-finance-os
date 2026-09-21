import React, { useState } from 'react';
import {
  Menu,
  Plus,
  Receipt,
  FileText,
  UserPlus,
  FolderPlus,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ActiveTab, FinancialMetrics } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setMobileOpen: (open: boolean) => void;
  metrics: FinancialMetrics;
  onOpenAddInvoice: () => void;
  onOpenAddExpense: () => void;
  onOpenAddClient: () => void;
  onOpenAddProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setMobileOpen,
  metrics,
  onOpenAddInvoice,
  onOpenAddExpense,
  onOpenAddClient,
  onOpenAddProject,
}) => {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Financial Dashboard',
          subtitle: 'Real-time revenue, expenses, and cash flow overview',
        };
      case 'clients-projects':
        return {
          title: 'Client & Project Tracker',
          subtitle: 'Manage client relationships, active contracts, and project deadlines',
        };
      case 'invoices':
        return {
          title: 'Invoices & Payment Status',
          subtitle: 'Create, monitor, and collect receivables with instant status tracking',
        };
      case 'expenses':
        return {
          title: 'Business Expenses & Profit Calculator',
          subtitle: 'Dynamic profit formula and tax deduction categorization',
        };
      case 'tax-checklist':
        return {
          title: 'Freelance Tax & Write-Off Checklist',
          subtitle: 'Audit-ready deductible expense tracking to maximize net take-home pay',
        };
      case 'ai-insights':
        return {
          title: 'AI Business Insights Panel',
          subtitle: 'Automated financial analysis and strategic advisory for your freelance practice',
        };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          id="mobile-sidebar-toggle"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date & Tax set-aside pill (desktop) */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 md:flex">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{currentDate}</span>
          <span className="text-slate-300">|</span>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>
            Tax Reserve:{' '}
            <strong className="text-slate-900 font-semibold">
              ${metrics.taxReserveAmount.toLocaleString()}
            </strong>
          </span>
        </div>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            id="quick-add-menu-btn"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {quickAddOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setQuickAddOpen(false)}
              />
              <div
                id="quick-add-dropdown-panel"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Create New
                </div>
                <button
                  id="quick-add-invoice-btn"
                  onClick={() => {
                    setQuickAddOpen(false);
                    onOpenAddInvoice();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
                >
                  <Receipt className="h-4 w-4 text-emerald-600" />
                  <span>New Invoice</span>
                </button>

                <button
                  id="quick-add-expense-btn"
                  onClick={() => {
                    setQuickAddOpen(false);
                    onOpenAddExpense();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
                >
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span>Log Expense</span>
                </button>

                <button
                  id="quick-add-client-btn"
                  onClick={() => {
                    setQuickAddOpen(false);
                    onOpenAddClient();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
                >
                  <UserPlus className="h-4 w-4 text-emerald-600" />
                  <span>New Client</span>
                </button>

                <button
                  id="quick-add-project-btn"
                  onClick={() => {
                    setQuickAddOpen(false);
                    onOpenAddProject();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
                >
                  <FolderPlus className="h-4 w-4 text-emerald-600" />
                  <span>New Project</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
