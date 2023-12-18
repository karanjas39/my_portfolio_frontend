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
let admin_password_container = document.querySelector(".admin-pass-container");
let admin_password_inp = document.querySelector(".admin-password-inp");
let admin_password_submit_btn = document.querySelector(".admin-pass-btn");
let className_admin;

// TARGET CONTAINER
let targetedContainer;

// SESSION TIMEOUT
let index = 0;
let charIndex = 0;
let words = ["Session Timeout..."];
let timerInterval;

// PROJECT SECTION RELATED
let techStack = [];
let addedTechStack = [];
let addedLinks = [];
let projectStartpoint = 0;
let isFetching = false;

// TEMP DATA
let tempData = {};
let dev;

// *****************************************************************************************************FUNCTIONS

// **  GENERAL PURPOSE
async function details() {
  try {
    startReverseTimer(60);
    await Promise.all([
      getDeveloperDetails(),
      getDeveloperRoles(),
      getDeveloperSocialMedia(),
      getDeveloperSkills(),
    ]);
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
      return "Just now";
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
        openedContainer?.classList.add("hide");
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
async function addSocialMediaPre(query) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation(
      "Do you want to add this social media handle?"
    );
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("addSocialMediaHandle");
    className_admin = "addSocialMediaHandle";
    admin_password_submit_btn.value = JSON.stringify({ ...query });
  } catch (error) {
    console.log(`Error: ${error.toString()} in addSocialMediaPre`);
  }
}

async function addSocialMedia(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/socialmedia/add",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
      showNotification("New Social Media Handle added successfully.");
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addSocialMedia`);
  }
}

async function deleteSocialMediaPre(value) {
  try {
    let confirm = await showConfirmation(
      "Do you want to delete this social media handle?"
    );
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("deleteSocialMediaHandle");
    className_admin = "deleteSocialMediaHandle";
    admin_password_submit_btn.value = value;
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteSocialMediaPre`);
  }
}

async function deleteSocialMedia(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/socialmedia/delete",
      {
        method: "POST",
        body: JSON.stringify({
          _id: query,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteSocialMedia`);
  }
}

async function editSocialMediaPre(query) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation(
      "Do you want to edit this social media handle?"
    );
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("editSocialMediaHandle");
    className_admin = "editSocialMediaHandle";
    admin_password_submit_btn.value = JSON.stringify({ ...query });
  } catch (error) {
    console.log(`Error: ${error.toString()} in editScoialMediaPre`);
  }
}

async function editSocialMedia(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/socialmedia/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editSocialMedia`);
  }
}

// ** DEVELOPER ROLE
async function addRolePre(name) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to add this role?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("addNewDevRole");
    className_admin = "addNewDevRole";
    admin_password_submit_btn.value = name;
  } catch (error) {
    console.log(`Error: ${error.toString()} in addRolePre`);
  }
}

async function addRole(name, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/role/add",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
      showNotification("New Role added successfully.");
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addRole`);
  }
}

async function deleteRolePre(value) {
  try {
    let confirm = await showConfirmation("Do you want to delete this role?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("deleteNewDevRole");
    className_admin = "deleteNewDevRole";
    admin_password_submit_btn.value = value;
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteRolePre`);
  }
}

async function deleteRole(_id, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/role/delete",
      {
        method: "POST",
        body: JSON.stringify({
          _id,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteRole`);
  }
}

async function editRolePre(data) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to edit this role?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("editNewDevRole");
    className_admin = "editNewDevRole";
    admin_password_submit_btn.value = JSON.stringify({ ...data });
  } catch (error) {
    console.log(`Error: ${error.toString()} in editRolePre`);
  }
}

async function editRole(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/role/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editRole`);
  }
}

// ** DEVELOPER

async function updateDeveloperPre(query) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to edit the details?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("updateDeveloperDetails");
    className_admin = "updateDeveloperDetails";
    admin_password_submit_btn.value = JSON.stringify({ ...query });
  } catch (error) {
    console.log(`Error: ${error.toString()} in updateDeveloperPre`);
  }
}

