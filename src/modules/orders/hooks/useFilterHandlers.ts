'use client';

import { useState } from 'react';

import { OrderStatusEnum, OrderPriorityEnum } from '../enums';

import type { OrderFilters } from '../types';

export const useFilterHandlers = (initialFilters?: Partial<OrderFilters>) => {
  const [anchorStatus, setAnchorStatus] = useState<HTMLElement | null>(null);
  const [anchorPriority, setAnchorPriority] = useState<HTMLElement | null>(null);
  const [anchorAssignedTo, setAnchorAssignedTo] = useState<HTMLElement | null>(null);
  const [anchorClient, setAnchorClient] = useState<HTMLElement | null>(null);
  const [anchorTags, setAnchorTags] = useState<HTMLElement | null>(null);

  const getStatusButtonText = (status: number | null) =>
    status !== null
      ? Object.entries(OrderStatusEnum).find(([_, value]) => value === status)?.[0] || 'Estado'
      : 'Estado';

  const getPriorityButtonText = (priority: number | null) =>
    priority !== null
      ? Object.entries(OrderPriorityEnum).find(([_, value]) => value === priority)?.[0] ||
        'Prioridad'
      : 'Prioridad';

  const getTagsButtonText = (tags: number[] | undefined) => {
    if (!tags || tags.length === 0) return 'Categorías';
    return `${tags.length} categoría${tags.length > 1 ? 's' : ''} seleccionado${tags.length > 1 ? 's' : ''}`;
  };

  return {
    anchorStatus,
    anchorPriority,
    anchorAssignedTo,
    anchorClient,
    anchorTags,
    setAnchorStatus,
    setAnchorPriority,
    setAnchorAssignedTo,
    setAnchorClient,
    setAnchorTags,
    getStatusButtonText,
    getPriorityButtonText,
    getTagsButtonText,
  };
};
