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

	for (let element in data) {
		let li = document.createElement("li");
		let a = document.createElement("a");
		a.className = "dropdown-item";
		a.href =
			"exploration.html?course=" +
			data[element]["header-text"].replace(/\s+/g, "-");
		a.innerHTML = data[element]["header-text"];

		li.appendChild(a);
		ul.appendChild(li);
	}
});
