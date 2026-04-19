import React, { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Wifi, Users, Truck, ArrowRight, Cpu, Code, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import manutencaoImg from "/Manutenção.jpg";
import pcGamerImg from "/pc gamer.avif";
import redeImg from "/rede.webp";
import buscarImg from "/buscar.webp";
import assessoriaImg from "/assessoria.jpg";
import desenvolvimentoImg from "/desenvolvimento.avif";

const services = [
  {
    icon: Monitor,
    title: "Manutenção de Computadores e Notebooks",
    description:
      "Diagnóstico completo, limpeza interna, troca de componentes, formatação, otimização do sistema e backup de dados.",
    features: ["Diagnóstico gratuito", "Peças com garantia", "Atendimento rápido"],
    image: manutencaoImg,
  },
  {
    icon: Cpu,
    title: "Customização de Máquinas",
    description:
      "Montagem de PCs gamers, estações para CAD, renderização e configurações personalizadas conforme sua necessidade e orçamento.",
    features: ["PC Gamer", "Estações CAD/Render", "Configuração sob medida"],
    image: pcGamerImg,
  },
  {
    icon: Wifi,
    title: "Instalação de Rede Cabeada e Wi-Fi",
    description:
      "Projeto e instalação de infraestrutura de rede para empresas e residências. Configuração de roteadores e access points.",
    features: ["Projeto personalizado", "Cobertura Wi-Fi"],
    image: redeImg,
  },
  {
    icon: Truck,
    title: "Busca e Entrega do Equipamento",
    description:
      "Comodidade total para você! Buscamos o seu computador ou notebook no endereço desejado, realizamos o diagnóstico e o serviço e entregamos de volta. Sem você precisar sair de casa ou do trabalho.",
    features: ["Coleta no seu endereço", "Entrega após o conserto", "Agendamento pelo WhatsApp"],
    image: buscarImg,
  },
  {
    icon: Users,
    title: "Assessoria Personalizada",
    description:
      "Consultoria técnica especializada para identificar as melhores soluções tecnológicas para o seu negócio. Planejamento, implantação e suporte contínuo.",
    features: ["Análise de necessidades", "Plano sob medida", "Suporte contínuo"],
    image: assessoriaImg,
  },
  {
    icon: Code,
    title: "Desenvolvimento de Sites e Apps",
    description:
      "Desenvolvemos websites responsivos, sistemas web e aplicativos móveis. Cada projeto é analisado individualmente para oferecer a melhor solução de acordo com a necessidade de cada cliente. Vendas online, gestão empresarial e presença digital, garantindo usabilidade, performance e resultados excepcionais.",
    features: ["Websites responsivos", "Apps móveis", "Sistemas web", "Análise personalizada"],
    image: desenvolvimentoImg,
  },
];

const portfolioProjects = [
  {
    title: "E-commerce para Loja de Roupas",
    description: "Website responsivo com catálogo de produtos, carrinho de compras e integração com pagamentos online.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "/solução.jpg", // placeholder
    link: "#",
  },
  {
    title: "App de Delivery para Restaurante",
    description: "Aplicativo móvel para pedidos online, rastreamento em tempo real e sistema de fidelidade.",
    technologies: ["React Native", "Firebase", "Google Maps"],
    image: "/pc gamer.avif", // placeholder
    link: "#",
  },
  {
    title: "Sistema de Gestão Empresarial",
    description: "Plataforma web para controle financeiro, estoque e relatórios personalizados para PME.",
    technologies: ["Vue.js", "Laravel", "MySQL"],
    image: "/Manutenção.jpg", // placeholder
    link: "#",
  },
  {
    title: "UberControl - Controle de Corridas",
    description: "Sistema completo para motoristas de Uber e 99 controlarem corridas, receitas e despesas. Cadastre corridas com cálculos automáticos de R$/Km e R$/Hora, controle gastos por veículo, abastecimentos e recompensas dos apps. Dashboard intuitivo com relatórios por período.",
    technologies: ["Django", "Python", "Bootstrap", "SQLite"],
    image: "/rede.webp", // placeholder
    link: "#",
  },
];

export default function ServicesSection() {
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  return (
    <section id="servicos" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            O que fazemos
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Soluções completas em tecnologia com qualidade, agilidade e o melhor custo-benefício.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <ul className="space-y-1.5 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-foreground">
                        <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="w-2 h-2 text-primary" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {service.title === "Desenvolvimento de Sites e Apps" && (
                    <Button
                      size="sm"
                      onClick={() => setPortfolioOpen(true)}
                      className="w-full"
                    >
                      Ver Portfólio
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Portfolio Modal */}
        <Dialog open={portfolioOpen} onOpenChange={setPortfolioOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Nosso Portfólio de Desenvolvimento
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolioProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2">{project.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Ver Projeto
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}