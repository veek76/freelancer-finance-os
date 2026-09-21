import {
  Client,
  Expense,
  ExpenseCategory,
  Invoice,
  FinancialMetrics,
  CategoryBreakdown,
  TaxChecklistItem,
  AIInsight,
} from '../types';

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Software: '#3b82f6',     // Blue
  Internet: '#06b6d4',     // Cyan
  Advertising: '#8b5cf6',  // Purple
  Equipment: '#f59e0b',    // Amber
  Travel: '#10b981',       // Emerald
  Other: '#64748b',        // Slate
};

export function calculateMetrics(
  invoices: Invoice[],
  expenses: Expense[],
  taxChecklist: TaxChecklistItem[],
  taxRatePercent: number = 28
): FinancialMetrics {
  // Gross Revenue: Sum of Paid Invoices
  const grossRevenue = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Pending (Sent) Revenue
  const pendingRevenue = invoices
    .filter((inv) => inv.status === 'Sent')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Overdue Revenue
  const overdueRevenue = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Draft Revenue
  const draftRevenue = invoices
    .filter((inv) => inv.status === 'Draft')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Total Business Expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Net Profit = Gross Revenue - Total Expenses
  const netProfit = grossRevenue - totalExpenses;

  // Profit Margin % = (Net Profit / Gross Revenue) * 100
  const profitMarginPercent =
    grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;

  // Recommended quarterly tax set-aside
  const taxReserveAmount =
    netProfit > 0 ? Math.round(netProfit * (taxRatePercent / 100)) : 0;

  // Total tracked write-offs from checked checklist items
  const totalTrackedWriteOffs = taxChecklist
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.estimatedAnnualDeduction, 0);

  // Estimated tax savings from deductions (bracket savings)
  const estimatedTaxSavings = Math.round(
    totalTrackedWriteOffs * (taxRatePercent / 100)
  );

  return {
    grossRevenue,
    pendingRevenue,
    overdueRevenue,
    draftRevenue,
    totalExpenses,
    netProfit,
    profitMarginPercent,
    taxReserveAmount,
    taxRatePercent,
    totalTrackedWriteOffs,
    estimatedTaxSavings,
  };
}

