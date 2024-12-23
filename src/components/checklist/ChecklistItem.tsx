import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ChecklistItem as ChecklistItemType } from "@/store/checklistStore";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: () => void;
  onUpdate: (title: string) => void;
  onDelete: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onUpdate(editedTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(item.title);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg group">
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center space-x-2"
        >
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="sm" variant="primary">
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleCancel}
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <>
          <div className="flex items-center space-x-3 flex-1">
            <button
              onClick={onToggle}
              className={`w-5 h-5 rounded border ${
                item.completed
                  ? "bg-primary-500 border-primary-600 text-white"
                  : "border-gray-300 dark:border-gray-600"
              } flex items-center justify-center`}
            >
              {item.completed && <CheckIcon className="w-4 h-4" />}
            </button>
            <span
              className={`flex-1 ${
                item.completed
                  ? "text-gray-500 dark:text-gray-400 line-through"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {item.title}
            </span>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button variant="danger" size="sm" onClick={onDelete}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
