import './GuessRow.css'

function GuessRow({ guess }) {
  const { pokemon, comparison } = guess

  const getClassName = (status) => {
    return `attribute-cell ${status}`
  }

  const formatEvolutionStage = (stage) => {
    const stages = {
      'basic': 'Basic',
      'stage1': 'Stage 1',
      'stage2': 'Stage 2',
      'single': 'Single'
    }
    return stages[stage] || stage
  }

  return (
    <div className="guess-row">
      <div className="attribute-cell pokemon-sprite">
        <img 
          src={pokemon.spriteUrl} 
          alt={pokemon.name}
          className="pokemon-sprite-medium"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <div className="attribute-cell pokemon-name">
        {pokemon.name}
      </div>
      <div className={getClassName(comparison.types)}>
        {pokemon.types.join(' / ')}
      </div>
      <div className={getClassName(comparison.generation)}>
        {pokemon.generation}
      </div>
      <div className={getClassName(comparison.evolutionStage)}>
        {formatEvolutionStage(pokemon.evolutionStage)}
      </div>
      <div className={getClassName(comparison.color)}>
        {pokemon.color}
      </div>
    </div>
  )
}

export default GuessRow

