import { useAuth } from "@/lib/AuthContext";
import { User, LogOut, Leaf, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="px-4 pt-6">
      <h1 className="text-lg font-bold text-foreground tracking-tight mb-6">
        Perfil
      </h1>

      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {user?.displayName || "Usuário"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email || "Sem e-mail"}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 rounded-xl">
          <Leaf className="w-5 h-5 text-primary" />
          <ShoppingBag className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Lista+Fácil</p>
            <p className="text-xs text-muted-foreground">
              Organize, planeje e economize
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => logout()}
          className="w-full h-12 rounded-xl gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
        >
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}
