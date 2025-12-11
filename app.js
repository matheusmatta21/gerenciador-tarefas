require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Segurança
app.use(helmet());
app.use(cors());

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Fazer usuário disponível em todos as views
app.use((req, res, next) => {
  const container = require('./container');
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = container.authService.verificarToken(token);
      res.locals.usuario = decoded;
    } catch (err) {
      res.clearCookie('token');
    }
  }
  
  next();
});

// Rotas
const authRouter = require('./routes/auth');
const projetosRouter = require('./routes/projetos');
const tarefasRouter = require('./routes/tarefas');

app.get('/', (req, res) => {
  res.render('index', { title: 'Gerenciador de Tarefas' });
});

app.use('/auth', authRouter);
app.use('/projetos', projetosRouter);
app.use('/tarefas', tarefasRouter);

// 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página não encontrada',
    status: 404,
    message: 'A página que você procura não existe.',
    error: {},
  });
});

// Error handler (deve ser o último)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;