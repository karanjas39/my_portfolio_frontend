// @collapse
// NOTIFICATION RELATED
let notificationTimeout;
let progressBarInterval;

// TO SHOW THE CLICKED SECTION
let prevBtn;
let prevSectionContainer;

// OPENED POPUPS
let openedContainer;
let blurbg = document.querySelector(".blur");

// TARGET CONTAINER
let targetedContainer;

// SESSION TIMEOUT
let index = 0;
let charIndex = 0;
let words = ["Session Timeout..."];
let timerInterval;

// ADD SOCIAL MEDIA RELATED
let addedlink;

// TEMP DATA
let tempData;
let dev;

// *****************************************************************************************************FUNCTIONS

// **  GENERAL PURPOSE
async function details() {
  try {
    await Promise.all([
      getDeveloperDetails(),
      getDeveloperRoles(),
      getDeveloperSocialMedia(),
    ]);
    startReverseTimer(60);
    let theme = localStorage.getItem("theme");
    if (theme == "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.querySelector(".theme-icon").classList.value =
        "fa theme-icon fa-moon";
    }
    changeTheme(theme);
    setup_dashboard();
    prevBtn = document.querySelector(".home-i");
    prevSectionContainer = document.querySelector(".home-section");
    document.querySelector(".fa-house").style.color = "var(--color2)";
  } catch (error) {
    console.log(`Error: ${error.toString()} in detailsC`);
  }
}

function formatDate(dateData) {
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
      return "just now";
    } else if (timeDifference < oneHour) {
      const minutesAgo = Math.floor(timeDifference / oneMinute);
      return `${minutesAgo} mins ago`;
    } else if (timeDifference < oneDay) {
      const hoursAgo = Math.floor(timeDifference / oneHour);
      return `${hoursAgo} hours ago`;
    } else if (timeDifference < oneWeek) {
      const daysAgo = Math.floor(timeDifference / oneDay);
      return daysAgo == 1 ? "1 day ago" : `${daysAgo} days ago`;
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

function startReverseTimer(minutes) {
  try {
    let seconds = localStorage.getItem("timerSeconds") || minutes * 60;
    let displayElement = document.querySelector(".sessiontime span");
    function updateTimer() {
      const timeUnit = seconds > 60 ? "minutes" : "seconds";
      const timeValue = seconds > 60 ? Math.ceil(seconds / 60) : seconds;
      displayElement.textContent = `${timeValue} ${timeUnit}`;
      if (seconds <= 0) {
        !!openedContainer ? openedContainer.classList.add("hide") : "";
        blurbg.classList.remove("hide");
        document
          .querySelector(".sessionTimeOutContainer")
          .classList.remove("hide");
        sessionTimeOut();
      }
      seconds--;
      localStorage.setItem("timerSeconds", seconds);
    }

    updateTimer();

    if (!localStorage.getItem("timerRunning")) {
      timerInterval = setInterval(updateTimer, 1000);
      localStorage.setItem("timerRunning", "true");

      window.addEventListener("beforeunload", () => {
        clearInterval(timerInterval);
        localStorage.removeItem("timerRunning");
      });
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in startReverseTimer`);
  }
}

function sessionTimeOut() {
  if (charIndex < words[index].length) {
    document.querySelector(".sessionTimeOutContainer").textContent +=
      words[index].charAt(charIndex);
    charIndex++;
    setTimeout(sessionTimeOut, 50);
  } else {
    clearInterval(timerInterval);
    localStorage.removeItem("timerSeconds");
    setTimeout(() => {
      window.location.href = ".././HTML/login.html";
    }, 5000);
  }
}

function showConfirmation(message) {
  try {
    return new Promise((resolve) => {
      document.querySelector(".blur").classList.remove("hide");
      document.querySelector(".confirm-box").classList.remove("hide");
      document.querySelector(".confirm-box p").textContent = message;

      let confirmButtons = document.querySelectorAll(".confirm-box button");

      let handleConfirmationClick = (event) => {
        event.preventDefault();
        const value = event.target.value;
        document.querySelector(".blur").classList.add("hide");
        document.querySelector(".confirm-box").classList.add("hide");
        resolve(value === "true");
      };

      confirmButtons.forEach((button) => {
        button.addEventListener("click", handleConfirmationClick);
      });
    });
  } catch (error) {
    console.log(`Error: ${error.toString()} in showConfirmation`);
  }
}

// ** EMPTY ALL INPUT FIELDS
function emptyInputFields(
  container = document.querySelectorAll(".popup-container")
) {
  container.forEach((el) => {
    el.querySelectorAll("input").forEach((el) => {
      el.value = "";
    });
  });
}

// ** SETUP DASHBOARD
function setup_dashboard() {
  try {
    let user_time = document.querySelector(".admin-wish");
    let currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      user_time.textContent = "Good morning,";
    } else if (currentHour >= 12 && currentHour < 17) {
      user_time.textContent = "Good afternoon,";
    } else if (currentHour >= 17 || currentHour < 24) {
      user_time.textContent = "Good evening,";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in setup_dashboard`);
  }
}

async function getDeveloperDetails() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/details",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      dev = { ...data.developer };
      document.querySelector(".admin-email").textContent = dev.email;
      document.querySelector(".admin-salute>.admin-name").textContent =
        dev.name;
      document.querySelector(".get-resume-btn").href = dev.cv_link;
      document.querySelector(".edit-admin-icon").dataset.id = dev._id;
      document.querySelector(".update-cv-btn").value = dev._id;
      document.querySelector(".change-admin-password").dataset.id = dev._id;
      document.querySelector(".admin-join-date").textContent = formatDate(
        dev.createdAt
      );
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getDeveloperDetails`);
  }
}

async function getDeveloperRoles() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/role/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".home-mid-container");
    if (!!data && data.success == true) {
      data.roles.forEach((el) => {
        result += `<div class="home-mid-dev-role">
              <p>${el.name}</p>
              <div class="home-mid-dev-role-links">
                <i class="fa-solid fa-pen" data-id="${el._id}"></i>
                <i class="fa-solid fa-trash" data-id="${el._id}"></i>
              </div>
            </div>`;
      });
      container.innerHTML = result;
    } else {
      container.innerHTML = "No role is added yet.";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getDeveloperRoles`);
  }
}

