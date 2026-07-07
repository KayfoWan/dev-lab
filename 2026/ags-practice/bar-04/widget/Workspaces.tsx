// // import { Gtk } from "ags/gtk4";
// // import { createBinding } from "ags";
// // import AstalHyprland from "gi://AstalHyprland";

// // export default function Workspaces() {
// //     const hyprland = AstalHyprland.get_default();

// //     if(!hyprland) {
// //         return <label label={"Hyprland not running"}/>
// //     }

// //     // const workspacesBinding = createBinding(hyprland, "workspaces");
// //     const activeWorkspaceBinding = createBinding(hyprland, "focused_workspace");

// //     const renderButtons = () => {
// //         return hyprland.get_workspaces()
// //             .filter((ws) => ws.id > 0)
// //             .sort((a, b) => a.id - b.id)
// //             .map((ws) => {
// //                 const isActiveBinding = activeWorkspaceBinding.as(
// //                     (focused) => focused?.id === ws.id
// //                 );

// //                 return (
// //                     <button
// //                         class={isActiveBinding.as((active) =>
// //                             active ? "workspace-btn active" : "workspace-btn"
// //                         )}
// //                         onClicked={() => ws.focus()}
// //                     >
// //                         <label label={`${ws.id}`} />
// //                     </button>
// //                 );
// //             });
// //     };

// //     return(
// //         <box class={"workspaces-module"} spacing={8} valign={Gtk.Align.CENTER} setup={(self) => {}}>
// //             {/* {hyprland.get_workspaces()
// //                 .sort((a, b) => a.id - b.id)
// //                 .map((ws) => {
// //                     const isActiveBinding = activeWorkspaceBinding.as(
// //                         (focused) => focused?.id === ws.id
// //                     );

// //                     return(
// //                         <button
// //                             class={isActiveBinding.as((active) => 
// //                                 active ? "workspace-btn active" : "workspace-btn"
// //                             )}
// //                             onClicked={() => ws.focus()}
// //                         >
// //                             <label label={`${ws.id}`}/>
// //                         </button>
// //                     )
// //                 })
// //             } */}
// //         </box>
// //     )
// // }



// import { Gtk } from "ags/gtk4";
// import { createBinding } from "ags";
// import AstalHyprland from "gi://AstalHyprland";

// export default function Workspaces() {
//     const hyprland = AstalHyprland.get_default();

//     if (!hyprland) {
//         return <label label="Hyprland not running" />;
//     }

//     const activeWorkspaceBinding = createBinding(hyprland, "focused_workspace");

//     // 1. Helper to render the static array of buttons
//     const renderButtons = () => {
//         return hyprland.get_workspaces()
//             .filter((ws) => ws.id > 0) // Goodbye -98
//             .sort((a, b) => a.id - b.id)
//             .map((ws) => {
//                 const isActiveBinding = activeWorkspaceBinding.as(
//                     (focused) => focused?.id === ws.id
//                 );

//                 return (
//                     <button
//                         class={isActiveBinding.as((active) =>
//                             active ? "workspace-btn active" : "workspace-btn"
//                         )}
//                         onClicked={() => ws.focus()}
//                     >
//                         <label label={`${ws.id}`} />
//                     </button>
//                 );
//             });
//     };

//     // 2. Create the container box widget instance first
//     const mainBox = <box class="workspaces-module" spacing={8} valign={Gtk.Align.CENTER} /> as Gtk.Box;

//     // 3. Directly assign initial buttons and register the listener hook natively
//     mainBox.children = renderButtons();

//     hyprland.connect("notify::workspaces", () => {
//         mainBox.children = renderButtons();
//     });

//     // 4. Return the live configured widget
//     return mainBox;
// }

import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalHyprland from "gi://AstalHyprland";

export default function Workspaces() {
    const hyprland = AstalHyprland.get_default();

    if (!hyprland) {
        return <label label="Hyprland not running" />;
    }

    const activeWorkspaceBinding = createBinding(hyprland, "focused_workspace");

    const mainBox = <box class="workspaces-module" spacing={8} valign={Gtk.Align.CENTER} /> as Gtk.Box;

    // 💡 Function to explicitly clear and rebuild using native GTK4 methods
    const syncButtons = () => {
        // 1. Clear out all current live children
        let child = mainBox.get_first_child();
        while (child) {
            const next = child.get_next_sibling();
            mainBox.remove(child);
            child = next;
        }

        // 2. Generate and append new buttons
        hyprland.get_workspaces()
            .filter((ws) => ws.id > 0)
            .sort((a, b) => a.id - b.id)
            .forEach((ws) => {
                const isActiveBinding = activeWorkspaceBinding.as(
                    (focused) => focused?.id === ws.id
                );

                const btn = (
                    <button
                        class={isActiveBinding.as((active) =>
                            active ? "workspace-btn active" : "workspace-btn"
                        )}
                        onClicked={() => ws.focus()}
                    >
                        <label label={`${ws.id}`} />
                    </button>
                ) as Gtk.Widget;

                mainBox.append(btn); // 🔥 Pure GTK4 child insertion
            });
    };

    // Run initial population
    syncButtons();

    // Listen to the native notify signal to re-sync structural state
    hyprland.connect("notify::workspaces", () => {
        syncButtons();
    });

    return mainBox;
}