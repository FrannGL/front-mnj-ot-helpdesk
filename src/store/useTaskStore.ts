import type { Task } from 'src/modules/tasks/interfaces';

import { useMemo } from 'react';
import { create } from 'zustand';

import { TaskStatus, TaskPriority } from 'src/modules/tasks/enums';

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
    updateTask: (id: number, updates: Partial<Task>) => void;
    setFilters: (filters: Partial<TaskFilters>) => void;
    resetFilters: () => void;
    setSelectedTask: (task: Task | null) => void;
    getTaskById: (id: number) => Task | undefined;
  };
}

const applyFilters = (tasks: Task[], filters: TaskFilters): Task[] =>
  tasks.filter((task) => {
    const searchTerm = filters.searchTerm?.toLowerCase() || '';

    const matchesStatus = !filters.status || task.estado === filters.status;
    const matchesPriority = !filters.priority || task.prioridad === filters.priority;
    const matchesAssignedTo =
      !filters.assignedTo || task.agentes.some((agente) => agente.username === filters.assignedTo);

    const matchesSearch =
      !searchTerm ||
      task.titulo.toLowerCase().includes(searchTerm) ||
      task.agentes.some(
        (agente) =>
          agente.username.toLowerCase().includes(searchTerm) ||
          agente.username?.toLowerCase().includes(searchTerm)
      ) ||
      Object.entries(TaskPriority)
        .find(([key, value]) => value === task.prioridad)?.[0]
        .toLowerCase()
        .includes(searchTerm) ||
      Object.entries(TaskStatus)
        .find(([key, value]) => value === task.estado)?.[0]
        .toLowerCase()
        .includes(searchTerm);

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
