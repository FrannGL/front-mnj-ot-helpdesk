import type { User } from 'src/modules/users/interfaces';

import { useState } from 'react';

import { useFilters, useTaskActions } from 'src/store/useTaskStore';

import { TaskStatus, TaskPriority } from '../enums';
import { getEnumKeyByValue } from '../utils/getEnumKeyByValue';

export function useFilterHandlers(tasks: any[]) {
  const [anchorStatus, setAnchorStatus] = useState<null | HTMLElement>(null);
  const [anchorPriority, setAnchorPriority] = useState<null | HTMLElement>(null);
  const [anchorAssignedTo, setAnchorAssignedTo] = useState<null | HTMLElement>(null);

  const filters = useFilters();
  const { setFilters, resetFilters, setSelectedTask } = useTaskActions();

  const uniqueAgents = Array.from(
    new Set(tasks.flatMap((task) => task.agentes.map((agente: User) => agente.username)))
  ).sort();

  const handleFilterChange = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K] | null
  ) => {
    setFilters({ [key]: value } as Partial<typeof filters>);
  };

  const getStatusLabel = (value: number | null) =>
    value ? getEnumKeyByValue(TaskStatus, value) : null;

  const getPriorityLabel = (value: number | null) =>
    value ? getEnumKeyByValue(TaskPriority, value) : null;

  const handleResetAllFilters = () => {
    resetFilters();
    setAnchorStatus(null);
    setAnchorPriority(null);
    setAnchorAssignedTo(null);
    setSelectedTask(null);
  };

  const hasActiveFilters = Boolean(
    filters.status || filters.priority || filters.assignedTo || filters.searchTerm
  );

  const statusButtonText = filters.status ? getStatusLabel(filters.status) : 'Estado';
  const priorityButtonText = filters.priority ? getPriorityLabel(filters.priority) : 'Prioridad';
  const assignedButtonText = filters.assignedTo ? filters.assignedTo : 'Asignado a';

  return {
    filters,
    anchorStatus,
    anchorPriority,
    anchorAssignedTo,
    setAnchorStatus,
    setAnchorPriority,
    setAnchorAssignedTo,
    handleFilterChange,
    handleResetAllFilters,
    hasActiveFilters,
    statusButtonText,
    priorityButtonText,
    assignedButtonText,
    uniqueAgents,
  };
}
