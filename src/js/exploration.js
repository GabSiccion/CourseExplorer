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
var data;

onValue(coursesRef, (snapshot) => {
	//JSON DATA
	const data = snapshot.toJSON();

	//NAV SELECT OPTIONS
	var ul = document.getElementById("dropdown-menu");
	ul.innerHTML = "";

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

	//COURSE CONTENT
	let contentbox = document.getElementById("content-box");
	contentbox.innerHTML = "";

	let container = document.createElement("div");
	container.className = "container mt-4";

	let h1 = document.createElement("h1");
	h1.innerHTML = data[selectedcourse]["header-text"];

	let p = document.createElement("p");
	p.innerHTML = data[selectedcourse]["article-text"];

	container.append(h1, p);

	//COURSE TRACKS
	var trackcontainer = document.createElement("div");
	trackcontainer.id = "trackcontainer";

	for (obj in data[selectedcourse]["tracks"]) {
		let track = document.createElement("div");
		track.className = "mt-4 mb-4";

		let trackname = document.createElement("h2");
		trackname.innerHTML = obj;

		let tracktext = document.createElement("p");
		tracktext.innerHTML = data[selectedcourse]["tracks"][obj]["track-text"];

		track.append(trackname, tracktext);

		let cardcontainer = document.createElement("div");
		cardcontainer.className = "card-container overflow-auto";

		for (obj2 in data[selectedcourse]["tracks"][obj]["track-topics"]) {
			var card = document.createElement("div");
			card.className = "card m-1";

			let cardbody = document.createElement("div");
			cardbody.className = "card-body";

			let cardtitle = document.createElement("h5");
			cardtitle.className = "card-title";
			cardtitle.innerHTML = data[selectedcourse]["tracks"][obj]["track-topics"][obj2]["topic-title"];;

			let cardtext = document.createElement("p");
			cardtext.className = "card-text";
			cardtext.innerHTML =
				data[selectedcourse]["tracks"][obj]["track-topics"][obj2]["topic-text"];

			let cardlink = document.createElement("a");
			cardlink.role = "button";

			if (
				!isEmpty(
					data[selectedcourse]["tracks"][obj]["track-topics"][obj2]["topic-ppt"]
				)
			) {
				cardlink.className = "btn btn-success";
				cardlink.href =
					data[selectedcourse]["tracks"][obj]["track-topics"][obj2][
						"topic-ppt"
					];
				cardlink.innerHTML = "View topics and lessons";
				cardlink.target = "_blank";
			} else {
				cardlink.className = "btn btn-success disabled";
				cardlink.innerHTML = "Not yet available";
				cardlink.ariaDisabled = "true";
			}

			cardbody.append(cardtitle, cardtext, cardlink);
			card.append(cardbody);
			cardcontainer.append(card);
		}
		track.append(cardcontainer);
		trackcontainer.append(track);
	}
	container.append(trackcontainer);
	contentbox.append(container);
});