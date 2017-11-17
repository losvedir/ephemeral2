export default class WebConsole {
  // takes a <ul> element
  constructor(list) {
    console.log(list);
    this.list = list;
  }

  log(msg) {
    let wasScrolledToTheBottom = this.isScrolledToTheBottom();
    this.addLine(msg);
    if (wasScrolledToTheBottom) {
      this.scrollToTheBottom();
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
