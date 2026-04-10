package com.retroboy.emulator

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.retroboy.emulator.databinding.ActivityEmulatorBinding
import java.io.File

class EmulatorActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityEmulatorBinding
    private lateinit var vibrator: Vibrator
    private var romPath: String = ""
    private var gameTitle: String = ""
    
    private val handler = Handler(Looper.getMainLooper())
    private var autoSaveRunnable: Runnable? = null
    
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEmulatorBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        
        romPath = intent.getStringExtra("rom_path") ?: ""
        gameTitle = intent.getStringExtra("game_title") ?: "Unknown"
        
        binding.gameTitleText.text = gameTitle
        
        setupWebView()
        setupControls()
        setupButtons()
        loadEmulator()
        
        // Auto-save setup
        setupAutoSave()
    }
    
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        with(binding.emulatorWebView) {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                mediaPlaybackRequiresUserGesture = false
                cacheMode = WebSettings.LOAD_DEFAULT
            }
            
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    binding.loadingOverlay.visibility = View.GONE
                    injectControls()
                }
            }
            
            webChromeClient = WebChromeClient()
        }
    }
    
    private fun setupControls() {
        // D-Pad controls
        setupDpadButton(binding.btnUp, "up")
        setupDpadButton(binding.btnDown, "down")
        setupDpadButton(binding.btnLeft, "left")
        setupDpadButton(binding.btnRight, "right")
        
        // Action buttons
        setupActionButton(binding.btnA, "a")
        setupActionButton(binding.btnB, "b")
        
        // Start/Select
        setupActionButton(binding.btnStart, "start")
        setupActionButton(binding.btnSelect, "select")
    }
    
    private fun setupDpadButton(button: View, direction: String) {
        button.setOnTouchListener { v, event ->
            when (event.action) {
                android.view.MotionEvent.ACTION_DOWN -> {
                    v.performClick()
                    sendInput(direction, true)
                    true
                }
                android.view.MotionEvent.ACTION_UP -> {
                    sendInput(direction, false)
                    true
                }
                else -> false
            }
        }
    }
    
    private fun setupActionButton(button: View, action: String) {
        button.setOnTouchListener { v, event ->
            when (event.action) {
                android.view.MotionEvent.ACTION_DOWN -> {
                    v.performClick()
                    sendInput(action, true)
                    vibrate()
                    true
                }
                android.view.MotionEvent.ACTION_UP -> {
                    sendInput(action, false)
                    true
                }
                else -> false
            }
        }
    }
    
    private fun setupButtons() {
        binding.backButton.setOnClickListener {
            finish()
        }
        
        binding.saveStateButton.setOnClickListener {
            saveState()
        }
        
        binding.menuButton.setOnClickListener {
            showEmulatorMenu()
        }
    }
    
    private fun vibrate() {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        val vibrationEnabled = prefs.getBoolean("vibration_enabled", true)
        
        if (vibrationEnabled) {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(30, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(30)
            }
        }
    }
    
    private fun sendInput(input: String, pressed: Boolean) {
        val js = "window.emulatorInput('$input', $pressed)"
        binding.emulatorWebView.evaluateJavascript(js, null)
    }
    
    private fun loadEmulator() {
        binding.loadingOverlay.visibility = View.VISIBLE
        
        // Load the emulator HTML
        val emulatorHtml = loadEmulatorHtml()
        binding.emulatorWebView.loadDataWithBaseURL(
            "file:///android_asset/",
            emulatorHtml,
            "text/html",
            "UTF-8",
            null
        )
    }
    
    private fun loadEmulatorHtml(): String {
        // Check if we have a local emulator file
        val emulatorFile = File(filesDir, "emulator/index.html")
        return if (emulatorFile.exists()) {
            emulatorFile.readText()
        } else {
            // Load from assets or use embedded version
            loadEmbeddedEmulator()
        }
    }
    
    private fun loadEmbeddedEmulator(): String {
        // This is a simplified emulator interface
        // In production, you would include the full WasmBoy emulator
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background: #0f380f;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: monospace;
                    }
                    #screen {
                        width: 160px;
                        height: 144px;
                        background: #9bbc0f;
                        image-rendering: pixelated;
                        image-rendering: crisp-edges;
                    }
                    #loading {
                        color: #0f380f;
                        font-size: 14px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div id="loading">
                    <p>Game Boy Emulator</p>
                    <p>Loading: ${gameTitle}</p>
                    <p style="font-size: 10px; margin-top: 20px;">
                        Note: Full emulation requires WasmBoy core.<br>
                        This is a UI demo.
                    </p>
                </div>
                <canvas id="screen" width="160" height="144" style="display:none;"></canvas>
                <script>
                    window.emulatorInput = function(input, pressed) {
                        console.log('Input:', input, pressed);
                        if (window.androidInterface) {
                            window.androidInterface.handleInput(input, pressed);
                        }
                    };
                    
                    // Simulate boot sequence
                    setTimeout(function() {
                        document.getElementById('loading').innerHTML = 
                            '<p style="color: #0f380f;">■ Nintendo®</p>' +
                            '<p style="font-size: 10px;">${gameTitle}</p>' +
                            '<p style="font-size: 8px; margin-top: 30px;">PRESS START</p>';
                    }, 2000);
                </script>
            </body>
            </html>
        """.trimIndent()
    }
    
    private fun injectControls() {
        // Inject JavaScript for control handling
        binding.emulatorWebView.evaluateJavascript(
            """
            (function() {
                window.gameLoaded = true;
                window.currentGame = '${gameTitle}';
            })()
            """,
            null
        )
    }
    
    private fun saveState() {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        val stateDir = File(filesDir, "Saves")
        if (!stateDir.exists()) {
            stateDir.mkdirs()
        }
        
        val stateFile = File(stateDir, "${gameTitle.replace(" ", "_")}.state")
        
        // In a real emulator, this would serialize the emulation state
        prefs.edit().apply {
            putString("save_state_${gameTitle}", stateFile.absolutePath)
            putLong("save_time_${gameTitle}", System.currentTimeMillis())
            apply()
        }
        
        showToast("Game saved!")
    }
    
    private fun loadState() {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        val statePath = prefs.getString("save_state_${gameTitle}", null)
        
        if (statePath != null && File(statePath).exists()) {
            showToast("Loaded saved state")
        } else {
            showToast("No save state found")
        }
    }
    
    private fun showEmulatorMenu() {
        // Show a simple menu dialog
        val menuItems = arrayOf("Load State", "Save State", "Reset", "Settings", "Exit")
        android.app.AlertDialog.Builder(this)
            .setTitle("Menu")
            .setItems(menuItems) { _, which ->
                when (which) {
                    0 -> loadState()
                    1 -> saveState()
                    2 -> resetGame()
                    3 -> startActivity(android.content.Intent(this, SettingsActivity::class.java))
                    4 -> finish()
                }
            }
            .show()
    }
    
    private fun resetGame() {
        loadEmulator()
        showToast("Game reset")
    }
    
    private fun showToast(message: String) {
        binding.toastText.text = message
        binding.toastText.visibility = View.VISIBLE
        handler.postDelayed({
            binding.toastText.visibility = View.GONE
        }, 2000)
    }
    
    private fun setupAutoSave() {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        val autoSaveEnabled = prefs.getBoolean("autosave_enabled", true)
        
        if (autoSaveEnabled) {
            autoSaveRunnable = object : Runnable {
                override fun run() {
                    saveState()
                    handler.postDelayed(this, 600000) // Every 10 minutes
                }
            }
            handler.post(autoSaveRunnable!!)
        }
    }
    
    override fun onBackPressed() {
        android.app.AlertDialog.Builder(this)
            .setTitle("Exit Game")
            .setMessage("Do you want to save before exiting?")
            .setPositiveButton("Save & Exit") { _, _ ->
                saveState()
                finish()
            }
            .setNegativeButton("Exit") { _, _ ->
                finish()
            }
            .setNeutralButton("Cancel", null)
            .show()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        autoSaveRunnable?.let { handler.removeCallbacks(it) }
        binding.emulatorWebView.destroy()
    }
}
