var radioaudio = new Audio();

function checkQuality(){
chrome.storage.local.get(["animuwebext_stream_quality"], function (quality) {
  switch(quality.animuwebext_stream_quality){
    default:
      chrome.storage.local.set({ "animuwebext_stream_quality": 'high' });
      window.radiolink = "https://cast.animu.com.br:9006/stream?";
      break;
    case "high":
      window.radiolink = "https://cast.animu.com.br:9006/stream?";
      break;
    case "medium":
      window.radiolink = "https://cast.animu.com.br:9015/stream?";
      break;
    case "low":
      window.radiolink = "https://cast.animu.com.br:9025/stream?"
      break;
      }
})
}
checkQuality();


chrome.storage.local.get(["animuwebext_lastvolbar"], function (vol) {
  window.radioaudio.volume = vol.animuwebext_lastvolbar / 100;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "animuwebext-play") {
    radioaudio.src = radiolink + "?" + Math.random();
    radioaudio.load;
    radioaudio.play();
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
  } else if (request.action == "animuwebext-change-stream-quality"){
    checkQuality();
  }
});
