"use client";
import Navbar from "@/components/navbar";
import { useBoard } from "@/lib/hooks/useBoards";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function BoardPage() {
    const { id } = useParams<{ id: string }>();
    const { board, updateBoard } = useBoard(id);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newColor, setNewColor] = useState("f");

    async function handleUpdateBoard(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle.trim() || !board)
            return;

        try {
            await updateBoard(board.id, {
                title: newTitle.trim(),
                color: newColor || board.color,
            });
            setIsEditingTitle(false);

        } catch {

        }
    }
    return <div className="min-h-screen bg-gray-50">
        <Navbar boardTitle={board?.title} oneEditBoard={() => {
            setIsEditingTitle(true);
            setNewTitle(board?.title ?? "");
            setNewColor(board?.color ?? "");
        }} />
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
                            ].map((color) => (
                                <button
                                    key={color}
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

    </div>;
}