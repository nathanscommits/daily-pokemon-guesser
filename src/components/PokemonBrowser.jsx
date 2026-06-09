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
  const include = {
    typeFilter1: '',
    typeFilter2: '',
    genFilter: '',
    colorFilter: '',
    stageFilter: ''
  }
  const exclude = {
    gens: [],
    types: [],
    colors: [],
    stages: []
  }

  guesses.forEach(({ pokemon, comparison }) => {
    if (comparison.generation === 'match') {
      include.genFilter = String(pokemon.generation)
    } else if (comparison.generation === 'no-match') {
      const gen = String(pokemon.generation)
      if (!exclude.gens.includes(gen)) exclude.gens.push(gen)
    }

    if (comparison.color === 'match') {
      include.colorFilter = pokemon.color
    } else if (comparison.color === 'no-match') {
      if (!exclude.colors.includes(pokemon.color)) exclude.colors.push(pokemon.color)
    }

    if (comparison.evolutionStage === 'match') {
      include.stageFilter = pokemon.evolutionStage
    } else if (comparison.evolutionStage === 'no-match') {
      if (!exclude.stages.includes(pokemon.evolutionStage)) {
        exclude.stages.push(pokemon.evolutionStage)
      }
    }

    if (comparison.types === 'match') {
      if (pokemon.types.length === 2) {
        include.typeFilter1 = pokemon.types[0]
        include.typeFilter2 = pokemon.types[1]
      } else {
        include.typeFilter1 = pokemon.types[0]
        include.typeFilter2 = ''
      }
    } else if (comparison.types === 'no-match') {
      pokemon.types.forEach(t => {
        if (!exclude.types.includes(t)) exclude.types.push(t)
      })
    }
  })

  return { include, exclude }
}

function matchesGuessClues(pokemon, guesses) {
  return guesses.every(({ pokemon: guess, comparison }) => {
    const sharedTypes = guess.types.filter(t => pokemon.types.includes(t))

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
  const [excludeGens, setExcludeGens] = useState([])
  const [excludeTypes, setExcludeTypes] = useState([])
  const [excludeColors, setExcludeColors] = useState([])
  const [excludeStages, setExcludeStages] = useState([])
  const [pickerKey, setPickerKey] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    const { include, exclude } = deriveFiltersFromGuesses(guesses)
    setTypeFilter1(include.typeFilter1)
    setTypeFilter2(include.typeFilter2)
    setGenFilter(include.genFilter)
    setColorFilter(include.colorFilter)
    setStageFilter(include.stageFilter)
    setExcludeGens(exclude.gens)
    setExcludeTypes(exclude.types)
    setExcludeColors(exclude.colors)
    setExcludeStages(exclude.stages)
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

      if (excludeGens.includes(String(p.generation))) return false
      if (excludeColors.includes(p.color)) return false
      if (excludeStages.includes(p.evolutionStage)) return false
      if (excludeTypes.some(t => p.types.includes(t))) return false

      return true
    })
  }, [
    pokemonList, guesses, typeFilter1, typeFilter2, genFilter, colorFilter, stageFilter,
    excludeGens, excludeTypes, excludeColors, excludeStages
  ])

  const hasIncludeFilters = typeFilter1 || typeFilter2 || genFilter || colorFilter || stageFilter
  const hasExcludeFilters = excludeGens.length || excludeTypes.length || excludeColors.length || excludeStages.length
  const hasFilters = hasIncludeFilters || hasExcludeFilters

  const clearFilters = () => {
    setTypeFilter1('')
    setTypeFilter2('')
    setGenFilter('')
    setColorFilter('')
    setStageFilter('')
    setExcludeGens([])
    setExcludeTypes([])
    setExcludeColors([])
    setExcludeStages([])
  }

  const addExclude = (setter, value) => {
    if (!value) return
    setter(prev => prev.includes(value) ? prev : [...prev, value])
    setPickerKey(k => k + 1)
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

      <p className="filter-section-label">Include</p>
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
      </div>

      <p className="filter-section-label exclude-label">Exclude</p>
      {hasExcludeFilters && (
        <div className="exclude-tags">
          {excludeGens.map(g => (
            <button key={`gen-${g}`} className="exclude-tag" onClick={() => setExcludeGens(prev => prev.filter(x => x !== g))}>
              Not Gen {g} ×
            </button>
          ))}
          {excludeTypes.map(t => (
            <button key={`type-${t}`} className="exclude-tag" onClick={() => setExcludeTypes(prev => prev.filter(x => x !== t))}>
              Not {t} ×
            </button>
          ))}
          {excludeColors.map(c => (
            <button key={`color-${c}`} className="exclude-tag" onClick={() => setExcludeColors(prev => prev.filter(x => x !== c))}>
              Not {c} ×
            </button>
          ))}
          {excludeStages.map(s => (
            <button key={`stage-${s}`} className="exclude-tag" onClick={() => setExcludeStages(prev => prev.filter(x => x !== s))}>
              Not {formatStage(s)} ×
            </button>
          ))}
        </div>
      )}
      <div className="browser-filters exclude-filters">
        <select key={`type-${pickerKey}`} defaultValue="" onChange={e => addExclude(setExcludeTypes, e.target.value)}>
          <option value="">Not type...</option>
          {TYPES.filter(t => !excludeTypes.includes(t)).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select key={`gen-${pickerKey}`} defaultValue="" onChange={e => addExclude(setExcludeGens, e.target.value)}>
          <option value="">Not gen...</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].filter(g => !excludeGens.includes(String(g))).map(g => (
            <option key={g} value={g}>Gen {g}</option>
          ))}
        </select>

        <select key={`color-${pickerKey}`} defaultValue="" onChange={e => addExclude(setExcludeColors, e.target.value)}>
          <option value="">Not color...</option>
          {COLORS.filter(c => !excludeColors.includes(c)).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select key={`stage-${pickerKey}`} defaultValue="" onChange={e => addExclude(setExcludeStages, e.target.value)}>
          <option value="">Not stage...</option>
          {STAGES.filter(s => !excludeStages.includes(s.value)).map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
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
