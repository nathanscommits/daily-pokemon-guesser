import './Header.css'

function Header({ onShowRules, onShowHint, showHint, canShowHint }) {
  return (
    <header className="header">
      <h1 className="title">Pokémon Guesser</h1>
      <div className="header-buttons">
        {canShowHint && (
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

