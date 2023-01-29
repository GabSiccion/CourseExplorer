import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, push } from "firebase/database";
import { firebaseConfig } from "./firebaseconfig";

function getSelectedCourse() {
  let parameter = new URLSearchParams(window.location.search);
  return parameter.get("course");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const questionsRef = ref(db, `questions/${getSelectedCourse()}`);
const scoresRef = ref(db, `scores/`);

// Document Elements
const elementnumber = document.getElementById("number");
const elementQuestion = document.getElementById("question");
const elementAButton = document.getElementById("aButton");
elementAButton.addEventListener("click", answerSelected);
const elementBButton = document.getElementById("bButton");
elementBButton.addEventListener("click", answerSelected);
const elementCButton = document.getElementById("cButton");
elementCButton.addEventListener("click", answerSelected);
const elementDButton = document.getElementById("dButton");
elementDButton.addEventListener("click", answerSelected);
const submitButton = document.createElement("a");
submitButton.className = "btn btn-success";
submitButton.addEventListener("click", quizEnd);
submitButton.href = `exploration.html?course=${getSelectedCourse()}`;
submitButton.innerHTML = "Submit";
const surveysubmitButton = document.createElement("a");
surveysubmitButton.className = "btn btn-success";
surveysubmitButton.addEventListener("click", quizEnd);
surveysubmitButton.href = `survey.html`;
surveysubmitButton.innerHTML = "Submit & go to survey";

let pagetitle = document.getElementById("pageTitle");
pagetitle.innerHTML = `${getSelectedCourse().replace(/_/g, " ")} Quiz`;
var questions,
  currentQuestionNumber = 0;
var tracks = {};

$(document).ready(function () {
  onValue(questionsRef, (snapshot) => {
    questions = snapshot.toJSON();
    buildQuiz();
  });
});

function toProperString(string) {
  string = string.replace(/</g, "&lt;");
  string = string.replace(/>/g, "&gt;;");
  return string;
}

function buildQuiz() {
  if (Object.keys(questions).length < currentQuestionNumber + 1) {
    displayScore();
  } else {
    const { choices, question } = questions[currentQuestionNumber];
    const { a, b, c, d } = choices;

    elementnumber.innerHTML = currentQuestionNumber + 1;
    elementQuestion.innerHTML = `${toProperString(question)}`;
    elementAButton.innerHTML = `${toProperString(a)}`;
    elementBButton.innerHTML = `${toProperString(b)}`;
    elementCButton.innerHTML = `${toProperString(c)}`;
    elementDButton.innerHTML = `${toProperString(d)}`;
  }
}

function answerSelected(evt) {
  const { correctchoice, track } = questions[currentQuestionNumber];

  if (evt.target.value === correctchoice) {
    updateTrackScores(track, true);
  } else {
    updateTrackScores(track, false);
  }

  currentQuestionNumber++;
  buildQuiz(currentQuestionNumber);
}

function updateTrackScores(trackName, isCorrect) {
  if (isCorrect) {
    tracks[trackName] = tracks[trackName] + 1 || 1;
  } else {
    tracks[trackName] = tracks[trackName] || 0;
  }

  console.log(isCorrect);
  console.log(tracks);
}

function displayScore() {
  let quizBox = document.getElementById("quiz-box");
  let infoBox = document.getElementById("info-box");
  let scoresBox = document.getElementById("scores-box");
  let infoFooter = document.getElementById("info-footer");
  let submitButtonContainer = document.getElementById(
    "submit-button-container"
  );
  submitButtonContainer.append(submitButton, surveysubmitButton);

  let highestScoredTrack = Object.keys(tracks).reduce((a, b) =>
    tracks[a] > tracks[b] ? a : b
  );
  let lowestScoredTrack = Object.keys(tracks).reduce((a, b) =>
    tracks[a] < tracks[b] ? a : b
  );
  let total = Object.values(tracks).reduce(
    (partialSum, a) => partialSum + a,
    0
  );

  let totalScore = document.createElement("p");
  totalScore.className = "h5";
  totalScore.innerHTML = `Your total score is ${total} out of ${
    Object.keys(questions).length
  }.`;
  scoresBox.append(totalScore);

  for (let track of Object.keys(tracks)) {
    let line = document.createElement("p");
    line.className = "info-line";
    line.innerHTML = `<span style="font-weight:Bold;"> ${tracks[track]} </span> in ${track} `;
    scoresBox.append(line);
  }

  let recommendation = document.createElement("p");
  recommendation.className = "mt-2";
  if (highestScoredTrack == lowestScoredTrack && highestScoredTrack <= 0) {
    recommendation.innerHTML = `You scored 0 in all tracks questions, try again.`;
  } else if (highestScoredTrack == lowestScoredTrack) {
    recommendation.innerHTML = `You scored equally in all tracks, you're recommended to take the track that aligns with your interests.`;
  } else {
    recommendation.innerHTML = `Recommended to take <span style="font-weight:Bold;"> ${highestScoredTrack} </span>for this course.`;
  }
  scoresBox.append(recommendation);

  quizBox.hidden = true;
  infoBox.hidden = false;
}

function quizEnd() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}/${month}/${year}`;
  console.log(currentDate);

  let userName;
  let elementUserName = document.getElementById("userName");
  if (elementUserName.value.length != 0) {
    userName = elementUserName.value;
  } else {
    userName = "Anon";
  }
  console.log(userName);

  let course = getSelectedCourse().replace(/_/g, " ");

  let quizLength = Object.keys(questions).length;

  let highestScoredTrack = Object.keys(tracks).reduce((a, b) =>
    tracks[a] > tracks[b] ? a : b
  );

  let totalScore = Object.values(tracks).reduce(
    (partialSum, a) => partialSum + a,
    0
  );

  push(scoresRef, {
    username: userName,
    date: currentDate,
    course: course,
    quizlength: quizLength,
    totalscore: totalScore,
    tracksscores: tracks,
    recommendation: highestScoredTrack,
  });
}
