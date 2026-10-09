import React, { useEffect, useRef, useState } from 'react';
import { getTitle, hasPoster } from '../api';

function MovieDetails({ imdbID, saved, onToggleSave, onClose }) {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const closeRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setInfo(null);
    setError('');
    getTitle(imdbID, controller.signal)
      .then(setInfo)
      .catch((err) => err.name !== 'AbortError' && setError("Couldn't load this title. Check your connection and try again."));
    return () => controller.abort();
  }, [imdbID]);

  // Esc closes, focus starts on the close button, and the page behind doesn't scroll.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [onClose]);

  const facts = info
    ? [
        ['Released', info.Released],
        ['Runtime', info.Runtime],
        ['Genre', info.Genre],
        ['Director', info.Director],
        ['Writer', info.Writer],
        ['Cast', info.Actors],
        ['Language', info.Language],
        ['Country', info.Country],
        ['Awards', info.Awards],
        ['Box office', info.BoxOffice],
      ].filter(([, v]) => v && v !== 'N/A')
    : [];

  const trailerUrl = info && `https://www.youtube.com/results?search_query=${encodeURIComponent(`${info.Title} ${info.Year} trailer`)}`;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="details" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <button type="button" className="close" ref={closeRef} onClick={onClose} aria-label="Close details">
          ×
        </button>

        {error && <p className="details-message">{error}</p>}
        {!info && !error && <p className="details-message">Loading…</p>}

        {info && (
          <div className="details-body">
            <div className="details-poster">
              {hasPoster(info.Poster) ? (
                <img src={info.Poster} alt={`${info.Title} poster`} />
              ) : (
                <span className="poster-fallback">{info.Title}</span>
              )}
            </div>
            <div className="details-info">
              <p className="kicker">
                {info.Type}, {info.Year}
                {info.Rated && info.Rated !== 'N/A' && <span className="rated">{info.Rated}</span>}
              </p>
              <h2 id="details-title">{info.Title}</h2>

              {info.Ratings?.length > 0 && (
                <ul className="ratings">
                  {info.Ratings.map((r) => (
                    <li key={r.Source}>
                      <b>{r.Value}</b>
                      <span>{r.Source.replace('Internet Movie Database', 'IMDb')}</span>
                    </li>
                  ))}
                </ul>
              )}

              {info.Plot && info.Plot !== 'N/A' && <p className="plot">{info.Plot}</p>}

              <div className="details-actions">
                <button type="button" className={saved ? 'btn is-saved' : 'btn btn-gold'} onClick={() => onToggleSave(info)}>
                  {saved ? 'Remove from watchlist' : 'Add to watchlist'}
                </button>
                <a className="btn" href={trailerUrl} target="_blank" rel="noreferrer">
                  Find the trailer
                </a>
                <a className="btn" href={`https://www.imdb.com/title/${info.imdbID}/`} target="_blank" rel="noreferrer">
                  Open on IMDb
                </a>
              </div>

              <dl className="facts">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
