import { useState, useEffect } from 'react'
import pokemonData from './data/pokemon.json'
import Header from './components/Header'
import GuessInput from './components/GuessInput'
import GuessList from './components/GuessList'
import GameOver from './components/GameOver'
import './App.css'

function App() {
  const [targetPokemon, setTargetPokemon] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'won', 'lost'
  const [showRules, setShowRules] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Initialize game with random Pokemon
  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const randomPokemon = pokemonData[Math.floor(Math.random() * pokemonData.length)]
    setTargetPokemon(randomPokemon)
    setGuesses([])
    setGameStatus('playing')
    setShowHint(false)
  }

  const handleGuess = (pokemon) => {
    // Check if already guessed
    if (guesses.some(g => g.pokemon.id === pokemon.id)) {
      return
    }

    const comparison = comparePokemon(pokemon, targetPokemon)
    const newGuess = { pokemon, comparison }
    const newGuesses = [...guesses, newGuess]
    
    setGuesses(newGuesses)

    // Check if won
    if (pokemon.id === targetPokemon.id) {
      setGameStatus('won')
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost')
    }
  }

  const comparePokemon = (guess, target) => {
    const comparison = {
      types: compareTypes(guess.types, target.types),
      generation: guess.generation === target.generation ? 'match' : 'no-match',
      evolutionStage: guess.evolutionStage === target.evolutionStage ? 'match' : 'no-match',
      color: guess.color === target.color ? 'match' : 'no-match'
    }
    return comparison
  }

  const compareTypes = (guessTypes, targetTypes) => {
    const matchCount = guessTypes.filter(type => targetTypes.includes(type)).length
    
    if (matchCount === guessTypes.length && guessTypes.length === targetTypes.length) {
      return 'match' // All types match
    } else if (matchCount > 0) {
      return 'partial' // Some types match
    } else {
      return 'no-match' // No types match
    }
  }

  const removePokemonNameFromDescription = (description, pokemonName) => {
    if (!description || !pokemonName) return description;
    
    // Create a regex that matches the Pokemon name regardless of case
    const nameRegex = new RegExp(`\\b${pokemonName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    // Replace the Pokemon name with "[This Pokemon]" or similar
    return description.replace(nameRegex, '[This Pokemon]');
  }

  return (
    <div className="app">
      <Header 
        onShowRules={() => setShowRules(!showRules)}
        onShowHint={() => setShowHint(!showHint)}
        showHint={showHint}
        canShowHint={true}
      />
      
      {showRules && (
        <div className="rules">
          <h3>How to Play</h3>
          <p>Guess the Pokemon in 6 tries!</p>
          <ul>
            <li><span className="match">Green</span> = Correct attribute</li>
            <li><span className="partial">Yellow</span> = Partial match (types only)</li>
            <li><span className="no-match">Gray</span> = No match</li>
          </ul>
          <p>Each guess shows which attributes match the target Pokemon.</p>
        </div>
      )}

      <div className="game-container">
        {gameStatus === 'playing' && targetPokemon && (
          <GuessInput 
            onGuess={handleGuess}
            pokemonList={pokemonData}
            guessedIds={guesses.map(g => g.pokemon.id)}
          />
        )}

        <GuessList guesses={guesses} />

        {showHint && targetPokemon && gameStatus === 'playing' && (
          <div className="hint-section">
            <h3>📖 Pokedex Hint</h3>
            <p className="hint-description">"{removePokemonNameFromDescription(targetPokemon.description, targetPokemon.name)}"</p>
            <button className="hide-hint-button" onClick={() => setShowHint(false)}>
              Hide Hint
            </button>
          </div>
        )}

        {gameStatus !== 'playing' && targetPokemon && (
          <GameOver
            status={gameStatus}
            targetPokemon={targetPokemon}
            guessCount={guesses.length}
            onNewGame={startNewGame}
          />
        )}
      </div>
    </div>
  )
}

export default App