async function updateDeveloper(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
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

// ** SKILLS
async function getDeveloperSkills() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/skill/all",
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
    let container = document.querySelector(".skill-con-inner");
    if (!!data && data.success == true) {
      data.skills.forEach((el) => {
        result += `<div class="about-sub-con">
        <p>${el.name}</p>
        <div class="about-sub-con-btns">
          <i class="fa-solid fa-pen" data-id="${el._id}"></i>
          <i class="fa-solid fa-trash" data-id="${el._id}"></i>
        </div>
      </div>`;
      });
      techStack = [...data.skills];
      container.innerHTML = result;
    } else {
      container.innerHTML = "No skill is created yet.";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getDeveloperSkills`);
  }
}

async function addSkillPre(name) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to add this skill?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("addNewSkill");
    className_admin = "addNewSkill";
    admin_password_submit_btn.value = name;
  } catch (error) {
    console.log(`Error: ${error.toString()} in addSkillPre`);
  }
}

async function addSkill(name, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/skill/add",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          admin_password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".skill-con-inner");
    if (!!data && data.success == true) {
      let el = { ...data.skill };
      result += `<div class="about-sub-con">
      <p>${el.name}</p>
      <div class="about-sub-con-btns">
        <i class="fa-solid fa-pen" data-id="${el._id}"></i>
        <i class="fa-solid fa-trash" data-id="${el._id}"></i>
      </div>
    </div>`;
      container.insertAdjacentHTML("beforeend", result);
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
      showNotification("New Skill added successfully.");
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error; ${error.toString()} in addSkill`);
  }
}

async function deleteSkillPre(id) {
  try {
    let confirm = await showConfirmation("Do you want to delete this skill?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("deleteSkill");
    className_admin = "deleteSkill";
    admin_password_submit_btn.value = id;
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteSkillPre`);
  }
}

async function deleteSkill(id, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/skill/delete",
      {
        method: "POST",
        body: JSON.stringify({
          _id: id,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteSkill`);
  }
}

async function editSkillPre(query) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to edit this skill?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("editSkill");
    className_admin = "editSkill";
    admin_password_submit_btn.value = JSON.stringify(query);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editSkillPre`);
  }
}

async function editSkill(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/skill/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      await getDeveloperSkills();
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editSkill`);
  }
}

// ** EXPERIENCE
async function getDeveloperExps() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/experience/all",
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
    let container = document.querySelector(".exp-con-inner");
    if (!!data && data.success == true) {
      data.exps.forEach((el) => {
        let to = !!el.current && el.current == true ? "Current" : el.to;
        result += ` <div class="about-sub-con">
        <p class="dev-exp-main">
          <span class="dev-exp-role">${el.role}</span>
          <span>
            <span class="dev-exp-role-from">${el.from}</span> to
            <span class="dev-exp-role-to">${to}</span>
          </span>
        </p>
        <div class="about-sub-con-btns">
          <i class="fa-solid fa-pen" data-id="${el._id}"></i>
          <i class="fa-solid fa-trash" data-id="${el._id}"></i>
        </div>
      </div>`;
      });
      container.innerHTML = result;
    } else {
      container.innerHTML = "No experience is created yet.";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getDeveloperSkills`);
  }
}

async function addExpPre(query) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to add this experience?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("addNewExp");
    className_admin = "addNewExp";
    admin_password_submit_btn.value = JSON.stringify({ ...query });
  } catch (error) {
    console.log(`Error: ${error.toString()} in addExpPre`);
  }
}

async function addExp(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/experience/add",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".exp-con-inner");
    if (!!data && data.success == true) {
      let el = { ...data.exp };
      let to = !!el.current && el.current == true ? "Current" : el.to;
      result += `<div class="about-sub-con">
      <p class="dev-exp-main">
        <span class="dev-exp-role">${el.role}</span>
        <span>
          <span class="dev-exp-role-from">${el.from}</span> to
          <span class="dev-exp-role-to">${to}</span>
        </span>
      </p>
      <div class="about-sub-con-btns">
        <i class="fa-solid fa-pen" data-id="${el._id}"></i>
        <i class="fa-solid fa-trash" data-id="${el._id}"></i>
      </div>
    </div>`;
      container.insertAdjacentHTML("beforeend", result);
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
      showNotification("New Experience added successfully.");
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addExp`);
  }
}

async function deleteExpPre(id) {
  try {
    let confirm = await showConfirmation(
      "Do you want to delete this experience?"
    );
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("deleteExp");
    className_admin = "deleteExp";
    admin_password_submit_btn.value = id;
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteExpPre`);
  }
}

async function deleteExp(id, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/experience/delete",
      {
        method: "POST",
        body: JSON.stringify({
          _id: id,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteExp`);
  }
}

async function editExpPre(data) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation(
      "Do you want to edit this experience?"
    );
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("editExistingExp");
    className_admin = "editExistingExp";
    admin_password_submit_btn.value = JSON.stringify(data);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editExpPre`);
  }
}

async function editExp(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/experience/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      await getDeveloperExps();
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error; ${error.toString()} in editExp`);
  }
}

