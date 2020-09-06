var radioaudio = new Audio();
var radiolink = "https://cast.animu.com.br:8021/stream?";
radioaudio.volume = localStorage.getItem("animuwebext-lastvolbar") / 100;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "animuwebext-play") {
    radioaudio.src = radiolink + "?" + Math.random();
    radioaudio.load;
    radioaudio.play();
    console.log(radioaudio.paused);
  } else if (request.action == "animuwebext-pause") {
    radioaudio.pause();
    radioaudio.currentTime = 0;
    radioaudio.src = "";
  } else if (request.action == "animuwebext-areyouplaying") {
    if (radioaudio.paused) {
      chrome.runtime.sendMessage({ action: "animuwebext-notplay" });
    } else {
      chrome.runtime.sendMessage({ action: "animuwebext-playing" });
    }
  } else if (request.action >= 0 && request.action <= 100) {
   radioaudio.volume = request.action / 100;
  }
});
