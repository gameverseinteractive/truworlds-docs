---
title: Window, panels and tabs
description: The menu bar, ribbon, panels and docks, and the tabs in the middle
---

# Window, panels and tabs

The TruWorlds Creator window is four bands, from top to bottom: the menu bar, the [ribbon](ribbon-and-insert.md), the workspace and the status bar. The menu bar holds the File, Edit, Select, Insert and View menus. The ribbon is a tab row and, under it, the buttons of the active tab. The tab row holds the house icon and the tabs Home, Model, UI and Script on the left and, on the right, [Connect agent](ai-agents.md), the [playtest controls](../playtesting/starting-a-playtest.md), Publish and the account button. The account button at the far right reads Log in while you are signed out. The workspace holds panels on the left, right and bottom, with the tabbed center area between them.

## Panels and docks

A panel is a docked tool window such as the [Explorer](explorer.md) or [Properties](properties-panel.md). Panels live in six docks around the center area. A dock can hold several panels but shows only one at a time: its active panel. A dock with no active panel is collapsed and takes no space.

A narrow strip of icons runs down the far left and far right edges of the workspace. Each icon is one panel. Click a panel's icon in an icon strip to show it in its dock; click the icon of the panel already showing to hide it. Hiding a panel loses nothing: the panel keeps its place in its dock.

## Moving and resizing panels

To move a panel to another dock, hover it, click its Options button (three dots), open Move Panel and choose a dock.

Drag the divider between two areas of the window to resize them.

TruWorlds Creator saves your panel layout per computer, not per world: each panel's dock, the active panel in each dock, the collapsed docks and the divider positions.

## Tabs

The center area is a row of tabs: the [viewport tab](viewport-and-selection.md), always first and named after the world; a tab for each open [script](script-editor.md); during a playtest, a [Server tab](../playtesting/switching-sessions.md) and a tab for each player, Player 1 to Player 4; and special tabs such as [Data](../players/data-browser.md).

Every tab has a close button. You can also press Ctrl+W (Cmd+W on macOS) or choose File > Close to close the active tab.

> [!WARNING]
> Ctrl+W on the viewport tab is the same as File > Exit. Check which tab is active before you press it.

## What follows the active tab

Only the active tab is drawn and only the active tab plays sound. The Explorer shows the active tab's copy of the world: on the Server tab what the server has, on a Player tab what that player has received. Switching tabs clears the selection.

On a script tab, a Grip Editor tab or a playtest tab, the ribbon's insert, edit and modeling buttons are grayed out.

When the Explorer shows different objects because a playtest tab is active, click the viewport tab to see the world you are editing. When ribbon buttons are grayed out because a script or playtest tab is active, click the viewport tab.

## Troubleshooting

| What you see | Fix |
|---|---|
| The Explorer suddenly shows different objects. | Click the viewport tab to see the world you are editing; see [What follows the active tab](#what-follows-the-active-tab). |
| Ribbon buttons are grayed out. | Click the viewport tab; see [What follows the active tab](#what-follows-the-active-tab). |
