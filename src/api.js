// OMDb (https://www.omdbapi.com/) — free key, 1,000 requests per day.
// Set REACT_APP_OMDB_KEY to use your own key; the built-in one keeps the demo working.
const API_KEY = process.env.REACT_APP_OMDB_KEY || 'be0ef4be';
const BASE = 'https://www.omdbapi.com/';

export const PAGE_SIZE = 10; // OMDb always returns 10 results per page

async function omdb(params, signal) {
  const query = new URLSearchParams({ ...params, apikey: API_KEY });
  const res = await fetch(`${BASE}?${query}`, { signal });
  if (!res.ok) throw new Error('network');
  return res.json();
}

/** Search titles. Resolves to { results, total } or throws with a friendly message. */
export async function searchTitles({ query, type, year, page = 1 }, signal) {
  const params = { s: query.trim(), page: String(page) };
  if (type) params.type = type;
  if (year) params.y = year;
  const data = await omdb(params, signal);
  if (data.Response === 'False') {
    if (/not found/i.test(data.Error)) return { results: [], total: 0 };
    if (/too many/i.test(data.Error)) {
      const err = new Error('Lots of titles match that. Add another word or a year to narrow it down.');
      err.friendly = true;
      throw err;
    }
    const err = new Error(data.Error || 'Search failed.');
    err.friendly = true;
    throw err;
  }
  return { results: data.Search || [], total: Number(data.totalResults) || 0 };
}

/** Full details for one title. */
export async function getTitle(imdbID, signal) {
  const data = await omdb({ i: imdbID, plot: 'full' }, signal);
  if (data.Response === 'False') throw new Error(data.Error || 'Title not found.');
  return data;
}

/** A short list of well-loved titles for "Surprise me". */
export const SURPRISE_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0468569', // The Dark Knight
  'tt0109830', // Forrest Gump
  'tt0133093', // The Matrix
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt0110912', // Pulp Fiction
  'tt0245429', // Spirited Away
  'tt6751668', // Parasite
  'tt0903747', // Breaking Bad
  'tt1825683', // Black Panther
  'tt4154796', // Avengers: Endgame
  'tt0114709', // Toy Story
];

export const hasPoster = (url) => url && url !== 'N/A';
