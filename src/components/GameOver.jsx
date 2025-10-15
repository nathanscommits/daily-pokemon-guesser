import './GameOver.css'

function GameOver({ status, targetPokemon, guessCount, onNewGame }) {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        {status === 'won' ? (
          <>
            <h2 className="game-over-title success">🎉 Congratulations! 🎉</h2>
            <div className="pokemon-reveal">
              <img 
                src={targetPokemon.spriteUrl} 
                alt={targetPokemon.name}
                className="pokemon-sprite-large"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="game-over-message">
              You guessed <strong>{targetPokemon.name}</strong> in {guessCount} {guessCount === 1 ? 'try' : 'tries'}!
            </p>
            {targetPokemon.description && (
              <div className="pokedex-description">
                <h4>📖 Pokedex Entry</h4>
                <p className="description-text">"{targetPokemon.description}"</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="game-over-title failure">Game Over</h2>
            <div className="pokemon-reveal">
              <img 
                src={targetPokemon.spriteUrl} 
                alt={targetPokemon.name}
                className="pokemon-sprite-large"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="game-over-message">
              The correct Pokémon was <strong>{targetPokemon.name}</strong>
            </p>
            <div className="pokemon-details">
              <p><strong>Types:</strong> {targetPokemon.types.join(', ')}</p>
              <p><strong>Generation:</strong> {targetPokemon.generation}</p>
              <p><strong>Color:</strong> {targetPokemon.color}</p>
              {targetPokemon.description && (
                <div className="pokedex-description">
                  <h4>📖 Pokedex Entry</h4>
                  <p className="description-text">"{targetPokemon.description}"</p>
                </div>
              )}
            </div>
          </>
        )}
        <button className="new-game-button" onClick={onNewGame}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default GameOver

