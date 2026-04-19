import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

// Servir arquivos estáticos do dist
app.use(express.static(path.join(process.cwd(), 'dist')));

// Qualquer rota retorna o index.html (SPA)
app.get('*', (_, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});