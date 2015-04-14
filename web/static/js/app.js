import {Socket} from "phoenix";

var s;
var hash;
var content;
var counter = document.getElementById("visitor-count");
var visitorCount = 0;

function haveContent(socket, hash, content) {
  for( var i=0; i < socket.channels.length; i++ ) {
    if ( socket.channels[i].topic === 'have:' + hash ) {
      return;
    }
  }

  socket.join("have:" + hash, {}).receive("ok", function(chan) {
    chan.on("CONTENT_REQUEST", function(_msg) {
      chan.push("CONTENT", {content: content, hash: hash});
    });
    chan.on("VISITORS_COUNT", function(msg) {
      counter.innerHTML = msg.count;
    });
    chan.push("VISITOR_REQUEST", {});
  });
}

function wantContent(socket, hash, elem) {
  socket.join("want:" + hash, {}).receive("ok", function(chan) {
    chan.on("CONTENT", function(msg) {
      elem.innerHTML = msg.content;
      chan.leave();
      haveContent(socket, hash, msg.content);
    });
    chan.push("CONTENT_REQUEST", {hash: hash});
  });
}

document.addEventListener("DOMContentLoaded", function() {
  var homePageElement = document.getElementById("create-new-page");
  var showPageElement = document.getElementById("content-goes-here");

  s = new Socket("/ws");
  s.connect();

  if ( homePageElement ) {
    homePageElement.addEventListener("click", function() {
      content = document.getElementById("new-page-content").value;
      hash = SHA256(content);
      history.pushState({}, "Your Page", hash);
      document.getElementById("content-goes-here").innerHTML = content;
      haveContent(s, hash, content);
    });
  } else if ( showPageElement ) {
    setTimeout(function() {
      wantContent(s, window.location.pathname.substr(1), showPageElement);
    }, 2000);
  }
});

let App = {
}

export default App
