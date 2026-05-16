import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Clock, User } from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutGrid, label: "Listas" },
  { path: "/historico", icon: Clock, label: "Histórico" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border backdrop-blur-lg bg-opacity-95">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);

          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`}
              />
              <span
                className={`text-[10px] tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
