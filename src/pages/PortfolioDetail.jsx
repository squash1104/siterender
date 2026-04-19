import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortfolioDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("portfolio");
      const projects = stored ? JSON.parse(stored) : [];
      const found = projects.find(p => p.id === parseInt(id));
      setProject(found);
    } catch {
      setProject(null);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-lg">LMS Tech</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/#servicos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Serviços
            </Link>
            <Button asChild>
              <Link to="/#contato">Contato</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-start gap-8 mb-8">
          <img
            src={project.image}
            alt={project.title}
            className="w-32 h-32 rounded-xl object-cover shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span>Versão {project.version || '1.0.0'}</span>
              </div>
            </div>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Acessar Sistema
            </Button>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tecnologias Utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech) => (
              <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Screenshots */}
        {project.images && project.images.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Capturas de Tela</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}