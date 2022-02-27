
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

chrome.storage.local.get(["animuwebext_coverart_quality"], function (quality) {
  switch(quality.animuwebext_coverart_quality){
    default:
      chrome.storage.local.set({ "animuwebext_coverart_quality": 'medium' });
      coverArtQualitySelect.value = "medium";
      break;
    case "high":
        coverArtQualitySelect.value = "high";
      break;
    case "medium":
        coverArtQualitySelect.value = "medium";
      break;
    case "low":
        coverArtQualitySelect.value = "pixels";
      break;
      }
});

chrome.storage.local.get(["animuwebext_stream_quality"], function (quality) {
  switch(quality.animuwebext_stream_quality){
    default:
      chrome.storage.local.set({ "animuwebext_coverart_quality": "high" });
      streamQualitySelect.value = "320";
      break;
    case "high":
        streamQualitySelect.value = "320";
      break;
    case "medium":
        streamQualitySelect.value = "192";
      break;
    case "low":
        streamQualitySelect.value = "64";
      break;
      }
});


