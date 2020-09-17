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
  localStorage.setItem("animuwebext-lastvolbar", number);
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
    "https://cast.animu.com.br:2199/rpc/animufm/streaminfo.get?" + nocacheplz
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
    var rawsong = radiojson.data[0].rawmeta;
    var coverart = radiojson.data[0].track.imageurl;
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
        "NO AR: NON-STOP - DJ Haruka";
      document.getElementById("pedidoslink").href = "https://www.animu.com.br/pedidos/";
    } else {
      // TODO: Uma maneira mais efficiente para tratar dos freetimes, mas isto funciona por agora...
      switch (locutor + "|" + show) {
        case "Dj Zapp|Jiyuu Jikan":
          document.getElementById("onairshow").innerText =
            "NO AR: Free Time - DJ Zapp";
          document.getElementById("pedidoslink").href = "https://www.animu.com.br/#fazerpedidoaovivo";
          break;
        case "Dj LL|Jiyuu Jikan":
          document.getElementById("onairshow").innerText =
            "NO AR: Free Time - DJ LL!";
            document.getElementById("pedidoslink").href = "https://www.animu.com.br/#fazerpedidoaovivo";
          break;
        case "FELIPERIN|Jiyuu Jikan":
          document.getElementById("onairshow").innerText =
            "NO AR: Free Time - DJ FELIPERIN";
            document.getElementById("pedidoslink").href = "https://www.animu.com.br/#fazerpedidoaovivo";
          break;
        case "DJ Dolode|Jiyuu Jikan":
          document.getElementById("onairshow").innerText =
            "NO AR: Free Time - DJ Dolode";
            document.getElementById("pedidoslink").href = "https://www.animu.com.br/#fazerpedidoaovivo";
          break;
        case "Afonso|Jiyuu Jikan":
          document.getElementById("onairshow").innerText =
            "NO AR: Free Time - DJ Afonso";
            document.getElementById("pedidoslink").href = "https://www.animu.com.br/#fazerpedidoaovivo";
          break;
        case "FELIPERIN|Season Break":
          document.getElementById("onairshow").innerText =
            "NO AR: Season Break - DJ FELIPERIN";
            document.getElementById("pedidoslink").href = "https://www.animu.com.br/#fazerpedidoaovivo";
          break;
      }
    }
  };
}

getstreaminfo();
setInterval(getstreaminfo, 15000);
volbar.value = localStorage.getItem("animuwebext-lastvolbar");
chrome.runtime.sendMessage({
  action: "animuwebext-areyouplaying",
});
