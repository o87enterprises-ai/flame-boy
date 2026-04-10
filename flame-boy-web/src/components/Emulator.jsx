import { useState, useEffect, useRef, useCallback } from 'react'
import './Emulator.css'
import { emulatorCore, fetchRomFromUrl, fileToArrayBuffer } from '../utils/emulator'

function Emulator({ game, romSource, onBack, settings }) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [isEmulating, setIsEmulating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fps, setFps] = useState(0)
  const canvasRef = useRef(null)
  const fpsIntervalRef = useRef(null)

  // Initialize emulator on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let mounted = true
    let timeoutId = null

    async function initEmulator() {
      try {
        setIsLoading(true)
        setError(null)

        // Add a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.error('Emulator initialization timed out')
            setError('Emulation timed out during initialization. The game may not be compatible.')
            setIsLoading(false)
          }
        }, 15000) // 15 second timeout

        // Initialize wasmBoy
        const initialized = await emulatorCore.initialize(canvas, {
          colorCorrect: false,
          fps: 60
        })

        if (!initialized) {
          throw new Error('Failed to initialize emulator')
        }

        if (!mounted) return

        // Load ROM
        let romBuffer
        if (romSource.type === 'url') {
          romBuffer = await fetchRomFromUrl(romSource.url)
        } else if (romSource.type === 'file') {
          romBuffer = await fileToArrayBuffer(romSource.file)
        } else if (romSource.type === 'bundled') {
          // Load from public folder
          romBuffer = await fetchRomFromUrl(romSource.url)
        }

        if (!romBuffer) {
          throw new Error('Failed to load ROM data')
        }

        if (!mounted) return

        const loaded = await emulatorCore.loadRom(romBuffer)
        if (!loaded) {
          throw new Error('Failed to load ROM')
        }

        if (!mounted) return

        // Start emulation
        emulatorCore.start()
        setIsEmulating(true)
        setIsLoading(false)
        
        // Clear timeout since we succeeded
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        
        displayToast(`Now playing: ${game?.name || 'Game'}`)
      } catch (err) {
        console.error('Emulator initialization error:', err)
        if (mounted) {
          // Clear timeout on error too
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          setError(err.message || 'Failed to start emulation')
          setIsLoading(false)
        }
      }
    }

    initEmulator()

    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      emulatorCore.stop()
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current)
      }
    }
  }, [game, romSource])

  // FPS counter
  useEffect(() => {
    if (settings?.fpsCounter && isEmulating) {
      fpsIntervalRef.current = setInterval(() => {
        // In a real implementation, we'd get actual FPS from wasmBoy
        // For now, this is a placeholder
        setFps(60)
      }, 1000)
    } else {
      setFps(0)
    }

    return () => {
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current)
      }
    }
  }, [settings?.fpsCounter, isEmulating])

  // Auto-save
  useEffect(() => {
    if (settings?.autoSave && isEmulating && game) {
      const autoSaveInterval = setInterval(() => {
        handleSaveState()
      }, 10 * 60 * 1000) // 10 minutes

      return () => clearInterval(autoSaveInterval)
    }
  }, [settings?.autoSave, isEmulating, game])

  const displayToast = useCallback((message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }, [])

  const handleSaveState = useCallback(() => {
    if (game) {
      const state = emulatorCore.saveState()
      if (state) {
        const stateKey = `flameboy_state_${game.id}`
        localStorage.setItem(stateKey, JSON.stringify({
          timestamp: Date.now(),
          gameName: game.name,
          state: state
        }))
        displayToast('Game saved!')
      }
    }
  }, [game, displayToast])

  const handleLoadState = useCallback(() => {
    if (game) {
      const stateKey = `flameboy_state_${game.id}`
      const saved = localStorage.getItem(stateKey)
      if (saved) {
        const saveData = JSON.parse(saved)
        const loaded = emulatorCore.loadState(saveData.state)
        if (loaded) {
          displayToast('Loaded saved state')
        } else {
          displayToast('Failed to load save state')
        }
      } else {
        displayToast('No save state found')
      }
    }
  }, [game, displayToast])

  const handleReset = useCallback(() => {
    const success = emulatorCore.reset()
    if (success) {
      displayToast('Game reset')
    }
  }, [displayToast])

  const handleMenuAction = useCallback((action) => {
    setShowMenu(false)
    switch (action) {
      case 'load':
        handleLoadState()
        break
      case 'save':
        handleSaveState()
        break
      case 'reset':
        handleReset()
        break
      case 'exit':
        emulatorCore.stop()
        onBack()
        break
      default:
        break
    }
  }, [handleLoadState, handleSaveState, handleReset, onBack])

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyboardInput(e.key, true)
    }
    const handleKeyUp = (e) => {
      handleKeyboardInput(e.key, false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleKeyboardInput = (key, pressed) => {
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'z': 'b',
      'x': 'a',
      'Enter': 'start',
      'Shift': 'select'
    }

    const input = keyMap[key.toLowerCase()]
    if (input) {
      emulatorCore.setInput(input, pressed)
      e?.preventDefault()
    }
  }

  const handleTouchStart = (input) => {
    emulatorCore.setInput(input, true)
    if (settings?.vibration && navigator.vibrate) {
      navigator.vibrate(30)
    }
  }

  const handleTouchEnd = (input) => {
    emulatorCore.setInput(input, false)
  }

  // Screen filter
  const getScreenFilterClass = () => {
    if (!settings?.screenFilter || settings.screenFilter === 'none') return ''
    return `filter-${settings.screenFilter.toLowerCase()}`
  }

  return (
    <div className="emulator">
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">🎮</div>
          <p>Loading {game?.name || 'game'}...</p>
          <p className="loading-hint">This may take a few seconds</p>
        </div>
      )}

      {/* Error Screen */}
      {error && (
        <div className="error-overlay">
          <div className="error-icon">❌</div>
          <h3>Failed to Load Game</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => onBack()}>
            Back to Library
          </button>
        </div>
      )}

      {/* Top Bar */}
      {!isLoading && !error && (
        <>
          <div className="emulator-top-bar">
            <button className="icon-btn back-btn" onClick={onBack}>
              ← Back
            </button>
            <span className="game-title">{game?.name || 'Game'}</span>
            <div className="top-bar-actions">
              {settings?.fpsCounter && fps > 0 && (
                <span className="fps-display">{fps} FPS</span>
              )}
              <button className="icon-btn" onClick={handleSaveState} title="Save State">
                💾
              </button>
              <button className="icon-btn" onClick={() => setShowMenu(true)} title="Menu">
                ☰
              </button>
            </div>
          </div>

          {/* Game Screen */}
          <div className={`screen-container ${getScreenFilterClass()}`}>
            <canvas
              ref={canvasRef}
              width={320}
              height={288}
              className="game-canvas"
            />
          </div>

          {/* Controls */}
          <div className="controls-container">
            {/* D-Pad */}
            <div className="dpad-section">
              <div className="dpad">
                <button
                  className="dpad-btn dpad-up"
                  onTouchStart={() => handleTouchStart('up')}
                  onTouchEnd={() => handleTouchEnd('up')}
                  onMouseDown={() => handleTouchStart('up')}
                  onMouseUp={() => handleTouchEnd('up')}
                  onMouseLeave={() => handleTouchEnd('up')}
                >
                  ▲
                </button>
                <button
                  className="dpad-btn dpad-left"
                  onTouchStart={() => handleTouchStart('left')}
                  onTouchEnd={() => handleTouchEnd('left')}
                  onMouseDown={() => handleTouchStart('left')}
                  onMouseUp={() => handleTouchEnd('left')}
                  onMouseLeave={() => handleTouchEnd('left')}
                >
                  ◀
                </button>
                <div className="dpad-center"></div>
                <button
                  className="dpad-btn dpad-right"
                  onTouchStart={() => handleTouchStart('right')}
                  onTouchEnd={() => handleTouchEnd('right')}
                  onMouseDown={() => handleTouchStart('right')}
                  onMouseUp={() => handleTouchEnd('right')}
                  onMouseLeave={() => handleTouchEnd('right')}
                >
                  ▶
                </button>
                <button
                  className="dpad-btn dpad-down"
                  onTouchStart={() => handleTouchStart('down')}
                  onTouchEnd={() => handleTouchEnd('down')}
                  onMouseDown={() => handleTouchStart('down')}
                  onMouseUp={() => handleTouchEnd('down')}
                  onMouseLeave={() => handleTouchEnd('down')}
                >
                  ▼
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              <div className="action-buttons">
                <button
                  className="action-btn btn-b"
                  onTouchStart={() => handleTouchStart('b')}
                  onTouchEnd={() => handleTouchEnd('b')}
                  onMouseDown={() => handleTouchStart('b')}
                  onMouseUp={() => handleTouchEnd('b')}
                  onMouseLeave={() => handleTouchEnd('b')}
                >
                  B
                </button>
                <button
                  className="action-btn btn-a"
                  onTouchStart={() => handleTouchStart('a')}
                  onTouchEnd={() => handleTouchEnd('a')}
                  onMouseDown={() => handleTouchStart('a')}
                  onMouseUp={() => handleTouchEnd('a')}
                  onMouseLeave={() => handleTouchEnd('a')}
                >
                  A
                </button>
              </div>
              <div className="start-select">
                <button
                  className="small-btn"
                  onTouchStart={() => handleTouchStart('start')}
                  onTouchEnd={() => handleTouchEnd('start')}
                  onMouseDown={() => handleTouchStart('start')}
                  onMouseUp={() => handleTouchEnd('start')}
                >
                  START
                </button>
                <button
                  className="small-btn"
                  onTouchStart={() => handleTouchStart('select')}
                  onTouchEnd={() => handleTouchEnd('select')}
                  onMouseDown={() => handleTouchStart('select')}
                  onMouseUp={() => handleTouchEnd('select')}
                >
                  SELECT
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {showToast && (
        <div className="toast">{toastMessage}</div>
      )}

      {/* Menu Modal */}
      {showMenu && (
        <div className="menu-modal" onClick={() => setShowMenu(false)}>
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            <h3>Menu</h3>
            <button onClick={() => handleMenuAction('load')}>Load State</button>
            <button onClick={() => handleMenuAction('save')}>Save State</button>
            <button onClick={() => handleMenuAction('reset')}>Reset</button>
            <button onClick={() => handleMenuAction('exit')} className="exit-btn">Exit</button>
            <button className="close-btn" onClick={() => setShowMenu(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Emulator
