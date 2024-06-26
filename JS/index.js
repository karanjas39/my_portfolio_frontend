let words = [];

let index = 0;
let charIndex = 0;
let prevBtn;
let prevSectionContainer;

// NOTIFICATION
let notificationTimeout;
let progressBarInterval;

// ABOUT SECTION
let aboutTab;
let aboutTabButton;
let isAboutFetched = false;

// PROJECT SECTION
let isAllProjectFetching = false;
let allProjectStartPoint = 0;
let openedProject;
let isCoutriesCodeFetched = false;

// SEARCH PROJECT
let searchProjectStartPoint = 0;
let searchQuery;
let isSearchProjectFetching = false;

// FILTER PROJECT
let filterProjectStartPoint = 0;
let filterQuery;
let isFilterProjectFetching = false;

// CONTACT SECTION
let isSocialMediafetched = false;

// *****************************************************************************************************FUNCTIONS
// ONLOAD FUNCTION
async function details() {
  try {
    if (window.innerWidth > 840) {
      document.querySelector(".nav-links").style.display = "flex";
      document.querySelector(".nav-menu-btn").style.display = "none";
    } else {
      document.querySelector(".nav-links").style.display = "none";
      document.querySelector(".nav-menu-btn").style.display = "block";
    }
    let theme = localStorage.getItem("theme");
    if (theme == "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.querySelector(".theme-icon").classList.value =
        "fa theme-icon fa-moon";
      changeImages("dark");
      changeTheme("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.querySelector(".theme-icon").classList.value =
        "fa theme-icon fa-sun";
      changeImages("light");
      changeTheme("light");
    }
    loader(1);
    await Promise.all([
      developerDetails(),
      developerRoles(),
      developerAboutSkill(),
    ]);
    loader(0);
    if (words.length) {
      setTimeout(type, 50);
    }
    document.querySelector(".current-year").textContent =
      new Date().getFullYear();
    prevBtn = document.querySelector(".home-i");
    prevSectionContainer = document.querySelector(".home-section");
    document.querySelector(".home-i").style.color = "var(--color2)";
  } catch (error) {
    console.log(`Error: ${error.toString()} in detailsC`);
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
    setTimeout(type, 50);
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

function isWordCountExceed(text, limit) {
  try {
    text = text.trim();
    var words = text.split(/\s+/);
    return words.length <= limit;
  } catch (error) {
    console.log(`Error: ${error.toString()} in isWordCountExceed`);
  }
}

function formatDate2(dateData) {
  try {
    const dateString = dateData;
    const date = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate - date;
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;

    if (timeDifference < oneMinute) {
      return "Just now";
    } else if (timeDifference < oneHour) {
      const minutesAgo = Math.floor(timeDifference / oneMinute);
      return `${minutesAgo} mins ago`;
    } else if (timeDifference < oneDay) {
      const hoursAgo = Math.floor(timeDifference / oneHour);
      return `${hoursAgo} hours ago`;
    } else if (timeDifference < oneWeek) {
      const daysAgo = Math.floor(timeDifference / oneDay);
      return `${daysAgo} days ago`;
    } else {
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      return formattedDate;
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in formatDate2`);
    return "Invalid Date";
  }
}

function formatDate(dateData) {
  try {
    const dateString = dateData;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  } catch (error) {
    console.log(`Error: ${error.toString()} in formatDate`);
  }
}

async function fetchCountryCodes() {
  try {
    let response = await fetch(
      "https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json"
    );
    let data = await response.json();
    let container = document.querySelector(".project-contribution-number-code");
    if (!!data && data.length != 0) {
      let result = data
        .map(
          (el) =>
            `<option value="${el.dial_code}">${el.dial_code} (${el.code})</option>`
        )
        .join("");
      container.innerHTML = result;
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in fetchCountryCodes`);
  }
}

// ** HOME SECTION
async function developerDetails() {
  try {
    let response = await fetch(
      "https://developerjaskaran.cyclic.app/api/v1/user/developer/details",
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
      document.querySelector(".admin-name").textContent = data.developer.name;
      document.querySelector(".download-cv").href = data.developer.cv_link;
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in developerDetails`);
  }
}

async function developerRoles() {
  try {
    let response = await fetch(
      "https://developerjaskaran.cyclic.app/api/v1/user/developer/role/all",
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

// ** ABOUT SECTION
async function developerAboutSkill() {
  try {
    let response = await fetch(
      "https://developerjaskaran.cyclic.app/api/v1/user/developer/skill/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      let container = document.querySelector(".skills>ul");
      let container2 = document.querySelector(".project-filter-tech-stack");
      let result = "";
      let result2 = "";
      data.skills.forEach((el) => {
        result2 += `<option value="${el._id}">${el.name}</option>`;
        result += `<li><span>${el.name}</span><br /></li>`;
      });
      container.innerHTML = result;
      container2.innerHTML = result2;
      container2.insertAdjacentHTML(
        "afterbegin",
        `<option value="" selected>Select the tech stack</option>`
      );
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in developerAboutSkill`);
  }
}

async function developerAboutExperience() {
  try {
    let response = await fetch(
      "https://developerjaskaran.cyclic.app/api/v1/user/developer/experience/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      let container = document.querySelector(".experience>ul");
      let result = "";
      data.exps.forEach((el) => {
        let to = el.current == true ? "Current" : `${el.to}`;
        result += `<li>
<span>${el.from} - ${to}</span><br />${el.role}</li>`;
      });
      container.innerHTML = result;
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in developerAboutExperience`);
  }
}

async function developerAboutEducation() {
  try {
    let response = await fetch(
      "https://developerjaskaran.cyclic.app/api/v1/user/developer/education/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      let container = document.querySelector(".education>ul");
      let result = "";
      data.edus.forEach((el) => {
        let to = el.current == true ? "Current" : `${el.to}`;
        result += `<li>
<span>${el.from} - ${to}</span><br />${el.institute}</li>`;
      });
      container.innerHTML = result;
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in developerAboutEducation`);
  }
}

// ** PROJECT SECTION
async function getAllProjects() {
  try {
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/user/developer/project/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".project-list");
    if (!!data && data.success == true) {
      data.projects.forEach((el) => {
        result += `<div class="project-template">
        <div class="project-name">${el.title}</div>
        <div class="project-description">${el.brief_description}</div>
        <button class="view-project" value="${el._id}">View Details</button>
      </div>`;
      });
      allProjectStartPoint = data.nextStartPoint;
      container.innerHTML = result;
      container.scrollTop = 0;
      document.querySelector(".project-inner-all-number span").textContent =
        data.result;
    } else {
      container.innerHTML = "No project is yet published.";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getAllProjects`);
  }
}

async function getProject(id) {
  try {
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/user/developer/project/one?_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    let result = "";
    if (!!data && data.success == true) {
      openedProject = data.projects;
      document.querySelector(".project-detail-title").textContent =
        openedProject.title;
      document.querySelector(".project-detail-description").innerHTML =
        openedProject.detailed_description;
      document.querySelector(
        ".project-detail-start-finish-date"
      ).innerHTML = `<span>${formatDate(
        openedProject.startedOn
      )}</span> - <span>${formatDate(openedProject.finishedOn)}</span>`;
      openedProject.links.forEach((el) => {
        result += `
    <a href="${el.link_url}" target="_blank">${el.link_title}</a>
      `;
      });
      document.querySelector(".project-detail-links-container").innerHTML =
        result;
      result = "";
      openedProject.techStack.forEach((el) => {
        result += `<p>${el.techId.name}</p>`;
      });
      document.querySelector(".project-detail-tech-stack-container").innerHTML =
        result;
      result = "";
      if (openedProject.contributors.length != 0) {
        openedProject.contributors.forEach((el) => {
          result += `<p>${el}</p>`;
        });
      } else {
        result = "There are no contributors for this project yet.";
      }
      document.querySelector(
        ".project-detail-contributors-container"
      ).innerHTML = result;
    } else {
      return showNotification("Project details are not available.");
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getProject`);
  }
}

async function addContributionRequest(query) {
  try {
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/user/project/contribution/add`,
      {
        method: "POST",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      document
        .querySelector(".project-detail-container")
        .classList.remove("hide");
      return showNotification(
        "Jaskaran Singh will be in touch with you shortly."
      );
    } else {
      document
        .querySelector(".project-contribution-container")
        .classList.remove("hide");
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addContributionRequest`);
  }
}

async function getProjectSearch(query) {
  try {
    loader(1);
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/user/developer/project/search?query=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".search-results-container");
    if (!!data && data.success == true) {
      data.projects?.forEach((el) => {
        let highlightedTitle = el.title.replace(
          new RegExp(query, "gi"),
          (match) => `<span class="highlight">${match}</span>`
        );
        let highlightedBriefDescription = el.brief_description.replace(
          new RegExp(query, "gi"),
          (match) => `<span class="highlight">${match}</span>`
        );
        result += `<div class="project-template">
        <div class="project-template-top">
          <div class="project-name">${highlightedTitle}</div>
        </div>
        <div class="project-description">
          ${highlightedBriefDescription}
        </div>
        <button class="view-project" value="${el._id}">View Details</button>
      </div>`;
      });
      container.innerHTML = result;
      searchProjectStartPoint = data.nextStartPoint;
      document
        .querySelector(".project-inner-container-project-list")
        .classList.add("hide");
      document
        .querySelector(".project-inner-container-search-result")
        .classList.remove("hide");
      document
        .querySelector(".project-inner-container-filter-result")
        .classList.add("hide");
      document.querySelector(".search-results-container").scrollTop = 0;
      document.querySelector(".project-inner-search-number span").textContent =
        data.result;
    } else {
      showNotification("No project found.");
      isSearchProjectFetching = true;
    }
    loader(0);
  } catch (error) {
    console.log(`Error: ${error.toString()} in getProjectSearch`);
  }
}

