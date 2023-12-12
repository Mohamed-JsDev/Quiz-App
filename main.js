let countSpan = document.querySelector(" .quiz-app .count span ");
let Bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets  .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answerArea = document.querySelector(".quiz-app .answer-area");
let submitButton = document.querySelector(".submit-button");
let resultContainer = document.querySelector(" .results");
let countDownElement = document.querySelector(" .countdown");
let currentIndex = 0;
let rightAnswer = 0;
let countInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      createBullets(qCount);
      addQuestionData(questionsObject[currentIndex], qCount);
      countdown(150, qCount);
      submitButton.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);
        quizArea.innerHTML = " ";
        answerArea.innerHTML = " ";
        addQuestionData(questionsObject[currentIndex], qCount);
        handleBullets();
        clearInterval(countInterval);
        countdown(150, qCount);

        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();
function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answerArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChooseAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChooseAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChooseAnswer) {
    rightAnswer++;
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea + answerArea + submitButton + Bullets.remove();
    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class ="good"> good</span> , ${rightAnswer}  from  ${count} is good.`;
    } else if (rightAnswer === count) {
      theResults = `<span class ="prefect"> prefect </span>, all answer is true.`;
    } else {
      theResults = `<span class ="bad"> bad</span>, ${rightAnswer}  from  ${count} is bad.`;
    }
    resultContainer.innerHTML = theResults;
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countInterval);
        console.log("finished");
        submitButton.click();
      }
    }, 500);
  }
}
