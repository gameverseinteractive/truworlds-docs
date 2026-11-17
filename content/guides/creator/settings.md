---
title: Settings
description: The Settings window, and the preferences TruWorlds Creator remembers
---

# Settings

Settings lists its categories, General and Agents, on the left, and the chosen category's options on the right. On Windows, open Settings with Edit > Editor Settings... or Ctrl+, (Control and the comma key). On macOS, open Settings from the application menu's Settings... or with Cmd+,. In the Settings window, click Save to keep your changes, or Cancel to close the window. Save is grayed out until you change something.

## Viewport Graphics Quality

Viewport Graphics Quality, in the General category of Settings, sets how much visual detail the viewport draws while you edit and playtest: Toaster, Low, Medium, High or Epic.

Viewport Graphics Quality changes only how TruWorlds Creator draws on your computer. It is not saved into the world and has no effect on what players see.

> [!TIP]
> If the viewport feels slow in a large world, lower Viewport Graphics Quality first.

## Trusted creators

Reset trusted creators, under Trusted creators in the General category, forgets every creator you chose to trust with "Don't ask again for prefabs by creator", so TruWorlds Creator asks again before placing another creator's prefab that contains scripts.

When prefabs from a creator you no longer trust are placed without asking about their scripts, click Reset trusted creators in Settings.

## Agents

The Agents category of Settings manages [AI coding agents](ai-agents.md) that you allow to work in your world alongside you.

> [!NOTE]
> The Connect agent button on the ribbon tab row opens the Connect an agent window, which starts the same process as connecting an agent from the Agents category of Settings.

| Item | What it does |
|---|---|
| This window: ID | It shows an identifier for this TruWorlds Creator window, with a Copy window ID button. |
| Connect an agent... | It starts connecting a new agent. |
| Connected now | It lists the agents connected to this window and what each is doing: "Waiting for you to allow it", "Working in world" or "Idle in world" (with the world's name), or "Working now" or "Idle" when the window has no world name to show. Stop disconnects one. When none are connected it says "No agents are connected to this window." |
| Always allowed | It lists the agents you have allowed permanently, with the date. Forget removes one and Forget all removes them all. When empty it says "No agents are always allowed. TruWorlds Creator asks before each new one connects." |
| Stopped or denied | It lists the agents you stopped or refused, with Allow again. |

## What TruWorlds Creator remembers

Many preferences have no entry in the Settings window. TruWorlds Creator simply remembers them from the last time you used them.

The preferences TruWorlds Creator remembers are stored on your computer, for your user account. They are not part of any world and do not travel with a world file.

TruWorlds Creator's settings are written when you save a world and when you change certain options. If TruWorlds Creator's settings cannot be read at start-up, the affected part falls back to its default and the rest is kept.

| Preference | How you change it |
|---|---|
| The window's size, its position and whether it is maximized | Resize or move the window. |
| The panel layout: each panel's dock, the active panel per dock, collapsed docks and divider positions | Drag dividers, and use each panel's Options > Move Panel. |
| The active ribbon tab | Click a tab. |
| Move snapping, rotate snapping and collision snapping, and both step sizes | Use the ribbon's Snapping group. |
| The choice of Local or World axes | Use the ribbon's Axes group, or Ctrl+L. |
| Whether device preview is on or off, the chosen device and Flip | Use the ribbon's UI > Device group. |
| Show Advanced Game Systems | Use the Explorer's Options menu. |
| Which property sections are collapsed | Click a section's arrow in the Properties panel. |
| The Script Console's text size | Use Zoom In and Zoom Out in the console's menu. |
| The Asset Library's tile size | Use the Tile size slider in the Asset Library. |
| Recent files, up to 10, in File > Recent Files | Choose Clear Recent Files at the bottom of that menu to empty it. |
| Which file on your computer belongs to which published world | It is set when you save a file that is linked to a published world. |
| Trusted prefab creators | They are set in the Place window and reset in Settings. |
| Your sign-in | It is changed with the account button, and Log out forgets it. |

## Troubleshooting

When your panel layout is a mess, use each panel's Options > Move Panel to put it back.

| What you see | Fix |
|---|---|
| The viewport is slow. | Lower Viewport Graphics Quality first. See [Viewport Graphics Quality](#viewport-graphics-quality). |
| Your panel layout is a mess. | Use each panel's Options > Move Panel. See [Troubleshooting](#troubleshooting). |
| Prefabs from a creator you no longer trust are placed without asking about their scripts. | Click Reset trusted creators in Settings. See [Trusted creators](#trusted-creators). |
