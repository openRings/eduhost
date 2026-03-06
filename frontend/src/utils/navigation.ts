import { Navigator, useNavigate } from "@solidjs/router";

let navigate: ReturnType<typeof useNavigate>;

export function initNavigation(navigator: Navigator) {
  navigate = navigator;
}

export function go(path: string) {
  console.log("called use go:", path);

  navigate(path);
}
