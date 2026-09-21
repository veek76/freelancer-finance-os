export type ClientStatus = 'Active' | 'Inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  company?: string;
  phone?: string;
  hourlyRate?: number;
  notes?: string;
  createdAt: string;
}

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Project {
  id: string;
  client_id: string;
  title: string;
  status: ProjectStatus;
  deadline: string;
  budget?: number;
  description?: string;
  progressPercent?: number;
  completedAt?: string;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  project_id: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  issue_date: string;
  paid_date?: string;
  notes?: string;
}

export type ExpenseCategory =
  | 'Software'
  | 'Internet'
  | 'Advertising'
  | 'Equipment'
  | 'Travel'
  | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  isDeductible?: boolean;
  vendor?: string;
}

export interface TaxChecklistItem {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedAnnualDeduction: number;
  checked: boolean;
  tips: string;
  documentationRequired: string;
}

export interface FinancialMetrics {
  grossRevenue: number;       // Paid invoices
  pendingRevenue: number;     // Sent invoices
  overdueRevenue: number;     // Overdue invoices
  draftRevenue: number;       // Draft invoices
  totalExpenses: number;      // Total business expenses
  netProfit: number;          // Gross Revenue - Total Expenses
  profitMarginPercent: number;// (Net Profit / Gross Revenue) * 100
  taxReserveAmount: number;   // Recommended quarterly tax set-aside (e.g. 25-30%)
  taxRatePercent: number;     // Configurable tax rate
  totalTrackedWriteOffs: number;
  estimatedTaxSavings: number;
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface ClientRevenueBreakdown {
  clientId: string;
  clientName: string;
  totalBilled: number;
  percentageOfRevenue: number;
}

export interface AIInsight {
  id: string;
  type: 'metric' | 'warning' | 'tip' | 'opportunity';
  title: string;
  content: string;
  actionableStep?: string;
  badge?: string;
  priority: 'high' | 'medium' | 'low';
}

export type ActiveTab =
  | 'dashboard'
  | 'clients-projects'
  | 'invoices'
  | 'expenses'
  | 'tax-checklist'
  | 'ai-insights';
