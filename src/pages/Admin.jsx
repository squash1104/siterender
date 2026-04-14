import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Monitor, Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "Memória RAM",
  "HD / SSD",
  "Processador",
  "Placa-mãe",
  "Fonte",
  "Cooler",
  "Placa de Vídeo",
  "Teclado",
  "Mouse",
  "Tela",
  "Bateria",
  "Cabo / Conector",
  "Outros",
];

const stores = [
  "Mercado Livre",
  "Amazon",
  "Kabum",
  "Magazine Luiza",
  "Americanas",
  "Outro",
];

const navLinks = [
  { label: "Ver Loja", href: "/pecas" },
  { label: "Início", href: "/" },
];

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria: "Outros",
    preco: "",
    link_compra: "",
    imagem_url: "",
    loja: "Mercado Livre",
    destaque: false,
    disponivel: true,
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setAuthenticated(true);
      loadProducts();
    }
  }, []);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem("pecas");
      setProducts(stored ? JSON.parse(stored) : []);
    } catch {
      setProducts([]);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "lmstech" && password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      setAuthenticated(true);
      loadProducts();
    } else {
      alert("Usuário ou senha incorretos");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const saveProducts = (newProducts) => {
    localStorage.setItem("pecas", JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...form,
      id: editingId || Date.now(),
      preco: parseFloat(form.preco) || 0,
    };

    let newProducts;
    if (editingId) {
      newProducts = products.map((p) => (p.id === editingId ? { ...productData, id: editingId } : p));
    } else {
      newProducts = [...products, productData];
    }

    saveProducts(newProducts);
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      nome: "",
      descricao: "",
      categoria: "Outros",
      preco: "",
      link_compra: "",
      imagem_url: "",
      loja: "Mercado Livre",
      destaque: false,
      disponivel: true,
    });
  };

  const handleEdit = (product) => {
    setForm({
      nome: product.nome,
      descricao: product.descricao || "",
      categoria: product.categoria || "Outros",
      preco: product.preco?.toString() || "",
      link_compra: product.link_compra || "",
      imagem_url: product.imagem_url || "",
      loja: product.loja || "Mercado Livre",
      destaque: product.destaque || false,
      disponivel: product.disponivel !== false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const newProducts = products.filter((p) => p.id !== id);
      saveProducts(newProducts);
    }
  };

  const toggleStatus = (id) => {
    const newProducts = products.map((p) =>
      p.id === id ? { ...p, disponivel: !p.disponivel } : p
    );
    saveProducts(newProducts);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price || 0);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-xl border border-border p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Monitor className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin - Peças</h1>
            <p className="text-muted-foreground">Digite usuário e senha para acessar</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Digite o usuário"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite a senha"
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Admin - Peças</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Peças</h1>
            <p className="text-muted-foreground">{products.length} produto(s) cadastrado(s)</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Peça
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingId ? "Editar Produto" : "Novo Produto"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      required
                      placeholder="Ex: Placa de Vídeo RTX 4060"
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={form.descricao}
                      onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                      placeholder="Descrição do produto..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <select
                        id="categoria"
                        value={form.categoria}
                        onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="preco">Preço (R$) *</Label>
                      <Input
                        id="preco"
                        type="number"
                        step="0.01"
                        value={form.preco}
                        onChange={(e) => setForm({ ...form, preco: e.target.value })}
                        required
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="imagem_url">URL da Imagem</Label>
                    <Input
                      id="imagem_url"
                      value={form.imagem_url}
                      onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                      placeholder="/nome-da-imagem.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Images: /Manutenção.jpg, /pc gamer.avif, /rede.webp, /buscar.webp, /assessoria.jpg
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="link_compra">Link de Compra *</Label>
                    <Input
                      id="link_compra"
                      value={form.link_compra}
                      onChange={(e) => setForm({ ...form, link_compra: e.target.value })}
                      required
                      placeholder="https://www.mercadolivre.com.br/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="loja">Loja</Label>
                    <select
                      id="loja"
                      value={form.loja}
                      onChange={(e) => setForm({ ...form, loja: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {stores.map((store) => (
                        <option key={store} value={store}>{store}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.destaque}
                        onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Destaque</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.disponivel}
                        onChange={(e) => setForm({ ...form, disponivel: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Disponível</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingId ? "Salvar" : "Cadastrar"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl">
            <p className="text-muted-foreground text-lg">Nenhum produto cadastrado</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Produto
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Produto</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categoria</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Preço</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Loja</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.imagem_url && (
                          <img
                            src={product.imagem_url}
                            alt={product.nome}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.nome}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {product.descricao}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{product.categoria}</td>
                    <td className="p-4 font-bold">{formatPrice(product.preco)}</td>
                    <td className="p-4 text-sm">{product.loja}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.disponivel
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {product.disponivel ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(product.id)}
                          className="p-2 hover:bg-muted rounded"
                          title={product.disponivel ? "Desativar" : "Ativar"}
                        >
                          {product.disponivel ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-muted rounded"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-muted rounded text-red-500"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}