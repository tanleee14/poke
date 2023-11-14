async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  function displayPokemon(pokemon) {
    const pokemonListDiv = document.getElementById('pokemonList');
  const card = document.createElement('div');
  card.classList.add('pokemon-card');
  const name = document.createElement('h2');
  name.textContent = pokemon.name;
  card.appendChild(name);
  const image = document.createElement('img');
  image.src = pokemon.sprites.front_default;
  image.alt = pokemon.name;
  card.appendChild(image);

  // Display the types when hovering
  const typeLabel = document.createElement('div');
  typeLabel.classList.add('type-label');
  typeLabel.textContent = `Type: ${pokemon.types.map(type => type.type.name).join(', ')}`;
  typeLabel.style.display = 'none'; // Initially hidden
  card.appendChild(typeLabel);

  // Event listener for hover
  card.addEventListener('mouseenter', function() {
    typeLabel.style.display = 'block';
  });

  card.addEventListener('mouseleave', function() {
    typeLabel.style.display = 'none';
  });

  card.addEventListener('click', function() {
    navigateToPokemonDetails(pokemon.id);
  });

  pokemonListDiv.appendChild(card);
  }
  
  function navigateToPokemonDetails(pokemonId) {
    window.location.href = `pokemon-details.html?id=${pokemonId}`;
  }
  
  async function loadPokemons(offset, limit) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const data = await fetchData(apiUrl);
    return data.results;
  }
  
  async function displayPokemons(offset, limit) {
    const pokemonListDiv = document.getElementById('pokemonList');
    pokemonListDiv.innerHTML = ''; // Clear previous results
    const pokemons = await loadPokemons(offset, limit);
    pokemons.forEach(async (pokemon) => {
      const pokemonDetails = await fetchData(pokemon.url);
      displayPokemon(pokemonDetails);
    });
  }
  
  function handlePagination(page) {
    const limit = 20; // Number of Pokémon per page
    const offset = (page - 1) * limit;
    displayPokemons(offset, limit);
  }
  
  // Initial display
  handlePagination(1);
  
  // Display pagination links
  const paginationDiv = document.getElementById('pagination');
  for (let i = 1; i <= 10; i++) { // Assuming 10 pages for demonstration
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.addEventListener('click', function() {
      handlePagination(i);
    });
    paginationDiv.appendChild(pageLink);
  }
  
  // Function to search for a specific Pokémon
  async function searchPokemon() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
  
    // Fetch data for the specific Pokémon
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${searchTerm}/`;
    const pokemonData = await fetchData(pokemonUrl);
  
    // Clear previous results
    const pokemonListDiv = document.getElementById('pokemonList');
    pokemonListDiv.innerHTML = '';
  
    // Display the searched Pokémon
    if (pokemonData.name) {
      displayPokemon(pokemonData);
    } else {
      alert('Pokemon not found.');
    }
  }
  