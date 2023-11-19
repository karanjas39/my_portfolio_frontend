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
    console.log(`Error: ${error}.toString() in initC`);
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
  } catch (error) {
    console.log(`Error: ${error.toString()} in changeImagesC`);
  }
}

// ***************************************************************************************************EVENT LISTNERS
// NOTIFICATION CLOSE
document.querySelector(".popup-msg-close").addEventListener("click", () => {
  hideNotification();
});
