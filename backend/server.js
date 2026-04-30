require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Database configuration - PostgreSQL only
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false,
  // Configurações adicionais para estabilidade
  max: 20, // Máximo de conexões
  idleTimeoutMillis: 30000, // Fechar conexões idle após 30s
  connectionTimeoutMillis: 2000, // Timeout de conexão 2s
});

console.log('Usando PostgreSQL...');

const app = express();
const PORT = process.env.PORT || 5000;

const RESEND_FROM = process.env.RESEND_FROM || process.env.SMTP_USER || 'onboarding@resend.dev';
const RESEND_TO_ADMIN = process.env.RESEND_TO_ADMIN || process.env.SMTP_USER || null;

async function sendEmail({ from, to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return null;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: from || RESEND_FROM, to, subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send email');
  return data;
}

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'https://www.lmstech.com.br',
      'https://lmstech.com.br'
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
async function initializeDatabaseConnection() {
  pool.on('error', (err) => {
    console.error('Erro inesperado no pool PostgreSQL:', err);
  });

  // Test connection
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexão com PostgreSQL estabelecida');
  } catch (err) {
    console.error('❌ Erro ao conectar com PostgreSQL:', err);
  }
}

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await initializeDatabaseConnection();
  await initializeDatabase(); // Garante que as tabelas existem ao subir o app
  console.log('Servidor inicializado com sucesso!');
});

// PostgreSQL query helpers
function executeQuery(query, params = []) {
  return pool.query(query, params);
}

function executeRun(query, params = []) {
  return pool.query(query, params);
}

