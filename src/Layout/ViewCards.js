import React from 'react';
import { useHistory, useRouteMatch, Link } from 'react-router-dom';
import { deleteCard } from '../utils/api';

function ViewCards({ cards = [] }) {
  const history = useHistory();
  const { url } = useRouteMatch();

  const deleteCardHandler = async (cardId) => {
    const response = window.confirm(
      'Delete this card? You will not be able to recover it.'
    );
    if (response) {
      await deleteCard(cardId);
      history.go(0);
    }
  };

  const styledCards = cards.map((card, index) => (
  <div>
    <div key={index} className='card'>
      <div className='card-body'>
        <div className='row d-flex justify-content-between'>
          <div className='col-6'>
            <div className='card'>
              <div className='card-header p-3 mb-2 bg-secondary text-white'>
                <h5 class="card-title">Front</h5>
              </div>
              <div className='card-body'>              
                {card.front}
              </div>              
            </div>            
          </div>
          <div className='col-6'>
            <div className='card'>
              <div className='card-header p-3 mb-2 bg-secondary text-white'>
                <h5 class="card-title">Back</h5>
              </div>
              <div className='card-body'>              
                {card.back}
              </div>              
            </div>
          </div>
        </div>
        <div className='row d-flex justify-content-between'>          
          <div>
            <Link to={`${url}/cards/${card.id}/edit`}>
              <button className='btn btn-secondary m-3'>
              <i class="bi bi-pencil-square"></i> Edit
              </button>
            </Link>
          </div>
          <div>
            <button
              className='btn btn-danger m-3'
              onClick={() => deleteCardHandler(card.id)}
            >
              <i class="bi bi-trash"></i> Delete Card
            </button>        
          </div>
        </div>
      </div>      
    </div>
    <p> </p>     
  </div>
  ));

  return (
    <React.Fragment>
      <div className='card'>
        <div className='card-body'>        
          <h3>Cards</h3>
        </div>
        <div className='card border-0'>
          <div className='card-body'>
            {styledCards}
          </div>          
        </div>
      </div>      
    </React.Fragment>
  );
}

export default ViewCards;
