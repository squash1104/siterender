require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Database configuration - Temporarily force SQLite for development
let db;
let dbType = 'sqlite'; // Force SQLite for now

// TODO: Configure PostgreSQL properly for production
// if (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com'))) {
//   // Production: PostgreSQL
//   const { Pool } = require('pg');
//   db = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
//   });
//   dbType = 'postgres';
// } else {
  // Development: SQLite (simpler for now)
  const sqlite3 = require('sqlite3').verbose();
  const { open } = require('sqlite');
  db = null;
  dbType = 'sqlite';
  console.log('Usando SQLite para desenvolvimento...');
// }

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

// Initialize database connection
let pool;
async function initializeDatabaseConnection() {
  if (dbType === 'postgres') {
    // PostgreSQL connection
    pool = db;
    pool.on('error', (err) => {
      console.error('Erro inesperado no pool PostgreSQL:', err);
    });
  } else {
    // SQLite connection
    const path = require('path');
    const fs = require('fs');
    const sqlite3 = require('sqlite3').verbose();
    const { open } = require('sqlite');

    // Ensure database directory exists
    const dbPath = process.env.DATABASE_URL || 'portfolio.db';
    const dbDir = path.dirname(dbPath);
    if (dbDir !== '.' && !fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    pool = await open({
      filename: dbPath,
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
  if (dbType === 'postgres') {
    return pool.query(query, params);
  } else {
    return pool.all(query, params);
  }
}

// Helper function to execute non-query commands
function executeRun(query, params = []) {
  if (dbType === 'postgres') {
    return pool.query(query, params);
  } else {
    return pool.run(query, params);
  }
}

// Criar tabelas
async function initializeDatabase() {
  try {
    if (dbType === 'postgres') {
      console.log('Usando PostgreSQL...');

      // Dropar tabelas existentes
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

    } else {
      console.log('Usando SQLite...');

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
    const result = await executeQuery('SELECT * FROM products ORDER BY created_at DESC');
    const rows = dbType === 'postgres' ? result.rows : result;
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  try {
    const query = dbType === 'postgres'
      ? 'INSERT INTO products (nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id'
      : 'INSERT INTO products (nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const result = await executeRun(query, [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false ? (dbType === 'postgres' ? true : 1) : (dbType === 'postgres' ? false : 0), clicks || 0]);

    const id = dbType === 'postgres' ? result.rows[0].id : result.lastID;
    res.json({ id });
  } catch (err) {
    console.error('Erro em POST /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  try {
    const query = dbType === 'postgres'
      ? 'UPDATE products SET nome = $1, descricao = $2, categoria = $3, preco = $4, link_compra = $5, imagem_url = $6, loja = $7, destaque = $8, disponivel = $9, clicks = $10 WHERE id = $11'
      : 'UPDATE products SET nome = ?, descricao = ?, categoria = ?, preco = ?, link_compra = ?, imagem_url = ?, loja = ?, destaque = ?, disponivel = ?, clicks = ? WHERE id = ?';

    const result = await executeRun(query, [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false ? (dbType === 'postgres' ? true : 1) : (dbType === 'postgres' ? false : 0), clicks || 0, req.params.id]);

    const changes = dbType === 'postgres' ? result.rowCount : result.changes;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em PUT /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const query = dbType === 'postgres' ? 'DELETE FROM products WHERE id = $1' : 'DELETE FROM products WHERE id = ?';

    const result = await executeRun(query, [req.params.id]);
    const changes = dbType === 'postgres' ? result.rowCount : result.changes;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em DELETE /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

// Portfólio
app.get('/api/portfolio', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM portfolio ORDER BY created_at DESC');
    const rows = dbType === 'postgres' ? result.rows : result;
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const query = dbType === 'postgres'
      ? 'INSERT INTO portfolio (title, description, technologies, image, images, link, version) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id'
      : 'INSERT INTO portfolio (title, description, technologies, image, images, link, version) VALUES (?, ?, ?, ?, ?, ?, ?)';

    const result = await executeRun(query, [title, description, technologies, image, images, link, version]);
    const id = dbType === 'postgres' ? result.rows[0].id : result.lastID;
    res.json({ id });
  } catch (err) {
    console.error('Erro em POST /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const query = dbType === 'postgres'
      ? 'UPDATE portfolio SET title = $1, description = $2, technologies = $3, image = $4, images = $5, link = $6, version = $7 WHERE id = $8'
      : 'UPDATE portfolio SET title = ?, description = ?, technologies = ?, image = ?, images = ?, link = ?, version = ? WHERE id = ?';

    const result = await executeRun(query, [title, description, technologies, image, images, link, version, req.params.id]);
    const changes = dbType === 'postgres' ? result.rowCount : result.changes;
    res.json({ changes });
  } catch (err) {
    console.error('Erro em PUT /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const query = dbType === 'postgres' ? 'DELETE FROM portfolio WHERE id = $1' : 'DELETE FROM portfolio WHERE id = ?';

    const result = await executeRun(query, [req.params.id]);
    const changes = dbType === 'postgres' ? result.rowCount : result.changes;
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
    const query = dbType === 'postgres' ? 'SELECT * FROM reviews WHERE portfolio_id = $1 ORDER BY created_at DESC' : 'SELECT * FROM reviews WHERE portfolio_id = ? ORDER BY created_at DESC';

    const result = await executeQuery(query, [req.params.portfolioId]);
    const rows = dbType === 'postgres' ? result.rows : result;
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
    const query = dbType === 'postgres'
      ? 'INSERT INTO reviews (portfolio_id, username, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id'
      : 'INSERT INTO reviews (portfolio_id, username, rating, comment) VALUES (?, ?, ?, ?)';

    const result = await executeRun(query, [portfolio_id, username, rating, comment]);
    const id = dbType === 'postgres' ? result.rows[0].id : result.lastID;
    console.log('>>> Review criado:', id);
    res.json({ id });
  } catch (err) {
    console.error('>>> ERRO ao criar review:', err.stack || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const query = dbType === 'postgres' ? 'UPDATE reviews SET helpful = helpful + 1 WHERE id = $1' : 'UPDATE reviews SET helpful = helpful + 1 WHERE id = ?';

    const result = await executeRun(query, [req.params.id]);
    const changes = dbType === 'postgres' ? result.rowCount : result.changes;
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