async function getProjectFilter(filter) {
  try {
    loader(1);
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/user/developer/project/filter`,
      {
        method: "POST",
        body: JSON.stringify({
          filter,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    loader(0);
    let result = "";
    let container = document.querySelector(".filter-project-results-container");
    if (!!data && data.success == true) {
      data.projects.forEach((el) => {
        result += `<div class="project-template">
        <div class="project-template-top">
          <div class="project-name">${el.title}</div>
        </div>
        <div class="project-description">
          ${el.brief_description}
        </div>
        <button class="view-project" value="${el._id}">View Details</button>
      </div>`;
      });
      container.innerHTML = result;
      filterProjectStartPoint = data.nextStartPoint;
      document
        .querySelector(".project-inner-container-project-list")
        .classList.add("hide");
      document
        .querySelector(".project-inner-container-search-result")
        .classList.add("hide");
      document
        .querySelector(".project-inner-container-filter-result")
        .classList.remove("hide");
      document.querySelector(".filter-project-results-container").scrollTop = 0;
      document.querySelector(".project-inner-filter-number span").textContent =
        data.result;
    } else {
      document
        .querySelector(".project-filter-container")
        .classList.remove("hide");
      document.querySelector(".blur").classList.remove("hide");
      showNotification("No project found.");
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getProjectFilter`);
  }
}

