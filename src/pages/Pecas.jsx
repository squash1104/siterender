import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Monitor, ShoppingCart } from "lucide-react";

const categories = [
  "Todos",
  "Memória RAM",
  "HD / SSD",
  "Processador",
  "Placa-mãe",
  "Fonte",
  "Placa de Vídeo",
  "Teclado",
  "Mouse",
  "Outros",
];

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
];

export default function Pecas() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pecas");
      setProducts(stored ? JSON.parse(stored) : []);
    } catch {
      setProducts([]);
    }
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(search.toLowerCase()) ||
      product.descricao.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todos" || product.categoria === category;
    return matchesSearch && matchesCategory && product.disponivel;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">LMS Tech</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Title */}
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Nossas Peças</h1>
          <p className="mt-1 text-primary-foreground/80">
            Compre em партreadores confiáveis
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} produto(s) encontrado(s)
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Tente buscar por outro termo ou categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <a
                key={product.id}
                href={product.link_compra}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.imagem_url}
                    alt={product.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">{product.categoria}</p>
                  <h3 className="font-medium text-sm text-foreground line-clamp-2">
                    {product.nome}
                  </h3>
                  <p className="text-lg font-bold text-primary mt-2">
                    {formatPrice(product.preco)}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{product.loja}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary">
                      <ShoppingCart className="w-3 h-3" />
                      Comprar Agora
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 LMS Tech. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}