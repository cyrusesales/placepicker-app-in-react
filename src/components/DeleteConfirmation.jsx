import { useEffect } from 'react';

//responsible for rendering the content of modal
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    //set timer to close after 3 seconds
    console.log('TIMER SET');
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    //clean up function to stop timer
    //would also run if effect function run again
    return () => {
      console.log('Cleaning up timer')
      clearTimeout(timer);
    }
  }, []);
  

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}
