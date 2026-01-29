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
    RefreshCw
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
    { icon: Menu, label: 'Visitas', path: '/visits' },
    { icon: ShoppingCart, label: 'Ventas', path: '/sales' },
];

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isApiReady, setIsApiReady] = useState(false);
    const location = useLocation();
    const { currentUser, setCurrentUser, spreadsheetId, setSpreadsheetId, setIsLoading, isLoading, syncAll, planning } = useStore();

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
                setCurrentUser({ token }); // Simplificado
                const id = await googleSheetsService.getOrCreateSpreadsheet();
                setSpreadsheetId(id);
            }
        } catch (err: any) {
            console.error('Login failed', err);
            if (err?.error === 'invalid_client' || (typeof err === 'string' && err.includes('invalid_client'))) {
                alert('Error: El CLIENT_ID de Google es inválido. Asegúrate de haberlo configurado en src/services/googleSheets.ts');
            } else if (err?.error === 'access_denied' || (err?.details && err.details.includes('verification')) || (typeof err === 'string' && err.includes('access_denied'))) {
                alert('Error 403: Acceso Denegado. Debes añadir tu correo a la lista de "Test users" en Google Cloud Console (OAuth consent screen).');
            } else {
                alert('Hubo un error al conectar con Google Sheets. Revisa la consola para más detalles.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setSpreadsheetId(null);
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${collapsed ? 'w-20' : 'w-64'
                    } transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col z-20`}
            >
                <div className="p-6 flex items-center justify-between">
                    {!collapsed && (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            FarmaCarex
                        </h1>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth Section in Sidebar */}
                <div className="p-4 border-t border-slate-100">
                    {currentUser ? (
                        <div className="flex flex-col gap-2">
                            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 ${collapsed ? 'justify-center' : ''}`}>
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                    <User size={16} />
                                </div>
                                {!collapsed && <span className="text-sm font-medium text-slate-700 truncate">Conectado</span>}
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
                            >
                                <LogOut size={20} />
                                {!collapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 ${collapsed ? 'justify-center' : ''}`}
                        >
                            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <LogIn size={20} />}
                            {!collapsed && <span className="text-sm font-medium">Conectar Sheets</span>}
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <header className="sticky top-0 z-10 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {sidebarItems.find(i => i.path === location.pathname)?.label || 'FarmaCarex'}
                    </h2>
                    {spreadsheetId && (
                        <button
                            onClick={() => syncAll()}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isLoading
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                                }`}
                        >
                            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                            <span className="text-xs font-bold uppercase tracking-tighter">
                                {isLoading ? 'Sincronizando...' : 'Sincronizado'}
                            </span>
                        </button>
                    )}
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
