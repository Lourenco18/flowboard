"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, MoreHorizontal, Trello } from "lucide-react";
import { Button } from "./ui/button";
import { Arrow } from "@radix-ui/react-select";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {

    boardTitle?: string;
    oneEditBoard?: () => void;
}
export default function Navbar({ boardTitle, oneEditBoard }: Props) {
    const { isSignedIn, user } = useUser();
    const pathname = usePathname();

    const isHomePage = pathname === "/";
    const isDashboardPage = pathname === "/dashboard";
    const isBoardsPage = pathname.startsWith("/boards/");

    if (isDashboardPage) {
        return <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex item-center space-x-2">
                    <Trello className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    <span className="text-xl sm:text-exl font-bold text-gray-900">Trello Clone</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <UserButton />
                </div>
            </div>
        </header>;
    }
    if (isBoardsPage) {
        return <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 sm:py-4 ">
                <div className="flex item-center justify-between">
                    <div className="flex items.center space-x-2 sm:space-x-4 min-w-0">
                        <Link href="/dashboard" className=" flex items-center space-x-1 sm:space-x-2 flez-shrink-0">
                            <ArrowLeft className="h-4 w-4 sm:h-5 w-5 text-gray-500 hover:text-gray-900" />
                            <span className=" hidden sm:inline text-gray-500 hover:text-gray-900">Back to Dashboard</span>
                            <span className="sm:hidden text-gray-500 hover:text-gray-900">Back</span>
                        </Link>
                        <div className="h-4 sm:h-6 w-px bg-gray-300 hidden sm:block" />
                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                            <Trello className="text-blue-600" />
                            <div className="text-gray-900 text-lg items-center space-x-1 sm:space-x-2 min-w-0" >
                                <span className="text-lg font-bold text-gray-900 truncate">{boardTitle}</span>
                                {oneEditBoard && (
                                    <Button variant="ghost" size="sm" className="h-7 w-7 flex-shrink-0 p-0" onClick={oneEditBoard}><MoreHorizontal />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </header>;
    }
    return <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex item-center space-x-2">
                <Trello className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <span className="text-xl sm:text-exl font-bold text-gray-900">Trello Clone</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                {isSignedIn ? (
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                        <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                            Hello, {user?.firstName || "User"}!
                        </span>
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                Go to Dashboard <ArrowRight />
                            </Button>
                        </Link>
                    </div>)
                    : (<div>
                        <SignInButton>
                            <Button variant="ghost" size="sm" className="text-gray-900 text-xs sm:text-sm">Sign In</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">Sign Up</Button>
                        </SignUpButton>
                    </div>)}

            </div>
        </div>
    </header>;
}