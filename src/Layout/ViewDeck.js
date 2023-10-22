import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useHistory, Route } from 'react-router-dom';
import { deleteDeck, readDeck } from '../utils/api';
import ViewCards from './ViewCards';

function ViewDeck() {
  const mountedRef = useRef(false);
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState({ name: 'loading...', cards: [] });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        if (mountedRef.current) {
          setDeck(() => ({ ...response }));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    }
    loadDeck();
    return () => {
      abortController.abort();
    };
  }, [deckId]);

  const deleteHandler = async (deckId) => {
    const confirmation = window.confirm(
      'Delete this deck? You will not be able to recover it.'
    );
    if (confirmation) {
      await deleteDeck(deckId);
      history.push('/');
    }
  };

  return (
    <React.Fragment>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>
              <i className="bi bi-house"></i> Home
            </Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            {deck.name}
          </li>
        </ol>
      </nav>
      <div className='card p-3 mb-2 bg-secondary text-white'>        
        <div className='card-body'>
          <h2>{deck.name}</h2>
          <blockquote className='blockquote mb-0'>
            <p>{deck.description}</p>
          </blockquote>
          <div className="d-flex justify-content-between">
            <div>            
              <Link to={`/decks/${deck.id}/edit`} className='card-link'>
                <button
                  className='btn btn-light'
                  onClick={() => history.push(`/decks/${deck.id}/edit`)}
                >
                  <i className="bi bi-pencil-square"></i> Edit
                </button>
              </Link>            
              <Link to={`/decks/${deck.id}/study`} className='card-link'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => history.push(`/decks/${deck.id}/study`)}
                >
                  <i className="bi bi-journals"></i> Study
                </button>
              </Link>
              <Link to={`/decks/${deck.id}/cards/new`} className='card-link'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => history.push(`/decks/${deck.id}/cards/new`)}
                >
                  <i className="bi bi-plus-circle"></i> Add Cards
                </button>
              </Link>
            </div>
            <button
              type='button'
              className='btn btn-danger'
              onClick={() => deleteHandler(deckId)}
            >
              <i className="bi bi-trash"></i> Delete Deck
            </button>       
          </div>
        </div>
      </div>
      <p> </p>
      <Route>
        <ViewCards cards={deck.cards} />
      </Route>
    </React.Fragment>
  );
}

export default ViewDeck;
