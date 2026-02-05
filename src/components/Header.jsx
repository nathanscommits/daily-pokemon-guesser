import './Header.css'

function Header({ onShowRules, onShowHint, showHint, canShowHint, gameStatus }) {
  return (
    <header className="header">
      <div className="header-top">
        <h1 className="title">Pokémon Guesser</h1>
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

