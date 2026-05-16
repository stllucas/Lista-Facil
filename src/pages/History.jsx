import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { TrendingDown, Receipt } from "lucide-react";
import HistoryCard from "@/components/history/HistoryCard";
import EmptyState from "@/components/dashboard/EmptyState";

export default function History() {
  const { user } = useAuth();

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["history-lists", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(
        collection(db, "historico_gastos"),
        where("id_usuario", "==", user.uid),
      );
      const snap = await getDocs(q);

      const historyData = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          let listName = "Lista Removida";
          if (data.id_lista) {
            const listSnap = await getDoc(doc(db, "listas", data.id_lista));
            if (listSnap.exists()) listName = listSnap.data().nome_lista;
          }
          return {
            id: d.id,
            ...data,
            name: listName,
            status: "completed",
            actual_total: data.valor_total_final,
            estimated_total: data.valor_total_final,
            completed_date: data.data_conclusao?.toDate()?.toISOString(),
          };
        }),
      );
      return historyData.sort(
        (a, b) =>
          (b.data_conclusao?.toMillis() || 0) -
          (a.data_conclusao?.toMillis() || 0),
      );
    },
    enabled: !!user,
  });

  const completedLists = lists;

  const stats = useMemo(() => {
    let totalSpent = 0;
    let totalEstimated = 0;
    completedLists.forEach((list) => {
      totalSpent += list.actual_total || 0;
      totalEstimated += list.estimated_total || 0;
    });
    return {
      totalSpent,
      totalSaved: totalEstimated - totalSpent,
      count: completedLists.length,
    };
  }, [completedLists]);

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          Histórico
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Suas compras finalizadas
        </p>
      </div>

      {/* Stats */}
      {completedLists.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground font-medium">
                Total Gasto
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">
              R$ {stats.totalSpent.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {stats.count} {stats.count === 1 ? "compra" : "compras"}
            </p>
          </div>
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-[11px] text-primary font-medium">
                Economizado
              </span>
            </div>
            <p className="text-xl font-bold text-primary">
              R$ {stats.totalSaved.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              vs. estimado
            </p>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : completedLists.length === 0 ? (
        <EmptyState
          title="Nenhuma compra finalizada"
          description="Finalize uma lista de compras para ver seu histórico aqui."
        />
      ) : (
        <div className="space-y-2.5">
          {completedLists.map((list) => (
            <HistoryCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}
