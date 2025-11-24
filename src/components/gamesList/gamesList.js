import { getGames, createGame } from '../../services/supaservice.js';
import { generateFruitsRandomBoard } from '../../gameLogic.js';

class gamesList extends HTMLElement {
    connectedCallback() {
        this.render();
        
    }
    render() {
        this.innerHTML = `
        <h2>Games List</h2>
        <ul id="games-container" class="list-group">
            <!-- Games will be listed here -->
        </ul>
        <button type="button" class="btn btn-primary">New Game</button>
        `;
        const container = this.querySelector('#games-container');
        getGames().then(games => {
           const gamesList = games.map(game => `<li class="list-group-item" data-id="${game.id}">${game.id}, ${game.player1} - ${game.player2}</li>`).join('');
           container.innerHTML = gamesList;
        });
        container.addEventListener('click', (event) => {
            const li = event.target;
            if (li.tagName === 'LI') {
                const gameId = li.getAttribute('data-id');
                const event = new CustomEvent('gameSelected', {
                    detail: { gameId: gameId },
                    bubbles: true,
                    composed: true
                });
                this.dispatchEvent(event);  
            }
        });
        this.querySelector('button').addEventListener('click', () => {
            console.log('New Game button clicked');
            const fruitsBoardInit = generateFruitsRandomBoard(120);
            createGame({ game_state: fruitsBoardInit }).then(() => {
                getGames().then(games => {
                    const gamesList = games.map(game => `<li class="list-group-item" data-id="${game.id}">${game.id}, ${game.player1} - ${game.player2}</li>`).join('');
                    container.innerHTML = gamesList;
                });
            });
        }); 
    }
}

customElements.define('game-gameslist', gamesList);