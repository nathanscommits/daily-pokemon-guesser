import { useState } from 'react'
import './GuessInput.css'

function GuessInput({ onGuess, pokemonList, guessedIds }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredPokemon = pokemonList
    .filter(p => !guessedIds.includes(p.id))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10) // Limit to 10 results

  const handleSelect = (pokemon) => {
    onGuess(pokemon)
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setShowDropdown(e.target.value.length > 0)
  }

  return (
    <div className="guess-input-container">
      <div className="input-wrapper">
        <input
          type="text"
          className="guess-input"
          placeholder="Type a Pokémon name..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setShowDropdown(true)}
        />
        
        {showDropdown && filteredPokemon.length > 0 && (
          <div className="dropdown">
            {filteredPokemon.map(pokemon => (
              <div
                key={pokemon.id}
                className="dropdown-item"
                onClick={() => handleSelect(pokemon)}
              >
                <img 
                  src={pokemon.spriteUrl} 
                  alt={pokemon.name}
                  className="pokemon-sprite-thumb"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="pokemon-details">
                  <span className="pokemon-name">{pokemon.name}</span>
                  <span className="pokemon-info">
                    {pokemon.types.join(' / ')} • Gen {pokemon.generation} • {pokemon.color} • {pokemon.evolutionStage === 'basic' ? 'Basic' : pokemon.evolutionStage === 'stage1' ? 'Stage 1' : 'Stage 2'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GuessInput

