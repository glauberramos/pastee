let allNotes = {};
let selectedKey;
let orderedKeys;
let checkboxInLine = false;

function loadNotes() {
  document.getElementById("notes-menu").innerHTML = null;

  orderedKeys = Object.keys(localStorage)
    .map((key) => parseInt(key.split("paste")[1], 10) || 0)
    .sort(function (a, b) {
      return a - b;
    });

  if (orderedKeys.length === 0) {
    selectedKey = "paste";
  }

  if (orderedKeys.length === 1) {
    selectedKey = "paste" + (orderedKeys[0] ? orderedKeys[0] : "");
  }

  if (orderedKeys.length > 1) {
    for (let [index, keyIndex] of orderedKeys.entries()) {
      const key = "paste" + (keyIndex ? keyIndex : "");
      let value = localStorage[key];

      document.getElementById("notes-menu").appendChild(createLi(index, key));

      allNotes[key] = value;
    }
  }

  var paste = document.getElementById("paste");
  paste.scrollTop = 0;
  paste.innerHTML = localStorage.getItem(selectedKey);
  placeCaretAtEnd(paste);
  countWords(paste.innerText);
}

function createLi(index, key) {
  var li = document.createElement("li");

  li.innerHTML = '<div class="border-item"></div>' + (index + 1) + ". note";
  li.setAttribute("data-key", key);
  li.addEventListener("click", function () {
    changeNote(this.getAttribute("data-key"));
  });

  var a = document.createElement("a");
  a.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>';
  a.setAttribute("data-key", key);
  a.addEventListener("click", function (event) {
    event.stopPropagation();
    removeNote(this.getAttribute("data-key"));
  });

  li.appendChild(a);

  if (!selectedKey || selectedKey === key) {
    selectedKey = key;
    li.classList.add("active");
  }

  return li;
}

document.addEventListener("DOMContentLoaded", function () {
  loadNotes();

  if (paste.addEventListener) {
    paste.addEventListener("input", function () {
      localStorage.setItem(selectedKey, paste.innerHTML);
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

      localStorage.setItem(selectedKey, paste.innerHTML);
    });

    paste.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        checkboxInLine = false;

        const range = window.getSelection().getRangeAt(0);
        const currentNode = range.commonAncestorContainer;
        let currentLine = currentNode;

        while (currentLine && currentLine !== paste) {
          var inputs = isElement(currentLine)
            ? currentLine.getElementsByTagName("input")
            : [];

          if (inputs.length > 0 ? inputs[0].type === "checkbox" : false) {
            checkboxInLine = true;
            break;
          }

          currentLine = currentLine.parentNode;
        }
      }
    });

    paste.addEventListener("keyup", function (event) {
      if (event.key === "Enter" && checkboxInLine) {
        document.execCommand(
          "insertHTML",
          true,
          '<input type="checkbox"><span style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">&nbsp;</span>'
        );
      }
    });
  } else if (paste.attachEvent) {
    paste.attachEvent("onpropertychange", function () {
      localStorage.setItem(selectedKey, paste.innerHTML);
      countWords(paste.innerText);
    });
  }

  document.querySelector("#about-icon").onclick = function () {
    document.querySelector("#about").showModal();
  };

  document.querySelector("#keyboard-icon").onclick = function () {
    document.querySelector("#keyboard").showModal();
  };

  document.getElementById("save-note").onclick = function () {
    this.download = "note.txt";
    this.href = URL.createObjectURL(
      new Blob([document.querySelector("#paste").innerText], {
        type: "text/plain",
      })
    );
  };
});

window.onfocus = function () {
  var paste = document.getElementById("paste");
  paste.innerHTML = localStorage.getItem(selectedKey);
};

function createLink() {
  const selection = window.getSelection().toString().trim();
  document.execCommand("createLink", false, selection);
}

function deleteLink(element) {
  deletePopup();
  selectElementContents(element);
  document.execCommand("unlink", false, null);
  window.getSelection().removeAllRanges();
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

  var removeLink = document.createElement("a");
  removeLink.innerHTML = "Remove link";
  removeLink.setAttribute("href", "#");
  removeLink.onclick = function () {
    deleteLink(event.target);
  };

  var textNode = document.createTextNode(" - ");
  popup.appendChild(textNode);
  popup.appendChild(removeLink);

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

function changeNote(noteKey) {
  var paste = document.getElementById("paste");
  paste.innerHTML = localStorage.getItem(noteKey);

  countWords(paste.innerText);

  document
    .querySelector(`li[data-key="${selectedKey}"]`)
    .classList.remove("active");

  selectedKey = noteKey;

  document
    .querySelector(`li[data-key="${selectedKey}"]`)
    .classList.add("active");

  placeCaretAtEnd(paste);
}

function removeNote(noteKey) {
  var result = confirm("Are you sure you want to delete this note?");

  if (result) {
    localStorage.removeItem(noteKey);

    if (noteKey === selectedKey) {
      orderedKeys.splice(orderedKeys.indexOf(noteKey), 1);
      selectedKey = "paste" + (orderedKeys[0] ? orderedKeys[0] : "");
    }

    loadNotes();
  }
}

function newNote() {
  const keys = Object.keys(localStorage)
    .map((key) => parseInt(key.split("paste")[1], 10) || 0)
    .sort(function (a, b) {
      return a - b;
    });

  let lastIndex = keys.slice(-1);
  let newKey = "paste" + (parseInt(lastIndex, 10) + 1);

  localStorage.setItem(newKey, "");
  loadNotes();
  changeNote(newKey);
}

function getNextNode(node) {
  if (node.firstChild) return node.firstChild;

  while (node) {
    if (node.nextSibling) return node.nextSibling;
    node = node.parentNode;
  }
}

function getElement(node) {
  return isElement(node) ? node : node.parentElement;
}

function insertCheckbox(element) {
  const space = document.createElement("span");
  space.innerHTML = "&nbsp;";
  space.style =
    "font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;";
  element.prepend(space);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  element.prepend(checkbox);
}

function addCheckboxesToSelection() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  let currentNode = range.startContainer;
  let lines = [];

  if (range.startContainer === range.endContainer) {
    lines.push(getElement(range.startContainer));
  }

  while (currentNode && currentNode !== range.endContainer) {
    const addElement = getElement(currentNode);

    if (lines.indexOf(addElement) === -1 && addElement.tagName === "DIV") {
      lines.push(addElement);
    }

    currentNode = getNextNode(currentNode);
  }

  for (line of lines) {
    insertCheckbox(line);
  }

  localStorage.setItem(selectedKey, paste.innerHTML);
}

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "n") {
    newNote();
  }

  if (event.ctrlKey && event.key === "l") {
    document.execCommand("insertUnorderedList", false, null);
  }

  if (event.ctrlKey && event.key === "o") {
    document.execCommand("insertOrderedList", false, null);
  }

  if (event.ctrlKey && event.key === "q") {
    addCheckboxesToSelection();
  }

  if (event.ctrlKey && event.key === "w") {
    createLink();
  }
});
