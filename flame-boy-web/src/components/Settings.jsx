import { useState } from 'react'
import './Settings.css'

function Settings({ settings, onSave, onBack }) {
  const [localSettings, setLocalSettings] = useState({ ...settings })

  const handleToggle = (key) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleScreenFilterChange = (value) => {
    setLocalSettings(prev => ({
      ...prev,
      screenFilter: value
    }))
  }

  const handleSave = () => {
    onSave(localSettings)
    onBack()
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Settings</h1>
        <div className="spacer"></div>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Emulation</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Sound</span>
              <span className="setting-description">Enable game audio</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.sound}
                onChange={() => handleToggle('sound')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Vibration</span>
              <span className="setting-description">Haptic feedback on button press</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.vibration}
                onChange={() => handleToggle('vibration')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Auto-save</span>
              <span className="setting-description">Auto-save every 10 minutes</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.autoSave}
                onChange={() => handleToggle('autoSave')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">FPS Counter</span>
              <span className="setting-description">Show frames per second</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.fpsCounter}
                onChange={() => handleToggle('fpsCounter')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Display</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Screen Filter</span>
              <span className="setting-description">Visual filter effect</span>
            </div>
            <select
              className="filter-select"
              value={localSettings.screenFilter}
              onChange={(e) => handleScreenFilterChange(e.target.value)}
            >
              <option value="none">None</option>
              <option value="scanlines">Scanlines</option>
              <option value="crt">CRT</option>
              <option value="gb-classic">GB Classic</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Storage</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Clear Save States</span>
              <span className="setting-description">Remove all saved game states</span>
            </div>
            <button
              className="danger-btn"
              onClick={() => {
                localStorage.clear()
                alert('All save states cleared!')
              }}
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default Settings
