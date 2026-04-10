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
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.retroboy.emulator.databinding.ActivityGameLibraryBinding
import java.io.File
import java.io.FileOutputStream

class GameLibraryActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityGameLibraryBinding
    private var currentTab = 0 // 0 = Classics, 1 = Homebrew
    private var gamesAdapter: GamesAdapter? = null
    
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
        binding = ActivityGameLibraryBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        setupRecyclerView()
        setupTabs()
    }
    
    private fun setupUI() {
        binding.backButton.setOnClickListener {
            finish()
        }
        
        binding.loadRomButton.setOnClickListener {
            checkPermissionsAndLoadRom()
        }
    }
    
    private fun setupTabs() {
        binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                currentTab = tab?.position ?: 0
                updateGamesList()
            }
            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })
    }
    
    private fun setupRecyclerView() {
        gamesAdapter = GamesAdapter { game ->
            launchGame(game)
        }
        
        binding.gamesRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@GameLibraryActivity)
            adapter = gamesAdapter
        }
        
        updateGamesList()
    }
    
    private fun updateGamesList() {
        val games = when (currentTab) {
            0 -> GameLibrary.classicGames
            1 -> GameLibrary.homebrewGames
            else -> GameLibrary.getAllGames()
        }
        gamesAdapter?.submitList(games)
    }
    
    private fun launchGame(game: Game) {
        if (game.isHomebrew) {
            if (game.romUrl.isNotEmpty()) {
                // Download and launch homebrew ROM
                downloadAndLaunchHomebrew(game)
            } else {
                Toast.makeText(
                    this,
                    "${game.title}: ROM not available. Use 'Load ROM File' to add your own.",
                    Toast.LENGTH_LONG
                ).show()
            }
        } else {
            // Classic games - show info dialog
            showClassicGameInfo(game)
        }
    }
    
    private fun showClassicGameInfo(game: Game) {
        val salesInfo = if (game.sales != null) "\nSales: ${game.sales}" else ""
        
        android.app.AlertDialog.Builder(this)
            .setTitle("${game.title} (${game.year})")
            .setMessage("${game.description}$salesInfo\n\n${getRomLoadInstructions()}")
            .setPositiveButton("Load ROM") { _, _ ->
                checkPermissionsAndLoadRom()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun getRomLoadInstructions(): String {
        return "\n\nTo play this game, please load your legally obtained ROM file using the 'Load ROM File' button."
    }
    
    private fun downloadAndLaunchHomebrew(game: Game) {
        // For homebrew games with URLs, we'd download them
        // This is a simplified version - in production you'd use a proper download manager
        Toast.makeText(this, "Downloading ${game.title}...", Toast.LENGTH_SHORT).show()
        
        // Simulate download and launch
        // In production, implement actual download logic
        android.app.AlertDialog.Builder(this)
            .setTitle("Download ROM")
            .setMessage("Would you like to download ${game.title} from:\n${game.romUrl}\n\nMake sure you have permission to download this ROM.")
            .setPositiveButton("Open Browser") { _, _ ->
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(game.romUrl))
                startActivity(intent)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun checkPermissionsAndLoadRom() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            romLauncher.launch("*/*")
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            romLauncher.launch("*/*")
        } else {
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
            val romFile = copyRomToInternalStorage(uri)
            val romName = getRomName(uri)
            
            saveLastPlayedGame(romFile.absolutePath, romName)
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
        finish()
    }
}
