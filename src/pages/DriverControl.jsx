import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Car, DollarSign, Fuel, Gift, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Car,
    title: "Sistema de Corridas",
    description: "Cadastro de corridas com tempo em segundos (HH:MM:SS), cálculos automáticos de R$/Km e R$/Hora, filtros por período e ações de editar/excluir.",
  },
  {
    icon: DollarSign,
    title: "Sistema de Receitas",
    description: "Receita total (corridas + recompensas), receita separada por aplicativo (Uber, 99), card dedicado para ganhos com tarefas/recompensas.",
  },
  {
    icon: Fuel,
    title: "Sistema de Abastecimentos",
    description: "Controle de combustível (álcool, gasolina, diesel), cálculo automático de valor total, média km/L baseada em abastecimentos anteriores, controle de quilometragem.",
  },
  {
    icon: Gift,
    title: "Sistema de Recompensas",
    description: "Tarefas, promoções e recompensas dos aplicativos, integração com receita por aplicativo, controle separado de ganhos extras.",
  },
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "Interface responsiva com Bootstrap, cards com métricas principais, tabelas com formulários inline, filtros dinâmicos por período, ícones dos aplicativos.",
  },
];

export default function DriverControl() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Car className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">LMS Tech</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/#servicos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Serviços
            </Link>
            <Button asChild>
              <Link to="/#contato">Contato</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/#servicos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Serviços
          </Link>
          <h1 className="text-4xl font-bold mb-4">DriverControl</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sistema completo de controle de corridas para motoristas de aplicativos (Uber, 99, etc.)
          </p>
        </div>

        {/* Main Image */}
        <div className="mb-12">
          <img
            src="/DriverControl.png"
            alt="DriverControl Dashboard"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-card rounded-lg border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Technologies */}
        <div className="bg-card rounded-lg border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Tecnologias Utilizadas</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Django 5.2.7", "Python 3.12", "Bootstrap 5.3.3", "Font Awesome 6.5.2", "SQLite"].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Interessado em um sistema personalizado?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Desenvolvemos soluções sob medida para o seu negócio. Entre em contato para discutir seu projeto.
          </p>
          <Button size="lg" asChild>
            <Link to="/#contato">Solicitar Desenvolvimento</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}