// ** EDUCATION
async function getDeveloperEdu() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/education/all",
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
    let container = document.querySelector(".edu-con-inner");
    if (!!data && data.success == true) {
      data.edus.forEach((el) => {
        let to = !!el.current && el.current == true ? "Current" : el.to;
        result += `<div class="about-sub-con">
        <p class="dev-edu-main">
          <span class="dev-edu-role">${el.institute}</span>
          <span>
            <span class="dev-edu-role-from">${el.from}</span> to
            <span class="dev-edu-role-to">${to}</span>
          </span>
        </p>
        <div class="about-sub-con-btns">
          <i class="fa-solid fa-pen" data-id="${el._id}"></i>
          <i class="fa-solid fa-trash" data-id="${el._id}"></i>
        </div>
      </div>`;
      });
      container.innerHTML = result;
    } else {
      container.innerHTML = "No education is created yet.";
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in getDeveloperSkills`);
  }
}

async function addEduPre(query) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to add this education?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("addNewEdu");
    className_admin = "addNewEdu";
    admin_password_submit_btn.value = JSON.stringify({ ...query });
  } catch (error) {
    console.log(`Error: ${error.toString()} in addEduPre`);
  }
}

async function addEdu(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/education/add",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    let result = "";
    let container = document.querySelector(".edu-con-inner");
    if (!!data && data.success == true) {
      let el = { ...data.edu };
      let to = !!el.current && el.current == true ? "Current" : el.to;
      result += `<div class="about-sub-con">
      <p class="dev-edu-main">
        <span class="dev-edu-role">${el.institute}</span>
        <span>
          <span class="dev-edu-role-from">${el.from}</span> to
          <span class="dev-edu-role-to">${to}</span>
        </span>
      </p>
      <div class="about-sub-con-btns">
        <i class="fa-solid fa-pen" data-id="${el._id}"></i>
        <i class="fa-solid fa-trash" data-id="${el._id}"></i>
      </div>
    </div>`;
      container.insertAdjacentHTML("beforeend", result);
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
      showNotification("New Education added successfully.");
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addEdu`);
  }
}

async function deleteEduPre(id) {
  try {
    let confirm = await showConfirmation(
      "Do you want to delete this education?"
    );
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("deleteEdu");
    className_admin = "deleteEdu";
    admin_password_submit_btn.value = id;
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteEduPre`);
  }
}

async function deleteEdu(id, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/education/delete",
      {
        method: "POST",
        body: JSON.stringify({
          _id: id,
          admin_password: password,
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
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in deleteEdu`);
  }
}

async function editEduPre(data) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to edit this education?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("editExistingEdu");
    className_admin = "editExistingEdu";
    admin_password_submit_btn.value = JSON.stringify(data);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editEduPre`);
  }
}

async function editEdu(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/education/update",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      await getDeveloperEdu();
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
    }
    showNotification(data.message);
  } catch (error) {
    console.log(`Error: ${error.toString()} in editEdu`);
  }
}

// ** PROJECT
async function getProjectAll() {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/project/all",
      {
        method: "POST",
        body: JSON.stringify({
          options:
            "-detailed_description -techStack -links -updatedAt -startedOn -finishedOn -contributors",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    let container = document.querySelector(".project-list");
    let result = "";
    if (!!data && data.success == true) {
      projectStartpoint = data.nextStartPoint;
      data.projects.forEach((el) => {
        let isActive = el.active == true ? "checked" : "";
        result += `<div class="project-template">
        <div class="project-template-top">
          <div class="project-name">${el.title}</div>
          <div class="toggle-inner-field">
            <label class="toggle">
              <input
                type="checkbox"
                class="checkbox-status-toggle project-status"
                ${isActive}
              />
              <span class="checkbox-slider"></span>
            </label>
          </div>
        </div>
        <div class="project-description">${el.brief_description}</div>
        <div class="project-temp-bottom">
          <p class="project-createdAt">${formatDate(el.createdAt)}</p>
          <button class="view-project" value="${el._id}">
            View Details
          </button>
        </div>
      </div>`;
      });
      container.innerHTML = result;
      container.scrollTop = 0;
    } else {
      showNotification("No project is published yet.");
    }
  } catch (error) {
    console.log(`Erro: ${error.toString()} in getProjectAll`);
  }
}

async function addProjectPre(data) {
  try {
    openedContainer.classList.add("hide");
    let confirm = await showConfirmation("Do you want to add this project?");
    if (!confirm) return;
    blurbg.classList.remove("hide");
    admin_password_container.classList.remove("hide");
    admin_password_inp.value = "";
    admin_password_submit_btn.classList.add("addNewProject");
    className_admin = "addNewProject";
    admin_password_submit_btn.value = JSON.stringify(data);
  } catch (error) {
    console.log(`Error: ${error.toString()} in addProjectPre`);
  }
}

async function addProject(query, password) {
  try {
    let response = await fetch(
      "http://127.0.0.1:4000/api/v1/admin/developer/project/add",
      {
        method: "POST",
        body: JSON.stringify({
          ...query,
          admin_password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );
    let data = await response.json();
    if (!!data && data.success == true) {
      await getProjectAll();
      isFetching = false;
      admin_password_submit_btn.classList.remove(className_admin);
      admin_password_container.classList.add("hide");
      blurbg.classList.add("hide");
      showNotification("New project is added successfully.");
    } else {
      showNotification(data.message);
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in addProject`);
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

    if (target.dataset.classname == "about-section") {
      await Promise.all([getDeveloperExps(), getDeveloperEdu()]);
    }
    if (target.dataset.classname == "project-section") {
      isFetching = false;
      await getProjectAll();
    }
  }
});

