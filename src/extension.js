import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {Feature} from './applications.js';

export default class QuickApplicationsExtension extends Extension {
    enable() {
        console.debug("[QuickApplicationsExtension]", "Extension enabled");
        console.debug("[QuickApplicationsExtension]", "Start loading");

        this._settings = this.getSettings('org.gnome.shell.extensions.quick-applications');

        this._feature = new Feature(this._settings);
        this._feature.enable();

        console.debug("[QuickApplicationsExtension]", "Loaded");
    }

    disable() {
        console.debug("[QuickApplicationsExtension]", "Extension disabled");

        this._feature.destroy();
        this._settings = null;

        console.debug("[QuickApplicationsExtension]", "Complete disabling");
    }
}
