
declare const SRC: string

declare module "inline:*" {
  const content: string
  export default content
}

declare module "*.scss" {
  const content: string
  export default content
}

declare module "*.blp" {
  const content: string
  export default content
}

declare module "*.css" {
  const content: string
  export default content
}

declare module "gi://AstalWp" {
  import GObject from "gi://GObject";

  export interface Speaker extends GObject.Object {
    volume: number;
    mute: boolean;
    set_volume(value: number): void;
    set_mute(value: boolean): void;
  }

  export interface Audio {
    default_speaker: Speaker;
  }

  export interface AstalWpInstance {
    audio: Audio;
  }

  const AstalWp: {
    get_default(): AstalWpInstance;
  };

  export default AstalWp;
}

declare module "gi://AstalNetwork" {
  import GObject from "gi://GObject";

  export interface Wifi extends GObject.Object {
    ssid: string;
    strength: number,
    enabled: boolean
  }

  export interface NetworkInstance {
    wifi: Wifi;
  }

  const AstalNetwork: {
    get_default(): NetworkInstance;
  };

  export default AstalNetwork;
}

declare module "gi://AstalBattery" {
  import GObject from "gi://GObject";

  export interface Battery extends GObject.Object {
    percentage: number;
    charging: boolean;
    isPresent: boolean;
  }

  const AstalBattery: {
    get_default(): Battery;
  };

  export default AstalBattery;
}

declare module "gi://AstalHyprland" {
  import GObject from "gi://GObject";

  export interface Workspace extends GObject.Object {
    id: number;
    name: string;
  }

  export interface HyprlandInstance extends GObject.Object {
    focusedWorkspace: Workspace;
    workspaces: Workspace[];
    message(cmd: string): string;
  }

  const AstalHyprland: {
    get_default(): HyprlandInstance;
  };

  export default AstalHyprland;
}