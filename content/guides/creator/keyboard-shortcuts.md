---
title: Keyboard shortcuts
description: Every shortcut in TruWorlds Creator, by where you use it
---

# Keyboard shortcuts

On macOS, Cmd takes the place of Ctrl in TruWorlds Creator's keyboard shortcuts, except where a shortcut says otherwise. TruWorlds Creator does not have a way to change its shortcuts.

## Files and tabs

| Keys | What they do |
|---|---|
| Ctrl+Shift+H | Goes to the Home Screen, with New world, Open world, Your projects, Recent files and Start with a template. Coming from an open world, its back arrow closes it again without changing that world. |
| Ctrl+N | New World. Replaces the open world with a new, empty one. If the open world has unsaved changes, you are asked first. |
| Ctrl+O | Open World... Opens a world file from your computer in place of the open world. If the open world has unsaved changes, you are asked whether to save them first. |
| Ctrl+S | Save. Writes the world to its file; the first time, it asks where to save. Saving does not publish, and it is not possible during a playtest. |
| Ctrl+Shift+S | Save As... Asks for a new file name and saves there. You carry on working in the new file. |
| Ctrl+W | Closes the active tab; closing a script tab loses nothing. On the viewport tab it is the same as File > Exit, so check which tab is active first. |
| Ctrl+Tab | Goes to the next tab, with the Control key on every platform. |
| Ctrl+Shift+Tab | Goes to the previous tab, with the Control key on every platform. |
| Ctrl+, | Opens Settings, which lists its General and Agents categories on the left and the chosen category's options on the right. The keys are Control and the comma key. |

## Editing

