require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Database configuration - use SQLite for development, PostgreSQL for production
let db;
if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('render.com')) {
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  const sqlite3 = require('sqlite3').verbose();
  const { open } = require('sqlite');
  db = null; // Will be initialized later
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://www.lmstech.com.br',
    'https://lmstech.com.br'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Initialize database based on environment
let pool;
async function initializeDatabaseConnection() {
  if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('render.com')) {
    // Use PostgreSQL for production
    pool = db;
    pool.on('error', (err) => {
      console.error('Erro inesperado no pool PostgreSQL:', err);
    });
  } else {
    // Use SQLite for development
    const path = require('path');
    const fs = require('fs');
    const sqlite3 = require('sqlite3').verbose();
    const { open } = require('sqlite');

    // Ensure database directory exists
    const dbDir = path.dirname(process.env.DATABASE_URL);
    if (dbDir !== '.' && !fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    pool = await open({
      filename: process.env.DATABASE_URL,
      driver: sqlite3.Database,
    });
  }
}

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await initializeDatabaseConnection();
  await initializeDatabase(); // Garante que as tabelas existem ao subir o app
  console.log('Servidor inicializado com sucesso!');
});

// Helper function to execute queries on both databases
function executeQuery(query, params = []) {
  const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');

  if (isSQLite) {
    return pool.all(query, params);
  } else {
    return pool.query(query, params);
  }
}

// Helper function to execute non-query commands
function executeRun(query, params = []) {
  const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');

  if (isSQLite) {
    return pool.run(query, params);
  } else {
    return pool.query(query, params);
  }
}

