# 🍿 Movie App

A React app for searching movies and TV shows using the **OMDb API**. Search by title, filter by type and year, open full details with ratings from IMDb, Rotten Tomatoes and Metacritic, and keep a watchlist of what you want to see.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![OMDb API](https://img.shields.io/badge/OMDb_API-F5C518?style=flat-square)

## 🌐 Live Demo

**[scarface96.github.io/movie-app](https://scarface96.github.io/movie-app/)** — rebuilt and redeployed automatically on every push to `main`.

## ✨ Features

- 🔎 **Live search** with debouncing and cancelled stale requests
- 🎛️ **Filters** for movies, series or episodes, and release year
- ➕ **Show more** pagination with a running count of results
- 🎬 **Details dialog**: full plot, IMDb / Rotten Tomatoes / Metacritic scores, cast, awards, box office, plus links to the trailer and IMDb
- 🔖 **Watchlist** saved in your browser, with *watched* tracking and a progress bar
- 🎲 **Surprise me** opens a random all-time favourite
- 🔗 **Shareable searches**: the query is kept in the address bar (`?q=batman`)
- Friendly empty, error and "too many results" states; keyboard and screen-reader friendly dialog (Esc to close, focus returns)

## 🛠️ Built With

- **React 18** (hooks, plus a small `useStoredState` custom hook for localStorage)
- Native `fetch` with `AbortController`
- **[OMDb API](https://www.omdbapi.com/)**
- Plain CSS with custom properties
- **Jest** tests for the API layer (`src/api.test.js`)
- **GitHub Actions** → GitHub Pages (`.github/workflows/deploy.yml`)

## 📁 Project Structure

```
src/
├── App.js                    # Search, filters, results, watchlist views
├── api.js                    # OMDb calls and error handling
├── api.test.js               # Tests for api.js
├── useStoredState.js         # useState that persists to localStorage
├── components/
│   ├── MovieCard.js          # Poster card with watchlist bookmark
│   └── MovieDetails.js       # Accessible details dialog
├── index.css                 # Styles
└── index.js
```

## 🚀 Getting Started

```bash
git clone https://github.com/Scarface96/movie-app.git
cd movie-app
npm install
npm start
```

The app ships with a demo OMDb key. To use your own, get a free key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx) and start the app with `REACT_APP_OMDB_KEY=yourkey npm start`.

## 📚 What I Learned

Calling a REST API, debouncing and cancelling requests, paginating results, persisting state with a custom hook, building an accessible modal dialog, and deploying with GitHub Actions.

---

👤 **Tony Mulunda** — [GitHub @Scarface96](https://github.com/Scarface96)

## About This Project

A React application that integrates with the OMDb API to provide interactive movie search and detailed results. It demonstrates REST API integration, asynchronous data handling, React state, component architecture and responsive UI development.