For Undo and Redo, see [Undo](edit-history.md#undo-and-redo).

| Keys | What they do |
|---|---|
| Ctrl+Z | Undo. Takes back the last step, one whole action such as one drag, one paste or one grouping. Each tab has its own undo history. |
| Ctrl+Shift+Z | Redo. Does again a step you undid. Making a new edit after undoing discards the undone steps, and they can no longer be redone. |
| Ctrl+X | Cut. Copies the selection and removes it from the world. |
| Ctrl+C | Copy. Copies the selection, including all descendants and attached scripts. |
| Ctrl+V | Paste. Adds the copy inside the first selected instance, in front of the camera, or into the World when nothing or a system is selected. Right after Ctrl+C the original is still selected, so press Esc first or use Duplicate. |
| Ctrl+Shift+V | Paste in Selection. Adds the copy as a child of the first selected instance, at its original position, or into the World when nothing is selected. |
| Ctrl+D | Duplicate. Copies each selected instance next to the original, with the same parent, right after it in the tree and at the same position in the world. |
| Ctrl+G | Group. Puts the selected instances inside a new Model, so they select and move together, and selects that Model. |
| Ctrl+Backspace | Ungroup. Moves the contents of a selected Model or Folder up into its parent, removes the empty container and selects the former contents. It works one level at a time. |
| F2 | Rename. Opens a window where you type the new name and press Enter. With several instances selected, they all get the same name. |
| Delete or Backspace | Delete. Removes the selection together with all of its descendants. Ctrl+Z brings everything back. |

## Selecting

See how the viewport [selects](viewport-and-selection.md#selecting-in-the-viewport).

| Keys and mouse | What they do |
|---|---|
| Click | Selects. Clicking an object in the viewport selects it and deselects everything else, and clicking a part selects the outermost Model that contains it. Clicking empty space or a locked object clears the selection. |
| Shift-click or Ctrl-click | Adds to or removes from the selection. It combines with Alt, and on empty space it leaves the selection as it is. |
| Alt-click | In the viewport, selects the single part instead of its model: the exact part under the pointer, however deeply it is nested. |
| Drag from empty space | In the viewport, box select. Selects every object the rectangle touches, including objects hidden behind others, but skips locked objects. |
| Shift or Ctrl with box select | Adds the boxed objects to the selection instead of replacing it. Hold the key when you start the drag. |
| Alt with box select | Box-selects single parts instead of models. Hold Alt when you start the drag. |
| Ctrl+A | Selects all direct children of the World, except the Camera. |
| Esc | Deselects all. |

## Tools

The viewport tool keys work while the viewport has the keyboard, and apart from Ctrl+L only while no modifier key is held. The tool keys switch the tool even when nothing is selected. Each [tool](transform-tools.md) has its own page.

| Keys and mouse | What they do |
|---|---|
| 1 | Picks the Select tool. |
| 2 | Picks the Move tool, whose arrows point out of the selection along the three axes; drag one to move the selection along that axis only. |
| 3 | Picks the Resize tool, which resizes a face of one selected part, or scales several selected objects or a model. |
| 4 | Picks the Rotate tool, whose three rings, one per axis, turn the selection around that axis when you drag them. |
| Ctrl+L | Switches between Local and World axes, which decide whether the selection box and the Move, Rotate and Resize handles turn with the selection or with the world. Local is the default. |
| F | Frames the selection, moving the camera so the whole selection fits in view. It does nothing when nothing with a size and position is selected, such as only a Folder of scripts. |
| Drag a selected object | Moves it along surfaces, putting it down flush on the surface under the pointer. With several objects selected, dragging one moves them all. |
| Alt while scaling | Scales along one axis only when scaling several objects, the one you drag, stretching the selection instead of scaling it equally in all three directions. |
| Esc during a drag | Cancels the drag, a handle drag or a box select, as long as the mouse button is still down. No undo step is recorded. |

## Camera

The camera keys do not need the right mouse button held; they work whenever the viewport has the keyboard. They move the [editing camera](viewport-and-selection.md).

| Keys and mouse | What they do |
|---|---|
| W and S | Move the editing camera forward and backward. |
| A and D | Move the editing camera left and right. |
| E and Q | Move the editing camera up and down. |
| Right mouse button and mouse movement | Looks around with the editing camera while you hold the button and move the mouse. Right-dragging never selects or moves an object. |
| Shift | Moves the editing camera at half speed while held, for careful positioning. It halves whatever camera speed is set. |
| Alt | Moves the editing camera at double speed while held, for crossing large worlds. It doubles whatever camera speed is set. |
| Right mouse button and scroll wheel | Changes the editing camera's speed while you hold the button and turn the wheel, by 2 per notch: up is faster, down is slower. The speed runs from 1 to 300 and is 30 by default. |

## Script editor

These shortcuts apply in the [script editor](script-editor.md).

| Keys | What they do |
|---|---|
| Ctrl+F | Find. Opens the find bar at the top right and highlights matches as you type. It searches only the script you have open. |
| Ctrl+H | Replace. Opens the find bar with the replace row showing, for Replace Next and Replace All. Replace All is a single undo step. |
| F3 | Find next. Goes to the match after the caret. It also works with the find bar closed, repeating the last search. |
| Shift+F3 | Find previous. Goes to the match before the caret. It also works with the find bar closed, repeating the last search. |
| Ctrl+G | Go to line. Opens the Go to box, where you type a line number or `line:column` and press Enter to move the caret there. |
| Ctrl+Space | Shows code completion, with the Control key on every platform. Use it to open the suggestion list yourself; the list also opens by itself as you type, for example after a `.`. |
| Up and Down, Page Up and Page Down, Home and End | Move through the suggestion list. Up and Down wrap around at the ends, and Page Up and Page Down move eight rows. |
| Tab or Enter | Accepts the selected suggestion. The list never opens by itself on an empty position, so Enter at the end of a line always starts a new line. |
| Tab and Shift+Tab | Tab indents and Shift+Tab unindents, including every selected line. Indentation is made of spaces, not tab characters. |
| Esc | Closes the suggestion list, the signature hint, or the find and go-to bars, in that order. |

## Script Console

These shortcuts apply in the [Script Console](script-console.md). In the Script Console's command bar, Shift+Enter starts a new line; see [Several lines](script-console.md#several-lines).

| Keys and mouse | What they do |
|---|---|
| Ctrl+C | Copies the selected text. |
| Ctrl+A | Selects all. |
| Ctrl+= | Zooms in, making the text larger. TruWorlds Creator remembers the text size. |
| Ctrl+- | Zooms out, making the text smaller. |
| Ctrl+0 | Resets the zoom, returning the text to the normal size. |
| Ctrl and scroll wheel | Zooms in or out. |
| Enter | In the command bar, runs the command straight away, in the active tab's copy of the world and with no confirmation. Its changes are not steps in the Edit History, so Ctrl+Z does not undo them. |
| Up and Down | In the command bar, go to the previous and next command: Up on the first line, Down on the last. The history lasts until you close TruWorlds Creator. |

## Number fields in the Properties panel

These shortcuts apply in the [Properties panel](properties-panel.md).

| Keys and mouse | What they do |
|---|---|
| Drag left or right | Lowers or raises the value, in steps of 1 for whole numbers and 0.1 for decimals. The change is applied when you release the mouse. |
| Up and Down | While typing, change the value by one step: 0.1 for decimals, 1 for whole numbers. |
| Shift+Up and Shift+Down | While typing, change the value by ten steps (1 for a decimal property). |
| Ctrl+Up and Ctrl+Down | While typing, change the value by a hundred steps (10 for a decimal property). |
| Alt+Up and Alt+Down | While typing, change the value by a tenth of a step (0.01 for a decimal property). |
| Enter | Applies the value. |
| Tab and Shift+Tab | Apply the value and go to the next or previous field. Tab opens the next field with its value selected. |

## Editing UI in the viewport

These shortcuts apply when [editing UI](ui-editor.md).

| Keys and mouse | What they do |
|---|---|
| Click the selected element again | Selects its parent, and clicking again selects the next level up. This is how you reach a container that its children cover completely. |
| Alt-click | Selects the element underneath the selected one, at the same spot, going down through overlapping elements. |
| Shift while moving | Moves along one direction, horizontal or vertical, whichever you have dragged furthest in. |
| Shift while resizing | Keeps the proportions. It can be combined with Alt. |
| Alt while resizing | Resizes from the center, so both sides move equally. |
| Shift while rotating | Rotates in 15 degree steps. |
| Shift while dragging the pivot or an anchor | Snaps it to corners, edge midpoints and the center. |
| Ctrl while pressing | Grabs the pivot or anchor marker under a handle. Without Ctrl, the handles win where they overlap the markers. |

## Curve and gradient editors

| Keys and mouse | What they do |
|---|---|
| Double-click | Adds a keypoint or stop: on the curve editor's graph it adds a keypoint at that time, and on the gradient editor's bar it adds a stop. |
| Right-click a keypoint or stop | Removes it. |
| Delete or Backspace | Removes the selected keypoint or stop. |
| Esc | Cancels the drag. |

## Search fields and dialogs

| Keys | What they do |
|---|---|
| Esc in the Explorer or Insert search field | Clears the search. |
| Enter in the Insert search field | Inserts the first result. |
| Esc in a dialog window | Closes it without doing anything. |
| Esc while dragging from the Asset Library | Cancels the drag. |

## Same key, different job

A few keys in TruWorlds Creator do different jobs depending on where the keyboard is. Ctrl+Z undoes the last world edit in the viewport or Explorer, and undoes typing in a script tab; see [Undo and redo](edit-history.md#undo-and-redo).

| Keys | In the viewport or Explorer | In a script tab |
|---|---|---|
| Ctrl+G | Group, as in the rest of TruWorlds Creator. | Opens the Go to box while you are typing in a script. |
| Ctrl+A | Selects all direct children of the World, except the Camera. | Selects all text. |
| Ctrl+C and Ctrl+V | Copy and paste objects. | Copy and paste text. |
| Esc | Deselects all, or cancels a drag in progress. | Closes the suggestion list or find bar. |
| Backspace | Deletes the selection. | Deletes a character. |

## Where the keyboard is

Keyboard input goes to the part of the window you used last: after typing in the Properties panel or searching the Explorer, W does not move the camera; see [Giving the viewport the keyboard](viewport-and-selection.md#giving-the-viewport-the-keyboard).

When a text field has the keyboard, a letter or number shortcut types into the field instead. When that happens, click the viewport.

> [!TIP]
> If a shortcut seems to do the wrong thing, check which tab is [active](interface-overview.md#what-follows-the-active-tab) and click where you want the keyboard to go.

## Troubleshooting

| What you see | Fix |
|---|---|
| A letter or number shortcut types into a field instead. | Click anywhere in the viewport, with any mouse button or the scroll wheel. See [Giving the viewport the keyboard](viewport-and-selection.md#giving-the-viewport-the-keyboard). |