// ** ADMIN PASSWORD CONFIRM
admin_password_submit_btn.addEventListener("click", async () => {
  let password = document.querySelector(".admin-password-inp").value.trim();
  if (password != "") {
    if (
      admin_password_submit_btn.classList.contains("updateDeveloperDetails")
    ) {
      await updateDeveloper(
        JSON.parse(admin_password_submit_btn.value),
        password
      );
    } else if (admin_password_submit_btn.classList.contains("addNewDevRole")) {
      await addRole(admin_password_submit_btn.value, password);
    } else if (admin_password_submit_btn.classList.contains("editNewDevRole")) {
      await editRole(JSON.parse(admin_password_submit_btn.value), password);
    } else if (
      admin_password_submit_btn.classList.contains("deleteNewDevRole")
    ) {
      await deleteRole(admin_password_submit_btn.value, password);
    } else if (
      admin_password_submit_btn.classList.contains("addSocialMediaHandle")
    ) {
      await addSocialMedia(
        JSON.parse(admin_password_submit_btn.value),
        password
      );
    } else if (
      admin_password_submit_btn.classList.contains("editSocialMediaHandle")
    ) {
      await editSocialMedia(
        JSON.parse(admin_password_submit_btn.value),
        password
      );
    } else if (
      admin_password_submit_btn.classList.contains("deleteSocialMediaHandle")
    ) {
      await deleteSocialMedia(admin_password_submit_btn.value, password);
    } else if (admin_password_submit_btn.classList.contains("addNewSkill")) {
      await addSkill(admin_password_submit_btn.value, password);
    } else if (admin_password_submit_btn.classList.contains("addNewExp")) {
      await addExp(JSON.parse(admin_password_submit_btn.value), password);
    } else if (admin_password_submit_btn.classList.contains("addNewEdu")) {
      await addEdu(JSON.parse(admin_password_submit_btn.value), password);
    } else if (admin_password_submit_btn.classList.contains("deleteSkill")) {
      await deleteSkill(admin_password_submit_btn.value, password);
    } else if (admin_password_submit_btn.classList.contains("deleteExp")) {
      await deleteExp(admin_password_submit_btn.value, password);
    } else if (admin_password_submit_btn.classList.contains("deleteEdu")) {
      await deleteEdu(admin_password_submit_btn.value, password);
    } else if (admin_password_submit_btn.classList.contains("editSkill")) {
      await editSkill(JSON.parse(admin_password_submit_btn.value), password);
    } else if (
      admin_password_submit_btn.classList.contains("editExistingExp")
    ) {
      await editExp(JSON.parse(admin_password_submit_btn.value), password);
    } else if (
      admin_password_submit_btn.classList.contains("editExistingEdu")
    ) {
      await editEdu(JSON.parse(admin_password_submit_btn.value), password);
    } else if (admin_password_submit_btn.classList.contains("addNewProject")) {
      await addProject(JSON.parse(admin_password_submit_btn.value), password);
    }
  } else {
    showNotification("Pasword is required.");
  }
});

