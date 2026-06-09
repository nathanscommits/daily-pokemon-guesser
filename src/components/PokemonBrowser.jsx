import { useState, useMemo, useEffect } from 'react'
import './PokemonBrowser.css'

const TYPES = [
  'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying',
  'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'
]

const COLORS = ['Black', 'Blue', 'Brown', 'Gray', 'Green', 'Pink', 'Purple', 'Red', 'White', 'Yellow']

const STAGES = [
  { value: 'basic', label: 'Basic' },
  { value: 'stage1', label: 'Stage 1' },
  { value: 'stage2', label: 'Stage 2' }
]

function formatStage(stage) {
  if (stage === 'basic') return 'Basic'
  if (stage === 'stage1') return 'Stage 1'
  return 'Stage 2'
}

function deriveFiltersFromGuesses(guesses) {
  const filters = {
    typeFilter1: '',
    typeFilter2: '',
    genFilter: '',
    colorFilter: '',
    stageFilter: ''
  }

  guesses.forEach(({ pokemon, comparison }) => {
    if (comparison.generation === 'match') {
      filters.genFilter = String(pokemon.generation)
    }
    if (comparison.color === 'match') {
      filters.colorFilter = pokemon.color
    }
    if (comparison.evolutionStage === 'match') {
      filters.stageFilter = pokemon.evolutionStage
    }
    if (comparison.types === 'match') {
      if (pokemon.types.length === 2) {
        filters.typeFilter1 = pokemon.types[0]
        filters.typeFilter2 = pokemon.types[1]
      } else {
        filters.typeFilter1 = pokemon.types[0]
        filters.typeFilter2 = ''
      }
    }
  })

  return filters
}

function matchesGuessClues(pokemon, guesses) {
  return guesses.every(({ pokemon: guess, comparison }) => {
    if (comparison.generation === 'no-match' && pokemon.generation === guess.generation) {
      return false
    }
    if (comparison.color === 'no-match' && pokemon.color === guess.color) {
      return false
    }
    if (comparison.evolutionStage === 'no-match' && pokemon.evolutionStage === guess.evolutionStage) {
      return false
    }

    const sharedTypes = guess.types.filter(t => pokemon.types.includes(t))

    if (comparison.types === 'no-match' && sharedTypes.length > 0) {
      return false
    }
    if (comparison.types === 'partial' && sharedTypes.length === 0) {
      return false
    }
    if (comparison.types === 'match') {
      const sameTypes = guess.types.length === pokemon.types.length &&
        guess.types.every(t => pokemon.types.includes(t))
      if (!sameTypes) return false
    }

    return true
  })
}

function PokemonBrowser({ isOpen, pokemonList, guesses, guessedIds, onGuess, onClose }) {
  const [typeFilter1, setTypeFilter1] = useState('')
  const [typeFilter2, setTypeFilter2] = useState('')
  const [genFilter, setGenFilter] = useState('')
  const [colorFilter, setColorFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  useEffect(() => {
    if (!isOpen) return

    const derived = deriveFiltersFromGuesses(guesses)
    setTypeFilter1(derived.typeFilter1)
    setTypeFilter2(derived.typeFilter2)
    setGenFilter(derived.genFilter)
    setColorFilter(derived.colorFilter)
    setStageFilter(derived.stageFilter)
  }, [guesses, isOpen])

  const filtered = useMemo(() => {
    return pokemonList.filter(p => {
      if (!matchesGuessClues(p, guesses)) return false
      if (typeFilter1 && !p.types.includes(typeFilter1)) return false
      if (typeFilter2 && !p.types.includes(typeFilter2)) return false
      if (typeFilter1 && typeFilter2 && typeFilter1 === typeFilter2 && p.types.length !== 1) return false
      if (genFilter && p.generation !== Number(genFilter)) return false
      if (colorFilter && p.color !== colorFilter) return false
      if (stageFilter && p.evolutionStage !== stageFilter) return false
      return true
    })
  }, [pokemonList, guesses, typeFilter1, typeFilter2, genFilter, colorFilter, stageFilter])

  const hasFilters = typeFilter1 || typeFilter2 || genFilter || colorFilter || stageFilter

  const clearFilters = () => {
    setTypeFilter1('')
    setTypeFilter2('')
    setGenFilter('')
    setColorFilter('')
    setStageFilter('')
  }

  const handlePick = (pokemon) => {
    if (guessedIds.includes(pokemon.id)) return
    onGuess(pokemon)
  }

  if (!isOpen) return null

  return (
    <div className="pokemon-browser">
      <div className="browser-header">
        <h3>Browse Pokémon</h3>
        <button className="browser-close" onClick={onClose}>Close</button>
      </div>

      <div className="browser-filters">
        <select value={typeFilter1} onChange={e => setTypeFilter1(e.target.value)}>
          <option value="">Any type</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={typeFilter2} onChange={e => setTypeFilter2(e.target.value)}>
          <option value="">+ type (optional)</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={genFilter} onChange={e => setGenFilter(e.target.value)}>
          <option value="">Any gen</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
            <option key={g} value={g}>Gen {g}</option>
          ))}
        </select>

        <select value={colorFilter} onChange={e => setColorFilter(e.target.value)}>
          <option value="">Any color</option>
          {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="">Any stage</option>
          {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {hasFilters && (
          <button className="clear-filters" onClick={clearFilters}>Clear</button>
        )}
      </div>

      <p className="browser-count">
        {hasFilters
          ? `${filtered.length} Pokémon still possible`
          : 'Pick a filter to narrow down'}
      </p>

      {hasFilters && (
        <div className="browser-grid">
          {filtered.map(pokemon => {
            const alreadyGuessed = guessedIds.includes(pokemon.id)
            return (
              <button
                key={pokemon.id}
                className={`browser-card ${alreadyGuessed ? 'guessed' : ''}`}
                onClick={() => handlePick(pokemon)}
                disabled={alreadyGuessed}
              >
                <img
                  src={pokemon.spriteUrl}
                  alt={pokemon.name}
                  loading="lazy"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <span className="browser-card-name">{pokemon.name}</span>
                <span className="browser-card-info">
                  {pokemon.types.join(' / ')}
                </span>
                <span className="browser-card-info">
                  Gen {pokemon.generation} • {pokemon.color} • {formatStage(pokemon.evolutionStage)}
                </span>
                {alreadyGuessed && <span className="browser-guessed-tag">Guessed</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PokemonBrowser
