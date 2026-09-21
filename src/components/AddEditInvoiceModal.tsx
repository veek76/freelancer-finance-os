import React, { useState, useEffect } from 'react';
import { X, Receipt, DollarSign, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Invoice, InvoiceStatus, Client, Project } from '../types';

interface AddEditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Omit<Invoice, 'id'>, id?: string) => void;
  invoiceToEdit?: Invoice | null;
  clients: Client[];
  projects: Project[];
  nextInvoiceNumber: string;
}

export const AddEditInvoiceModal: React.FC<AddEditInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  invoiceToEdit,
  clients,
  projects,
  nextInvoiceNumber,
}) => {
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('Sent');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // Available projects for the selected client
  const availableProjects = projects.filter((p) => p.client_id === clientId);

  useEffect(() => {
    if (invoiceToEdit) {
      setClientId(invoiceToEdit.client_id);
      setProjectId(invoiceToEdit.project_id);
      setInvoiceNumber(invoiceToEdit.invoice_number);
      setAmount(String(invoiceToEdit.amount));
      setStatus(invoiceToEdit.status);
      setIssueDate(invoiceToEdit.issue_date);
      setDueDate(invoiceToEdit.due_date);
      setNotes(invoiceToEdit.notes || '');
    } else {
      const defaultClient = clients[0]?.id || '';
      setClientId(defaultClient);
      const clientProjs = projects.filter((p) => p.client_id === defaultClient);
      setProjectId(clientProjs[0]?.id || projects[0]?.id || '');
      setInvoiceNumber(nextInvoiceNumber);
      setAmount('3500');
      setStatus('Sent');

      const today = new Date().toISOString().split('T')[0];
      setIssueDate(today);

      const net14 = new Date();
      net14.setDate(net14.getDate() + 14);
      setDueDate(net14.toISOString().split('T')[0]);
      setNotes('Payment due within 14 calendar days. Thank you for your partnership!');
    }
  }, [invoiceToEdit, isOpen, clients, projects, nextInvoiceNumber]);

  // When client changes, auto-select first matching project
  const handleClientChange = (newClientId: string) => {
    setClientId(newClientId);
    const matchingProjs = projects.filter((p) => p.client_id === newClientId);
    if (matchingProjs.length > 0) {
      setProjectId(matchingProjs[0].id);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !projectId || !amount || !dueDate) return;

    onSave(
      {
        invoice_number: invoiceNumber || nextInvoiceNumber,
        client_id: clientId,
        project_id: projectId,
        amount: Number(amount),
        status,
        issue_date: issueDate,
        due_date: dueDate,
        paid_date: status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
        notes: notes.trim() || undefined,
      },
      invoiceToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Receipt className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {invoiceToEdit ? 'Edit Invoice' : 'Create New Invoice'}
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
                Invoice Number *
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-emerald-500"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent (Pending)</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Account *
              </label>
              <select
                required
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Associated Project *
              </label>
              <select
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              >
                {availableProjects.length > 0 ? (
                  availableProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))
                ) : (
                  projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount ($) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                placeholder="2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Terms & Scope Notes
            </label>
            <textarea
              rows={2}
              placeholder="Milestone release details, bank routing instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
            />
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
              {invoiceToEdit ? 'Save Invoice' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
