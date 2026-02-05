import './GameOver.css'

function GameOver({ targetPokemon, guessCount }) {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
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
        
        <div className="daily-challenge-info">
          <p className="share-message">
            Refresh the page to play again with a new random Pokemon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameOver

