var startButton = document.querySelector("#start-button");
var submitButton = document.querySelector("#submit-button");
var choiceButton = document.querySelector("#choice-button");
var highScoreButton = document.querySelector("#highscore-button");
var choiceContainer = document.querySelector("#choice-container");
var quizQEl = document.querySelector("#quiz-question");
var initialsEl = document.querySelector("#initials");
var largeFont = document.querySelector("#large-font");
var scoreEl = document.querySelector("#score");
var timerEl = document.querySelector("#timer");
var bodyEl = document.querySelector('body');
var olEl = document.querySelector('ol');
//Questions in the quiz

const questions = [
    {
        question: 'How can a datatype be declared to be a constant type?',
        choices: {
            a: 'const', 
            b: 'var',
            c: 'let',
            d: 'constant'
        },
        correctAnswer: 'a'
    },
    {
        question: 'Which function is used to serialize an object into a JSON string in Javascript?',
        choices: {
            a: 'stringify()',
            b: 'parse()', 
            c: 'convert()',
            d: 'None of the above'
        },
        correctAnswer: 'a'
    },
    {
        question: 'How do we write a comment in Javascript?',
        choices: {
            a: '/*',
            b: '//', 
            c: '#',
            d: '<!--' 
        },
        correctAnswer: 'b'
    },
    {
        question: 'Which of the following tags is used to create a combo box (or drop-down box)?',
        choices: {
            a: '<list>',
            b: '<select>',
            c: '<input type = "dropdown">',
            d: '<ul>'
        },
        correctAnswer: 'b'
    },
    {
        question: 'Which of the following is not a value of the font-variant property in CSS?',
        choices: {
            a: 'normal', 
            b: 'small-caps',
            c: 'large-caps', 
            d: 'inherit', 
        },
        correctAnswer: 'c'
    }   
]

var qIndex, timeLeft, timeLength;
var topScores = JSON.parse(localStorage.getItem("score")) || [];

function startQuiz() {
    qIndex = 0;
    timeLeft = 45;
    timerEl.textContent = `Time remaining: ${timeLeft || 45}`;
    initialsEl.value = '';
    startButton.classList.add('hidden');
    highScoreButton.classList.add('hidden');
    scoreEl.classList.add('hidden');
    choiceContainer.classList.remove('hidden');
    document.querySelector('#quiz-content').classList.remove('hidden');
    timeCount();
    nextQuestion();
}

function submitScore(x) {
    x.preventDefault();

    topScores = [...topScores, {
        initials: initialsEl.value,
        score: timeLeft,
    }];

    if(initialsEl.value.trim().length !=0) {
        alert("Thanks for playing!");
        localStorage.setItem("score", JSON.stringify(topScores));
    } else {
        alert("Please leave your initials")
        return 
    }
}

function timeCount() {
    timeLength = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time remaining: ${timeLeft} s`;
        
        if (timeLeft <= 0) {
            showScore();
            clearInterval(timeLength);
            timerEl.textContent = `Time's up!`;
        }
    }, 1000);
}


function renderQuestions(question) {
    if (questions.length >= qIndex + 1) {
        quizQEl.textContent = question.question;
        console.log(questions[qIndex].choices);

        Object.keys(questions[qIndex].choices).forEach(key => {
            const choiceButton = document.createElement('button');
            choiceButton.setAttribute("data-value",key);
            choiceButton.textContent = questions[qIndex].choices[key];
            choiceButton.addEventListener('click', chooseAnswer);
            choiceContainer.appendChild(choiceButton);
        });
    }
}

function nextQuestion() {
    choiceContainer.innerHTML = '';
    renderQuestions(questions[qIndex]);
}

function chooseAnswer(x) {
    var chosenAnswer = x.target.getAttribute("data-value");
    console.log("Answer".chosenAnswer);

    if (chosenAnswer != questions.correctAnswer) {
        timeLeft -= 10;
    }

    if (questions.length <= qIndex + 1) {
        clearInterval(timeLength);
        showScore();
    }

    qIndex++;
    nextQuestion();
}

function showScore() {
    largeFont.textContent = 'Results';
    startButton.textContent = 'Restart';
    choiceContainer.classList.add('hidden');
    startButton.classList.remove('hidden');
    highScoreButton.classList.remove('hidden');
    scoreEl.classList.remove('hidden');
    if (timeLeft <= 0) {
        quizQEl.textContent = `Your Score: 0`;
    } else {
        quizQEl.textContent = `Your Score: ${timeLeft}`;
    }
}

function scoreList() {
    var sortedScore = topScores.sort((x,y) => y.score - x.score)

    sortedScore.forEach(item => {
        var liEl = document.createElement("li");
        liEl.textContent = `${item.initials}: ${item.score}`;
        olEl.appendChild(liEl);
    });
}


if (startButton) {
    startButton.addEventListener('click', startQuiz);
}

if (submitButton) {
    submitButton.addEventListener('click', submitScore);
}

if (highScoreButton) {
    highScoreButton.addEventListener('click', scoreList);
}