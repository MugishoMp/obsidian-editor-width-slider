import { 
	Plugin, TFile
} from 'obsidian';


import {
	DEFAULT_SETTINGS,
	EditorWidthSliderSettingTab
} from "./settings/settings";

import { 
	EditorWidthSliderSettings 
} from './types/settings';


import { 
	WarningModal 
} from './modal/warning';

// ---------------------------- Plugin Class -----------------------------------
export default class EditorWidthSlider extends Plugin {
	settings: EditorWidthSliderSettings;

	// most important function, this gets executed everytime the plugin is first 
	// loaded, e.g. when obsidian starts, or when the user just installed the 
	// plugin
	async onload() {
		await this.loadSettings();
		
		this.addStyle();

		this.app.workspace.on('file-open', () => {
			this.updateEditorStyleYAML();
		});

		this.createSlider();

		this.addSettingTab(new EditorWidthSliderSettingTab(this.app, this));

	}

	// async onLoadFile(file: TFile) {
		

	// }

	onunload() {
		this.cleanUpResources();
	}
	
	// ---------------------------- SLIDER -------------------------------------
	createSlider() {

		// Create the slider element
		const slider = document.createElement('input');
		slider.classList.add('editor-width-slider');
		slider.id = 'editor-width-slider';
		slider.type = 'range';
		slider.min = '0';
		slider.max = '100';
		slider.value = this.settings.sliderPercentage;
		// Adjust the width value as needed
		slider.style.width = this.settings.sliderWidth + 'px'; 
		
		// Add event listener to the slider
		slider.addEventListener('input', (event) => {
			const value = parseInt(slider.value);
			// const widthInPixels = 400 + value * 10;
			this.settings.sliderPercentage = value.toString();

			this.saveSettings();
			this.updateEditorStyle();
			sliderValueText.textContent = value.toString();
			console.log('Slider value:', value);
			// Perform any actions based on the slider value
		});

		// Create the text element for displaying the slider value
		const sliderValueText = document.createElement('span');
		sliderValueText.textContent = slider.value;
		sliderValueText.classList.add('editor-width-slider-value');
		sliderValueText.id = 'editor-width-slider-value';

		// Add the CSS properties to the span element
		sliderValueText.style.color = 'white';
		sliderValueText.style.padding = '8px 5px';
		sliderValueText.style.display = 'inline';
		sliderValueText.style.borderRadius = '18%';
		sliderValueText.style.border = '0';
		sliderValueText.style.margin = '0px 10px';
		sliderValueText.style.background = 'var(--interactive-accent)';
		sliderValueText.style.fontSize = '13px';
		sliderValueText.style.lineHeight = '50%';
		sliderValueText.style.width = 'auto';
		sliderValueText.style.height = 'auto';
		sliderValueText.style.boxSizing = 'content-box';

		// Add a hover effect to change the background color to red
		sliderValueText.style.transition = 'background 0.3s'; // Add smooth transition
		sliderValueText.style.cursor = 'pointer'; // Change cursor on hover
		sliderValueText.addEventListener('mouseenter', function() {
			sliderValueText.style.background = 'red';
		});
		sliderValueText.addEventListener('mouseleave', function() {
			sliderValueText.style.background = 'var(--interactive-accent)';
		});

		// Add a click event listener to the slider value text
		sliderValueText.addEventListener('click', () => {
			this.resetEditorWidth()
		});

		// Create the status bar item
		const statusBarItemEl = this.addStatusBarItem();
		// Append the slider to the status bar item
		statusBarItemEl.appendChild(slider);
		statusBarItemEl.appendChild(sliderValueText);
	}
	// ---------------------------- SLIDER -------------------------------------

	cleanUpResources() {
		this.resetEditorWidth();
	}

