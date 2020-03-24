const mixedMoves = document.querySelector('#mixedMoves');
const scrambleBtn = document.querySelector('#scramble');
const scrambleLengthSelect = document.querySelector('#moves');
const cubeSizeSelect = document.querySelector('#cube');

// const cubeRotation = false;
let scrambleLength = 25; // var from input
let cubeSize = cubeSizeSelect.value; // var from input
// let scrambleWithSpace = false;
const sort = 'desc'; // var from input
const maxRecordsOnPage = 10; // var from input

scrambleLengthSelect.addEventListener('change', () => {
  scrambleLength = scrambleLengthSelect.value;
});

const getRandomSlice = () => Math.floor(Math.random() * (Math.floor(cubeSize / 2) - 1) + 2);

// 2x2x2 && 3x3x3
const scrambleFace = () => {
  const moves = [
    'F',
    'B',
    'R',
    'L',
    'U',
    'D',
    "F'",
    "B'",
    "R'",
    "L'",
    "U'",
    "D'",
    'F2',
    'B2',
    'R2',
    'L2',
    'U2',
    'D2',
  ];
  return moves[Math.floor(Math.random() * moves.length)];
};

// bigger than 3x3x3
// nFw - n is the total number of slices to move,
// which must be in the range 1 < n < N (where N is the number of layers in the puzzle).
const scrambleBlock = () => {
  const moves = [
    'nFw',
    'nBw',
    'nRw',
    'nLw',
    'nUw',
    'nDw',
    "nFw'",
    "nBw'",
    "nRw'",
    "nLw'",
    "nUw'",
    "nDw'",
    'nFw2',
    'nBw2',
    'nRw2',
    'nLw2',
    'nUw2',
    'nDw2',
  ];
  return moves[Math.floor(Math.random() * moves.length)].replace(
    'n',
    cubeSize > 5 ? getRandomSlice() : 2,
  );
};

// 3d rotation of cube
// const rotatePuzzle = () => {
//   const moves = ['x', 'y', 'z', 'x\'', 'y\'', 'z\'', 'x2', 'y2', 'z2'];
//   return moves[Math.floor(Math.random() * moves.length)];
// };

const scramble = (scrambleLengthVar, cubeSizeVar) => {
  const scrambledMoves = [];
  for (let i = 0; i < scrambleLengthVar; i += 1) {
    const randomFncs = [scrambleFace()];
    if (cubeSizeVar > 3) {
      randomFncs.push(scrambleBlock());
    }
    // if(cubeRotation) {
    //       randomFncs.push(rotatePuzzle())
    // }
    scrambledMoves.push(
      randomFncs[Math.floor(Math.random() * randomFncs.length)],
    );
  }
  return scrambledMoves;
};

const generateScramble = () => {
  mixedMoves.innerText = scramble(scrambleLength, cubeSize).join(', ');
};

generateScramble();


// LOCAL STORAGE
const recordsContainer = document.querySelector('.records__container');

const convertCubeSize = (sizeCube) => {
  const sizes = {
    2: '2x2',
    3: '3x3x3',
    4: '4x4x4',
    5: '5x5x5',
    6: '6x6x6',
    7: '7x7x7',
    8: '8x8x8',
    9: '9x9x9',
  };

  return sizes[sizeCube];
};

const displayRecords = (cubeSizeVar, sortVar, sizeVar) => {
  const getRecords = () => {
    const records = [];
    for (let i = 0; i <= localStorage.length - 1; i += 1) {
      if (localStorage.key(i).includes('scrambleSeq')) {
        records.push(
          JSON.parse(localStorage.getItem(localStorage.key(i))),
        );
      }
    }
    return records;
  };

  const recordsTemplate = (record, index) => `
    <div class='record'>
    <span class='index'>${index + 1}</span>
    <span class='record'>${record.timeT}</span>
    <button class='delete__record btn' data-id='${record.id}'> delete </button>
    <button class='case__scramble btn'> preview this scramble </button>
    <span class='past__scramble'> ${record.scramble} </span></div>
  `;

  recordsContainer.innerHTML = `<h2 class='cube__size'>${convertCubeSize(cubeSize)}</h2>`;

  const Records = getRecords();
  Records
    .filter((record) => Number(record.cubeSize) === Number(cubeSizeVar))
    .sort((a, b) => (sortVar === 'desc' ? Number(a.timeMS) - Number(b.timeMS) : Number(b.timeMS) - Number(a.timeMS)))
    .filter((record, index) => index < sizeVar)
    .forEach((record, index) => {
      recordsContainer.innerHTML += recordsTemplate(record, index);
    });


  const deleteRecordBtns = document.querySelectorAll('.delete__record');
  deleteRecordBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      localStorage.removeItem(e.target.dataset.id);
      displayRecords(cubeSize, sort, maxRecordsOnPage);
    });
  });

  const previewScrambleBtns = document.querySelectorAll('.case__scramble');
  previewScrambleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.target.nextElementSibling.classList.toggle('show');
    });
  });
};

