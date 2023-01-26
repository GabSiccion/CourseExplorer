import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { firebaseConfig } from "./firebaseconfig";
import { Header } from "./components";

//Adds the navigation bar
customElements.define("main-header", Header);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const coursesRef = ref(db, "courses/");

onValue(coursesRef, (snapshot) => {
  const data = snapshot.toJSON();
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
});

var icfContainer = document.getElementById("icf-container");
var surveyContainer = document.getElementById("survey-form-container");

function getSurvey() {
  icfContainer.style.display = "none";
  surveyContainer.innerHTML = `        <iframe
          title="survey"
          id="surveyId"
          onload="iframeLoaded()"
          width="800px"
          height="780px"
          src="https://forms.office.com/Pages/ResponsePage.aspx?id=aF0ZCJABuEeDRLFy8jzpxSU7CrI9dL5NofYT6ExSGk1UQTNBSk83SFFNMDUyWVo1Qk82M1dGTDM3Ny4u&embed=true"
          frameborder="0"
          marginwidth="0"
          marginheight="0"
          allowfullscreen
          webkitallowfullscreen
          mozallowfullscreen
          msallowfullscreen
        >
        </iframe>`;
}

$(document).ready(function () {
  let icfButton = document.getElementById("icfButton");
  icfButton.addEventListener("click", getSurvey);
});
