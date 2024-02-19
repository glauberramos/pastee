function countWords(str) {
  const words = str.trim().split(/\s+/).length;
  const chars = str
    .match(/./gu)
    .map((char) => char.trim())
    .filter((char) => char).length;
  document.getElementById("words").innerText =
    words + " words " + chars + " chars";
}

document.addEventListener("DOMContentLoaded", function () {
  var paste = document.getElementById("paste");
  paste.scrollTop = 0;
  paste.innerHTML = localStorage.getItem("paste");
  countWords(paste.innerText);

  if (paste.addEventListener) {
    paste.addEventListener(
      "input",
      function () {
        localStorage.setItem("paste", paste.innerHTML);
        countWords(paste.innerText);
      },
      false
    );
  } else if (paste.attachEvent) {
    paste.attachEvent("onpropertychange", function () {
      localStorage.setItem("paste", paste.innerHTML);
      countWords(paste.innerText);
    });
  }
});
