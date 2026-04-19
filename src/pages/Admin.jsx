import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Monitor, Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    // Portfolio fields
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

  const loadPortfolio = async () => {
    try {
      const data = await api.getPortfolio();
      // Adicionar projeto padrão se não existir
      const defaultProject = {
        id: 1,
        title: "DriverControl - Controle de Corridas",
        description: "Sistema completo para motoristas de Uber e 99 controlarem corridas, receitas e despesas. Cadastre corridas com cálculos automáticos de R$/Km e R$/Hora, controle gastos por veículo, abastecimentos e recompensas dos apps. Dashboard intuitivo com relatórios por período.",
        technologies: "Django, Python, Bootstrap, SQLite",
        image: "/banerDC.png",
        images: "/DriverControl.png",
        link: "/portfolio/1",
        createdAt: "2024-01-15",
        version: "1.0.0",
      };
      const hasDefault = data.some(p => p.id === 1);
      if (!hasDefault) {
        // Criar projeto padrão na API
        await api.createPortfolio(defaultProject);
        data.unshift(defaultProject);
      }
      setPortfolio(data);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
      setPortfolio([]);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
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
    setProducts(newProducts);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "products") {
        const productData = {
          nome: form.nome,
          descricao: form.descricao,
          categoria: form.categoria,
          preco: parseFloat(form.preco) || 0,
          link_compra: form.link_compra,
          imagem_url: form.imagem_url,
          loja: form.loja,
          destaque: form.destaque,
          disponivel: form.disponivel,
          clicks: form.clicks || 0
        };

        if (editingId) {
          await api.updateProduct(editingId, productData);
        } else {
          await api.createProduct(productData);
        }

        await loadProducts();
      } else {
        // Processar imagens: upload para o backend se houver arquivos
        let imageUrl = form.image;
        let imagesUrls = [];

        if (form.imageFile) {
          const uploadResult = await api.uploadImage(form.imageFile);
          imageUrl = uploadResult.imageUrl;
        }

        if (form.imagesFiles && form.imagesFiles.length > 0) {
          const uploadResult = await api.uploadMultipleImages(form.imagesFiles);
          imagesUrls = uploadResult.imageUrls;
        } else if (form.images) {
          imagesUrls = form.images.split(',').map(i => i.trim()).filter(Boolean);
        }

        const projectData = {
          title: form.title,
          description: form.description,
          technologies: form.technologies,
          image: imageUrl,
          images: imagesUrls.join(','),
          link: form.link,
          version: form.version || "1.0.0"
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
    }
  };

  const     resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    // Revogar URLs temporárias para evitar vazamento de memória
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
        technologies: item.technologies?.join(", ") || "",
        image: item.image || "",
        images: "", // campo de texto limpo na edição (usa preview dos arquivos)
        imageFile: null,
        imagesFiles: [],
        imagePreview: item.image || null,
        imagesPreviews: item.images || [],
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-xl border border-border p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Monitor className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Acesso Restrito</h1>
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
            <Button type="submit" className="w-full mb-4">
              Entrar
            </Button>
          </form>
          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Voltar ao Site Principal
            </Link>
          </div>
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
            <h1 className="text-2xl font-bold">
              {activeTab === "products" ? "Gerenciar Peças" : "Gerenciar Portfólio"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "products"
                ? `${products.length} produto(s) cadastrado(s)`
                : `${portfolio.length} projeto(s) cadastrado(s)`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "products" ? "default" : "outline"}
              onClick={() => setActiveTab("products")}
            >
              Peças
            </Button>
            <Button
              variant={activeTab === "portfolio" ? "default" : "outline"}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfólio
            </Button>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              {activeTab === "products" ? "Nova Peça" : "Novo Projeto"}
            </Button>
          </div>
        </div>

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
                          placeholder="Ex: DriverControl - Controle de Corridas"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição *</Label>
                        <Textarea
                          id="description"
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          required
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
                          placeholder="Django, Python, Bootstrap, SQLite"
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
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                // Preview instantâneo (não vai pro backend ainda)
                                const previewUrl = URL.createObjectURL(file);

                                setForm({
                                  ...form,
                                  imageFile: file,
                                  imagePreview: previewUrl
                                });
                              } catch (err) {
                                alert(err.message || 'Erro ao processar imagem');
                              }
                            }
                          }}
                          className="mt-2"
                        />
                        {form.imagePreview && (
                          <div className="mt-2">
                            <img 
                              src={form.imagePreview} 
                              alt="Preview" 
                              className="w-24 h-24 object-cover rounded border"
                            />
                              <p className="text-xs text-muted-foreground mt-1">
                              Thumbnail: {(form.image?.length * 0.75 / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Qualidade otimizada (80%). Para máxima qualidade, use URL externa.
                        </p>
                      </div>

                       <div>
                         <Label htmlFor="images">Capturas de Tela (máx. 15)</Label>
                         <Input
                           id="images"
                           value={form.images}
                           onChange={(e) => setForm({ ...form, images: e.target.value })}
                           placeholder="Cole URLs separadas por vírgula"
                         />
                         <input
                           type="file"
                           accept="image/*"
                           multiple
                           onChange={async (e) => {
                             const files = Array.from(e.target.files || []);
                             if (files.length === 0) return;

                             if (files.length > 15) {
                               alert('Máximo 15 imagens adicionais');
                               return;
                             }

                             try {
                               // Previews (não salvos)
                               const previewUrls = files.map(f => URL.createObjectURL(f));

                               setForm({
                                 ...form,
                                 imagesFiles: files,
                                 imagesPreviews: previewUrls
                               });
                             } catch (err) {
                               alert(err.message || 'Erro ao processar imagens');
                             }
                           }}
                           className="mt-2"
                         />
                         {form.imagesPreviews && form.imagesPreviews.length > 0 && (
                           <div className="mt-2 flex flex-wrap gap-2">
                             {form.imagesPreviews.slice(0, 10).map((url, idx) => (
                               <div key={idx} className="relative">
                                 <img
                                   src={url}
                                   alt={`Preview ${idx + 1}`}
                                   className="w-16 h-16 object-cover rounded border"
                                 />
                                 {form.imagesPreviews.length > 10 && idx === 9 && (
                                   <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                                     <span className="text-white text-xs">+{form.imagesPreviews.length - 10}</span>
                                   </div>
                                 )}
                               </div>
                             ))}
                           </div>
                         )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Qualidade otimizada (~50-100KB cada). Máximo 15 imagens. Para máxima qualidade, use URL externa.
                          </p>
                       </div>

                      <div>
                        <Label htmlFor="link">Link do Projeto</Label>
                        <Input
                          id="link"
                          value={form.link}
                          onChange={(e) => setForm({ ...form, link: e.target.value })}
                          placeholder="/drivercontrol"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="createdAt">Data de Criação</Label>
                          <Input
                            id="createdAt"
                            type="date"
                            value={form.createdAt}
                            onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
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
                      </div>
                    </>
                  )}

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

        {/* Items List */}
        {(activeTab === "products" ? products : portfolio).length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl">
            <p className="text-muted-foreground text-lg">
              {activeTab === "products" ? "Nenhum produto cadastrado" : "Nenhum projeto cadastrado"}
            </p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === "products" ? "Cadastrar Primeiro Produto" : "Cadastrar Primeiro Projeto"}
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                {activeTab === "products" ? (
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Produto</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categoria</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Preço</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Loja</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cliques</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Projeto</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tecnologias</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Link</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-border">
                {activeTab === "products"
                  ? products.map((product) => (
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
                        <td className="p-4 text-sm">{product.clicks || 0}</td>
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
                    ))
                  : portfolio.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {project.image && (
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{project.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{project.technologies?.join(", ")}</td>
                        <td className="p-4 text-sm">{project.link}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-2 hover:bg-muted rounded"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
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