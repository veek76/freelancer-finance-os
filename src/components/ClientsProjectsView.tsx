import React, { useState } from 'react';
import {
  Users,
  FolderPlus,
  UserPlus,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Client, Project, Invoice } from '../types';

interface ClientsProjectsViewProps {
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  onOpenAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProjectStatus: (projectId: string, status: Project['status']) => void;
}

export const ClientsProjectsView: React.FC<ClientsProjectsViewProps> = ({
  clients,
  projects,
  invoices,
  onOpenAddClient,
  onEditClient,
  onDeleteClient,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  onUpdateProjectStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'clients' | 'projects'>('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'All' | 'Not Started' | 'In Progress' | 'Completed'>('All');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = projectStatusFilter === 'All' || p.status === projectStatusFilter;
    const matchesClient = selectedClientId === 'all' || p.client_id === selectedClientId;
    return matchesStatus && matchesClient;
  });

  const getClientBilledAmount = (clientId: string) => {
    return invoices
      .filter((inv) => inv.client_id === clientId && inv.status === 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getClientPendingAmount = (clientId: string) => {
    return invoices
      .filter((inv) => inv.client_id === clientId && (inv.status === 'Sent' || inv.status === 'Overdue'))
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getClientProjects = (clientId: string) => {
    return projects.filter((p) => p.client_id === clientId);
  };

  return (
    <div className="space-y-6">
      {/* Top action header & sub-tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('clients')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'clients'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveSubTab('projects')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'projects'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Projects ({projects.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-client-btn"
            onClick={onOpenAddClient}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <UserPlus className="h-4 w-4 text-slate-600" />
            <span>Add Client</span>
          </button>
          <button
            id="add-project-btn"
            onClick={onOpenAddProject}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Clients Section */}
      {(activeSubTab === 'all' || activeSubTab === 'clients') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-slate-700" />
              Client Directory
            </h3>
            <span className="text-xs text-slate-500">
              {clients.filter((c) => c.status === 'Active').length} Active Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {clients.map((client) => {
              const clientProjects = getClientProjects(client.id);
              const totalBilled = getClientBilledAmount(client.id);
              const pendingBilled = getClientPendingAmount(client.id);
              const activeCount = clientProjects.filter((p) => p.status === 'In Progress').length;

              return (
                <div
                  key={client.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-sm">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{client.name}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              client.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {client.status}
                          </span>
                        </div>
                        {client.company && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-slate-400" />
                            {client.company}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditClient(client)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="Edit Client"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteClient(client.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete Client"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {client.email}
                    </span>
                    {client.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {client.phone}
                      </span>
                    )}
                    {client.hourlyRate && (
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                        ${client.hourlyRate}/hr
                      </span>
                    )}
                  </div>

                  {/* Financial Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Paid Billed</div>
                      <div className="text-xs font-bold text-slate-900">
                        ${totalBilled.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Receivables</div>
                      <div className="text-xs font-bold text-amber-600">
                        ${pendingBilled.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Projects</div>
                      <div className="text-xs font-bold text-slate-900">
                        {activeCount} active / {clientProjects.length}
                      </div>
                    </div>
                  </div>

                  {/* Associated Projects pill preview */}
                  {clientProjects.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Associated Projects
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {clientProjects.map((p) => (
                          <span
                            key={p.id}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.status === 'Completed'
                                  ? 'bg-emerald-500'
                                  : p.status === 'In Progress'
                                  ? 'bg-blue-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {p.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {(activeSubTab === 'all' || activeSubTab === 'projects') && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-slate-700" />
                Project Milestone Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Live statuses, deadlines, and deliverable completion rates
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-emerald-500"
              >
                <option value="all">All Clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
                {(['All', 'In Progress', 'Completed', 'Not Started'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setProjectStatusFilter(status)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition ${
                      projectStatusFilter === status
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const client = clients.find((c) => c.id === project.client_id);
              const progress = project.progressPercent || (project.status === 'Completed' ? 100 : 25);
              const isOverdue =
                project.status !== 'Completed' &&
                new Date(project.deadline).getTime() < new Date().getTime();

              return (
                <div
                  key={project.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                        {client?.name || 'Client'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditProject(project)}
                          className="rounded-md p-1 text-slate-400 hover:text-slate-700 transition"
                          title="Edit Project"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="rounded-md p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-slate-900 line-clamp-2">
                      {project.title}
                    </h4>

                    {project.description && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                    {/* Status & Deadline */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={project.status}
                          onChange={(e) =>
                            onUpdateProjectStatus(project.id, e.target.value as Project['status'])
                          }
                          className={`rounded-md px-2 py-0.5 text-xs font-semibold cursor-pointer border ${
                            project.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : project.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div
                        className={`flex items-center gap-1 font-medium ${
                          isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{project.deadline}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Milestone Progress</span>
                        <span className="font-semibold text-slate-700">{progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            project.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    {project.budget && (
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                        <span>Budget</span>
                        <span className="font-bold text-slate-900">
                          ${project.budget.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
