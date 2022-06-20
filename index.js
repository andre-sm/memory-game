document.addEventListener('DOMContentLoaded', () => {

  const cards = document.querySelector('.cards'),
        moves = document.querySelector('.moves'),
        time = document.querySelector('.time'),
        modalEnd = document.querySelector('.modal-game-over'),
        playAgainBtn = document.querySelector('.play-again-btn'),
        playBtn = document.querySelector('.play-btn'),
        modalStart = document.querySelector('.modal-start-game'),
        overlay = document.querySelector('.overlay'),
        score = document.querySelector('.results');


  const selectedCards = [];
  let randomPairs;
  let seconds = 0;
  let minutes = 0;
  let movesCount = 0;
  let timeInMs = 0;
  let timeInterval;
  let bestScoreArray = JSON.parse(localStorage.getItem('bestScores')) || [];

  const cardsArray = [
      { name: 'card1', img: './assets/img/card1.png' },
      { name: 'card2', img: './assets/img/card2.png' },
      { name: 'card3', img: './assets/img/card3.png' },
      { name: 'card4', img: './assets/img/card4.png' },
      { name: 'card5', img: './assets/img/card5.png' },
      { name: 'card6', img: './assets/img/card6.png' },
      { name: 'card7', img: './assets/img/card7.png' },
      { name: 'card8', img: './assets/img/card8.png' },
      { name: 'card9', img: './assets/img/card9.png' },
      { name: 'card10', img: './assets/img/card10.png' },
    ];
  const cardsPairs = cardsArray.concat(cardsArray);

  // Random cards

  function randomCards() {
    randomPairs = cardsPairs
    .map( value => ( { value, sort: Math.random() } ))
    .sort((a, b) => a.sort - b.sort)
    .map(( { value } ) => value);
  }

  // Create cards

  function createCards() {
    randomCards();

    randomPairs.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-name', item.name);

      const back = document.createElement('img');
      const front = document.createElement('img');

      back.setAttribute('src', './assets/img/blank.png');
      back.classList.add('back-card');
      front.setAttribute('src', item.img);
      front.classList.add('front-card');

      cards.appendChild(card);
      card.appendChild(front);
      card.appendChild(back);

      card.addEventListener('click', flipCard);
    });

  }
  createCards();
  cards.classList.add('no-event');

  // Modal start game

  playBtn.addEventListener('click', startGame);

  function startGame() {
    cards.classList.remove('no-event');
    modalStart.classList.remove('show');
    timer();
  }

  // Check cards

  function checkCards() {
    const [firstCard, secondCard] = selectedCards;
    cards.classList.add('no-event');

    if(firstCard.dataset.name === secondCard.dataset.name) {
      firstCard.classList.replace('selected', 'matched');
      secondCard.classList.replace('selected', 'matched');
      selectedCards.length = 0;

      setTimeout(() => {
        const allSelectedCards = document.querySelectorAll('.matched');
        if(allSelectedCards.length === 20) {
          stopTime();
          getAllStats();
        } else {
          cards.classList.remove('no-event');
        }
      }, 500);

    } else {
      setTimeout(() => {
        firstCard.classList.remove('selected');
        secondCard.classList.remove('selected');
    
        selectedCards.length = 0;
        cards.classList.remove('no-event');
      }, 400);
    }
  }

  // Flip card 

  function flipCard(e) {
    const selectedCard = e.target.parentElement;
    selectedCard.classList.add('selected');
    selectedCards.push(selectedCard);

    if(selectedCards.length === 2) {
      moveCounter();
      checkCards();
    }
  }

  // Timer

  function timer() {
    timeInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      time.textContent = `Time: ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }, 1000);
  }

  function stopTime() {
    clearInterval(timeInterval);
  }

  // Moves counter

  function moveCounter() {
    movesCount++;
    moves.textContent = `Moves: ${movesCount}`;
  }

  // Display score board

  function displayEndGameModal() {
    modalEnd.classList.add('show');
    const sortedResults = bestScoreArray.sort((a, b) => {
      return a.moves - b.moves;
    });

    if(sortedResults.length > 10) {
      sortedResults.splice(10);
    }

    for(let i = 0; i < 10; i++) {
      const scoreItem = document.createElement('div');
      scoreItem.classList.add('score-item');

      if(sortedResults[i]) {
        const resultDate = new Date(sortedResults[i].date);
        const year = resultDate.getFullYear().toString().slice(-2);
        let month = resultDate.getMonth() + 1;
        if(month < 10) {
          month = '0' + month;
        }
        const monthDate = resultDate.getDate();

        scoreItem.innerHTML = `
          <span class="place">${i + 1}.</span>
          <span>${sortedResults[i].moves}</span>
          <span>${convertTime(sortedResults[i].time)}</span>
          <span>${`${monthDate}.${month}.${year}`}</span>
        `;
        if(timeInMs === sortedResults[i].date) {
          scoreItem.classList.add('last-result');
        }
      } else {
        scoreItem.innerHTML = `<span class="place">${i + 1}.</span>`;
      }

      score.appendChild(scoreItem);
    }
  }

  function convertTime(time) {
    let min = Math.floor(time / 60);
    let sec = time - min * 60;
    if(sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`;
  }

  playAgainBtn.addEventListener('click', () => {
    resetAllData();
    timer();
    createCards();
    modalEnd.classList.remove('show');
    cards.classList.remove('no-event');
  });

  function resetAllData() {
    seconds = 0;
    minutes = 0;
    movesCount = 0;
    timeInMs = 0;
    cards.innerHTML = '';
    score.innerHTML = '';
    moves.textContent = `Moves: ${movesCount}`;
  }

  // Get all game results

  function getAllStats() {
    const allSeconds = (minutes * 60) + seconds;
    timeInMs = Date.now();

    const currentResult = {
      moves: movesCount,
      time: allSeconds,
      date: timeInMs
    }

    bestScoreArray.push(currentResult);
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
    displayEndGameModal();
  }
  
});
