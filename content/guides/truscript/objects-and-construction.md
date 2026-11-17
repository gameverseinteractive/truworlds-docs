---
title: Objects and construction
description: Types as values, new, constructor arguments and initializer blocks
---

# Objects and construction

Numbers, strings, arrays and tables are built into TruScript. Everything else you work with in a world, such as a [Part](api:Part), a [Vector3](api:Vector3), a color, a player or a signal, is an object provided by TruWorlds; see [instances](../engine/instance-tree.md).

## Types are values

Every class you can construct is a global with the class's name: [Part](api:Part), [Model](api:Model), [Vector3](api:Vector3), [Color3](api:Color3), [TweenParams](api:TweenParams), `Error` and so on. The global named after a class you can construct is a type value.

You use a type value in two ways: after `new`, to create an object of that type, and with a dot, to read a static member. A static member is something that belongs to the type itself and not to one object.

Because a type is a value, you can store it in a variable or a table and construct from the variable later.

## Creating an object with new

To create an object, write `new`, the type name and the constructor arguments in parentheses, which are required even with no arguments. For creating an instance this way, see [Creating an instance](../engine/creating-and-destroying.md#creating-an-instance).

`new Part` without parentheses is a compile error. The name after `new` must be a plain name. `new shapes.Kind()` is a compile error. To construct from a type held in a table, put the type in a local variable first, then write `new` with that variable.

## Initializer blocks

When you create an instance, an initializer block sets several properties in one go, exactly as assigning them one after another.

This server script, attached to any instance, creates an anchored 20 x 1 x 20 floor part with an initializer block, [Parent](api:Instance.Parent) last.

```truscript
local floor = new Part() {
    Name = "Floor",
    Size = new Vector3(20, 1, 20),
    Position = new Vector3(0, 0.5, 0),
    Anchored = true,
    Parent = world
}
```

With an initializer block, the object is created first, then each listed member is assigned, from top to bottom. An initializer block can follow any function call, not only `new`, and is applied to whatever the call returns, which is handy with [Clone()](api:Instance.Clone) and your own factory functions.

## Initializer block or table literal

| What differs | Table literal and initializer block |
|---|---|
| Where it appears | A table literal appears on its own, as a value (`local t = { a = 1 }`); an initializer block appears directly after the `)` of a call (`new Part() { ... }`). |
| What it does | A table literal creates a new table. An initializer block assigns members of the object the call returned. |
| Left of `=` | On the left of `=`, a table literal takes a key (a name taken as text, a quoted string or a number); an initializer block takes a member name only. |

## Members

Objects are not open like tables: reading or writing a member that does not exist is a runtime error, where a missing table key is `nil`. Member names are case-sensitive: `v.x` is not `v.X`.

When a member does not exist, check its spelling and capitals. See [members](../engine/properties-methods-signals.md).

## nil instead of an object

The most common object error has nothing to do with the object's type. It happens when the variable holds `nil`. Check a result that can be `nil` before you use it as an object.

## Troubleshooting

| What you see | Fix |
|---|---|
| A compile error says a `(` was expected after the type name: `Expected '(' after type name` | Write the parentheses, or put the type in a local first. See [Creating an object with new](#creating-an-object-with-new). |
