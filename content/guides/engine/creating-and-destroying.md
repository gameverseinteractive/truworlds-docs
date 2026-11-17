---
title: Creating and destroying
description: Create instances with new and Clone, and remove them with Destroy
---

# Creating and destroying

## Creating an instance

`new ClassName()` creates one instance of a class and gives you that instance. Instance classes take no arguments: `new Part()`, `new Folder()`, `new PointLight()`. Everything is set through properties afterwards.

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, creates a part named Block with an initializer block that sets its size, position and [Anchored](api:PhysicsInstance.Anchored), and places it in [world](api:global/world) last.

```truscript
local block = new Part() {
    Name = "Block",
    Size = new Vector3(4, 4, 4),
    Position = new Vector3(0, 2, 0),
    Anchored = true,
    Parent = world
}
```

`new Part(1)` is an error. Writing `new` with a base class is an error. You cannot define your own class in TruScript.

Straight after `new`, the instance exists only in your script's variable. Its [Parent](api:Instance.Parent) is `nil`. Setting `Parent` is what brings a new instance to life.

Set every other property first and `Parent` last. Setting `Parent` last makes the instance appear fully formed.

For welded models, which are parented before welding, see [Welds and joints](../physics/welds-and-joints.md). For where an instance is active, see [The instance tree](instance-tree.md#where-an-instance-is-active).

## Templates and clones

A new instance parented to `game.Storage` is kept in the game but switched off: not drawn, not simulated, and its scripts do not start. That is good for templates.

`Clone()` gives you a copy of an instance and everything inside it. A clone's [Parent](api:Instance.Parent) is `nil`. A clone is not placed until you set its `Parent`.

To spawn things, build one example in TruWorlds Creator, keep it switched off in `game.Storage`, and clone it when needed.

## Example: A row of coins from a template

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, clones the coin template ten times and places the copies in a row in [world](api:global/world). It expects a [Part](api:Part) named "CoinTemplate" in `game.Storage`.

```truscript
local template = game.Storage.WaitForChild("CoinTemplate")

for i in range(10):
    local coin = template.Clone()
    coin.Name = "Coin" + i
    coin.Position = new Vector3(i * 6, 3, 0)
    coin.Parent = world
```

## Taking an instance out

An instance taken out of the tree by setting [Parent](api:Instance.Parent) to `nil` keeps its properties and children, and you can put it back later.

While an instance has no parent, scripts attached to it and to its descendants have stopped. When an instance that had no parent is parented back into [world](api:global/world), its scripts start again from their first line, with fresh variables.

## Destroying

`Destroy()` removes an instance permanently. Setting [Parent](api:Instance.Parent) on a destroyed instance is an error.

Reading a property of a destroyed instance through a variable you kept still works: `coin.Name` gives the name it had. Because a variable can outlive the instance, check before using something that another script may have destroyed. [IsInDataModel](api:Instance.IsInDataModel) is `false` for a destroyed instance.

When an instance you want to reuse was destroyed earlier, perhaps by another script, clone a fresh one.

## Destroying after a delay

`DestroyAfter(seconds)` schedules a `Destroy()` and returns at once, without pausing the script.

Calling [DestroyAfter](api:Instance.DestroyAfter) a second time on the same instance is an error. The delay cannot be changed or canceled once set. When two pieces of code both schedule the same instance with `DestroyAfter`, call it once, where the instance is created.

## Example: A cannon

This server script, attached to a [Part](api:Part) that acts as a cannon, fires a ball every 2 seconds. Each ball cleans itself up after 6 seconds.

```truscript
while true:
    local ball = new Part() {
        Name = "Cannonball",
        Shape = PartShape.Ball,
        Size = new Vector3(2, 2, 2),
        Position = this.Position + this.CMatrix.Forward * 4,
        Parent = world
    }
    ball.LinearVelocity = this.CMatrix.Forward * 120
    ball.DestroyAfter(6)
    wait(2)
```

## Scripts on a destroyed instance

When a script's own instance is destroyed, handlers the script connected never run again, including its own handler on `this.Destroyed`. A script cannot observe its own instance's destruction.

Do the important work before destroying, and put clean-up that must happen after the instance is gone in a script attached to something that survives. When a script stops, every connection it made is removed automatically.

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says the [Parent](api:Instance.Parent) property of Coin is locked: `Cannot change locked property 'Parent' of Instance 'Coin'.` | Check before using something that another script may have destroyed, or clone a fresh one. [Destroying](#destroying) |
| An error says [DestroyAfter](api:Instance.DestroyAfter) has already been called on an instance: `DestroyAfter has already been called on Instance '<name>'. Multiple calls to DestroyAfter are not supported.` | Call `DestroyAfter` once, where the instance is created. [Destroying after a delay](#destroying-after-a-delay) |
