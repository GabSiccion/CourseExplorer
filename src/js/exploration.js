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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const coursesRef = ref(db, "courses/");
const selectedcourse = getSelectedCourse();

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

	let container = document.createElement("div");
	container.className = "container";
	var contentbox = document.createElement("div");
	contentbox.className = "content-box";

	let h1 = document.createElement("h1");
	h1.innerHTML = data[selectedcourse]["header-text"];

	let p = document.createElement("p");
	p.innerHTML = data[selectedcourse]["article-text"];

	contentbox.append(h1, p);

	var trackcontainer = document.createElement("div");
	for (obj in data[selectedcourse]["tracks"]) {
		let track = document.createElement("h2");
		track.innerHTML = data[selectedcourse]["tracks"][obj]["track-name"];

		let text = document.createElement("p");
		text.innerHTML = data[selectedcourse]["tracks"][obj]["track-text"];

		let pptcontainer = document.createElement("div");
		pptcontainer.id = "ppt-container";

		let frame = document.createElement("iframe");
		frame.src = data[selectedcourse]["tracks"][obj]["track-ppt"];
		frame.width = "1080" + "px";
		frame.height = "720" + "px";
		pptcontainer.appendChild(frame);

		trackcontainer.append(track, text, pptcontainer);
	}
	contentbox.append(trackcontainer);
	container.appendChild(contentbox);
	document.body.appendChild(container);
});

onValue(coursesRef, (snapshot) => {});