async function getDeveloperSocialMedia() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/socialmedia/all",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".home-mid-container2");
    if (!!data && data.success == true) {
      data.socialMediaLinks.forEach((el) => {
        result += `<div class="home-mid-social-handle">
  <p>
    ${el.icon} 
    <span><a href='${el.link}' target="_blank">${el.name}</a></span>
  </p>
  <div class="home-mid-social-handle-links">
    <i class="fa-solid fa-pen" data-id="${el._id}"></i>
    <i class="fa-solid fa-trash" data-id="${el._id}"></i>
  </div>
</div>`;
      });

      container.innerHTML = result;
    } else {
      container.innerHTML = "No Social media link is added yet.";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getDeveloperSocialMedia`);
  }
}

// ** SOCIAL MEDIA
async function addSocialMedia(query) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/socialmedia/add",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    blurbg.classList.add("hide");
    openedContainer.classList.add("hide");
    if (!!data && data.success == true) {
      let el = { ...data.socialMedia };
      let container = document.querySelector(".home-mid-container2");
      let result = `
      <div class="home-mid-social-handle">
  <p>
    ${el.icon} 
    <span><a href='${el.link}' target="_blank">${el.name}</a></span>
  </p>
  <div class="home-mid-social-handle-links">
    <i class="fa-solid fa-pen" data-id="${el._id}"></i>
    <i class="fa-solid fa-trash" data-id="${el._id}"></i>
  </div>
</div>
      `;
      container.insertAdjacentHTML("beforeend", result);
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addSocialMedia`);
  }
}

