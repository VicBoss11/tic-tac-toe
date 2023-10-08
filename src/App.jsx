import { useState } from 'react'
import confetti from 'canvas-confetti'
import { TURNS } from './constants'
import { checkEndGameFrom, checkWinnerFrom } from './logic/board'
import WinnerModal from './components/WinnerModal'
import GameBoard from './components/GameBoard'
import TurnIndicator from './components/TurnIndicator'
import { saveGameToStorage, resetGameFromStorage } from './logic/storage'


function App() {
  const [board, setBoard] = useState(() => {
    const storedBoard = localStorage.getItem('board')

    return storedBoard ? JSON.parse(storedBoard) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const storedTurn = localStorage.getItem('turn')

    return storedTurn ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameFromStorage()
  }

  const updateBoard = (index) => {
    if (board[index] || winner) {
      return
    }

    const newBoard = [...board]
    newBoard[index] = turn

    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X

    setTurn(newTurn)

    saveGameToStorage({ board: newBoard, turn: newTurn })

    const newWinner = checkWinnerFrom(newBoard)

    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGameFrom(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>

      <button onClick={resetGame}>Resetear partida</button>

      <GameBoard board={board} updateBoard={updateBoard} />

      <TurnIndicator turn={turn} />

      <WinnerModal winner={winner} resetGame={resetGame}></WinnerModal>
    </main>
  )
}

export default App
