---
title: UI editor
description: Select, move and resize on-screen UI right in the viewport
---

# UI editor

The UI editor lets you click, drag and resize a world's UI elements right in the viewport. You build a world's on-screen UI the same way as its 3D content: by placing objects and adjusting them by hand. TruWorlds Creator draws the world's UI over the viewport as a player will see it.

## Adding UI elements

To add a UI element, click the ribbon's [UI tab](ribbon-and-insert.md), then Panel, Text, Button, Text Input, Image, Circle or Scroll in the Elements group, or a layout from Layout. If the world has no [ScreenUI](api:ScreenUI) yet, adding a UI element creates one and puts the element inside it; see [Canvas and ScreenUI](../ui/canvas-and-screenui.md).

## UI edit mode

UI edit mode makes clicks in the viewport select UI elements instead of 3D objects. UI edit mode is on whenever the ribbon's UI tab is the active tab or a UI element is selected. While UI edit mode is on, clicking where an element is selects the element, not the part behind it.

To select 3D objects again, switch to the Home or Model tab and press Esc to clear the selection. When clicking selects the 3D world rather than UI, click the ribbon's UI tab.

## Selecting UI elements

| Click | What it selects |
|---|---|
| Click | The topmost element under the pointer. |
| Click again | The selected element's parent, and again the next level up; after the top, the next click starts again at the element under the pointer. |
| Alt-click | The UI element underneath the selected one, at the same spot. |
| Shift-click or Ctrl-click (Cmd on macOS) | Adds an element to the selection, or removes it. |
| Click on empty space | A click where there is no UI element goes through to the 3D world. |

To select a panel its children cover, click a child, then click the same spot again to climb to the parent.

## Outlines and handles

A solid outline means the element is freely positioned: its own position, size and rotation place it. A dashed outline means a [layout container](../ui/layout-containers.md) places the element, so it has no handles to drag. When a layout container is placing a UI element, change the container or reorder the element in the Explorer.

When exactly one freely positioned element is selected, its editing controls appear.

| Control | What it is |
|---|---|
| Resize handles | White squares at the four corners and the middle of the four edges. |
| Rotate handle | A round handle on a short stalk above the middle of the top edge. |

## Moving, resizing and rotating

Press on a selected UI element and drag to move it. Drag a resize handle to resize a UI element. While you resize a UI element, the opposite corner or edge stays where it is. Drag the rotate handle to turn a UI element around its [pivot](api:UIObject.Pivot).

Everything the UI editor's handles change is an ordinary [property](../ui/position-and-size.md).

## Quick Layout

Typing six properties to pin one button is slow. Quick Layout in TruWorlds Creator sets the [anchors](../ui/anchors.md), the pivot, the position and the size in one click; see [Pinning to a corner](../ui/anchors.md#pinning-to-a-corner).

To use Quick Layout, select one or more UI elements, click Quick Layout in the Anchors group of the ribbon's UI tab, then click one of the 16 presets.

## Trying your UI

Start a playtest to try your UI as a [player](../playtesting/switching-sessions.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| Clicking selects the 3D world, not your UI. | Click the ribbon's UI tab; see [UI edit mode](#ui-edit-mode). |
| A UI element has a dashed outline and no handles. | Change the container or reorder the element in the Explorer; see [Outlines and handles](#outlines-and-handles). |
| You cannot select a panel because its children cover it. | Click a child, then click the same spot again to climb to the parent; see [Selecting UI elements](#selecting-ui-elements). |
