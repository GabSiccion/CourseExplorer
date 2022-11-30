import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { firebaseConfig } from "./firebaseconfig";

function getSelectedCourse() {
	let parameter = new URLSearchParams(window.location.search);
	return parameter.get("course");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const coursesRef = ref(db, "courses/" + getSelectedCourse());

onValue(coursesRef, (snapshot) => {
	const data = snapshot.toJSON();
	for (let obj in data) {
	}
});
