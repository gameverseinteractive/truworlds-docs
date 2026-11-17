---
title: VisualInstance inheritance
description: How Visible and Transparency work and pass down the tree
---

# VisualInstance inheritance

A [VisualInstance](api:VisualInstance) is any instance that can be seen. The class `VisualInstance` is the base of every instance that can be seen, and it adds three properties: [Visible](api:VisualInstance.Visible), [Transparency](api:VisualInstance.Transparency) and [IgnoreParent](api:VisualInstance.IgnoreParent).

[Model](api:Model), [Surface](api:Surface), [Trail](api:Trail), [Highlight](api:Highlight), [SelectionBox](api:SelectionBox), [ScreenUI](api:ScreenUI), [UIObject](api:UIObject), and [DynamicInstance](api:DynamicInstance) are built on `VisualInstance`. It is one of the important base classes that give many engine classes their default behavior.

## Hidden is still there

`Visible = false` stops an instance being drawn. Nothing else about it changes. Like [Visible](api:VisualInstance.Visible), transparency is only about drawing.

A hidden part still collides: players bump into it and things rest on it. Set `CanCollide = false` as well if a hidden part should be passable.

## Inherited down the tree

[Visible](api:VisualInstance.Visible) and [Transparency](api:VisualInstance.Transparency) are inherited: a parent's values affect its children.

The result of combining an instance's own values with its parent's is called the effective value, and it is what is actually drawn. The effective values are not properties you can read. `part.Transparency` and `part.Visible` always give the instance's own setting.

`Visible` is inherited; [CanCollide](api:PhysicsInstance.CanCollide) is not. Hiding a model hides every part, but each part's collision has to be switched off one by one.

## Transparency adds up

The instance's own [Transparency](api:VisualInstance.Transparency) is added to its parent's effective transparency. The sum is what is drawn; `1` or more is invisible.

Because the values add, a child can only be more transparent than its parent, never less. A `Transparency` of `1` or more draws as invisible.

The properties themselves do not change: a wall with its own `Transparency` of `0` still reads `0` after you fade the house model it is in. Only what is drawn changes.

## Only VisualInstance parents pass it on

Only a [VisualInstance](api:VisualInstance) passes its values down, and only to its direct `VisualInstance` children. If something that is not a `VisualInstance` sits in between, the chain stops there.

The usual culprit that sits in between and stops the chain is a [Folder](api:Folder). The chain stops in the same way for transparency, and at any other container that is not a `VisualInstance` ([Empty](api:Empty), a value object).

To organize the inside of something you want to fade or hide as one, group with models, not folders.

## IgnoreParent

Setting `IgnoreParent = true` on an instance cuts it loose from its parent's [Visible](api:VisualInstance.Visible) and [Transparency](api:VisualInstance.Transparency). It uses its own values and nothing else.

## Example: A ghost model with a solid core

This server script, attached to a [Model](api:Model) that contains a [Part](api:Part) named "Core", fades the whole model to a ghost, but keeps the core fully solid.

```truscript
local core = this.FindFirstChild("Core")
if core != nil:
    core.IgnoreParent = true

this.Transparency = 0.8
```

## Troubleshooting

| What you see | Fix |
|---|---|
| Players still collide with something invisible. | Set `CanCollide = false` as well if a hidden part should be passable. [Hidden is still there](#hidden-is-still-there) |
| Hiding a model leaves some parts visible. | Group with models, not folders. [Only VisualInstance parents pass it on](#only-visualinstance-parents-pass-it-on), [IgnoreParent](#ignoreparent) |
