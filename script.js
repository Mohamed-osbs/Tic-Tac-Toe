let b = [...Array(9).fill("")];
let p = "X";
let on = true;
let mode = "multi";
let sc = {
  X: 0,
  O: 0,
  D: 0
};
const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];
function minimax(board, isMax){

  const w = getWinner(board);

  if(w === "O") return 10;

  if(w === "X") return -10;

  if(!board.includes("")) return 0;

  let best = isMax ? -99 : 99;

  board.forEach((_, i) => {

    if(board[i] === ""){

      board[i] = isMax ? "O" : "X";

      const value = minimax(board, !isMax);

      board[i] = "";

      best = isMax
        ? Math.max(best, value)
        : Math.min(best, value);
    }
  });

  return best;
}
function bestMove(){

  let best = -99;

  let idx = 0;

  b.forEach((_, i) => {

    if(b[i] === ""){

      b[i] = "O";

      const value = minimax(b, false);

      b[i] = "";

      if(value > best){

        best = value;

        idx = i;
      }
    }
  });

  return idx;
}
function getWinner(board){

  for(const [a,c,e] of wins){

    if(
      board[a] &&
      board[a] === board[c] &&
      board[a] === board[e]
    ){
      return board[a];
    }
  }

  return null;
}
function render(){
  const el = document.getElementById("board");

  el.innerHTML = "";

  b.forEach((v, i) => {

    const d = document.createElement("div");

    d.className = "cell";

    if(v){
      d.classList.add(v.toLowerCase());
    }

    d.textContent = v;

    d.onclick = () => move(i);

    el.appendChild(d);
  });
  const w = getWinner(b);

  if(w){

    wins.forEach(([a,c,e]) => {

      if(
        b[a] &&
        b[a] === b[c] &&
        b[a] === b[e]
      ){

        [a,c,e].forEach(i => {
          el.children[i].classList.add("win");
        });
      }
    });
  }
}
function move(i){

  if(!on || b[i]) return;

  b[i] = p;

  render();

  if(checkEnd()) return;

  p = p === "X" ? "O" : "X";
  document.getElementById("status")
    .textContent = `دور اللاعب ${p}`;
  if(mode === "ai" && p === "O"){
    setTimeout(aiTurn, 400);
  }
}
function aiTurn(){

  b[bestMove()] = "O";
  render();
  if(checkEnd()) return;
  p = "X";
  document.getElementById("status")
    .textContent = "دور اللاعب X";
}
function checkEnd(){

  const w = getWinner(b);

  if(w){

    on = false;

    sc[w]++;

    updateScores();

    document.getElementById("status")
      .textContent = `اللاعب ${w} فاز!`;

    return true;
  }
  if(!b.includes("")){

    on = false;

    sc.D++;

    updateScores();

    document.getElementById("status")
      .textContent = "تعادل!";

    return true;
  }
  return false;
}
function updateScores(){
  document.getElementById("sx").textContent = sc.X;
  document.getElementById("so").textContent = sc.O;
  document.getElementById("sd").textContent = sc.D;
}
function restart(){

  b = [...Array(9).fill("")];

  p = "X";

  on = true;

  document.getElementById("status")
    .textContent = "دور اللاعب X";

  render();
}
function resetScores(){

  sc = {
    X:0,
    O:0,
    D:0
  };

  updateScores();
}
function setMode(m){

  mode = m;

  document.getElementById("m2")
    .classList.toggle("active", m === "multi");

  document.getElementById("mai")
    .classList.toggle("active", m === "ai");

  restart();
}
restart();