import { Search } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import type { TaskFilters as TaskFiltersType } from '@/types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
}

export function TaskFiltersBar({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <Select
        label="Status"
        value={filters.status || ''}
        onChange={(e) =>
          onChange({
            ...filters,
            status: (e.target.value || undefined) as TaskFiltersType['status'],
          })
        }
        options={[
          { value: '', label: 'All statuses' },
          { value: 'TODO', label: 'To Do' },
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'COMPLETED', label: 'Completed' },
        ]}
        className="sm:w-40"
      />

      <Select
        label="Sort by"
        value={filters.sortBy || 'createdAt'}
        onChange={(e) =>
          onChange({
            ...filters,
            sortBy: e.target.value as TaskFiltersType['sortBy'],
          })
        }
        options={[
          { value: 'createdAt', label: 'Created date' },
          { value: 'dueDate', label: 'Due date' },
          { value: 'priority', label: 'Priority' },
        ]}
        className="sm:w-40"
      />

      <Select
        label="Order"
        value={filters.sortOrder || 'desc'}
        onChange={(e) =>
          onChange({
            ...filters,
            sortOrder: e.target.value as 'asc' | 'desc',
          })
        }
        options={[
          { value: 'desc', label: 'Descending' },
          { value: 'asc', label: 'Ascending' },
        ]}
        className="sm:w-36"
      />
    </div>
  );
}
