import './Cell.css';

function Cell({ value, onClick, disabled }) {
  return (
    <div className="cell">
      <button onClick={onClick} disabled={disabled}>
        {value === ' ' ? '' : value}
      </button>
    </div>
  );
}

export default Cell;
