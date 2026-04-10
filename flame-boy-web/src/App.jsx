import { useState, useEffect } from 'react'
import MainMenu from './components/MainMenu'
import Emulator from './components/Emulator'
import GameLibrary from './components/GameLibrary'
import GameDetails from './components/GameDetails'
import Settings from './components/Settings'
import { getGameBySlug } from './data/games'

function App() {
  const [currentView, setCurrentView] = useState('menu')
  const [lastPlayedGame, setLastPlayedGame] = useState(null)
  const [selectedGame, setSelectedGame] = useState(null)
  const [romSource, setRomSource] = useState(null)
  const [settings, setSettings] = useState({
    sound: true,
    vibration: true,
    autoSave: true,
    fpsCounter: false,
    screenFilter: 'none'
  })

  useEffect(() => {
    const saved = localStorage.getItem('flameboy_last_played')
    if (saved) {
      setLastPlayedGame(JSON.parse(saved))
    }
    const savedSettings = localStorage.getItem('flameboy_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleLoadRom = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const romData = {
        name: file.name,
        data: e.target.result,
        path: URL.createObjectURL(file)
      }
      setRomSource({ type: 'file', file: file })
      setSelectedGame({ id: 'custom', name: file.name, slug: 'custom' })
      setLastPlayedGame({ name: file.name, path: romData.path })
      localStorage.setItem('flameboy_last_played', JSON.stringify({
        name: file.name,
        path: romData.path
      }))
      setCurrentView('emulator')
    }
    reader.readAsDataURL(file)
  }

  const handleViewGameDetails = (game) => {
    setSelectedGame(game)
    setCurrentView('details')
  }

  const handlePlayGame = (game) => {
    setSelectedGame(game)
    
    // Set ROM source based on game configuration
    if (game.romUrl) {
      setRomSource({ type: 'url', url: game.romUrl })
    } else if (game.romPath) {
      // Bundled ROM from public folder
      setRomSource({ type: 'bundled', url: game.romPath })
    } else {
      console.error('No ROM source available for game:', game.name)
      return
    }

    setLastPlayedGame({ name: game.name, id: game.id })
    localStorage.setItem('flameboy_last_played', JSON.stringify({
      name: game.name,
      id: game.id
    }))
    setCurrentView('emulator')
  }

  const handleContinue = () => {
    if (lastPlayedGame) {
      // Try to find the game in our library
      const game = getGameBySlug([selectedGame], lastPlayedGame.id) || selectedGame
      setSelectedGame(game || { id: lastPlayedGame.id, name: lastPlayedGame.name })
      setCurrentView('emulator')
    }
  }

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('flameboy_settings', JSON.stringify(newSettings))
  }

  const handleBackToMenu = () => {
    setCurrentView('menu')
  }

  const handleBackToLibrary = () => {
    setCurrentView('library')
  }

  const handleBackToDetails = () => {
    setCurrentView('details')
  }

  return (
    <div className="app">
      {currentView === 'menu' && (
        <MainMenu
          onContinue={handleContinue}
          onLoadRom={handleLoadRom}
          onOpenLibrary={() => setCurrentView('library')}
          onOpenSettings={() => setCurrentView('settings')}
          lastPlayedGame={lastPlayedGame}
        />
      )}
      {currentView === 'emulator' && (
        <Emulator
          game={selectedGame}
          romSource={romSource}
          onBack={handleBackToLibrary}
          settings={settings}
        />
      )}
      {currentView === 'library' && (
        <GameLibrary
          onPlayGame={handleViewGameDetails}
          onBack={handleBackToMenu}
        />
      )}
      {currentView === 'details' && selectedGame && (
        <GameDetails
          game={selectedGame}
          onPlay={handlePlayGame}
          onBack={handleBackToLibrary}
        />
      )}
      {currentView === 'settings' && (
        <Settings
          settings={settings}
          onSave={handleSaveSettings}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  )
}

export default App