const setStorage = (scrambleSequence, time, cubeSizeVar, msMax) => {
  const id = `scrambleSeq${Math.floor(Math.random() * 1000000000000)}`;

  const dataObj = {
    id,
    timeMS: msMax,
    timeT: time,
    cubeSize: cubeSizeVar,
    scramble: scrambleSequence,
  };

  const scrambleData = JSON.stringify(dataObj);

  window.localStorage.setItem(id, scrambleData);
};

// Stoper

const stoperContainer = document.querySelector('#stoper');
const resetStoper = document.querySelector('#reset');

const stoper = {
  msmax: 0,
  ms: 0,
  s: 0,
  m: 0,
  h: 0,
  interval: undefined,
  state: 'stop',
  start: () => {
    if (!stoper.interval) {
      stoper.interval = setInterval(() => {
        stoper.count();
      }, 10);
    }
  },
  stop: () => {
    if (stoper.interval) {
      clearInterval(stoper.interval);
      stoper.interval = undefined;
    }
  },
  reset: () => {
    stoper.msmax = 0;
    stoper.ms = 0;
    stoper.s = 0;
    stoper.m = 0;
    stoper.h = 0;
    stoper.stop();
    stoper.display();
  },
  count: () => {
    stoper.ms += 1;
    stoper.msmax += 1;
    if (stoper.ms > 99) {
      stoper.ms = 0;
      stoper.s += 1;
    }
    if (stoper.s > 59) {
      stoper.s = 0;
      stoper.m += 1;
    }
    if (stoper.m > 59) {
      stoper.m = 0;
      stoper.h += 1;
    }
    stoper.display();
  },
  display: () => {
    const formatTime = {
      // wrap active/idle element of time with wrapperStart
      // and close with wrapperEnd
      // (recommended not to do so with ms because it goes willy willy fast)
      wrapper: true,
      wrapperStart: (wrapMe) => `<span class='${Number(wrapMe) ? '' : 'idle'}'>`,
      wrapperEnd: '</span>',
      separator: ':',
      format: (time, separator) => (formatTime.wrapper
        ? formatTime.wrapperStart(time)
          + time
          + separator
          + formatTime.wrapperEnd
        : time + separator),
      // seconds, minutes, hours formatted - max to 2 digits followed with '0'
      smhFormat: (time) => time.toString().padStart(2, '0'),
      // miliseconds max to 3 digits followed with '0'
      msFormat: (time) => time.toString().padStart(3, '0'),
      get H() {
        return this.format(this.smhFormat(stoper.h), this.separator);
      },
      get M() {
        return this.format(this.smhFormat(stoper.m), this.separator);
      },
      get S() {
        return this.format(this.smhFormat(stoper.s), this.separator);
      },
      get MS() {
        return this.msFormat(stoper.ms);
      },
      get display() {
        return this.H + this.M + this.S + this.MS;
      },
    };

    stoperContainer.innerHTML = formatTime.display;
  },
  listener: () => window.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      if (stoper.state === 'start') {
        stoper.stop();
        stoper.state = 'paused';
        setStorage(
          mixedMoves.innerText,
          stoperContainer.innerText,
          cubeSize,
          stoper.msmax,
        );
        displayRecords(cubeSize, sort, maxRecordsOnPage);
      } else if (stoper.state === 'paused') {
        stoper.reset();
        generateScramble();
        stoper.state = 'stop';
      } else if (stoper.state === 'stop') {
        stoper.start();
        stoper.state = 'start';
      }
    }
  }),
  init: () => {
    stoper.listener();
    stoper.display();
  },
};

stoper.init();

resetStoper.addEventListener('click', () => {
  stoper.reset();
});

scrambleBtn.addEventListener('click', () => {
  stoper.reset();
});

scrambleBtn.addEventListener('click', () => {
  generateScramble();
  stoper.state = 'stop';
});

cubeSizeSelect.addEventListener('change', () => {
  cubeSize = cubeSizeSelect.value;
  displayRecords(cubeSize, sort, maxRecordsOnPage);
});

displayRecords(cubeSize, sort, maxRecordsOnPage);
