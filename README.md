# 🍿 Movie App

A React app for searching movies and TV shows using the **OMDb API**. Type a title to see matching results, then click any result to see its full details.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![styled-components](https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styled-components&logoColor=white)
![OMDb API](https://img.shields.io/badge/OMDb_API-F5C518?style=flat-square)

## ✨ Features

- 🔎 **Live search** — results update as you type
- 🖼️ **Results grid** — poster, title, year and type (movie / series) for each match
- 📄 **Details panel** — click a result to see its IMDb rating, rating classification, plot and more
- ❌ Close the details panel to return to the results

## 🛠️ Built With

- **React** (hooks)
- **styled-components**
- **Axios**
- **[OMDb API](https://www.omdbapi.com/)**

## 📁 Project Structure

```
src/
├── App.js                           # Header, search box, results grid
├── components/
│   ├── MovieComponent.js            # Single result card
│   └── MovieInfoComponent.js        # Selected movie details
└── index.js
```

## 🚀 Getting Started

```bash
git clone https://github.com/Scarface96/movie-app.git
cd movie-app
npm install
npm start
```

Get a free API key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx) and set it as `API_KEY` in `src/App.js`.

## 📚 What I Learned

Calling a REST API with Axios, debouncing user input, lifting state up to share the selected movie between components, and building layouts with styled-components.

---

👤 **Tony Mulunda** — [GitHub @Scarface96](https://github.com/Scarface96)

## About This Project

A React application that integrates with the OMDb API to provide interactive movie search and detailed results. It demonstrates REST API integration, asynchronous data handling, React state, component architecture and responsive UI development.
