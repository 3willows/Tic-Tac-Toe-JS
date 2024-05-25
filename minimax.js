import { player } from "./options.js"
import { isWinner, isTie } from "./game.js"

// get empty spaces
function getEmptySpaces(gameData) {
  let EMPTY = []
  for (let id = 0; id < gameData.length; id++) {
    if (gameData[id] === null) EMPTY.push(id)
  }
  return EMPTY
}

export function minimax(gameData, PLAYER) {
  //base
  if (isWinner(gameData, player.computer)) return { evaluation: +10 }
  if (isWinner(gameData, player.man)) return { evaluation: -10 }
  if (isTie(gameData)) return { evaluation: 0 }

  //get all indices of empty spaces
  let EMPTY = getEmptySpaces(gameData)

  //save the moves and their evualuation
  let moves = []

  //loop over the empty spaces for their evaluations
  for (let i = 0; i < EMPTY.length; i++) {
    let id = EMPTY[i]

    //backup the space
    let backup = gameData[id]

    //make the move for the player
    gameData[id] = PLAYER

    //save the move's id and evaluation
    let move = {}
    move.id = id
    //the move evaluation
    if (PLAYER === player.computer) {
      move.evaluation = minimax(gameData, player.man).evaluation
    } else {
      move.evaluation = minimax(gameData, player.computer).evaluation
    }

    //restore the move
    gameData[id] = backup

    //add the move to the moves array
    moves.push(move)
  }

  return minimaxCore(PLAYER, moves)
}

function minimaxCore(PLAYER, moves){
   let bestMove

   if (PLAYER === player.computer) {
     //maximizer
     let bestEvaluation = -Infinity
     for (let i = 0; i < moves.length; i++) {
       if (moves[i].evaluation > bestEvaluation) {
         bestEvaluation = moves[i].evaluation
         bestMove = moves[i]
       }
     }
   } else {
     //minimizer?
     let bestEvaluation = +Infinity
     for (let i = 0; i < moves.length; i++) {
       if (moves[i].evaluation < bestEvaluation) {
         bestEvaluation = moves[i].evaluation
         bestMove = moves[i]
       }
     }
   }
   return bestMove
}