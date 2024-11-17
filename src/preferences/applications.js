import Adw from "gi://Adw"
import Gio from 'gi://Gio'
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"

import { gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js"

export const ApplicationsPage = GObject.registerClass(
class ApplicationsPage extends Adw.PreferencesPage {
    _init(settings, metadata) {
        super._init({
            name: 'applications',
            title: _('Applications'),
            iconName: 'applications-other-symbolic'
        })

        this.settings = settings;
        this.metadata = metadata;

        this._fill();
    }

    _fill() {
        const customGroup = new Adw.PreferencesGroup({
            title: _('Applications'),
            description: _('Select the applications that will be displayed in the Quick Settings panel'),
        })
        
        const apps = Gio.AppInfo.get_all().filter(app => app.should_show() && app.get_name() !== '');
        apps.sort((a, b) => a.get_name().localeCompare(b.get_name()));

        let applications = this.settings.get_strv("applications")
        apps.forEach(app => {
            let applicationRow = new Adw.SwitchRow({
                title: app.get_name(),
                active: applications.includes(app.get_id())
            });

            applicationRow.add_prefix(new Gtk.Image({
                gicon: app.get_icon(),
            }));

            applicationRow.connect("notify::active", () => {
                const active = applicationRow.get_active();

                if (active) {
                    applications.push(app.get_id());
                } else {
                    while (true) {
                        let index = applications.indexOf(app.get_id())
                        if (index != -1) {
                            applications.splice(index, 1)
                        } else break
                    }
                }

                this.settings.set_strv("applications", applications);
            });

            customGroup.add(applicationRow);
        });

        this.add(customGroup)
    }
})
