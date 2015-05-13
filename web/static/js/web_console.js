export default class WebConsole {
  // takes a <ul> element
  constructor(list) {
    console.log(list);
    this.list = list;
  }

  log(msg) {
    var wasScrolledToTheBottom = isScrolledToTheBottom();
    addLine(msg);
    if (wasScrolledToTheBottom) {
      scrollToTheBottom();
    }
  }
  
  addLine(msg) {
    var li = document.createElement("li");
    var text = document.createTextNode(msg);
    li.appendChild(text);
    this.list.appendChild(li);
  }
  
  isScrolledToTheBottom() {
    return this.list.scrollTop >= this.list.scrollHeight - this.list.clientHeight;
  }
  
  scrollToTheBottom() {
    this.list.scrollTop = this.list.scrollHeight;
  }
}
