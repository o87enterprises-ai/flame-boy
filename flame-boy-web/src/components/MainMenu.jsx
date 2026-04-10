import './MainMenu.css'

function MainMenu({ onContinue, onLoadRom, onOpenLibrary, onOpenSettings, lastPlayedGame }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onLoadRom(file)
    }
  }

  return (
    <div className="main-menu">
      <div className="menu-header">
        <div className="logo-container">
          <div className="logo">🎮</div>
        </div>
        <h1 className="title">FlameBoy</h1>
        <p className="subtitle">Game Boy Emulator</p>
      </div>

      {lastPlayedGame && (
        <div className="last-played-card">
          <span className="last-played-label">Last Played</span>
          <h2 className="last-played-title">{lastPlayedGame.name}</h2>
          <button className="btn-continue" onClick={onContinue}>
            Continue
          </button>
        </div>
      )}

      <div className="menu-buttons">
        <button className="menu-btn" onClick={onOpenLibrary}>
          <span className="btn-icon">📚</span>
          Game Library
        </button>
        <label className="menu-btn">
          <span className="btn-icon">📁</span>
          Load ROM
          <input
            type="file"
            accept=".gb,.gbc"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        <button className="menu-btn" onClick={onOpenSettings}>
          <span className="btn-icon">⚙️</span>
          Settings
        </button>
      </div>

      <div className="menu-footer">
        <p>Version 1.0 - Web Edition</p>
      </div>
    </div>
  )
}

export default MainMenu
