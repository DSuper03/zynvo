"use client";
import { useState, useEffect } from "react";
import clubs from "@/utils/constants/constants";
import PostModal from "../Forms/postModal";// Adjust the path based on your project structure


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [hoveredClub, setHoveredClub] = useState<string | null>(null);
    const [expandedClubs, setExpandedClubs] = useState(false);
    const [visibleClubs, setVisibleClubs] = useState<number>(5);
    const [isScrolled, setIsScrolled] = useState(false);
    

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleClubsExpansion = () => {
        setExpandedClubs(!expandedClubs);
        setVisibleClubs(expandedClubs ? 5 : Array.from(clubs).length);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        const debouncedHandleScroll = debounce(handleScroll, 100);
        window.addEventListener("scroll", debouncedHandleScroll);
        return () => window.removeEventListener("scroll", debouncedHandleScroll);
    }, []);

    function debounce<T extends unknown[]>(func: (...args: T) => void, wait: number) {
        let timeout: NodeJS.Timeout;
        return (...args: T) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    const renderClubs = () => {
        const clubsArray = Array.from(clubs);
        const clubsToShow = clubsArray.slice(0, visibleClubs);

        return (
            <div className="mt-4 space-y-1">
                {clubsToShow.map((club) => (
                    <div
                        key={club}
                        className={`text-sm p-2 rounded cursor-pointer transition-colors duration-200 ${
                            hoveredClub === club ? "bg-indigo-700" : "hover:bg-gray-700"
                        }`}
                        onMouseEnter={() => setHoveredClub(club)}
                        onMouseLeave={() => setHoveredClub(null)}
                    >
                        <div className="flex items-center">
                            <span className="mr-2">🏛️</span>
                            <span className="truncate">{club}</span>
                        </div>
                    </div>
                ))}
                {clubs.size > 5 && (
                    <button
                        onClick={toggleClubsExpansion}
                        className="text-xs text-indigo-300 mt-1 hover:underline hover:text-indigo-200 transition-colors duration-200"
                    >
                        {expandedClubs ? "Show less" : `Show more (${clubs.size - 5})`}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div
                className={`bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col ${
                    isSidebarOpen ? "w-64" : "w-0 md:w-16"
                }`}
            >
                <div className={`p-4 ${isSidebarOpen ? "" : "hidden md:block"}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-indigo-200">Zynvo</h2>
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded hover:bg-gray-700"
                            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                        >
                            {isSidebarOpen ? "◀" : "▶"}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <div className="p-4">
                        {isSidebarOpen ? (
                            <div className="space-y-6">
                                <nav>
                                    <ul className="space-y-2">
                                        <li>
                                            <a
                                                href="/feed"
                                                className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
                                            >
                                                <span className="mr-3">🏠</span>
                                                <span>Home</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="/feed/explore"
                                                className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
                                            >
                                                <span className="mr-3">🔍</span>
                                                <span>Explore</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="/feed/notifications"
                                                className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
                                            >
                                                <span className="mr-3">🔔</span>
                                                <span>Notifications</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="/feed/profile"
                                                className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
                                            >
                                                <span className="mr-3">👤</span>
                                                <span>Profile</span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-indigo-200 flex items-center">
                                        <span className="mr-2">🏛️</span>
                                        Clubs & Societies
                                    </h3>
                                    {renderClubs()}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center pt-4 space-y-4">
                                <a
                                    href="/feed"
                                    className="p-3 hover:bg-gray-700 rounded-full transition-colors duration-200"
                                >
                                    🏠
                                </a>
                                <a
                                    href="/feed/explore"
                                    className="p-3 hover:bg-gray-700 rounded-full transition-colors duration-200"
                                >
                                    🔍
                                </a>
                                <a
                                    href="/feed/notifications"
                                    className="p-3 hover:bg-gray-700 rounded-full transition-colors duration-200"
                                >
                                    🔔
                                </a>
                                <a
                                    href="/feed/profile"
                                    className="p-3 hover:bg-gray-700 rounded-full transition-colors duration-200"
                                >
                                    👤
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`p-4 border-t border-gray-700 ${isSidebarOpen ? "" : "hidden md:block"}`}>
                    {isSidebarOpen ? (
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-2">
                                <span>👤</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium">User Name</div>
                                <div className="text-xs text-gray-400">@username</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                <span>👤</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative">
                {/* Add Post Button - Fixed position */}
                <PostModal
  triggerButton={
    <button className="fixed top-3 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center z-20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  }
/>
                <div
                    className={`p-4 sticky top-0 z-10 bg-black shadow-sm transition-all duration-300 ${
                        isScrolled ? "py-2" : "py-4"
                    }`}
                >
                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
                        aria-label="Toggle Sidebar"
                    >
                        ☰
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}