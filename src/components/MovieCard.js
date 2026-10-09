import React from 'react';
import { hasPoster } from '../api';

function MovieCard({ movie, saved, watched, onOpen, onToggleSave }) {
  const { Title, Year, Type, Poster } = movie;

  return (
    <article className={watched ? 'card is-watched' : 'card'}>
      <button type="button" className="card-open" onClick={() => onOpen(movie.imdbID)}>
        {hasPoster(Poster) ? (
          <img src={Poster} alt="" loading="lazy" />
        ) : (
          <span className="poster-fallback" aria-hidden="true">
            {Title}
          </span>
        )}
        <span className="card-text">
          <b>{Title}</b>
          <span>
            {Year}, <span className="type">{Type}</span>
          </span>
        </span>
      </button>
      <button
        type="button"
        className={saved ? 'save is-saved' : 'save'}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${Title} from your watchlist` : `Add ${Title} to your watchlist`}
        title={saved ? 'In your watchlist' : 'Add to watchlist'}
        onClick={() => onToggleSave(movie)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
        </svg>
      </button>
      {watched && <span className="watched-badge">Watched</span>}
    </article>
  );
}

export default MovieCard;
