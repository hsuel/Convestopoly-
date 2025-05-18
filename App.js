// Full Convestopoly with Visual Grid + Gameplay + Interactive Quiz & Sort-It + Winner

import React, { useState } from 'react';
import './App.css';

const boardLayout = [
  'Sort-It', 'City', 'City', 'Eco', 'City', 'City', 'Eco Challenge',
  'City', '', '', '', '', '', 'City',
  'City', '', '', '', '', '', 'City',
  'City', '', 'Quiz', '', '', '', 'City',
  'City', '', '', '', '', '', 'City',
  'City', '', '', '', '', '', 'City',
  'City', 'City', 'City', 'City', 'City', 'City', 'Learning Center'
];

const icons = {
  'Sort-It': '♻️',
  'City': '🏙️',
  'Eco': '🌳',
  'Eco Challenge': '💡',
  'Learning Center': '📘',
  'Quiz': ''
};

const quizQuestions = [
  {
    question: 'What is the most recyclable material?',
    options: ['Plastic', 'Glass', 'Aluminum', 'Paper'],
    answer: 2
  },
  {
    question: 'Which of these goes in a compost bin?',
    options: ['Apple core', 'Plastic bag', 'Soda can', 'Styrofoam'],
    answer: 0
  }
];

const sortItems = [
  { item: 'Banana peel', correct: 'Compost' },
  { item: 'Newspaper', correct: 'Recycle' },
  { item: 'Broken glass', correct: 'Trash' }
];

const Tile = ({ label, playerHere }) => {
  if (!label) return <div className="tile empty"></div>;
  const tokens = Array.isArray(playerHere) ? playerHere : playerHere ? [playerHere] : [];
  return (
    <div className={`tile ${label.toLowerCase().replace(/ /g, '-')}`}>
      {icons[label]}<br />{label}
      {tokens.map((token, idx) => <div key={idx} className="player-token">{token}</div>)}
    </div>
  );
};

export default function App() {
  const [playerCount] = useState(2);
  const [playerPositions, setPlayerPositions] = useState([0, 0]);
  const [ecoPoints, setEcoPoints] = useState([0, 0]);
  const [winner, setWinner] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [quizPrompt, setQuizPrompt] = useState(null);
  const [sortPrompt, setSortPrompt] = useState(null);

  const handleRoll = () => {
    if (winner || quizPrompt || sortPrompt) return;
    const newPositions = [...playerPositions];
    const newPoints = [...ecoPoints];

    const move = Math.floor(Math.random() * 6) + 1;
    newPositions[currentTurn] = (newPositions[currentTurn] + move) % boardLayout.length;

    const tileType = boardLayout[newPositions[currentTurn]];

    switch (tileType) {
      case 'City':
        newPoints[currentTurn] += 10;
        break;
      case 'Sort-It':
        setSortPrompt({ ...sortItems[Math.floor(Math.random() * sortItems.length)] });
        break;
      case 'Eco':
        newPoints[currentTurn] += 5;
        break;
      case 'Eco Challenge':
        newPoints[currentTurn] -= 10;
        break;
      case 'Learning Center':
        newPoints[currentTurn] += 20;
        break;
      case 'Quiz':
        setQuizPrompt({ ...quizQuestions[Math.floor(Math.random() * quizQuestions.length)] });
        break;
      default:
        break;
    }

    setPlayerPositions(newPositions);
    setEcoPoints(newPoints);

    if (tileType !== 'Quiz' && tileType !== 'Sort-It') {
      const maxPoints = Math.max(...newPoints);
      const maxIndex = newPoints.findIndex(p => p === maxPoints);
      if (newPoints.some(p => p >= 100)) {
        setWinner(`🎉 Winner: Player ${maxIndex + 1} with ${maxPoints} Eco Points!`);
      } else {
        setCurrentTurn((currentTurn + 1) % playerCount);
      }
    }
  };

  const handleQuizAnswer = (index) => {
    const correct = index === quizPrompt.answer;
    const newPoints = [...ecoPoints];
    if (correct) newPoints[currentTurn] += 10;
    setEcoPoints(newPoints);
    setQuizPrompt(null);
    setCurrentTurn((currentTurn + 1) % playerCount);
  };

  const handleSortAnswer = (bin) => {
    const correct = bin === sortPrompt.correct;
    const newPoints = [...ecoPoints];
    if (correct) newPoints[currentTurn] += 10;
    setEcoPoints(newPoints);
    setSortPrompt(null);
    setCurrentTurn((currentTurn + 1) % playerCount);
  };

  return (
    <div className="App">
      <h1>🌿 Convestopoly</h1>
      <div className="board-grid">
        {boardLayout.map((label, i) => {
          const playersHere = playerPositions
            .map((pos, idx) => pos === i ? `🧍‍♂️P${idx + 1}` : null)
            .filter(Boolean);
          return <Tile key={i} label={label} playerHere={playersHere} />;
        })}
      </div>
      {!quizPrompt && !sortPrompt && !winner && (
        <button onClick={handleRoll}>🎲 Roll Dice (Player {currentTurn + 1})</button>
      )}

      <div className="status">
        {ecoPoints.map((pts, i) => (
          <p key={i}>Player {i + 1}: {pts} Eco Points</p>
        ))}
        {quizPrompt && (
          <div className="quiz-box">
            <p>{quizPrompt.question}</p>
            {quizPrompt.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuizAnswer(idx)}>{opt}</button>
            ))}
          </div>
        )}
        {sortPrompt && (
          <div className="sort-box">
            <p>Where does this go: <strong>{sortPrompt.item}</strong>?</p>
            {['Recycle', 'Compost', 'Trash', 'Donate'].map((bin, idx) => (
              <button key={idx} onClick={() => handleSortAnswer(bin)}>{bin}</button>
            ))}
          </div>
        )}
        {winner && <h2>{winner}</h2>}
      </div>
    </div>
  );
}
