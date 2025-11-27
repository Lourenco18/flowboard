"use client";
import Navbar from "@/components/navbar";
import { useBoard } from "@/lib/hooks/useBoards";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export default function BoardPage() {
    const { id } = useParams<{ id: string }>();
    const { board } = useBoard(id);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newColor, setNewColor] = useState("f");

    return <div className="min-h-screen bg-gray-50">
        <Navbar boardTitle={board?.title} oneEditBoard={() => {
            setIsEditingTitle(true);
        }} />
        <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
            <DialogContent className="w-[95vw] max-w-425px mx-auto" >
                <DialogHeader>
                    <DialogTitle>Edit Board</DialogTitle>

                </DialogHeader>
                <form>
                    <div>
                        <Label>Board Title</Label>
                        <Input id="boardTitle" placeholder="Enter Board title">
                        </Input>
                    </div>
                </form>


            </DialogContent>
        </Dialog>

    </div>;
}