document
  .querySelector(".close-admin-container")
  .addEventListener("click", () => {
    admin_password_container.classList.add("hide");
    blurbg.classList.add("hide");
    document.querySelector(".admin-password-inp").value = "";
    admin_password_submit_btn.classList.forEach((el) => {
      if (el != "admin-pass-btn") {
        admin_password_submit_btn.classList.remove(el);
      }
    });
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
  localStorage.removeItem("timerRunning");
  sessionStorage.removeItem("token");
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
        ...{
          name: container.querySelector("a").textContent,
          link: container.querySelector("a").href,
          icon: container.querySelector("p i").outerHTML,
          _id: target.dataset.id,
        },
      };
    }
    if (target.classList.contains("fa-trash")) {
      targetedContainer = target.closest(".home-mid-social-handle");
      await deleteSocialMediaPre(target.dataset.id);
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
    await addSocialMediaPre(data);
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
    await editSocialMediaPre(data);
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
        ...{
          name: container.querySelector("p").textContent,
          _id: target.dataset.id,
        },
      };
    }
    if (target.classList.contains("fa-trash")) {
      targetedContainer = target.closest(".home-mid-dev-role");
      await deleteRolePre(target.dataset.id);
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
  await addRolePre(name);
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
  await editRolePre(data);
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
    data._id = document.querySelector(".edit-admin-icon").dataset.id;
    await updateDeveloperPre(data);
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

// ** SKILL
document.querySelector(".add-dev-skill").addEventListener("click", () => {
  openedContainer = document.querySelector(".add-skill");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
  document.querySelector(".about-new-skill-name").value = "";
});

document.querySelector(".add-skill-btn").addEventListener("click", async () => {
  let skillName = document.querySelector(".about-new-skill-name").value.trim();
  if (!skillName) {
    showNotification("Name is required.");
    return;
  }
  await addSkillPre(skillName);
});

document
  .querySelector(".dev-skill-container")
  .addEventListener("click", async (e) => {
    let target = e.target;
    if (target.classList.contains("fa-trash")) {
      targetedContainer = target.closest(".about-sub-con");
      await deleteSkillPre(target.dataset.id);
    } else if (target.classList.contains("fa-pen")) {
      let container = target.closest(".about-sub-con");
      openedContainer = document.querySelector(".edit-skill-container");
      openedContainer.classList.remove("hide");
      blurbg.classList.remove("hide");
      document.querySelector(".edit-skill-name").value =
        container.querySelector("p").textContent;
      tempData = {
        ...{
          name: container.querySelector("p").textContent.trim(),
          _id: target.dataset.id,
        },
      };
    }
  });

document
  .querySelector(".edit-skill-btn")
  .addEventListener("click", async () => {
    let count = 0;
    let data = {};
    let name = document.querySelector(".edit-skill-name").value.trim();
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
    await editSkillPre(data);
  });

// ** EXPERIENCE
document.querySelector(".add-dev-exp").addEventListener("click", () => {
  openedContainer = document.querySelector(".add-experience");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
  document.querySelector(".about-new-exp-role").value = "";
  document.querySelector(".about-new-exp-from").value = "";
  document.querySelector(".about-new-exp-to").value = "";
  document.querySelector(".about-new-exp-isCurrent").checked = true;
});

document.querySelector(".add-exp-btn").addEventListener("click", async () => {
  let role = document.querySelector(".about-new-exp-role").value.trim();
  let from = document.querySelector(".about-new-exp-from").value.trim();
  let to = document.querySelector(".about-new-exp-to").value.trim();
  let current = document.querySelector(".about-new-exp-isCurrent").checked;
  let invalidFields = [];
  if (!role) {
    invalidFields.push("role");
  }
  if (!from) {
    invalidFields.push("from");
  }
  if (!current) {
    if (!to) {
      invalidFields.push("to");
    }
  }
  if (invalidFields.length != 0) {
    showNotification(`Required: ${invalidFields.join(", ")}`);
    return;
  }
  let data = {
    role,
    from: Number(from),
    to: Number(to) || 0,
    current,
  };
  await addExpPre({ ...data });
});

document
  .querySelector(".dev-exp-container")
  .addEventListener("click", async (e) => {
    let target = e.target;
    if (target.classList.contains("fa-trash")) {
      targetedContainer = target.closest(".about-sub-con");
      await deleteExpPre(target.dataset.id);
    } else if (target.classList.contains("fa-pen")) {
      let container = target.closest(".about-sub-con");
      openedContainer = document.querySelector(".edit-experience-container");
      openedContainer.classList.remove("hide");
      blurbg.classList.remove("hide");
      document.querySelector(".edit-exp-role").value =
        container.querySelector(".dev-exp-role").textContent;
      document.querySelector(".edit-exp-from").value = Number(
        container.querySelector(".dev-exp-role-from").textContent
      );
      let to =
        container.querySelector(".dev-exp-role-to").textContent == "Current"
          ? ""
          : Number(container.querySelector(".dev-exp-role-to").textContent);
      document.querySelector(".edit-exp-to").value = to;
      document.querySelector(".edit-exp-isCurrent").checked =
        container.querySelector(".dev-exp-role-to").textContent == "Current";
      tempData = {
        ...{
          role: container.querySelector(".dev-exp-role").textContent.trim(),
          from: Number(
            container.querySelector(".dev-exp-role-from").textContent.trim()
          ),
          to: Number(document.querySelector(".edit-exp-to").value.trim()),
          current: document.querySelector(".edit-exp-isCurrent").checked,
          _id: target.dataset.id,
        },
      };
    }
  });

document.querySelector(".edit-exp-btn").addEventListener("click", async () => {
  let role = document.querySelector(".edit-exp-role").value.trim();
  let from = Number(document.querySelector(".edit-exp-from").value.trim());
  let to = Number(document.querySelector(".edit-exp-to").value.trim());
  let current = document.querySelector(".edit-exp-isCurrent").checked;
  let data = {};
  let count = 0;
  if (tempData.role != role) {
    count++;
    data.role = role;
  }
  if (tempData.from != from) {
    count++;
    data.from = from;
  }
  if (tempData.to != to) {
    count++;
    data.to = to;
  }
  if (tempData.current != current) {
    count++;
    data.current = current;
  }
  if (!current) {
    if (to == "") {
      showNotification("Current is off so put the year in to field.");
      return;
    }
  }
  if (current) {
    if (!!to) {
      showNotification("Current is on so turn it off or clear the to field.");
      return;
    }
  }
  if (count == 0) {
    showNotification("No change has been made.");
    openedContainer.classList.add("hide");
    blurbg.classList.add("hide");
    return;
  }
  data._id = tempData._id;
  await editExpPre(data);
});

// ** EDUCATION
document.querySelector(".add-dev-edu").addEventListener("click", () => {
  openedContainer = document.querySelector(".add-education");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
  document.querySelector(".about-new-edu-institute").value = "";
  document.querySelector(".about-new-edu-from").value = "";
  document.querySelector(".about-new-edu-to").value = "";
  document.querySelector(".about-new-edu-isCurrent").checked = true;
});

document.querySelector(".add-edu-btn").addEventListener("click", async () => {
  let institute = document
    .querySelector(".about-new-edu-institute")
    .value.trim();
  let from = document.querySelector(".about-new-edu-from").value.trim();
  let to = document.querySelector(".about-new-edu-to").value.trim();
  let current = document.querySelector(".about-new-edu-isCurrent").checked;
  let invalidFields = [];
  if (!institute) {
    invalidFields.push("institute");
  }
  if (!from) {
    invalidFields.push("from");
  }
  if (!current) {
    if (!to) {
      invalidFields.push("to");
    }
  }
  if (invalidFields.length != 0) {
    showNotification(`Required: ${invalidFields.join(", ")}`);
    return;
  }
  let data = {
    institute,
    from: Number(from),
    to: Number(to) || 0,
    current,
  };
  await addEduPre({ ...data });
});

document
  .querySelector(".dev-edu-container")
  .addEventListener("click", async (e) => {
    let target = e.target;
    if (target.classList.contains("fa-trash")) {
      targetedContainer = target.closest(".about-sub-con");
      await deleteEduPre(target.dataset.id);
    } else if (target.classList.contains("fa-pen")) {
      let container = target.closest(".about-sub-con");
      openedContainer = document.querySelector(".edit-education-container");
      openedContainer.classList.remove("hide");
      blurbg.classList.remove("hide");
      document.querySelector(".edit-edu-institute").value =
        container.querySelector(".dev-edu-role").textContent;
      document.querySelector(".edit-edu-from").value = Number(
        container.querySelector(".dev-edu-role-from").textContent
      );
      let to =
        container.querySelector(".dev-edu-role-to").textContent == "Current"
          ? ""
          : Number(container.querySelector(".dev-edu-role-to").textContent);
      document.querySelector(".edit-edu-to").value = to;
      document.querySelector(".edit-edu-isCurrent").checked =
        container.querySelector(".dev-edu-role-to").textContent == "Current";
      tempData = {
        ...{
          institute: container
            .querySelector(".dev-edu-role")
            .textContent.trim(),
          from: Number(
            container.querySelector(".dev-edu-role-from").textContent.trim()
          ),
          to: Number(document.querySelector(".edit-edu-to").value.trim()),
          current: document.querySelector(".edit-edu-isCurrent").checked,
          _id: target.dataset.id,
        },
      };
    }
  });

document.querySelector(".edit-edu-btn").addEventListener("click", async () => {
  let institute = document.querySelector(".edit-edu-institute").value.trim();
  let from = Number(document.querySelector(".edit-edu-from").value.trim());
  let to = Number(document.querySelector(".edit-edu-to").value.trim());
  let current = document.querySelector(".edit-edu-isCurrent").checked;
  let data = {};
  let count = 0;
  if (tempData.institute != institute) {
    count++;
    data.institute = institute;
  }
  if (tempData.from != from) {
    count++;
    data.from = from;
  }
  if (tempData.to != to) {
    count++;
    data.to = to;
  }
  if (tempData.current != current) {
    count++;
    data.current = current;
  }
  if (!current) {
    if (to == "") {
      showNotification("Current is off so put the year in to field.");
      return;
    }
  }
  if (current) {
    if (!!to) {
      showNotification("Current is on so turn it off or clear the to field.");
      return;
    }
  }
  if (count == 0) {
    showNotification("No change has been made.");
    openedContainer.classList.add("hide");
    blurbg.classList.add("hide");
    return;
  }
  data._id = tempData._id;
  await editEduPre(data);
});

// ** ADD PROJECT
document.querySelector(".add-new-project").addEventListener("click", () => {
  openedContainer = document.querySelector(".add-project-container");
  openedContainer.classList.remove("hide");
  blurbg.classList.remove("hide");
  let result = "";
  techStack?.forEach((el) => {
    result += `<option value="${el._id}">${el.name}</option>`;
  });
  document.querySelector(".add-project-tech-stack").innerHTML = result;
  document
    .querySelector(".add-project-tech-stack")
    .insertAdjacentHTML(
      "afterbegin",
      '<option value="" selected>Select Tech Stack</option>'
    );
  addedTechStack.length = 0;
});

document
  .querySelector(".add-project-btn")
  .addEventListener("click", async () => {
    let title = document.querySelector(".add-project-title").value.trim();
    let brief_description = document.querySelector(
      ".add-project-brief-des"
    ).value;
    let detailed_description = document.querySelector(
      ".add-project-detailed-des"
    ).value;
    let invalidFields = [];
    if (!title) {
      invalidFields.push("title");
    }
    if (!brief_description) {
      invalidFields.push("brief description");
    }
    if (!detailed_description) {
      invalidFields.push("detailed description");
    }
    if (invalidFields.length != 0) {
      showNotification(`Required: ${invalidFields.join(", ")}`);
      return;
    }
    tempData = {
      title,
      brief_description,
      detailed_description,
    };
    openedContainer.classList.add("hide");
    openedContainer = document.querySelector(".add-project-more-des-container");
    openedContainer.classList.remove("hide");
  });

// ** FETCH PROJECT
document
  .querySelector(".project-list")
  .addEventListener("scroll", async (event) => {
    let { scrollHeight, scrollTop, clientHeight } = event.target;
    if (
      Math.abs(scrollHeight - clientHeight - scrollTop) < 100 &&
      !isFetching
    ) {
      isFetching = true;
      try {
        let response = await fetch(
          "http://127.0.0.1:4000/api/v1/admin/developer/project/all",
          {
            method: "POST",
            body: JSON.stringify({
              startPoint: projectStartpoint,
              options:
                "-detailed_description -techStack -links -updatedAt -startedOn -finishedOn -contributors",
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionStorage.getItem("token"),
            },
          }
        );
        let data = await response.json();
        let container = document.querySelector(".project-list");
        let result = "";
        if (!!data && data.success == true) {
          projectStartpoint = data.nextStartPoint;
          data.projects.forEach((el) => {
            let isActive = el.active == true ? "checked" : "";
            result += `<div class="project-template">
          <div class="project-template-top">
            <div class="project-name">${el.title}</div>
            <div class="toggle-inner-field">
              <label class="toggle">
                <input
                  type="checkbox"
                  class="checkbox-status-toggle project-status"
                  ${isActive}
                />
                <span class="checkbox-slider"></span>
              </label>
            </div>
          </div>
          <div class="project-description">${el.brief_description}</div>
          <div class="project-temp-bottom">
            <p class="project-createdAt">${formatDate(el.createdAt)}</p>
            <button class="view-project" value="${el._id}">
              View Details
            </button>
          </div>
        </div>`;
          });
          let prevScrollHeight = container.scrollHeight;
          container.insertAdjacentHTML("beforeend", result);
          container.scrollTop = prevScrollHeight;
        }
      } catch (error) {
        console.log(`Error: ${error.toString()} in allProjectScroll`);
      }
    }
  });

// ** ADD TECH STACK
document
  .querySelector(".add-project-tech-stack-list")
  .addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("fa-xmark")) {
      let container = target.closest(".tech-stack-container");
      container.remove();
      let idToRemove = target.dataset.id;
      let removed = false;
      addedTechStack = addedTechStack.filter((item) => {
        if (!removed && item === idToRemove) {
          removed = true;
          return false;
        }
        return true;
      });
      if (addedTechStack.length == 0) {
        document.querySelector(".add-project-tech-stack-list").innerHTML =
          "No tech stack is added yet.";
      }
    }
  });

