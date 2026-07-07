import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";
import { createState, For } from "ags";
import { execAsync } from "ags/process";

const GITHUB_TOKEN = "PERSONAL ACCESS TOKEN";
const GITHUB_USER = "KayfoWan";

type DayContribution = {
    count: number,
    colorClass: string
};

export default function GithubMonitor() {
    const initialGrid: DayContribution[][] = Array.from({ length: 7 }, () => Array.from({ length: 12 }, () => ({ count: 0, colorClass: "git-empty" })));
    const [heatmapGrid, setHeatmapGrid] = createState<DayContribution[][]>(initialGrid);
    const [totalContributions, setTotalContributions] = createState<number>(0);

    async function fetchGithubData() {
        const cleanQuery = `{"query": "query { user(login: \\"${GITHUB_USER}\\\") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }"}`;

        try {
            const rawResponse = await execAsync([
                "sh", "-c",
                `curl -s -X POST -H "Authorization: bearer ${GITHUB_TOKEN}" -H "Content-Type: application/json" -d '${cleanQuery}' https://api.github.com/graphql`
            ]);

            const json = JSON.parse(rawResponse);

            if (json.errors) {
                console.error("GitHub API Error Payload:", JSON.stringify(json.errors));
                return;
            }

            const calendar = json.data.user.contributionsCollection.contributionCalendar;
            
            setTotalContributions(calendar.totalContributions);

            const allWeeks = calendar.weeks;
            const targetWeeks = allWeeks.slice(-12);
            const newGrid: DayContribution[][] = Array.from({ length: 7 }, () => []);

            for(let w = 0; w < targetWeeks.length; w++) {
                const days = targetWeeks[w].contributionDays;

                for(let d = 0; d < 7; d++) {
                    const dayData = days[d];
                    const count = dayData ? dayData.contributionCount : 0;

                    let colorClass = "git-0";
                    if(count > 0 && count <= 2) colorClass = "git-1";
                    else if (count > 2 && count <= 5) colorClass = "git-2";
                    else if (count > 5 && count <= 8) colorClass = "git-3";
                    else if (count > 8) colorClass = "git-4";

                    newGrid[d].push({ count, colorClass });
                }
            }

            setHeatmapGrid(newGrid);
        } catch (error) {
            console.error("Failed to update GitHub contribution schema:", error);
        }
    }

    fetchGithubData();
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1800000, () => {
        fetchGithubData();
        return true;
    });

    return(
        <box orientation={Gtk.Orientation.VERTICAL} spacing={6} class={"github-panel"}>
            <box orientation={Gtk.Orientation.HORIZONTAL} hexpand>
                <label label={"GITHUB ACTIVITY"} class={"github-title"} halign={Gtk.Align.START} hexpand/>
                <label label={`${totalContributions()} total`} class={"github-count"} halign={Gtk.Align.END}/>
            </box>

            <box orientation={Gtk.Orientation.VERTICAL} spacing={3} class={"github-matrix-box"}>
                <For each={heatmapGrid}>
                    {(row: DayContribution[]) => (
                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
                            {row.map((day) => (
                                <box
                                    class={`github-sq ${day.colorClass}`}
                                    tooltipText={`${day.count} contributions`}
                                />
                            ))}
                        </box>
                    )}
                </For>
            </box>
        </box>
    )
}
