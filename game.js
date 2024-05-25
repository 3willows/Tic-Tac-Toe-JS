// GAME CODE
function init(player, OPPONENT){
    //SELECT CANVAS
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d");

    //BOARD VARIABLES
    let board = [];
    const COLUMN = 3;
    const ROW = 3;
    const SPACE_SIZE = 150;

    //STORE PLAYERS MOVE
    let gameData = new Array(9);

    //By default the first player to play is the human
    let currentPlayer = player.man;

    const xImage = new Image;
    xImage.src = "img/X.png";

    const oImage = new Image;
    oImage.src = "img/O.png";

    // Win combinations
    const COMBOS = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    let GAME_OVER = false;

    //DRAW THE BORAD
    function drawBoard(){
        let id = 0;

        for(let i=0; i<ROW; i++){
            board[i] = [];
            for(let j=0; j<COLUMN; j++){
                board[i][j] = id;
                id ++;

                //draw the spaces
                ctx.strokeStyle = "#000";
                ctx.strokeRect(j*SPACE_SIZE, i*SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);

                // Print the ID and coordinates
                ctx.font = "16px Arial";
                ctx.fillStyle = "black";
                ctx.fillText(`id: ${id} [i, j] =[${i},${j}]`, j * SPACE_SIZE + SPACE_SIZE / 6 , i * SPACE_SIZE + SPACE_SIZE / 2);
            }
        }
    }
    drawBoard();

    // ON PLAYERS CLICK
    canvas.addEventListener("click", function(event){
        //IF ITS GAME OVER EXIT
        if(GAME_OVER) return;

        // X & Y position of mouse click relative to the canvas
        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;

        // CALCULATE i & j of clicked space
        let j = Math.floor(X/SPACE_SIZE);
        let i = Math.floor(Y/SPACE_SIZE);

        // Get the id of the space the player clicked on
        let id = board[i][j];
        
        //Prevent the player to play the same space twice
        if(gameData[id]) return;

        // store the players move to gameData
        gameData[id] = currentPlayer;
        console.log(gameData);
        
        //draw the move on the board
        drawOnBoard(currentPlayer,i,j);

        // Check if the player wins
        if(isWinner(gameData,currentPlayer)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return;
        }

        // Check if its a tie game
        if(isTie(gameData)){
            showGameOver("tie");
            GAME_OVER = true;
            return;
        }
        if(OPPONENT == "computer"){
             // Get the id of the space the player clicked on
            let id = minimax(gameData,player.computer).id;

            // store the players move to gameData
            gameData[id] = player.computer;
            console.log(gameData);
            
            // Get i,j of the space
            let space = getIJ(id);

            //draw the move on the board
            drawOnBoard(player.computer,space.i,space.j);

            // Check if the computer wins
            if(isWinner(gameData,player.computer)){
                showGameOver(player.computer);
                GAME_OVER = true;
                return;
            }

            // Check if its a tie game
            if(isTie(gameData)){
                showGameOver("tie");
                GAME_OVER = true;
                return;
            }
        }
        else{
            //GIVE TURN TO THE OTHER PLAYER
            currentPlayer = currentPlayer == player.man ? player.friend : player.man;
        };
    });

    //minimax
    function minimax(gameData, PLAYER){
        //base
        if(isWinner(gameData,player.computer)) return {evaluation: +10};
        if(isWinner(gameData,player.man)) return {evaluation: -10};
        if(isTie(gameData)) return {evaluation: 0};
        
        //look for empty spaces
        let EMPTY = getEmptySpaces(gameData);

        //save the moves and their evualuation
        let moves = [];

        //loop over the empty spaces for their evaluations
        for(let i=0;i<EMPTY.length;i++){
            let id = EMPTY[i];

            //backup the space
            let backup = gameData[id];

            //make the move for the player
            gameData[id] = PLAYER;

            //save the move's id and evaluation
            let move = {};
            move.id = id;
            //the move evaluation
            if(PLAYER==player.computer){
                move.evaluation = minimax(gameData,player.man).evaluation;
            }
            else{
                move.evaluation = minimax(gameData,player.computer).evaluation;
            }
            
            //restore the move
            gameData[id] = backup;

            //add the move to the moves array
            moves.push(move);
        }

        // minimax algorithm
        let bestMove;

        if(PLAYER==player.computer){
            //maximizer
            let bestEvaluation = -Infinity;
            for(let i=0; i<moves.length;i++){
                if(moves[i].evaluation > bestEvaluation){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                }
            }
        }
        else{
            //maximizer
            let bestEvaluation = +Infinity;
            for(let i=0; i<moves.length;i++){
                if(moves[i].evaluation < bestEvaluation){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                }
            }
        }
        return bestMove;
    }

    // get empty spaces 
    function getEmptySpaces(gameData){
        let EMPTY = [];
        for(let id=0; id<gameData.length;id++){
            if(!gameData[id]) EMPTY.push(id);
        }
        return EMPTY;
    }

    //get i,j from id
    function getIJ(id){
        return {i:Math.floor(id/3), j:id%3}
    }

    // check for winner
    function isWinner(gameData, player){
        for(let i=0; i<COMBOS.length; i++){
            let won = true;
            for(let j=0; j<COMBOS[i].length; j++){
                won = gameData[COMBOS[i][j]] == player && won;
            }
            if(won){
                return true;
            }
        }
        return false;
    }

    //Check for a tie game
    function isTie(gameData){
        let isBoardFill = true;
        for(let i=0; i<gameData.length; i++){
            isBoardFill = gameData[i] && isBoardFill;
            if(!isBoardFill){
                return false;
            }
        }
        return true;
    }

    //SHOW GAME OVER
    function showGameOver(player){
        let message = player == "tie" ? "Oops No Winner" : "The Winner is";
        let imgSrc = `img/${player}.png`;

        gameOverElement.innerHTML = `
        <h1>${message}</h1>
        <img class="winner-img" src=${imgSrc}></img>
        <div class="play" onclick="location.reload()">Play Again!</div>
        `;
        gameOverElement.classList.remove("hide");

    }
    // draw on board
    function drawOnBoard(player, i, j){
        let img = player=="X" ? xImage : oImage;

        // the x,y position of the image are the x,y of the clicked space
        ctx.drawImage(img, j*SPACE_SIZE, i*SPACE_SIZE);

    }
};