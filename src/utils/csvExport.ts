import {
  Client,
  Expense,
  FinancialMetrics,
  Invoice,
  Project,
} from '../types';
import { calculateCategoryBreakdowns } from './calculations';

/**
 * Escapes a cell value conforming to RFC 4180 CSV standard.
 */
function escapeCsv(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Triggers a client-side download of a CSV file.
 */
export function triggerCsvDownload(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats current date for file naming (YYYY-MM-DD).
 */
export function getFormattedDateStamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates Financial Performance & P&L Report CSV
 */
export function exportFinancialReportCsv(
  metrics: FinancialMetrics,
  invoices: Invoice[],
  expenses: Expense[],
  clients: Client[],
  projects: Project[]
): void {
  const dateStamp = getFormattedDateStamp();
  const categoryBreakdown = calculateCategoryBreakdowns(expenses);

  const lines: string[] = [];

  // Header Section
  lines.push('=== FREELANCER FINANCE OS - FINANCIAL PERFORMANCE REPORT ===');
  lines.push(`Generated Date,${escapeCsv(new Date().toLocaleString())}`);
  lines.push(`Reporting Period,Year to Date / All Time`);
  lines.push('');

  // Key Financial Metrics
  lines.push('--- EXECUTIVE SUMMARY ---');
  lines.push('Metric,Value (USD),Notes');
  lines.push(`Gross Revenue (Collected),${escapeCsv(metrics.grossRevenue)},Sum of Paid Invoices`);
  lines.push(`Total Business Expenses,${escapeCsv(metrics.totalExpenses)},Total Recorded Deductible & Operating Costs`);
  lines.push(`Net Freelance Profit,${escapeCsv(metrics.netProfit)},Gross Revenue minus Total Expenses`);
  lines.push(`Profit Margin,${escapeCsv(metrics.profitMarginPercent + '%')},Operating Margin`);
  lines.push(`Tax Reserve Set-Aside,${escapeCsv(metrics.taxReserveAmount)},Estimated recommended quarterly tax provision`);
  lines.push(`Pending Receivables,${escapeCsv(metrics.pendingRevenue)},Sent invoices awaiting payment`);
  lines.push(`Overdue Receivables,${escapeCsv(metrics.overdueRevenue)},Invoices past due date`);
  lines.push(`Draft Invoices Value,${escapeCsv(metrics.draftRevenue)},Unsent invoice drafts`);
  lines.push('');

  // Expense Categories Breakdown
  lines.push('--- EXPENSE CATEGORY BREAKDOWN ---');
  lines.push('Category,Amount (USD),Share of Total Expenses (%)');
  categoryBreakdown.forEach((cat) => {
    lines.push(`${escapeCsv(cat.category)},${escapeCsv(cat.amount)},${escapeCsv(cat.percentage + '%')}`);
  });
  lines.push(`Total Expenses,${escapeCsv(metrics.totalExpenses)},100%`);
  lines.push('');

  // Invoice Pipeline Summary
  lines.push('--- INVOICE PIPELINE SUMMARY ---');
  lines.push('Status,Count,Total Amount (USD)');
  const statuses: Array<Invoice['status']> = ['Paid', 'Sent', 'Overdue', 'Draft'];
  statuses.forEach((st) => {
    const list = invoices.filter((i) => i.status === st);
    const sum = list.reduce((s, i) => s + i.amount, 0);
    lines.push(`${escapeCsv(st)},${escapeCsv(list.length)},${escapeCsv(sum)}`);
  });
  lines.push('');

  // Active Projects Overview
  lines.push('--- ACTIVE PROJECTS SUMMARY ---');
  lines.push('Project Title,Client,Status,Budget (USD),Progress (%),Deadline');
  projects.forEach((p) => {
    const client = clients.find((c) => c.id === p.client_id)?.name || 'Unknown';
    lines.push(
      [
        escapeCsv(p.title),
        escapeCsv(client),
        escapeCsv(p.status),
        escapeCsv(p.budget ?? 0),
        escapeCsv((p.progressPercent ?? 0) + '%'),
        escapeCsv(p.deadline),
      ].join(',')
    );
  });

  const csvContent = lines.join('\n');
  triggerCsvDownload(`freelancer-financial-report-${dateStamp}.csv`, csvContent);
}

/**
 * Generates Client Directory & Financial Performance CSV
 */
export function exportClientsCsv(
  clients: Client[],
  projects: Project[],
  invoices: Invoice[]
): void {
  const dateStamp = getFormattedDateStamp();
  const headers = [
    'Client ID',
    'Client Name',
    'Email',
    'Company',
    'Phone',
    'Status',
    'Hourly Rate (USD)',
    'Active Projects',
    'Total Projects',
    'Invoiced Total (USD)',
    'Total Paid (USD)',
    'Outstanding Balance (USD)',
    'Overdue Balance (USD)',
    'Client Since',
    'Notes',
  ];

  const rows = clients.map((client) => {
    const clientProjects = projects.filter((p) => p.client_id === client.id);
    const activeProjectsCount = clientProjects.filter((p) => p.status === 'In Progress').length;
    const clientInvoices = invoices.filter((i) => i.client_id === client.id);

    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = clientInvoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const outstanding = clientInvoices
      .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = clientInvoices
      .filter((i) => i.status === 'Overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return [
      escapeCsv(client.id),
      escapeCsv(client.name),
      escapeCsv(client.email),
      escapeCsv(client.company || 'N/A'),
      escapeCsv(client.phone || 'N/A'),
      escapeCsv(client.status),
      escapeCsv(client.hourlyRate ? `$${client.hourlyRate}/hr` : 'N/A'),
      escapeCsv(activeProjectsCount),
      escapeCsv(clientProjects.length),
      escapeCsv(totalInvoiced),
      escapeCsv(totalPaid),
      escapeCsv(outstanding),
      escapeCsv(overdue),
      escapeCsv(client.createdAt || 'N/A'),
      escapeCsv(client.notes || ''),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  triggerCsvDownload(`freelancer-clients-directory-${dateStamp}.csv`, csvContent);
}

/**
 * Generates Invoices Ledger CSV
 */
export function exportInvoicesCsv(
  invoices: Invoice[],
  clients: Client[],
  projects: Project[]
): void {
  const dateStamp = getFormattedDateStamp();
  const headers = [
    'Invoice Number',
    'Client Name',
    'Client Email',
    'Project Title',
    'Amount (USD)',
    'Status',
    'Issue Date',
    'Due Date',
    'Paid Date',
    'Notes / Payment Terms',
  ];

  const rows = invoices.map((inv) => {
    const client = clients.find((c) => c.id === inv.client_id);
    const project = projects.find((p) => p.id === inv.project_id);

    return [
      escapeCsv(inv.invoice_number),
      escapeCsv(client?.name || 'Unknown Client'),
      escapeCsv(client?.email || 'N/A'),
      escapeCsv(project?.title || 'General Project'),
      escapeCsv(inv.amount),
      escapeCsv(inv.status),
      escapeCsv(inv.issue_date),
      escapeCsv(inv.due_date),
      escapeCsv(inv.paid_date || 'Pending'),
      escapeCsv(inv.notes || ''),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  triggerCsvDownload(`freelancer-invoices-${dateStamp}.csv`, csvContent);
}

/**
 * Generates Expenses Ledger CSV
 */
export function exportExpensesCsv(expenses: Expense[]): void {
  const dateStamp = getFormattedDateStamp();
  const headers = [
    'Expense ID',
    'Date',
    'Category',
    'Amount (USD)',
    'Description',
    'Vendor / Service Provider',
    'Tax Deductible',
  ];

  const rows = expenses.map((exp) => [
    escapeCsv(exp.id),
    escapeCsv(exp.date),
    escapeCsv(exp.category),
    escapeCsv(exp.amount),
    escapeCsv(exp.description),
    escapeCsv(exp.vendor || 'N/A'),
    escapeCsv(exp.isDeductible !== false ? 'Yes' : 'No'),
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  triggerCsvDownload(`freelancer-expenses-${dateStamp}.csv`, csvContent);
}

/**
 * Generates a Complete Master Financial Bundle CSV (containing all tables in structured blocks)
 */
export function exportMasterDataBundleCsv(
  metrics: FinancialMetrics,
  clients: Client[],
  projects: Project[],
  invoices: Invoice[],
  expenses: Expense[]
): void {
  const dateStamp = getFormattedDateStamp();
  const lines: string[] = [];

  // P&L Overview
  lines.push('=== 1. FINANCIAL SUMMARY & P&L OVERVIEW ===');
  lines.push('Metric,Value (USD)');
  lines.push(`Gross Revenue Collected,${escapeCsv(metrics.grossRevenue)}`);
  lines.push(`Total Operating Expenses,${escapeCsv(metrics.totalExpenses)}`);
  lines.push(`Net Freelance Profit,${escapeCsv(metrics.netProfit)}`);
  lines.push(`Profit Margin Percentage,${escapeCsv(metrics.profitMarginPercent + '%')}`);
  lines.push(`Quarterly Tax Reserve Provision,${escapeCsv(metrics.taxReserveAmount)}`);
  lines.push(`Pending Invoices,${escapeCsv(metrics.pendingRevenue)}`);
  lines.push(`Overdue Invoices,${escapeCsv(metrics.overdueRevenue)}`);
  lines.push('');

  // Clients
  lines.push('=== 2. CLIENT ACCOUNTS ===');
  lines.push('Client ID,Client Name,Email,Company,Phone,Status,Hourly Rate,Notes');
  clients.forEach((c) => {
    lines.push([
      escapeCsv(c.id),
      escapeCsv(c.name),
      escapeCsv(c.email),
      escapeCsv(c.company || 'N/A'),
      escapeCsv(c.phone || 'N/A'),
      escapeCsv(c.status),
      escapeCsv(c.hourlyRate ? `$${c.hourlyRate}/hr` : 'N/A'),
      escapeCsv(c.notes || ''),
    ].join(','));
  });
  lines.push('');

  // Projects
  lines.push('=== 3. PROJECTS & MILESTONES ===');
  lines.push('Project ID,Client Name,Title,Status,Deadline,Budget (USD),Progress (%)');
  projects.forEach((p) => {
    const client = clients.find((c) => c.id === p.client_id)?.name || 'Unknown';
    lines.push([
      escapeCsv(p.id),
      escapeCsv(client),
      escapeCsv(p.title),
      escapeCsv(p.status),
      escapeCsv(p.deadline),
      escapeCsv(p.budget ?? 0),
      escapeCsv((p.progressPercent ?? 0) + '%'),
    ].join(','));
  });
  lines.push('');

  // Invoices
  lines.push('=== 4. INVOICES & RECEIVABLES ===');
  lines.push('Invoice #,Client Name,Project,Amount (USD),Status,Issue Date,Due Date,Paid Date,Notes');
  invoices.forEach((inv) => {
    const client = clients.find((c) => c.id === inv.client_id)?.name || 'Unknown';
    const project = projects.find((p) => p.id === inv.project_id)?.title || 'General';
    lines.push([
      escapeCsv(inv.invoice_number),
      escapeCsv(client),
      escapeCsv(project),
      escapeCsv(inv.amount),
      escapeCsv(inv.status),
      escapeCsv(inv.issue_date),
      escapeCsv(inv.due_date),
      escapeCsv(inv.paid_date || 'Pending'),
      escapeCsv(inv.notes || ''),
    ].join(','));
  });
  lines.push('');

  // Expenses
  lines.push('=== 5. BUSINESS EXPENSES & DEDUCTIONS ===');
  lines.push('Expense ID,Date,Category,Amount (USD),Description,Vendor,Deductible');
  expenses.forEach((exp) => {
    lines.push([
      escapeCsv(exp.id),
      escapeCsv(exp.date),
      escapeCsv(exp.category),
      escapeCsv(exp.amount),
      escapeCsv(exp.description),
      escapeCsv(exp.vendor || 'N/A'),
      escapeCsv(exp.isDeductible !== false ? 'Yes' : 'No'),
    ].join(','));
  });

  const csvContent = lines.join('\n');
  triggerCsvDownload(`freelancer-complete-finance-bundle-${dateStamp}.csv`, csvContent);
}