// Criar tabelas
async function initializeDatabase() {
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');

    if (isSQLite) {
      // SQLite queries
      console.log('Usando SQLite para desenvolvimento...');

      // Dropar tabelas existentes
      await pool.exec('DROP TABLE IF EXISTS reviews');
      await pool.exec('DROP TABLE IF EXISTS portfolio');
      await pool.exec('DROP TABLE IF EXISTS products');

      console.log('Tabelas antigas removidas.');

      // Tabela de produtos
      await pool.exec(`
        CREATE TABLE products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          descricao TEXT,
          categoria TEXT,
          preco REAL,
          link_compra TEXT,
          imagem_url TEXT,
          loja TEXT,
          destaque INTEGER DEFAULT 0,
          disponivel INTEGER DEFAULT 1,
          clicks INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de portfólio
      await pool.exec(`
        CREATE TABLE portfolio (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          technologies TEXT,
          image TEXT,
          images TEXT,
          link TEXT,
          version TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de avaliações
      await pool.exec(`
        CREATE TABLE reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          portfolio_id INTEGER,
          username TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          helpful INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE
        )
      `);

    } else {
      // PostgreSQL queries
      console.log('Usando PostgreSQL para produção...');

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
    }

    console.log('Tabelas criadas com sucesso.');
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
  }
}

// Rotas da API
console.log('Registrando rotas da API...');

// Produtos
app.get('/api/products', async (req, res) => {
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const result = await executeQuery('SELECT * FROM products ORDER BY created_at DESC');
    const rows = isSQLite ? result : result.rows;
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite
      ? 'INSERT INTO products (nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      : 'INSERT INTO products (nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id';

    const result = await executeRun(query, [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false ? 1 : 0, clicks || 0]);

    if (isSQLite) {
      res.json({ id: result.lastID });
    } else {
      res.json({ id: result.rows[0].id });
    }
  } catch (err) {
    console.error('Erro em POST /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite
      ? 'UPDATE products SET nome = ?, descricao = ?, categoria = ?, preco = ?, link_compra = ?, imagem_url = ?, loja = ?, destaque = ?, disponivel = ?, clicks = ? WHERE id = ?'
      : 'UPDATE products SET nome = $1, descricao = $2, categoria = $3, preco = $4, link_compra = $5, imagem_url = $6, loja = $7, destaque = $8, disponivel = $9, clicks = $10 WHERE id = $11';

    const result = await executeRun(query, [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false ? 1 : 0, clicks || 0, req.params.id]);

    const changes = isSQLite ? result.changes : result.rowCount;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em PUT /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite ? 'DELETE FROM products WHERE id = ?' : 'DELETE FROM products WHERE id = $1';

    const result = await executeRun(query, [req.params.id]);
    const changes = isSQLite ? result.changes : result.rowCount;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em DELETE /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

// Portfólio
app.get('/api/portfolio', async (req, res) => {
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const result = await executeQuery('SELECT * FROM portfolio ORDER BY created_at DESC');
    const rows = isSQLite ? result : result.rows;
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite
      ? 'INSERT INTO portfolio (title, description, technologies, image, images, link, version) VALUES (?, ?, ?, ?, ?, ?, ?)'
      : 'INSERT INTO portfolio (title, description, technologies, image, images, link, version) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';

    const result = await executeRun(query, [title, description, technologies, image, images, link, version]);

    if (isSQLite) {
      res.json({ id: result.lastID });
    } else {
      res.json({ id: result.rows[0].id });
    }
  } catch (err) {
    console.error('Erro em POST /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite
      ? 'UPDATE portfolio SET title = ?, description = ?, technologies = ?, image = ?, images = ?, link = ?, version = ? WHERE id = ?'
      : 'UPDATE portfolio SET title = $1, description = $2, technologies = $3, image = $4, images = $5, link = $6, version = $7 WHERE id = $8';

    const result = await executeRun(query, [title, description, technologies, image, images, link, version, req.params.id]);

    const changes = isSQLite ? result.changes : result.rowCount;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em PUT /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite ? 'DELETE FROM portfolio WHERE id = ?' : 'DELETE FROM portfolio WHERE id = $1';

    const result = await executeRun(query, [req.params.id]);
    const changes = isSQLite ? result.changes : result.rowCount;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em DELETE /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Avaliações
app.get('/api/reviews/:portfolioId', async (req, res) => {
  console.log('portfolio_id:', req.params.portfolioId);
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite ? 'SELECT * FROM reviews WHERE portfolio_id = ? ORDER BY created_at DESC' : 'SELECT * FROM reviews WHERE portfolio_id = $1 ORDER BY created_at DESC';

    const result = await executeQuery(query, [req.params.portfolioId]);
    const rows = isSQLite ? result : result.rows;
    console.log('reviews result:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Erro em reviews:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  console.log('>>> POST review body:', req.body);
  const { portfolio_id, username, rating, comment } = req.body;
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite
      ? 'INSERT INTO reviews (portfolio_id, username, rating, comment) VALUES (?, ?, ?, ?)'
      : 'INSERT INTO reviews (portfolio_id, username, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id';

    const result = await executeRun(query, [portfolio_id, username, rating, comment]);

    if (isSQLite) {
      console.log('>>> Review criado:', result.lastID);
      res.json({ id: result.lastID });
    } else {
      console.log('>>> Review criado:', result.rows[0]);
      res.json({ id: result.rows[0].id });
    }
  } catch (err) {
    console.error('>>> ERRO ao criar review:', err.stack || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const isSQLite = process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL.includes('render.com');
    const query = isSQLite ? 'UPDATE reviews SET helpful = helpful + 1 WHERE id = ?' : 'UPDATE reviews SET helpful = helpful + 1 WHERE id = $1';

    const result = await executeRun(query, [req.params.id]);
    const changes = isSQLite ? result.changes : result.rowCount;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em PUT /api/reviews/:id/helpful:', err);
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
  if (pool && typeof pool.close === 'function') {
    await pool.close();
  } else if (pool && typeof pool.end === 'function') {
    await pool.end();
  }
  console.log('Banco de dados fechado.');
  process.exit(0);
});

console.log('Rotas registradas com sucesso!');