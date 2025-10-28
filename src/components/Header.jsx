import './Header.css'

function Header({ onShowRules, onShowHint, showHint, canShowHint, dailyDate, timeUntilReset, gameStatus }) {
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
    <header className="header">
      <div className="header-top">
        <h1 className="title">Pokémon Guesser</h1>
        <div className="daily-info">
          <div className="daily-date">
            Daily Challenge - {formatDate(dailyDate)}
          </div>
          {timeUntilReset && (
            <div className="reset-timer">
              Next puzzle in {timeUntilReset.hours}h {timeUntilReset.minutes}m
            </div>
          )}
        </div>
      </div>
      <div className="header-buttons">
        {canShowHint && gameStatus === 'playing' && (
          <button 
            className={`hint-button ${showHint ? 'active' : ''}`} 
            onClick={onShowHint}
          >
            {showHint ? '📖 Hide Hint' : '📖 Show Hint'}
          </button>
        )}
        <button className="rules-button" onClick={onShowRules}>
          How to Play
        </button>
      </div>
    </header>
  )
}

export default Header

