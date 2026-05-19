export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <h2>{title}</h2>
          <button className="btn ghost" onClick={onClose}>Fechar</button>
        </div>
        {children}
      </div>
    </div>
  );
}
