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

let username, password;

// *****************************************************************************************************FUNCTIONS

//! GENERAL FUNCTIONS
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
    setTimeout(type, 50);
  } else {
    init_terminal();
  }
}

// INTI TERMINAL
function init_terminal() {
  try {
    count = 0;
    let container = document.querySelector(".terminal-inner");
    container.insertAdjacentHTML("beforeend", inputs[count]);
    document
      .querySelector(".terminal-inner")
      .lastElementChild.querySelector("input")
      .focus();
  } catch (error) {
    console.log(`Error: ${error.toString()} in init_terminalC`);
  }
}

function loader(bool) {
  try {
    if (bool == 1) {
      document.querySelector(".loader").classList.remove("hide");
      document.querySelector(".blur").classList.remove("hide");
    } else {
      document.querySelector(".loader").classList.add("hide");
      document.querySelector(".blur").classList.add("hide");
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in loaderC`);
  }
}

//! USER LOGIN
async function userLogin() {
  try {
    loader(1);
    let response = await fetch("http://127.0.0.1:4000/api/v1/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    loader(0);
    let container = document.querySelector(".terminal-inner");
    if (!!data && data.success == true) {
      container.insertAdjacentHTML(
        "beforeend",
        "<p>[jas@portfolio ~]$ Login successful!</p>"
      );
      window.location.href = data.path;
      sessionStorage.setItem("token", data.token);
    } else {
      container.insertAdjacentHTML(
        "beforeend",
        `<p>[jas@portfolio ~]$ Login fails : ${data.message}</p>`
      );
      init_terminal();
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in userLoginC`);
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
document
  .querySelector(".terminal-inner")
  .addEventListener("keydown", async (e) => {
    let value = document
      .querySelectorAll(".terminal-inner div input")
      [
        document.querySelectorAll(".terminal-inner div input").length - 1
      ].value.trim();
    if (e.key == "Enter" && value != "") {
      let container = document.querySelectorAll(".terminal-inner>div")[
        document.querySelectorAll(".terminal-inner>div").length - 1
      ];
      if (count == 0) {
        username = container.querySelector("input").value.trim();
      }
      if (count == 1) {
        password = container.querySelector("input").value.trim();
      }
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
        await userLogin();
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
