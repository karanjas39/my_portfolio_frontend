// @collapse
const words = ["Full stack web developer", "C/C++ Programmer"];

let index = 0;
let charIndex = 0;

// *****************************************************************************************************FUNCTIONS

// ONLOAD FUNCTION
async function details() {
  try {
    if (words.length) {
      setTimeout(type, 1500);
    }

    document.querySelector(".current-year").textContent =
      new Date().getFullYear();

    document.querySelector(".fa-house").style.color = "var(--color2)";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.log(`Error: ${error.toString()} in detailsC`);
  }
}

// TYPING DEVELOPER SKILLS
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

// ERASE DEVELOPER SKILLS
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

document.querySelectorAll(".active-nav-link").forEach((el) => {
  el.addEventListener("click", (el) => {
    let target = el.target;
    let container = target.closest(".active-nav-link");
    document.querySelectorAll(".main-container>section").forEach((el) => {
      el.classList.add("hide");
    });
    document.querySelectorAll(".nav-links i").forEach((el) => {
      el.style.color = "var(--color1)";
    });
    target.style.color = "var(--color2)";
    document
      .querySelector(`.${container.dataset.value}`)
      .classList.remove("hide");
  });
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

// PROJECT DETAILS
document
  .querySelector(".project-inner-container")
  .addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("view-project")) {
      document
        .querySelector(".project-detail-container")
        .classList.remove("hide");
      document.querySelector(".blur").classList.remove("hide");
    }
  });

document
  .querySelector(".close-project-details")
  .addEventListener("click", () => {
    document.querySelector(".project-detail-container").classList.add("hide");
    document.querySelector(".blur").classList.add("hide");
  });
