import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListCard from "@/components/dashboard/ListCard";
import CreateListDialog from "@/components/dashboard/CreateListDialog";
import EmptyState from "@/components/dashboard/EmptyState";
import plusIcon from "@/icons/plus.png";

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["shopping-lists", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(
        collection(db, "listas"),
        where("id_usuario", "==", user.uid),
      );
      const snap = await getDocs(q);
      return snap.docs
        .map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            name: d.nome_lista,
            status: d.ativa ? "active" : "completed",
          };
        })
        .sort(
          (a, b) =>
            (b.data_criacao?.toMillis?.() || 0) -
            (a.data_criacao?.toMillis?.() || 0),
        );
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (/** @type {string} */ name) =>
      addDoc(collection(db, "listas"), {
        nome_lista: name,
        id_usuario: user?.uid,
        data_criacao: serverTimestamp(),
        ativa: true,
        total_compra: 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
      setShowCreate(false);
    },
  });

  const activeLists = lists.filter((l) => l.ativa === true);
  const completedLists = lists.filter((l) => l.ativa === false);

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              Lista+Fácil
            </h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">
              Suas compras organizadas
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          variant="secondary"
          className="w-14 h-14 rounded-xl shadow-sm border border-border"
        >
          <img
            src={plusIcon}
            alt="Nova Lista"
            className="w-8 h-8 object-contain"
          />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : lists.length === 0 ? (
        <EmptyState
          title="Nenhuma lista ainda"
          description="Crie sua primeira lista de compras e comece a economizar!"
        />
      ) : (
        <div className="space-y-6">
          {activeLists.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                Listas Ativas ({activeLists.length})
              </h2>
              <div className="space-y-2.5">
                {activeLists.map((list) => (
                  <ListCard key={list.id} list={list} />
                ))}
              </div>
            </section>
          )}

          {completedLists.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                Histórico ({completedLists.length})
              </h2>
              <div className="space-y-2.5">
                {completedLists.slice(0, 3).map((list) => (
                  <ListCard key={list.id} list={list} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <CreateListDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={(/** @type {string} */ name) =>
          createMutation.mutateAsync(name)
        }
      />
    </div>
  );
}
