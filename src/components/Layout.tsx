import { NavLink, Outlet, Link } from 'react-router-dom';
import { Pill, FileText, ShoppingCart, History } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';

export default function Layout() {
  const itemCount = useQuoterStore((s) => s.items.reduce((acc, it) => acc + it.qty, 0));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-blue-700 flex items-center justify-center shadow-md">
              <Pill className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-blue-800">
                Farma<span className="text-red-500">Carex</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 leading-tight">
                Droguería FarmaCarex, S.A. · Guatemala
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Vademécum</span>
            </NavLink>
            <NavLink
              to="/cotizador"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cotizador</span>
              {itemCount > 0 && (
                <span className="ml-1 px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white">
                  {itemCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/historial"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      <footer className="bg-blue-800 text-blue-100 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>
              Droguería FarmaCarex, S.A. · 2 av. 11-30 Col. San Francisco II, zona 6 de Mixco, Guatemala
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Tel: (+502) 2433-5641</span>
            <span className="opacity-70">Cotizador v1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
