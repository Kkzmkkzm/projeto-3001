//-------------------- ENTRADA NA PLATAFORMA --------------------

const introBox = document.getElementById("intro-box");

function enterGame(){

    introBox.style.opacity = "0";

    setTimeout(()=>{
        introBox.style.display = "none";
        startBox.classList.remove("hidden");
    },600);
}


// ------------------ CONFIG ------------------

const QUESTIONS_PER_PLAYER = 10;
const QUESTION_TIME = 10;


// ------------------ VARIÁVEIS ------------------

let players = [];
let currentPlayerIndex = 0;
let currentQuestion = 0;
let selectedQuestions = [];

let timer = null;
let timeLeft = QUESTION_TIME;
let locked = false;

// ------------------ PERGUNTAS ------------------

const questions = [
{ question:"Qual molécula carrega a informação genética?", answers:["RNA","Proteína","DNA","Lipídio"], correct:2 },
{ question:"Quem é o pai da genética?", answers:["Darwin","Mendel","Pasteur","Newton"], correct:1 },
{ question:"Quantos cromossomos possui o ser humano?", answers:["23","46","44","48"], correct:1 },
{ question:"Fenótipo significa:", answers:["DNA","Características observáveis","Gene recessivo","Célula"], correct:1 },
{ question:"Genótipo é:", answers:["Aparência externa","Conjunto de genes","Proteína","Cromossomo X"], correct:1 },
{ question:"Onde o DNA fica armazenado?", answers:["Citoplasma","Ribossomo","Núcleo","Membrana"], correct:2 },
{ question:"A divisão celular que forma gametas é:", answers:["Mitose","Bipartição","Meiose","Clonagem"], correct:2 },
{ question:"Mitose produz:", answers:["4 células","2 células idênticas","Gametas","Mutação"], correct:1 },
{ question:"Qual base NÃO existe no DNA?", answers:["Adenina","Uracila","Timina","Citosina"], correct:1 },
{ question:"O RNA possui qual açúcar?", answers:["Desoxirribose","Glicose","Ribose","Frutose"], correct:2 },
{ question:"Alelos são:", answers:["Tipos de células","Formas alternativas de um gene","Proteínas","Enzimas"], correct:1 },
{ question:"Dominante significa:", answers:["Sempre invisível","Só aparece com dois genes","Se expressa com um gene","Não se expressa"], correct:2 },
{ question:"Gregor Mendel estudou:", answers:["Moscas","Ervilhas","Bactérias","Peixes"], correct:1 },
{ question:"DNA é formado por:", answers:["Açúcar + fosfato + base","Proteínas","Lipídios","Vitaminas"], correct:0 },
{ question:"Mutação é:", answers:["Mudança no DNA","Divisão celular","Cópia perfeita","Respiração celular"], correct:0 },
{ question:"Cromossomos são feitos de:", answers:["Lipídios","DNA e proteínas","Água","RNA"], correct:1 },
{ question:"Hereditariedade é:", answers:["Respiração","Transmissão de características","Digestão","Fotossíntese"], correct:1 },
{ question:"Qual tecnologia analisa DNA em computadores?", answers:["Botânica","Bioinformática","Ecologia","Embriologia"], correct:1 },
{ question:"Clonagem produz:", answers:["Organismos idênticos","Mutantes","Células diferentes","Gametas"], correct:0 },
{ question:"A estrutura do DNA é:", answers:["Linha reta","Tripla hélice","Dupla hélice","Círculo simples"], correct:2 },
{ question:"O Projeto Genoma Humano mapeou:", answers:["Proteínas","Células","Genes humanos","Vírus"], correct:2 },
{ question:"PCR é usada para:", answers:["Clonar animais","Amplificar DNA","Dividir células","Criar vacinas"], correct:1 },
{ question:"Gene recessivo aparece quando:", answers:["1 cópia","2 cópias","Nunca","Sempre"], correct:1 },
{ question:"Síndrome de Down envolve:", answers:["Trissomia 21","Monossomia X","Mutação mitocondrial","Ausência de DNA"], correct:0 },
{ question:"Biotecnologia é:", answers:["Uso da biologia com tecnologia","Estudo de plantas","Astronomia","Física nuclear"], correct:0 },
{ question:"Transgênico significa:", answers:["Natural","Sem DNA","Gene alterado artificialmente","Orgânico"], correct:2 },
{ question:"Células somáticas são:", answers:["Reprodutivas","Do corpo","Bactérias","Vírus"], correct:1 },
{ question:"O sangue transporta:", answers:["Oxigênio","Genes","DNA inteiro","Hormônios apenas"], correct:0 },
{ question:"Qual equipamento amplia células?", answers:["Telescópio","Microscópio","Sensor térmico","Barômetro"], correct:1 }
];
// ------------------ ELEMENTOS ------------------

