const headers = new Headers({
  "Content-Type": "application/json",
  "x-api-key": "live_Is2nkT9s9GdKoCoIScSJxxygQDhGTgJZwtxFg4sHQBOcdB89m8ARAbp6KfTlvW5b"
});

var requestOptions: RequestInit = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

/* fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error)); */



export function fetchBreeds() {
  return fetch("https://api.thecatapi.com/v1/breeds", requestOptions)//?has_images=true&limit=100
    .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
}
export function fetchCatByBreed(breedId: string) {
  return fetch(`https://api.thecatapi.com/v1/images/search?size=small&breed_ids=${breedId}`, requestOptions)
    .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
}