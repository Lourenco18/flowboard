import { error } from "console";
import { teamDataService, teamService } from "../services";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Team } from "../supabse/models";
import { useSupabase } from "../supabse/SupabaseProvider";

export function useTeams() {
    const { user } = useUser();
    const { supabase } = useSupabase();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) loadTeams();
    }, [user, supabase]);
    async function loadTeams() {

    }

    async function createTeam() {

    }
    return { teams, loading, error, createTeam };
}

export function useTeam(teamId: string) {

    const { supabase } = useSupabase();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (teamId) loadTeam();
    }, [teamId, supabase]);
    async function loadTeam() {

    }
    async function updateTeam(teamId: string, updates: Partial<Team>) {



        try {

            const updateTeam = await teamService.updateTeam(supabase!, teamId, updates);
            setTeam(updateTeam);
            return updateTeam;

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update the team");

        }
    }

    return {
        team, columns, loading, error, updateTeam
    };
}