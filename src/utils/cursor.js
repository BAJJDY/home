let mainCursor;

const lerp = (a, b, n) => (1 - n) * a + n * b;

class Cursor {
  constructor() {
    this.pos = {
      curr: { x: 0, y: 0 },
      prev: { x: 0, y: 0 },
    };
    this.cursor = null;
    this.isHidden = true;
    this.create();
    this.init();
    this.render();
  }

  move(x, y) {
    this.cursor.style.transform = `translate(${x}px, ${y}px)`;
  }

  create() {
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden");
      this.cursor.style.pointerEvents = "none";
      this.cursor.style.position = "fixed";
      this.cursor.style.zIndex = "99999";
      this.cursor.style.width = "16px";
      this.cursor.style.height = "16px";
      this.cursor.style.borderRadius = "50%";
      this.cursor.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      this.cursor.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
      this.cursor.style.transition = "transform 0.05s ease-out";
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
    this.isHidden = true;
    this.pos = { curr: { x: 0, y: 0 }, prev: { x: 0, y: 0 } };
    this.create();
    this.init();
    this.render();
  }

  init() {
    const handleMove = (e) => {
      this.pos.curr.x = e.clientX - 8;
      this.pos.curr.y = e.clientY - 8;
      if (this.isHidden) {
        this.pos.prev.x = this.pos.curr.x;
        this.pos.prev.y = this.pos.curr.y;
        this.move(this.pos.curr.x, this.pos.curr.y);
        this.cursor.classList.remove("hidden");
        this.isHidden = false;
      }
    };

    document.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseenter", () => {
      this.isHidden = false;
      this.cursor.classList.remove("hidden");
    });
    document.addEventListener("mouseleave", () => {
      this.isHidden = true;
      this.cursor.classList.add("hidden");
    });
    document.addEventListener("mousedown", () => {
      this.cursor.classList.add("active");
    });
    document.addEventListener("mouseup", () => {
      this.cursor.classList.remove("active");
    });
  }

  render() {
    if (!this.isHidden && this.pos.curr) {
      this.pos.prev.x = lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    }
    requestAnimationFrame(() => this.render());
  }
}

const cursorInit = () => {
  mainCursor = new Cursor();
  return mainCursor;
};

export default cursorInit;