// ** CONTACT SECTION
async function getSocialMedias() {
  try {
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/user/socialmedia/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".social-links");
    if (!!data && data.success == true) {
      data.socialMediaLinks.forEach((el) => {
        result += `<a href="${el.link}" target="_blank">${el.icon}</a>`;
      });
      container.innerHTML = result;
    } else {
      container.innerHTML = "No social media links are available.";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getSocialMedias`);
  }
}

async function sendMessage(query) {
  try {
    loader(1);
    let response = await fetch(
      `https://developerjaskaran.cyclic.app/api/v1/contact/add`,
      {
        method: "POST",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    loader(0);
    if (!!data && data.success == true) {
      showNotification("Jaskaran Singh will be in touch with you shortly.");
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in sendMessage`);
  }
}

// ** NOTIFICATION
function hideNotification() {
  try {
    clearInterval(progressBarInterval);
    clearTimeout(notificationTimeout);
    document.querySelector(".popup-msg").style.display = "none";
  } catch (error) {
    console.log(`Error: ${error.toString()} in hideNotification`);
  }
}

function showNotification(message, duration = 3000) {
  try {
    clearInterval(progressBarInterval);
    clearTimeout(notificationTimeout);
    const notificationContainer = document.querySelector(
      ".popup-msg-notification"
    );
    const notification = notificationContainer.querySelector(".popup-msg");
    const notificationMessage =
      notification.querySelector(".popup-msg-message");
    const notificationProgress = notification.querySelector(
      ".popup-msg-progress"
    );

    notificationMessage.innerText = message;
    notification.style.display = "block";

    notificationProgress.style.width = "100%";

    const interval = duration / 100;

    progressBarInterval = setInterval(() => {
      notificationProgress.style.width =
        parseFloat(notificationProgress.style.width) - 1 + "%";
    }, interval);

    notificationTimeout = setTimeout(() => {
      hideNotification();
    }, duration);
  } catch (error) {
    console.log(`Error: ${error.toString()} in showNotification`);
  }
}

// *****************************************************************************************************EVENT LISTNERS
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

    if (window.innerWidth <= 840) {
      document.querySelector(".nav-links").style.display = "none";
    }

    if (target.classList.contains("about-i")) {
      aboutTab?.classList.remove("active-link");
      aboutTabButton?.classList.remove("active-tab");
      aboutTab = document.querySelector(".tab-links.skills");
      aboutTabButton = document.querySelector(".tab-contents.skills");
      aboutTab.classList.add("active-link");
      aboutTabButton.classList.add("active-tab");
      if (!isAboutFetched) {
        loader(1);
        await Promise.all([
          developerAboutExperience(),
          developerAboutEducation(),
        ]);
        isAboutFetched = true;
        loader(0);
      }
    }
    if (target.classList.contains("project-i")) {
      isAllProjectFetching = false;
      document
        .querySelector(".project-inner-container-project-list")
        .classList.remove("hide");
      document
        .querySelector(".project-inner-container-search-result")
        .classList.add("hide");
      document
        .querySelector(".project-inner-container-filter-result")
        .classList.add("hide");
      document.querySelector(".search-project-inp").value = "";
      loader(1);
      await getAllProjects();
      loader(0);
    }
    if (target.classList.contains("contact-i")) {
      if (!isSocialMediafetched) {
        loader(1);
        await getSocialMedias();
        loader(0);
        isSocialMediafetched = true;
      }
    }
  }
});

// ** CHANGE THEME
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
    changeTheme("light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    document.querySelector(".theme-icon").classList.value =
      "fa theme-icon fa-moon";
    changeImages("dark");
    changeTheme("dark");
  }
  if (window.innerWidth <= 840) {
    document.querySelector(".nav-links").style.display = "none";
  }
});

// ** NOTIFICATION CLOSE
document.querySelector(".popup-msg-close").addEventListener("click", () => {
  hideNotification();
});

// ** ABOUT TABS
document.querySelector(".about-tab-links").addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains("tab-links")) {
    let tabClass = target?.value;
    aboutTab.classList.remove("active-link");
    aboutTabButton.classList.remove("active-tab");
    aboutTab = document.querySelector(`.tab-links.${tabClass}`);
    aboutTabButton = document.querySelector(`.tab-contents.${tabClass}`);
    aboutTab.classList.add("active-link");
    aboutTabButton.classList.add("active-tab");
  }
});

// ** PROJECT DETAILS
document
  .querySelector(".project-inner-container")
  .addEventListener("click", async (e) => {
    let target = e.target;
    if (target.classList.contains("view-project")) {
      let id = target?.value;
      if (!id) {
        return showNotification("Project details are not available.");
      }
      loader(1);
      await getProject(id);
      loader(0);
      document
        .querySelector(".project-detail-container")
        .classList.remove("hide");
      document.querySelector(".blur").classList.remove("hide");
      document.querySelector(".project-detail-container-inner").scrollTop = 0;
    }
  });

document
  .querySelector(".close-project-details")
  .addEventListener("click", () => {
    document.querySelector(".project-detail-container").classList.add("hide");
    document.querySelector(".blur").classList.add("hide");
  });

document
  .querySelector(".project-list")
  .addEventListener("scroll", async function (event) {
    let { scrollHeight, scrollTop, clientHeight } = event.target;
    if (
      Math.abs(scrollHeight - clientHeight - scrollTop) < 150 &&
      !isAllProjectFetching
    ) {
      try {
        loader(1);
        isAllProjectFetching = true;
        let response = await fetch(
          `https://developerjaskaran.cyclic.app/api/v1/user/developer/project/all?startPoint=${allProjectStartPoint}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let data = await response.json();
        let container = document.querySelector(".project-list");
        let result = "";
        if (!!data && data.success == true) {
          data.projects.forEach((el) => {
            result += `<div class="project-template">
            <div class="project-name">${el.title}</div>
            <div class="project-description">${el.brief_description}</div>
            <button class="view-project" value="${el._id}">View Details</button>
            </div>`;
          });
          allProjectStartPoint = data.nextStartPoint;
          let prevScrollHeight = container.scrollHeight;
          container.insertAdjacentHTML("beforeend", result);
          container.scrollTop = prevScrollHeight;
          isAllProjectFetching = false;
        } else {
          isAllProjectFetching = true;
        }
        loader(0);
      } catch (error) {
        console.log(`Error: ${error.toString()} in getAllProjectsScroll`);
      }
    }
  });

