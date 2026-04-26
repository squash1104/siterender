import React from "react";
import { Monitor, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Monitor className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg">
                LMS <span className="text-primary">Tech</span>
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Soluções completas em tecnologia para empresas e residências.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Navegação</h4>
            <ul className="space-y-2.5">
              {["#inicio", "#servicos", "#sobre", "#contato"].map((href) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {href.replace("#", "").charAt(0).toUpperCase() +
                      href.replace("#", "").slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Serviços</h4>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li>Manutenção de PCs</li>
              <li>Manutenção de Notebooks</li>
              <li>Rede Cabeada</li>
              <li>Rede Wi-Fi</li>
              <li>Busca e Entrega</li>
              <li>Assessoria Técnica</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/60">
                <Phone className="w-4 h-4 text-primary" />
                (65) 92001-2031
              </li>
              <li className="flex items-center gap-2 text-sm text-background/60">
                <Mail className="w-4 h-4 text-primary" />
                contato@lmstech.com.br
              </li>
              <li className="flex items-start gap-2 text-sm text-background/60">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Seg-Sex: 08h–17h<br/>Fim de semana: Plantão</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/60">
                <MapPin className="w-4 h-4 text-primary" />
                Atendimento regional
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} LMS Technologies. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}