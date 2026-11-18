const express = require('express');
const tasksRouter = require('./routes/tasks');
const swaggerSpec = require('./swagger.json');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs/swagger.json', (req, res) => {
  res.status(200).json(swaggerSpec);
});

app.get('/docs', (req, res) => {
  res.status(200).type('html').send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>api-quality-lab - Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/docs/swagger.json',
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>`);
});

app.use('/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido no corpo da requisição.' });
  }

  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;