async function deleteSocialMedia(query) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/socialmedia/delete",
      {
        method: "POST",
        body: JSON.stringify({
          _id: query,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      targetedContainer.remove();
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteSocialMedia`);
  }
}

async function editSocialMedia(query) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/socialmedia/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      await getDeveloperSocialMedia();
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editSocialMedia`);
  }
}

// ** DEVELOPER ROLE
async function addRole(name) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/role/add",
      {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".home-mid-container");
    if (!!data && data.success == true) {
      let el = { ...data.role };
      result = `<div class="home-mid-dev-role">
              <p>${el.name}</p>
              <div class="home-mid-dev-role-links">
                <i class="fa-solid fa-pen" data-id="${el._id}"></i>
                <i class="fa-solid fa-trash" data-id="${el._id}"></i>
              </div>
            </div>`;
      container.insertAdjacentHTML("beforeend", result);
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addRole`);
  }
}

async function deleteRole(_id) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/role/delete",
      {
        method: "POST",
        body: JSON.stringify({
          _id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      targetedContainer.remove();
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteRole`);
  }
}

async function editRole(query) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/role/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      await getDeveloperRoles();
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editRole`);
  }
}

// ** DEVELOPER
async function updateDeveloper(query) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      await getDeveloperDetails();
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in updateDeveloper`);
  }
}

async function updateAdminResume(file, id) {
  try {
    let formData = new FormData();
    formData.append("cv", file);
    formData.append("_id", id);

    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/cv/upload",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    let data = await response.json();
    if (!!data && data.success == true) {
      await getDeveloperDetails();
      openedContainer.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.error(`Error: ${error.toString()} in updateAdminResume`);
  }
}

// ***************************************************************************************************EVENT LISTNERS

// ** NAV LINKS
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
  }
});

// ** NOTIFICATION CLOSE
document.querySelector(".popup-msg-close").addEventListener("click", () => {
  hideNotification();
});

// ** CHANGE THEME
document.querySelector(".theme-icon").addEventListener("click", () => {
  let isDark = document
    .querySelector(".theme-icon")
    .classList.contains("fa-moon");
  if (isDark) {
    changeTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    document.querySelector(".theme-icon").classList.value =
      "fa theme-icon fa-sun";
  } else {
    changeTheme("dark");
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    document.querySelector(".theme-icon").classList.value =
      "fa theme-icon fa-moon";
  }
});

// ** LOGOUT
document.querySelector(".admin-logout").addEventListener("click", () => {
  clearInterval(timerInterval);
  localStorage.removeItem("timerSeconds");
  window.location.href = ".././index.html";
});

// ** SOCIAL MEDIA CONTAINER
document
  .querySelector(".home-mid-container2")
  .addEventListener("click", async (e) => {
    let target = e.target;
    if (target.classList.contains("fa-pen")) {
      let container = target.closest(".home-mid-social-handle");
      openedContainer = document.querySelector(".edit-social-media");
      openedContainer.classList.remove("hide");
      blurbg.classList.remove("hide");
      document.querySelector(".edit-social-media-name").value =
        container.querySelector("a").textContent;
      document.querySelector(".edit-social-media-link").value =
        container.querySelector("a").href;
      document.querySelector(".edit-social-media-icon").value =
        container.querySelector("p i").outerHTML;
      tempData = {
        name: container.querySelector("a").textContent,
        link: container.querySelector("a").href,
        icon: container.querySelector("p i").outerHTML,
        _id: target.dataset.id,
      };
    }
    if (target.classList.contains("fa-trash")) {
      let res = await showConfirmation("Do you want to remove this link?");
      if (!res) return;
      targetedContainer = target.closest(".home-mid-social-handle");
      await deleteSocialMedia(target.dataset.id);
    }
  });

