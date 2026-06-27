// Shared geometry for the Route Plan overlay. The panel and the map's zoom
// control both read these so the control always sits immediately to the right
// of the panel — no hand-tuned offsets that can drift out of sync.
export const PANEL_TOP = 16; // px from top of the map area
export const PANEL_LEFT = 16; // px from left of the map area
export const PANEL_WIDTH = 288; // px
export const PANEL_GAP = 12; // px gap between the panel and the zoom control

// Left position for the zoom control: just past the panel's right edge.
export const ZOOM_CONTROL_LEFT = PANEL_LEFT + PANEL_WIDTH + PANEL_GAP;
