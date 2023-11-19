// @collapse
const words = [];

let index = 0;
let charIndex = 0;

let count = 0;
let inputs = [
  `<div class="username-statement">
        <p>[jas@portfolio ~]$ Enter Username :</p>
        <input type="text" class="username" autofocus />
      </div>`,
  `<div class="password-statement">
        <p>[jas@portfolio ~]$ Enter Password :</p>
        <input type="password" class="user-password" autofocus />
      </div>`,
];

// *****************************************************************************************************FUNCTIONS

// ONLOAD
function details() {
  try {
    const theme = localStorage.getItem("theme");
    const date = new Date(Date.now()).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    if (theme == "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    words.push(`Terminal Booted : ${date} on console`);
    if (words.length) {
      setTimeout(type, 1500);
    }

    document.querySelector(".terminal-inner").innerHTML = "";
  } catch (error) {
    console.log(`Error: ${error.toString()} in detailsC`);
  }
}

// TYPING DEVELOPER SKILLS
function type() {
  if (charIndex < words[index].length) {
    document.querySelector(".terminal-last-login").textContent +=
      words[index].charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    init_terminal();
  }
}

// INTI TERMINAL
function init_terminal() {
  try {
    let container = document.querySelector(".terminal-inner");
    container.insertAdjacentHTML("beforeend", inputs[count]);
  } catch (error) {
    console.log(`Error: ${error.toString()} in init_terminalC`);
  }
}

// *****************************************************************************************************EVENT LISTNER
// MINIMIZE TERMINAL
document
  .querySelector(".terminal-btn-2")
  .addEventListener("click", function () {
    document.querySelector(".terminal-container").classList.toggle("minimized");
    document.querySelector(".show-terminal").classList.remove("hide");
  });

//   CLOSE TERMINAL
document
  .querySelector(".terminal-btn-1")
  .addEventListener("click", function () {
    window.location.href = ".././index.html";
  });

//   REAPPER TERMINAL
document.querySelector(".reappear-btn").addEventListener("click", function () {
  document.querySelector(".terminal-container").classList.remove("minimized");
  document.querySelector(".show-terminal").classList.add("hide");
});

//   TOGGLE TERMINAL SIZE
document
  .querySelector(".terminal-btn-3")
  .addEventListener("click", function () {
    document
      .querySelector(".terminal-container")
      .classList.toggle("terminal-width");
  });

//   TERMINAL INNER EVENTS
document.querySelector(".terminal-inner").addEventListener("keydown", (e) => {
  let value = document
    .querySelectorAll(".terminal-inner div input")
    [
      document.querySelectorAll(".terminal-inner div input").length - 1
    ].value.trim();
  if (e.key == "Enter" && value != "") {
    let container = document.querySelectorAll(".terminal-inner>div")[
      document.querySelectorAll(".terminal-inner>div").length - 1
    ];
    let text =
      count == 0
        ? `<p>[jas@portfolio ~]$ Enter Username : ${
            container.querySelector(".username").value
          }</p>`
        : `<p>[jas@portfolio ~]$ Enter Password : ${"*".repeat(
            container.querySelector(".user-password").value.length
          )}</p>`;
    container.remove();
    document
      .querySelector(".terminal-inner")
      .insertAdjacentHTML("beforeend", text);
    count++;
    if (count < 2) {
      document
        .querySelector(".terminal-inner")
        .insertAdjacentHTML("beforeend", inputs[count]);
      document
        .querySelector(".terminal-inner")
        .lastElementChild.querySelector("input")
        .focus();
    } else {
      document
        .querySelector(".terminal-inner")
        .lastElementChild.insertAdjacentHTML(
          "beforeend",
          `<div id="loading-animation"></div>`
        );
      document.getElementById("loading-animation").style.display = "block";
      document.getElementById("loading-animation").classList.add("loading");
    }
  }
  if (e.key == "Enter" && value == "") {
    let container = document.querySelectorAll(".terminal-inner>div")[
      document.querySelectorAll(".terminal-inner>div").length - 1
    ];
    let text =
      count == 0
        ? `<p>[jas@portfolio ~]$ Enter Username : </p>`
        : `<p>[jas@portfolio ~]$ Enter Password : </p>`;
    container.remove();
    document
      .querySelector(".terminal-inner")
      .insertAdjacentHTML("beforeend", text);
    let notification =
      count === 0 ? "Username cannot be empty" : "Password cannot be empty";
    document
      .querySelector(".terminal-inner")
      .insertAdjacentHTML("beforeend", notification);
    document
      .querySelector(".terminal-inner")
      .insertAdjacentHTML("beforeend", inputs[count]);
    document
      .querySelector(".terminal-inner")
      .lastElementChild.querySelector("input")
      .focus();
  }
});