document
  .querySelector(".add-project-tech-stack")
  .addEventListener("change", (e) => {
    let target = e.target;
    let container = document.querySelector(".add-project-tech-stack-list");
    if (target.value !== "") {
      let result = `
          <div class="tech-stack-container">
            <p class="tech-stack-name">${
              target.options[target.selectedIndex].text
            }</p>
            <i class="fa-solid fa-xmark cancel-tech-stack" data-id="${
              target.value
            }"></i>
          </div>`;
      addedTechStack.push(target.value);
      if (addedTechStack.length == 1) {
        container.innerHTML = "";
      }
      container.insertAdjacentHTML("beforeend", result);
      target.value = "";
    }
  });

// ** ADD PROJECT LINK
document.querySelector(".add-project-link").addEventListener("click", () => {
  openedContainer.classList.add("hide");
  openedContainer = document.querySelector(".add-project-link-container");
  openedContainer.classList.remove("hide");
  document.querySelector(".add-project-link-title").value = "";
  document.querySelector(".add-project-link-url").value = "";
});

document
  .querySelector(".add-project-link-btn")
  .addEventListener("click", () => {
    let link_title = document
      .querySelector(".add-project-link-title")
      .value.trim();
    let link_url = document.querySelector(".add-project-link-url").value.trim();
    let urlPattern = /^(https?|https):\/\/[\w.-]+\.\w+[/?].*$/;
    let i = Math.floor(Math.random() * 1000000 + 1);
    let invalidFields = [];
    if (!link_title) {
      invalidFields.push("Link title");
    }
    if (!link_url) {
      invalidFields.push("Link URL");
    }

    if (invalidFields.length != 0) {
      showNotification(`Required: ${invalidFields.join(", ")}`);
      return;
    }
    if (!urlPattern.test(link_url)) {
      showNotification("URL is not valid.");
      return;
    }
    addedLinks.push({ link_title, link_url, i });
    if (addedLinks.length == 1) {
      document.querySelector(".add-project-link-list").innerHTML = "";
    }
    let result = `
    <div class="project-link-container">
    <a
      href="${link_url}"
      class="add-project-link"
      target="_blank"
      >${link_title}</a
    >
    <i class="fa-solid fa-xmark cancel-project-link" data-index="${i}"></i>
  </div>`;
    document
      .querySelector(".add-project-link-list")
      .insertAdjacentHTML("beforeend", result);
    openedContainer.classList.add("hide");
    openedContainer = document.querySelector(".add-project-more-des-container");
    openedContainer.classList.remove("hide");
    showNotification("Project link is added.");
  });

