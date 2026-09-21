import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileEdit,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Invoice, Client, Project, InvoiceStatus } from '../types';

interface InvoicesViewProps {
  invoices: Invoice[];
  clients: Client[];
  projects: Project[];
  onOpenAddInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
  onPreviewInvoice: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  clients,
  projects,
  onOpenAddInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onUpdateInvoiceStatus,
  onPreviewInvoice,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || 'Unknown Client';
  };

  const getProjectTitle = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.title || 'General Milestone';
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const clientName = getClientName(inv.client_id).toLowerCase();
    const projectTitle = getProjectTitle(inv.project_id).toLowerCase();
    const invNum = inv.invoice_number.toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      clientName.includes(query) ||
      projectTitle.includes(query) ||
      invNum.includes(query);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'Sent':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock,
        };
      case 'Overdue':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertTriangle,
        };
      case 'Draft':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: FileEdit,
        };
    }
  };

  // Status breakdown totals
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const totalSent = invoices.filter((i) => i.status === 'Sent').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  const totalDraft = invoices.filter((i) => i.status === 'Draft').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top summary cards by status */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={() => setStatusFilter('Paid')}
          className={`rounded-xl border p-4 text-left transition ${
            statusFilter === 'Paid'
              ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Paid</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-slate-900">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            {invoices.filter((i) => i.status === 'Paid').length} invoices settled
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('Sent')}
          className={`rounded-xl border p-4 text-left transition ${
            statusFilter === 'Sent'
              ? 'border-blue-500 bg-blue-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-blue-700">
            <span>Sent (Pending)</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-slate-900">
            ${totalSent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            {invoices.filter((i) => i.status === 'Sent').length} in transit
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('Overdue')}
          className={`rounded-xl border p-4 text-left transition ${
            statusFilter === 'Overdue'
              ? 'border-rose-500 bg-rose-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>Overdue</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-rose-700">
            ${totalOverdue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            {invoices.filter((i) => i.status === 'Overdue').length} action needed
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('Draft')}
          className={`rounded-xl border p-4 text-left transition ${
            statusFilter === 'Draft'
              ? 'border-slate-500 bg-slate-100 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Drafts</span>
            <FileEdit className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-slate-900">
            ${totalDraft.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            {invoices.filter((i) => i.status === 'Draft').length} unissued
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client, project, or invoice number (e.g. INV-2026)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
            {['All', 'Paid', 'Sent', 'Overdue', 'Draft'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            id="create-new-invoice-btn"
            onClick={onOpenAddInvoice}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Client & Project</th>
                <th className="px-5 py-3.5">Issue / Due Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status (Toggle)</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No invoices match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const client = clients.find((c) => c.id === inv.client_id);
                  const project = projects.find((p) => p.id === inv.project_id);
                  const badge = getStatusBadge(inv.status);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Invoice Number */}
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        {inv.invoice_number}
                      </td>

                      {/* Client & Project */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {client?.name || 'Client'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {project?.title || 'Deliverable'}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-4">
                        <div className="text-slate-800">
                          Due: <strong className="font-semibold">{inv.due_date}</strong>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Issued: {inv.issue_date}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                        ${inv.amount.toLocaleString()}
                      </td>

                      {/* Quick Status Toggle Selector */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={inv.status}
                            onChange={(e) =>
                              onUpdateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)
                            }
                            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${badge.bg}`}
                          >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status !== 'Paid' && (
                            <button
                              onClick={() => onUpdateInvoiceStatus(inv.id, 'Paid')}
                              title="Mark as Paid"
                              className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => onPreviewInvoice(inv)}
                            title="Preview & Print Invoice"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onEditInvoice(inv)}
                            title="Edit Invoice"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                          >
                            <FileEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteInvoice(inv.id)}
                            title="Delete Invoice"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          >
                            <Trash2 className="h-4 w-4" />
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
