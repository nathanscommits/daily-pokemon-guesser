import GuessRow from './GuessRow'
import './GuessList.css'

function GuessList({ guesses }) {
  if (guesses.length === 0) {
    return (
      <div className="guesses-empty">
        <p>Make your first guess to start!</p>
      </div>
    )
  }

  return (
    <div className="guesses-list">
      <div className="guesses-header">
        <div className="header-cell">Sprite</div>
        <div className="header-cell">Pokémon</div>
        <div className="header-cell">Type(s)</div>
        <div className="header-cell">Generation</div>
        <div className="header-cell">Evolution</div>
        <div className="header-cell">Color</div>
      </div>
      {guesses.map((guess, index) => (
        <GuessRow key={index} guess={guess} />
      ))}
    </div>
  )
}

export default GuessList

