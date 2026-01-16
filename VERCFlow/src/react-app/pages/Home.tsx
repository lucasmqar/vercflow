import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Building2, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isPending, redirectToLogin } = useAuth();

  useEffect(() => {
    if (!isPending) {
      if (user) {
        navigate("/dashboard");
      }
    }
  }, [user, isPending, navigate]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center gap-4 mb-8 p-4 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">VERCFlow</h1>
              <p className="text-blue-100 text-sm">Gestão de Projetos de Engenharia</p>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Gerencie seus projetos
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              com excelência
            </span>
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Plataforma completa para gestão de projetos de arquitetura e engenharia.
            Organize disciplinas, acompanhe tarefas e gerencie solicitações com eficiência.
          </p>

          {/* CTA Button */}
          <button
            onClick={redirectToLogin}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
          >
            <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            Começar Agora
          </button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={Zap}
              title="Rápido e Intuitivo"
              description="Interface moderna e fácil de usar para máxima produtividade"
            />
            <FeatureCard
              icon={Shield}
              title="Seguro e Confiável"
              description="Seus dados protegidos com a melhor tecnologia"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Acompanhamento Total"
              description="Visualize o progresso de todas as suas obras em tempo real"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all group">
      <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-blue-100">{description}</p>
    </div>
  );
}
