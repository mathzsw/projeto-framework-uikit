const sequelize = require('./config/bd');
const Filme = require("./models/filme.model");
const FichaTecnica = require("./models/fichaTecnica.model");
require("./models/relacionamentosModels.model");

app.get('/artistas', async (req, res) => {
  const artistas = await Artista.findAll({ raw: true });
  res.render('artistas', { artistas });
});

app.get('/artistas/cadastrar', (req, res) => {
  res.render('cadastrarArtista');
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

  res.render('detalharArtista', { artista: artista.toJSON() });
});


app.get('/filmes/:id/ficha-tecnica/cadastrar', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, { raw: true });

  res.render('cadastrarFichaTecnica', { filme });
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

app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, {
    include: [{ model: FichaTecnica, as: 'fichaTecnica' }]
  });

  res.render('detalharFilme', { filme: filme.toJSON() });
});

app.post('/filmes', async (req, res) => {
  const nome = req.body.nome;
  const ano = req.body.ano;
  const diretorId = req.body.diretorId;

  await Filme.create({
    nome: nome,
    ano: ano,
    diretorId: diretorId
  });

  res.redirect('/filmes');
});

app.get('/filmes/cadastrar', async (req, res) => {
  const artistas = await Artista.findAll({ raw: true });
  res.render('cadastrarFilme', { artistas });
});

app.get('/filmes/cadastrar', async (req, res) => {
  const diretores = await Diretor.findAll({ raw: true });
  res.render('cadastrarFilme', { diretores });
});

app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, {
    include: [{ model: Diretor, as: 'diretor' }]
  });

  res.render('detalharFilme', { filme: filme.toJSON() });
});

app.post('/filmes', async (req, res) => {
  const nome = req.body.nome;
  const ano = req.body.ano;
  const artistas = req.body.artistas; // array com os ids selecionados

  const filme = await Filme.create({
    nome: nome,
    ano: ano
  });

  await filme.setArtistas(artistas);

  res.redirect('/filmes');
});

app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, {
    include: [{ model: Artista, as: 'artistas' }]
  });

  res.render('detalharFilme', { filme: filme.toJSON() });
});

app.get('/diretores', async (req, res) => {
  const diretores = await Diretor.findAll({ raw: true });
  res.render('diretores', { diretores });
});

app.get('/diretores/cadastrar', (req, res) => {
  res.render('cadastrarDiretor');
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

  res.render('detalharDiretor', { diretor: diretor.toJSON() });
});
