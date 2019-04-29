import React from 'react';
import './Modal.css';

const modal = ({
  title, children, isConfirmable, confirmText = 'Confirm', isCancelable, onCancel, onConfirm,
}) => (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">
        {children}
      </section>
      <section className="modal__actions">
        {isCancelable && <button className="btn" onClick={onCancel}>Cancel</button>}
        {isConfirmable && <button className="btn" onClick={onConfirm}>{confirmText}</button>}
      </section>
    </div>
  );

export default modal;
