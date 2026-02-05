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
  const [gameStatus, setGameStatus] = useState('playing')
  const [showRules, setShowRules] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Pick a random Pokemon on each page load (fresh game on refresh)
  useEffect(() => {
    const pokemonIndex = Math.floor(Math.random() * pokemonData.length)
    setTargetPokemon(pokemonData[pokemonIndex])
    setGuesses([])
    setGameStatus('playing')
    setShowHint(false)
  }, [])

  const handleGuess = (pokemon) => {
    if (guesses.some(g => g.pokemon.id === pokemon.id)) {
      return
    }

    const comparison = comparePokemon(pokemon, targetPokemon)
    const newGuess = { pokemon, comparison }
    const newGuesses = [...guesses, newGuess]

    setGuesses(newGuesses)

    if (pokemon.id === targetPokemon.id) {
      setGameStatus('won')
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

  const removePokemonNamesFromDescription = (description, targetPokemonName) => {
    if (!description) return description;

    let result = description;

    // Get all Pokemon names and sort by length (longest first) to avoid partial replacements
    const allPokemonNames = pokemonData
      .map(p => p.name)
      .sort((a, b) => b.length - a.length);

    // Replace each Pokemon name with appropriate placeholder
    allPokemonNames.forEach(name => {
      const nameRegex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      
      // Use different placeholder for target vs other Pokemon
      if (name.toLowerCase() === targetPokemonName?.toLowerCase()) {
        result = result.replace(nameRegex, '[This Pokemon]');
      } else {
        result = result.replace(nameRegex, '[Pokemon]');
      }
    });

    return result;
  }

  return (
    <div className="app">
      <Header
        onShowRules={() => setShowRules(!showRules)}
        onShowHint={() => setShowHint(!showHint)}
        showHint={showHint}
        canShowHint={true}
        gameStatus={gameStatus}
      />

      {showRules && (
        <div className="rules">
          <h3>How to Play</h3>
          <p>Guess the Pokemon! Take as many tries as you need!</p>
          <ul>
            <li><span className="match">Green</span> = Correct attribute</li>
            <li><span className="partial">Yellow</span> = Partial match (types only)</li>
            <li><span className="no-match">Gray</span> = No match</li>
          </ul>
          <p>Each guess shows which attributes match the target Pokemon.</p>
          <div className="daily-rules">
            <h4>🔄 New game on refresh</h4>
            <p>• A new random Pokemon is chosen each time you refresh the page</p>
            <p>• Unlimited guesses until you get it right!</p>
          </div>
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
            <p className="hint-description">"{removePokemonNamesFromDescription(targetPokemon.description, targetPokemon.name)}"</p>
            <button className="hide-hint-button" onClick={() => setShowHint(false)}>
              Hide Hint
            </button>
          </div>
        )}

        {gameStatus === 'won' && targetPokemon && (
          <GameOver
            targetPokemon={targetPokemon}
            guessCount={guesses.length}
          />
        )}
      </div>
    </div>
  )
}

export default App

