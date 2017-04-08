'use babel';

import WarnBeforeQuittingView from './warn-before-quitting-view';
import { CompositeDisposable } from 'atom';

export default {

  warnBeforeQuittingView: null,
  modalPanel: null,
  subscriptions: null,
  handleKeyup: null,

  /**
   * Activates the package.
   */
  activate() {
    this.activateView();
    this.activateModalPanel();
    this.activateSubscriptions();
    this.activateEventHandlers();
  },

  /**
   * Activates the warning message view.
   */
  activateView() {
    this.warnBeforeQuittingView = new WarnBeforeQuittingView();
  },

  /**
   * Activates the modal panel that will act as the warning message.
   */
  activateModalPanel() {
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.warnBeforeQuittingView.getElement(),
      visible: false
    });
  },

  /**
   * Activates Atom keymap subscriptions.
   */
  activateSubscriptions() {
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view.
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'warn-before-quitting:toggle': () => this.toggle()
      })
    );
  },

  /**
   * Activates the key up event handler.
   */
  activateEventHandlers() {
    this.handleKeyup = evt => {
      if (evt.key === 'Escape') {
        this.cancel();
      }
    };
  },

  /**
   * Spawns the warning message before quitting.
   */
  warn() {
    atom.views.getView(atom.workspace).addEventListener('keyup', this.handleKeyup);
    this.modalPanel.show();
  },

  /**
   * Quits the app.
   */
  quit() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), "core:close");
  },

  /**
   * Cancels the quit procedure.
   */
  cancel() {
    atom.views.getView(atom.workspace).removeEventListener('keyup', this.handleKeyup);
    this.modalPanel.hide();
  },

  /**
   * Toggles the warning message. Quits the app if the warning message is
   * already present.
   */
  toggle() {
    return (
      this.modalPanel.isVisible() ?
        this.quit() :
        this.warn()
    );
  },

  /**
   * Deactivates the package.
   */
  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.warnBeforeQuittingView.destroy();
  }
};
