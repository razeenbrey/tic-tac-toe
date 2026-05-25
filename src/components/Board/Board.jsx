import './Board.css';
import Cell from '../Cell/Cell';

function Board({ board, currentPlayer, winner, dispatch }) {
  function handleClick(index) {
    dispatch({
      type: 'MAKE_MOVE',
      payload: { index, player: currentPlayer }
    });
  }

  return (
    <div className="board">
      {board.map((cell) => (
        <Cell
          key={cell.id}
          value={cell.val}
          onClick={() => handleClick(cell.id)}
          disabled={cell.val !== ' ' || winner !== null}
        />
      ))}
    </div>
  );
}

export default Board;
