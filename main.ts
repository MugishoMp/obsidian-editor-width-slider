import { 
	App, 
	Editor, 
	MarkdownView, 
	Modal, 
	Notice, 
	Plugin, 
	PluginSettingTab, 
	Setting 
} from 'obsidian';

// Remember to rename these classes and interfaces!

// storing information
// This plugin will store a single string
interface MyPluginSettings {
	sliderPercentage: string;
}
// the default value of the thing you want to store 
const DEFAULT_SETTINGS: MyPluginSettings = {
	sliderPercentage: '50'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	// most important function, this gets executed everytime the plugin is first 
	// loaded, e.g. when obsidian starts, or when the user just installed the 
	// plugin
	async onload() {
		await this.loadSettings();
		
		this.addStyle();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			'dice', 
			'Sample Plugin', 
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');


		// ----------------------- SLIDER -----------------------

		// Create the slider element
		const slider = document.createElement('input');
		slider.type = 'range';
		slider.min = '0';
		slider.max = '100';
		slider.value = this.settings.sliderPercentage;
		// Apply custom CSS styles to the slider
		slider.style.width = '150px'; // Adjust the width value as needed
		// Apply the color to the slider
		// slider.style.background = '#a882ff';
		// slider.style.setProperty('color', '#a882ff');

		// Create the text element for displaying the slider value
		const sliderValueText = document.createElement('span');
		sliderValueText.textContent = slider.value;
		sliderValueText.style.marginLeft = '5px';
		// Apply the color to the text element
		sliderValueText.style.color = '#a882ff';

		// Add event listener to the slider
		slider.addEventListener('input', (event) => {
			const value = parseInt(slider.value);
			// const widthInPixels = 400 + value * 10;
			this.settings.sliderPercentage = value.toString();

			this.saveSettings();
			this.updateStyle();
			sliderValueText.textContent = value.toString();
			console.log('Slider value:', value);
			// Perform any actions based on the slider value
		});

		// Create the status bar item
		const statusBarItemEl = this.addStatusBarItem();

		// Append the slider to the status bar item
		statusBarItemEl.appendChild(slider);
		statusBarItemEl.appendChild(sliderValueText);
		// ----------------------- SLIDER -----------------------



		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the 
		// current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state 
		// // of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(
		// 			MarkdownView
		// 		);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the 
		// 			// command can be run.
		// 			// If checking is false, then we want to actually perform 
		// 			// the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when 
		// 			// the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// // This adds a settings tab so the user can configure various aspects of 
		// // the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app 
		// that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when 
		// this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear 
		// the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => 
			console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}



	// add the styling elements we need
	addStyle() {
		// add a css block for our settings-dependent styles
		const css = document.createElement('style');
		css.id = 'additional-css';
		document.getElementsByTagName("head")[0].appendChild(css);

		// add the main class
		document.body.classList.add('additional-css');

		// update the style with the settings-dependent styles
		this.updateStyle();
	}

	
	// update the styles (at the start, or as the result of a settings change)
	updateStyle() {
		// get the custom css element
		const el = document.getElementById('additional-css');
		if (!el) throw "additional-css element not found!";
		else {

		el.innerText = `
			body {
			--file-line-width: calc(700px + 10 * ${this.settings.sliderPercentage}px);
		`;

		}
	}

	// Method to store settings
	async loadSettings() {
		this.settings = Object.assign(
			{}, 
			DEFAULT_SETTINGS, 
			await this.loadData()
		);
	}

	// Method to load settings
	async saveSettings() {
		await this.saveData(this.settings);
	}

}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
