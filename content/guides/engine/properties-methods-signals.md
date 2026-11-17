---
title: Object members
description: Read and write properties, call methods, and listen to signals
---

# Object members

Every object offers members: named things you reach by writing a dot after the object. There are three kinds, and all three use a dot. TruScript never uses a colon for members: write `part.Destroy()`, not `part:Destroy()`.

## Properties

A property is a value the object holds. You read it, and usually assign to it: `part.Color = new Color3(1, 0, 0)`.

Assigning a value of the wrong type to a property is an error at the moment the line runs. The error message names the type you gave, the class that owns the property, the property, and the type it wants. Give a number to a number property, a [`Vector3`](api:Vector3) to a `Vector3` property, and so on.

Some properties can be read but not assigned. The API reference marks them read-only. Assigning to a read-only property is an error.

Some properties are two views of the same stored value: a part's position and rotation are stored together in its [CMatrix](api:DynamicInstance.CMatrix), and [Position](api:DynamicInstance.Position), [Rotation](api:DynamicInstance.Rotation) and [Quaternion](api:DynamicInstance.Quaternion) are shortcuts that read or write a piece of it.

A property may tidy up what you assign instead of refusing it, so reading it back can give something different from what you wrote. `Rotation` is stored as an orientation, not as three angles. Reading it back can give different angles that describe the same orientation.

## No properties of your own

Reading or writing a name that is not a member is an error. You cannot add your own properties to an instance: `part.Owner = player` is an error.

To keep extra data with an instance, parent a [value object](index.md) to it, or keep a table in your script keyed by the instance.

## Methods

A method is something the object can do. You call it with parentheses: `part.Destroy()`.

Most methods finish immediately. A few pause the calling script until something happens and then continue on the next line. Some methods work only on the server or only on a player's device.

Writing a method's name without parentheses does not call it. It gives you the function itself.

## Signals

A signal is how an object tells your script that something happened. You give a signal a function, and TruWorlds runs that function each time the event occurs.

This server script, attached to a [Part](api:Part), prints a line each time something touches the part.

```truscript
func on_touch(other):
    print(this.Name + " was touched by " + other.Name)

this.Touched.Connect(on_touch)
```

- `Connect(handler)` runs `handler` every time the signal fires.
- `Wait()` pauses the script until the signal next fires and gives what it fired with.
- `connection.Disconnect()` stops a connection made with [Connect](api:Signal.Connect) or [Once](api:Signal.Once).

## When a property changes

Every instance has a [Changed](api:TruWorldsObject.Changed) signal that passes the name of the property that changed.

This server script, attached to a [Part](api:Part), prints the name of each of the part's properties that changes, then sets its [Color](api:Part.Color) and [Anchored](api:PhysicsInstance.Anchored).

```truscript
this.Changed.Connect(func(property):
    print(property + " changed")
)

this.Color = new Color3(1, 0, 0)
this.Anchored = true
# Output:
# Color changed
# Anchored changed
```

It prints `Color changed`, then `Anchored changed`.

A `Changed` handler receives only the name of the property. In a `Changed` handler, read the property to get the new value.

When a property is set to the value it already has, `Changed` does not fire. `part.Anchored = true` on a part that is already anchored is silent.

Setting a shortcut property fires `Changed` with the name of the property that really stores the value: setting [Position](api:DynamicInstance.Position), [Rotation](api:DynamicInstance.Rotation) or [Quaternion](api:DynamicInstance.Quaternion) fires `Changed` with `"CMatrix"`.

`Changed` also fires with `"Parent"` when an instance is moved and with `"Name"` when it is renamed.

A change to a child's property does not fire `Changed` on the parent: `Changed` is about the object's own properties only.

A `Changed` handler does not run in the middle of the line that made the change. It runs the next time TruWorlds runs scripts, and reading the property then gives the latest value.

For anything that should happen every frame, connect to `game.TimeSystem.FrameStepped` instead of a `Changed` handler on a moving part, and read the position there.

## Troubleshooting

| What you see | Fix |
|---|---|
| `part:Destroy()` is a syntax error. | Write `part.Destroy()`, not `part:Destroy()`. [Object members](properties-methods-signals.md) |
| An error says a value of type Color4 cannot be assigned to a part's [Color](api:Part.Color): `Cannot assign value of type 'Color4' to property Part.Color of type 'Color3'.` | Give a number to a number property, a [`Vector3`](api:Vector3) to a [Vector3](api:Vector3) property, and so on. [Properties](#properties) |
