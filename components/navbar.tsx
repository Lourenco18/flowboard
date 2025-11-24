"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Trello } from "lucide-react";
import { Button } from "./ui/button";
import { Arrow } from "@radix-ui/react-select";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Navbar() {
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