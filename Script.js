const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
let offset = 0;
const limit = 20;
const caughtPokemons = JSON.parse(localStorage.getItem('caughtPokemons')) || [];

document.addEventListener('DOMContentLoaded', () => {
  loadPokemon();
  document.getElementById('load-more').addEventListener('click', loadPokemon);
});

async function loadPokemon() {
  try {
    const response = await fetch(`${API_BASE_URL}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    displayPokemon(data.results);
    offset += limit;
  } catch (error) {
    console.error('Error loading Pokemon:', error);
  }
}

function displayPokemon(pokemonList) {
  const pokemonContainer = document.getElementById('pokemon-list');
  pokemonList.forEach(async (pokemon) => {
    const pokemonData = await fetchPokemonData(pokemon.url);
    const card = document.createElement('div');
    card.className = 'col-6 col-md-3 card text-center p-2';
    card.innerHTML = `
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="img-fluid">
      <h5>${pokemonData.name}</h5>
      <button class="btn btn-sm ${caughtPokemons.includes(pokemonData.name) ? 'btn-danger' : 'btn-primary'}">
        ${caughtPokemons.includes(pokemonData.name) ? 'Release' : 'Catch'}
      </button>
    `;
    card.querySelector('button').addEventListener('click', () => toggleCatchPokemon(pokemonData.name));
    card.addEventListener('click', () => showPokemonDetails(pokemonData));
    pokemonContainer.appendChild(card);
  });
}

async function fetchPokemonData(url) {
  const response = await fetch(url);
  return await response.json();
}

async function showPokemonDetails(pokemon) {
  const details = document.getElementById('pokemon-details');
  details.innerHTML = `
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
    <h5>${pokemon.name}</h5>
    <p>Height: ${pokemon.height}</p>
    <p>Weight: ${pokemon.weight}</p>
    <p>Abilities: ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
  `;
  new bootstrap.Modal(document.getElementById('pokemon-details-modal')).show();
}

function toggleCatchPokemon(name) {
  const index = caughtPokemons.indexOf(name);
  if (index > -1) {
    caughtPokemons.splice(index, 1);
  } else {
    caughtPokemons.push(name);
  }
  localStorage.setItem('caughtPokemons', JSON.stringify(caughtPokemons));
  document.getElementById('pokemon-list').innerHTML = '';
  offset = 0;
  loadPokemon();
}
