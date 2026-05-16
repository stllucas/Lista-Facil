import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ListFooter({
  total,
  purchasedTotal,
  itemCount,
  purchasedCount,
  onFinalize,
  isActive,
}) {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {purchasedCount}/{itemCount} itens comprados
            </p>
            <p className="text-xl font-bold text-foreground">
              R$ {total.toFixed(2)}
            </p>
          </div>
          {isActive && (
            <Button
              onClick={onFinalize}
              variant="outline"
              className="rounded-xl h-10 gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar
            </Button>
          )}
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary rounded-full h-1.5 transition-all duration-500"
            style={{
              width:
                itemCount > 0 ? `${(purchasedCount / itemCount) * 100}%` : "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
