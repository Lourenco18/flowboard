"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";

// Define o tipo do contexto
type SupabaseContextType = {
    supabase: SupabaseClient | null;
    isLoaded: boolean;
};

// Cria o contexto com valores iniciais
const Context = createContext<SupabaseContextType>({ supabase: null, isLoaded: false });

// Define as props do provider com tipagem correta
interface SupabaseProviderProps {
    children: ReactNode;
}

export default function SupabaseProvider({ children }: SupabaseProviderProps) {
    const { isLoaded, getToken } = useAuth();
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

    useEffect(() => {
        if (!isLoaded) return;

        const client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                accessToken: getToken,
            }
        );

        setSupabase(client);
    }, [isLoaded, getToken]);

    if (!isLoaded || !supabase) return <div>Loading...</div>;

    return (
        <Context.Provider value={{ supabase, isLoaded: true }}>
            {children}
        </Context.Provider>
    );
}

// Hook para usar o Supabase
export const useSupabase = (): SupabaseContextType => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useSupabase must be used within a SupabaseProvider");
    }
    return context;
};
