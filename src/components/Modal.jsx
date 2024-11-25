import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }){
  const dialog = useRef();

  // useEffect can help synch prop value or ref value to DOM api, dialog will establish
  useEffect(() => {
    if (open) {
      //only calling showModal method, backdrop will be added
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]); // make sure will run again
  // useEffect only care dependecies to cause component function to execute again, if one dependecies change
  // open props value can change
  // In addition, other effect dependencies would be functions or context values that depend on or use state props.

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
