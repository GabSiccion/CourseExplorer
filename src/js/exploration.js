import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { firebaseConfig } from "./firebaseconfig";
import { Header } from "./components";

//Adds the navigation bar
customElements.define("main-header", Header);

function getSelectedCourse() {
  let parameter = new URLSearchParams(window.location.search);
  return parameter.get("course");
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const coursesRef = ref(db, "courses/");
const selectedcourse = getSelectedCourse();
var courses;

onValue(coursesRef, (snapshot) => {
  //JSON DATA
  courses = snapshot.toJSON();

  //NAV SELECT OPTIONS
  var ul = document.getElementById("dropdown-menu");
  ul.innerHTML = "";

  for (let courseIndex in courses) {
    let { courseName } = courses[courseIndex];

    let dropDownItem = `
    <li>
    <a class="dropdown-item" 
    href="exploration.html?course=${courseName.replace(/\s+/g, "_")}">
    ${courseName}
    </a>
    </li>`;

    $("#dropdown-menu").append(dropDownItem);
  }

  //COURSE CONTENT
  let { courseName, courseText, courseTracks } = courses[selectedcourse];

  $("#content-box").innerHTML = "";
  $("#quiz-button").remove();

  let container = document.createElement("div");
  container.className = "container pt-4 pb-4";

  let h1 = document.createElement("h1");
  h1.innerHTML = courseName;

  let p = document.createElement("p");
  p.innerHTML = courseText;

  let coursecontainer = document.createElement("div");
  coursecontainer.className = "course-container";
  coursecontainer.append(h1, p);

  let anchorbutton = document.createElement("a");
  anchorbutton.id = "quiz-button";
  anchorbutton.href = `quiz.html?course=${selectedcourse}`;
  anchorbutton.innerHTML = "Start Quiz";
  anchorbutton.className = "btn btn-dark ml-4";

  let explorationjumbotron = document.getElementById("explorationJumbotron");
  explorationjumbotron.append(anchorbutton);

  container.append(coursecontainer);

  //COURSE TRACKS
  for (let trackindex in courseTracks) {
    let { trackName, trackText, trackTopics, trackCareers } =
      courseTracks[trackindex];

    let trackname = document.createElement("h2");
    trackname.innerHTML = trackName;

    let tracktext = document.createElement("p");
    tracktext.innerHTML = trackText;

    //TRACK TOPICS
    let topiccontainerheader = document.createElement("h3");
    topiccontainerheader.innerHTML = "Track Topics";

    let topiccontainer = document.createElement("div");
    topiccontainer.className = "card-container overflow-auto mb-4";

    for (let topicindex in trackTopics) {
      let { topicPowerpoint, topicText } = trackTopics[topicindex];

      let topiccard = document.createElement("div");
      topiccard.className = "card m-1";
      topiccard.innerHTML = `<div class="card-body">
      <p class="card-title fw-bold">${topicindex}</p>
      <p class="card-text">${topicText}</p>
      <a class="btn btn-success" role="button" href="${topicPowerpoint}" target="_blank">View topics and lessons</a>
      </div>`;

      topiccontainer.append(topiccard);
    }

    //TRACK CAREERS
    let careercontainerheader = document.createElement("h3");
    careercontainerheader.innerHTML = "Career Options";

    let careercontainer = document.createElement("div");
    careercontainer.className = "career-container mb-4";

    for (let career in trackCareers) {
      let { careerText, careerSalary } = trackCareers[career];

      let careercard = document.createElement("div");
      careercard.className = "career-card";
      careercard.innerHTML += `
      <p><span class="career-name">${career}</span></p>
      <p>${careerText}</p>
      <p><span class="career-salary">${careerSalary}</span> median salary per year of a ${career}</p>`;

      careercontainer.append(careercard);
    }

    //APPENDING TO CONTAINER
    let trackcontainer = document.createElement("div");
    trackcontainer.className = "track-container";
    trackcontainer.append(
      trackname,
      tracktext,
      topiccontainerheader,
      topiccontainer,
      careercontainerheader,
      careercontainer
    );

    container.append(trackcontainer);
  }

  $("#content-box").append(container);
});
