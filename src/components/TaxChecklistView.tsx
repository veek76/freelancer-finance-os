import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  Info,
  DollarSign,
  Plus,
  HelpCircle,
  FileCheck,
  AlertCircle,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { TaxChecklistItem, FinancialMetrics } from '../types';

interface TaxChecklistViewProps {
  taxChecklist: TaxChecklistItem[];
  metrics: FinancialMetrics;
  onToggleChecklistItem: (id: string) => void;
  onAddCustomWriteOff: (item: Omit<TaxChecklistItem, 'id'>) => void;
}

export const TaxChecklistView: React.FC<TaxChecklistViewProps> = ({
  taxChecklist,
  metrics,
  onToggleChecklistItem,
  onAddCustomWriteOff,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTips, setNewTips] = useState('');

  const completedCount = taxChecklist.filter((t) => t.checked).length;
  const progressPercent = Math.round((completedCount / taxChecklist.length) * 100) || 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    onAddCustomWriteOff({
      title: newTitle,
      category: newCategory,
      estimatedAnnualDeduction: Number(newAmount),
      description: newDescription || 'Custom business write-off deduction.',
      tips: newTips || 'Retain itemized receipt or proof of payment for tax filing records.',
      documentationRequired: 'Receipt, contract or bank statement verification.',
      checked: true,
    });

    setNewTitle('');
    setNewAmount('');
    setNewDescription('');
    setNewTips('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Tax Deductions Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Freelance Tax Write-Off & Deductions Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Claim legitimate Schedule C business write-offs to decrease taxable net profit
              </p>
            </div>
          </div>

          <button
            id="add-custom-write-off-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Custom Deduction</span>
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Deductions Tracked
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              ${metrics.totalTrackedWriteOffs.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {completedCount} of {taxChecklist.length} categories claimed ({progressPercent}%)
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Estimated Tax Savings
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-700 flex items-center gap-1">
              <TrendingDown className="h-5 w-5" />
              ${metrics.estimatedTaxSavings.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-800/80 mt-0.5">
              Based on {metrics.taxRatePercent}% effective self-employment bracket
            </div>
          </div>

          <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              Recommended Tax Set-Aside
            </span>
            <div className="mt-1 text-2xl font-black text-blue-900">
              ${metrics.taxReserveAmount.toLocaleString()}
            </div>
            <div className="text-xs text-blue-700 mt-0.5">
              Hold in high-yield account for quarterly IRS estimates
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Deduction Coverage Progress</span>
            <span className="font-semibold text-slate-700">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-slate-600" />
          Standard Freelancer Write-Off Categories
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {taxChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleChecklistItem(item.id)}
              className={`cursor-pointer rounded-xl border p-5 transition flex flex-col justify-between ${
                item.checked
                  ? 'border-emerald-300 bg-white shadow-xs hover:border-emerald-400'
                  : 'border-slate-200 bg-slate-50/70 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.checked ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-600 text-white">
                          <CheckSquare className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-slate-300 bg-white">
                          <Square className="h-3 w-3 text-transparent" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5
                          className={`text-sm font-bold ${
                            item.checked ? 'text-slate-900' : 'text-slate-600'
                          }`}
                        >
                          {item.title}
                        </h5>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-900">
                      ${item.estimatedAnnualDeduction.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">Est. / Year</span>
                  </div>
                </div>

                {/* Audit & Tip box */}
                <div className="mt-3.5 space-y-2 rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-700">IRS Rule Tip:</strong> {item.tips}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                    <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Audit Proof:</strong> {item.documentationRequired}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span
                  className={`font-semibold ${
                    item.checked ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {item.checked ? '✓ Included in Tax Plan' : 'Click to Claim Deduction'}
                </span>
                <span className="text-slate-400">
                  Estimated Bracket Savings: $
                  {Math.round(
                    item.estimatedAnnualDeduction * (metrics.taxRatePercent / 100)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Deduction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900">Add Custom Tax Write-Off</h4>
            <p className="text-xs text-slate-500 mt-1">
              Add a specialized business deduction for your freelance setup.
            </p>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deduction Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Office Chair or Co-working Desk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hardware or Travel"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Amount ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 800"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief note about how this qualifies for your freelance business..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Audit Tip / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saved PDF invoice in Google Drive folder"
                  value={newTips}
                  onChange={(e) => setNewTips(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Save Write-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
