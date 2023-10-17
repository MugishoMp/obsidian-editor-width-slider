import { 
	App,
	PluginSettingTab,
	Setting,
} from 'obsidian';

import EditorWidthSlider from "../main";
import { EditorWidthSliderSettings } from 'src/types/settings';

// ---------------------------- Storing Information ----------------------------
// the default value of the thing you want to store 
export const DEFAULT_SETTINGS: EditorWidthSliderSettings = {
	sliderPercentage: '20',
	sliderWidth: '150'
}
// ---------------------------- Storing Information ----------------------------

export class EditorWidthSliderSettingTab extends PluginSettingTab {
	plugin: EditorWidthSlider;

	constructor(app: App, plugin: EditorWidthSlider) {
		super(app, plugin);
		this.plugin = plugin;
	}
	// this.settings.sliderWidth
	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Slider Width')
			.setDesc('How wide do you want your slider to be?')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.sliderWidth)
				.onChange(async (value) => {
					this.plugin.settings.sliderWidth = value;
					this.plugin.updateSliderStyle();
					await this.plugin.saveSettings();
				}));
	}
}