// Criar tabelas (apenas se não existirem)
async function initializeDatabase() {
  try {
    console.log('Verificando tabelas do banco de dados...');

    // Verificar se as tabelas já existem
    const tablesResult = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN ('products', 'portfolio', 'reviews', 'messages')
    `);

    const existingTables = tablesResult.rows.map(row => row.tablename);
    console.log('Tabelas existentes:', existingTables);

    // Criar tabelas apenas se não existirem
    if (!existingTables.includes('products')) {
      console.log('Criando tabela products...');
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
      console.log('✅ Tabela products criada');
    } else {
      console.log('✅ Tabela products já existe');
    }

    if (!existingTables.includes('portfolio')) {
      console.log('Criando tabela portfolio...');
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
      console.log('✅ Tabela portfolio criada');
    } else {
      console.log('✅ Tabela portfolio já existe');
    }

    if (!existingTables.includes('reviews')) {
      console.log('Criando tabela reviews...');
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
      console.log('✅ Tabela reviews criada');
    } else {
      console.log('✅ Tabela reviews já existe');
    }

    if (!existingTables.includes('messages')) {
      console.log('Criando tabela messages...');
      await pool.query(`
        CREATE TABLE messages (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          subject TEXT DEFAULT 'Sem assunto',
          message TEXT NOT NULL,
          replied BOOLEAN DEFAULT FALSE,
          reply_content TEXT,
          replied_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabela messages criada');
    } else {
      console.log('✅ Tabela messages já existe');
    }

    // Add subject column if not exists
    try {
      const hasSubject = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'subject'
      `);
      if (hasSubject.rows.length === 0) {
        await pool.query(`ALTER TABLE messages ADD COLUMN subject TEXT DEFAULT 'Sem assunto'`);
        console.log('✅ Coluna subject adicionada à tabela messages');
      }
    } catch (err) {
      console.log('Erro ao adicionar coluna subject:', err.message);
    }

    // Create message_replies table
    try {
      const hasRepliesTable = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'message_replies' AND column_name = 'id'
      `);
      if (hasRepliesTable.rows.length === 0) {
        console.log('Criando tabela message_replies...');
        await pool.query(`
          CREATE TABLE message_replies (
            id SERIAL PRIMARY KEY,
            message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
            reply_content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Tabela message_replies criada');
      } else {
        console.log('✅ Tabela message_replies já existe');
      }
    } catch (err) {
      console.log('Erro ao verificar tabela message_replies:', err.message);
    }

    console.log('✅ Inicialização do banco de dados concluída');

    // Mostrar estatísticas
    try {
      const productsCount = await pool.query('SELECT COUNT(*) as count FROM products');
      const portfolioCount = await pool.query('SELECT COUNT(*) as count FROM portfolio');
      const reviewsCount = await pool.query('SELECT COUNT(*) as count FROM reviews');

      console.log(`📊 Estatísticas do banco:`);
      console.log(`   - Produtos: ${productsCount.rows[0].count}`);
      console.log(`   - Portfólio: ${portfolioCount.rows[0].count}`);
      console.log(`   - Reviews: ${reviewsCount.rows[0].count}`);
    } catch (statsError) {
      console.log('Não foi possível obter estatísticas:', statsError.message);
    }

  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err);
  }
}

// Rotas da API
console.log('Registrando rotas da API...');

// Produtos
app.get('/api/products', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro em GET /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  console.log('>>> POST /api/products - Dados recebidos:', { nome, categoria, preco, loja });

  try {
    const result = await executeRun(
      'INSERT INTO products (nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false, clicks || 0]
    );

    console.log('>>> Produto criado com ID:', result.rows[0].id);

    // Verificar se foi realmente salvo
    const verifyResult = await executeQuery('SELECT COUNT(*) as total FROM products');
    console.log('>>> Total de produtos no banco:', verifyResult.rows[0].total);

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('>>> ERRO em POST /api/products:', err);
    console.error('>>> Stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque, disponivel, clicks } = req.body;
  try {
    const result = await executeRun(
      'UPDATE products SET nome = $1, descricao = $2, categoria = $3, preco = $4, link_compra = $5, imagem_url = $6, loja = $7, destaque = $8, disponivel = $9, clicks = $10 WHERE id = $11',
      [nome, descricao, categoria, preco, link_compra, imagem_url, loja, destaque || false, disponivel !== false, clicks || 0, req.params.id]
    );
    res.json({ changes: result.rowCount });
  } catch (err) {
    console.error('Erro em PUT /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await executeRun('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ changes: result.rowCount });
  } catch (err) {
    console.error('Erro em DELETE /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

// Portfólio
app.get('/api/portfolio', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM portfolio ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro em GET /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const result = await executeRun(
      'INSERT INTO portfolio (title, description, technologies, image, images, link, version) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [title, description, technologies, image, images, link, version]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Erro em POST /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  const { title, description, technologies, image, images, link, version } = req.body;
  try {
    const result = await executeRun(
      'UPDATE portfolio SET title = $1, description = $2, technologies = $3, image = $4, images = $5, link = $6, version = $7 WHERE id = $8',
      [title, description, technologies, image, images, link, version, req.params.id]
    );
    res.json({ changes: result.rowCount });
  } catch (err) {
    console.error('Erro em PUT /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const result = await executeRun('DELETE FROM portfolio WHERE id = $1', [req.params.id]);
    res.json({ changes: result.rowCount });
  } catch (err) {
    console.error('Erro em DELETE /api/portfolio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Avaliações
app.get('/api/reviews/:portfolioId', async (req, res) => {
  console.log('portfolio_id:', req.params.portfolioId);
  try {
    const result = await executeQuery('SELECT * FROM reviews WHERE portfolio_id = $1 ORDER BY created_at DESC', [req.params.portfolioId]);
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
    const result = await executeRun(
      'INSERT INTO reviews (portfolio_id, username, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id',
      [portfolio_id, username, rating, comment]
    );
    console.log('>>> Review criado:', result.rows[0].id);
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('>>> ERRO ao criar review:', err.stack || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const result = await executeRun('UPDATE reviews SET helpful = helpful + 1 WHERE id = $1', [req.params.id]);
    res.json({ changes: result.rowCount });
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

// Mensagens de contato
app.post('/api/messages', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const result = await executeRun(
      'INSERT INTO messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, subject || 'Sem assunto', message]
    );

    // Notificar admin por email
    if (RESEND_TO_ADMIN) {
      try {
        await sendEmail({
          subject: `📩 Nova mensagem: ${subject || 'Sem assunto'}`,
          to: RESEND_TO_ADMIN,
          html: `
            <h2>Nova mensagem de contato</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
            <p><strong>Assunto:</strong> ${subject || 'Sem assunto'}</p>
            <p><strong>Mensagem:</strong></p>
            <blockquote style="border-left:3px solid #ccc;padding-left:12px">${message}</blockquote>
            <p><small>Responda pelo painel admin.</small></p>
          `,
        });
        console.log('>>> Notificação enviada ao admin');
      } catch (err) {
        console.warn('>>> Falha ao enviar notificação:', err.message);
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro em POST /api/messages:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro em GET /api/messages:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages/:id/reply', async (req, res) => {
  console.log('>>> POST /api/messages/:id/reply received', req.params.id);
  const { reply } = req.body;
  try {
    const msgResult = await executeQuery('SELECT * FROM messages WHERE id = $1', [req.params.id]);
    if (msgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    const msg = msgResult.rows[0];

    if (process.env.RESEND_API_KEY) {
      try {
        console.log('>>> Sending reply email to:', msg.email);
        const info = await sendEmail({
          from: `LMS Tech <${RESEND_FROM}>`,
          to: msg.email,
          subject: `Re: ${msg.subject || 'Contato via Site LMS Tech'}`,
          html: `<p>Olá ${msg.name},</p><p>${reply}</p><p>--<br>LMS Tech</p>`,
        });
        console.log('>>> Reply email sent, id:', info.id);
      } catch (emailErr) {
        console.error('>>> Failed to send reply (non-fatal):', emailErr.message);
      }
    } else {
      console.warn('Resend API not configured');
    }

    await executeRun(
      'UPDATE messages SET replied = TRUE, replied_at = NOW() WHERE id = $1',
      [req.params.id]
    );

    await executeRun(
      'INSERT INTO message_replies (message_id, reply_content) VALUES ($1, $2)',
      [req.params.id, reply]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Erro em POST /api/messages/:id/reply:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages/:id/replies', async (req, res) => {
  try {
    const result = await executeQuery(
      'SELECT * FROM message_replies WHERE message_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro em GET /api/messages/:id/replies:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const result = await executeRun('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ changes: result.rowCount });
  } catch (err) {
    console.error('Erro em DELETE /api/messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// Global error handler - must return JSON, not HTML
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
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