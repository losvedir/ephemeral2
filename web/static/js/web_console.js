export default class WebConsole {
  // takes a <ul> element
  constructor(list) {
    console.log(list);
    this.list = list;
  }

  log(msg) {
    var list = this.list;
    var li = document.createElement("li");
    var text = document.createTextNode(msg);
    li.appendChild(text);
    list.appendChild(li);
    list.scrollTop = list.scrollHeight;
  }
}
