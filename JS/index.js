// @collapse
let words = [];

let index = 0;
let charIndex = 0;
let prevBtn;
let prevSectionContainer;

// *****************************************************************************************************FUNCTIONS

// ONLOAD FUNCTION
async function details() {
  try {
    await Promise.all([developerDetails(), developerRoles()]);
    if (words.length) {
      setTimeout(type, 1500);
    }
    document.querySelector(".current-year").textContent =
      new Date().getFullYear();
    prevBtn = document.querySelector(".home-i");
    prevSectionContainer = document.querySelector(".home-section");
    document.querySelector(".home-i").style.color = "var(--color2)";
    changeTheme(localStorage.getItem("theme"));
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

// LOADER
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

// INITIAL REQUESTS
async function developerDetails() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/user/developer/details",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      document.querySelector(".developer-name").textContent =
        data.developer.name;
      document.querySelector(".download-cv").href = data.developer.cv_link;
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in developerDetails`);
  }
}

async function developerRoles() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/user/developer/role/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let data = await response.json();
    if (!!data && data.success == true) {
      data.roles.forEach((el) => {
        words.push(el.name);
      });
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in developerRoles`);
  }
}

async function developerAbout() {
  try {
    let response1 = fetch(
      "http://127.0.0.1:4000/api/v1/user/developer/skill/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let response2 = fetch(
      "http://127.0.0.1:4000/api/v1/user/developer/experience/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let response3 = fetch(
      "http://127.0.0.1:4000/api/v1/user/developer/education/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await Promise.all([response1, response2, response3]);
    let developer_skill = await data[0].json();
    let developer_experience = await data[1].json();
    let developer_education = await data[2].json();

    if (!!developer_skill && developer_skill.success == true) {
      let container = document.querySelector(".skills>ul");
      let result = "";
      developer_skill.skills.forEach((el) => {
        result += `<li><span>${el.name}</span><br /></li>`;
      });
      container.innerHTML = result;
    }
    if (!!developer_education && developer_education.success == true) {
      let container = document.querySelector(".education>ul");
      let result = "";
      let currentYear = new Date().getFullYear();
      developer_education.edus.forEach((el) => {
        let to = currentYear == el.to ? "Current" : `${el.to}`;
        result += `<li>
<span>${el.from} - ${to}</span><br />${el.institute}</li>`;
      });
      container.innerHTML = result;
    }
    if (!!developer_experience && developer_experience.success == true) {
      let container = document.querySelector(".experience>ul");
      let result = "";
      let currentYear = new Date().getFullYear();
      developer_experience.exps.forEach((el) => {
        let to = currentYear == el.to ? "Current" : `${el.to}`;
        result += `<li>
<span>${el.from} - ${to}</span><br />${el.role}</li>`;
      });
      container.innerHTML = result;
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in developerAbout`);
  }
}

// *****************************************************************************************************EVENT LISTNERS

document.querySelector(".ad-cnt").addEventListener("click", async () => {
  window.location.href = "./HTML/login.html";
});

document.querySelector(".nav-links").addEventListener("click", async (e) => {
  let target = e.target;
  if (target.classList.contains("main-i")) {
    let section = target.dataset.classname;

    prevSectionContainer.classList.add("hide");
    document.querySelector(`.${section}`).classList.remove("hide");
    prevSectionContainer = document.querySelector(`.${section}`);

    prevBtn.style.color = "var(--color1)";
    prevBtn = target;
    target.style.color = "var(--color2)";

    if (target.classList.contains("about-i")) {
      await developerAbout();
    }
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
