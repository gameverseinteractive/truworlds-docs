---
title: Properties panel
description: Read and edit the properties of the selected objects
---

# Properties panel

The Properties panel shows the properties of whatever is selected. Changing a value in the Properties panel changes the object immediately. Every change you make in the Properties panel is one step in the [edit history](edit-history.md#undo-and-redo) and can be undone with Ctrl+Z (Cmd+Z on macOS).

## Class headers

For a [part](../building/parts.md), the Properties panel's [class](../engine/instance-tree.md) headers are, from the top: [Part](api:Part), [PhysicsInstance](api:PhysicsInstance), [DynamicInstance](api:DynamicInstance), [VisualInstance](api:VisualInstance), [Instance](api:Instance) (properties every object has, such as [Name](api:Instance.Name), [Parent](api:Instance.Parent) and [Locked](api:Instance.Locked)) and [TruWorldsObject](api:TruWorldsObject), with the read-only [ClassName](api:TruWorldsObject.ClassName).

## Editors for each type

Each property in the Properties panel gets an editor that fits its [type](../engine/data-types.md). In the Properties panel, press Enter or click somewhere else to apply what you typed.

A faded row in the Properties panel cannot be edited: the property is read-only, it is managed for you on that instance (such as a system's name), or the instance is managed by TruWorlds. A value outside a property's allowed range is stored as the nearest allowed value, and the field shows what was stored.

| Property type | Editor |
|---|---|
| Text | A text field: type and press Enter. |
| Whole number | A number field: drag or type. Fractions are rounded to the nearest whole number. |
| True or false | A checkbox: click to toggle. |
| [Vector3](api:Vector3) | A text field: type all three numbers separated by commas, or expand the row to edit X, Y or Z. |
| Instance | A button showing that instance's name: click it, then click the instance you want. |

## Calculations in number fields

A number field accepts a calculation and stores the result. If a number field's text is not a valid calculation (`abc`) or divides by zero (`5/0`), the value is left as it was.

Use a period as the decimal point inside calculations in a number field. When a calculation you typed in a number field changes nothing, check its brackets.

## Instance references

Some properties point at another instance, such as the two parts a weld joins. After you click an instance-reference button, only an instance of the right kind is accepted: clicking anything else does nothing and the button keeps waiting.

## Several objects selected

If you select several objects, the Properties panel shows the properties they have in common. With several objects selected, a row where they differ shows `--` in number, text and reference fields, and (multiple) in dropdowns and checkboxes. What you enter applies to all of them as one undo step.

Editing just the Y row of [Size](api:Part.Size) for ten selected parts that share a height but differ in width sets the height of all ten and leaves each part's own width and depth as they were.

## Scripts in the Properties panel

When exactly one instance is selected, the Properties panel lists its [attached scripts](../scripting/script-components.md), each under its own header, above the class headers. The + Add Script Component button is at the bottom of the Properties panel.

## During a playtest

Property changes made on a playtest tab apply to the [running copy](../playtesting/debugging-a-playtest.md) only and are discarded when the playtest stops.

## Troubleshooting

| What you see | Fix |
|---|---|
| You typed a calculation and nothing happened. | Check its brackets, and use a period as the decimal point; see [Calculations in number fields](#calculations-in-number-fields). |
