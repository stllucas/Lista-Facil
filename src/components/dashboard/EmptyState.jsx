import { ShoppingCart } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-5">
        <ShoppingCart className="w-8 h-8 text-primary/40" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
