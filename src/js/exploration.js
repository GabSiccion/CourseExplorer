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
var data;

onValue(coursesRef, (snapshot) => {
	const data = snapshot.toJSON();
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

	//page content
	let contentbox = document.getElementById("content-box");
	contentbox.innerHTML = "";

	let container = document.createElement("div");
	container.className = "container mt-4";

	let h1 = document.createElement("h1");
	h1.innerHTML = data[selectedcourse]["header-text"];

	let p = document.createElement("p");
	p.innerHTML = data[selectedcourse]["article-text"];

	container.append(h1, p);
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
			cardtitle.innerHTML = obj2;

			let cardtext = document.createElement("p");
			cardtext.className = "card-text";
			cardtext.innerHTML =
				data[selectedcourse]["tracks"][obj]["track-topics"][obj2]["topic-text"];

			let cardlink = document.createElement("button");
			cardlink.className = "btn btn-primary";
			cardlink.innerHTML = "View topics and lessons";
			cardlink.value =
				data[selectedcourse]["tracks"][obj]["track-topics"][obj2]["topic-ppt"];
			cardlink.addEventListener("click", function (src) {
				console.log(cardlink.value);
			});

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
