'use babel';

export default class WarnBeforeQuittingView {

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('warn-before-quitting');

    const message = document.createElement('div');

    if (document.body.classList.contains('platform-darwin')) {
      message.innerHTML = 'Press ⌘Q again to quit, or press esc to cancel.';
    } else {
      message.innerHTML = 'Press Ctrl+Q again to quit, or press esc to cancel.';
    }

    message.classList.add('message');
    this.element.appendChild(message);
  }

  /**
   * Tear down any state and detach
   */
  destroy() {
    this.element.remove();
  }

  /**
   * Gets the view element.
   */
  getElement() {
    return this.element;
  }
}
