import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"

import { ExtensionPreferences, gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js"

import { AboutPage } from "./preferences/about.js"
import { ApplicationsPage } from "./preferences/applications.js"

function appendIconPath(iconTheme,path) {
    if (!iconTheme.get_search_path().includes(path))
        iconTheme.add_search_path(path)
}

export default class QuickApplicationsExtensionPreferences extends ExtensionPreferences {
    constructor(metadata) {
        super(metadata);

        this._settings = this.getSettings('org.gnome.shell.extensions.quick-applications');

        const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default())
        appendIconPath(iconTheme, this.path + "/data/images")
        appendIconPath(iconTheme, this.path + "/data/contributors/images")
    }

    fillPreferencesWindow(window) {
        let applicationsPage = new ApplicationsPage(this._settings, this.metadata);
        window.add(applicationsPage);

        let aboutPage = new AboutPage(this.metadata);
        window.add(aboutPage);
    }
}
