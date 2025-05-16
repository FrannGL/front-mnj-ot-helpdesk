'use client';

import { useMemo, useState } from 'react';

import { TaskStatus, TaskPriority } from '../enums';

import type { Task } from '../interfaces';
import type { TaskFilters } from '../types';

export const useFilterHandlers = (tasks: Task[]) => {
  const [filters, setFilters] = useState<TaskFilters>({
    status: null,
    priority: null,
    assignedTo: null,
    searchTerm: '',
  });

  const [anchorStatus, setAnchorStatus] = useState<HTMLElement | null>(null);
  const [anchorPriority, setAnchorPriority] = useState<HTMLElement | null>(null);
  const [anchorAssignedTo, setAnchorAssignedTo] = useState<HTMLElement | null>(null);

  const handleFilterChange = (filterName: keyof TaskFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleResetAllFilters = () => {
    setFilters({
      status: null,
      priority: null,
      assignedTo: null,
      searchTerm: '',
    });
  };

  const statusButtonText =
    filters.status !== null
      ? Object.entries(TaskStatus).find(([_, value]) => value === filters.status)?.[0] || 'Estado'
      : 'Estado';

  const priorityButtonText =
    filters.priority !== null
      ? Object.entries(TaskPriority).find(([_, value]) => value === filters.priority)?.[0] ||
        'Prioridad'
      : 'Prioridad';

  const assignedButtonText = filters.assignedTo !== null ? filters.assignedTo : 'Asignado a';

  const hasActiveFilters =
    filters.status !== null ||
    filters.priority !== null ||
    filters.assignedTo !== null ||
    filters.searchTerm !== '';

  const uniqueAgents = useMemo(() => {
    if (!tasks?.length) return [];

    const agentsSet = new Set<string>();
    tasks.forEach((task) => {
      task.agentes.forEach((agent) => {
        agentsSet.add(agent.username);
      });
    });

    return Array.from(agentsSet);
  }, [tasks]);

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
};
