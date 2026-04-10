// WasmBoy emulator integration utility
import { WasmBoy } from 'wasmboy'

class EmulatorCore {
  constructor() {
    this.isInitialized = false
    this.canvas = null
    this.currentRom = null
    this.onReady = null
    this.onError = null
  }

  async initialize(canvasElement, config = {}) {
    console.log('[Emulator] Starting initialization...')
    this.canvas = canvasElement

    const defaultConfig = {
      colorCorrect: false,
      fps: 60,
      audioSampleRate: 44100,
      frameSkip: 0,
      headless: false,
      logLevel: 'error'
    }

    const finalConfig = { ...defaultConfig, ...config }

    try {
      // Set the canvas for WasmBoy
      console.log('[Emulator] Setting canvas...')
      WasmBoy.setCanvas(this.canvas)
      
      // Configure WasmBoy
      console.log('[Emulator] Configuring WasmBoy...')
      WasmBoy.config({
        colorCorrection: finalConfig.colorCorrect,
        fps: finalConfig.fps
      })

      // Try to resume AudioContext if it exists (handles autoplay policy)
      try {
        console.log('[Emulator] Attempting to resume AudioContext...')
        WasmBoy.resumeAudioContext()
        console.log('[Emulator] AudioContext resumed successfully')
      } catch (e) {
        // AudioContext not created yet, will be created on user gesture
        console.log('[Emulator] AudioContext will start on user interaction (this is normal)')
      }

      this.isInitialized = true
      console.log('[Emulator] Initialization complete!')
      
      if (this.onReady) {
        this.onReady()
      }

      return true
    } catch (error) {
      console.error('[Emulator] Failed to initialize WasmBoy:', error)
      if (this.onError) {
        this.onError(error)
      }
      return false
    }
  }

  async loadRom(romData) {
    console.log('[Emulator] Loading ROM...')
    if (!this.isInitialized) {
      throw new Error('Emulator not initialized')
    }

    try {
      // romData can be ArrayBuffer, Uint8Array, or base64 string
      let romBuffer
      
      if (romData instanceof ArrayBuffer) {
        console.log('[Emulator] ROM data is ArrayBuffer')
        romBuffer = new Uint8Array(romData)
      } else if (romData instanceof Uint8Array) {
        console.log('[Emulator] ROM data is Uint8Array')
        romBuffer = romData
      } else if (typeof romData === 'string') {
        console.log('[Emulator] ROM data is base64 string')
        // Base64 string
        const binaryString = atob(romData)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        romBuffer = bytes
      } else {
        throw new Error('Invalid ROM data format')
      }

      console.log(`[Emulator] ROM buffer size: ${romBuffer.length} bytes`)
      console.log('[Emulator] Calling WasmBoy.loadRom...')
      
      // Load the ROM into WasmBoy
      WasmBoy.loadRom(romBuffer)
      this.currentRom = romData
      
      console.log('[Emulator] ROM loaded successfully!')
      return true
    } catch (error) {
      console.error('[Emulator] Failed to load ROM:', error)
      if (this.onError) {
        this.onError(error)
      }
      return false
    }
  }

  start() {
    console.log('[Emulator] Starting emulation...')
    if (!this.isInitialized || !this.currentRom) {
      console.warn('[Emulator] Cannot start: not initialized or no ROM loaded')
      return false
    }

    try {
      WasmBoy.play()
      console.log('[Emulator] Emulation started!')
      return true
    } catch (error) {
      console.error('[Emulator] Failed to start emulation:', error)
      if (this.onError) {
        this.onError(error)
      }
      return false
    }
  }

  stop() {
    if (this.isInitialized) {
      try {
        WasmBoy.pause()
      } catch (error) {
        console.error('Error stopping emulation:', error)
      }
    }
  }

  reset() {
    if (this.isInitialized && this.currentRom) {
      try {
        WasmBoy.reset()
        return true
      } catch (error) {
        console.error('Error resetting emulation:', error)
        return false
      }
    }
    return false
  }

  // Input handling
  setInput(input, pressed) {
    if (!this.isInitialized) return

    const inputMap = {
      'up': 'up',
      'down': 'down',
      'left': 'left',
      'right': 'right',
      'a': 'a',
      'b': 'b',
      'start': 'start',
      'select': 'select'
    }

    const mappedInput = inputMap[input]
    if (mappedInput) {
      try {
        WasmBoy.setJoypadState(mappedInput, pressed)
      } catch (error) {
        console.error('Error sending input:', error)
      }
    }
  }

  // Save state management
  saveState() {
    if (!this.isInitialized) return null
    
    try {
      const state = WasmBoy.saveState()
      return state
    } catch (error) {
      console.error('Error saving state:', error)
      return null
    }
  }

  loadState(state) {
    if (!this.isInitialized || !state) return false
    
    try {
      WasmBoy.loadState(state)
      return true
    } catch (error) {
      console.error('Error loading state:', error)
      return false
    }
  }

  // Get ROM info
  getRomInfo() {
    if (!this.isInitialized) return null
    
    try {
      return WasmBoy._getCartridgeInfo()
    } catch (error) {
      console.error('Error getting ROM info:', error)
      return null
    }
  }

  // Get FPS
  getFPS() {
    if (!this.isInitialized) return 0
    try {
      return WasmBoy.getFPS()
    } catch (error) {
      console.error('Error getting FPS:', error)
      return 0
    }
  }

  // Resume audio context (must be called after user gesture)
  async resumeAudioContext() {
    try {
      WasmBoy.resumeAudioContext()
      return true
    } catch (error) {
      console.error('Error resuming audio context:', error)
      return false
    }
  }

  // Cleanup
  destroy() {
    this.stop()
    this.isInitialized = false
    this.currentRom = null
  }
}

// Export singleton instance
export const emulatorCore = new EmulatorCore()

// Helper to fetch ROM from URL
export async function fetchRomFromUrl(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ROM: ${response.status} ${response.statusText}`)
    }
    const buffer = await response.arrayBuffer()
    return buffer
  } catch (error) {
    console.error('Error fetching ROM:', error)
    throw error
  }
}

// Helper to convert File to ArrayBuffer
export function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
