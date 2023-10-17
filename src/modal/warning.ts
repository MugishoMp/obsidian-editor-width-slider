import { App, Modal } from "obsidian";

export class WarningModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.setText("Editor width must be a number from 0 to 100!");
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}