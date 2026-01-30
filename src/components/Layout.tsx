import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Pill,
    Calendar,
    ClipboardList,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    Menu,
    LogIn,
    LogOut,
    User,
    RefreshCw,
    Map,
    Moon,
    Sun
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { googleSheetsService } from '../services/googleSheets';
import { notificationService } from '../services/notifications';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ClipboardList, label: 'Planificación', path: '/planning' },
    { icon: Calendar, label: 'Calendario', path: '/calendar' },
    { icon: Users, label: 'Clientes', path: '/clients' },
    { icon: Pill, label: 'Vademécum', path: '/inventory' },
    { icon: Map, label: 'Visitas', path: '/visits' },
    { icon: ShoppingCart, label: 'Ventas', path: '/sales' },
];

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isApiReady, setIsApiReady] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const location = useLocation();
    const { currentUser, setCurrentUser, spreadsheetId, setSpreadsheetId, setIsLoading, isLoading, syncAll, planning, theme, toggleTheme } = useStore();

    useEffect(() => {
        // Initialize Google API
        const init = async () => {
            try {
                await googleSheetsService.init();
                setIsApiReady(true);
            } catch (err) {
                console.error('Failure initializing Google API', err);
            }
        };
        init();
    }, []);

    // Set up notification checker
    useEffect(() => {
        if (currentUser && spreadsheetId && planning.length > 0) {
            notificationService.requestPermission();

            const interval = setInterval(() => {
                notificationService.checkUpcomingVisits(planning);
            }, 60000); // Check every minute

            return () => clearInterval(interval);
        }
    }, [currentUser, spreadsheetId, planning]);

    // Auto-sync when API is ready and we have a spreadsheet
    useEffect(() => {
        if (isApiReady && spreadsheetId && currentUser) {
            if (currentUser.token) {
                googleSheetsService.setToken(currentUser.token);
            }
            syncAll();
        }
    }, [isApiReady, spreadsheetId, currentUser]);

    const handleLogin = async () => {
        if (!isApiReady) {
            alert('El servicio de Google aún se está cargando. Por favor espera un momento.');
            return;
        }
        setIsLoading(true);
        try {
            const token = await googleSheetsService.authenticate();
            if (token) {
                setCurrentUser({ token });
                const id = await googleSheetsService.getOrCreateSpreadsheet();
                setSpreadsheetId(id);
            }
        } catch (err: any) {
            console.error('Login failed', err);
            handleApiError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApiError = (err: any) => {
        if (err?.error === 'invalid_client' || (typeof err === 'string' && err.includes('invalid_client'))) {
            alert('Error: El CLIENT_ID de Google es inválido. Asegúrate de haberlo configurado en src/services/googleSheets.ts');
        } else if (err?.error === 'access_denied' || (err?.details && err.details.includes('verification')) || (typeof err === 'string' && err.includes('access_denied'))) {
            alert('Error 403: Acceso Denegado. Debes añadir tu correo a la lista de "Test users" en Google Cloud Console (OAuth consent screen).');
        } else {
            alert('Hubo un error al conectar con Google Sheets. Revisa la consola para más detalles.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setSpreadsheetId(null);
    };

    // Responsive navigation items
    // Actually, for mobile let's prioritize the most important ones:
    const mobilePrimaryNav = [
        sidebarItems[0], // Dashboard
        sidebarItems[1], // Planning
        sidebarItems[5], // Visits
        sidebarItems[6], // Sales
    ];

    return (
        <div className={`flex h-screen overflow-hidden font-sans noise-surface transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
            <div className="noise-overlay" />
            {/* Sidebar (Desktop Only) */}
            <aside
                className={`${collapsed ? 'w-20' : 'w-64'
                    } hidden md:flex transition-all duration-300 ease-in-out bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex-col z-20 shadow-sm`}
            >
                <div className="p-6 flex items-center justify-between">
                    {!collapsed && (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                            FarmaCarex
                        </h1>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm shadow-indigo-100/50 dark:shadow-none'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth Section in Sidebar */}
                <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                    {currentUser ? (
                        <div className="flex flex-col gap-2">
                            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm ${collapsed ? 'justify-center' : ''}`}>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
                                    <User size={16} />
                                </div>
                                {!collapsed && <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">Perfil Conectado</span>}
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
                            >
                                <LogOut size={20} />
                                {!collapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 ${collapsed ? 'justify-center' : ''}`}
                        >
                            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <LogIn size={20} />}
                            {!collapsed && <span className="text-sm font-bold">Conectar Google</span>}
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 md:h-20 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-0">
                        {/* Mobile Logo */}
                        <div className="md:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                            <Pill size={18} />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                            {sidebarItems.find(i => i.path === location.pathname)?.label || 'FarmaCarex'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95 border border-slate-200 dark:border-white/10"
                            title={theme === 'light' ? 'Modo Noche' : 'Modo Día'}
                        >
                            {theme === 'light' ? <Moon size={18} fill="currentColor" /> : <Sun size={18} />}
                        </button>

                        {spreadsheetId && (
                            <button
                                onClick={() => syncAll()}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border transition-all duration-300 ${isLoading
                                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:scale-105 active:scale-95'
                                    }`}
                            >
                                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                                    {isLoading ? 'Sincronizando' : 'Sincronizado'}
                                </span>
                            </button>
                        )}
                        {!currentUser && (
                            <button
                                onClick={handleLogin}
                                className="md:hidden p-2 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            >
                                <LogIn size={20} />
                            </button>
                        )}
                        {currentUser && (
                            <div className="md:hidden w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                                <User size={20} className="text-slate-400" />
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-hidden h-full pb-20 md:pb-0 relative">
                    <div className="h-full overflow-y-auto scroll-smooth custom-scrollbar">
                        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in min-h-full">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Mobile Bottom Navigation Bar */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-safe-bottom bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200/60 dark:border-white/10 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-around h-16 md:h-20 max-w-lg mx-auto">
                        {mobilePrimaryNav.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 rotate-3' : ''}`}>
                                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-tighter transition-all ${isActive ? 'opacity-100 underline decoration-2 underline-offset-4' : 'opacity-70'}`}>
                                        {item.label === 'Dashboard' ? 'Inicio' : item.label}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* More Menu Toggle */}
                        <button
                            onClick={() => setIsMoreMenuOpen(true)}
                            className={`flex flex-col items-center justify-center gap-1 w-full h-full text-slate-400 hover:text-slate-600 transition-all`}
                        >
                            <div className="p-1.5 rounded-xl">
                                <Menu size={22} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Menú</span>
                        </button>
                    </div>
                </nav>

                {/* Mobile More Menu Drawer (Backdrop) */}
                {isMoreMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden animate-fade-in"
                        onClick={() => setIsMoreMenuOpen(false)}
                    >
                        {/* Drawer Content */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[32px] p-6 pb-12 shadow-2xl animate-slide-up"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-8" />

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-4">Más Opciones</h3>

                            <div className="grid grid-cols-3 gap-4">
                                {sidebarItems.map((item) => {
                                    const isPrimary = mobilePrimaryNav.some(p => p.path === item.path);
                                    if (isPrimary) return null;

                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMoreMenuOpen(false)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 active:bg-slate-100'}`}
                                        >
                                            <item.icon size={24} />
                                            <span className="text-xs font-semibold text-center leading-tight">{item.label}</span>
                                        </Link>
                                    );
                                })}

                                <div className="col-span-3 mt-4 pt-6 border-t border-slate-100">
                                    {currentUser ? (
                                        <button
                                            onClick={() => { handleLogout(); setIsMoreMenuOpen(false); }}
                                            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 font-bold"
                                        >
                                            <LogOut size={20} />
                                            Cerrar Sesión
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { handleLogin(); setIsMoreMenuOpen(false); }}
                                            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-indigo-600 text-white font-bold"
                                        >
                                            <LogIn size={20} />
                                            Conectar Google
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;