	resetEditorWidth() {
		// const widthInPixels = 400 + value * 10;
		this.settings.sliderPercentage = this.settings.sliderPercentageDefault;

		// get the custom css element
		const styleElements = document.getElementsByClassName('editor-width-slider');
		const slider = document.getElementById('editor-width-slider') as HTMLInputElement;
		const sliderValue = document.getElementById('editor-width-slider-value') as HTMLInputElement;
		if (slider) {
			if (sliderValue) {
				slider.value = this.settings.sliderPercentageDefault;
				sliderValue.textContent = this.settings.sliderPercentageDefault.toString();
			}
		}

		this.saveSettings();
		this.updateEditorStyleYAML();
	}

	// add element that contains all of the styling elements we need
	addStyle() {
		// add a css block for our settings-dependent styles
		const css = document.createElement('style');
		css.id = 'additional-editor-css';
		document.getElementsByTagName("head")[0].appendChild(css);

		// add the main class
		document.body.classList.add('additional-editor-css');

		// update the style with the settings-dependent styles
		// this.updateEditorStyle();
	}

	
	// update the styles (at the start, or as the result of a settings change)
	updateEditorStyle() {
		// get the custom css element
		const styleElement = document.getElementById('additional-editor-css');
		if (!styleElement) throw "additional-editor-css element not found!";
		else {

		styleElement.innerText = `
			body {
   				--line-width: calc(700px + 10 * ${this.settings.sliderPercentage}px) !important;
			  	--file-line-width: calc(700px + 10 * ${this.settings.sliderPercentage}px) !important;
			}
		`;

		}
	}


	// update the styles (at the start, or as the result of a settings change)
	updateEditorStyleYAMLHelper(editorWidth: any) {
		// get the custom css element
		const styleElement = document.getElementById('additional-editor-css');
		if (!styleElement) throw "additional-editor-css element not found!";
		else {

		styleElement.innerText = `
			body {
   				--line-width: calc(100px + ${editorWidth}vw) !important;
			  	--file-line-width: calc(100px + ${editorWidth}vw) !important;
			}
		`;

		}
	}

	pattern = /^(?:[0-9]{1,2}|100)$/;

	validateString(inputString: string): boolean {
		return this.pattern.test(inputString);
	}

	updateEditorStyleYAML() {
		// if there is yaml frontmatter, take info from yaml, otherwise take info from slider
		const file = this.app.workspace.getActiveFile() as TFile; // Currently Open Note
		if(file.name) {
			const metadata = app.metadataCache.getFileCache(file);
			// const metadata = app.vault.metadataCache.getFileCache(file);
			if (metadata) {
				if (metadata.frontmatter) {
					try {
						if (metadata.frontmatter["editor-width"]) {
							if (this.validateString(metadata.frontmatter["editor-width"])) {
								this.updateEditorStyleYAMLHelper(metadata.frontmatter["editor-width"]);
							} else {
								new WarningModal(this.app).open();
								throw new Error("Editor width must be a number from 0 to 100.");
							}
						} else {
							this.updateEditorStyle();
						}
					} catch (e) {
						console.error("Error:", e.message);
					}
				} else {
					this.updateEditorStyle();
				}
			}
		}
		// return; // Nothing Open
	}

	// update the styles (at the start, or as the result of a settings change)
	updateSliderStyle() {
		// get the custom css element
		const styleElements = document.getElementsByClassName('editor-width-slider');
		
		if (styleElements.length === 0) {
			throw new Error("editor-width-slider-value element not found!");
		} else {
			// Access the first element in the collection and modify its style
			const styleElement = styleElements[0] as HTMLElement;
			styleElement.style.width = this.settings.sliderWidth + 'px';
		}
	}


	// Method to load settings
	async loadSettings() {
		this.settings = Object.assign(
			{}, 
			DEFAULT_SETTINGS, 
			await this.loadData()
		);
	}

	// Method to store settings
	async saveSettings() {
		await this.saveData(this.settings);
	}

}
// ---------------------------- Plugin Class -----------------------------------
