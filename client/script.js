const form = document.getElementById('testEndpointForm');
const responseDiv = document.getElementById('response');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Retrieve form values
  const idInput = document.getElementById('pokeId').value.trim();
  const nameInput = document.getElementById('pokeName').value.trim();
  const typeInput = document.getElementById('pokeType').value.trim();
  const movesInput = document.getElementById('pokeMoves').value.trim();
  const method = document.querySelector('input[name="method"]:checked').value;
  let endpoint = document.getElementById('endpoint').value;
  
  // Replace placeholders in the endpoint with user inputs (if provided)
  if (endpoint.includes(':name') && nameInput) {
    endpoint = endpoint.replace(':name', nameInput);
  }
  if (endpoint.includes(':id') && idInput) {
    endpoint = endpoint.replace(':id', idInput);
  }
  if (endpoint.includes(':type') && typeInput) {
    endpoint = endpoint.replace(':type', typeInput);
  }
  
  // Setup fetch options based on the chosen method
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // For POST endpoints, include the proper request body
  if (method === 'POST') {
    // Check which endpoint is selected and include appropriate properties
    if (endpoint.startsWith('/api/addMoves')) {
      options.body = JSON.stringify({
        id: idInput,
        name: nameInput,
        moves: movesInput ? movesInput.split(',').map(m => m.trim()) : []
      });
    } else if (endpoint.startsWith('/api/addPokemon')) {
      options.body = JSON.stringify({
        id: idInput,
        name: nameInput,
        type: typeInput ? typeInput.split(',').map(t => t.trim()) : []
      });
    }
  }
  
  try {
    const res = await fetch(endpoint, options);
    
    // For HEAD requests, just display the status since there’s no response body
    if (method === 'HEAD') {
      responseDiv.textContent = `HEAD request complete. Status: ${res.status} ${res.statusText}`;
      return;
    }
    
    if (!res.ok) {
      throw new Error(`Server returned status code ${res.status}`);
    }
    
    const data = await res.json();
    responseDiv.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    responseDiv.textContent = `Error: ${err.message}`;
  }
});