// ** PROJECT CONTRIBUTION
document
  .querySelector(".add-project-contributor")
  .addEventListener("click", async () => {
    document.querySelector(".project-contribution-name").value = "";
    document.querySelector(".project-contribution-email").value = "";
    document.querySelector(".project-contribution-number").value = "";
    document.querySelector(".project-contribution-number-code").value = "+91";
    document.querySelector(".project-detail-container").classList.add("hide");
    if (!isCoutriesCodeFetched) {
      loader(1);
      await fetchCountryCodes();
      isCoutriesCodeFetched = true;
      loader(0);
      document.querySelector(".project-contribution-number-code").value = "+91";
      document.querySelector(".blur").classList.remove("hide");
    }
    document
      .querySelector(".project-contribution-container")
      .classList.remove("hide");
  });

document
  .querySelector(".close-project-contribution")
  .addEventListener("click", () => {
    document
      .querySelector(".project-detail-container")
      .classList.remove("hide");
    document
      .querySelector(".project-contribution-container")
      .classList.add("hide");
  });

document
  .querySelector(".project-contribution-submit-btn")
  .addEventListener("click", async () => {
    let name = document
      .querySelector(".project-contribution-name")
      .value.trim();
    let email = document
      .querySelector(".project-contribution-email")
      .value.trim();
    let whatsapp_number = document
      .querySelector(".project-contribution-number")
      .value.trim();
    let code = document.querySelector(
      ".project-contribution-number-code"
    ).value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let invalidFields = [];
    if (!name) {
      invalidFields.push("Name");
    }
    if (!email) {
      invalidFields.push("Email");
    }
    if (!whatsapp_number) {
      invalidFields.push("Whatsapp number");
    }
    if (invalidFields.length != 0) {
      return showNotification(`Required: ${invalidFields.join(", ")}`);
    }
    if (!emailRegex.test(email)) {
      return showNotification("Please provide a valid email address.");
    }
    let _id = openedProject._id;
    if (!_id) {
      return showNotification(
        "Sorry, we are currently unable to process your request."
      );
    }
    let data = {
      name,
      email,
      whatsapp_number: `${code.substring(1)}${whatsapp_number}`,
      project_id: _id,
    };
    document
      .querySelector(".project-contribution-container")
      .classList.add("hide");
    loader(1);
    await addContributionRequest(data);
    loader(0);
    document.querySelector(".blur").classList.remove("hide");
  });

