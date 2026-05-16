import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_LABELS = {
  alimentos: "Alimentos",
  limpeza: "Limpeza",
  higiene: "Higiene",
  bebidas: "Bebidas",
  hortifruti: "Hortifruti",
  carnes: "Carnes",
  padaria: "Padaria",
  outros: "Outros",
};

const CATEGORY_COLORS = {
  alimentos: "bg-primary/10 text-primary",
  limpeza: "bg-blue-50 text-blue-600",
  higiene: "bg-purple-50 text-purple-600",
  bebidas: "bg-amber-50 text-amber-600",
  hortifruti: "bg-emerald-50 text-emerald-600",
  carnes: "bg-red-50 text-red-600",
  padaria: "bg-orange-50 text-orange-600",
  outros: "bg-muted text-muted-foreground",
};

export default function ShoppingItemCard({
  item,
  onToggle,
  onDelete,
  readOnly,
}) {
  const subtotal = (item.quantity || 1) * (item.estimated_price || 0);

  return (
    <div
      className={`flex items-center gap-3 p-3.5 bg-card rounded-xl border border-border transition-all duration-200 ${
        item.purchased ? "opacity-60" : ""
      }`}
    >
      {!readOnly && (
        <Checkbox
          checked={item.purchased}
          onCheckedChange={() => onToggle(item)}
          className="w-5 h-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-sm font-medium truncate ${item.purchased ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
            {item.name}
          </span>
          <Badge
            variant="secondary"
            className={`text-[9px] px-1.5 py-0 shrink-0 ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.outros}`}
          >
            {CATEGORY_LABELS[item.category] || "Outros"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{item.quantity}x</span>
          {item.estimated_price > 0 && (
            <>
              <span>R$ {item.estimated_price.toFixed(2)}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="font-medium text-foreground">
                R$ {subtotal.toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>

      {!readOnly && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item)}
          className="w-8 h-8 text-muted-foreground hover:text-destructive shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}
