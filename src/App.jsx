import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import sortPlacesByDistance from './loc.js'

//Side Effect
// this run synchronously, so only run once
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
// want to ge places data like title, to convert every id
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  // So we switch from managing the modal in an imperative way to managing it in a declarative way.
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);// to initialize our picked places

  useEffect(() => {
    //
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES, 
        position.coords.latitude, 
        position.coords.longitude
      );
  
      setAvailablePlaces(sortedPlaces);
    });  
  }, []); // empty dependencies defined, putting [], this effect will only run once

  
  function handleStartRemovePlace(id) {
    //modal.current.open();
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    //modal.current.close();
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    // dont store exisiting ids
    if (storedIds.indexOf(id) === -1){
      //localStorage to store some data in browser storage
      localStorage.setItem(
        'selectedPlaces', 
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  // to avoid infite loop use useCallback
  // useCallback returns a value, inner function is not recreated
  // also take dependecy
  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    //modal.current.close();
    //setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces',
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []); //empty array is fine, ther is nothing could be changed and func wont recreate
  

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
