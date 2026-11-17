---
title: Transform tools
description: Move, rotate and resize objects, with snapping and locking
---

# Transform tools

To transform an object is to change its position, orientation or size. TruWorlds Creator has four transform tools, Select, Move, Resize and Rotate, and direct dragging works in all of them.

## The tool belt

When something movable is selected, the tool belt, a floating bar, appears at the bottom center of the viewport. It holds the Select, Move, Resize and Rotate tools and, for parts, the [Toggle Anchored](../building/anchoring-and-collisions.md), Toggle Collision and Toggle Locked buttons.

## Choosing a tool

Pick a tool with the number keys 1 to 4 (no modifier held), in the Tools group of the ribbon's Home and Model tabs, or on the tool belt. The number keys only work while the [viewport has the keyboard](viewport-and-selection.md#giving-the-viewport-the-keyboard). If pressing 2 types a 2 into a field, click the viewport first.

| Tool | Key and when it is available |
|---|---|
| Select | Key 1. Always available. |
| Move | Key 2. Available when something with a position is selected. |
| Resize | Key 3. Available when a [Part](api:Part) or [MeshPart](api:MeshPart) is selected, directly or inside a selected model. |
| Rotate | Key 4. Available when something with a position is selected. |

## Dragging directly

In any tool, press on an object and drag to move it with the pointer. Pressing on an unselected object and dragging selects it and moves it in one go. A direct drag puts the selection down flush on the surface under the pointer: on the ground, on another part, against a wall.

## Moving, rotating and resizing

With the Move tool, arrows point out of the selection along the three axes; the green arrow, Y, is up. With the Rotate tool, three rings appear around the selection, one per axis, in red, green and blue. The Resize tool resizes a face of one selected part, or scales several selected objects or a model. When you resize one part, the opposite face stays where it is.

Press Esc while the mouse button is still down to cancel a drag, a handle drag or a box select; no undo step is recorded.

## Snapping

Snapping makes objects move, turn and resize in fixed steps. The snapping controls are in the Snapping group on the ribbon's Home and Model tabs.

Snapping moves objects in steps from where they are: a part at an off-grid position stays off-grid by the same amount. With move snapping on, resizing changes a part's size in whole move steps, and the part will not shrink below one step. Turn snapping off, or lower the step, to make thinner parts.

| Setting | What it does |
|---|---|
| Move snapping | On by default. Applies to the Move tool, the Resize tool, direct dragging and the position of newly inserted parts. |
| Move step | Defaults to [1 stud](../engine/coordinates-and-units.md). |
| Rotate snapping | On by default. Applies to the Rotate tool. |
| Rotate step | Defaults to 15°. |
| Collisions | A toggle, off by default, with the tooltip "Stop dragged parts against the surfaces they touch". |

## Collision snapping

With Collisions on, objects you move stop when they touch another object instead of passing through it. Collision snapping only counts parts with [CanCollide](api:PhysicsInstance.CanCollide) on: a part with `CanCollide` off passes through other parts while dragged, and they pass through it.

## Locking

Clicking [empty space or a locked object](viewport-and-selection.md#selecting-in-the-viewport) clears the selection, and [box select skips locked objects](viewport-and-selection.md#box-select). Lock the ground and other large scenery so you do not drag it by accident. To lock or unlock the selection, use Toggle Locked on the tool belt, Lock in the ribbon's Edit group, or the [Locked](api:Instance.Locked) checkbox in the Properties panel. To unlock something you can no longer click, select it in the [Explorer](explorer.md) and unlock it there.

## Exact values

For exact numbers, edit [Position](api:DynamicInstance.Position), [Size](api:Part.Size) and the [rotation](api:DynamicInstance.Rotation) properties in the [Properties panel](properties-panel.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| The number keys do not change the tool. | Click the viewport first; see [Choosing a tool](#choosing-a-tool). |
| A part will not get any thinner. | Turn snapping off, or lower the step; see [Snapping](#snapping). |