document.querySelector(".edited-link").addEventListener("click", () => {
  let value = document.querySelector(".edit-social-media-link").value.trim();
  let urlPattern = /^(https?|https):\/\/[\w.-]+\.\w+[/?].*$/;
  if (!value) {
    return showNotification("There is no link added.");
  }
  if (!urlPattern.test(value)) {
    return showNotification("Add valid social media link.");
  }
  const newTab = window.open(value, "_blank");
  newTab.focus();
});

document.querySelector(".add-social-handle").addEventListener("click", () => {
  emptyInputFields();
  openedContainer = document.querySelector(".add-social-media-container");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
});

document.querySelector(".added-link").addEventListener("click", () => {
  let value = document.querySelector(".add-social-media-link").value.trim();
  let urlPattern = /^(https?|https):\/\/[\w.-]+\.\w+[/?].*$/;
  if (!value) {
    return showNotification("There is no link added.");
  }
  if (!urlPattern.test(value)) {
    return showNotification("Add valid social media link.");
  }
  const newTab = window.open(value, "_blank");
  newTab.focus();
});

document
  .querySelector(".add-social-handle-btn")
  .addEventListener("click", async () => {
    let name = document.querySelector(".add-social-media-name").value.trim();
    let link = document.querySelector(".add-social-media-link").value.trim();
    let icon = document.querySelector(".add-social-media-icon").value.trim();
    let invalidFields = [];
    if (!name) {
      invalidFields.push("name");
    }
    if (!link) {
      invalidFields.push("link");
    }
    if (!icon) {
      invalidFields.push("icon");
    }
    if (invalidFields.length != 0) {
      return showNotification(`Required fields: ${invalidFields.join(", ")}`);
    }
    let data = {
      name,
      link,
      icon,
    };
    await addSocialMedia(data);
  });

document
  .querySelector(".edit-social-handle-btn")
  .addEventListener("click", async () => {
    let count = 0;
    let data = {};
    let name = document.querySelector(".edit-social-media-name").value.trim();
    let link = document.querySelector(".edit-social-media-link").value.trim();
    let icon = document.querySelector(".edit-social-media-icon").value.trim();
    if (name != tempData.name) {
      data.name = name;
      count++;
    }
    if (link != tempData.link) {
      data.link = link;
      count++;
    }
    if (icon != tempData.icon) {
      data.icon = icon;
      count++;
    }
    if (count == 0) {
      openedContainer.classList.add("hide");
      blurbg.classList.add("hide");
      showNotification("No change has been made.");
      return;
    }
    data._id = tempData._id;
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to edit this link?");
    if (!confirm) {
      return;
    }
    await editSocialMedia(data);
  });

// ** DEVELOPER ROLE
document
  .querySelector(".home-mid-container")
  .addEventListener("click", async (e) => {
    let target = e.target;
    if (target.classList.contains("fa-pen")) {
      let container = target.closest(".home-mid-dev-role");
      openedContainer = document.querySelector(".edit-role");
      openedContainer.classList.remove("hide");
      blurbg.classList.remove("hide");
      document.querySelector(".edit-role-name").value =
        container.querySelector("p").textContent;
      tempData = {
        name: container.querySelector("p").textContent,
        _id: target.dataset.id,
      };
    }
    if (target.classList.contains("fa-trash")) {
      let res = await showConfirmation("Do you want to remove this role?");
      if (!res) return;
      targetedContainer = target.closest(".home-mid-dev-role");
      await deleteRole(target.dataset.id);
    }
  });
document.querySelector(".add-dev-role").addEventListener("click", () => {
  emptyInputFields();
  openedContainer = document.querySelector(".add-role");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
});

document.querySelector(".add-role-btn").addEventListener("click", async () => {
  let name = document.querySelector(".role-name").value.trim();
  if (!name) {
    return showNotification("Required field: name");
  }
  openedContainer.classList.add("hide");
  blurbg.classList.add("hide");
  await addRole(name);
});

