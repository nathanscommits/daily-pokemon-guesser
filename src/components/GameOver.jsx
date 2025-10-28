import './GameOver.css'

function GameOver({ targetPokemon, guessCount, dailyDate, timeUntilReset }) {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

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
          <h3>📅 Daily Challenge Complete!</h3>
          <p>Today's puzzle: <strong>{formatDate(dailyDate)}</strong></p>
          {timeUntilReset && (
            <p className="next-puzzle">
              Next puzzle in {timeUntilReset.hours}h {timeUntilReset.minutes}m
            </p>
          )}
          <p className="share-message">
            Share your result with friends! Everyone gets the same Pokemon each day.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameOver

