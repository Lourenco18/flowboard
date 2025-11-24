import { error } from "console";
import { boardDataService } from "../services";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Board } from "../supabse/models";
import { useSupabase } from "../supabse/SupabaseProvider";

export function useBoards() {
    const { user } = useUser();
    const { supabase } = useSupabase();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
