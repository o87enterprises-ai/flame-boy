package com.retroboy.emulator

import android.os.Bundle
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import com.retroboy.emulator.databinding.ActivitySettingsBinding

class SettingsActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivitySettingsBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        loadSettings()
    }
    
    private fun setupUI() {
        binding.backButton.setOnClickListener {
            finish()
        }
        
        // Setup filter spinner
        val adapter = ArrayAdapter.createFromResource(
            this,
            R.array.filter_options,
            android.R.layout.simple_spinner_item
        )
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.filterSpinner.adapter = adapter
        
        binding.filterSpinner.onItemSelectedListener = object : android.widget.AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: android.widget.AdapterView<*>?, view: android.view.View?, position: Int, id: Long) {
                saveFilterSetting(position)
            }
            override fun onNothingSelected(parent: android.widget.AdapterView<*>?) {}
        }
        
        // Setup switches
        binding.soundSwitch.setOnCheckedChangeListener { _, isChecked ->
            saveSoundSetting(isChecked)
        }
        
        binding.vibrationSwitch.setOnCheckedChangeListener { _, isChecked ->
            saveVibrationSetting(isChecked)
        }
        
        binding.autosaveSwitch.setOnCheckedChangeListener { _, isChecked ->
            saveAutosaveSetting(isChecked)
        }
        
        binding.fpsSwitch.setOnCheckedChangeListener { _, isChecked ->
            saveFpsSetting(isChecked)
        }
    }
    
    private fun loadSettings() {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        
        binding.soundSwitch.isChecked = prefs.getBoolean("sound_enabled", true)
        binding.vibrationSwitch.isChecked = prefs.getBoolean("vibration_enabled", true)
        binding.autosaveSwitch.isChecked = prefs.getBoolean("autosave_enabled", true)
        binding.fpsSwitch.isChecked = prefs.getBoolean("fps_enabled", false)
        
        val filterIndex = prefs.getInt("filter_index", 0)
        binding.filterSpinner.setSelection(filterIndex)
    }
    
    private fun saveSoundSetting(enabled: Boolean) {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        prefs.edit().putBoolean("sound_enabled", enabled).apply()
    }
    
    private fun saveVibrationSetting(enabled: Boolean) {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        prefs.edit().putBoolean("vibration_enabled", enabled).apply()
    }
    
    private fun saveAutosaveSetting(enabled: Boolean) {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        prefs.edit().putBoolean("autosave_enabled", enabled).apply()
    }
    
    private fun saveFpsSetting(enabled: Boolean) {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        prefs.edit().putBoolean("fps_enabled", enabled).apply()
    }
    
    private fun saveFilterSetting(index: Int) {
        val prefs = getSharedPreferences("retroboy_prefs", MODE_PRIVATE)
        prefs.edit().putInt("filter_index", index).apply()
    }
}
