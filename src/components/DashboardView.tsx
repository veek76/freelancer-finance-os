import React from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Sparkles,
  ChevronRight,
  Receipt,
  FilePlus,
} from 'lucide-react';
import {
  Client,
  Expense,
  FinancialMetrics,
  Invoice,
  Project,
  ActiveTab,
} from '../types';
import { calculateCategoryBreakdowns } from '../utils/calculations';

interface DashboardViewProps {
  metrics: FinancialMetrics;
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  expenses: Expense[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddInvoice: () => void;
  onOpenAddExpense: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  clients,
  projects,
  invoices,
  expenses,
  setActiveTab,
  onOpenAddInvoice,
  onOpenAddExpense,
}) => {
  const categoryBreakdown = calculateCategoryBreakdowns(expenses);

  // Recent client payments (paid or sent invoices)
  const recentPayments = [...invoices]
    .sort(
      (a, b) =>
        new Date(b.paid_date || b.issue_date).getTime() -
        new Date(a.paid_date || a.issue_date).getTime()
    )
    .slice(0, 5);

  const activeProjects = projects.filter((p) => p.status === 'In Progress');

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || 'Unknown Client';
  };

  const getProjectTitle = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.title || 'General Deliverable';
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Profit Formula Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles className="h-4 w-4" />
              Dynamic Profit Formula
            </div>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ${metrics.netProfit.toLocaleString()}{' '}
              <span className="text-base font-normal text-slate-300">
                Net Freelance Profit
              </span>
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Revenue (<strong>${metrics.grossRevenue.toLocaleString()}</strong> paid) -
              Expenses (<strong>${metrics.totalExpenses.toLocaleString()}</strong>) =
              Estimated Profit ({metrics.profitMarginPercent}% margin)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="dashboard-new-invoice-btn"
              onClick={onOpenAddInvoice}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md hover:bg-emerald-400 transition active:scale-95"
            >
              <Receipt className="h-4 w-4" />
              <span>Create Invoice</span>
            </button>
            <button
              id="dashboard-log-expense-btn"
              onClick={onOpenAddExpense}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              <FilePlus className="h-4 w-4 text-emerald-400" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gross Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ${metrics.grossRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Collected
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Invoices settled</span>
            <span className="font-medium text-slate-700">
              {invoices.filter((i) => i.status === 'Paid').length} paid
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ${metrics.totalExpenses.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Across {expenses.length} items
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Deductible write-offs</span>
            <span className="font-medium text-emerald-600">
              ${expenses.filter((e) => e.isDeductible).reduce((s, e) => s + e.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Net Profit
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ${metrics.netProfit.toLocaleString()}
            </span>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {metrics.profitMarginPercent}% margin
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Recommended tax set-aside</span>
            <span className="font-medium text-slate-900">
              ${metrics.taxReserveAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Receivables in Flight */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending & Overdue
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              metrics.overdueRevenue > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {metrics.overdueRevenue > 0 ? (
                <AlertTriangle className="h-5 w-5 text-rose-500" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ${(metrics.pendingRevenue + metrics.overdueRevenue).toLocaleString()}
            </span>
            {metrics.overdueRevenue > 0 && (
              <span className="text-xs font-bold text-rose-600">
                ${metrics.overdueRevenue.toLocaleString()} overdue
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Sent waiting payment</span>
            <span className="font-medium text-slate-700">
              ${metrics.pendingRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Expense Categories Breakdown & Recent Payments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visual Breakdown: Top Expense Categories */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="h-4.5 w-4.5 text-slate-700" />
                Expense Categories Breakdown
              </h4>
              <p className="text-xs text-slate-500">Distribution of operating costs</p>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {categoryBreakdown.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No expenses recorded yet.</p>
            ) : (
              categoryBreakdown.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        ${item.amount.toLocaleString()}
                      </span>
                      <span className="text-slate-400">({item.percentage}%)</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between">
            <span>Total Operational Spend:</span>
            <span className="font-bold text-slate-900">${metrics.totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* Recent Client Payments */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="h-4.5 w-4.5 text-slate-700" />
                Recent Client Payments
              </h4>
              <p className="text-xs text-slate-500">Latest invoice statuses and deposits</p>
            </div>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              All Invoices
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentPayments.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No invoice history found.</p>
            ) : (
              recentPayments.map((inv) => {
                const clientName = getClientName(inv.client_id);
                const isPaid = inv.status === 'Paid';
                const isOverdue = inv.status === 'Overdue';
                const isSent = inv.status === 'Sent';

                return (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-600'
                            : isOverdue
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {isPaid ? (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        ) : isOverdue ? (
                          <AlertTriangle className="h-4.5 w-4.5" />
                        ) : (
                          <Clock className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {clientName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {inv.invoice_number} · Due {inv.due_date}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        ${inv.amount.toLocaleString()}
                      </div>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800'
                            : isSent
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Active Projects Snapshot */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="h-4.5 w-4.5 text-slate-700" />
              Active Projects & Milestones
            </h4>
            <p className="text-xs text-slate-500">
              Tracking deliverables for {activeProjects.length} in-progress contracts
            </p>
          </div>
          <button
            onClick={() => setActiveTab('clients-projects')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            Manage Projects
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {activeProjects.map((p) => {
            const clientName = getClientName(p.client_id);
            const progress = p.progressPercent || 50;

            return (
              <div
                key={p.id}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {clientName}
                    </span>
                    <h5 className="mt-1.5 text-sm font-semibold text-slate-900">{p.title}</h5>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    ${p.budget?.toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Progress: {progress}%</span>
                    <span>Deadline: {p.deadline}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
