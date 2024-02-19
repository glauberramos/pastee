function countWords(str) {
  const words = str
    .trim()
    .split(/\s+/)
    .filter((char) => char).length;

  const allChars = str.match(/./gu);
  const chars =
    allChars &&
    allChars.map((char) => char.trim()).filter((char) => char).length;

  document.getElementById("words").innerText = `${words} word ${
    chars ? chars : 0
  } chars`;
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
