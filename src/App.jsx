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
  const [dailyDate, setDailyDate] = useState(null)
  const [timeUntilReset, setTimeUntilReset] = useState(null)

  // Get daily Pokemon based on date
  const getDailyPokemon = () => {
    const today = new Date()
    const dateString = today.toISOString().split('T')[0] // YYYY-MM-DD format
    
    // Use date as seed for consistent daily Pokemon
    const seed = dateString.split('-').join('')
    const pokemonIndex = parseInt(seed) % pokemonData.length
    
    return {
      pokemon: pokemonData[pokemonIndex],
      date: dateString
    }
  }

  // Calculate time until next reset (midnight UTC)
  const getTimeUntilReset = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)
    
    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { hours, minutes }
  }

  // Initialize daily game
  useEffect(() => {
    initializeDailyGame()
    
    // Update timer every minute
    const timer = setInterval(() => {
      setTimeUntilReset(getTimeUntilReset())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  const initializeDailyGame = () => {
    const dailyData = getDailyPokemon()
    const savedData = localStorage.getItem('pokemonGuesserDaily')
    
    if (savedData) {
      const parsed = JSON.parse(savedData)
      
      // Check if it's a new day
      if (parsed.date === dailyData.date) {
        // Same day - restore saved progress
        setTargetPokemon(parsed.targetPokemon)
        setGuesses(parsed.guesses || [])
        setGameStatus(parsed.gameStatus || 'playing')
        setDailyDate(parsed.date)
      } else {
        // New day - start fresh
        startNewDailyGame(dailyData)
      }
    } else {
      // First time - start fresh
      startNewDailyGame(dailyData)
    }
    
    setTimeUntilReset(getTimeUntilReset())
  }

  const startNewDailyGame = (dailyData) => {
    setTargetPokemon(dailyData.pokemon)
    setGuesses([])
    setGameStatus('playing')
    setShowHint(false)
    setDailyDate(dailyData.date)
    
    // Save to localStorage
    localStorage.setItem('pokemonGuesserDaily', JSON.stringify({
      date: dailyData.date,
      targetPokemon: dailyData.pokemon,
      guesses: [],
      gameStatus: 'playing'
    }))
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

    let newGameStatus = gameStatus
    // Check if won
    if (pokemon.id === targetPokemon.id) {
      newGameStatus = 'won'
      setGameStatus('won')
    }

    // Save progress to localStorage
    localStorage.setItem('pokemonGuesserDaily', JSON.stringify({
      date: dailyDate,
      targetPokemon: targetPokemon,
      guesses: newGuesses,
      gameStatus: newGameStatus
    }))
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
        dailyDate={dailyDate}
        timeUntilReset={timeUntilReset}
        gameStatus={gameStatus}
      />
      
      {showRules && (
        <div className="rules">
          <h3>How to Play</h3>
          <p>Guess today's Pokemon! Take as many tries as you need!</p>
          <ul>
            <li><span className="match">Green</span> = Correct attribute</li>
            <li><span className="partial">Yellow</span> = Partial match (types only)</li>
            <li><span className="no-match">Gray</span> = No match</li>
          </ul>
          <p>Each guess shows which attributes match the target Pokemon.</p>
          <div className="daily-rules">
            <h4>📅 Daily Challenge</h4>
            <p>• Everyone gets the same Pokemon each day</p>
            <p>• New puzzle resets at midnight UTC</p>
            <p>• Your progress is saved automatically</p>
            <p>• Unlimited guesses until you get it right!</p>
            <p>• Share your results with friends!</p>
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
            <p className="hint-description">"{removePokemonNameFromDescription(targetPokemon.description, targetPokemon.name)}"</p>
            <button className="hide-hint-button" onClick={() => setShowHint(false)}>
              Hide Hint
            </button>
          </div>
        )}

        {gameStatus === 'won' && targetPokemon && (
          <GameOver
            targetPokemon={targetPokemon}
            guessCount={guesses.length}
            dailyDate={dailyDate}
            timeUntilReset={timeUntilReset}
          />
        )}
      </div>
    </div>
  )
}

export default App

