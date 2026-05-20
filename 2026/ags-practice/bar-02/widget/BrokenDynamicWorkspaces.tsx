import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalHyprland from "gi://AstalHyprland";

// export default function Workspaces() {
//     const hypr = AstalHyprland.get_default();

//     if(!hypr) {
//         return <box />
//     }

//     const focusBinding = createBinding(hypr, "focusedWorkspace");
//     // const staticWorkspaces = [1, 2, 3];
//     const dynamicWorkspacesBinding = createBinding(hypr, "workspaces");

//     const boxWidget = (
//         <box
//             class={"workspaces-module"}
//             spacing={4}
//             valign={Gtk.Align.CENTER}
//         />
//     );

//     (boxWidget as any).children = dynamicWorkspacesBinding.as((allWorkspaces) => {
//         if(!allWorkspaces || allWorkspaces.length === 0) return [];

//         const sortedWorkspaces = [...allWorkspaces].sort((a, b) => a.id - b.id);
//         return sortedWorkspaces.map((ws) => (
//             <button
//                 onClicked={() => hypr.message(`dispatch workspace ${ws.id}`)}
//                 class={focusBinding.as((focused) => {
//                     const baseClass = "workspace-button";
//                     return focused?.id === ws.id ? `${baseClass} active` : baseClass;
//                 })}
//             >
//                 <label label={ws.id.toString()}/>
//             </button>
//         ))
//     })

//     return boxWidget;

//     // return(
//     //     // <box class={"workspaces-module"} spacing={4} valign={Gtk.Align.CENTER}>
//     //     //     {/* {
//     //     //         staticWorkspaces.map((id)=>(
//     //     //             <button
//     //     //                 onClicked={()=>hypr.message(`dispatch workspace ${id}`)}
//     //     //                 class={focusBinding.as((focused)=>{
//     //     //                     const baseClass = "workspace-button";
//     //     //                     return focused?.id === id ? `${baseClass} active`: baseClass;
//     //     //                 })}
//     //     //             >
//     //     //                 <label label={id.toString()}/>
//     //     //             </button>
//     //     //         ))
//     //     //     } */}





//     //     //     {
//     //     //         // dynamicWorkspacesBinding.as((allWorkspaces) => {
//     //     //         //     if(!allWorkspaces || allWorkspaces.length === 0) return [];

//     //     //         //     const sortedWorkspaces = [...allWorkspaces].sort((a,b)=>a.id - b.id);

//     //     //         //     return sortedWorkspaces.map((ws) => (
//     //     //         //         <button
//     //     //         //             onClicked={()=>hypr.message(`dispatch workspace ${ws.id}`)}
//     //     //         //             class={focusBinding.as((focused) => {
//     //     //         //                 const baseClass = "workspace-button";
//     //     //         //                 return focused?.id === ws.id ? `${baseClass} active` : baseClass;
//     //     //         //             })}
//     //     //         //         >
//     //     //         //             <label label={ws.id.toString()}/>
//     //     //         //         </button>
//     //     //         //     ));
//     //     //         // })
//     //     //     }

//     //     //     {/* {dynamicWorkspacesBinding.as((allWorkspaces) => {
//     //     //         if(!allWorkspaces || allWorkspaces.length === 0) return [];

//     //     //         const sortedWorkspaces = [...allWorkspaces].sort((a,b) => (a.id - b.id));

//     //     //         return sortedWorkspaces.map((ws)=>(
//     //     //             <button>
//     //     //                 <label label={ws.id.toString()}/>
//     //     //             </button>
//     //     //         ));
//     //     //     })} */}
//     //     // </box>

//     //     // <box
//     //     //     class={"workspaces-module"}
//     //     //     spacing={4}
//     //     //     valign={Gtk.Align.CENTER}
//     //     //     children={dynamicWorkspacesBinding.as((allWorkspaces) => {
//     //     //         if(!allWorkspaces || allWorkspaces.length === 0) return [];

//     //     //         const sortedWorkspaces = [...allWorkspaces].sort((a, b) => a.id - b.id);

//     //     //         return sortedWorkspaces.map((ws) => (
//     //     //             <button
//     //     //                 onClicked={() => hypr.message(`dispatch workspace ${ws.id}`)}
//     //     //                 class={focusBinding.as((focused) => {
//     //     //                     const baseClass = "workspace-button";
//     //     //                     return focused?.id === ws.id ? `${baseClass} active` : baseClass;
//     //     //                 })}
//     //     //             >
//     //     //                 <label label={ws.id.toString()}/>
//     //     //             </button>
//     //     //         ))
//     //     //     })}
//     //     // />

