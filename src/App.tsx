import React, { useState, useEffect, useMemo } from 'react';
import {
  ActiveTab,
  Client,
  Project,
  Invoice,
  Expense,
  TaxChecklistItem,
  InvoiceStatus,
  ProjectStatus,
} from './types';
import {
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_TAX_CHECKLIST,
} from './mockData';
import { calculateMetrics } from './utils/calculations';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ClientsProjectsView } from './components/ClientsProjectsView';
import { InvoicesView } from './components/InvoicesView';
import { ExpensesProfitView } from './components/ExpensesProfitView';
import { TaxChecklistView } from './components/TaxChecklistView';
import { AIInsightsView } from './components/AIInsightsView';
import { InvoicePreviewModal } from './components/InvoicePreviewModal';
import { AddEditClientModal } from './components/AddEditClientModal';
import { AddEditProjectModal } from './components/AddEditProjectModal';
import { AddEditInvoiceModal } from './components/AddEditInvoiceModal';
import { AddEditExpenseModal } from './components/AddEditExpenseModal';

const STORAGE_KEYS = {
  CLIENTS: 'ff_os_clients_v1',
  PROJECTS: 'ff_os_projects_v1',
  INVOICES: 'ff_os_invoices_v1',
  EXPENSES: 'ff_os_expenses_v1',
  TAX_CHECKLIST: 'ff_os_tax_checklist_v1',
  TAX_RATE: 'ff_os_tax_rate_v1',
};

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Core Data States with LocalStorage Persistence
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [taxChecklist, setTaxChecklist] = useState<TaxChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TAX_CHECKLIST);
      return saved ? JSON.parse(saved) : INITIAL_TAX_CHECKLIST;
    } catch {
      return INITIAL_TAX_CHECKLIST;
    }
  });

  const [taxRatePercent, setTaxRatePercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TAX_RATE);
      return saved ? Number(saved) : 28;
    } catch {
      return 28;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.error(e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TAX_CHECKLIST, JSON.stringify(taxChecklist));
    } catch (e) {
      console.error(e);
    }
  }, [taxChecklist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TAX_RATE, String(taxRatePercent));
    } catch (e) {
      console.error(e);
    }
  }, [taxRatePercent]);

  // Real-time recalculated metrics
  const metrics = useMemo(() => {
    return calculateMetrics(invoices, expenses, taxChecklist, taxRatePercent);
  }, [invoices, expenses, taxChecklist, taxRatePercent]);

  // Modals & Active Edit Entities
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  // Generate next sequential invoice number
  const nextInvoiceNumber = useMemo(() => {
    const prefix = 'INV-2026-';
    const existingNumbers = invoices
      .map((i) => {
        const match = i.invoice_number.match(/INV-2026-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNum = maxNum + 1;
    return `${prefix}${String(nextNum).padStart(3, '0')}`;
  }, [invoices]);

  // Reset demo data handler
  const handleResetData = () => {
    if (window.confirm('Reset all financial records and projects back to initial demo data?')) {
      setClients(INITIAL_CLIENTS);
      setProjects(INITIAL_PROJECTS);
      setInvoices(INITIAL_INVOICES);
      setExpenses(INITIAL_EXPENSES);
      setTaxChecklist(INITIAL_TAX_CHECKLIST);
      setTaxRatePercent(28);
      localStorage.clear();
    }
  };

  // --- CRUD Handlers: Clients ---
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...clientData } : c))
      );
    } else {
      const newClient: Client = {
        id: `c-${Date.now()}`,
        ...clientData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients((prev) => [newClient, ...prev]);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Delete this client? Associated projects and invoices will remain.')) {
      setClients((prev) => prev.filter((c) => c.id !== clientId));
    }
  };

  // --- CRUD Handlers: Projects ---
  const handleSaveProject = (projectData: Omit<Project, 'id'>, id?: string) => {
    if (id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...projectData } : p))
      );
    } else {
      const newProject: Project = {
        id: `p-${Date.now()}`,
        ...projectData,
      };
      setProjects((prev) => [newProject, ...prev]);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Delete this project milestone?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const handleUpdateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status,
              progressPercent: status === 'Completed' ? 100 : p.progressPercent,
              completedAt: status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
            }
          : p
      )
    );
  };

  // --- CRUD Handlers: Invoices ---
  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id'>, id?: string) => {
    if (id) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, ...invoiceData } : inv))
      );
    } else {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        ...invoiceData,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    }
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Delete this invoice?')) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    }
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status,
              paid_date: status === 'Paid' ? new Date().toISOString().split('T')[0] : inv.paid_date,
            }
          : inv
      )
    );
  };

  // --- CRUD Handlers: Expenses ---
  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>, id?: string) => {
    if (id) {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, ...expenseData } : exp))
      );
    } else {
      const newExpense: Expense = {
        id: `exp-${Date.now()}`,
        ...expenseData,
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Delete this business expense?')) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
    }
  };

  // --- Tax Checklist Handlers ---
  const handleToggleTaxItem = (id: string) => {
    setTaxChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddCustomWriteOff = (item: Omit<TaxChecklistItem, 'id'>) => {
    const newItem: TaxChecklistItem = {
      id: `tax-${Date.now()}`,
      ...item,
    };
    setTaxChecklist((prev) => [...prev, newItem]);
  };

  // Client and Project lookup for preview modal
  const previewClient = previewInvoice
    ? clients.find((c) => c.id === previewInvoice.client_id)
    : undefined;
  const previewProject = previewInvoice
    ? projects.find((p) => p.id === previewInvoice.project_id)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        onResetData={handleResetData}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="flex flex-1 flex-col lg:pl-72 w-full min-w-0">
        <Navbar
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          metrics={metrics}
          onOpenAddInvoice={() => {
            setInvoiceToEdit(null);
            setIsAddInvoiceOpen(true);
          }}
          onOpenAddExpense={() => {
            setExpenseToEdit(null);
            setIsAddExpenseOpen(true);
          }}
          onOpenAddClient={() => {
            setClientToEdit(null);
            setIsAddClientOpen(true);
          }}
          onOpenAddProject={() => {
            setProjectToEdit(null);
            setIsAddProjectOpen(true);
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              clients={clients}
              projects={projects}
              invoices={invoices}
              expenses={expenses}
              setActiveTab={setActiveTab}
              onOpenAddInvoice={() => {
                setInvoiceToEdit(null);
                setIsAddInvoiceOpen(true);
              }}
              onOpenAddExpense={() => {
                setExpenseToEdit(null);
                setIsAddExpenseOpen(true);
              }}
            />
          )}

          {activeTab === 'clients-projects' && (
            <ClientsProjectsView
              clients={clients}
              projects={projects}
              invoices={invoices}
              onOpenAddClient={() => {
                setClientToEdit(null);
                setIsAddClientOpen(true);
              }}
              onEditClient={(client) => {
                setClientToEdit(client);
                setIsAddClientOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              onOpenAddProject={() => {
                setProjectToEdit(null);
                setIsAddProjectOpen(true);
              }}
              onEditProject={(project) => {
                setProjectToEdit(project);
                setIsAddProjectOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              onUpdateProjectStatus={handleUpdateProjectStatus}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              clients={clients}
              projects={projects}
              onOpenAddInvoice={() => {
                setInvoiceToEdit(null);
                setIsAddInvoiceOpen(true);
              }}
              onEditInvoice={(invoice) => {
                setInvoiceToEdit(invoice);
                setIsAddInvoiceOpen(true);
              }}
              onDeleteInvoice={handleDeleteInvoice}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
              onPreviewInvoice={(invoice) => setPreviewInvoice(invoice)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesProfitView
              expenses={expenses}
              metrics={metrics}
              taxRatePercent={taxRatePercent}
              setTaxRatePercent={setTaxRatePercent}
              onOpenAddExpense={() => {
                setExpenseToEdit(null);
                setIsAddExpenseOpen(true);
              }}
              onEditExpense={(expense) => {
                setExpenseToEdit(expense);
                setIsAddExpenseOpen(true);
              }}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'tax-checklist' && (
            <TaxChecklistView
              taxChecklist={taxChecklist}
              metrics={metrics}
              onToggleChecklistItem={handleToggleTaxItem}
              onAddCustomWriteOff={handleAddCustomWriteOff}
            />
          )}

          {activeTab === 'ai-insights' && (
            <AIInsightsView
              metrics={metrics}
              invoices={invoices}
              expenses={expenses}
              clients={clients}
            />
          )}
        </main>
      </div>

      {/* Printable Invoice Preview Modal */}
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          client={previewClient}
          project={previewProject}
          onClose={() => setPreviewInvoice(null)}
          onMarkPaid={(id) => {
            handleUpdateInvoiceStatus(id, 'Paid');
            setPreviewInvoice(null);
          }}
        />
      )}

      {/* Add / Edit Client Modal */}
      <AddEditClientModal
        isOpen={isAddClientOpen}
        onClose={() => {
          setIsAddClientOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />

      {/* Add / Edit Project Modal */}
      <AddEditProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => {
          setIsAddProjectOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        clients={clients}
      />

      {/* Add / Edit Invoice Modal */}
      <AddEditInvoiceModal
        isOpen={isAddInvoiceOpen}
        onClose={() => {
          setIsAddInvoiceOpen(false);
          setInvoiceToEdit(null);
        }}
        onSave={handleSaveInvoice}
        invoiceToEdit={invoiceToEdit}
        clients={clients}
        projects={projects}
        nextInvoiceNumber={nextInvoiceNumber}
      />

      {/* Add / Edit Expense Modal */}
      <AddEditExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setExpenseToEdit(null);
        }}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
}