const startBox = document.getElementById("start-box");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");

const playerTurn = document.getElementById("player-turn");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const rankingEl = document.getElementById("ranking");
const barFill = document.getElementById("bar-fill");


// ------------------ UTIL ------------------

function shuffle(array){
    return [...array].sort(()=> Math.random() - 0.5);
}

function pickQuestions(){
    selectedQuestions = shuffle(questions).slice(0, QUESTIONS_PER_PLAYER);
}

function stopTimer(){
    clearInterval(timer);
    timer = null;
}


// ------------------ INICIAR ------------------

function startGame(){

    rankingEl.innerHTML = "";

    const p1 = document.getElementById("p1").value || "Jogador 1";
    const p2 = document.getElementById("p2").value || "Jogador 2";
    const p3 = document.getElementById("p3").value || "Jogador 3";

    players = [
        { name:p1, score:0 },
        { name:p2, score:0 },
        { name:p3, score:0 }
    ];

    startBox.classList.add("hidden");
    quizBox.classList.remove("hidden");

    currentPlayerIndex = 0;
    currentQuestion = 0;

    pickQuestions();
    loadQuestion();
}


// ------------------ TIMER (CORRIGIDO) ------------------

function startTimer(){

    stopTimer(); // 🔴 evita múltiplos intervals

    timeLeft = QUESTION_TIME;
    timerEl.textContent = `⏳ ${timeLeft}s`;

    timer = setInterval(()=>{
        timeLeft--;
        timerEl.textContent = `⏳ ${timeLeft}s`;

        if(timeLeft <= 0){
            stopTimer();
            nextQuestion();
        }
    },1000);
}


// ------------------ PERGUNTA ------------------

function loadQuestion(){

    locked = false;

    if(currentQuestion >= selectedQuestions.length){
        nextPlayer();
        return;
    }

    const q = selectedQuestions[currentQuestion];

    playerTurn.textContent = `🧑‍🎓 Vez de: ${players[currentPlayerIndex].name}`;
    questionEl.textContent = q.question;

    answersEl.innerHTML = "";

    progressEl.textContent = `Pergunta ${currentQuestion+1}/${QUESTIONS_PER_PLAYER}`;

    // progresso mais correto
    barFill.style.width = ((currentQuestion+1)/QUESTIONS_PER_PLAYER)*100 + "%";

    q.answers.forEach((ans,i)=>{
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.onclick = ()=> selectAnswer(i, btn);
        answersEl.appendChild(btn);
    });

    startTimer();
}


// ------------------ RESPOSTA ------------------

function selectAnswer(index, btn){

    if(locked) return; // 🔴 bloqueia clique duplo
    locked = true;

    stopTimer();

    const correct = selectedQuestions[currentQuestion].correct;

    [...answersEl.children].forEach(b=> b.disabled = true);

    if(index === correct){
        btn.classList.add("correct");
        players[currentPlayerIndex].score++;
    }else{
        btn.classList.add("wrong");
        answersEl.children[correct].classList.add("correct");
    }

    setTimeout(nextQuestion,1000);
}


// ------------------ FLUXO ------------------

function nextQuestion(){
    currentQuestion++;
    loadQuestion();
}

function nextPlayer(){

    stopTimer();

    currentPlayerIndex++;
    currentQuestion = 0;

    if(currentPlayerIndex < players.length){
        pickQuestions();
        loadQuestion();
    }else{
        finishGame();
    }
}


// ------------------ RANKING ------------------

function finishGame(){

    stopTimer();

    quizBox.classList.add("hidden");
    resultBox.classList.remove("hidden");

    players.sort((a,b)=> b.score - a.score);

    const medals = ["🥇","🥈","🥉"];

    players.forEach((p,i)=>{
        const div = document.createElement("div");
        div.className = "rank-item";
        div.textContent = `${medals[i]} ${p.name} — ${p.score} pontos`;
        rankingEl.appendChild(div);
    });
}
