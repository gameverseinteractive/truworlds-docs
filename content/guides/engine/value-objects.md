---
title: Value objects
description: Small instances that each hold one value in the tree
---

# Value objects

A value object is an [instance](instance-tree.md) whose whole job is to hold one value. It has only a [Name](api:Instance.Name), a [Parent](api:Instance.Parent) and one extra property called `Value`.

## The five classes

The only value objects are [StringValue](api:StringValue), [NumberValue](api:NumberValue), [BoolValue](api:BoolValue), [InstanceValue](api:InstanceValue) and [Color4Value](api:Color4Value).

| Class | Holds |
|---|---|
| [StringValue](api:StringValue) | Text in [Value](api:StringValue.Value); a new one is named `String`. Longer text than its length limit is cut. |
| [NumberValue](api:NumberValue) | A number in [Value](api:NumberValue.Value); a new one is named `Number`. |
| [BoolValue](api:BoolValue) | `true` or `false` in [Value](api:BoolValue.Value); a new one is named `Bool`. |
| [InstanceValue](api:InstanceValue) | A reference to another instance, or `nil`, in [Value](api:InstanceValue.Value); a new one is named [InstanceValue](api:InstanceValue). |
| [Color4Value](api:Color4Value) | A [Color4](api:Color4), a color with opacity, in [Value](api:Color4Value.Value); a new one is named [Color4Value](api:Color4Value). |

## When to use one

A value object, unlike a variable, is worth using when the value needs to be seen from outside the script that owns it.

A value object fires [Changed](properties-methods-signals.md#when-a-property-changes) with the text `"Value"` whenever its value becomes different.

## Example: A door driven by a BoolValue

This server script, attached to a [Model](api:Model) named "Door", applies the `IsOpen` [BoolValue](api:BoolValue) to the `Panel` part: [CanCollide](api:PhysicsInstance.CanCollide) off and [Transparency](api:VisualInstance.Transparency) 0.7 while open, solid while closed, at the start and each time `Value` changes. It expects a [Part](api:Part) child named "Panel", and a `BoolValue` child named "IsOpen".

```truscript
local panel = this.WaitForChild("Panel")
local isOpen = this.WaitForChild("IsOpen")

func apply():
    panel.CanCollide = not isOpen.Value
    if isOpen.Value:
        panel.Transparency = 0.7
    else:
        panel.Transparency = 0

isOpen.Changed.Connect(func(property):
    if property == "Value":
        apply()
)
apply()     # apply the starting state too
```

## The object is not its value

The value object and its value are two different things. Adding a number to a value object itself, instead of to its value, is an error.

When you used the value object instead of its value in arithmetic, write `.Value`: `coins.Value + 1`.

For how an instance tests in an `if`, see [Truthiness](../truscript/truthiness.md). When `if isOpen:` is always true, test `isOpen.Value` instead.

## Naming

Avoid naming a value object after a member of its parent, such as [Name](api:Instance.Name), [Parent](api:Instance.Parent), `Size` or `Color`, because the [dot shortcut](instance-tree.md#finding-children) would give you the member instead of the child.

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says addition is not supported between a [NumberValue](api:NumberValue) and a number: `Addition is not supported between types 'NumberValue' and 'number'.` | Write `.Value`: `coins.Value + 1`. [The object is not its value](#the-object-is-not-its-value) |
