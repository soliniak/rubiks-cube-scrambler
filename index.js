const mixedMoves = document.querySelector("#mixedMoves")
const scrambleBtn = document.querySelector("#scramble")
const scrambleLengthSelect = document.querySelector("#moves")
const cubeSizeSelect = document.querySelector("#cube")

let cubeRotation = false
let scrambleLength = 25
let cubeSize = 3
let scrambleWithSpace = false
let sort = 'desc'
const maxRecordsOnPage = 10

scrambleLengthSelect.addEventListener("change", () => {
      scrambleLength = scrambleLengthSelect.value
})

cubeSizeSelect.addEventListener("change", () => {
      cubeSize = cubeSizeSelect.value
      displayRecords(cubeSize, sort, maxRecordsOnPage)
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

const generateScramble = () => mixedMoves.innerText = scramble(scrambleLength, cubeSize).join(", ")

scrambleBtn.addEventListener("click", () => {
      generateScramble()
      stoper.state = "stop"
})

generateScramble()


// Stoper

const stoperContainer = document.querySelector("#stoper")
const resetStoper = document.querySelector("#reset")

const stoper = {
      msmax: 0,
      ms: 0,
      s: 0,
      m: 0,
      h: 0,
      interval: undefined,
      state: "stop",
      start: () => {
            if(!stoper.interval) {
                  stoper.interval = setInterval(() => { stoper.count() }, 10)
            }
      },
      stop: () => {
            if(stoper.interval) {
                  clearInterval(stoper.interval)
                  stoper.interval = undefined;
            }
      },
      reset: () => {
            stoper.msmax = 0
            stoper.ms = 0
            stoper.s = 0
            stoper.m = 0
            stoper.h = 0
            stoper.stop()
            stoper.display()
           
      },
      count: () => {
            stoper.ms++
            stoper.msmax++
            if(stoper.ms > 99) {
                  stoper.ms = 0
                  stoper.s++
            }
            if(stoper.s > 59) {
                  stoper.s = 0
                  stoper.m++
            }
            if(stoper.m > 59) {
                  stoper.m = 0
                  stoper.h++
            }
            stoper.display()
      },
      display: () => {
            const formatTime = {
                  wrapper: true, // wrap active/idle element of time with wrapperStart and close with wrapperEnd (recommended not to do so with ms because it goes willy willy fast)
                  wrapperStart: (wrapMe) => {
                        return `<span class="${Number(wrapMe) ? '' : 'idle'}">` // set class for active/idle element
                  },
                  wrapperEnd: `</span>`,
                  separator: `:`, // set separator => H(separator)M(separator)S(separator)MS
                  format: (time, separator) => {
                        return (formatTime.wrapper ? formatTime.wrapperStart(time) + time + separator + formatTime.wrapperEnd : time + separator)
                  },
                  smhFormat: (time) => time.toString().padStart(2, "0"), // seconds, minutes, hours formatted - max to 2 digits followed with "0"
                  msFormat: (time) => time.toString().padStart(3, "0"), // miliseconds max to 3 digits followed with "0"
                  get H() { 
                        // return this.allow(stoper.h) ? this.format(this.smhFormat(stoper.h), this.separator) : "00:"
                        return this.format(this.smhFormat(stoper.h), this.separator)
                  },
                  get M() { 
                        // return this.allow(stoper.m) ? this.format(this.smhFormat(stoper.m), this.separator) : "00:"
                        return this.format(this.smhFormat(stoper.m), this.separator)
                  },
                  get S() { 
                        // return this.allow(stoper.s) ? this.format(this.smhFormat(stoper.s), this.separator) : "00:"
                        return this.format(this.smhFormat(stoper.s), this.separator)
                  },
                  get MS() { 
                        return this.msFormat(stoper.ms)
                  },
                  get display() { 
                        return `${this.H}${this.M}${this.S}${this.MS}`
                  }
            }

            stoperContainer.innerHTML = formatTime.display
      },
      listener: () => window.addEventListener("keydown", e => {
            if(e.keyCode === 32) {
                  e.preventDefault()
                  if(stoper.state === "start") {
                        stoper.stop()
                        stoper.state = "paused"
                        setStorage(mixedMoves.innerText, stoperContainer.innerText, cubeSize, stoper.msmax)
                        displayRecords(cubeSize, sort, maxRecordsOnPage)
                  } else if(stoper.state === "paused") {
                        stoper.reset()
                        generateScramble()
                        stoper.state = "stop"
                  } else if(stoper.state === "stop") {
                        stoper.start()
                        stoper.state = "start"
                  }
            }
      }),
      init: () => {
            stoper.listener()
            stoper.display()
      }
}

stoper.init()

resetStoper.addEventListener("click", () => {
      stoper.reset()
})

scrambleBtn.addEventListener("click", () => {
      stoper.reset()
})


// LOCAL STORAGE

const recordsContainer = document.querySelector(".records__container")

const setStorage = (scrambleSequence, time, cubeSizeVar, msMax) => {
      const id = (localStorage.length + 1) * (Math.floor(Math.random() * 1000000000000))
      localStorage.setItem(`scrambleSeq${id}`, JSON.stringify([[msMax], [time], [cubeSizeVar], [scrambleSequence]]))
}


const getRecords = () => {
      const records = []

      for(let i = 0; i <= localStorage.length -1; i++){
            if(localStorage.key(i).includes("scrambleSeq")){
                  records.push([localStorage.key(i), JSON.parse(localStorage.getItem(localStorage.key(i)))])
            }
      }
      // console.log(records)
      return records
}

const deleteRecord = (record) => {
      localStorage.removeItem(record)
      displayRecords(cubeSize, sort, maxRecordsOnPage)
}


const pastScramble = (e) => {
      e = e || window.event
      e.target.nextElementSibling.classList.toggle("show")
}

const displayRecords = (cubeSize, sort, size) => {

      const convertCubeSize = (size) => {
            sizes = {
                  2: "2x2",
                  3: "3x3x3",
                  4: "4x4x4",
                  5: "5x5x5",
                  6: "6x6x6",
                  7: "7x7x7",
                  8: "8x8x8",
                  9: "9x9x9",
            }

            return sizes[size]
      }

      let defaultCubeSize = cubeSize || 2
      let defaultSort = sort || 'desc'
      let defaultSize = size || 10

      const Records = getRecords()
 
      const recordsTemplate = (record, index) => `
            <div class="record">
                  <span class="index">${index + 1}</span>
                  <span class="record">${record[1][1]}</span>
                  <button class="delete__record btn" onclick="deleteRecord('${record[0]}')"> delete </button>
                  <button class="case__scramble btn" onclick="pastScramble()"> pick this scramble </button>
                  <span class="past__scramble"> ${record[1][3]} </span>
            </div>
            `

      recordsContainer.innerHTML = `<h2 class="cube__size">${convertCubeSize(cubeSize)}</h2>`
      Records
            .filter((record) => {
                  return record[1][2] == defaultCubeSize
            })
            .sort((a,b) => {
                  return defaultSort == 'desc' ? a[1][0] - b[1][0] : b[1][0] - a[1][0]
                  // return a[1][0]-b[1][0]
            })
            .filter((record, index) => index < defaultSize)
            .forEach((record, index) => {                  
                  recordsContainer.innerHTML += recordsTemplate(record, index)                  
                  // record + "<br>"
            })
}

displayRecords(cubeSize, sort, maxRecordsOnPage)
