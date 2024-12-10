import React from 'react';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useThemeStore } from '@/store/themeStore';
import type { NavigationItem } from '@/store/navigationStore';
import { GripVerticalIcon } from '@heroicons/react/24/outline';

interface SortableNavItemProps {
  item: NavigationItem;
  isActive: boolean;
}

export const SortableNavItem: React.FC<SortableNavItemProps> = ({ item, isActive }) => {
  const { isDarkMode } = useThemeStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      >
        <GripVerticalIcon className="h-4 w-4 text-gray-400" />
      </div>
      
      <Link
        to={item.href}
        className={`flex-1 flex items-center px-4 py-3 text-sm font-medium rounded-md ${
          isActive
            ? isDarkMode
              ? 'bg-blue-900 text-blue-200'
              : 'bg-blue-50 text-blue-700'
            : isDarkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
      </Link>
    </div>
  );
};