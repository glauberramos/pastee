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

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function placeCaretAtEnd(element) {
  element.focus();

  if (
    typeof window.getSelection != "undefined" &&
    typeof document.createRange != "undefined"
  ) {
    var range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(element);
    textRange.collapse(false);
    textRange.select();
  }
}

function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}
