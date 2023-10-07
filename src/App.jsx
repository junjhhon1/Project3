import { useState, useEffect } from 'react'
import './App.css'

const cardPairs = [
  { Name: 'Zeus', Bio: 'The King of the Gods and the ruler of Olympus. He is the god of the sky, thunder and lightning, storms, and more. He is the brother of Poseidon and Hades, and the son of Kronos and Rhea.' },
  { Name: 'Odin', Bio: 'The King of the Gods and the ruler of Asgard. He is the god of war, death, wisdom, poetry, and more. He is the husband of Frigg, and the father of Thor, Baldr, and more.' },
  { Name: 'Dagda', Bio: 'The King of the Gods and the ruler of the Tuatha Dé Danann. He is the god of life and death, the earth, fertility, agriculture, and more. He is the husband of the Morrigan, and the father of Brigid, Aengus, and more.' },
  { Name: 'Sukuba-hikona', Bio: 'The god of healing, medicine, and the arts. He is the son of Ōkuninushi and Suseri-hime.' },
  { Name: "Koga Saburo", Bio: 'A demon who was once a member of the defunct Counter-Demon Force, and he is attempting to protect the people and the country in his own way.' },
  { Name: 'Gozu-Tennoh', Bio: 'A fearsome protector deity found in Japanese esoteric Buddhism. He is a combinatory deity, meaning he is an amalgamation of many beliefs.'}
]

function Card({card, showAnswer, setShowAnswer, onPrevCard, onNextCard, onCheckAnswer, onMarkMastered}) {
  const [inputValue, setInputValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
    setIsValid(event.target.value.length > 0)
  }

  const handleSubmit = () => {
    const userAnswer = inputValue.toLowerCase().trim()
    const correctAnswer = card.Name.toLowerCase().trim()
    if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer)) {
      setIsCorrect(true)
      onCheckAnswer(true)
    } else {
      setIsCorrect(false)
      onCheckAnswer(false)
    }
    setShowAnswer(true)
  }

  const handleMarkMastered = () => {
    onMarkMastered(card)
  }

  return (
    <div className="card">
      <div className="card-content">
        <h2>{card.Bio}</h2>
        {!showAnswer && (
          <>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={handleSubmit} disabled={!isValid}>Submit</button>
          </>
        )}
        {showAnswer && (
          <>
            {isCorrect !== null && (
              <p>{isCorrect ? 'Correct!' : 'Incorrect!'}</p>
            )}
            <button onClick={() => setShowAnswer(false)}>Hide Answer</button>
            {!isCorrect && (
              <p>The correct answer is: {card.Name}</p>
            )}
            <button onClick={handleMarkMastered}>Mark as Mastered</button>
          </>
        )}
        <div className="card-nav">
          <button onClick={onPrevCard}>Prev</button>
          <button onClick={onNextCard}>Next</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('white')
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [masteredCards, setMasteredCards] = useState([])

  const currentCard = cardPairs[currentCardIndex]

  useEffect(() => {
    setStreak(0)
  }, [currentCardIndex])

  const handlePrevCard = () => {
    const prevIndex = currentCardIndex === 0 ? cardPairs.length - 1 : currentCardIndex - 1
    setCurrentCardIndex(prevIndex)
    setShowAnswer(false)
  }

  const handleNextCard = () => {
    const nextIndex = (currentCardIndex + 1) % cardPairs.length
    setCurrentCardIndex(nextIndex)
    setShowAnswer(false)
  }

  const handleCheckAnswer = (isCorrect) => {
    if (isCorrect) {
      setStreak(streak + 1)
      if (streak + 1 > longestStreak) {
        setLongestStreak(streak + 1)
      }
    } else {
      setStreak(0)
    }
  }

  const handleMarkMastered = (card) => {
    setMasteredCards([...masteredCards, card])
    const remainingCards = cardPairs.filter(c => c.Name !== card.Name)
    const newIndex = Math.floor(Math.random() * remainingCards.length)
    setCurrentCardIndex(newIndex)
    setShowAnswer(false)
  }

  const handleShuffle = () => {
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5)
    const currentCardName = currentCard.Name
    const newIndex = shuffledCards.findIndex(c => c.Name === currentCardName)
    setCurrentCardIndex(newIndex)
    setShowAnswer(false)
  }

  const handleBackgroundColorChange = () => {
    setBackgroundColor(backgroundColor === 'white' ? 'lightgray' : 'white')
  }

  return (
    <div className="App" style={{backgroundColor}}>
      <h1>Shin Megami Tensei and Persona Series Demons and their Bio</h1>
      <p>Total Cards: {cardPairs.length}</p>
      <p>Current Streak: {streak}</p>
      <p>Longest Streak: {longestStreak}</p>
      <button onClick={handleShuffle}>Shuffle</button>
      <Card
        card={currentCard}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        onPrevCard={handlePrevCard}
        onNextCard={handleNextCard}
        onCheckAnswer={handleCheckAnswer}
        onMarkMastered={handleMarkMastered}
      />
      <button onClick={handleBackgroundColorChange}>Change Background Color</button>
      {masteredCards.length > 0 && (
        <>
          <h2>Mastered Cards:</h2>
          <ul>
            {masteredCards.map(card => (
              <li key={card.Name}>{card.Name}</li>
            ))}
          </ul>
        </>
      )}
    </div>  
  )
}

export default App
