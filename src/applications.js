import { SystemIndicator, QuickMenuToggle, QuickToggle } from 'resource:///org/gnome/shell/ui/quickSettings.js';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import Shell from 'gi://Shell';
import GObject from "gi://GObject"

import * as Main from "resource:///org/gnome/shell/ui/main.js"

export class Feature {
    constructor(settings) {
        this.apps = [];
        this._settings = settings;
    }

    _reload() {
        this.disable();
        this.enable();
    }

    enable() {
        this._settings.connect("changed::applications", this._reload.bind(this));

        let applications = this._settings.get_strv("applications");
        applications.forEach((app) => {
            const indicator = new AppIndicator(app);
            Main.panel.statusArea.quickSettings.addExternalIndicator(indicator);
            this.apps.push(indicator);
        });
    }

    disable() {
        this._settings.disconnect();

        while(this.apps.length > 0) {
            let app = this.apps.pop();
            app.destroy();
        }
    }

    destroy() {
        this.disable();
    }
}

const AppIndicator = GObject.registerClass(
    class Indicator extends SystemIndicator {
        _init(app_id) {
            super._init();

            this.app = Shell.AppSystem.get_default().lookup_app(app_id)

            let appInfo = this.app.get_app_info();
            let actions = appInfo.list_actions();
            if (actions.length > 0) {
                this._toggle = new QuickMenuToggle({
                    title: this.app.get_name(),
                    gicon: this.app?.get_icon() ?? null,
                });

                this._toggle.menu.addMenuItem(new PopupMenu.PopupMenuSection());
                this._toggle.menu.setHeader(this.app?.get_icon() ?? null, this.app.get_name());

                for (let i = 0; i < actions.length; i++) {
                    let action = actions[i];
                    let menuItem = new PopupMenu.PopupMenuItem(appInfo.get_action_name(action));
                    menuItem.connect('activate', (o, event) => this.app.launch_action(action, event.get_time(), -1) );

                    this._toggle.menu.addMenuItem(menuItem);
                }
            } else {
                this._toggle = new QuickToggle({
                    title: this.app.get_name(),
                    gicon: this.app?.get_icon() ?? null,
                });
            }

            this._toggle.connect("clicked", () => this.app.activate());
            this.quickSettingsItems.push(this._toggle);
        }

        destroy() {
            this.quickSettingsItems.forEach(item => item.destroy());
            super.destroy();
        }
    }
)

