import React, { useCallback, useEffect, useRef, useState } from 'react';
import { searchTitles, SURPRISE_IDS, PAGE_SIZE } from './api';
import useStoredState from './useStoredState';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';

const TYPES = [
  ['', 'Everything'],
  ['movie', 'Movies'],
  ['series', 'Series'],
  ['episode', 'Episodes'],
];

const initialQuery = () => {
  try {
    return new URLSearchParams(window.location.search).get('q') || '';
  } catch {
    return '';
  }
};

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | loading | more | done | error
  const [error, setError] = useState('');
  const [view, setView] = useState('search');
  const [listFilter, setListFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [watchlist, setWatchlist] = useStoredState('movie-watchlist', []);
  const requestRef = useRef(null);

  const trimmed = query.trim();
  const yearValid = !year || /^\d{4}$/.test(year);

  // Keep the search in the address bar so results can be shared or bookmarked.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (trimmed) url.searchParams.set('q', trimmed);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, [trimmed]);

  const runSearch = useCallback(
    async (nextPage) => {
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      setStatus(nextPage === 1 ? 'loading' : 'more');
      setError('');
      try {
        const data = await searchTitles({ query: trimmed, type, year, page: nextPage }, controller.signal);
        setResults((prev) => (nextPage === 1 ? data.results : [...prev, ...data.results]));
        setTotal(data.total);
        setPage(nextPage);
        setStatus('done');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.friendly ? err.message : "Search isn't responding. Check your connection and try again.");
        setStatus('error');
        if (nextPage === 1) setResults([]);
      }
    },
    [trimmed, type, year]
  );

  // Debounced search whenever the query or filters change.
  useEffect(() => {
    if (trimmed.length < 2 || !yearValid) {
      requestRef.current?.abort();
      setResults([]);
      setTotal(0);
      setStatus('idle');
      setError('');
      return undefined;
    }
    const timer = setTimeout(() => runSearch(1), 450);
    return () => clearTimeout(timer);
  }, [trimmed, yearValid, runSearch]);

  const isSaved = (id) => watchlist.some((m) => m.imdbID === id);
  const isWatched = (id) => watchlist.some((m) => m.imdbID === id && m.watched);

  const toggleSave = (movie) =>
    setWatchlist((list) =>
      list.some((m) => m.imdbID === movie.imdbID)
        ? list.filter((m) => m.imdbID !== movie.imdbID)
        : [
            {
              imdbID: movie.imdbID,
              Title: movie.Title,
              Year: movie.Year,
              Type: movie.Type,
              Poster: movie.Poster,
              watched: false,
              added: Date.now(),
            },
            ...list,
          ]
    );

  const toggleWatched = (id) =>
    setWatchlist((list) => list.map((m) => (m.imdbID === id ? { ...m, watched: !m.watched } : m)));

  const surprise = () => setSelectedId(SURPRISE_IDS[Math.floor(Math.random() * SURPRISE_IDS.length)]);
  const closeDetails = useCallback(() => setSelectedId(null), []);

  const shownList = watchlist.filter((m) =>
    listFilter === 'all' ? true : listFilter === 'watched' ? m.watched : !m.watched
  );
  const watchedCount = watchlist.filter((m) => m.watched).length;
  const hasMore = results.length < total && results.length >= PAGE_SIZE * page;

  return (
    <div className="app">
      <header className="marquee">
        <div className="marquee-sign">
          <h1>Movie Search</h1>
          <p>Every film and series on IMDb, one search away</p>
        </div>
      </header>

      <nav className="tabs" aria-label="Sections">
        <button type="button" aria-current={view === 'search'} onClick={() => setView('search')}>
          Search
        </button>
        <button type="button" aria-current={view === 'watchlist'} onClick={() => setView('watchlist')}>
          Watchlist{watchlist.length > 0 && <span className="count">{watchlist.length}</span>}
        </button>
        <button type="button" className="surprise" onClick={surprise}>
          Surprise me
        </button>
      </nav>

      {view === 'search' && (
        <main>
          <form className="controls" role="search" onSubmit={(e) => e.preventDefault()}>
            <label className="query">
              <span className="sr-only">Title</span>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M10 4a6 6 0 1 0 3.47 10.9l4.82 4.81 1.41-1.41-4.81-4.82A6 6 0 0 0 10 4Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, like Interstellar"
                autoFocus
              />
            </label>
            <div className="filters">
              <div className="segmented" role="radiogroup" aria-label="Type">
                {TYPES.map(([value, label]) => (
                  <button key={label} type="button" role="radio" aria-checked={type === value} onClick={() => setType(value)}>
                    {label}
                  </button>
                ))}
              </div>
              <label className="year">
                <span>Year</span>
                <input
                  inputMode="numeric"
                  maxLength={4}
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                  placeholder="Any"
                  aria-invalid={!yearValid}
                />
              </label>
            </div>
          </form>

          <section aria-live="polite">
            {status === 'idle' && (
              <div className="empty">
                <p className="empty-title">What are we watching tonight?</p>
                <p>Type at least two letters of a title. Use the filters to find just series, or a specific year.</p>
              </div>
            )}
            {!yearValid && <p className="note">Enter a four-digit year, like 1999.</p>}
            {status === 'loading' && <p className="note">Searching…</p>}
            {status === 'error' && (
              <p className="note note-error">
                {error}{' '}
                <button type="button" className="link" onClick={() => runSearch(1)}>
                  Try again
                </button>
              </p>
            )}
            {status === 'done' && total === 0 && (
              <p className="note">No titles match "{trimmed}". Check the spelling, or clear the year and type filters.</p>
            )}
            {results.length > 0 && (
              <>
                <p className="result-count">
                  {total.toLocaleString()} {total === 1 ? 'title' : 'titles'} found
                </p>
                <div className="grid">
                  {results.map((m) => (
                    <MovieCard
                      key={m.imdbID}
                      movie={m}
                      saved={isSaved(m.imdbID)}
                      watched={isWatched(m.imdbID)}
                      onOpen={setSelectedId}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </div>
                {hasMore && (
                  <button type="button" className="btn load-more" onClick={() => runSearch(page + 1)} disabled={status === 'more'}>
                    {status === 'more' ? 'Loading…' : `Show more (${(total - results.length).toLocaleString()} left)`}
                  </button>
                )}
              </>
            )}
          </section>
        </main>
      )}

      {view === 'watchlist' && (
        <main>
          {watchlist.length === 0 ? (
            <div className="empty">
              <p className="empty-title">Your watchlist is empty</p>
              <p>Tap the bookmark on any title to save it here. It stays in this browser for next time.</p>
              <button type="button" className="btn btn-gold" onClick={() => setView('search')}>
                Find something to watch
              </button>
            </div>
          ) : (
            <>
              <div className="list-head">
                <p className="result-count">
                  {watchedCount} of {watchlist.length} watched
                </p>
                <div className="segmented" role="radiogroup" aria-label="Show">
                  {[
                    ['all', 'All'],
                    ['todo', 'To watch'],
                    ['watched', 'Watched'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" role="radio" aria-checked={listFilter === value} onClick={() => setListFilter(value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <progress className="progress" max={watchlist.length} value={watchedCount} aria-label="Watched so far" />
              <div className="grid">
                {shownList.map((m) => (
                  <div key={m.imdbID} className="list-item">
                    <MovieCard movie={m} saved watched={m.watched} onOpen={setSelectedId} onToggleSave={toggleSave} />
                    <button type="button" className="btn btn-small" onClick={() => toggleWatched(m.imdbID)}>
                      {m.watched ? 'Mark as not watched' : 'Mark as watched'}
                    </button>
                  </div>
                ))}
              </div>
              {shownList.length === 0 && <p className="note">Nothing here yet.</p>}
            </>
          )}
        </main>
      )}

      <footer className="footer">
        Data from <a href="https://www.omdbapi.com/">OMDb</a>. Your watchlist is saved only in this browser.
      </footer>

      {selectedId && (
        <MovieDetails imdbID={selectedId} saved={isSaved(selectedId)} onToggleSave={toggleSave} onClose={closeDetails} />
      )}
    </div>
  );
}

export default App;
