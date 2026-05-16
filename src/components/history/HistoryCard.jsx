import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function HistoryCard({ list }) {
  const completedDate = list.completed_date
    ? format(new Date(list.completed_date), "dd MMM yyyy", { locale: ptBR })
    : "Data inválida";

  return (
    <Link to={`/lista/${list.id_lista}`} className="block">
      <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/20 transition-all">
        <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {list.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedDate}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-foreground">
            R$ {(list.actual_total || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
