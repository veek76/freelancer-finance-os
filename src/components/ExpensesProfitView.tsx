import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  DollarSign,
  Calculator,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { Expense, ExpenseCategory, FinancialMetrics } from '../types';
import { calculateCategoryBreakdowns, CATEGORY_COLORS } from '../utils/calculations';

interface ExpensesProfitViewProps {
  expenses: Expense[];
  metrics: FinancialMetrics;
  taxRatePercent: number;
  setTaxRatePercent: (rate: number) => void;
  onOpenAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const ExpensesProfitView: React.FC<ExpensesProfitViewProps> = ({
  expenses,
  metrics,
  taxRatePercent,
  setTaxRatePercent,
  onOpenAddExpense,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoryBreakdown = calculateCategoryBreakdowns(expenses);

  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.vendor && e.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Calculator Interactive Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dynamic Profit & Tax Estimator
              </h3>
              <p className="text-xs text-slate-500">
                Formula: Revenue (Sum of Paid Invoices) - Expenses (Sum of Business Expenses) = Estimated Profit
              </p>
            </div>
          </div>

          {/* Tax Rate Slider Control */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Tax Set-Aside Rate:</span>
                <strong className="text-slate-900">{taxRatePercent}%</strong>
              </div>
              <input
                type="range"
                min="15"
                max="40"
                step="1"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                className="mt-1 h-1.5 w-32 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* The Equation Breakdown */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4 items-center">
          {/* Revenue */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Paid Revenue
            </div>
            <div className="mt-1 text-2xl font-black text-emerald-700">
              ${metrics.grossRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Sum of Paid Invoices</div>
          </div>

          <div className="hidden lg:flex items-center justify-center text-slate-400 font-bold text-xl">
            —
          </div>

          {/* Expenses */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Expenses
            </div>
            <div className="mt-1 text-2xl font-black text-amber-700">
              ${metrics.totalExpenses.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{expenses.length} logged costs</div>
          </div>

          <div className="hidden lg:flex items-center justify-center text-slate-400 font-bold text-xl">
            =
          </div>

          {/* Net Profit */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Estimated Net Profit
            </div>
            <div className="mt-1 text-2xl font-black text-slate-900">
              ${metrics.netProfit.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              {metrics.profitMarginPercent}% Operating Margin
            </div>
          </div>

          {/* Quarterly Tax Reserve */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              Quarterly Tax Reserve
            </div>
            <div className="mt-1 text-2xl font-black text-blue-900">
              ${metrics.taxReserveAmount.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-600 mt-0.5">
              Hold {taxRatePercent}% in escrow
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-slate-600" />
            Spend by Category
          </h4>
          <span className="text-xs text-slate-500">
            {categoryBreakdown.length} active categories
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categoryBreakdown.map((cat) => (
            <button
              key={cat.category}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.category ? 'All' : cat.category)
              }
              className={`rounded-xl border p-3.5 text-left transition ${
                selectedCategory === cat.category
                  ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-semibold">{cat.category}</span>
              </div>
              <div className="mt-2 text-base font-bold">
                ${cat.amount.toLocaleString()}
              </div>
              <div
                className={`text-[10px] ${
                  selectedCategory === cat.category ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {cat.percentage}% of total
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Expense Management Header & Search */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search expense description, vendor, or tool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Software">Software</option>
            <option value="Internet">Internet</option>
            <option value="Advertising">Advertising</option>
            <option value="Equipment">Equipment</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>

          <button
            id="log-expense-btn"
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Description & Vendor</th>
                <th className="px-5 py-3.5">Deductible</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => {
                  const color = CATEGORY_COLORS[expense.category] || '#64748b';

                  return (
                    <tr
                      key={expense.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {expense.date}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: `${color}15`,
                            color: color,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {expense.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {expense.description}
                        </div>
                        {expense.vendor && (
                          <div className="text-[11px] text-slate-500">
                            Vendor: {expense.vendor}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {expense.isDeductible ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            100% Write-Off
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Personal</span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                        ${expense.amount.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditExpense(expense)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            title="Edit Expense"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Delete Expense"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
