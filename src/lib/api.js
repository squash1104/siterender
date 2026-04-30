// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'www.lmstech.com.br' || window.location.hostname === 'lmstech.com.br'
    ? 'https://siterenderws.onrender.com/api'
    : 'http://localhost:5000/api');

// API helper functions
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  // Products
  getProducts: () => apiRequest('/products'),
  createProduct: (product) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  updateProduct: (id, product) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE'
  }),

  // Portfolio
  getPortfolio: () => apiRequest('/portfolio'),
  createPortfolio: (project) => apiRequest('/portfolio', {
    method: 'POST',
    body: JSON.stringify(project)
  }),
  updatePortfolio: (id, project) => apiRequest(`/portfolio/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project)
  }),
  deletePortfolio: (id) => apiRequest(`/portfolio/${id}`, {
    method: 'DELETE'
  }),

  // Reviews
  getReviews: (portfolioId) => apiRequest(`/reviews/${portfolioId}`),
  createReview: (review) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  }),
  markHelpful: (reviewId) => apiRequest(`/reviews/${reviewId}/helpful`, {
    method: 'PUT'
  }),

  // Upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiRequest('/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type para multipart/form-data
      body: formData
    });
  },

  uploadMultipleImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return apiRequest('/upload-multiple', {
      method: 'POST',
      headers: {},
      body: formData
    });
  },

  // Messages
  createMessage: (message) => apiRequest('/messages', {
    method: 'POST',
    body: JSON.stringify(message)
  }),
  getMessages: () => apiRequest('/messages'),
  replyToMessage: (id, reply) => apiRequest(`/messages/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ reply })
  }),
  deleteMessage: (id) => apiRequest(`/messages/${id}`, {
    method: 'DELETE'
  })
};