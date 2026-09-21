import React from 'react';
import { X, Printer, CheckCircle2, AlertTriangle, Clock, Download } from 'lucide-react';
import { Invoice, Client, Project } from '../types';

interface InvoicePreviewModalProps {
  invoice: Invoice | null;
  client?: Client;
  project?: Project;
  onClose: () => void;
  onMarkPaid?: (invoiceId: string) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  client,
  project,
  onClose,
  onMarkPaid,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === 'Paid';
  const isOverdue = invoice.status === 'Overdue';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              Invoice Preview: {invoice.invoice_number}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-800'
                  : isOverdue
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isPaid && onMarkPaid && (
              <button
                onClick={() => onMarkPaid(invoice.id)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as Paid
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              Print / PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto p-8 text-slate-800 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                INVOICE
              </h2>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                Freelancer Independent Practice
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Studio Lumina & Partners • hello@freelancestudio.com
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                {invoice.invoice_number}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Issue Date: <span className="font-medium text-slate-700">{invoice.issue_date}</span>
              </div>
              <div className="text-xs text-slate-500">
                Due Date: <span className="font-medium text-slate-700">{invoice.due_date}</span>
              </div>
            </div>
          </div>

          {/* Client & Project Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Billed To
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                {client?.name || 'Client Name'}
              </div>
              {client?.company && (
                <div className="text-xs text-slate-600">{client.company}</div>
              )}
              <div className="text-xs text-slate-500">{client?.email}</div>
              {client?.phone && (
                <div className="text-xs text-slate-500">{client.phone}</div>
              )}
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Associated Project
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                {project?.title || 'Professional Deliverable'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Status: {project?.status || 'Active'}
              </div>
              {invoice.paid_date && (
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  Settled on: {invoice.paid_date}
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-4 border rounded-xl border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-900">
                      {project?.title || 'Freelance Services & Project Milestone'}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {invoice.notes || 'Full milestone delivery and commercial intellectual property release.'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-500">Fixed Milestone</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900">
                    ${invoice.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Box */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 rounded-xl bg-slate-50 p-4 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">${invoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (0% Service):</span>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>Total Due:</span>
                <span className="text-emerald-600">${invoice.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Notes */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600">
            <div className="font-semibold text-slate-800">Payment Instructions:</div>
            <p className="mt-1 text-[11px] text-slate-500">
              Please send ACH or Wire transfers within terms. Remit payment to: First Republic / Chase Freelance Checking #xxxx-9482, Routing #121000358. Thank you for your business!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
