import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Award, Users, Wrench } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Clientes Atendidos" },
  { icon: Wrench, value: "2.000+", label: "Equipamentos Reparados" },
  { icon: Award, value: "10", label: "Anos em Cuiabá" },
];

const values = [
  "Atendimento rápido e eficiente",
  "Profissionais com experiência",
  "Transparência nos orçamentos",
  "Peças para reposição/upgrade de qualidade",
  "Suporte pós-atendimento",
];

export default function AboutSection() {
  return (
    <section id="sobre" className="py-24 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Stats Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Quem somos
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              LMS Technologies
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Somos uma empresa especializada em soluções de tecnologia, com foco em formatação,
              manutenção, reparo de equipamentos, instalação de rede cabeada e wiireless, montagem de computadores,
              instalação de software e atendimento remoto. Atuamos em Cuiabá há mais
              de 10 anos, oferecendo assessoria técnica de qualidade.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Values Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-background rounded-2xl p-8 md:p-10 border border-border">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                Por que escolher a LMS Tech?
              </h3>
              <div className="space-y-4">
                {values.map((value) => (
                  <div key={value} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium text-sm">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}