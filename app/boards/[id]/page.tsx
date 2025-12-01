"use client";
import Navbar from "@/components/navbar";
import { useBoard } from "@/lib/hooks/useBoards";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function BoardPage() {
    const { id } = useParams<{ id: string }>();
    const { board, updateBoard, columns } = useBoard(id);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newColor, setNewColor] = useState("");
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
            <DialogContent className="w-[95vw] max-w-425px mx-auto" >
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
                                className="pr-12" // espaço para o contador não tapar o texto
                            />

                            {/* contador */}
                            <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                                {newDescription.length}/120
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
            <DialogContent className="w-[95vw] max-w-425px mx-auto" >
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
        <main>
            {/*stats*/}
            <div>
                <span>
                    Total Tasks:
                </span>
                {columns.reduce((sum, col) => sum + col.tasks.length, 0)})}
            </div>
        </main>

    </div>
}