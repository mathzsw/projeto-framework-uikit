const express = require('express');
const { engine } = require('express-handlebars');

const sequelize = require('./config/bd');
const Filme = require('./models/filme.model');
const Artista = require('./models/artista.model');
const Diretor = require('./models/diretor.model');
const FichaTecnica = require('./models/fichaTecnica.model');

require("./models/relacionamentosModels.model");

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/artistas', async (req, res) => {
  const artistas = await Artista.findAll({ raw: true });
  res.render('artistas/artista', { artistas });
});

app.get('/artistas/cadastrar', (req, res) => {
  res.render('artistas/cadastrarArtista');
});

app.post('/artistas', async (req, res) => {
  const nome = req.body.nome;
  const anoNascimento = req.body.anoNascimento;
  const nomeArtistico = req.body.nomeArtistico;

  await Artista.create({
    nome: nome,
    anoNascimento: anoNascimento,
    nomeArtistico: nomeArtistico
  });

  res.redirect('/artistas');
});

app.get('/artistas/:id', async (req, res) => {
  const id = req.params.id;

  const artista = await Artista.findByPk(id, {
    include: [{ model: Filme, as: 'filmes' }]
  });

  res.render('artistas/detalharArtista', { artista: artista.toJSON() });
});


app.get('/filmes/:id/ficha-tecnica/cadastrar', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, { raw: true });

  res.render('fichasTecnicas/cadastrarFichaTecnica', { filme });
});

app.post('/filmes/:id/ficha-tecnica', async (req, res) => {
  const id = req.params.id;
  const duracaoMinutos = req.body.duracaoMinutos;
  const orcamento = req.body.orcamento;
  const bilheteria = req.body.bilheteria;

  const filme = await Filme.findByPk(id);

  await filme.createFichaTecnica({
    duracaoMinutos: duracaoMinutos,
    orcamento: orcamento,
    bilheteria: bilheteria
  });

  res.redirect(`/filmes/${id}`);
});

app.get('/filmes', async (req, res) => {
  const filmes = await Filme.findAll({ raw: true });

  res.render('filmes/filme', { filmes });
});

app.get('/filmes/cadastrar', async (req, res) => {
  const artistas = await Artista.findAll({ raw: true });
  const diretores = await Diretor.findAll({ raw: true });

  res.render('filmes/cadastrarFilme', {
    artistas,
    diretores
  });
});

app.post('/filmes', async (req, res) => {
  console.log(req.body);

  const titulo = req.body.titulo;
  const ano = req.body.ano;
  const diretorId = req.body.diretorId;
  const artistas = req.body.artistas;

  const filme = await Filme.create({
    titulo: titulo,
    ano: ano,
    diretorId: diretorId
  });

  if (artistas) {
    await filme.setArtistas(artistas);
  }

  res.redirect('/filmes');
});

app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, {
    include: [
      { model: FichaTecnica, as: 'fichaTecnica' },
      { model: Diretor, as: 'diretor' },
      { model: Artista, as: 'artistas' }
    ]
  });

  if (!filme) {
    return res.status(404).send('Filme não encontrado');
  }

  res.render('filmes/detalharFilme', {
    filme: filme.toJSON()
  });
});
app.get('/diretores', async (req, res) => {
  const diretores = await Diretor.findAll({ raw: true });
  res.render('diretores/diretor', { diretores });
});

app.get('/diretores/cadastrar', (req, res) => {
  res.render('diretores/cadastrarDiretor');
});

app.post('/diretores', async (req, res) => {
  const nome = req.body.nome;
  const anoNascimento = req.body.anoNascimento;
  const nacionalidade = req.body.nacionalidade;

  await Diretor.create({
    nome: nome,
    anoNascimento: anoNascimento,
    nacionalidade: nacionalidade
  });

  res.redirect('/diretores');
});

app.get('/diretores/:id', async (req, res) => {
  const id = req.params.id;

  const diretor = await Diretor.findByPk(id, {
    include: [{ model: Filme, as: 'filmes' }]
  });

  res.render('diretores/detalharDiretor', { diretor: diretor.toJSON() });
});

sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando em http://localhost:3000');
    });
  })
  .catch((erro) => {
    console.log('Erro ao conectar com o banco:', erro);
  });