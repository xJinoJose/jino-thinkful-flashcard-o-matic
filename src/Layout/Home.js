import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { deleteDeck, listDecks } from '../utils/api/index.js';

function Home() {
  const [decks, setDecks] = useState([]);
  const history = useHistory();
  const referenceMount = useRef(false);

  useEffect(() => {
    referenceMount.current = true;
    return () => {
      referenceMount.current = false;
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDecks() {
      try {
        const decks = await listDecks();
        if (referenceMount.current) {
          setDecks((_) => [...decks]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    }
    loadDecks();

    return () => abortController.abort();
  }, []);

  // Handlers
  const deleteHandler = async (deckId) => {
    const confirmation = window.confirm(
      'Delete this deck? You will not be able to recover it.'
    );
    if (confirmation) {
      await deleteDeck(deckId);
      history.go(0);
    }
  };

  // display all the decks in two columns
  const deckListing = decks.map((deck) => (
  <div className="col-sm-6" key={deck.id}>
    <div className="card">
      <div className="card-body">
        <div className='d-flex justify-content-between'>
          <h4 className='card-title'>{deck.name}</h4>
          <p>{deck.cards.length} cards</p>
        </div>
        <p className='card-text text-secondary'>{deck.description}</p>
        <div className="d-flex justify-content-between">
          <div>
            <Link to={`/decks/${deck.id}`} className='card-link'>
              <button 
                className='btn btn-secondary' 
                onClick={() => history.push(`/decks/${deck.id}`)}
              >
                <i className="bi bi-eye"></i> View
              </button>
            </Link>
            <Link to={`/decks/${deck.id}/study`} className='card-link'>
              <button
                className='btn btn-primary'
                onClick={() => history.push(`/decks/${deck.id}/study`)}
              >
                <i className="bi bi-journals"></i> Study
              </button>
            </Link>
          </div>
          <Link to='#' className='card-link'>
            <button
              className='btn btn-danger'
              onClick={() => deleteHandler(deck.id)}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </Link>          
        </div>
      </div>
    </div>
  </div>
  ));

  // return decks
  return decks ? (
    <React.Fragment>
      <div className="row">
        {deckListing}
      </div>      
    </React.Fragment>
  ) : (
    <p>Loading...</p>
  );
}

export default Home;