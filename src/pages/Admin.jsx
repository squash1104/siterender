import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Monitor, Plus, Trash2, Edit2, Eye, EyeOff, Package, Briefcase, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";

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
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    clicks: 0,
    title: "",
    description: "",
    technologies: "",
    image: "",
    images: "",
    imageFile: null,
    imagesFiles: [],
    link: "",
    createdAt: "",
    version: "",
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setAuthenticated(true);
      loadProducts();
      loadPortfolio();
    }
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const loadPortfolio = async () => {
    try {
      const data = await api.getPortfolio();
      setPortfolio(data);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      loadProducts();
      loadPortfolio();
    } else {
      alert("Credenciais inválidas. Verifique usuário e senha.");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("admin_auth");
    setUsername("");
    setPassword("");
    setActiveTab("products");
    setShowForm(false);
    setEditingId(null);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    if (form.imagesPreviews) {
      form.imagesPreviews.forEach(url => URL.revokeObjectURL(url));
    }
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
      clicks: 0,
      title: "",
      description: "",
      technologies: "",
      image: "",
      images: "",
      imageFile: null,
      imagesFiles: [],
      imagePreview: null,
      imagesPreviews: [],
      link: "",
      createdAt: "",
      version: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "products") {
        const productData = {
          nome: form.nome,
          descricao: form.descricao,
          categoria: form.categoria,
          preco: parseFloat(form.preco),
          link_compra: form.link_compra,
          imagem_url: form.imagem_url,
          loja: form.loja,
          destaque: form.destaque,
          disponivel: form.disponivel,
          clicks: form.clicks,
        };

        if (editingId) {
          await api.updateProduct(editingId, productData);
        } else {
          await api.createProduct(productData);
        }
        await loadProducts();
      } else {
        const projectData = {
          title: form.title,
          description: form.description,
          technologies: form.technologies,
          image: form.image,
          images: form.images,
          link: form.link,
          version: form.version,
        };

        if (editingId) {
          await api.updatePortfolio(editingId, projectData);
        } else {
          await api.createPortfolio(projectData);
        }
        await loadPortfolio();
      }

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (activeTab === "products") {
      setForm({
        nome: item.nome,
        descricao: item.descricao || "",
        categoria: item.categoria || "Outros",
        preco: item.preco?.toString() || "",
        link_compra: item.link_compra || "",
        imagem_url: item.imagem_url || "",
        loja: item.loja || "Mercado Livre",
        destaque: item.destaque || false,
        disponivel: item.disponivel !== false,
        clicks: item.clicks || 0,
        title: "",
        description: "",
        technologies: "",
        image: "",
        images: "",
        link: "",
      });
    } else {
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
        clicks: 0,
        title: item.title || "",
        description: item.description || "",
        technologies: item.technologies || "",
        image: item.image || "",
        images: "",
        imageFile: null,
        imagesFiles: [],
        imagePreview: item.image || null,
        imagesPreviews: item.images ? item.images.split(',').map(img => img.trim()) : [],
        link: item.link || "",
        createdAt: item.createdAt || "",
        version: item.version || "",
      });
    }
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const itemType = activeTab === "products" ? "produto" : "projeto";
    if (confirm(`Tem certeza que deseja excluir este ${itemType}?`)) {
      try {
        if (activeTab === "products") {
          await api.deleteProduct(id);
          await loadProducts();
        } else {
          await api.deletePortfolio(id);
          await loadPortfolio();
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar. Tente novamente.');
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      if (product) {
        await api.updateProduct(id, { ...product, disponivel: !product.disponivel });
        await loadProducts();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price || 0);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Monitor className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin LMS Tech</CardTitle>
            <p className="text-muted-foreground">Acesso restrito aos administradores</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
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
            <span className="font-bold text-lg">Admin LMS Tech</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Peças ({products.length})
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Portfólio ({portfolio.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Peças</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Adicione, edite e organize as peças disponíveis na loja
                    </p>
                  </div>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Peça
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma peça cadastrada ainda.</p>
                      <p className="text-sm">Clique em "Nova Peça" para começar.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4">
                        {products
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((product) => (
                            <Card key={product.id} className="p-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={product.imagem_url || '/pc gamer.avif'}
                                  alt={product.nome}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                  onError={(e) => { e.currentTarget.src = '/pc gamer.avif'; }}
                                />
                                <div className="flex-1">
                                  <h3 className="font-medium">{product.nome}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.descricao}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline">{product.categoria}</Badge>
                                    <span className="text-sm font-medium text-primary">
                                      {formatPrice(product.preco)}
                                    </span>
                                    {product.destaque && (
                                      <Badge variant="secondary">Destaque</Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleStatus(product.id)}
                                  >
                                    {product.disponivel ? (
                                      <Eye className="w-4 h-4" />
                                    ) : (
                                      <EyeOff className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(product)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>

                      {Math.ceil(products.length / itemsPerPage) > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <p className="text-sm text-muted-foreground">
                            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, products.length)} a {Math.min(currentPage * itemsPerPage, products.length)} de {products.length} produtos
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                            >
                              Anterior
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.min(Math.ceil(products.length / itemsPerPage), currentPage + 1))}
                              disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                            >
                              Próximo
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Portfólio</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Gerencie os projetos e trabalhos da sua empresa
                    </p>
                  </div>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum projeto cadastrado ainda.</p>
                      <p className="text-sm">Clique em "Novo Projeto" para começar.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4">
                        {portfolio
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((project) => (
                            <Card key={project.id} className="p-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={project.image || '/banerDC.png'}
                                  alt={project.title}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                  onError={(e) => { e.currentTarget.src = '/banerDC.png'; }}
                                />
                                <div className="flex-1">
                                  <h3 className="font-medium">{project.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {project.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {project.technologies && (
                                      <div className="flex gap-1">
                                        {(Array.isArray(project.technologies)
                                          ? project.technologies
                                          : project.technologies.split(",")
                                        )
                                          .slice(0, 2)
                                          .map((tech, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {tech.trim()}
                                            </Badge>
                                          ))}
                                      </div>
                                    )}
                                    {project.version && (
                                      <Badge variant="secondary">v{project.version}</Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(project)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(project.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>

                      {Math.ceil(portfolio.length / itemsPerPage) > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <p className="text-sm text-muted-foreground">
                            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, portfolio.length)} a {Math.min(currentPage * itemsPerPage, portfolio.length)} de {portfolio.length} projetos
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                            >
                              Anterior
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.min(Math.ceil(portfolio.length / itemsPerPage), currentPage + 1))}
                              disabled={currentPage === Math.ceil(portfolio.length / itemsPerPage)}
                            >
                              Próximo
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {activeTab === "products"
                    ? (editingId ? "Editar Produto" : "Novo Produto")
                    : (editingId ? "Editar Projeto" : "Novo Projeto")}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === "products" ? (
                    <>
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
                      </div>

                      <div>
                        <Label htmlFor="preco">Preço (R$)</Label>
                        <Input
                          id="preco"
                          type="number"
                          step="0.01"
                          value={form.preco}
                          onChange={(e) => setForm({ ...form, preco: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="link_compra">Link de Compra</Label>
                        <Input
                          id="link_compra"
                          value={form.link_compra}
                          onChange={(e) => setForm({ ...form, link_compra: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="imagem_url">URL da Imagem</Label>
                        <Input
                          id="imagem_url"
                          value={form.imagem_url}
                          onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                          placeholder="/pc gamer.avif ou URL externa"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          required
                          placeholder="Nome do projeto"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Descrição do projeto..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="technologies">Tecnologias (separadas por vírgula)</Label>
                        <Input
                          id="technologies"
                          value={form.technologies}
                          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                          placeholder="React, Node.js, PostgreSQL"
                        />
                      </div>

                      <div>
                        <Label htmlFor="image">Imagem Principal</Label>
                        <Input
                          id="image"
                          value={form.image}
                          onChange={(e) => setForm({ ...form, image: e.target.value })}
                          placeholder="/banerDC.png ou cole uma URL"
                        />
                      </div>

                      <div>
                        <Label htmlFor="link">Link do Projeto</Label>
                        <Input
                          id="link"
                          value={form.link}
                          onChange={(e) => setForm({ ...form, link: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="version">Versão</Label>
                        <Input
                          id="version"
                          value={form.version}
                          onChange={(e) => setForm({ ...form, version: e.target.value })}
                          placeholder="1.0.0"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Salvando..." : (editingId ? "Salvar" : "Cadastrar")}
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
      </div>
    </div>
  );
}