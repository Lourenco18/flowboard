
import { Board, Column } from "./supabse/models";
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";

//Board service with CRUD

export const boardService = {
    //get board
    async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("id", boardId)
            .single();
        if (error) throw error;
        return data;
    },

    //delete board
    async deleteBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("id", boardId)
            .single();
        if (error) throw error;
        return data;
    },
    //get all boards for user
    async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });
        if (error) throw error;
        return data || [];
    },
    //create board
    async createBoard(supabase: SupabaseClient,
        board: Omit<Board, "id" | "created_at" | "updated_at">
    ): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .insert(board)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    //update board
    async updateBoard(supabase: SupabaseClient,
        boardId: string,
        updates: Partial<Board>
    ): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", boardId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};

export const boardDataService = {
    //get board with columns
    async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
        const [board, columns] = await Promise.all([
            boardService.getBoard(supabase, boardId),
            columnService.getColumns(supabase, boardId),
        ]);
        if (!board) throw new Error("Board not found");

        return { board, columns };
    },


    //Create board and their columns
    async createBoardWithDefaultColumns(supabase: SupabaseClient, boardData: {
        title: string;
        userId: string;
        description?: string;
        color?: string;

    }) {
        const board = await boardService.createBoard(supabase, {
            title: boardData.title,
            description: boardData.description || null,
            color: boardData.color || "bg-blue-500",
            user_id: boardData.userId,
        });
        const defaultColumns = [
            { title: "To Do", sort_order: 1 },
            { title: "In Progress", sort_order: 2 },
            { title: "Review", sort_order: 3 },
            { title: "Done", sort_order: 4 },
        ];

        await Promise.all(
            defaultColumns.map((column) =>
                columnService.createColumn(supabase, {
                    ...column,
                    board_id: board.id,
                    user_id: boardData.userId,
                })
            )
        );
        return board;
    },
};


//Column service with CRUD
export const columnService = {
    // get columns for a board
    async getColumns(supabase: SupabaseClient, boardId: string): Promise<Column[]> {
        const { data, error } = await supabase
            .from("columns")
            .select("*")
            .eq("board_id", boardId)
            .order("sort_order", { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async createColumn(supabase: SupabaseClient,
        column: Omit<Column, "id" | "created_at">
    ): Promise<Column> {
        const { data, error } = await supabase
            .from("columns")
            .insert(column)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};


//Board service with CRUD

export const teamService = {
    //get board
    async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("id", boardId)
            .single();
        if (error) throw error;
        return data;
    },

    //delete board
    async deleteBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("id", boardId)
            .single();
        if (error) throw error;
        return data;
    },
    //get all boards for user
    async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });
        if (error) throw error;
        return data || [];
    },
    //create board
    async createBoard(supabase: SupabaseClient,
        board: Omit<Board, "id" | "created_at" | "updated_at">
    ): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .insert(board)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    //update board
    async updateBoard(supabase: SupabaseClient,
        boardId: string,
        updates: Partial<Board>
    ): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", boardId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};

export const teamDataService = {
    //get board with columns
    async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
        const [board, columns] = await Promise.all([
            boardService.getBoard(supabase, boardId),
            columnService.getColumns(supabase, boardId),
        ]);
        if (!board) throw new Error("Board not found");

        return { board, columns };
    },


    //Create board and their columns
    async createBoardWithDefaultColumns(supabase: SupabaseClient, boardData: {
        title: string;
        userId: string;
        description?: string;
        color?: string;

    }) {
        const board = await boardService.createBoard(supabase, {
            title: boardData.title,
            description: boardData.description || null,
            color: boardData.color || "bg-blue-500",
            user_id: boardData.userId,
        });
        const defaultColumns = [
            { title: "To Do", sort_order: 1 },
            { title: "In Progress", sort_order: 2 },
            { title: "Review", sort_order: 3 },
            { title: "Done", sort_order: 4 },
        ];

        await Promise.all(
            defaultColumns.map((column) =>
                columnService.createColumn(supabase, {
                    ...column,
                    board_id: board.id,
                    user_id: boardData.userId,
                })
            )
        );
        return board;
    },
};