export function calculateCategoryBreakdowns(expenses: Expense[]): CategoryBreakdown[] {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categories: ExpenseCategory[] = [
    'Software',
    'Equipment',
    'Advertising',
    'Internet',
    'Travel',
    'Other',
  ];

  return categories
    .map((cat) => {
      const amount = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage =
        totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
      return {
        category: cat,
        amount,
        percentage,
        color: CATEGORY_COLORS[cat],
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function generateAutomatedAIInsights(
  metrics: FinancialMetrics,
  invoices: Invoice[],
  expenses: Expense[],
  clients: Client[]
): AIInsight[] {
  const insights: AIInsight[] = [];
  const categoryBreakdown = calculateCategoryBreakdowns(expenses);
  const softwareItem = categoryBreakdown.find((c) => c.category === 'Software');
  const softwarePercent = softwareItem ? softwareItem.percentage : 0;

  // 1. Profit Margin Insight (Required by prompt)
  if (metrics.profitMarginPercent >= 70) {
    insights.push({
      id: 'ai-profit-margin',
      type: 'metric',
      title: 'Strong Operating Margin',
      content: `Your profit margin is currently at ${metrics.profitMarginPercent}%—exceptionally healthy for a freelance digital services business. Your low overhead ratio gives you pricing leverage.`,
      actionableStep: 'Consider allocating a portion of surplus cash into a 6-month operating buffer or retirement SEP-IRA.',
      badge: `${metrics.profitMarginPercent}% Margin`,
      priority: 'high',
    });
  } else if (metrics.profitMarginPercent >= 40) {
    insights.push({
      id: 'ai-profit-margin',
      type: 'metric',
      title: 'Healthy Profit Margin',
      content: `Your profit margin is currently at ${metrics.profitMarginPercent}%—healthy for a service-based business with active software and equipment investments.`,
      actionableStep: 'Keep monitoring recurring tool costs to ensure margins stay resilient as you scale client volume.',
      badge: `${metrics.profitMarginPercent}% Margin`,
      priority: 'medium',
    });
  } else {
    insights.push({
      id: 'ai-profit-margin',
      type: 'warning',
      title: 'Compressed Margin Alert',
      content: `Your profit margin is currently at ${metrics.profitMarginPercent}%. Operating costs are cutting deeply into gross client billings.`,
      actionableStep: 'Review hardware purchases and raise baseline project day-rates on upcoming proposals.',
      badge: 'Margin Warning',
      priority: 'high',
    });
  }

  // 2. Software Subscriptions Insight (Required by prompt)
  if (softwareItem && softwarePercent > 0) {
    insights.push({
      id: 'ai-software-expenses',
      type: softwarePercent > 25 ? 'warning' : 'tip',
      title: 'Software & Cloud Spend Audit',
      content: `Software represents ${softwarePercent}% ($${softwareItem.amount.toLocaleString()}) of your total expenses. Review unused subscriptions and seat licenses across design and development stacks.`,
      actionableStep: 'Audit monthly SaaS line items to cancel inactive tool seats or switch to annual billings for 15-20% discounts.',
      badge: `${softwarePercent}% of Spend`,
      priority: softwarePercent > 25 ? 'high' : 'medium',
    });
  }

  // 3. Overdue Invoices Insight (Required by prompt)
  if (metrics.overdueRevenue > 0) {
    const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;
    const overdueClientIds = Array.from(
      new Set(invoices.filter((i) => i.status === 'Overdue').map((i) => i.client_id))
    );
    const clientNames = overdueClientIds
      .map((id) => clients.find((c) => c.id === id)?.name || 'Client')
      .join(', ');

    insights.push({
      id: 'ai-overdue-invoices',
      type: 'warning',
      title: 'Overdue Receivables Action Required',
      content: `You have $${metrics.overdueRevenue.toLocaleString()} in overdue invoices across ${overdueCount} invoice(s) awaiting follow-up (${clientNames}).`,
      actionableStep: 'Dispatch a polite payment reminder email with an instant ACH/card link, and pause downstream deliverables if terms are breached.',
      badge: `$${metrics.overdueRevenue.toLocaleString()} Past Due`,
      priority: 'high',
    });
  } else {
    insights.push({
      id: 'ai-overdue-invoices-clear',
      type: 'metric',
      title: 'Pristine Accounts Receivable',
      content: 'Zero overdue balances! All active client accounts are either settled or within standard net-14 payment windows.',
      actionableStep: 'Maintain your current cadence of automated invoices and milestone-based deposit billing.',
      badge: 'All Current',
      priority: 'low',
    });
  }

  // 4. Client Concentration Insight
  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid');
  if (paidInvoices.length > 0 && metrics.grossRevenue > 0) {
    const revenueByClient: Record<string, number> = {};
    paidInvoices.forEach((inv) => {
      revenueByClient[inv.client_id] = (revenueByClient[inv.client_id] || 0) + inv.amount;
    });

    let topClientId = '';
    let topClientRevenue = 0;
    Object.entries(revenueByClient).forEach(([cid, rev]) => {
      if (rev > topClientRevenue) {
        topClientRevenue = rev;
        topClientId = cid;
      }
    });

    const topClient = clients.find((c) => c.id === topClientId);
    const topClientShare = Math.round((topClientRevenue / metrics.grossRevenue) * 100);

    if (topClientShare >= 40 && topClient) {
      insights.push({
        id: 'ai-client-concentration',
        type: 'opportunity',
        title: 'Client Concentration Risk',
        content: `${topClient.name} accounts for ${topClientShare}% ($${topClientRevenue.toLocaleString()}) of your historical collected revenue. While a great anchor account, relying heavily on one client creates pipeline vulnerability.`,
        actionableStep: 'Dedicate 4 hours per week toward outbound marketing or proposal pitching to bring on a secondary anchor retainer.',
        badge: `${topClientShare}% Concentration`,
        priority: 'medium',
      });
    }
  }

  // 5. Quarterly Tax Cushion
  insights.push({
    id: 'ai-tax-buffer',
    type: 'tip',
    title: 'Estimated Tax Reserve Check',
    content: `Based on your net earnings of $${metrics.netProfit.toLocaleString()}, your recommended quarterly tax set-aside is $${metrics.taxReserveAmount.toLocaleString()} (${metrics.taxRatePercent}% rate). Keeping this in a high-yield savings account avoids surprise tax liabilities.`,
    actionableStep: 'Transfer $500–$1,000 every time a client invoice is paid directly to your designated business tax account.',
    badge: `$${metrics.taxReserveAmount.toLocaleString()} Reserve`,
    priority: 'medium',
  });

  return insights;
}

export function answerFreelanceFinancialQuery(
  query: string,
  metrics: FinancialMetrics,
  invoices: Invoice[],
  expenses: Expense[],
  clients: Client[]
): string {
  const q = query.toLowerCase();

  if (q.includes('profit') || q.includes('margin') || q.includes('how much did i make')) {
    return `Your net profit stands at $${metrics.netProfit.toLocaleString()} from $${metrics.grossRevenue.toLocaleString()} in paid client revenue and $${metrics.totalExpenses.toLocaleString()} in operating expenses. That gives you a solid profit margin of ${metrics.profitMarginPercent}%. To increase this further, focus on value-based project fees rather than billable hourly rates.`;
  }

  if (q.includes('tax') || q.includes('write-off') || q.includes('deduct') || q.includes('irs')) {
    return `At your current ${metrics.taxRatePercent}% estimated tax rate, you should have approximately $${metrics.taxReserveAmount.toLocaleString()} set aside for federal and state self-employment taxes. You currently track $${metrics.totalTrackedWriteOffs.toLocaleString()} in qualified deductions, potentially saving you $${metrics.estimatedTaxSavings.toLocaleString()} in annual taxes! Check the Tax Checklist tab to ensure you're claiming Home Office, Equipment Depreciation, and Software.`;
  }

  if (q.includes('overdue') || q.includes('unpaid') || q.includes('late') || q.includes('invoice')) {
    if (metrics.overdueRevenue > 0) {
      return `You currently have $${metrics.overdueRevenue.toLocaleString()} in overdue invoices awaiting settlement. In addition, there is $${metrics.pendingRevenue.toLocaleString()} in active sent invoices nearing their due dates. I recommend setting up automated 3-day polite reminders before due dates and requiring a 50% upfront deposit on future projects.`;
    }
    return `Great news! You have $0 in overdue invoices. You do have $${metrics.pendingRevenue.toLocaleString()} in sent invoices currently pending. Keep following up 3 days before the scheduled due dates to maintain this record.`;
  }

  if (q.includes('expense') || q.includes('software') || q.includes('spend') || q.includes('cost')) {
    const categoryBreakdown = calculateCategoryBreakdowns(expenses);
    const topCategory = categoryBreakdown[0];
    return `Your total business expenses are $${metrics.totalExpenses.toLocaleString()}. Your largest spend category is ${topCategory?.category || 'Equipment'} at $${topCategory?.amount.toLocaleString()} (${topCategory?.percentage}% of total). Audit any recurring SaaS subscriptions you haven't opened in 30 days to lean out your monthly burn rate.`;
  }

  if (q.includes('rate') || q.includes('raise') || q.includes('price') || q.includes('pricing')) {
    return `With an operating margin of ${metrics.profitMarginPercent}% and consistent project flow, you have strong pricing power. When pitching your next client, quote 15–20% higher or package your services as fixed-price outcome deliverables (e.g. Design Systems, MVP Sprints) instead of hourly rates to capture more value.`;
  }

  if (q.includes('risk') || q.includes('diversif') || q.includes('client')) {
    const paidInvoices = invoices.filter((i) => i.status === 'Paid');
    const clientCounts = clients.filter((c) => c.status === 'Active').length;
    return `You have ${clientCounts} active clients and ${paidInvoices.length} settled invoices. The primary risk to watch in freelance consulting is anchor-client dependency: always ensure no single client represents more than 40% of your total annual billings, and maintain a 3-month living expense buffer.`;
  }

  return `Based on your live figures: Gross Revenue is $${metrics.grossRevenue.toLocaleString()}, Total Expenses are $${metrics.totalExpenses.toLocaleString()}, producing a Net Profit of $${metrics.netProfit.toLocaleString()} (${metrics.profitMarginPercent}% margin). You also have $${metrics.pendingRevenue.toLocaleString()} in receivables in flight. Your financial fundamentals are resilient; focus on closing pending milestones and keeping your quarterly tax reserve funded!`;
}
