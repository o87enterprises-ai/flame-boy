package com.retroboy.emulator

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.OpenableColumns
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.retroboy.emulator.databinding.ActivityMainBinding
import java.io.File
import java.io.FileOutputStream

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private var lastPlayedGame: String? = null
    
    private val romLauncher = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let { handleRomFile(it) }
    }
    
    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            romLauncher.launch("*/*")
        } else {
            Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show()
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        loadLastPlayedGame()
    }
    
    private fun setupUI() {
        binding.libraryButton.setOnClickListener {
            startActivity(Intent(this, GameLibraryActivity::class.java))
        }
        
        binding.loadRomButton.setOnClickListener {
            checkPermissionsAndLoadRom()
        }
        
        binding.settingsButton.setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
        
        binding.continueButton.setOnClickListener {
            lastPlayedGame?.let { gamePath ->
                launchEmulator(gamePath, "Last Played")
            }
        }
    }
    
    private fun loadLastPlayedGame() {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        lastPlayedGame = prefs.getString("last_played_path", null)
        val lastPlayedTitle = prefs.getString("last_played_title", null)
        
        if (lastPlayedGame != null) {
            binding.lastPlayedGameText.text = lastPlayedTitle ?: "Unknown Game"
            binding.continueButton.visibility = View.VISIBLE
        } else {
            binding.lastPlayedGameText.text = "No game played"
            binding.continueButton.visibility = View.GONE
        }
    }
    
    private fun checkPermissionsAndLoadRom() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // Android 13+ doesn't need storage permission for scoped storage
            romLauncher.launch("*/*")
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Android 10-12
            romLauncher.launch("*/*")
        } else {
            // Android 9 and below
            when {
                ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.READ_EXTERNAL_STORAGE
                ) == PackageManager.PERMISSION_GRANTED -> {
                    romLauncher.launch("*/*")
                }
                else -> {
                    permissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE)
                }
            }
        }
    }
    
    private fun handleRomFile(uri: Uri) {
        try {
            // Copy ROM to app's internal storage
            val romFile = copyRomToInternalStorage(uri)
            val romName = getRomName(uri)
            
            // Save as last played
            saveLastPlayedGame(romFile.absolutePath, romName)
            
            // Launch emulator
            launchEmulator(romFile.absolutePath, romName)
            
            Toast.makeText(this, "ROM loaded: $romName", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "Error loading ROM: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }
    
    private fun copyRomToInternalStorage(uri: Uri): File {
        val romName = getRomName(uri)
        val romDir = File(filesDir, "ROMs")
        if (!romDir.exists()) {
            romDir.mkdirs()
        }
        
        val romFile = File(romDir, romName)
        
        contentResolver.openInputStream(uri)?.use { input ->
            FileOutputStream(romFile).use { output ->
                input.copyTo(output)
            }
        }
        
        return romFile
    }
    
    private fun getRomName(uri: Uri): String {
        var name = "game.gb"
        contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            if (cursor.moveToFirst() && nameIndex >= 0) {
                name = cursor.getString(nameIndex)
            }
        }
        return name
    }
    
    private fun saveLastPlayedGame(path: String, title: String) {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        prefs.edit().apply {
            putString("last_played_path", path)
            putString("last_played_title", title)
            apply()
        }
    }
    
    private fun launchEmulator(romPath: String, gameTitle: String) {
        val intent = Intent(this, EmulatorActivity::class.java).apply {
            putExtra("rom_path", romPath)
            putExtra("game_title", gameTitle)
        }
        startActivity(intent)
    }
}
