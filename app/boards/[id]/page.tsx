"use client";
import Navbar from "@/components/navbar";
import { useBoard } from "@/lib/hooks/useBoards";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Calendar, MoreHorizontal, PlusIcon, User } from "lucide-react";
import { ColumnWithTasks, Task } from "@/lib/supabse/models";


import { Card, CardContent } from "@/components/ui/card";

import { DndContext, DragStartEvent, rectIntersection, useDroppable, DragEndEvent, DragOverEvent, DragOverlay, useSensors, PointerSensor, useSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";




function DroppableColumn({
    column,
    children,
    onCreateTask,


}: {
    column: ColumnWithTasks;
    children?: React.ReactNode;
    onCreateTask: (taskData: any) => Promise<void>;
    onEditColumn: (column: ColumnWithTasks) => void;

}) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });
    const { id } = useParams<{ id: string }>();
    const { board } = useBoard(id);
    const team_id = board?.team_id ?? null;
    const [newDescription, setNewDescription] = useState("");
    return (
        <div ref={setNodeRef} className={`w-full lg:flex-shrink-0 lg:w-80 ${isOver ? "bg-blue-50 rounded-lg" : ""}`}   >
            <div className="bg-white rounded-lg shadow-sm border">
                {/* Column header */}
                <div className="p-3 sm:p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{column.title}</h3>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">{column.tasks.length}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <MoreHorizontal />
                        </Button>
                    </div>
                </div>
                {/* Column content */}
                <div className="p-2">
                    {children}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full mt-3 text-gray-500 hover:text-gray-700">
                                <PlusIcon className="" />
                                Add Task
                            </Button>

                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-425px mx-auto" aria-describedby={undefined} >
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                                <p className="text-sm text-gray-600">Add a task to the board</p>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={onCreateTask}>
                                <div className="space-y-2">
                                    <Label>
                                        Title *
                                    </Label>
                                    <Input placeholder="Enter task title" id="title" name="title" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>

                                    <div className="relative">
                                        <Textarea
                                            maxLength={200}
                                            id="description"
                                            name="description"
                                            placeholder="Enter Board description"
                                            required
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            className="pr-12 resize-none max-h-40 overflow-y-auto whitespace-pre-wrap break-words break-all"

                                        />
                                        <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                                            {newDescription.length}/200
                                        </span>
                                    </div>
                                </div>

                                {team_id !== null && (
                                    <div>
                                        <Label>Assignee</Label>
                                        <Input
                                            placeholder="Who should do this?"
                                            id="assignee"
                                            name="assignee"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>
                                        Priority
                                    </Label>
                                    <Select name="priority" defaultValue="medium">
                                        <SelectTrigger>
                                            <SelectValue>

                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["low", "medium", "high"].map((priority, key) => (
                                                <SelectItem key={key} value={priority}>
                                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>

                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Due Date
                                    </Label>
                                    <Input type="date" id="dueDate" name="dueDate" >
                                    </Input>
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">

                                    <Button type="submit">
                                        Create Task
                                    </Button>

                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
function SortableTask({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id
    });
    const styles = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,

    }
    function getPriority(priority: "low" | "medium" | "high"): string {
        switch (priority) {
            case "low":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "high":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    }
    return <div ref={setNodeRef} {...attributes} {...listeners} style={styles} >
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 p-2">
                            {task.title}
                        </h4>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{task.description || "No description provided."}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                            {task.assignee && <div className="text-xs flex items-center space-x-1 text-gray-500"><User className="h-3 w-3" /> <span className="truncate">{task.assignee}</span></div>}
                            {task.due_date && <div className="text-xs flex items-center space-x-1 text-gray-500"><Calendar className="h-3 w-3" /> <span className="truncate">{new Date(task.due_date).toLocaleDateString()}</span></div>}
                        </div>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriority(task.priority)}`} />

                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
}
function TaskOverlay({ task }: { task: Task }) {

    function getPriority(priority: "low" | "medium" | "high"): string {
        switch (priority) {
            case "low":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "high":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    }
    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 p-2">
                            {task.title}
                        </h4>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{task.description || "No description provided."}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                            {task.assignee && <div className="text-xs flex items-center space-x-1 text-gray-500"><User className="h-3 w-3" /> <span className="truncate">{task.assignee}</span></div>}
                            {task.due_date && <div className="text-xs flex items-center space-x-1 text-gray-500"><Calendar className="h-3 w-3" /> <span className="truncate">{new Date(task.due_date).toLocaleDateString()}</span></div>}
                        </div>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriority(task.priority)}`} />

                    </div>
                </div>
            </CardContent>
        </Card>)

}
export default function BoardPage() {
    const { id } = useParams<{ id: string }>();
    const { board, updateBoard, columns, createRealTask, setColumns } = useBoard(id);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newColor, setNewColor] = useState("");
    const team_id = board?.team_id ?? null;

    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sensors = useSensors(useSensor(
        PointerSensor, {
        activationConstraint: {
            distance: 8,
        },

    }))
    //function to update board 
    async function handleUpdateBoard(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle.trim() || !board)
            return;

        try {
            await updateBoard(board.id, {
                title: newTitle.trim(),
                color: newColor || board.color,
                description: newDescription || board.description,
            });
            setIsEditingTitle(false);

        } catch {

        }
    }

    async function createTask(taskData: {
        title: string;
        description?: string;
        assignee?: string;
        priority: "low" | "medium" | "high";
        due_date?: string;
    }) {
        const targetColumn = columns[0]
        if (!targetColumn) {
            throw new Error("No columns available to add the task.");
        }
        await createRealTask(targetColumn.id, taskData);
    }

    async function handleCreateTask(e: any
    ) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const taskData = {
            title: formData.get("title") as string,
            description: (formData.get("description") as string) || undefined,
            assignee: team_id ? (formData.get("assignee") as string) : undefined,
            priority: (formData.get("priority") as "low" | "medium" | "high") || "medium",
            due_date: (formData.get("dueDate") as string) || undefined,
        }
        console.log("TASK DATA BEING SENT:", taskData);

        if (taskData.title.trim()) {
            await createTask(taskData);
        }
    }
    function handleDragStart(event: DragStartEvent) {
        const taskId = event.active.id as string;
        const task = columns.flatMap((col) => col.tasks).find((task) => task.id === taskId);
        if (task) {
            setActiveTask(task);
        }
    }
    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
        const activeID = active.id as string;
        const overID = over.id as string;
        const sourceColumn = columns.find((col) => col.tasks.some((task) => task.id === activeID));
        const targetColumn = columns.find((col) => col.id === overID);
        if (!sourceColumn || !targetColumn) return;

        if (sourceColumn.id === targetColumn.id) {
            const activeIndex = sourceColumn.tasks.findIndex((task) => task.id === activeID);
            const overIndex = targetColumn.tasks.findIndex((task) => task.id === overID);
            if (activeIndex !== overIndex) {
                setColumns((prev: ColumnWithTasks[]) => {
                    const newColumns = [...prev];
                    const column = newColumns.find((col) => col.id === sourceColumn.id);
                    if (column) {
                        const tasks = [...column.tasks]
                        const [removed] = tasks.splice(activeIndex, 1);
                        tasks.splice(overIndex, 0, removed);
                        column.tasks = tasks;

                    }
                    return newColumns;
                });
            }
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        const taskID = active.id as string;
        const overID = over.id as string;

        const targetColumn = columns.find((col) => col.id === overID);
        if (targetColumn) {
            const activeIndex = sourceColumn.tasks.findIndex((task) => task.id === activeID);

        } else {

        }

        setColumns((prev: ColumnWithTasks[]) => {
            const newColumns = prev.map((col) => {
                const tasks = col.tasks.filter((task) => task.id !== taskID);
                return { ...col, tasks };
            });

            const taskToMove = columns
                .flatMap((col) => col.tasks)
                .find((task) => task.id === taskID);

            if (taskToMove) {
                const columnIndex = newColumns.findIndex((col) => col.id === targetColumn.id);
                newColumns[columnIndex].tasks.push(taskToMove);
            }

            return newColumns;
        });

        setActiveTask(null);
    }

    return <div className="min-h-screen bg-gray-50">
        {/* navbar */}
        <Navbar boardTitle={board?.title} oneEditBoard={() => {
            setIsEditingTitle(true);
            setNewTitle(board?.title ?? "");
            setNewDescription(board?.description ?? "");
            setNewColor(board?.color ?? "");
        }}
            onFilterClick={() => setIsFilterOpen(true)}
            filterCount={2}
        />
        <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
            <DialogContent aria-describedby={undefined} className="max-h-[85vh] overflow-y-auto">


                <DialogHeader>
                    <DialogTitle>Edit Board</DialogTitle>

                </DialogHeader>
                <form className="space-y-4" onSubmit={handleUpdateBoard}>
                    <div className="space-y-2">
                        <Label htmlFor="boardTitle">Board Title</Label>
                        <Input id="boardTitle" placeholder="Enter Board title" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}>

                        </Input>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="boardDescription">Description</Label>

                        <div className="relative">
                            <Textarea
                                maxLength={200}
                                id="boardDescription"
                                placeholder="Enter Board description"
                                required
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="pr-12 resize-none max-h-40 overflow-y-auto whitespace-pre-wrap break-words break-all"

                            />




                            {/* contador */}
                            <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                                {newDescription.length}/200
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {/* Color selection */}
                        <Label htmlFor="boardColor">Board Color</Label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {["bg-blue-500",
                                "bg-green-500",
                                "bg-red-500",
                                "bg-orange-500",
                                "bg-yellow-500",
                                "bg-purple-500",
                                "bg-pink-500",
                                "bg-teal-500",
                                "bg-indigo-500",
                                "bg-gray-500",
                                "bg-cyan-500",
                                "bg-emerald-500",
                            ].map((color, key) => (
                                <button
                                    key={key}
                                    type="button"
                                    aria-label={color}
                                    className={`w-8 h-8 rounded-full ${color} ${color === newColor ? "ring-2 ring-odffset-2 ring-gray-900" : ""}`}
                                    onClick={() => setNewColor(color)}
                                />
                            ))}
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditingTitle(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>

                        </div>

                    </div>
                </form>


            </DialogContent>
        </Dialog>

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogContent aria-describedby={undefined} className="w-[95vw] max-w-425px mx-auto">

                <DialogHeader>
                    <DialogTitle>Filter Tasks</DialogTitle>
                    <p className="text-sm text-gray-600">Filter tasks by priority, status, or assignee.</p>
                </DialogHeader>
                <div className="space-y-4 ">
                    <div className="space-y-2 ">
                        <Label>
                            Priority
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {["low", "medium", "high"].map((priority, key) => (
                                <Button key={key} className="" variant={"outline"} size="sm">
                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {/*}  <div className="space-y-2 ">
                        <Label>
                            Assignee
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {["low", "medium", "high"].map((priority, key) => (
                                <Button key={key} className="" variant={"outline"} size="sm">
                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>*/}
                    <div className="space-y-2 ">
                        <Label>
                            Due Date
                        </Label>
                        <Input type="date" />
                    </div>
                    <div className="flex justify-between pt-4">
                        <Button type="button" variant={"outline"}>Clear Filter</Button>
                        <Button type="button" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Board content */}
        <main className="container mx-auto px-2 sm:px-4 py-4  sm:py-6 ">
            {/*stats*/}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Total Tasks: </span>
                        {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
                    </div>

                </div>
                { /* Add task dialog*/}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <PlusIcon className="" />
                            Add Task
                        </Button>

                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-425px mx-auto" aria-describedby={undefined} >
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                            <p className="text-sm text-gray-600">Add a task to the board</p>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={handleCreateTask}>
                            <div className="space-y-2">
                                <Label>
                                    Title *
                                </Label>
                                <Input placeholder="Enter task title" id="title" name="title" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>

                                <div className="relative">
                                    <Textarea
                                        maxLength={200}
                                        id="description"
                                        name="description"
                                        placeholder="Enter Board description"
                                        required
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="pr-12 resize-none max-h-40 overflow-y-auto whitespace-pre-wrap break-words break-all"

                                    />
                                    <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                                        {newDescription.length}/200
                                    </span>
                                </div>
                            </div>

                            {team_id !== null && (
                                <div>
                                    <Label>Assignee</Label>
                                    <Input
                                        placeholder="Who should do this?"
                                        id="assignee"
                                        name="assignee"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>
                                    Priority
                                </Label>
                                <Select name="priority" defaultValue="medium">
                                    <SelectTrigger>
                                        <SelectValue>

                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["low", "medium", "high"].map((priority, key) => (
                                            <SelectItem key={key} value={priority}>
                                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>

                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Due Date
                                </Label>
                                <Input type="date" id="dueDate" name="dueDate" >
                                </Input>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">

                                <Button type="submit">
                                    Create Task
                                </Button>

                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {/* Columns */}
            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                collisionDetection={rectIntersection}
            >


                <div className="
  flex flex-col
  lg:flex-row
  lg:space-x-6
  lg:overflow-x-auto
  lg:pb-6
  lg:px-2
  lg:mx-2
  lg:[&::-webkit-scrollbar]:h-2
  lg:[&::-webkit-scrollbar-track]:bg-gray-100
  lg:[&::-webkit-scrollbar-thumb]:bg-gray-300
  lg:[&::-webkit-scrollbar-thumb]:rounded-full
  space-y-4
  lg:space-y-0
">

                    {columns.map((column, key) => (
                        <DroppableColumn
                            key={key}
                            column={column}
                            onCreateTask={handleCreateTask}
                            onEditColumn={() => { }}
                        >
                            <SortableContext items={column.tasks.map((task) => task.id)}
                                strategy={verticalListSortingStrategy}
                            >


                                <div className="space-y-3 ">
                                    {column.tasks.map((task, key) => (
                                        <SortableTask key={key} task={task} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DroppableColumn>

                    ))}
                    <DragOverlay>
                        {activeTask ? <TaskOverlay task={activeTask} /> : null}
                    </DragOverlay>
                </div>
            </DndContext>
        </main>

    </div>
}


