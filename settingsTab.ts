import { App, PluginSettingTab, Setting } from "obsidian";
import type EditorWidthSlider from "main";


export default class EditorWidthSliderSettingTab extends PluginSettingTab
{
	plugin: EditorWidthSlider;

	constructor(app: App, plugin: EditorWidthSlider) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// Style Settings
		containerEl.createEl("h3", { text: "Style Settings" });
		
		// Set the width of the slider in px
		new Setting(containerEl)
			.setName('Slider width')
			.setDesc('Change the width of the slider (default 150). **Restart required!**')
			.addText(text => text
				.setPlaceholder('150')
				.setValue(this.plugin.settings.sliderWidth)
				.onChange(async (value) => {
					this.plugin.settings.sliderWidth = value;
					await this.plugin.saveSettings();
				}));
		
	}
}
