import {Socket} from "phoenix";
import WebConsole from "./web_console";

var hash;
var content;
var webConsole;

document.addEventListener("DOMContentLoaded", function() {
  webConsole = new WebConsole(document.getElementById('js-console'));
  var homePageElement = document.getElementById("create-new-page");
  var showPageElement = document.getElementById("content-goes-here");

  webConsole.log("Connecting to websocket.");
  var socket = new Socket("/ws");
  socket.connect();
  socket.join("all", {}).receive("ok", function() { webConsole.log("Connected!") });

  if ( homePageElement ) {
    homePageElement.addEventListener("click", function() {
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
  var counter = document.getElementById("visitor-count");

  for( var i=0; i < socket.channels.length; i++ ) {
    if ( socket.channels[i].topic === 'have:' + hash ) {
      return;
    }
  }

  socket.join("have:" + hash, {}).receive("ok", function(chan) {
    webConsole.log("Standing by... ready to share this content!")
    chan.on("content_request", function(_msg) {
      webConsole.log("Request received...");
      chan.push("content", {content: content, hash: hash});
      webConsole.log("Content sent!");
    });
    chan.on("visitors_count", function(msg) {
      counter.innerHTML = msg.count;
    });
  });
}

function wantContent(socket, hash, elem) {
  var requestContentInterval;

  socket.join("want:" + hash, {}).receive("ok", function(chan) {
    webConsole.log(`Listening for content for hash ${hash}`);

    chan.on("content", function(msg) {
      clearInterval(requestContentInterval);
      webConsole.log(`Received content for hash ${hash}`);
      elem.innerHTML = msg.content;
      chan.leave();
      haveContent(socket, hash, msg.content);
    });

    requestContentInterval = setInterval(function(){
      webConsole.log("Requesting content.");
      chan.push("content_request", {hash: hash});
    }, 2000);
  });
}

let App = {
}

export default App
