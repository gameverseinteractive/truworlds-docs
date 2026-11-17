---
title: Viewport and selection
description: Move the editing camera, and pick objects by clicking or dragging a box
---

# Viewport and selection

The viewport is the 3D view in the center of TruWorlds Creator, on the first tab. It shows the world through an editing camera that you fly around freely. The editing camera is only for building: it is not the [camera players get](../gameplay/camera.md).

## Giving the viewport the keyboard

Keyboard input goes to the part of the window you used last: after typing in the Properties panel or searching the Explorer, W does not move the camera. Click anywhere in the viewport, with any mouse button or the scroll wheel, to give it the keyboard.

## Flying the camera

| Input | What it does |
|---|---|
| W | Forward, in the direction the camera is looking. |
| S | Backward. |
| A | Left. |
| D | Right. |
| E | Up. |
| Q | Down. |
| Right mouse button and mouse movement | Look around. The pointer is hidden while the button is down. |

The editing camera's movement keys follow their position on the keyboard, not the letter printed on them.

## Camera speed

To change the editing camera's speed, hold the right mouse button over the viewport and roll the scroll wheel: up is faster, down is slower. Scrolling changes the editing camera's speed only while the right mouse button is held.

## Framing the selection

Press F, with the viewport focused, to move the camera so the whole selection fits in view. F does nothing when nothing with a size and position is selected, such as only a [Folder](api:Folder) of scripts or a value object. When F does nothing because the selection has no size or position, select a part or model.

## Selecting in the viewport

Hold Shift or Ctrl (Cmd on macOS) while clicking to add to the selection, or drag a box around the instances in the viewport.

| Action | What it does |
|---|---|
| Click | Selects the object and deselects everything else. |
| Alt-click | Selects the single part under the pointer instead of the [model](../building/models-and-folders.md) it belongs to. |
| Click empty space or a locked object | Clears the selection. |
| Esc | Clears the selection (Select > Deselect All). |

## Box select

To box select, press the left mouse button on empty space, drag, and release. Box select picks every object the rectangle touches, not only those fully inside it. Box select skips [locked](transform-tools.md#locking) objects.

> [!WARNING]
> In a new world the Baseplate is not locked, so a drag that starts on it moves the Baseplate instead of drawing a box (press Ctrl+Z if that happens). Start the drag on the sky, or lock the Baseplate first.

## Troubleshooting

| What you see | Fix |
|---|---|
| W, A, S and D do nothing. | Click anywhere in the viewport to give it the keyboard; see [Giving the viewport the keyboard](#giving-the-viewport-the-keyboard). |
| The scroll wheel does nothing in the viewport. | Hold the right mouse button over the viewport and roll the scroll wheel; see [Camera speed](#camera-speed). |
| F does nothing. | Select a part or model; see [Framing the selection](#framing-the-selection). |
