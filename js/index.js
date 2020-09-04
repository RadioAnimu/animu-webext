var playstop = document.getElementById("playstop-button");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "animuwebext-notplay"){
        playstop.removeEventListener("click", pauseradio);
        playstop.classList.remove("fa-stop");
        playstop.classList.add("fa-play");
        playstop.addEventListener("click", playradio);       
        }
        else if(request.action == "animuwebext-playing"){
        playstop.removeEventListener("click", playradio);
        playstop.classList.remove("fa-play");
        playstop.classList.add("fa-stop");
        playstop.addEventListener("click", pauseradio);    
        }
        })

 function playradio(){
 chrome.runtime.sendMessage({action: "animuwebext-play"})
 playstop.classList.remove("fa-play");
 playstop.classList.add("fa-stop");
 playstop.removeEventListener("click", playradio);
 playstop.addEventListener("click", pauseradio);
 }

 function pauseradio(){
 chrome.runtime.sendMessage({action: "animuwebext-pause"})
 playstop.classList.remove("fa-stop");
 playstop.classList.add("fa-play");
 playstop.removeEventListener("click", pauseradio);
 playstop.addEventListener("click", playradio);
 }
 
function volumedown(){
 chrome.runtime.sendMessage({action: "animuwebext-volume-down"})
 }
 
 function volumeup(){
 chrome.runtime.sendMessage({action: "animuwebext-volume-up"})
 }
 
var volbar = document.getElementById("vol-control")
function checkvol(){
    var number = volbar.value
    localStorage.setItem("animuwebext-lastvolbar", number);
    chrome.runtime.sendMessage({action: number})}

volbar.addEventListener('change', checkvol);
volbar.addEventListener('input', checkvol);

function getstreaminfo(){
    var request = new XMLHttpRequest();
    var nocacheplz = Math.random()
    request.open('GET', "https://cast.animu.com.br:2199/rpc/animufm/streaminfo.get?" + nocacheplz);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
    var radiojson = request.response;
    var songtitle = radiojson.data[0].song
    var coverart  = radiojson.data[0].track.imageurl
    var songtitleget = songtitle.substring(0, songtitle.indexOf('|'));
    var animeget = songtitle.substr(songtitle.indexOf("|") + 1);
    document.getElementById("songtitle").innerText = songtitleget;
    document.getElementById("animetitle").innerText = animeget;
    document.getElementById("ca").src = coverart
    document.getElementById("imgsource").href = coverart
    }}

getstreaminfo();
setInterval(getstreaminfo, 10000);
volbar.value = localStorage.getItem("animuwebext-lastvolbar");
chrome.runtime.sendMessage({action:"animuwebext-areyouplaying"})
