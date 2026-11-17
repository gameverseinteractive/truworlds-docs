---
title: Edit History
description: Undo, redo, and jump back and forth through your edits
---

# Edit History

The Edit History lists the changes you made to the world and lets you step back and forward through them. Almost everything you do to the world is recorded as a step and can be undone. The Edit History panel is at the right bottom by default, and has no ribbon button (use the icon strip). It is the list of undoable steps. Click a step to jump back or forward to it.

## Undo and redo

Ctrl+Z undoes the last world edit in the viewport or Explorer, and undoes typing in a script tab.

| Command | Keys and menu |
|---|---|
| Undo | Undo is Ctrl+Z (Cmd+Z on macOS), or Edit > Undo. |
| Redo | Redo is Ctrl+Shift+Z (Cmd+Shift+Z on macOS), or Edit > Redo. |

## What is a step

One step is one whole action: one drag however far it went, one paste, one property change even on fifty selected parts, one grouping.

> [!NOTE]
> While the color picker is open, changes preview on the object; the color is applied as one undo step when you close the picker.

| Change | Recorded as a step |
|---|---|
| Objects | Inserting, deleting, duplicating, pasting, cutting, grouping and ungrouping objects are recorded as steps. |
| Transforms | Moving, rotating, resizing and scaling are recorded as steps. |
| Properties | Every property change made in the Properties panel, the ribbon or the tool belt is recorded as a step. |
| Explorer | Reordering and reparenting in the Explorer are recorded as steps. |
| Renaming | Renaming is recorded as a step. |
| Solid modeling | Union, intersect, negate and separate are recorded as steps. |
| Scripts | Attaching and detaching scripts are recorded as steps. |
| Asset Library | Inserting from the Asset Library and applying images are recorded as steps. |
| UI | Moving, resizing and anchoring UI elements are recorded as steps. |
| Selection | Selecting and deselecting are not recorded as steps. |
| Camera | Moving the camera is not recorded as a step. |
| Interface | Changing panels, tabs and settings is not recorded as a step. |
| Playtest | Changes inside a playtest, to its running copy of the world, are not recorded as steps. |
| Command bar | A change made from the command bar is not a step in the Edit History, so Ctrl+Z does not undo it. |

## The Edit History panel

The Edit History panel lists the steps by name, oldest at the top. The highlighted row is where you are now: rows above it are done, rows below it are undone and can be redone.

Click a row above the current one to undo back to just after that step. Click a row below the current one to redo forward to that step. Clicking a row lets you jump several steps at once and compare before and after.

## Step names

The [Script Console](script-console.md#what-truworlds-creator-writes) records each step by name.

| Step | What you did |
|---|---|
| Insert Part | The step Insert followed by a class name, or Insert followed by a name, means you inserted an object, an asset or a prefab. |
| Transform instances | The step Transform instances means you moved or rotated the selection with a tool or by dragging. |
| Resize part | The step Resize part means you resized one part with the Resize tool. |
| Scale instances | The step Scale instances means you scaled several objects or a model. |
| Delete Instance | The step Delete Instance, or Delete n Instances, means you deleted. |
| Duplicate Instance | The step Duplicate Instance, or Duplicate n Instances, means you duplicated. |
| Paste instances | The step Paste instances means you pasted. |
| Group Instance | The step Group Instance, or Group n Instances, means you grouped into a [Model](api:Model). |
| Ungroup Instances | The step Ungroup Instances means you ungrouped. |
| Rename n Instance(s) | The step Rename n Instance(s) means you renamed. |
| Edit Size | The step Edit followed by a property means you changed a property in the Properties panel, for example Edit Size. The console line also shows the new value, as in `- Edit Size -> Vector3(2, 1, 4)`. |
| Attach Script to | The step Attach Script to followed by a name, or Detach Script from followed by a name, means you attached or removed a script component. |

## Limits

The Edit History keeps the last 100 steps. When you make a 101st, the oldest is forgotten.

Making a new edit after undoing discards the steps you undid: they can no longer be redone.

Opening a world or starting a new one clears the Edit History. Saving does not clear the Edit History: you can still undo after a save.

## Tabs and playtests

Each tab has its own undo history, and the Edit History follows the active tab. Undo inside a script tab undoes typing in that script. When Ctrl+Z does nothing, click the tab whose steps you want to undo, such as the viewport tab.

The world you are editing keeps its own history while a playtest runs: on the viewport tab your steps are all still there, and undo and redo there work on the world as usual. Changes you make to the world on the viewport tab while a playtest runs, such as inserting a part or changing a property, are recorded in the world's own history as usual and stay after the playtest stops.

On a [playtest tab](../playtesting/switching-sessions.md) the Edit History starts empty. It then shows that session's own steps, such as moves you made with the Server tab's tools. A playtest tab's own steps vanish with the playtest.

## Changes made by an AI agent

Each change an agent makes is recorded in the agent history, separately from your own undo history. Agent changes are kept apart from your own. Ctrl+Z undoes your own edits, not the agent's. To undo the agent's changes, see [Working with an AI agent](ai-agents.md).

## Problems and fixes

| Problem | Fix |
|---|---|
| Ctrl+Z does nothing. | Click the tab whose steps you want to undo, such as the viewport tab: [Tabs and playtests](#tabs-and-playtests). |
| You undid too far. | Redo: [Undo and redo](#undo-and-redo), [The Edit History panel](#the-edit-history-panel). |
| Redo is gone. | [Limits](#limits). |
| The Edit History is empty. | [Tabs and playtests](#tabs-and-playtests), [Limits](#limits). |
