import React from "react";
import { motion } from "framer-motion";
import { Monitor, Wifi, Users, Truck, ArrowRight, Cpu } from "lucide-react";

import manutencaoImg from "/Manutenção.jpg";
import pcGamerImg from "/pc gamer.avif";
import redeImg from "/rede.webp";
import buscarImg from "/buscar.webp";
import assessoriaImg from "/assessoria.jpg";

const services = [
  {
    icon: Monitor,
    title: "Manutenção de Computadores e Notebooks",
    description:
      "Diagnóstico completo, reparo de hardware e software, limpeza interna, troca de componentes, formatação e recuperação de dados. Atendemos todas as marcas.",
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
      "Projeto e instalação de infraestrutura de rede completa para empresas e residências. Cabeamento estruturado, configuração de roteadores e access points.",
    features: ["Projeto personalizado", "Cabeamento Cat5e/Cat6", "Cobertura total Wi-Fi"],
    image: redeImg,
  },
  {
    icon: Truck,
    title: "Busca e Entrega do Equipamento",
    description:
      "Comodidade total para você! Buscamos o seu computador ou notebook no endereço desejado, realizamos o serviço e entregamos de volta. Sem você precisar sair de casa ou do trabalho.",
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
];

export default function ServicesSection() {
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
                  <ul className="space-y-1.5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-foreground">
                        <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="w-2 h-2 text-primary" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}