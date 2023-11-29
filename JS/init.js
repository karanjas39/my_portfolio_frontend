// @collapse
let notificationTimeout;
let progressBarInterval;

// *****************************************************************************************************FUNCTIONS

// ONLOAD
function init() {
  try {
    let theme = localStorage.getItem("theme");
    if (theme == "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.querySelector(".theme-icon").classList.value =
        "fa theme-icon fa-moon";
      changeImages("dark");
    }
  } catch (error) {
    console.log(`Error: ${error.toString()} in initC`);
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

// CHANGE IMAGES AS PER THEME
function changeImages(color) {
  try {
    document.querySelector(
      ".programmer-svg"
    ).src = `.././UTILS/programmer-${color}.svg`;
    document.querySelector(".about-svg").src = `.././UTILS/about-${color}.svg`;
    let col = color == "dark" ? "%23ffffff" : "%23393646";
    document.querySelector(
      "body"
    ).style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${col}' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
  } catch (error) {
    console.log(`Error: ${error.toString()} in changeImagesC`);
  }
}

// ***************************************************************************************************EVENT LISTNERS
// NOTIFICATION CLOSE
document.querySelector(".popup-msg-close").addEventListener("click", () => {
  hideNotification();
});