// ** SEND CONTACT
document.querySelector(".send-message").addEventListener("click", async () => {
  let name = document.querySelector(".contact-name").value.trim();
  let email = document.querySelector(".contact-email").value.trim();
  let message = document.querySelector(".contact-message").value.trim();
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let invalidFields = [];
  if (!name) {
    invalidFields.push("Name");
  }
  if (!email) {
    invalidFields.push("Email");
  }
  if (!message) {
    invalidFields.push("Message");
  }
  if (invalidFields.length != 0) {
    return showNotification(`Required: ${invalidFields.join(", ")}`);
  }
  if (!emailRegex.test(email)) {
    return showNotification("Please provide a valid email address.");
  }
  if (!isWordCountExceed(name, 5)) {
    return showNotification("Please enter a name with a maximum of 5 words.");
  }
  if (!isWordCountExceed(message, 30)) {
    return showNotification(
      "Please limit your message to a maximum of 30 words."
    );
  }
  let data = {
    name,
    email,
    message,
    from: "Portfolio",
  };
  await sendMessage(data);
  document.querySelector(".contact-name").value = "";
  document.querySelector(".contact-email").value = "";
  document.querySelector(".contact-message").value = "";
});

// ** PROJECT SEARCH
document
  .querySelector(".search-project-inp")
  .addEventListener("keydown", async (e) => {
    let value = e.target.value.trim();
    document
      .querySelector(".project-inner-container-project-list")
      .classList.remove("hide");
    document
      .querySelector(".project-inner-container-search-result")
      .classList.add("hide");
    document
      .querySelector(".project-inner-container-filter-result")
      .classList.add("hide");
    if (e.key == "Enter" && value != "") {
      searchQuery = value;
      isSearchProjectFetching = false;
      await getProjectSearch(searchQuery);
    }
  });

