import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Briefcase, Calendar, DollarSign, Percent } from 'lucide-react';
import { Client, Project, ProjectStatus } from '../types';

interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>, id?: string) => void;
  projectToEdit?: Project | null;
  clients: Client[];
}

export const AddEditProjectModal: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
  clients,
}) => {
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [progressPercent, setProgressPercent] = useState('50');

  useEffect(() => {
    if (projectToEdit) {
      setClientId(projectToEdit.client_id);
      setTitle(projectToEdit.title);
      setStatus(projectToEdit.status);
      setDeadline(projectToEdit.deadline);
      setBudget(projectToEdit.budget ? String(projectToEdit.budget) : '');
      setDescription(projectToEdit.description || '');
      setProgressPercent(String(projectToEdit.progressPercent ?? 50));
    } else {
      setClientId(clients[0]?.id || '');
      setTitle('');
      setStatus('In Progress');
      // default deadline 30 days ahead
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      setDeadline(nextMonth.toISOString().split('T')[0]);
      setBudget('5000');
      setDescription('');
      setProgressPercent('25');
    }
  }, [projectToEdit, isOpen, clients]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId || !deadline) return;

    onSave(
      {
        client_id: clientId,
        title,
        status,
        deadline,
        budget: budget ? Number(budget) : undefined,
        description: description.trim() || undefined,
        progressPercent: Number(progressPercent),
        completedAt: status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
      },
      projectToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FolderPlus className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {projectToEdit ? 'Edit Project Milestone' : 'Add New Project'}
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
                Client *
              </label>
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value as ProjectStatus;
                  setStatus(newStatus);
                  if (newStatus === 'Completed') setProgressPercent('100');
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Design System & Component Library v2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deadline Date *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Budget / Contract Value ($)
              </label>
              <input
                type="number"
                min="0"
                placeholder="4500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Milestone Progress ({progressPercent}%)
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressPercent}
              onChange={(e) => setProgressPercent(e.target.value)}
              className="w-full h-1.5 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deliverables & Description
            </label>
            <textarea
              rows={2}
              placeholder="Scope details, acceptance criteria, or key milestones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
