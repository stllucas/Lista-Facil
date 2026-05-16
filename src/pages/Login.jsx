import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm bg-card p-8 rounded-3xl shadow-sm border border-border flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Leaf className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Lista+Fácil</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Faça login para organizar suas compras
        </p>

        <Button
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Entrar com Google
        </Button>
      </div>
    </div>
  );
}
