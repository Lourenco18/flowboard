import { error } from "console";
import { boardDataService, boardService, taskService } from "../services";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Board, ColumnWithTasks } from "../supabse/models";
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
            const newBoard = await boardDataService.createBoardWithDefaultColumns(supabase!, {
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

export function useBoard(boardId: string) {

    const { supabase } = useSupabase();
    const [board, setBoard] = useState<Board | null>(null);
    const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (boardId) loadBoard();
    }, [boardId, supabase]);
    async function loadBoard() {
        if (!boardId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await boardDataService.getBoardWithColumns(supabase!, boardId);
            setBoard(data.board);
            setColumns(data.columnsWithTasks);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failde to load boards");

        } finally {
            setLoading(false);
        }
    }
    async function updateBoard(boardId: string, updates: Partial<Board>) {



        try {

            const updateBoard = await boardService.updateBoard(supabase!, boardId, updates);
            setBoard(updateBoard);
            return updateBoard;

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failde to update the board");

        }
    }
    async function createRealTask(
        columnId: string,
        taskData: {
            title: string;
            description?: string;
            assignee?: string;
            priority: "low" | "medium" | "high";
            due_date?: string;
        }
    ) {
        try {
            const newTask = await taskService.createTask(supabase!, {
                column_id: columnId,
                title: taskData.title,
                description: taskData.description || null,
                assignee: taskData.assignee || null,
                priority: taskData.priority,
                due_date: taskData.due_date || null,
                sort_order: columns.find(col => col.id === columnId)?.tasks.length || 0,
            });
            setColumns((prev) => prev.map((col) => col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col));
            return newTask;
        } catch (err) {
            console.error("CREATE REAL TASK ERROR:", err);
            setError(err instanceof Error ? err.message : "Failed to create task");
        }


    }
    return {
        board, columns, loading, error, updateBoard, createRealTask
    };
}