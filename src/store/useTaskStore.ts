import type { Task } from 'src/modules/tasks/interfaces';
import type { TaskStatus, TaskPriority } from 'src/modules/tasks/enums';

import { useMemo } from 'react';
import { create } from 'zustand';

export interface TaskFilters {
  status: TaskStatus | null;
  priority: TaskPriority | null;
  assignedTo: string | null;
  searchTerm?: string;
}

interface TaskStoreState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  actions: {
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    setFilters: (filters: Partial<TaskFilters>) => void;
    resetFilters: () => void;
    setSelectedTask: (task: Task | null) => void;
    getTaskById: (id: string) => Task | undefined;
  };
}

const applyFilters = (tasks: Task[], filters: TaskFilters): Task[] =>
  tasks.filter((task) => {
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesAssignedTo = !filters.assignedTo || task.assignedTo === filters.assignedTo;
    const matchesSearch =
      !filters.searchTerm ||
      task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch;
  });

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  filters: {
    status: null,
    priority: null,
    assignedTo: null,
    searchTerm: '',
  },
  selectedTask: null,
  actions: {
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updates) =>
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
      })),
    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
    resetFilters: () =>
      set({
        filters: { status: null, priority: null, assignedTo: null, searchTerm: '' },
      }),
    getTaskById: (id) => get().tasks.find((task) => task.id === id),
    setSelectedTask: (task) => set({ selectedTask: task }),
  },
}));

export const useTasks = () => useTaskStore((state) => state.tasks);
export const useFilters = () => useTaskStore((state) => state.filters);
export const useSelectedTask = () => useTaskStore((state) => state.selectedTask);
export const useFilteredTasks = () => {
  const tasks = useTasks();
  const filters = useFilters();

  return useMemo(() => applyFilters(tasks, filters), [tasks, filters]);
};
export const useTaskActions = () => useTaskStore((state) => state.actions);
