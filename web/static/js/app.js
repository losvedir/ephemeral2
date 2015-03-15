import {Socket} from "phoenix";

// let socket = new Socket("/ws")
// socket.join("topic:subtopic", {}, chan => {
// })

var s;
var hash;
var content;
var counter = document.getElementById("visitor-count");
var visitorCount = 0;

function haveContent(socket, hash, content) {
  socket.join("have:" + hash, {}, function(chan) {
    chan.on("CONTENT_REQUEST", function(_msg) {
      chan.send("CONTENT", {content: content, hash: hash});
    });
    chan.on("VISITORS", function(msg) {
      counter.innerHTML = msg.count;
    });
    chan.send("VISITOR_REQUEST", {}, function(){});
  });
}

function wantContent(socket, hash, elem) {
  socket.join("want:" + hash, {}, function(chan) {
    chan.on("CONTENT", function(msg) {
      elem.innerHTML = msg.content;
      chan.leave();
      haveContent(socket, hash, msg.content);
    });
    chan.send("CONTENT_REQUEST", {hash: hash});
  });
}

document.addEventListener("DOMContentLoaded", function() {
  var elem1 = document.getElementById("create-new-page");
  var elem2 = document.getElementById("content-goes-here");

  s = new Socket("/ws");

  if ( elem1 ) {
    elem1.addEventListener("click", function() {
      content = document.getElementById("new-page-content").value;
      hash = SHA256(content);
      history.pushState({}, "Your Page", hash);
      document.getElementById("content-goes-here").innerHTML = content;
      haveContent(s, hash, content);
    });
  } else if ( elem2 ) {
    setTimeout(function() {
      wantContent(s, window.location.pathname.substr(1), elem2);
    }, 2000);
  }
});

let App = {
}

export default App
