export class Event {
  constructor() {
    this.events = {};
  }
  on(name, callback) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(callback);
  }
  emit(name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach((callback) => {
        callback(...args);
      });
    }
  }
  off(name, callback) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter((cb) => cb !== callback);
    }
  }
}
