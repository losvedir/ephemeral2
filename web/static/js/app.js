import {Socket} from "phoenix";
import WebConsole from "./web_console";

let hash;
let content;
let webConsole;

document.addEventListener("DOMContentLoaded", () => {
  webConsole = new WebConsole(document.getElementById('js-console'));
  let homePageElement = document.getElementById("create-new-page");
  let showPageElement = document.getElementById("content-goes-here");

  webConsole.log("Connecting to websocket.");
  let socket = new Socket("/ws");
  socket.connect();

  let chan = socket.chan("all", {});
  chan.join().receive("ok", () => { webConsole.log("Connected!") });

  if ( homePageElement ) {
    homePageElement.addEventListener("click", () => {
      content = document.getElementById("new-page-content").value;
      hash = SHA256(content);
      history.pushState({}, "Your Page", hash);
      document.getElementById("content-goes-here").innerHTML = content;
      haveContent(socket, hash, content);
    });
  } else if ( showPageElement ) {
    wantContent(socket, window.location.pathname.substr(1), showPageElement);
  }
});

function haveContent(socket, hash, content) {
  let counter = document.getElementById("visitor-count");

  for( let i=0; i < socket.channels.length; i++ ) {
    if ( socket.channels[i].topic === 'have:' + hash ) {
      return;
    }
  }

  let chan = socket.chan("have:" + hash, {});
  chan.on("content_request", function(_msg) {
    webConsole.log("Request received...");
    chan.push("content", {content: content, hash: hash});
    webConsole.log("Content sent!");
  });
  chan.on("visitors_count", function(msg) {
    counter.innerHTML = msg.count;
  });

  chan.join().receive("ok", function(chan) {
    webConsole.log("Standing by... ready to share this content!")
  });
}

function wantContent(socket, hash, elem) {
  let requestContentInterval;

  let chan = socket.chan("want:" + hash, {});
  chan.on("content", function(msg) {
    clearInterval(requestContentInterval);
    webConsole.log(`Received content for hash ${hash}`);
    elem.innerHTML = msg.content;
    chan.leave();
    haveContent(socket, hash, msg.content);
  });

  chan.join().receive("ok", () => {
    webConsole.log(`Listening for content for hash ${hash}`);

    requestContentInterval = setInterval(() =>{
      webConsole.log("Requesting content.");
      chan.push("content_request", {hash: hash});
    }, 2000);
  });
}

let App = {
}

export default App
