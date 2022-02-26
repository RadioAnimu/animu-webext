var playstop = document.getElementById("playstop-button");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "animuwebext-notplay") {
    playstop.removeEventListener("click", pauseradio);
    playstop.classList.remove("fa-stop");
    playstop.classList.add("fa-play");
    playstop.addEventListener("click", playradio);
  } else if (request.action == "animuwebext-playing") {
    playstop.removeEventListener("click", playradio);
    playstop.classList.remove("fa-play");
    playstop.classList.add("fa-stop");
    playstop.addEventListener("click", pauseradio);
  }
});

function playradio() {
  chrome.runtime.sendMessage({
    action: "animuwebext-play",
  });
  playstop.classList.remove("fa-play");
  playstop.classList.add("fa-stop");
  playstop.removeEventListener("click", playradio);
  playstop.addEventListener("click", pauseradio);
}

function pauseradio() {
  chrome.runtime.sendMessage({
    action: "animuwebext-pause",
  });
  playstop.classList.remove("fa-stop");
  playstop.classList.add("fa-play");
  playstop.removeEventListener("click", pauseradio);
  playstop.addEventListener("click", playradio);
}

function volumedown() {
  chrome.runtime.sendMessage({
    action: "animuwebext-volume-down",
  });
}

function volumeup() {
  chrome.runtime.sendMessage({
    action: "animuwebext-volume-up",
  });
}

var volbar = document.getElementById("vol-control");

function checkvol() {
  var number = volbar.value;
  chrome.storage.sync.set({ "animuwebext_lastvolbar": number });

  chrome.runtime.sendMessage({
    action: number,
  });
}

volbar.addEventListener("change", checkvol);
volbar.addEventListener("input", checkvol);

function getstreaminfo() {
  var trackinfo = new XMLHttpRequest();
  var showinfo = new XMLHttpRequest();
  var nocacheplz = Math.random();
  trackinfo.open(
    "GET",
    "https://api.animu.com.br/?" + nocacheplz
  );
  showinfo.open(
    "GET",
    "https://www.animu.com.br/teste/locutor1.php?" + nocacheplz
  );
  trackinfo.responseType = "json";
  showinfo.responseType = "json";
  trackinfo.send();
  trackinfo.onerror = function () {
    document.getElementById("songtitle").innerText =
      "Um erro aconteceu, ou o nosso servidor foi abaixo ou estas disconectado da internet";
    document.getElementById("animetitle").innerText = "OH MY GOD!";
    document.getElementById("coverart").src = "img/nocover.png";
    document.getElementById("imgsource").href = "about:blank";
  };
  trackinfo.onload = function () {
    var radiojson = trackinfo.response;
    var rawsong = radiojson.rawtitle;
    var coverart = radiojson.track.artworks.medium;
    var songtitleget = rawsong.substring(0, rawsong.indexOf("|"));
    var animeget = rawsong.substr(rawsong.indexOf("|") + 1);
    document.getElementById("songtitle").innerText = songtitleget;
    document.getElementById("animetitle").innerText = animeget;
    document.getElementById("coverart").src = coverart;
    document.getElementById("imgsource").href = coverart;
  };

  showinfo.send();
  showinfo.onerror = function () {
    document.getElementById("onairshow").innerText = "NO AR: não sei - dj NaN";
  };
  showinfo.onload = function () {
    var showjson = showinfo.response;
    var locutor = showjson.locutor;
    var show = showjson.programa;
    if (locutor == "Haruka") {
      document.getElementById("onairshow").innerText =
        "NO AR: Animu NON-STOP com DJ Haruka";
      document.getElementById("pedidoslink").href =
        "https://www.animu.com.br/pedidos/";
    } else {
     switch (show) {
      case "Non-Stop":
        document.getElementById("onairshow").innerText =
        "Animu NON-STOP com DJ Haruka";
        break;
      case "AnimuSong":
        document.getElementById("onairshow").innerText =
          "AnimuSong com a DJ Haruka Yuki";
        break;
      case "Jiyuu Jikan":
        document.getElementById("onairshow").innerText =
          "Jiyuu Jikan com " + locutor;
        break;
      case "Animu Plus":
        document.getElementById("onairshow").innerText =
          "Animu Plus com " + locutor + " e Ouvintes!";
        break;
      case "Manutenção":
        document.getElementById("onairshow").innerText =
          "Manutenção com DJ Paciência e DJ Técnica";
        break;
      case "Olimpíadas na Rádio":
        document.getElementById("onairshow").innerText =
          "Olimpíadas na Rádio";
        window.onairname = "Olimpiadas no Rádio";
        break;
      default:
        document.getElementById("onairshow").innerText =
        show + " com " + locutor;
        break;
    }
    }
  };
}

getstreaminfo();
setInterval(getstreaminfo, 15000);

chrome.storage.sync.get(["animuwebext_lastvolbar"], function (numero) {
  volbar.value = numero.animuwebext_lastvolbar;
});

chrome.runtime.sendMessage({
  action: "animuwebext-areyouplaying",
});
