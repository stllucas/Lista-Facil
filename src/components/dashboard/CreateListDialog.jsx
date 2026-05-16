import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";

export default function CreateListDialog({ open, onOpenChange, onCreate }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onCreate(name.trim());
    setName("");
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[340px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-lg">Nova Lista</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-2">
          <Label
            htmlFor="list-name"
            className="text-sm text-muted-foreground mb-2 block"
          >
            Nome da lista
          </Label>
          <Input
            id="list-name"
            placeholder="Ex: Compras do Mês"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="h-12 rounded-xl text-[15px]"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="w-full h-12 rounded-xl text-[15px] font-semibold"
          >
            {loading ? "Criando..." : "Criar Lista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
