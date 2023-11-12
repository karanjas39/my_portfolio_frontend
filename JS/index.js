const themeMode = localStorage.getItem("theme");
const words = ["Full stack web developer", "C/C++ Programmer"];

let index = 0;
let charIndex = 0;

// *****************************************************************************************************FUNCTIONS

// CHANGE IMAGES AS PER THEME
function changeImages(color) {
  try {
    document.querySelector(
      ".programmer-svg"
    ).src = `.././UTILS/programmer-${color}.svg`;
    document.querySelector(".about-svg").src = `.././UTILS/about-${color}.svg`;
  } catch (error) {
    console.log(`Error: ${error.toString()} in changeImagesC`);
  }
}

function type() {
  if (charIndex < words[index].length) {
    document
      .querySelector(".home__subtitle")
      .querySelector("#typing").textContent += words[index].charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 1500);
  }
}

function erase() {
  if (charIndex > 0) {
    document
      .querySelector(".home__subtitle")
      .querySelector("#typing").textContent = words[index].substring(
      0,
      charIndex - 1
    );
    charIndex--;
    setTimeout(erase, 50);
  } else {
    index++;
    if (index >= words.length) {
      index = 0;
    }
    setTimeout(type, 1000);
  }
}

// *****************************************************************************************************EVENT LISTNERS

// ONLOAD THEME ADJUST
document.addEventListener("DOMContentLoaded", () => {
  let theme = localStorage.getItem("theme");
  if (theme == "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.querySelector(".theme-icon").classList.value =
      "fa theme-icon fa-moon";
    changeImages("dark");
  }
  if (words.length) {
    setTimeout(type, 1500);
  }
});

// CHANGE THEME
document.querySelector(".theme-icon").addEventListener("click", () => {
  let isDark = document
    .querySelector(".theme-icon")
    .classList.contains("fa-moon");
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    document.querySelector(".theme-icon").classList.value =
      "fa theme-icon fa-sun";
    changeImages("light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    document.querySelector(".theme-icon").classList.value =
      "fa theme-icon fa-moon";
    changeImages("dark");
  }
});

// ABOUT ME TABS
document.querySelectorAll(".tab-links").forEach(function (button) {
  button.addEventListener("click", function (e) {
    document.querySelectorAll(".tab-contents").forEach(function (tc) {
      tc.classList.remove("active-tab");
    });
    document.querySelectorAll(".tab-links").forEach(function (b) {
      b.classList.remove("active-link");
    });
    const tabName = document.getElementsByClassName(
      `${button.classList[1]}`
    )[1];
    tabName.classList.toggle("active-tab");
    e.target.classList.toggle("active-link");
  });
});
