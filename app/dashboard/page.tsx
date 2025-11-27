"use client";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoards";
import { useUser } from "@clerk/nextjs";
import { Loader2, Plus, Rocket, Trello, Grid3x3, List, Filter, PlusIcon, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
    const [hovered, setHovered] = useState<"grid" | "list" | null>(null);

    const { user } = useUser();
    const { createBoard, boards, loading, error } = useBoards();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

                </div>
                {/* Cards  List */}
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
                                <div><p className="text-gray-900 text-xs sm:text-sm font-medium ">Active Projects</p>
                                    <p className="text-gray-900 text-xl sm:text-2xl font-bold">{boards.length}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg  flex items-center justify-center">
                                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
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
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg  flex items-center justify-center">

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

                <div className="mb-6 sm:mb-8">
                    {/* Boards Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                            <h2>Your Boards</h2>
                            <p className="text-gray-600">Manage your boards and projects here.</p>
                        </div>


                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0">

                            <div
                                className="relative flex items-center bg-white border p-1 rounded-lg mr-2 w-full max-w-[260px]"
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* highlight animado */}
                                <div
                                    className="absolute top-1 bottom-1 left-1 rounded-md bg-black transition-all duration-450"
                                    style={{
                                        width: "calc(50% - 4px)",
                                        transform:
                                            hovered === "grid"
                                                ? "translateX(0)"
                                                : hovered === "list"
                                                    ? "translateX(100%)"
                                                    : viewMode === "grid"
                                                        ? "translateX(0)"
                                                        : "translateX(100%)",
                                    }}
                                />

                                {/* GRID */}
                                <Button
                                    className="cursor-pointer relative z-10 flex-1 flex items-center justify-center gap-1"
                                    variant="ghost"
                                    size="sm"
                                    onMouseEnter={() => setHovered("grid")}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3x3
                                        className={`
        transition-colors duration-300
        ${(hovered === "grid" || (hovered === null && viewMode === "grid"))
                                                ? "text-gray-100"
                                                : "text-gray-900"}
      `}
                                    />
                                    <span
                                        className={`
        transition-colors duration-300 text-sm hidden sm:inline
        ${(hovered === "grid" || (hovered === null && viewMode === "grid"))
                                                ? "text-gray-100"
                                                : "text-gray-900"}
      `}
                                    >
                                        Grid
                                    </span>
                                </Button>

                                {/* LIST */}
                                <Button
                                    className="cursor-pointer relative z-10 flex-1 flex items-center justify-center gap-1"
                                    variant="ghost"
                                    size="sm"
                                    onMouseEnter={() => setHovered("list")}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List
                                        className={`
        transition-colors duration-300
        ${(hovered === "list" || (hovered === null && viewMode === "list"))
                                                ? "text-gray-100"
                                                : "text-gray-900"}
      `}
                                    />
                                    <span
                                        className={`
        transition-colors duration-300 text-sm hidden sm:inline
        ${(hovered === "list" || (hovered === null && viewMode === "list"))
                                                ? "text-gray-100"
                                                : "text-gray-900"}
      `}
                                    >
                                        List
                                    </span>
                                </Button>
                            </div>


                            <span className=" hover:shadow-lg transition-shadow cursor-pointer border p-1 rounded-lg bg-white flex items-center justify-center mr-2">
                                <Button size="sm" className="flex items-center justify-center gap-2 " variant="ghost">
                                    <Filter className="text-gray-900" />
                                    <span className="text-gray-900">Filter</span>
                                </Button>
                            </span>
                            <span className=" hover:shadow-lg transition-shadow cursor-pointer border p-1 rounded-lg bg-white flex items-center justify-center mr-2">

                                <Button size="sm" className="flex items-center justify-center gap-2 " variant="ghost" onClick={handleCreateBoard}>
                                    <PlusIcon className="text-gray-900" />
                                    <span className="text-gray-900">Create Board</span>
                                </Button>
                            </span>
                        </div>
                    </div>
                    {/* Search Boards */}
                    <div className="relative mb-4 sm:mb-6">
                        <Search className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                        <Input
                            id="search"
                            placeholder="Search boards..."
                            className="placeholder:text-gray-500 pl-10"
                        />


                    </div>

                    {/* Boards List */}
                    {boards.length === 0 ? (
                        <div> No boards yet</div>

                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
                            {boards.map((board, key) => (
                                <Link href={`/boards/${board.id}`} key={key}>

                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className={`w-4 h-4 ${board.color} rounded`} />
                                                <Badge variant="secondary" className="text-xs text-gray-900 bg-gray-100" >New</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 sm:p-6">
                                            <CardTitle className="text-base sm:text-lg mb-2  text-gray-900">{board.title}</CardTitle>
                                            <CardDescription className="text-sm mb-4 text-gray-700">{board.description}</CardDescription>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-1 sm:space-y-0">
                                                <span className="text-gray-500">Created at {" "}
                                                    {new Date(board.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-gray-500">Updated at {" "}
                                                    {new Date(board.updated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>

                                    </Card>
                                </Link>
                            ))}
                            <Card onClick={handleCreateBoard} className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer  group  ">
                                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]" >

                                    <PlusIcon className="text-gray-600 h-6 w-6 sm:h-8 sm:w-8 group-hover:text-blue-600 mb-2" />
                                    <p className="text-gray-600 text-sm sm:text-base group-hover:text-blue-600">Create New Board</p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div >
                            {boards.map((board, key) => (
                                <div key={key} className={`${key > 0 ? "mt-4" : ""}`}>
                                    <Link href={`/boards/${board.id}`} key={key}>

                                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div className={`w-4 h-4 ${board.color} rounded`} />
                                                    <Badge variant="secondary" className="text-xs text-gray-900 bg-gray-100" >New</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 sm:p-6">
                                                <CardTitle className="text-base sm:text-lg mb-2  text-gray-900">{board.title}</CardTitle>
                                                <CardDescription className="text-sm mb-4 text-gray-700">{board.description}</CardDescription>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-1 sm:space-y-0">
                                                    <span className="text-gray-500">Created at {" "}
                                                        {new Date(board.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-gray-500">Updated at {" "}
                                                        {new Date(board.updated_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </CardContent>

                                        </Card>
                                    </Link>
                                </div>
                            ))}
                            <Card onClick={handleCreateBoard} className="mt-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer  group  ">
                                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]" >

                                    <PlusIcon className="text-gray-600 h-6 w-6 sm:h-8 sm:w-8 group-hover:text-blue-600 mb-2" />
                                    <p className="text-gray-600 text-sm sm:text-base group-hover:text-blue-600">Create New Board</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}



                </div>
            </main >
        </div >
    );
}