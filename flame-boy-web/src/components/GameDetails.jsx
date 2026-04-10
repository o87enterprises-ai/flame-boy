import './GameDetails.css'

function GameDetails({ game, onPlay, onBack }) {
  if (!game) return null

  const handlePlay = () => {
    onPlay(game)
  }

  return (
    <div className="game-details">
      {/* Header */}
      <div className="details-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="spacer"></div>
        {game.sourceUrl && (
          <a
            href={game.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
          >
            🔗 Source Code
          </a>
        )}
      </div>

      {/* Hero Section */}
      <div className="details-hero" style={{ '--game-color': game.color }}>
        <div className="details-icon-large">{game.icon}</div>
        <div className="details-title-section">
          <h1 className="details-title">{game.name}</h1>
          <div className="details-meta">
            <span className="details-developer">by {game.developer}</span>
            <span className="details-year">{game.year}</span>
          </div>
          <div className="details-rating">
            {'★'.repeat(Math.floor(game.rating))}{'☆'.repeat(5 - Math.floor(game.rating))}
            <span className="rating-value">{game.rating} / 5.0</span>
          </div>
          <div className="details-genres">
            {game.genre.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="play-section">
        <button className="play-button" onClick={handlePlay}>
          🎮 Play Now
        </button>
        <p className="play-hint">Free & open source - no download required</p>
      </div>

      {/* Description */}
      <div className="details-content">
        <section className="details-section">
          <h2>About This Game</h2>
          <p className="details-description">{game.description}</p>
        </section>

        <section className="details-section">
          <h2>Game Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Developer</span>
              <span className="info-value">{game.developer}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Release Year</span>
              <span className="info-value">{game.year}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Genre</span>
              <span className="info-value">{game.genre.join(', ')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Platform</span>
              <span className="info-value">Game Boy / Game Boy Color</span>
            </div>
            <div className="info-item">
              <span className="info-label">License</span>
              <span className="info-value">Open Source</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price</span>
              <span className="info-value highlight">Free</span>
            </div>
          </div>
        </section>

        {game.sourceUrl && (
          <section className="details-section">
            <h2>Open Source</h2>
            <p>
              This game is open source and freely available. You can view the source code,
              contribute to the project, or download the ROM directly from the{' '}
              <a href={game.sourceUrl} target="_blank" rel="noopener noreferrer">
                official repository
              </a>
              .
            </p>
          </section>
        )}

        <section className="details-section">
          <h2>Controls</h2>
          <div className="controls-info">
            <div className="control-item">
              <span className="control-label">D-Pad / Arrow Keys</span>
              <span className="control-desc">Move</span>
            </div>
            <div className="control-item">
              <span className="control-label">A Button (X key)</span>
              <span className="control-desc">Confirm / Action</span>
            </div>
            <div className="control-item">
              <span className="control-label">B Button (Z key)</span>
              <span className="control-desc">Cancel / Back</span>
            </div>
            <div className="control-item">
              <span className="control-label">Start (Enter)</span>
              <span className="control-desc">Start game</span>
            </div>
            <div className="control-item">
              <span className="control-label">Select (Shift)</span>
              <span className="control-desc">Open menu</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GameDetails
