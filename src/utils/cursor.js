let mainCursor;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

class Cursor {
  constructor() {
    this.pos = {
      curr: null,
      prev: null,
    };
    this.cursor = null;
    this.create();
    this.init();
    this.render();
  }

  move(left, top) {
    this.cursor.style["left"] = `${left}px`;
    this.cursor.style["top"] = `${top}px`;
  }

  create() {
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden");
      this.cursor.classList.add("hidden");
      document.body.append(this.cursor);
    }

    const style = document.createElement("style");
    style.textContent = `* { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'%3E%3Ccircle cx='4' cy='4' r='4' fill='white'/%3E%3C/svg%3E") 4 4, auto !important; }`;
    document.body.appendChild(style);
    this.styleEl = style;
  }

  refresh() {
    if (this.styleEl) this.styleEl.remove();
    this.cursor.classList.remove("active");
    this.pos = {
      curr: null,
      prev: null,
    };
    this.create();
    this.init();
    this.render();
  }

  init() {
    document.onmousemove = (e) => {
      this.pos.curr == null && this.move(e.clientX - 8, e.clientY - 8);
      this.pos.curr = {
        x: e.clientX - 8,
        y: e.clientY - 8,
      };
      this.cursor.classList.remove("hidden");
    };
    document.onmouseenter = () => this.cursor.classList.remove("hidden");
    document.onmouseleave = () => this.cursor.classList.add("hidden");
    document.onmousedown = () => this.cursor.classList.add("active");
    document.onmouseup = () => this.cursor.classList.remove("active");
  }

  render() {
    if (this.pos.prev) {
      this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else {
      this.pos.prev = this.pos.curr;
    }
    requestAnimationFrame(() => this.render());
  }
}

const cursorInit = () => {
  mainCursor = new Cursor();
  return mainCursor;
};

export default cursorInit;