document
  .querySelector(".visit-addedlink-in-new-project")
  .addEventListener("click", () => {
    let value = document.querySelector(".add-project-link-url").value.trim();
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
  .querySelector(".add-project-link-list")
  .addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("cancel-project-link")) {
      let container = target.closest(".project-link-container");
      container.remove();
      let idToRemove = Number(target.dataset.index);
      addedLinks = addedLinks.filter((item) => item.i !== idToRemove);
      if (addedLinks.length == 0) {
        document.querySelector(".add-project-link-list").innerHTML =
          "No project link is added yet.";
      }
    }
  });

// ** ADD CONTRIBUTOR
document
  .querySelector(".add-project-contributor")
  .addEventListener("click", () => {});

// ** CLOSE ALL OPENED CONTAINER
document.querySelectorAll(".container-top i").forEach((el) => {
  el.addEventListener("click", (e) => {
    let target = e.target;
    openedContainer?.classList.add("hide");
    blurbg.classList.add("hide");
    if (target.classList.contains("close-add-project-link-container")) {
      openedContainer = document.querySelector(
        ".add-project-more-des-container"
      );
      openedContainer.classList.remove("hide");
      blurbg.classList.remove("hide");
    }
    if (target.classList.contains("close-add-project-more-des-container")) {
      openedContainer = document.querySelector(".add-project-container");
      openedContainer.classList.remove("hide");
      blurbg.classList.remove("hide");
    }
  });
});
