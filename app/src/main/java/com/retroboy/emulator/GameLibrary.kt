package com.retroboy.emulator

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Data class representing a Game Boy game
 */
@Parcelize
data class Game(
    val id: String,
    val title: String,
    val year: Int,
    val description: String,
    val sales: String? = null,
    val coverImage: String = "",
    val romUrl: String = "",
    val isHomebrew: Boolean = false,
    val romData: ByteArray? = null // For embedded ROMs
) : Parcelable

/**
 * Object containing the classic games library
 */
object GameLibrary {
    
    val classicGames = listOf(
        Game(
            id = "pokemon_red",
            title = "Pokémon Red/Blue",
            year = 1996,
            description = "The first games in the Pokémon series, where players catch and train Pokémon to become a Pokémon Master.",
            sales = "46 million copies",
            coverImage = "pokemon",
            isHomebrew = false
        ),
        Game(
            id = "tetris",
            title = "Tetris",
            year = 1989,
            description = "A classic puzzle game that involves stacking falling blocks to create complete lines.",
            sales = "35+ million copies",
            coverImage = "tetris",
            isHomebrew = false
        ),
        Game(
            id = "zelda_links_awakening",
            title = "The Legend of Zelda: Link's Awakening",
            year = 1993,
            description = "An action-adventure game where Link explores the mysterious Koholint Island to awaken the Wind Fish.",
            coverImage = "zelda",
            isHomebrew = false
        ),
        Game(
            id = "metroid_2",
            title = "Metroid II: Return of Samus",
            year = 1991,
            description = "A platform game that follows Samus Aran as she hunts down the Metroids on their home planet.",
            coverImage = "metroid",
            isHomebrew = false
        ),
        Game(
            id = "super_mario_land",
            title = "Super Mario Land",
            year = 1989,
            description = "A platformer featuring Mario on a quest to rescue Princess Daisy from the evil Tatanga.",
            coverImage = "mario",
            isHomebrew = false
        ),
        Game(
            id = "kirbys_dream_land",
            title = "Kirby's Dream Land",
            year = 1992,
            description = "A platformer where players control Kirby, who can inhale enemies and gain their abilities.",
            coverImage = "kirby",
            isHomebrew = false
        ),
        Game(
            id = "wario_land",
            title = "Wario Land: Super Mario Land 3",
            year = 1994,
            description = "A platform game featuring Wario, who uses his unique abilities to collect treasure and defeat enemies.",
            coverImage = "wario",
            isHomebrew = false
        ),
        Game(
            id = "final_fantasy_adventure",
            title = "Final Fantasy Adventure",
            year = 1991,
            description = "An action RPG that combines elements of adventure and puzzle-solving in a fantasy setting.",
            coverImage = "final_fantasy",
            isHomebrew = false
        ),
        Game(
            id = "donkey_kong",
            title = "Donkey Kong",
            year = 1994,
            description = "A puzzle-platformer that expands on the original arcade game with new levels and mechanics.",
            coverImage = "donkey_kong",
            isHomebrew = false
        ),
        Game(
            id = "dr_mario",
            title = "Dr. Mario",
            year = 1990,
            description = "A puzzle game where players match colored capsules to eliminate viruses.",
            coverImage = "dr_mario",
            isHomebrew = false
        )
    )
    
    val homebrewGames = listOf(
        Game(
            id = "tobu_tobu_girl",
            title = "Tobu Tobu Girl",
            year = 2012,
            description = "A fast-paced action game where you navigate through challenging levels.",
            coverImage = "tobu",
            romUrl = "https://github.com/TangramGames/TobuTobuGirl/raw/master/roms/TobuTobuGirl.gb",
            isHomebrew = true
        ),
        Game(
            id = "petris",
            title = "Petris",
            year = 2020,
            description = "A Tetris-like puzzle game with pets. Open source homebrew.",
            coverImage = "petris",
            romUrl = "https://github.com/bbbbbr/petris/raw/master/build/petris.gb",
            isHomebrew = true
        ),
        Game(
            id = "gb_wordle",
            title = "GB Wordle",
            year = 2022,
            description = "The popular word guessing game adapted for Game Boy.",
            coverImage = "wordle",
            romUrl = "https://github.com/chrismaltby/gb-wordle/releases/download/latest/gb-wordle.gb",
            isHomebrew = true
        ),
        Game(
            id = "flappy_boy",
            title = "Flappy Boy",
            year = 2021,
            description = "A Flappy Bird clone for Game Boy with retro graphics.",
            coverImage = "flappy",
            romUrl = "",
            isHomebrew = true
        ),
        Game(
            id = "gb_snake",
            title = "GB Snake",
            year = 2020,
            description = "Classic Snake game reimagined for Game Boy.",
            coverImage = "snake",
            romUrl = "",
            isHomebrew = true
        )
    )
    
    fun getAllGames(): List<Game> = classicGames + homebrewGames
    
    fun getGameById(id: String): Game? = getAllGames().find { it.id == id }
}
