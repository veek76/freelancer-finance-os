import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Calendar, Tag, CheckSquare, Square } from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';

interface AddEditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>, id?: string) => void;
  expenseToEdit?: Expense | null;
}

export const AddEditExpenseModal: React.FC<AddEditExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('Software');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [isDeductible, setIsDeductible] = useState(true);

  useEffect(() => {
    if (expenseToEdit) {
      setCategory(expenseToEdit.category);
      setAmount(String(expenseToEdit.amount));
      setDate(expenseToEdit.date);
      setDescription(expenseToEdit.description);
      setVendor(expenseToEdit.vendor || '');
      setIsDeductible(expenseToEdit.isDeductible ?? true);
    } else {
      setCategory('Software');
      setAmount('45');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setVendor('');
      setIsDeductible(true);
    }
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim() || !date) return;

    onSave(
      {
        category,
        amount: Number(amount),
        date,
        description,
        vendor: vendor.trim() || undefined,
        isDeductible,
      },
      expenseToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {expenseToEdit ? 'Edit Business Expense' : 'Log New Expense'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              >
                <option value="Software">Software</option>
                <option value="Internet">Internet</option>
                <option value="Advertising">Advertising</option>
                <option value="Equipment">Equipment</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount ($) *
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="95.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold focus:outline-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Figma Organization Monthly Subscription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor / Service Provider
              </label>
              <input
                type="text"
                placeholder="e.g. Figma Inc., Apple, Google"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Deductible toggle */}
          <div
            onClick={() => setIsDeductible(!isDeductible)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer select-none hover:bg-slate-100/70 transition"
          >
            {isDeductible ? (
              <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-white">
                <CheckSquare className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-slate-300 bg-white">
                <Square className="h-3 w-3 text-transparent" />
              </div>
            )}
            <div className="text-xs">
              <div className="font-semibold text-slate-900">
                100% Tax Deductible Business Expense
              </div>
              <div className="text-slate-500">
                Include in annual tax write-offs and Schedule C deductions
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              {expenseToEdit ? 'Save Expense' : 'Log Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
