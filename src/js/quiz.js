function getSelectedCourse() {
  let parameter = new URLSearchParams(window.location.search);
  return parameter.get("course");
}

window.onload = function () {
  console.log(getSelectedCourse());
};
