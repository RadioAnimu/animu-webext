
function changeStreamQuality(quality){
switch (quality) {
    case "320":
        chrome.storage.local.set({ "animuwebext_stream_quality": 'high' });
        break;
    case "192":
        chrome.storage.local.set({ "animuwebext_stream_quality": 'medium' });
        break;
    case "64":
        chrome.storage.local.set({ "animuwebext_stream_quality": 'low' });
        break;
}

  chrome.runtime.sendMessage({
    action: "animuwebext-change-stream-quality",
  });
}

function changeCoverArtQuality(quality){
switch (quality) {
    case "high":
        chrome.storage.local.set({ "animuwebext_coverart_quality": "high" });
        break;
    case "medium":
        chrome.storage.local.set({ "animuwebext_coverart_quality": "medium" });
        break;
    case "pixels":
        chrome.storage.local.set({ "animuwebext_coverart_quality": "low" });
        break;
}

}
var streamQualitySelect  = document.getElementById("kbSelect");
streamQualitySelect.addEventListener("change",(event) => {
changeStreamQuality(event.target.value);
});

var coverArtQualitySelect  = document.getElementById("caSelect");
coverArtQualitySelect.addEventListener("change",(event) => {
changeCoverArtQuality(event.target.value);
});
