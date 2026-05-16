import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddItemForm from "@/components/list/AddItemForm";
import ShoppingItemCard from "@/components/list/ShoppingItemCard";
import ListFooter from "@/components/list/ListFooter";
import EmptyState from "@/components/dashboard/EmptyState";
import cartIcon from "@/icons/add-to-cart.png";

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const { user } = useAuth();

  const { data: list, isLoading: listLoading } = useQuery({
    queryKey: ["list", id],
    queryFn: async () => {
      const docSnap = await getDoc(doc(db, "listas", id));
      if (!docSnap.exists()) return null;
      const d = docSnap.data();
      return {
        id: docSnap.id,
        ...d,
        name: d.nome_lista,
        status: d.ativa ? "active" : "completed",
      };
    },
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["list-items", id],
    queryFn: async () => {
      const q = collection(db, "listas", id, "itens");
      const snap = await getDocs(q);
      return snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          name: d.nome_produto,
          quantity: d.quantidade,
          estimated_price: d.preco,
          category: d.categoria,
          purchased: d.comprado,
        };
      });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (itemData) =>
      addDoc(collection(db, "listas", id, "itens"), {
        nome_produto: itemData.name,
        quantidade: itemData.quantity,
        preco: itemData.estimated_price,
        categoria: itemData.category,
        comprado: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-items", id] });
      setShowAddForm(false);
    },
  });

  const toggleItemMutation = useMutation({
    mutationFn: (item) =>
      updateDoc(doc(db, "listas", id, "itens", item.id), {
        comprado: !item.purchased,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["list-items", id] }),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (item) => deleteDoc(doc(db, "listas", id, "itens", item.id)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["list-items", id] }),
  });

  const deleteListMutation = useMutation({
    mutationFn: async () => {
      const batch = writeBatch(db);
      const itemsSnap = await getDocs(collection(db, "listas", id, "itens"));
      itemsSnap.forEach((d) => batch.delete(d.ref));
      batch.delete(doc(db, "listas", id));
      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
      navigate("/");
    },
  });

  const finalizeListMutation = useMutation({
    mutationFn: async () => {
      await updateDoc(doc(db, "listas", id), {
        ativa: false,
        total_compra: purchasedTotal,
      });
      await addDoc(collection(db, "historico_gastos"), {
        id_usuario: user.uid,
        id_lista: id,
        data_conclusao: serverTimestamp(),
        valor_total_final: purchasedTotal || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", id] });
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
      queryClient.invalidateQueries({ queryKey: ["history-lists", user?.uid] });
      setShowFinalizeDialog(false);
    },
  });

  const { total, purchasedTotal, purchasedCount } = useMemo(() => {
    let t = 0,
      pt = 0,
      pc = 0;
    items.forEach((item) => {
      const sub = (item.quantity || 1) * (item.estimated_price || 0);
      t += sub;
      if (item.purchased) {
        pt += sub;
        pc++;
      }
    });
    return { total: t, purchasedTotal: pt, purchasedCount: pc };
  }, [items]);

  const isActive = list?.status === "active";
  const isLoading = listLoading || itemsLoading;

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const cat = item.category || "outros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    // Sort: unpurchased first within each group
    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) =>
        a.purchased === b.purchased ? 0 : a.purchased ? 1 : -1,
      );
    });
    return groups;
  }, [items]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="px-4 pt-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <EmptyState
          title="Lista não encontrada"
          description="Esta lista pode ter sido removida."
        />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-36">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-xl shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">
            {list.name}
          </h1>
          <p className="text-[11px] text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-xl shrink-0"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Excluir Lista
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add Item */}
      {isActive && !showAddForm && (
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full h-12 rounded-xl border-dashed border-2 border-primary/30 text-primary hover:bg-primary/5 mb-4 font-semibold"
        >
          <img
            src={cartIcon}
            alt="Adicionar Produto"
            className="w-5 h-5 mr-2 object-contain"
          />{" "}
          Adicionar Produto
        </Button>
      )}

      {showAddForm && (
        <div className="mb-4">
          <AddItemForm
            onAdd={(data) => addItemMutation.mutateAsync(data)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Items by category */}
      {items.length === 0 ? (
        <EmptyState
          title="Lista vazia"
          description="Adicione produtos à sua lista de compras"
        />
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedItems).map(([cat, catItems]) => (
            <section key={cat}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {CATEGORY_LABELS[cat] || cat} ({catItems.length})
              </h3>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <ShoppingItemCard
                    key={item.id}
                    item={item}
                    onToggle={(i) => toggleItemMutation.mutate(i)}
                    onDelete={(i) => deleteItemMutation.mutate(i)}
                    readOnly={!isActive}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Footer Totals */}
      {items.length > 0 && (
        <ListFooter
          total={total}
          purchasedTotal={purchasedTotal}
          itemCount={items.length}
          purchasedCount={purchasedCount}
          onFinalize={() => setShowFinalizeDialog(true)}
          isActive={isActive}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[320px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lista?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os itens serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteListMutation.mutate()}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finalize Confirmation */}
      <AlertDialog
        open={showFinalizeDialog}
        onOpenChange={setShowFinalizeDialog}
      >
        <AlertDialogContent className="max-w-[320px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar compra?</AlertDialogTitle>
            <AlertDialogDescription>
              A lista será movida para o histórico com o total de R${" "}
              {purchasedTotal.toFixed(2)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => finalizeListMutation.mutate()}
              className="rounded-xl"
            >
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
