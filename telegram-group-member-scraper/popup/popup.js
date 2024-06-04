//just for sending a signal to "content.js" to start scraping
document.getElementById("scraping-btn").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {msg: "do-scraping"});
  });
  window.close();
});

