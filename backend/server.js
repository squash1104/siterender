require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Criar diretório de uploads se não existir
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  }
});

// Inicializar banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await initializeDatabase(); // Garante que as tabelas existem ao subir o app
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool PostgreSQL:', err);
});

// Criar tabelas
async function initializeDatabase() {
  try {
    // Dropar tabelas existentes para recriar com estrutura correta
    await pool.query('DROP TABLE IF EXISTS reviews CASCADE');
    await pool.query('DROP TABLE IF EXISTS portfolio CASCADE');
    await pool.query('DROP TABLE IF EXISTS products CASCADE');

    console.log('Tabelas antigas removidas.');

    // Tabela de produtos
    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT,
        preco REAL,
        link_compra TEXT,
        imagem_url TEXT,
        loja TEXT,
        destaque BOOLEAN DEFAULT FALSE,
        disponivel BOOLEAN DEFAULT TRUE,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de portfólio
    await pool.query(`
      CREATE TABLE portfolio (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        technologies TEXT,
        image TEXT,
        images TEXT,
        link TEXT,
        version TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de avaliações
    await pool.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        portfolio_id BIGINT REFERENCES portfolio(id) ON DELETE CASCADE,
        username TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        helpful INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tabelas recriadas com estrutura correta.');
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
  }
}

// Rotas da API

// Produtos
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false, clicks || 0]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET nome = $1, descricao = $2, categoria = $3, preco = $4, link_compra = $5, imagem_url = $6, loja = $7, destaque = $8, disponivel = $9, clicks = $10 WHERE id = $11',
      [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false, clicks || 0, req.params.id]
    );
    res.json({ changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Portfólio
app.get('/api/portfolio', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO portfolio (title, description, technologies, image, images, link, version) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [title, description, technologies, image, images, link, version]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const result = await pool.query(
      'UPDATE portfolio SET title = $1, description = $2, technologies = $3, image = $4, images = $5, link = $6, version = $7 WHERE id = $8',
      [title, description, technologies, image, images, link, version, req.params.id]
    );
    res.json({ changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM portfolio WHERE id = $1', [req.params.id]);
    res.json({ changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Avaliações
app.get('/api/reviews/:portfolioId', async (req, res) => {
  console.log('portfolio_id:', req.params.portfolioId);
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE portfolio_id = $1 ORDER BY created_at DESC', [req.params.portfolioId]);
    console.log('reviews result:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro em reviews:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  console.log('>>> POST review body:', req.body);
  const { portfolio_id, username, rating, comment } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reviews (portfolio_id, username, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id',
      [portfolio_id, username, rating, comment]
    );
    console.log('>>> Review criado:', result.rows[0]);
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('>>> ERRO ao criar review:', err.stack || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE reviews SET helpful = helpful + 1 WHERE id = $1',
      [req.params.id]
    );
    res.json({ changes: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload de imagens
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Erro no upload:', err);
      return res.status(500).json({ error: err.message || 'Erro no upload da imagem' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });
});

// Upload múltiplo de imagens
app.post('/api/upload-multiple', (req, res) => {
  upload.array('images', 15)(req, res, (err) => {
    if (err) {
      console.error('Erro no upload múltiplo:', err);
      return res.status(500).json({ error: err.message || 'Erro no upload das imagens' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const imageUrls = req.files.map(file =>
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );

    res.json({ imageUrls });
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Fechar pool ao encerrar
process.on('SIGINT', async () => {
  await pool.end();
  console.log('Pool PostgreSQL fechado.');
  process.exit(0);
});