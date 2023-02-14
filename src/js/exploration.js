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

  let contentbox = document.getElementById("content-box");
  contentbox.innerHTML = "";

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

      let topiccardbody = document.createElement("div");
      topiccardbody.className = "card-body";

      let topicname = document.createElement("p");
      topicname.className = "card-title fw-bold";
      topicname.innerHTML = topicindex;

      let topictext = document.createElement("p");
      topictext.className = "card-text";
      topictext.innerHTML = topicText;

      let topicpowerpoint = document.createElement("a");
      topicpowerpoint.className = "btn btn-success";
      topicpowerpoint.role = "button";
      topicpowerpoint.href = topicPowerpoint;
      topicpowerpoint.innerHTML = "View topics and lessons";
      topicpowerpoint.target = "_blank";

      topiccardbody.append(topicname, topictext, topicpowerpoint);
      topiccard.append(topiccardbody);
      topiccontainer.append(topiccard);
    }

    //TRACK CAREERS
    let careercontainerheader = document.createElement("h3");
    careercontainerheader.innerHTML = "Career Options";

    let careercontainer = document.createElement("div");
    careercontainer.className = "career-container mb-4";

    for (let careerindex in trackCareers) {
      let { careerText, careerSalary } = trackCareers[careerindex];

      let careercardcontent = `
      <p><span class="career-name">${careerindex}</span></p>
      <p>${careerText}</p>
      <p><span class="career-salary">${careerSalary}</span> median salary per year of a ${careerindex}</p>`;

      let careercard = document.createElement("div");
      careercard.className = "career-card";
      careercard.innerHTML += careercardcontent;

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

  contentbox.append(container);
});

/*
onValue(coursesRef, (snapshot) => {
  //JSON DATA
  data = snapshot.toJSON();

  //NAV SELECT OPTIONS
  var ul = document.getElementById("dropdown-menu");
  ul.innerHTML = "";

  for (let index in data) {
    let li = document.createElement("li");
    let a = document.createElement("a");

    let { courseName } = data[index];
    a.className = "dropdown-item";
    a.href = `exploration.html?course=${courseName.replace(/\s+/g, "_")}`;
    a.innerHTML = courseName;

    li.appendChild(a);
    ul.appendChild(li);
  }

  //COURSE CONTENT
  let { courseName, courseText, courseTracks } = data[selectedcourse];

  let contentbox = document.getElementById("content-box");
  contentbox.innerHTML = "";

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

      let topiccardbody = document.createElement("div");
      topiccardbody.className = "card-body";

      let topicname = document.createElement("p");
      topicname.className = "card-title fw-bold";
      topicname.innerHTML = topicindex;

      let topictext = document.createElement("p");
      topictext.className = "card-text";
      topictext.innerHTML = topicText;

      let topicpowerpoint = document.createElement("a");
      topicpowerpoint.className = "btn btn-success";
      topicpowerpoint.role = "button";
      topicpowerpoint.href = topicPowerpoint;
      topicpowerpoint.innerHTML = "View topics and lessons";
      topicpowerpoint.target = "_blank";

      topiccardbody.append(topicname, topictext, topicpowerpoint);
      topiccard.append(topiccardbody);
      topiccontainer.append(topiccard);
    }

    //TRACK CAREERS
    let careercontainerheader = document.createElement("h3");
    careercontainerheader.innerHTML = "Career Options";

    let careercontainer = document.createElement("div");
    careercontainer.className = "career-container mb-4";

    for (let careerindex in trackCareers) {
      let { careerText, careerSalary } = trackCareers[careerindex];

      let careercard = document.createElement("div");
      careercard.className = "career-card";

      let careername = document.createElement("p");
      careername.innerHTML = `<span class="career-name">${careerindex}</span>`;

      let careertext = document.createElement("p");
      careertext.innerHTML = careerText;

      let careersalary = document.createElement("p");
      careersalary.innerHTML = `<span class="career-salary">${careerSalary}</span> median salary per year of a ${careerindex}`;

      careercard.append(careername, careertext, careersalary);
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

  contentbox.append(container);
});
*/
