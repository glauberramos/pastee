function countWords(str) {
  const words = str
    .trim()
    .split(/\s+/)
    .filter((char) => char).length;

  const allChars = str.match(/./gu);
  const chars =
    allChars &&
    allChars.map((char) => char.trim()).filter((char) => char).length;

  document.getElementById("words").innerText = `${words} words ${
    chars ? chars : 0
  } chars`;
}

document.addEventListener("DOMContentLoaded", function () {
  var paste = document.getElementById("paste");
  paste.scrollTop = 0;
  paste.innerHTML = localStorage.getItem("paste");
  countWords(paste.innerText);

  if (paste.addEventListener) {
    paste.addEventListener("input", function () {
      localStorage.setItem("paste", paste.innerHTML);
      countWords(paste.innerText);
    });

    paste.addEventListener("click", function (event) {
      deletePopup();

      if (event.target.tagName === "A") {
        createPopup(event.target.innerText.trim(), event);
      }
    });

    paste.addEventListener("change", function (event) {
      if (!event.target.hasAttribute("checked")) {
        event.target.setAttribute("checked", "checked");
      } else {
        event.target.removeAttribute("checked");
      }

      localStorage.setItem("paste", paste.innerHTML);
    });
  } else if (paste.attachEvent) {
    paste.attachEvent("onpropertychange", function () {
      localStorage.setItem("paste", paste.innerHTML);
      countWords(paste.innerText);
    });
  }
});

window.onfocus = function () {
  var paste = document.getElementById("paste");
  paste.innerHTML = localStorage.getItem("paste");
};

function createLink() {
  const selection = window.getSelection().toString().trim();
  document.execCommand("createLink", false, selection);
}

function deleteLink() {
  deletePopup();
  document.execCommand("unlink", false, null);
}

function createPopup(linkText, event) {
  var popup = document.createElement("div");
  popup.setAttribute("class", "popup");
  popup.style.top = event.clientY + 15 + "px";
  popup.style.left = event.offsetX + "px";
  var link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", linkText);
  link.setAttribute("rel", "noopener noreferrer");
  link.innerHTML = linkText;
  popup.innerHTML = "Visit URL: ";
  popup.appendChild(link);

  document.getElementById("container").appendChild(popup);
}

function deletePopup() {
  var popup = document.getElementsByClassName("popup");
  if (popup.length > 0) {
    popup[0].parentNode.removeChild(popup[0]);
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

function insertCheckbox() {
  const selection = window.getSelection().toString().trim();

  if (selection) {
    let currentHtml = localStorage.getItem("paste");
    let indexPosition = currentHtml.indexOf(selection);

    let newHtml =
      currentHtml.slice(0, indexPosition) +
      '<input type="checkbox"><span style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">&nbsp;</span>' +
      currentHtml.slice(indexPosition);

    paste.innerHTML = newHtml;
    localStorage.setItem("paste", paste.innerHTML);
  }
}
