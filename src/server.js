const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const jsonResponses = require('./jsonResponses');

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client'), { index: 'client.html' }));
app.use('/documentation', express.static(path.join(__dirname, '../documentation')));




const pokedexData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/pokedex.json'), 'utf8')
);

/*-------------------------------------------------------------
  GET All Pokémon
  GET /api/getAllPokemon
-------------------------------------------------------------*/
app.get('/api/getAllPokemon', (req, res) => {
  jsonResponses.success(req, res, { pokedex: pokedexData });
});
app.head('/api/getAllPokemon', (req, res) => {
  jsonResponses.successMeta(req, res);
});

/*-------------------------------------------------------------
  GET Pokémon by Name
  GET /api/getPokemon?name=Pikachu
-------------------------------------------------------------*/
app.get('/api/getPokemon', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return jsonResponses.badRequest(req, res, 'Missing ?name= query parameter');
  }
  const pokemon = pokedexData.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  if (!pokemon) {
    return jsonResponses.notFound(req, res, `Pokémon with name "${name}" not found.`);
  }
  return jsonResponses.success(req, res, pokemon);
});
app.head('/api/getPokemon', (req, res) => {
  jsonResponses.successMeta(req, res);
});

/*-------------------------------------------------------------
  GET Pokémon by ID
  GET /api/getPokemonById/:id
-------------------------------------------------------------*/
app.get('/api/getPokemonById/:id', (req, res) => {
  const { id } = req.params;
  const pokemon = pokedexData.find((p) => p.id === Number(id));
  if (!pokemon) {
    return jsonResponses.notFound(req, res, `Pokémon with id "${id}" not found.`);
  }
  return jsonResponses.success(req, res, pokemon);
});
app.head('/api/getPokemonById/:id', (req, res) => {
  jsonResponses.successMeta(req, res);
});

/*-------------------------------------------------------------
  GET Pokémon by Type
  GET /api/getPokemonByType/:type
-------------------------------------------------------------*/
app.get('/api/getPokemonByType/:type', (req, res) => {
  const { type } = req.params;
  const filteredPokemon = pokedexData.filter((p) =>
    p.type.map(t => t.toLowerCase()).includes(type.toLowerCase())
  );
  if (filteredPokemon.length === 0) {
    return jsonResponses.notFound(req, res, `No Pokémon with type "${type}" found.`);
  }
  return jsonResponses.success(req, res, { pokedex: filteredPokemon });
});
app.head('/api/getPokemonByType/:type', (req, res) => {
  jsonResponses.successMeta(req, res);
});

/*-------------------------------------------------------------
  POST: Add a new Pokémon
  POST /api/addPokemon
-------------------------------------------------------------*/
app.post('/api/addPokemon', (req, res) => {
  const { id, name, type } = req.body;
  if (!id || !name || !type) {
    return jsonResponses.badRequest(req, res, 'Missing "id", "name", or "type" in request body');
  }
  
  const newPokemon = {
    id,
    name,
    type: Array.isArray(type) ? type : [type],
  };
  
  pokedexData.push(newPokemon);
  
  return jsonResponses.success(req, res, {
    message: 'Pokémon added successfully!',
    added: newPokemon,
  });
});

/*-------------------------------------------------------------
  POST: Add Moves to a Pokémon
  POST /api/addMoves
-------------------------------------------------------------*/
app.post('/api/addMoves', (req, res) => {
  const { id, name, moves } = req.body;
  if (!id || !name || !moves) {
    return jsonResponses.badRequest(req, res, 'Missing "id", "name", or "moves" in request body');
  }
  
  let pokemon = pokedexData.find(
    (p) => p.id === Number(id) || p.name.toLowerCase() === name.toLowerCase()
  );
  
  if (pokemon) {
    if (!pokemon.moves) {
      pokemon.moves = [];
    }
    moves.forEach((move) => {
      if (!pokemon.moves.includes(move)) {
        pokemon.moves.push(move);
      }
    });
    return jsonResponses.success(req, res, {
      message: 'Moves added to existing Pokémon.',
      updated: pokemon
    });
  } else {
    pokemon = {
      id,
      name,
      type: [],
      moves: Array.isArray(moves) ? moves : [moves]
    };
    pokedexData.push(pokemon);
    return jsonResponses.success(req, res, {
      message: 'New Pokémon created with moves.',
      added: pokemon
    });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
