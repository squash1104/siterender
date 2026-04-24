import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Monitor, Calendar, Tag, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Peças", href: "/pecas" },
  { label: "Contato", href: "/#contato" },
];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getPortfolio();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getProjectRating = async (projectId) => {
    try {
      const reviews = await api.getReviews(projectId);
      if (reviews.length === 0) return null;

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      return {
        average: averageRating.toFixed(1),
        count: reviews.length
      };
    } catch (error) {
      return null;
    }
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

      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nosso Portfólio</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Conheça nossos projetos desenvolvidos com as melhores tecnologias e práticas do mercado
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando projetos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground">
              Em breve teremos projetos incríveis para mostrar aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Project Image */}
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={project.image || '/banerDC.png'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = '/banerDC.png'; }}
                  />
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(project.technologies)
                          ? project.technologies
                          : project.technologies.split(",")
                        )
                          .map((tech) => tech.trim())
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        {(Array.isArray(project.technologies)
                          ? project.technologies
                          : project.technologies.split(",")
                        ).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(Array.isArray(project.technologies)
                              ? project.technologies
                              : project.technologies.split(",")
                            ).length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                    {project.version && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span>v{project.version}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating (if available) */}
                  {project.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(Math.floor(project.rating.average))}
                      <span className="text-sm text-muted-foreground">
                        {project.rating.average} ({project.rating.count} avaliações)
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/portfolio/${project.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                    {project.link && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Acessar
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
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