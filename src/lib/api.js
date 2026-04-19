// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Products
  getProducts: () => fetch(`${API_BASE_URL}/products`).then(res => res.json()),
  createProduct: (product) => fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }).then(res => res.json()),
  updateProduct: (id, product) => fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }).then(res => res.json()),
  deleteProduct: (id) => fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Portfolio
  getPortfolio: () => fetch(`${API_BASE_URL}/portfolio`).then(res => res.json()),
  createPortfolio: (project) => fetch(`${API_BASE_URL}/portfolio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  }).then(res => res.json()),
  updatePortfolio: (id, project) => fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  }).then(res => res.json()),
  deletePortfolio: (id) => fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Reviews
  getReviews: (portfolioId) => fetch(`${API_BASE_URL}/reviews/${portfolioId}`).then(res => res.json()),
  createReview: (review) => fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  }).then(res => res.json()),
  markHelpful: (reviewId) => fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
    method: 'PUT'
  }).then(res => res.json()),

  // Upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    }).then(res => res.json());
  },

  uploadMultipleImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return fetch(`${API_BASE_URL}/upload-multiple`, {
      method: 'POST',
      body: formData
    }).then(res => res.json());
  }
};