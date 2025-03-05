// Get references to the form and response elements for each endpoint
const responseDivGetPokemonByName = document.getElementById('responseGetPokemonByName');
const responseDivGetAllPokemon = document.getElementById('responseGetAllPokemon');
const responseDivGetPokemonById = document.getElementById('responseGetPokemonById');
const responseDivGetPokemonByType = document.getElementById('responseGetPokemonByType');


// Event listener for POST for /api/addMoves
document.getElementById("addMovesForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("movePokeId").value.trim();
  const name = document.getElementById("movePokeName").value.trim();
  const moves = document.getElementById("pokeMoves").value.trim().split(",").map(m => m.trim()); 

  if ((!id && !name) || moves.length === 0) {
    document.getElementById("responseAddMoves").innerHTML = "<p style='color: red;'>Either ID or Name is required, along with at least one move!</p>";
    return;
  }
  try {
    const response = await fetch("/api/addMoves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id ? Number(id) : null, name, moves }),
    });

    const data = await response.json();
    document.getElementById("responseAddMoves").innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    console.error("Error adding moves:", error);
    document.getElementById("responseAddMoves").innerHTML = "<p style='color: red;'>Failed to add moves.</p>";
  }
});

// Event listener for POST for /api/addPokemon
document.getElementById("addPokemonForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("newPokeId").value.trim();
  const name = document.getElementById("newPokeName").value.trim();
  const type = document.getElementById("newPokeType").value.trim().split(",").map(t => t.trim()); 

  if (!id || !name || type.length === 0) {
    document.getElementById("responseAddPokemon").innerHTML = "<p style='color: red;'>All fields are required!</p>";
    return;
  }
  try {
    const response = await fetch("/api/addPokemon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Number(id), name, type }),
    });
    const data = await response.json();
    document.getElementById("responseAddPokemon").innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    console.error("Error adding Pokémon:", error);
    document.getElementById("responseAddPokemon").innerHTML = "<p style='color: red;'>Failed to add Pokémon.</p>";
  }
});

// Event listener for GET and HEAD /api/getPokemonByType form
document.addEventListener('DOMContentLoaded', () => {
  const responseDivGetPokemonByType = document.getElementById('responseGetPokemonByType');

  document.getElementById('getPokemonByTypeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const pokeTypeInput = document.getElementById('pokeType').value.trim();

    if (!pokeTypeInput) {
      responseDivGetPokemonByType.textContent = "Please enter a Pokémon type.";
      return;
    }
    const selectedRadio = document.querySelector('input[name="requestTypeForGetPokemonByType"]:checked');
    if (!selectedRadio) {
      console.error('No request type selected!');
      responseDivGetPokemonByType.textContent = 'Please select a request type.';
      return;
    }
    const requestType = selectedRadio.value;
    const endpoint = `/api/getPokemonByType/${pokeTypeInput}`;

    const options = { method: requestType };

    try {
      const res = await fetch(endpoint, options);

      if (requestType === 'GET') {
        if (!res.ok) {
          throw new Error(`Server returned status code ${res.status}`);
        }
        const data = await res.json();
        responseDivGetPokemonByType.textContent = JSON.stringify(data, null, 2);
      } else if (requestType === 'HEAD') {
        const headers = res.headers;
        const contentLength = headers.get('Content-Length');
        const statusText = `${res.status} ${res.statusText}`;

        responseDivGetPokemonByType.textContent = `Status: ${statusText}\nContent-Length: ${contentLength}`;
      }
    } catch (err) {
      responseDivGetPokemonByType.textContent = `Error: ${err.message}`;
    }
  });
});

// Event listener for GET and HEAD /api/getPokemonById form
document.getElementById('getPokemonByIdForm').addEventListener('submit', async (e) => {
  e.preventDefault();


  const pokeIdInput = document.getElementById('pokeId').value.trim(); 
  const requestType = document.querySelector('input[name="requestTypeForGetPokemonById"]:checked').value; 
  const endpoint = `/api/getPokemonById/${pokeIdInput}`;  

  if (!pokeIdInput) {
    responseDivGetPokemonById.textContent = "Please enter a Pokémon ID.";
    return;
  }
  const options = {
    method: requestType
  };
  try {
    const res = await fetch(endpoint, options);
    if (requestType === 'GET') {
      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }
      const data = await res.json();
      responseDivGetPokemonById.textContent = JSON.stringify(data, null, 2);
    }  
    else if (requestType === 'HEAD') {
      const headers = res.headers;
      const contentLength = headers.get('Content-Length');
      const statusText = `${res.status} ${res.statusText}`;

      responseDivGetPokemonById.textContent = `Status: ${statusText}\nContent-Length: ${contentLength}`;
    }
  } catch (err) {
    responseDivGetPokemonById.textContent = `Error: ${err.message}`;
  }
});


// Event listener for GET and HEAD /api/getPokemonByName 
document.getElementById('getPokemonByNameForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const pokeNameInput = document.getElementById('pokeNameByName').value.trim(); 
  const requestType = document.querySelector('input[name="requestTypeForGetPokemonByName"]:checked').value; 
  const endpoint = `/api/getPokemon?name=${pokeNameInput}`;  

  if (!pokeNameInput) {
    responseDivGetPokemonByName.textContent = "Please enter a Pokémon name.";
    return;
  }
  const options = {
    method: requestType
  };
  try {
    const res = await fetch(endpoint, options);
    if (requestType === 'GET') {
      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }
      const data = await res.json();
      responseDivGetPokemonByName.textContent = JSON.stringify(data, null, 2);
    } 
    else if (requestType === 'HEAD') {
      const headers = res.headers;
      const contentLength = headers.get('Content-Length');
      const statusText = `${res.status} ${res.statusText}`;

      responseDivGetPokemonByName.textContent = `Status: ${statusText}\nContent-Length: ${contentLength}`;
    }
  } catch (err) {
    responseDivGetPokemonByName.textContent = `Error: ${err.message}`;
  }
});

// Event listener for GET and HEAD /api/getAllPokemon form
document.getElementById('getAllPokemonForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const requestType = document.querySelector('input[name="requestTypeForGetAllPokemon"]:checked').value; // Updated name selector

  const endpoint = '/api/getAllPokemon';

  const options = {
    method: requestType
  };

  try {
    const res = await fetch(endpoint, options);
    if (requestType === 'GET') {
      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }
      const data = await res.json();
      responseDivGetAllPokemon.textContent = JSON.stringify(data, null, 2);
    } else {
      responseDivGetAllPokemon.textContent = `HEAD request complete. Status: ${res.status} ${res.statusText}`;
    }
  } catch (err) {
    responseDivGetAllPokemon.textContent = `Error: ${err.message}`;
  }
});

// Box functionality
const endpointToggles = document.querySelectorAll('.endpoint-toggle');

endpointToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const content = toggle.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });
});
