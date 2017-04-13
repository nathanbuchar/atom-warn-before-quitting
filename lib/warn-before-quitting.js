'use babel';

import WarnBeforeQuittingView from './warn-before-quitting-view';
import { CompositeDisposable } from 'atom';

export default {

  warnBeforeQuittingView: null,
  modalPanel: null,
  subscriptions: null,

  /**
   * Activates the package.
   */
  activate() {
    this.activateView();
    this.activateModalPanel();
    this.activateSubscriptions();
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

    // Register command that toggles the view.
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'warn-before-quitting:toggle': () => this.toggle()
      })
    );

    // Register command that cancels the view.
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'warn-before-quitting:cancel': () => this.cancel()
      })
    );
  },

  /**
   * Spawns the warning message before quitting.
   */
  warn() {
    this.modalPanel.show();
  },

  /**
   * Quits the app.
   */
  quit() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'application:quit');
  },

  /**
   * Cancels the quit procedure.
   */
  cancel() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    }
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
