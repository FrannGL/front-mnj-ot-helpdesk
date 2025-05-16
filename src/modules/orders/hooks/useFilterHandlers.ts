'use client';

import { useState } from 'react';

import { OrderStatusEnum, OrderPriorityEnum } from '../enums';

import type { OrderFilters } from '../types';

export const useFilterHandlers = (initialFilters?: Partial<OrderFilters>) => {
  const [anchorStatus, setAnchorStatus] = useState<HTMLElement | null>(null);
  const [anchorPriority, setAnchorPriority] = useState<HTMLElement | null>(null);
  const [anchorAssignedTo, setAnchorAssignedTo] = useState<HTMLElement | null>(null);

  const getStatusButtonText = (status: number | null) =>
    status !== null
      ? Object.entries(OrderStatusEnum).find(([_, value]) => value === status)?.[0] || 'Estado'
      : 'Estado';

  const getPriorityButtonText = (priority: number | null) =>
    priority !== null
      ? Object.entries(OrderPriorityEnum).find(([_, value]) => value === priority)?.[0] ||
        'Prioridad'
      : 'Prioridad';

  return {
    anchorStatus,
    anchorPriority,
    anchorAssignedTo,
    setAnchorStatus,
    setAnchorPriority,
    setAnchorAssignedTo,
    getStatusButtonText,
    getPriorityButtonText,
  };
};
