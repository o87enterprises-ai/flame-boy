package com.retroboy.emulator

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.retroboy.emulator.databinding.ItemGameBinding

class GamesAdapter(
    private val onItemClick: (Game) -> Unit
) : ListAdapter<Game, GamesAdapter.GameViewHolder>(GameDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GameViewHolder {
        val binding = ItemGameBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return GameViewHolder(binding)
    }

    override fun onBindViewHolder(holder: GameViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class GameViewHolder(
        private val binding: ItemGameBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            binding.root.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onItemClick(getItem(position))
                }
            }
        }

        fun bind(game: Game) {
            binding.gameTitleText.text = game.title
            binding.gameYearText.text = game.year.toString()
            binding.gameDescriptionText.text = game.description
            
            // Set cover image (would use Glide/Picasso in production)
            binding.gameCoverImage.setImageResource(getCoverImageResId(game.coverImage))
            
            // Add homebrew badge
            if (game.isHomebrew) {
                binding.gameYearText.text = "${game.year} (Homebrew)"
            }
        }

        private fun getCoverImageResId(coverImage: String): Int {
            return when (coverImage) {
                "pokemon" -> R.drawable.ic_game
                "tetris" -> R.drawable.ic_game
                "zelda" -> R.drawable.ic_game
                "metroid" -> R.drawable.ic_game
                "mario" -> R.drawable.ic_game
                "kirby" -> R.drawable.ic_game
                "wario" -> R.drawable.ic_game
                "final_fantasy" -> R.drawable.ic_game
                "donkey_kong" -> R.drawable.ic_game
                "dr_mario" -> R.drawable.ic_game
                "tobu" -> R.drawable.ic_game
                "petris" -> R.drawable.ic_game
                "wordle" -> R.drawable.ic_game
                "flappy" -> R.drawable.ic_game
                "snake" -> R.drawable.ic_game
                else -> R.drawable.ic_game
            }
        }
    }

    class GameDiffCallback : DiffUtil.ItemCallback<Game>() {
        override fun areItemsTheSame(oldItem: Game, newItem: Game): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Game, newItem: Game): Boolean {
            return oldItem == newItem
        }
    }
}