//     //     // <box
//     //     //     class={"workspaces-module"}
//     //     //     spacing={4}
//     //     //     valign={Gtk.Align.CENTER}
//     //     //     // Use setup to cleanly hook the binding directly to the widget instance
//     //     //     setup={(self) => {
//     //     //         self.children = dynamicWorkspacesBinding.as((allWorkspaces) => {
//     //     //             if (!allWorkspaces || allWorkspaces.length === 0) return [];

//     //     //             const sortedWorkspaces = [...allWorkspaces].sort((a, b) => a.id - b.id);

//     //     //             return sortedWorkspaces.map((ws) => (
//     //     //                 <button
//     //     //                     onClicked={() => hypr.message(`dispatch workspace ${ws.id}`)}
//     //     //                     class={focusBinding.as((focused) => {
//     //     //                         const baseClass = "workspace-button";
//     //     //                         return focused?.id === ws.id ? `${baseClass} active` : baseClass;
//     //     //                     })}
//     //     //                 >
//     //     //                     <label label={ws.id.toString()}/>
//     //     //                 </button>
//     //     //             ));
//     //     //         });
//     //     //     }}
//     //     // />
        


//     //     //THIS IS SO F***** UP
















//     // )
// }

// export default function Workspaces() {
//     const hypr = AstalHyprland.get_default();

//     if (!hypr) {
//         return <box />
//     }

//     const focusBinding = createBinding(hypr, "focusedWorkspace");

//     return (
//         <box
//             class={"workspaces-module"}
//             spacing={4}
//             valign={Gtk.Align.CENTER}
//             // The setup function hands us the raw GTK box instance right as it builds.
//             setup={(self) => {
//                 // We hook directly into the hyprland instance's workspaces property changes
//                 self.hook(hypr, "notify::workspaces", () => {
//                     const allWorkspaces = hypr.get_workspaces() || [];
                    
//                     // Clear out old workspace buttons and remap the new ones
//                     const sortedWorkspaces = [...allWorkspaces].sort((a, b) => a.id - b.id);
                    
//                     self.children = sortedWorkspaces.map((ws) => (
//                         <button
//                             onClicked={() => hypr.message(`dispatch workspace ${ws.id}`)}
//                             class={focusBinding.as((focused) => {
//                                 const baseClass = "workspace-button";
//                                 return focused?.id === ws.id ? `${baseClass} active` : baseClass;
//                             })}
//                         >
//                             <label label={ws.id.toString()} />
//                         </button>
//                     ));
//                 });
//             }}
//         />
//     );
// }


export default function Workspaces() {
    const hypr = AstalHyprland.get_default();

    if(!hypr) {
        return <box />
    }

    const focusBinding = createBinding(hypr, "focusedWorkspace");
    const dynamicWorkspacesBinding = createBinding(hypr, "workspaces");

    // 1. Instantiate a clean, empty layout container box
    const boxWidget = (
        <box
            class={"workspaces-module"}
            spacing={4}
            valign={Gtk.Align.CENTER}
        />
    );

    // 2. Define a clean rendering worker that maps buttons to our box structure
    const updateWorkspaces = (allWorkspaces: any[]) => {
        if (!allWorkspaces || allWorkspaces.length === 0) {
            (boxWidget as any).children = [];
            return;
        }

        const sortedWorkspaces = [...allWorkspaces].sort((a, b) => a.id - b.id);

        (boxWidget as any).children = sortedWorkspaces.map((ws) => (
            <button
                onClicked={() => hypr.message(`dispatch workspace ${ws.id}`)}
                class={focusBinding.as((focused) => {
                    const baseClass = "workspace-button";
                    return focused?.id === ws.id ? `${baseClass} active` : baseClass;
                })}
            >
                <label label={ws.id.toString()}/>
            </button>
        ));
    };

    // 3. Keep the live binding active so it updates when you open/close windows
    dynamicWorkspacesBinding.as((allWorkspaces) => {
        updateWorkspaces(allWorkspaces || []);
    });

    // 4. Fallback: Force a tiny boot check to ensure it draws if the initial stream was empty
    setTimeout(() => {
        updateWorkspaces(hypr.workspaces || []);
    }, 100);

    // 5. Return the live container
    return boxWidget;
}