document.querySelector(".edit-role-btn").addEventListener("click", async () => {
  let count = 0;
  let data = {};
  let name = document.querySelector(".edit-role-name").value.trim();
  if (name != tempData.name) {
    data.name = name;
    count++;
  }
  if (count == 0) {
    openedContainer.classList.add("hide");
    blurbg.classList.add("hide");
    showNotification("No change has been made.");
    return;
  }
  data._id = tempData._id;
  openedContainer.classList.add("hide");
  let confirm = await showConfirmation("Do you want to edit this role?");
  if (!confirm) {
    return;
  }
  await editRole(data);
});

// ** DEVELOPER DETAILS
document.querySelector(".edit-admin-icon").addEventListener("click", () => {
  openedContainer = document.querySelector(".edit-admin");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
  document.querySelector(".edit-admin-name").value = dev.name;
  document.querySelector(".edit-admin-email").value = dev.email;
  document.querySelector(".edit-admin-cv-link").value = dev.cv_link;
  document.querySelector(".edit-admin-cloud-path").value = dev.fileName;
});

document.querySelector(".admin-cv-link").addEventListener("click", () => {
  let value = document.querySelector(".edit-admin-cv-link").value.trim();
  let urlPattern = /^(https?|https):\/\/[\w.-]+\.\w+[/?].*$/;
  if (!value) {
    return showNotification("There is no link added.");
  }
  if (!urlPattern.test(value)) {
    return showNotification("Add valid social media link.");
  }
  const newTab = window.open(value, "_blank");
  newTab.focus();
});

document
  .querySelector(".edit-admin-btn")
  .addEventListener("click", async () => {
    let data = {};
    let count = 0;
    let name = document.querySelector(".edit-admin-name").value.trim();
    let email = document.querySelector(".edit-admin-email").value.trim();
    let cvLink = document.querySelector(".edit-admin-cv-link").value.trim();
    let cloudPath = document
      .querySelector(".edit-admin-cloud-path")
      .value.trim();
    if (name != dev.name) {
      count++;
      data.name = name;
    }
    if (email != dev.email) {
      count++;
      data.email = email;
    }
    if (cvLink != dev.cv_link) {
      count++;
      data.cv_link = cvLink;
    }
    if (cloudPath != dev.fileName) {
      count++;
      data.fileName = cloudPath;
    }
    if (count == 0) {
      showNotification("Nothing changed.");
      openedContainer.classList.add("hide");
      blurbg.classList.add("hide");
      return;
    }
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to edit the details?");
    if (!confirm) return;
    data._id = document.querySelector(".edit-admin-icon").dataset.id;
    await updateDeveloper(data);
  });

// ** DEVELOPER RESUME

document
  .querySelector(".update-resume-inp")
  .addEventListener("change", function () {
    let fileNameElement = document.getElementById("fileName");
    let selectedFileNameElement = document.getElementById("selectedFileName");

    if (this.files.length > 0) {
      let fileName = this.files[0].name;
      fileNameElement.textContent = fileName;
      selectedFileNameElement.classList.remove("hide");
    } else {
      fileNameElement.textContent = "";
      selectedFileNameElement.classList.add("hide");
    }
  });

document.querySelector(".update-resume-link").addEventListener("click", () => {
  document.querySelector(".update-resume-inp").files[0] = "";
  document.getElementById("selectedFileName").classList.add("hide");
  openedContainer = document.querySelector(".update-resume-container");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
});

document.querySelector(".update-cv-btn").addEventListener("click", async () => {
  let file = document.querySelector(".update-resume-inp").files[0];
  if (!file) {
    showNotification("No file is selected.");
    return;
  }
  let id = document.querySelector(".update-cv-btn").value;
  await updateAdminResume(file, id);
});

// ** CLOSE ALL OPENED CONTAINER
document.querySelectorAll(".container-top i").forEach((el) => {
  el.addEventListener("click", () => {
    openedContainer.classList.add("hide");
    blurbg.classList.add("hide");
  });
});
