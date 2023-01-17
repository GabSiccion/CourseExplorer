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

$(document).ready(function () {
  document.getElementById("csAnchor").href =
    "exploration.html?course=Computer_Science";
  document.getElementById("itAnchor").href =
    "exploration.html?course=Information_Technology";
});
