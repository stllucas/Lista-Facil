import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import cartIcon from "@/icons/add-to-cart.png";

const CATEGORIES = [
  { value: "alimentos", label: "Alimentos" },
  { value: "limpeza", label: "Limpeza" },
  { value: "higiene", label: "Higiene" },
  { value: "bebidas", label: "Bebidas" },
  { value: "hortifruti", label: "Hortifruti" },
  { value: "carnes", label: "Carnes" },
  { value: "padaria", label: "Padaria" },
  { value: "outros", label: "Outros" },
];

export default function AddItemForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("alimentos");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onAdd({
      name: name.trim(),
      quantity: Number(quantity) || 1,
      estimated_price: Number(price) || 0,
      category,
    });
    setName("");
    setQuantity("1");
    setPrice("");
    setCategory("alimentos");
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl border border-border p-4 space-y-3"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-foreground">Novo Item</span>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Input
        placeholder="Nome do produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-11 rounded-xl"
        autoFocus
      />

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Qtd"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="h-11 rounded-xl w-20"
          min="1"
        />
        <Input
          type="number"
          placeholder="Preço (R$)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="h-11 rounded-xl flex-1"
          min="0"
          step="0.01"
        />
      </div>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="h-11 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="submit"
        disabled={!name.trim() || loading}
        className="w-full h-11 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
      >
        <img
          src={cartIcon}
          alt="Adicionar Produto"
          className="w-5 h-5 mr-2 object-contain"
        />
        {loading ? "Adicionando..." : "Adicionar"}
      </Button>
    </form>
  );
}
