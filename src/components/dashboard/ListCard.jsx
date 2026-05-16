import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ListCard({ list }) {
  const isActive = list.status === "active";
  const createdDate = list.data_criacao
    ? format(list.data_criacao.toDate(), "dd MMM yyyy", { locale: ptBR })
    : "";

  return (
    <Link to={`/lista/${list.id}`} className="group block">
      <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isActive
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isActive ? (
            <ShoppingCart className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate text-[15px]">
              {list.name}
            </h3>
            <Badge
              variant="secondary"
              className={`text-[10px] px-2 py-0 shrink-0 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isActive ? "Ativa" : "Concluída"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{createdDate}</span>
            {!isActive && list.total_compra > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="font-medium text-foreground">
                  R$ {list.total_compra.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </Link>
  );
}
