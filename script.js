const gridSize = 14;
const words = [
  "Angola", "Luta", "Paz", "Mpla", "Guerra",
  "Unita", "Lisboa", "Colonia", "Livre", "1975"
];
const grid = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => "")
);

const directions = [
  { x: 1, y: 0 }, // horizontal
  { x: 0, y: 1 }, // vertical
];

function placeWords() {
  for (const word of words) {
    let placed = false;
    while (!placed) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const x = Math.floor(Math.random() * (gridSize - (dir.x ? word.length : 0)));
      const y = Math.floor(Math.random() * (gridSize - (dir.y ? word.length : 0)));
      let canPlace = true;

      for (let i = 0; i < word.length; i++) {
        const cx = x + i * dir.x;
        const cy = y + i * dir.y;
        if (grid[cy][cx] && grid[cy][cx] !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const cx = x + i * dir.x;
          const cy = y + i * dir.y;
          grid[cy][cx] = word[i];
        }
        placed = true;
      }
    }
  }
}

function fillEmptyCells() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!grid[y][x]) {
        grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function renderGrid() {
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[y][x];
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener("click", handleCellClick);
      gridEl.appendChild(cell);
    }
  }
}

let selectedCells = [];

function handleCellClick(e) {
  const cell = e.target;

  if (cell.classList.contains("found")) return;

  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    selectedCells = selectedCells.filter(c => c !== cell);
  } else {
    cell.classList.add("selected");
    selectedCells.push(cell);
  }

  checkSelectedWord();
}

function checkSelectedWord() {
  const word = selectedCells.map(c => c.textContent).join("").toLowerCase();
  const reversed = word.split("").reverse().join("");

  if (words.includes(word) || words.includes(reversed)) {
    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("found");
    });

    markWordFound(word);
    selectedCells = [];
  }
}

function markWordFound(word) {
  const wordList = document.querySelectorAll("#words li");
  wordList.forEach(item => {
    if (item.textContent === word || item.textContent === word.split("").reverse().join("")) {
      item.classList.add("found-word");
    }
  });
}

function renderWordList() {
  const list = document.getElementById("words");
  list.innerHTML = "";
  for (const word of words) {
    const li = document.createElement("li");
    li.textContent = word;
    list.appendChild(li);
  }
}

placeWords();
fillEmptyCells();
renderGrid();
renderWordList();
