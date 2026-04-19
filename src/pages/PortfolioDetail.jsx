import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Calendar, Tag, ChevronLeft, ChevronRight, X, Star, ThumbsUp, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function PortfolioDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 5,
    comment: ""
  });

  const imagesPerSlide = 5;
  const maxSlides = project ? Math.ceil(project.images.length / imagesPerSlide) : 0;

  // Funções para avaliações
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar projeto
        const projects = await api.getPortfolio();
        const found = projects.find(p => p.id === parseInt(id));
        setProject(found);

        // Carregar avaliações do projeto
        if (id) {
          const reviewsData = await api.getReviews(id);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setProject(null);
        setReviews([]);
      }
    };

    loadData();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!newReview.user.trim() || !newReview.comment.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const review = {
        portfolio_id: parseInt(id),
        user: newReview.user.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim()
      };

      await api.createReview(review);

      // Recarregar avaliações
      const reviewsData = await api.getReviews(id);
      setReviews(reviewsData);

      setNewReview({ user: "", rating: 5, comment: "" });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      alert('Erro ao adicionar avaliação. Tente novamente.');
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await api.markHelpful(reviewId);

      // Recarregar avaliações para atualizar contador
      const reviewsData = await api.getReviews(id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Erro ao marcar como útil:', error);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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

          <div className="max-w-4xl mx-auto my-4"> 
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link to="/portfolio">← Voltar para Portfólios</Link>
            </Button>
            </div>
          

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-start gap-8 mb-8">
          
          <img
            src={project.image || '/banerDC.png'}
            alt={project.title}
            className="w-32 h-32 rounded-xl object-cover shadow-lg"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
            <Button asChild>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4" />
                Acessar Sistema
              </a>
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

        {/* Screenshots Carousel */}
        {project.images && project.images.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Capturas de Tela</h2>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: maxSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="flex-shrink-0 w-full flex gap-4">
                    {project.images
                      .slice(slideIndex * imagesPerSlide, (slideIndex + 1) * imagesPerSlide)
                      .map((url, imgIndex) => (
                        <div key={slideIndex * imagesPerSlide + imgIndex} className="flex-1">
                          <img
                            src={url.startsWith('http') ? url : url}
                            alt={`Screenshot ${slideIndex * imagesPerSlide + imgIndex + 1}`}
                            className="w-full object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                            style={{
                              width: '158px',
                              height: '298px',
                              aspectRatio: '158 / 298'
                            }}
                            onError={(e) => e.target.style.display = 'none'}
                            onClick={() => setSelectedImage(url.startsWith('http') ? url : url)}
                          />
                        </div>
                      ))}
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              {maxSlides > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white shadow-lg"
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white shadow-lg"
                    onClick={() => setCurrentSlide(Math.min(maxSlides - 1, currentSlide + 1))}
                    disabled={currentSlide >= maxSlides - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Dots Indicator */}
              {maxSlides > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: maxSlides }, (_, i) => (
                    <button
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentSlide === i ? 'bg-primary' : 'bg-muted'
                      }`}
                      onClick={() => setCurrentSlide(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Avaliações</h2>

          {/* Rating Summary */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex items-center gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{averageRating}</div>
                {renderStars(Math.floor(averageRating), "w-6 h-6")}
                <div className="text-sm text-muted-foreground mt-1">
                  {reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1">
                {Object.entries(getRatingDistribution()).reverse().map(([rating, count]) => {
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-3">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add Review Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              {showReviewForm ? "Cancelar Avaliação" : "Avaliar Projeto"}
            </Button>
          </div>

          {/* Add Review Form */}
          {showReviewForm && (
            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Escrever Avaliação</h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <Label htmlFor="review-user">Nome *</Label>
                  <Input
                    id="review-user"
                    value={newReview.user}
                    onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                    placeholder="Seu nome"
                    required
                  />
                </div>

                <div>
                  <Label>Avaliação *</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-400'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {newReview.rating} estrela{newReview.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review-comment">Comentário *</Label>
                  <Textarea
                    id="review-comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Conte sua experiência com este projeto..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Enviar Avaliação</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma avaliação ainda</h3>
              <p className="text-muted-foreground mb-4">
                Seja o primeiro a avaliar este projeto!
              </p>
              <Button onClick={() => setShowReviewForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Escrever primeira avaliação
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{review.user}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {renderStars(review.rating, "w-4 h-4")}

                    <p className="text-sm mt-3 mb-4 leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Útil ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* Load More Button */}
          {reviews.length > 4 && (
            <div className="text-center mt-8">
              <Button variant="outline">
                Ver mais avaliações
              </Button>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-md max-h-full">
              <img
                src={selectedImage}
                alt="Screenshot ampliada"
                className="rounded-lg shadow-2xl"
                style={{ width: '424px', height: '793px', objectFit: 'contain' }}
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}