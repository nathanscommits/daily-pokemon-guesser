# Pokémon Guesser Game

A Wordle-style guessing game where you try to guess a random Pokémon! Each guess shows which attributes match the target Pokémon.

## Features

- 🎮 **Daily Wordle-style gameplay** - One shared, random Pokémon each day
- 🎨 **Visual feedback** - Color-coded hints for each attribute:
  - 🟢 Green = Exact match
  - 🟡 Yellow = Partial match (for types)
  - ⚫ Gray = No match
- 🔍 **Autocomplete search** - Type-ahead Pokemon selection to prevent typos
- 📱 **Responsive design** - Works on mobile and desktop
- 🖼️ **Pokemon Sprites** - Official sprites displayed throughout the game
- 📊 **All Pokemon** - Complete roster of all 1010 Pokemon from all 9 generations
- 📖 **Pokedex Descriptions** - Official Pokedex entries revealed when you guess correctly or lose
- 💡 **Hint System** - Show Pokedex description as a hint anytime during the game

## Attributes Compared

Each guess compares these attributes with the target Pokémon:
- **Type(s)** - Primary and secondary types
- **Generation** - Which generation (1-9) the Pokémon is from
- **Evolution Stage** - Basic, Stage 1, Stage 2, or Single (non-evolving)
- **Color** - The Pokémon's primary color

## How to Play

1. Type a Pokémon name in the search box
2. Select it from the dropdown
3. See which attributes match the target Pokémon
4. Use the clues to make your next guess
5. Click "📖 Show Hint" anytime to see the Pokedex description for extra help
6. Keep guessing—there’s no limit—until you identify the Pokémon!
7. Read the Pokedex description when the game ends to learn more about the Pokemon!

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and visit the local URL shown in the terminal

## Build for Production

```bash
npm run build
```

## Technologies Used

- React 18
- Vite
- CSS3 (with animations)
- Pokemon data (All 9 Generations - 1010 Pokemon)

## Future Enhancements

- Track statistics and winning streaks
- Add hints system
- Compare abilities or signature moves
- Add Pokemon cry sounds
- Implement shiny Pokemon variants
- Add regional forms (Alolan, Galarian, Hisuian, etc.)
- Include Mega Evolutions and Gigantamax forms

Enjoy playing! 🎮✨

