import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Início", href: "#inicio", internal: true },
  { label: "Serviços", href: "#servicos", internal: true },
  { label: "Sobre", href: "#sobre", internal: true },
  { label: "Peças", href: "/pecas", internal: false },
  { label: "Acesso Restrito", href: "/admin", internal: false },
  { label: "Contato", href: "#contato", internal: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl shadow-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Monitor className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight text-foreground">
                LMS <span className="text-primary">Tech</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.internal ? (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <Button onClick={() => scrollTo("#contato")} size="sm">
              Fale Conosco
            </Button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) =>
                link.internal ? (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
 