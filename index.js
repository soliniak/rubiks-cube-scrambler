const mixedMoves = document.querySelector("#mixedMoves")
const scrambleBtn = document.querySelector("#scramble")
const scrambleLengthSelect = document.querySelector("#moves")
const cubeSizeSelect = document.querySelector("#cube")

let cubeRotation = false
let scrambleLength = 25
let cubeSize = 3;

scrambleLengthSelect.addEventListener("change", () => {
      scrambleLength = scrambleLengthSelect.value
})
cubeSizeSelect.addEventListener("change", () => {
      cubeSize = cubeSizeSelect.value
})

const getRandomSlice = () => Math.floor(Math.random() * (Math.floor(cubeSize/2)-1) + 2)

// 2x2x2 && 3x3x3
const scrambleFace = () => {
      const moves = ["F", "B", "R", "L", "U", "D", "F'", "B'", "R'", "L'", "U'", "D'", "F2", "B2", "R2", "L2", "U2", "D2"]
      return moves[Math.floor(Math.random() * moves.length)]
}

// bigger than 3x3x3
// nFw - n is the total number of slices to move, which must be in the range 1 < n < N (where N is the number of layers in the puzzle).
const scrambleBlock = () => {
      const moves = ["nFw", "nBw", "nRw", "nLw", "nUw", "nDw", "nFw'", "nBw'", "nRw'", "nLw'", "nUw'", "nDw'", "nFw2", "nBw2", "nRw2", "nLw2", "nUw2", "nDw2"]
      return moves[Math.floor(Math.random() * moves.length)].replace("n", cubeSize > 5 ? getRandomSlice() : 2)
}

// 3d rotation of cube
const rotatePuzzle = () => {
      const moves = ["x", "y", "z", "x'", "y'", "z'", "x2", "y2", "z2"]
      return moves[Math.floor(Math.random() * moves.length)]
}

const scramble = (scrambleLength, cubeSize) => {
      const scrambledMoves = []
      for(let i = 0; i < scrambleLength; i++){
            const randomFncs = [scrambleFace()]
            if(cubeSize > 3) {
                  randomFncs.push(scrambleBlock())
            }
            // if(cubeRotation) {
            //       randomFncs.push(rotatePuzzle())
            // }
            scrambledMoves.push(randomFncs[Math.floor(Math.random() * randomFncs.length)])
      }
      return scrambledMoves
}

scrambleBtn.addEventListener("click", () => {
      mixedMoves.innerText = scramble(scrambleLength, cubeSize).join(", ")
})


// timer

const timerContainer = document.querySelector("#timer")
const resetTimer = document.querySelector("#reset")

const timer = {
      ms: 0,
      s: 0,
      m: 0,
      h: 0,
      interval: undefined,
      start: () => {
            if(!timer.interval) {
                  timer.interval = setInterval(() => { timer.count() }, 10)
            }
      },
      stop: () => {
            if(timer.interval) {
                  clearInterval(timer.interval)
                  timer.interval = undefined;
            }
      },
      reset: () => {
            timer.ms = 0
            timer.s = 0
            timer.m = 0
            timer.h = 0
            timer.stop()
            timer.display()
      },
      count: () => {
            timer.ms++
            if(timer.ms > 99) {
                  timer.ms = 0
                  timer.s++
            }
            if(timer.s > 59) {
                  timer.s = 0
                  timer.m++
            }
            if(timer.m > 59) {
                  timer.m = 0
                  timer.h++
            }
            timer.display()
      },
      display: () => {
            timerContainer.innerHTML = `<span class=${timer.h ? '' : 'idle'}>${timer.h.toString().padStart(2, "0")}:</span><span class=${timer.m ? '' : 'idle'}>${timer.m.toString().padStart(2, "0")}:</span><span class=${timer.s ? '' : 'idle'}>${timer.s.toString().padStart(2, "0")}:</span>${timer.ms.toString().padStart(3, "0")}`
      }
}

resetTimer.addEventListener("click", () => {
      timer.reset()
})

scrambleBtn.addEventListener("click", () => {
      timer.reset()
})

window.addEventListener("keydown", e => {
      e.preventDefault()
      if(e.keyCode === 32) {
            timer.interval ? timer.stop() : timer.start()
      }
})

timer.display()