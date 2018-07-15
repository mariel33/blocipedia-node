const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

 // #2
  new() {
    return this._isStandard();
  }

  create() {
    return this.new();
  }

 // #3
  edit() {
    return this.new();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}