import { error } from "console";
import { boardDataService, boardService } from "../services";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Board } from "../supabse/models";
import { useSupabase } from "../supabse/SupabaseProvider";

export function useBoards() {
    const { user } = useUser();
    const { supabase } = useSupabase();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) loadBoards();
    }, [user, supabase]);
    async function loadBoards() {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const data = await boardService.getBoards(supabase!, user.id);
            setBoards(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failde to load boards");

        } finally {
            setLoading(false);
        }
    }

    async function createBoard(boardData: {
        title: string;
        description?: string;
        color?: string;
    }) {
        if (!user) throw new Error("User not authenticated");
        try {
            const newBoard = await boardDataService.createBoadWithDefaultColumns(supabase!, {
                ...boardData,
                userId: user?.id,

            });
            setBoards((prev) => [newBoard, ...prev]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    }
    return { boards, loading, error, createBoard };
}
