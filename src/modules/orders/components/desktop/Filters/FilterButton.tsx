import type { ReactNode } from 'react';

import { Menu, Button, MenuItem, Typography } from '@mui/material';

interface FilterOption {
  id: string | number;
  label: string;
  selected?: boolean;
  icon?: ReactNode;
}

interface FilterButtonProps {
  label: string;
  icon: ReactNode;
  options: FilterOption[];
  selectedValue?: string | number | (string | number)[];
  onSelect: (value: string | number | (string | number)[] | undefined) => void;
  anchorEl: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  multiple?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
  customOptionRender?: (option: FilterOption) => ReactNode;
}

const FilterButton = ({
  label,
  icon,
  options,
  selectedValue,
  onSelect,
  anchorEl,
  onOpen,
  onClose,
  multiple = false,
  showAllOption = true,
  allOptionLabel = 'Todos',
  customOptionRender,
}: FilterButtonProps) => {
  const isSelected = multiple
    ? Array.isArray(selectedValue) && selectedValue.length > 0
    : selectedValue !== undefined;

  const getDisplayLabel = () => {
    if (multiple && Array.isArray(selectedValue)) {
      return options
        .filter((option) => selectedValue.includes(option.id))
        .map((option) => option.label)
        .join(', ');
    }
    return options.find((option) => option.id === selectedValue)?.label || label;
  };

  return (
    <div>
      <Button
        onClick={onOpen}
        variant="soft"
        color={isSelected ? 'secondary' : 'inherit'}
        startIcon={icon}
      >
        {getDisplayLabel()}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        {showAllOption && (
          <MenuItem
            onClick={() => {
              onSelect(undefined);
              onClose();
            }}
            selected={
              !selectedValue || (Array.isArray(selectedValue) && selectedValue.length === 0)
            }
          >
            {allOptionLabel}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={
              multiple
                ? Array.isArray(selectedValue) && selectedValue.includes(option.id)
                : selectedValue === option.id
            }
            onClick={() => {
              if (multiple) {
                const currentValues = (selectedValue as (string | number)[]) || [];
                const newValues = currentValues.includes(option.id)
                  ? currentValues.filter((v) => v !== option.id)
                  : [...currentValues, option.id];
                onSelect(newValues.length ? newValues : undefined);
              } else {
                onSelect(option.id);
              }
              onClose();
            }}
          >
            {customOptionRender ? (
              customOptionRender(option)
            ) : (
              <Typography variant="body2">{option.label}</Typography>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FilterButton;
