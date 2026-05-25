import './App.css';

import Board from './components/Board/Board';

import { useReducer } from 'react';

const initialState = {
  board: [
    {id:0, val:' '}, {id:1, val:' '}, {id:2, val:' '},
    {id:3, val:' '}, {id:4, val:' '}, {id:5, val:' '}, 
    {id:6, val:' '}, {id:7, val:' '}, {id:8, val:' '},
  ],
  currentPlayer: 'X',
  moves: 0,
  winner: null,
  scoreX: 0,
  scoreO: 0
};

function checkGame(gameState){
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const line of winningLines){
    const [a, b, c] = line;
    // Get the values from the board at abc
    const valA = gameState.board[a].val;
    const valB = gameState.board[b].val;
    const valC = gameState.board[c].val;

    if (valA !== ' ' && valA === valB && valB === valC){
      const winner = valA;
      return{
        winner: winner,
        gameOver: true,
        newScoreX: winner === 'X' ? gameState.scoreX + 1 : gameState.scoreX,
        newScoreO: winner === 'O' ? gameState.scoreO + 1 : gameState.scoreO
      };
    }

  }
  // check tie
  const isTie = gameState.board.every(cell => cell.val !== ' '); // ensure no possibles plays left
  if (isTie) {
    return {
      winner: 'tie',
      gameOver: true,
      newScoreX: gameState.scoreX, // no affect to scores - tie
      newScoreO: gameState.scoreO
    };
  }
  
  // Game continues
  return {
    winner: null,
    gameOver: false,
    newScoreX: gameState.scoreX,
    newScoreO: gameState.scoreO
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index, player } = action.payload;
      
      // Don't allow move if:
      // - Square already taken
      // - Wrong player
      // - Game already has winner
      if (state.board[index].val !== ' ' || 
          player !== state.currentPlayer || 
          state.winner) {
        return state;
      }
      
      // Create new board with the move
      const newBoard = [...state.board];
      newBoard[index] = { ...newBoard[index], val: player };
      
      // Create temporary state to check win condition
      const tempState = {
        ...state,
        board: newBoard,
        moves: state.moves + 1
      };
      
      // Check if this move resulted in win/tie
      const gameCheck = checkGame(tempState);
      
      // Return updated state
      return {
        ...tempState,
        winner: gameCheck.winner, // outcome of game at this point
        currentPlayer: gameCheck.gameOver // if game over freeze
          ? state.currentPlayer // else sqwap turns
          : state.currentPlayer === 'X' ? 'O' : 'X',
        scoreX: gameCheck.newScoreX,
        scoreO: gameCheck.newScoreO
      };
    }
    
    case 'RESET_GAME': {
      return {
        ...initialState,
        scoreX: state.scoreX,  // Keep scores
        scoreO: state.scoreO   // Keep scores
      };
    }
    
    case 'NEW_GAME': {
      return initialState;  // Reset everything
    }
    
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  let status;
  if (state.winner === 'tie') {
    status = "It's a tie!";
  } else if (state.winner) {
    status = `Player ${state.winner} wins!`;
  } else {
    status = `Next player: ${state.currentPlayer}`;
  }

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="scores">
        <span>Player X: {state.scoreX}</span>
        <span>Player O: {state.scoreO}</span>
      </div>
      <p className="status">{status}</p>
      <Board
        board={state.board}
        currentPlayer={state.currentPlayer}
        winner={state.winner}
        dispatch={dispatch}
      />
      <div className="buttons">
        <button onClick={() => dispatch({ type: 'RESET_GAME' })}>
          Play Again
        </button>
        <button onClick={() => dispatch({ type: 'NEW_GAME' })}>
          Reset Scores
        </button>
      </div>
    </div>
  );
}

export default App;
