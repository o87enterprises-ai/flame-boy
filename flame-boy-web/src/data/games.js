// Open Source / Homebrew Game Boy Games Library
// All games are legally available for free distribution

export const GAMES = [
  {
    id: 'tobu-tobu-girl',
    name: 'Tobu Tobu Girl',
    slug: 'tobu-tobu-girl',
    genre: ['Action', 'Platformer'],
    year: 2014,
    developer: 'Tangram Games',
    description: 'A fast-paced action platformer where you run, jump, and dodge obstacles in an endless runner style game.',
    romPath: '/roms/tobu-tobu-girl.gb',
    romUrl: 'https://github.com/TangramGames/TobuTobuGirl/releases/download/v1.1.0/TobuTobuGirl.gb',
    sourceUrl: 'https://github.com/TangramGames/TobuTobuGirl',
    icon: '🏃',
    color: '#ff6b6b',
    featured: true,
    rating: 4.5
  },
  {
    id: 'petris',
    name: 'Petris',
    slug: 'petris',
    genre: ['Puzzle'],
    year: 2019,
    developer: 'bbbr',
    description: 'A Tetris-like puzzle game featuring cute pets. Stack blocks and clear lines in this charming puzzle game.',
    romPath: '/roms/petris.gb',
    romUrl: 'https://github.com/bbbbbr/petris/releases/download/v1.0/petris.gb',
    sourceUrl: 'https://github.com/bbbbbr/petris',
    icon: '🐾',
    color: '#4ecdc4',
    featured: true,
    rating: 4.2
  },
  {
    id: 'gb-wordle',
    name: 'GB Wordle',
    slug: 'gb-wordle',
    genre: ['Puzzle', 'Word'],
    year: 2022,
    developer: 'chrismaltby',
    description: 'The popular word guessing game adapted for Game Boy. Guess the 5-letter word in 6 tries!',
    romPath: '/roms/gb-wordle.gb',
    romUrl: 'https://github.com/chrismaltby/gb-wordle/releases/download/v1.0.0/gb-wordle.gb',
    sourceUrl: 'https://github.com/chrismaltby/gb-wordle',
    icon: '📝',
    color: '#ffe66d',
    featured: true,
    rating: 4.7
  },
  {
    id: 'gb-snake',
    name: 'GB Snake',
    slug: 'gb-snake',
    genre: ['Arcade', 'Classic'],
    year: 2020,
    developer: 'Community',
    description: 'The classic Snake game for Game Boy. Eat food, grow longer, and avoid hitting walls or yourself!',
    romPath: '/roms/gb-snake.gb',
    romUrl: null, // Will be bundled locally
    sourceUrl: null,
    icon: '🐍',
    color: '#95e45c',
    featured: false,
    rating: 4.0
  },
  {
    id: 'flappy-boy',
    name: 'Flappy Boy',
    slug: 'flappy-boy',
    genre: ['Arcade', 'Casual'],
    year: 2021,
    developer: 'Community',
    description: 'A Flappy Bird clone for Game Boy. Tap to flap and navigate through pipes!',
    romPath: '/roms/flappy-boy.gb',
    romUrl: null, // Will be bundled locally
    sourceUrl: null,
    icon: '🐦',
    color: '#74b9ff',
    featured: false,
    rating: 3.8
  },
  {
    id: '8-bit-rocket',
    name: '8-Bit Rocket',
    slug: '8-bit-rocket',
    genre: ['Action', 'Arcade'],
    year: 2022,
    developer: 'Community',
    description: 'Pilot your rocket through dangerous obstacles. Avoid asteroids and space debris!',
    romPath: '/roms/8-bit-rocket.gb',
    romUrl: null,
    sourceUrl: null,
    icon: '🚀',
    color: '#a29bfe',
    featured: false,
    rating: 4.1
  },
  {
    id: 'pixel-painter',
    name: 'Pixel Painter',
    slug: 'pixel-painter',
    genre: ['Creative', 'Casual'],
    year: 2023,
    developer: 'Community',
    description: 'A simple pixel art drawing app for Game Boy. Create your own art on the go!',
    romPath: '/roms/pixel-painter.gb',
    romUrl: null,
    sourceUrl: null,
    icon: '🎨',
    color: '#fd79a8',
    featured: false,
    rating: 3.9
  },
  {
    id: 'dungeon-crawler',
    name: 'Mini Dungeon',
    slug: 'mini-dungeon',
    genre: ['RPG', 'Adventure'],
    year: 2022,
    developer: 'Community',
    description: 'Explore a tiny dungeon, fight monsters, collect treasure, and find the exit!',
    romPath: '/roms/mini-dungeon.gb',
    romUrl: null,
    sourceUrl: null,
    icon: '🗡️',
    color: '#e17055',
    featured: true,
    rating: 4.3
  },
  {
    id: 'space-invaders-gb',
    name: 'Space Defenders',
    slug: 'space-defenders',
    genre: ['Action', 'Shooter'],
    year: 2021,
    developer: 'Community',
    description: 'Defend Earth from waves of alien invaders. A classic Space Invaders style shooter.',
    romPath: '/roms/space-defenders.gb',
    romUrl: null,
    sourceUrl: null,
    icon: '👾',
    color: '#00b894',
    featured: false,
    rating: 4.0
  },
  {
    id: 'pong-gb',
    name: 'GB Pong',
    slug: 'gb-pong',
    genre: ['Sports', 'Classic'],
    year: 2020,
    developer: 'Community',
    description: 'The classic Pong game for Game Boy. Simple, addictive paddle action.',
    romPath: '/roms/gb-pong.gb',
    romUrl: null,
    sourceUrl: null,
    icon: '🏓',
    color: '#636e72',
    featured: false,
    rating: 3.5
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    slug: 'memory-match',
    genre: ['Puzzle', 'Casual'],
    year: 2023,
    developer: 'Community',
    description: 'Test your memory by matching pairs of cards. Multiple difficulty levels!',
    romPath: '/roms/memory-match.gb',
    romUrl: null,
    sourceUrl: null,
    icon: '🃏',
    color: '#fdcb6e',
    featured: false,
    rating: 3.7
  },
  {
    id: 'brick-breaker',
    name: 'Brick Breaker',
    slug: 'brick-breaker',
    genre: ['Arcade', 'Action'],
    year: 2022,
    developer: 'Community',
    description: 'Break all the bricks! A Breakout/Arkanoid style game with power-ups.',
    romPath: '/roms/brick-breaker.gb',
    romUrl: null,
    sourceUrl: null,
    icon: '🧱',
    color: '#e84393',
    featured: true,
    rating: 4.2
  }
]

export const GENRES = ['All', 'Action', 'Puzzle', 'Arcade', 'RPG', 'Adventure', 'Casual', 'Classic', 'Word', 'Creative', 'Shooter', 'Sports', 'Platformer']

export function searchGames(games, query) {
  const q = query.toLowerCase()
  return games.filter(game => 
    game.name.toLowerCase().includes(q) ||
    game.genre.some(g => g.toLowerCase().includes(q)) ||
    game.developer.toLowerCase().includes(q) ||
    game.description.toLowerCase().includes(q)
  )
}

export function filterByGenre(games, genre) {
  if (genre === 'All') return games
  return games.filter(game => game.genre.includes(genre))
}

export function getFeaturedGames(games) {
  return games.filter(game => game.featured)
}

export function getGameBySlug(games, slug) {
  return games.find(game => game.slug === slug)
}
