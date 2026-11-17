---
title: Explorer
description: Read the tree, and rename, group and reorder objects
---

# Explorer

The Explorer is the panel that shows everything in a world as a tree of its instances. The top level of the Explorer [tree](../engine/instance-tree.md) lists the world's systems, the fixed containers every world has.

## The systems

The Explorer hides some systems by default. In a new world the key systems are visible: [World](api:World), [Players](api:Players), [Storage](api:Storage), [Lighting](api:Lighting), [UICanvas](api:UICanvas), [InputSystem](api:InputSystem) and [PlayerDefaults](api:PlayerDefaults); see [Lighting](../environment/lighting.md) and [Canvas and ScreenUI](../ui/canvas-and-screenui.md).

| System | What it holds |
|---|---|
| [`World`](api:World) | [Parts](../building/parts.md), models, lights, effects, the [PlayerStart](api:PlayerStart) and the [Camera](api:Camera): everything players see and touch. A new world holds a [Camera](api:Camera), a Baseplate and a [PlayerStart](api:PlayerStart). |
| [`Players`](api:Players) | The [players](../players/players-and-characters.md) in the world. It is empty while you edit and fills during a playtest. |
| [`Storage`](api:Storage) | Objects kept out of the 3D world until a script needs them. |
| [`Lighting`](api:Lighting) | The sun, sky, fog and ambient light. A new world has one Sky in it. |
| [`UICanvas`](api:UICanvas) | On-screen user interface, such as [ScreenUI](api:ScreenUI) containers. |
| [`InputSystem`](api:InputSystem) | Input actions. |
| [`PlayerDefaults`](api:PlayerDefaults) | Settings and the default character every player starts with (`DefaultCharacter`, with its `Animations` and `Sounds` folders). |

## Selecting in the tree

The Explorer and the viewport share one selection, and the Properties panel shows that same selection. The Explorer selects exactly the row you click, so it is the easy way to reach a part deep inside a model.

## Searching

The Search field at the top of the Explorer filters the tree as you type. A row matches when its name or class name contains what you typed, in any case.

## Moving instances in the tree

Drag a row in the Explorer to move the instance in the tree. Dragging a part into a [model or a folder](../building/models-and-folders.md) changes where it sits in the tree, not where it sits in the world.

| Where you drop | What happens |
|---|---|
| On a row | Makes the dragged instance a child of that row's instance. |
| On the line between two rows | Places the dragged instance there among its new siblings, with the same parent as the row next to the line. |

## Copying and pasting

| Command | What it does |
|---|---|
| Paste (Ctrl+V) | Adds the copy inside the first selected instance, in front of the camera; with nothing or a system selected, it goes into the [World](api:World). |
| Paste in Selection (Ctrl+Shift+V) | Adds the copy as a child of the first selected instance, at its original position; with nothing selected, into the [World](api:World). |
| Duplicate (Ctrl+D) | Copies each selected instance next to the original: same parent, right after it in the tree, same position in the world. |

> [!WARNING]
> Right after Ctrl+C the copied object is still selected, so a plain Ctrl+V puts the copy inside the original. Press Esc first, select where the copy should go, or use Duplicate (Ctrl+D), which always makes a sibling.

## Renaming, grouping and deleting

Rename an instance with F2, or by editing [Name](api:Instance.Name) in the Properties panel. To group instances, see [Grouping and ungrouping](../building/models-and-folders.md#grouping-and-ungrouping). Deleting an instance in TruWorlds Creator deletes all of its descendants with it.

## Systems are protected

Systems such as [World](api:World), [Players](api:Players) and [Lighting](api:Lighting) cannot be renamed, deleted, moved or copied. Pressing Delete with a system selected shows a message that the action could not be performed because the system's Parent is locked; nothing has changed.

Systems cannot be deleted: delete the objects inside a system instead.

## Script buttons

An instance with at least one [script](../scripting/script-components.md) shows a script button at the right end of its row in the Explorer.

## During a playtest

What the Explorer shows depends on the [active tab](interface-overview.md#what-follows-the-active-tab).

## Troubleshooting

| What you see | Fix |
|---|---|
| Pressing Delete shows a Could not perform action message. `Cannot change locked property 'Parent' of Instance 'Storage'.` | Delete the objects inside a system instead; see [Systems are protected](#systems-are-protected). |
