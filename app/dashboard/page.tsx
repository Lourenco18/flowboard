"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBoards } from "@/lib/hooks/useBoards";
import { useUser } from "@clerk/nextjs";
import { Loader2, Plus, Trello } from "lucide-react";

export default function DashboardPage() {

    const { user } = useUser();
    const { createBoard, boards, loading, error } = useBoards();

    const handleCreateBoard = async () => {
        await createBoard({ title: "New Board" });
    }
    if (loading) {
        return <div><Loader2 /><span>Loading...</span></div>;
    }
    if (error) {
        return <div><h2>Error: <p  >{error}</p></h2></div>;
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back,{""}
                        {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
                    </h1>
                    <p className="text-gray-600">
                        Here's your dashboard where you can manage your projects and settings.
                    </p>
                    <Button className="w-full sm:w-auto" variant="outline" onClick={handleCreateBoard}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Board
                    </Button>
                </div>
                {/* Boards List */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm: gap-6 mb-6 sm:mb-8">
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div><p className="text-gray-900 text-xs sm:text-sm font-medium ">Total Boards</p>
                                    <p className="text-gray-900 text-xl sm:text-2xl font-bold">{boards.length}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg  flex items-center justify-center">
                                    <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                            </div>


                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div><p className="text-gray-900 text-xs sm:text-sm font-medium ">Recent Activity</p>
                                    <p className="text-gray-900 text-xl sm:text-2xl font-bold">{boards.filter((board) => {
                                        const updatedAt = new Date(board.updated_at);
                                        const oneWeekAgo = new Date();
                                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                        return updatedAt >= oneWeekAgo;
                                    }).length}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg  flex items-center justify-center">
                                    <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                            </div>


                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div><p className="text-gray-900 text-xs sm:text-sm font-medium ">Total Boards</p>
                                    <p className="text-gray-900 text-xl sm:text-2xl font-bold">{boards.length}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg  flex items-center justify-center">
                                    <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                            </div>


                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}