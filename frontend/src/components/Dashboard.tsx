import React, { useState, useEffect, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaGithub, FaBook, FaStar, FaCodeBranch, FaExclamationCircle,
    FaPlus, FaUser, FaCog, FaBell, FaSignOutAlt, FaSearch
} from 'react-icons/fa';
import { BiGitPullRequest } from 'react-icons/bi';
import { CgGitFork } from 'react-icons/cg';
import axios from 'axios';
import { useAuth } from '../context/authContext';

interface Repository {
    id: string;
    name: string;
    description: string;
    stars: number;
    forks: number;
    issues: number;
    language: string;
    updatedAt: string;
    isPrivate: boolean;
}

interface Activity {
    id: string;
    type: 'commit' | 'issue' | 'pr' | 'fork' | 'star';
    repo: string;
    message: string;
    time: string;
    user: string;
}

const Dashboard = (): ReactElement => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'repositories' | 'projects'>('overview');
    if (!auth) {
        // Handle the case when auth context is not available
        return <div>Loading authentication...</div>;
    }
    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
    const { isAuthenticated } = auth;
    // Language colors
    const languageColors: Record<string, string> = {
        "JavaScript": "#f1e05a",
        "TypeScript": "#3178c6",
        "Python": "#3572A5",
        "Java": "#b07219",
        "C++": "#f34b7d",
        "Go": "#00ADD8",
        "Rust": "#dea584",
        "Ruby": "#701516",
        "PHP": "#4F5D95",
        "HTML": "#e34c26",
        "CSS": "#563d7c"
    };

    // Mock data - replace with API calls
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // In a real app, fetch from your backend
                // const repoResponse = await axios.get(`${BACKEND_URL}/api/repos`);
                // const activityResponse = await axios.get(`${BACKEND_URL}/api/activities`);

                // Mock data
                const mockRepositories: Repository[] = [
                    {
                        id: "1",
                        name: "react-github-clone",
                        description: "A clone of GitHub built with React and TypeScript",
                        stars: 28,
                        forks: 12,
                        issues: 3,
                        language: "TypeScript",
                        updatedAt: "Updated 2 days ago",
                        isPrivate: false
                    },
                    {
                        id: "2",
                        name: "node-auth-api",
                        description: "Authentication API built with Node.js and Express",
                        stars: 17,
                        forks: 5,
                        issues: 1,
                        language: "JavaScript",
                        updatedAt: "Updated 1 week ago",
                        isPrivate: false
                    },
                    {
                        id: "3",
                        name: "personal-website",
                        description: "My personal portfolio website",
                        stars: 8,
                        forks: 2,
                        issues: 0,
                        language: "HTML",
                        updatedAt: "Updated 3 weeks ago",
                        isPrivate: true
                    },
                    {
                        id: "4",
                        name: "python-data-science",
                        description: "Data science projects and notebooks",
                        stars: 45,
                        forks: 23,
                        issues: 5,
                        language: "Python",
                        updatedAt: "Updated yesterday",
                        isPrivate: false
                    }
                ];

                const mockActivities: Activity[] = [
                    {
                        id: "1",
                        type: "commit",
                        repo: "react-github-clone",
                        message: "Add responsive dashboard layout",
                        time: "1 day ago",
                        user: "johndoe"
                    },
                    {
                        id: "2",
                        type: "issue",
                        repo: "node-auth-api",
                        message: "Fix session timeout issue",
                        time: "3 days ago",
                        user: "janedoe"
                    },
                    {
                        id: "3",
                        type: "pr",
                        repo: "react-github-clone",
                        message: "Implement dark mode toggle",
                        time: "5 days ago",
                        user: "johndoe"
                    },
                    {
                        id: "4",
                        type: "fork",
                        repo: "python-data-science",
                        message: "Forked from original/repo",
                        time: "1 week ago",
                        user: "newdev"
                    },
                    {
                        id: "5",
                        type: "star",
                        repo: "node-auth-api",
                        message: "Starred repository",
                        time: "2 weeks ago",
                        user: "webdev123"
                    }
                ];

                setRepositories(mockRepositories);
                setActivities(mockActivities);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/auth/logout`);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Activity icon component
    const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
        switch (type) {
            case 'commit': return <FaCodeBranch className="text-green-500" />;
            case 'issue': return <FaExclamationCircle className="text-purple-500" />;
            case 'pr': return <BiGitPullRequest className="text-blue-500" />;
            case 'fork': return <CgGitFork className="text-orange-500" />;
            case 'star': return <FaStar className="text-yellow-500" />;
            default: return null;
        }
    };
    if (!isAuthenticated) {
        return <div className='text-white'>Not authenticated</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
            {/* Header navigation */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-16 justify-between">
                        <div className="flex items-center">
                            <FaGithub className="h-8 w-8 text-white" />
                            <div className="ml-4 relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search or jump to..."
                                        className="bg-gray-900 text-sm rounded-md py-1.5 pl-3 pr-10 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <div className="border border-gray-600 rounded text-xs px-1 text-gray-400">/</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="text-gray-400 hover:text-gray-200">
                                <FaBell className="h-5 w-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-200">
                                <FaPlus className="h-5 w-5" />
                            </button>
                            <div className="relative group">
                                <button className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-200">
                                        <FaUser className="h-4 w-4" />
                                    </div>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg hidden group-hover:block z-10">
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Your profile</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Your repositories</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</a>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                {/* Profile section */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left sidebar - Profile */}
                    <div className="md:w-1/4">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="h-64 w-64 rounded-full bg-gray-700 mb-4 flex items-center justify-center">
                                <FaUser className="h-24 w-24 text-gray-500" />
                            </div>
                            <h1 className="text-2xl font-bold">John Doe</h1>
                            <p className="text-gray-400 mb-4">johndoe</p>
                            <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-md px-3 py-1.5 w-full text-sm font-medium">
                                Edit profile
                            </button>

                            <div className="mt-4 w-full">
                                <div className="flex items-center space-x-2 mb-2 text-sm">
                                    <FaUser className="text-gray-500" />
                                    <span>8 followers · 12 following</span>
                                </div>
                                <div className="flex items-center space-x-2 mb-2 text-sm">
                                    <FaStar className="text-gray-500" />
                                    <span>24 stars received</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right content area */}
                    <div className="md:w-3/4">
                        {/* Navigation tabs */}
                        <div className="border-b border-gray-700 mb-6">
                            <nav className="flex space-x-6">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`pb-3 px-1 ${activeTab === 'overview'
                                        ? 'border-b-2 border-orange-500 font-medium'
                                        : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('repositories')}
                                    className={`pb-3 px-1 ${activeTab === 'repositories'
                                        ? 'border-b-2 border-orange-500 font-medium'
                                        : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    Repositories <span className="ml-1 bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full text-xs">
                                        {repositories.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('projects')}
                                    className={`pb-3 px-1 ${activeTab === 'projects'
                                        ? 'border-b-2 border-orange-500 font-medium'
                                        : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    Projects
                                </button>
                            </nav>
                        </div>

                        {/* Overview Tab Content */}
                        {activeTab === 'overview' && (
                            <div>
                                <h2 className="text-lg font-medium mb-4">Recent activity</h2>
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="border border-gray-700 rounded-md p-4 bg-gray-800">
                                            <div className="flex items-start">
                                                <div className="mr-3 mt-1">
                                                    <ActivityIcon type={activity.type} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="font-medium">{activity.user}</span>
                                                        <span className="text-gray-400">in</span>
                                                        <span className="text-blue-400 hover:underline">{activity.repo}</span>
                                                    </div>
                                                    <p className="text-sm mt-1">{activity.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h2 className="text-lg font-medium mb-4 mt-8">Popular repositories</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {repositories.slice(0, 4).map((repo) => (
                                        <div key={repo.id} className="border border-gray-700 rounded-md p-4 bg-gray-800">
                                            <div className="flex justify-between">
                                                <a href="#" className="text-blue-400 font-medium hover:underline">{repo.name}</a>
                                                <span className="text-xs bg-gray-900 text-gray-400 px-2 py-0.5 rounded-full">
                                                    {repo.isPrivate ? 'Private' : 'Public'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{repo.description}</p>
                                            <div className="flex items-center mt-4 text-xs text-gray-400 space-x-4">
                                                {repo.language && (
                                                    <div className="flex items-center">
                                                        <span
                                                            className="h-3 w-3 rounded-full mr-1"
                                                            style={{ backgroundColor: languageColors[repo.language] || '#ccc' }}
                                                        ></span>
                                                        <span>{repo.language}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center">
                                                    <FaStar className="mr-1" />
                                                    <span>{repo.stars}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <CgGitFork className="mr-1" />
                                                    <span>{repo.forks}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Repositories Tab Content */}
                        {activeTab === 'repositories' && (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Find a repository..."
                                            className="bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-3 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-md px-3 py-1.5 text-sm font-medium flex items-center">
                                            <span>Type</span>
                                            <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-md px-3 py-1.5 text-sm font-medium flex items-center">
                                            <span>Sort</span>
                                            <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1.5 text-sm font-medium flex items-center">
                                            <FaBook className="mr-2" />
                                            <span>New</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {repositories.map((repo) => (
                                        <div key={repo.id} className="border border-gray-700 rounded-md p-4 bg-gray-800">
                                            <div className="flex flex-col md:flex-row justify-between">
                                                <div>
                                                    <div className="flex items-center">
                                                        <a href="#" className="text-blue-400 font-medium text-lg hover:underline">{repo.name}</a>
                                                        <span className="ml-2 text-xs bg-gray-900 text-gray-400 px-2 py-0.5 rounded-full">
                                                            {repo.isPrivate ? 'Private' : 'Public'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
                                                    <div className="flex flex-wrap items-center mt-4 text-xs text-gray-400 space-x-4">
                                                        {repo.language && (
                                                            <div className="flex items-center">
                                                                <span
                                                                    className="h-3 w-3 rounded-full mr-1"
                                                                    style={{ backgroundColor: languageColors[repo.language] || '#ccc' }}
                                                                ></span>
                                                                <span>{repo.language}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center">
                                                            <FaStar className="mr-1" />
                                                            <span>{repo.stars}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <CgGitFork className="mr-1" />
                                                            <span>{repo.forks}</span>
                                                        </div>
                                                        <div className="text-gray-500">{repo.updatedAt}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 md:mt-0">
                                                    <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 rounded-md px-3 py-1 text-sm flex items-center">
                                                        <FaStar className="mr-1" />
                                                        <span>Star</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects Tab Content */}
                        {activeTab === 'projects' && (
                            <div className="text-center py-12">
                                <div className="inline-block p-6 bg-gray-800 rounded-lg border border-gray-700">
                                    <h3 className="text-xl font-medium mb-2">Create a new project</h3>
                                    <p className="text-gray-400 mb-4">Organize, track, and plan your work</p>
                                    <button className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm font-medium">
                                        Create project
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <FaGithub className="h-6 w-6 text-gray-500" />
                            <span className="ml-2 text-gray-500">© {new Date().getFullYear()} GitHub Clone</span>
                        </div>
                        <div className="flex space-x-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-gray-300">Terms</a>
                            <a href="#" className="hover:text-gray-300">Privacy</a>
                            <a href="#" className="hover:text-gray-300">Security</a>
                            <a href="#" className="hover:text-gray-300">Status</a>
                            <a href="#" className="hover:text-gray-300">Help</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;