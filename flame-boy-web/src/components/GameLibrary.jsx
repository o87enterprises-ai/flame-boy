import { useState, useMemo } from 'react'
import './GameLibrary.css'
import { GAMES, GENRES, searchGames, filterByGenre, getFeaturedGames } from '../data/games'

function GameLibrary({ onPlayGame, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or featured

  const filteredGames = useMemo(() => {
    let result = GAMES

    // Apply genre filter
    if (selectedFilter !== 'All') {
      result = filterByGenre(result, selectedFilter)
    }

    // Apply search
    if (searchQuery.trim()) {
      result = searchGames(result, searchQuery)
    }

    return result
  }, [selectedFilter, searchQuery])

  const featuredGames = useMemo(() => getFeaturedGames(GAMES), [])

  const handleGameClick = (game) => {
    onPlayGame(game)
  }

  return (
    <div className="game-library">
      {/* Header */}
      <div className="library-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>🎮 Game Library</h1>
        <div className="spacer"></div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search games by name, genre, or developer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
        )}
      </div>

      {/* Featured Games */}
      {!searchQuery && selectedFilter === 'All' && featuredGames.length > 0 && (
        <div className="featured-section">
          <h2>⭐ Featured Games</h2>
          <div className="featured-scroll">
            {featuredGames.map((game) => (
              <div
                key={game.id}
                className="featured-card"
                onClick={() => handleGameClick(game)}
                style={{ '--game-color': game.color }}
              >
                <div className="featured-icon">{game.icon}</div>
                <h3>{game.name}</h3>
                <p className="featured-genre">{game.genre.join(', ')}</p>
                <div className="featured-rating">
                  {'★'.repeat(Math.floor(game.rating))}{'☆'.repeat(5 - Math.floor(game.rating))}
                  <span className="rating-value">{game.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="library-controls">
        <div className="library-filters">
          {GENRES.slice(0, 6).map((genre) => (
            <button
              key={genre}
              className={`filter-btn ${selectedFilter === genre ? 'active' : ''}`}
              onClick={() => setSelectedFilter(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="view-controls">
          <span className="results-count">{filteredGames.length} games</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => handleGameClick(game)}
          >
            <div className="game-icon-wrapper" style={{ '--icon-color': game.color }}>
              <div className="game-icon">{game.icon}</div>
            </div>
            <div className="game-info">
              <h3 className="game-name">{game.name}</h3>
              <p className="game-meta">
                <span className="game-genre">{game.genre.join(', ')}</span>
                <span className="game-year">{game.year}</span>
              </p>
              <div className="game-rating">
                {'★'.repeat(Math.floor(game.rating))}{'☆'.repeat(5 - Math.floor(game.rating))}
                <span className="rating-value">{game.rating}</span>
              </div>
            </div>
            {game.featured && <div className="featured-badge">⭐ Featured</div>}
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No games found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Footer */}
      <div className="library-footer">
        <p>📦 All games are free and open source</p>
        <p className="footer-note">Games are loaded directly from bundled ROMs</p>
      </div>
    </div>
  )
}

export default GameLibrary
