import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ChecklistItem } from "@/components/checklist/ChecklistItem";
import { useChecklistStore } from "@/store/checklistStore";
import { PlusIcon } from "@heroicons/react/24/outline";
import { GripVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

// Ajout d'un composant wrapper pour strict mode
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

export const ChecklistPage = () => {
  const [newItemTitle, setNewItemTitle] = useState("");
  const { items, addItem, updateItem, deleteItem, toggleItem, reorderItems } =
    useChecklistStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemTitle.trim()) {
      addItem(newItemTitle.trim());
      setNewItemTitle("");
      toast.success("Élément ajouté à la checklist");
    }
  };

  const handleUpdate = (id: string, title: string) => {
    updateItem(id, { title });
    toast.success("Élément mis à jour");
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    toast.success("Élément supprimé");
  };

  const handleToggle = (id: string) => {
    toggleItem(id);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const itemsCopy = Array.from(items);
    const [removed] = itemsCopy.splice(sourceIndex, 1);
    itemsCopy.splice(destinationIndex, 0, removed);

    reorderItems(itemsCopy);
    toast.success("Liste réorganisée");
  };

  return (
    <div className="p-6">
      <PageHeader title="Checklist" />

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-6 flex space-x-2">
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Ajouter un nouvel élément..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newItemTitle.trim()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter
          </Button>
        </form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="checklist">
            {(provided: DroppableProvided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                {items.length === 0 ? (
                  <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Aucun élément dans la checklist
                  </p>
                ) : (
                  items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(
                        dragProvided: DraggableProvided,
                        snapshot: DraggableStateSnapshot
                      ) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={`
                            border-b border-gray-200 dark:border-gray-700 last:border-0
                            transition-all duration-200 ease-in-out
                            ${
                              snapshot.isDragging
                                ? "shadow-lg bg-gray-50 dark:bg-gray-700 scale-[1.02]"
                                : ""
                            }
                          `}
                        >
                          <div className="flex items-center p-4 space-x-4">
                            <div
                              {...dragProvided.dragHandleProps}
                              className={`
                                cursor-grab active:cursor-grabbing
                                ${
                                  snapshot.isDragging
                                    ? "text-blue-500"
                                    : "text-gray-400"
                                }
                              `}
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <ChecklistItem
                                item={item}
                                onToggle={() => handleToggle(item.id)}
                                onUpdate={(title) =>
                                  handleUpdate(item.id, title)
                                }
                                onDelete={() => handleDelete(item.id)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>
    </div>
  );
};