document
  .querySelector(".search-results-container")
  .addEventListener("scroll", async function (event) {
    let { scrollHeight, scrollTop, clientHeight } = event.target;
    if (
      Math.abs(scrollHeight - clientHeight - scrollTop) < 150 &&
      !isSearchProjectFetching
    ) {
      try {
        loader(1);
        isSearchProjectFetching = true;
        let response = await fetch(
          `https://developerjaskaran.cyclic.app/api/v1/user/developer/project/search?startPoint=${searchProjectStartPoint}&query=${searchQuery}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let data = await response.json();
        let container = document.querySelector(".search-results-container");
        let result = "";
        if (!!data && data.success == true) {
          data.projects.forEach((el) => {
            let highlightedTitle = el.title.replace(
              new RegExp(searchQuery, "gi"),
              (match) => `<span class="highlight">${match}</span>`
            );
            let highlightedBriefDescription = el.brief_description.replace(
              new RegExp(searchQuery, "gi"),
              (match) => `<span class="highlight">${match}</span>`
            );
            result += `<div class="project-template">
            <div class="project-template-top">
              <div class="project-name">${highlightedTitle}</div>
            </div>
            <div class="project-description">
              ${highlightedBriefDescription}
            </div>
            <button class="view-project" value="${el._id}">View Details</button>
          </div>`;
          });
          searchProjectStartPoint = data.nextStartPoint;
          let prevScrollHeight = container.scrollHeight;
          container.insertAdjacentHTML("beforeend", result);
          container.scrollTop = prevScrollHeight;
          isSearchProjectFetching = false;
        } else {
          isSearchProjectFetching = true;
        }
        loader(0);
      } catch (error) {
        console.log(`Error: ${error.toString()} in getSearchProjectsScroll`);
      }
    }
  });

// ** PROJECT FILTER
document
  .querySelector(".project-filter-clear-btn")
  .addEventListener("click", async () => {
    document.querySelector(".project-filter-tech-stack").value = "";
    document.querySelector(".project-filter-contributor-name").value = "";
    document.querySelector(".project-filter-startedOn").value = "";
    document.querySelector(".project-filter-finsihedOn").value = "";
  });

document
  .querySelector(".project-filter-submit-btn")
  .addEventListener("click", async () => {
    let techStack = document.querySelector(".project-filter-tech-stack").value;
    let contributorName = document
      .querySelector(".project-filter-contributor-name")
      .value.trim();
    let startedOn = document.querySelector(".project-filter-startedOn").value;
    let finishedOn = document.querySelector(".project-filter-finsihedOn").value;
    let data = {};
    if (!!techStack) {
      data.techStack = techStack;
    }
    if (!!contributorName) {
      data.contributorName = contributorName;
    }

    if (!!startedOn) {
      let [year, month, day] = startedOn.split("-");
      const isoDate = new Date(
        `${year}-${month}-${day}T00:00:00.000Z`
      ).toISOString();
      data.startedOn = isoDate;
    }

    if (!!finishedOn) {
      let [year, month, day] = finishedOn.split("-");
      const isoDate = new Date(
        `${year}-${month}-${day}T00:00:00.000Z`
      ).toISOString();
      data.finishedOn = isoDate;
    }

    if (Object.keys(data).length == 0) {
      return showNotification("No filter is selected.");
    }
    isFilterProjectFetching = false;
    filterQuery = { ...data };
    document.querySelector(".project-filter-container").classList.add("hide");
    loader(1);
    await getProjectFilter(filterQuery);
  });

document
  .querySelector(".filter-project-results-container")
  .addEventListener("scroll", async function (event) {
    let { scrollHeight, scrollTop, clientHeight } = event.target;
    if (
      Math.abs(scrollHeight - clientHeight - scrollTop) < 150 &&
      !isFilterProjectFetching
    ) {
      try {
        loader(1);
        isFilterProjectFetching = true;
        let response = await fetch(
          `https://developerjaskaran.cyclic.app/api/v1/user/developer/project/filter`,
          {
            method: "POST",
            body: JSON.stringify({
              filter: filterQuery,
              startPoint: filterProjectStartPoint,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let data = await response.json();
        let container = document.querySelector(
          ".filter-project-results-container"
        );
        let result = "";
        if (!!data && data.success == true) {
          data.projects.forEach((el) => {
            result += `<div class="project-template">
            <div class="project-template-top">
              <div class="project-name">${el.title}</div>
            </div>
            <div class="project-description">
              ${el.brief_description}
            </div>
            <button class="view-project" value="${el._id}">View Details</button>
          </div>`;
          });
          filterProjectStartPoint = data.nextStartPoint;
          let prevScrollHeight = container.scrollHeight;
          container.insertAdjacentHTML("beforeend", result);
          container.scrollTop = prevScrollHeight;
          isFilterProjectFetching = false;
        } else {
          isFilterProjectFetching = true;
        }
        loader(0);
      } catch (error) {
        console.log(`Error: ${error.toString()} in getFilterProjectsScroll`);
      }
    }
  });

document.querySelector(".filter-project-btn").addEventListener("click", () => {
  document.querySelector(".project-filter-container").classList.remove("hide");
  document.querySelector(".blur").classList.remove("hide");
  document.querySelector(".search-project-inp").value = "";
  document
    .querySelector(".project-inner-container-project-list")
    .classList.remove("hide");
  document
    .querySelector(".project-inner-container-search-result")
    .classList.add("hide");
  document
    .querySelector(".project-inner-container-filter-result")
    .classList.add("hide");
});

document
  .querySelector(".close-project-filter")
  .addEventListener("click", () => {
    document.querySelector(".project-filter-container").classList.add("hide");
    document.querySelector(".blur").classList.add("hide");
  });

document
  .querySelector(".close-project-filter-results")
  .addEventListener("click", () => {
    document
      .querySelector(".project-inner-container-project-list")
      .classList.remove("hide");
    document
      .querySelector(".project-inner-container-search-result")
      .classList.add("hide");
    document
      .querySelector(".project-inner-container-filter-result")
      .classList.add("hide");
  });

// ** NAV BAR
window.addEventListener("resize", () => {
  if (window.innerWidth > 840) {
    document.querySelector(".nav-links").style.display = "flex";
    document.querySelector(".nav-menu-btn").style.display = "none";
  } else {
    document.querySelector(".nav-links").style.display = "none";
    document.querySelector(".nav-menu-btn").style.display = "block";
  }
});

document.querySelector(".nav-menu-btn").addEventListener("click", () => {
  let isHidden = document.querySelector(".nav-links").style.display == "none";
  if (isHidden) {
    document.querySelector(".nav-links").style.display = "flex";
  } else {
    document.querySelector(".nav-links").style.display = "none";
  }
});
