import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { firebaseConfig } from "./firebaseconfig";
import { Header } from "./components";
import { Button } from "bootstrap";

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
	trackcontainer.id = "trackcontainer";

	for (obj in data[selectedcourse]["tracks"]) {
		let track = document.createElement("div");
		track.className = "mt-5 mb-5";

		let trackname = document.createElement("h2");
		trackname.innerHTML = data[selectedcourse]["tracks"][obj]["track-name"];

		let tracktext = document.createElement("p");
		tracktext.innerHTML = data[selectedcourse]["tracks"][obj]["track-text"];

		track.append(trackname, tracktext);

		for (obj2 in data[selectedcourse]["tracks"][obj]["track-topics"]) {
			var card = document.createElement("div");
			card.className = "card m-1";
			card.style = "width: 32rem";

			let cardbody = document.createElement("div");
			cardbody.className = "card-body";

			let cardtitle = document.createElement("h4");
			cardtitle.className = "card-title";
			cardtitle.innerHTML =
				data[selectedcourse]["tracks"][obj]["track-topics"][obj2]["topic-name"];

			let cardsubtitle = document.createElement("h5");
			cardsubtitle.className = "card-subtitle mb-2 text-muted";
			cardsubtitle.innerHTML =
				data[selectedcourse]["tracks"][obj]["track-name"] + " track";

			let cardtext = document.createElement("p");
			cardtext.className = "card-text";
			cardtext.innerHTML =
				data[selectedcourse]["tracks"][obj]["track-topics"][obj2]["topic-text"];

			let cardlink = document.createElement("a");
			cardlink.className = "card-link";
			cardlink.innerHTML = "Start";

			cardbody.append(cardtitle, cardsubtitle, cardtext, cardlink);
			card.append(cardbody);
			track.append(card);
		}
		trackcontainer.append(track);
	}
	contentbox.append(trackcontainer);
	container.appendChild(contentbox);
	document.body.appendChild(container);
});

/*
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
 */
