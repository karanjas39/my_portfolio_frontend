// @collapse
let notificationTimeout;
let progressBarInterval;

// *****************************************************************************************************FUNCTIONS

// ONLOAD
function details() {
  try {
    let theme = localStorage.getItem("theme");
    if (theme == "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.querySelector(".theme-icon").classList.value =
        "fa theme-icon fa-moon";
    }
    changeTheme(theme);
    setup_dashboard();
    document.querySelector(".fa-house").style.color = "var(--color2)";
  } catch (error) {
    console.log(`Error: ${error.toString()} in detailsC`);
  }
}

// HIDE NOTIFICATION
function hideNotification() {
  try {
    clearInterval(progressBarInterval);
    clearTimeout(notificationTimeout);
    document.querySelector(".popup-msg").style.display = "none";
  } catch (error) {
    console.log(`Error: ${error.toString()} in hideNotification`);
  }
}

// SHOW NOTIFICATION
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

// SETUP DASHBOARD
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

// ***************************************************************************************************EVENT LISTNERS

// NAV LINKS
document.querySelectorAll(".active-nav-link").forEach((el) => {
  el.addEventListener("click", async (el) => {
    let target = el.target;
    let container = target.closest(".active-nav-link");
    document.querySelectorAll(".main-container>section").forEach((el) => {
      el.classList.add("hide");
    });
    document.querySelectorAll(".nav-links i").forEach((el) => {
      el.style.color = "var(--color1)";
    });
    target.closest("i").style.color = "var(--color2)";
    document
      .querySelector(`.${container.dataset.value}`)
      .classList.remove("hide");
  });
});

// NOTIFICATION CLOSE
document.querySelector(".popup-msg-close").addEventListener("click", () => {
  hideNotification();
});

// CHANGE THEME
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
