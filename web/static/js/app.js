import {Socket} from "phoenix";

var hash;
var content;

document.addEventListener("DOMContentLoaded", function() {
  var homePageElement = document.getElementById("create-new-page");
  var showPageElement = document.getElementById("content-goes-here");

  var socket = new Socket("/ws");
  socket.connect();
  socket.join("all", {});

  if ( homePageElement ) {
    homePageElement.addEventListener("click", function() {
      content = document.getElementById("new-page-content").value;
      hash = SHA256(content);
      history.pushState({}, "Your Page", hash);
      document.getElementById("content-goes-here").innerHTML = content;
      haveContent(socket, hash, content);
    });
  } else if ( showPageElement ) {
    setTimeout(function() {
      wantContent(socket, window.location.pathname.substr(1), showPageElement);
    }, 2000);
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
    chan.on("content_request", function(_msg) {
      chan.push("content", {content: content, hash: hash});
    });
    chan.on("visitors_count", function(msg) {
      counter.innerHTML = msg.count;
    });
  });
}

function wantContent(socket, hash, elem) {
  socket.join("want:" + hash, {}).receive("ok", function(chan) {
    chan.on("content", function(msg) {
      elem.innerHTML = msg.content;
      chan.leave();
      haveContent(socket, hash, msg.content);
    });
    chan.push("content_request", {hash: hash});
  });
}

let App = {
}

export default App
