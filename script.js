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

    paste.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    paste.addEventListener("click", function (event) {
      deletePopup();

      if (event.target.tagName === "A") {
        createPopup(event.target.innerText.trim(), event);
      }
    });
  } else if (paste.attachEvent) {
    paste.attachEvent("onpropertychange", function () {
      localStorage.setItem("paste", paste.innerHTML);
      countWords(paste.innerText);
    });
  }
});

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
  popup.style.top = event.clientY - 30 + "px";
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
