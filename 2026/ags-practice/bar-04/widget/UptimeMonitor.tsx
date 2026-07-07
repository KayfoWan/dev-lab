import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";
import { createState, For } from "ags";
import { execAsync } from "ags/process";

const HOME_SERVER_IP = "108.70.200.38";
const MINECRAFT_PORT = "25444";

const WEBSITES = [
    {name: "exploded.casa", url: "https://exploded.casa"},
    {name: "ZBA", url: "https://zappedbyash.com"},
    {name: "TYT", url: "https://trainyourtoes.com"},
    {name: "HTRS", url: "https://hometownroofingsolutions.com"}
]

type SiteStatus = {
    name: string,
    online: boolean,
    latency: number | string,
    loading: boolean
}

export default function UptimeMonitor() {
    const initialStatuses: SiteStatus[] = [
        {name: "Homebase Kinkajou", online: false, latency: "--", loading: true},
        {name: "Minecraft", online: false, latency: "--", loading: true},
        ...WEBSITES.map(w => ({name: w.name, online: false, latency: "--", loading: true}))
    ]

    const [siteStatuses, setSiteStatuses] = createState<SiteStatus[]>(initialStatuses);

    async function pingEverything() {
        const updatedStatuses: SiteStatus[] = [];

        let hostIsAlive = false;
        let pingLatency: string | number = "OFFLINE";

        const startTimePing = GLib.get_monotonic_time();

        try {
            await execAsync(`nc -z -w 2 108.70.200.38 22`);
            const endTimePing = GLib.get_monotonic_time();
            pingLatency = Math.round((endTimePing - startTimePing) / 1000);
            hostIsAlive = true;
        } catch (error) {
            pingLatency = "OFFLINE";
            hostIsAlive = false;
        }

        updatedStatuses.push({
            name: "Homebase Kinkajou",
            online: hostIsAlive,
            latency: hostIsAlive ? `${pingLatency}ms` : "OFFLINE",
            loading: false
        });

        let mcOnline = false;
        let mcLatency: string | number = "OFFLINE";

        if(hostIsAlive) {
            const startTimeG = GLib.get_monotonic_time();
            
            try {
                await execAsync(`nc -z -w 2 ${HOME_SERVER_IP} ${MINECRAFT_PORT}`);
                const endTimeG = GLib.get_monotonic_time();
                mcLatency = Math.round((endTimeG - startTimeG) / 1000);
                mcOnline = true;
            } catch (error) {
                mcLatency = "CRASHED";
                mcOnline = false;
            }
        } else {
            mcLatency = "OFFLINE";
            mcOnline = false;
        }

        updatedStatuses.push({
            name: "Minecraft",
            online: mcOnline,
            latency: mcOnline ? `${mcLatency}ms` : mcLatency,
            loading: false
        });

        for(const site of WEBSITES) {
            const startTime = GLib.get_monotonic_time();
            try {
                await execAsync(`curl -Is --connect-timeout 2 ${site.url}`);
                const endTime = GLib.get_monotonic_time();

                updatedStatuses.push({
                    name: site.name,
                    online: true,
                    latency: `${Math.round((endTime - startTime) / 1000)}ms`,
                    loading: false
                });
            } catch (error) {
                updatedStatuses.push({
                    name: site.name, 
                    online: false, 
                    latency: "DOWN", 
                    loading: false
                });
            }
        }

        setSiteStatuses(updatedStatuses);
    }

    pingEverything();
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 180000, () => {
        pingEverything();
        return true;
    });

    return(
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8} class={"uptime-panel"}>
            <label
                label="🌐 PRODUCTION NETWORK MONITOR"
                halign={Gtk.Align.START}
                class={"uptime-title"}
            />

            <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
                <For each={siteStatuses}>
                    {(site) => (
                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={12} class={"site-row"}>
                            <label
                                label={site.loading ? "○" : site.online ? "●" : "🚨"}
                            />
                            <label
                                label={site.name}
                                hexpand
                                halign={Gtk.Align.START}
                            />
                            <label
                                label={site.latency.toString()}
                                halign={Gtk.Align.END}
                            />
                        </box>
                    )}
                </For>
            </box>
        </box>
    )
}