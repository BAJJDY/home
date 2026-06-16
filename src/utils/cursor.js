let mainCursor;

class Cursor {
  constructor() {
    this.cursor = null;
    this.create();
    this.init();
  }

  create() {
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden");
      this.cursor.classList.add("hidden");
      this.cursor.style.pointerEvents = "none";
      this.cursor.style.position = "fixed";
      this.cursor.style.zIndex = "99999";
      document.body.appendChild(this.cursor);
    }

    const style = document.createElement("style");
    style.textContent = `* { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'%3E%3Ccircle cx='4' cy='4' r='4' fill='white'/%3E%3C/svg%3E") 4 4, auto !important; }`;
    document.body.appendChild(style);
    this.styleEl = style;
  }

  refresh() {
    if (this.styleEl) this.styleEl.remove();
    if (this.cursor) this.cursor.remove();
    this.cursor = null;
    this.create();
    this.init();
  }

  init() {
    document.addEventListener("mouseenter", () => {
      this.cursor.classList.remove("hidden");
    });
    document.addEventListener("mouseleave", () => {
      this.cursor.classList.add("hidden");
    });
  }
}

const cursorInit = () => {
  mainCursor = new Cursor();
  return mainCursor;
};

export default cursorInit;