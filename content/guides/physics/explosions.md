---
title: Explosions
description: Create a blast that pushes and breaks things
---

# Explosions

An [`Explosion`](api:Explosion) is a one-off blast that throws loose parts outward.

## Example: Your first explosion

This server script stacks five crates, then sets off a blast beside the stack's foot three seconds later.

```truscript
for i in range(5):
    new Part() {
        Name = "Crate" + i,
        Size = new Vector3(3, 3, 3),
        Position = new Vector3(0, 1.6 + i * 3.1, -12),
        Material = PartMaterial.Wood,
        Parent = world
    }

wait(3)

new Explosion() {
    Position = new Vector3(2, 1, -11),
    BlastRadius = 15,
    BlastPressure = 80,
    Parent = world
}
```

Create the [`Explosion`](api:Explosion), set where it is and how big it is, then set [`Parent`](api:Instance.Parent). Setting an explosion's `Parent` sets it off: once inside [`world`](api:global/world) it detonates by itself. There is no explode method.

> [!WARNING]
> Always set [`BlastRadius`](api:Explosion.BlastRadius) and [`BlastPressure`](api:Explosion.BlastPressure). Their defaults flatten most of a small map; a hand grenade is closer to a radius of 12.

| Property | Meaning |
|---|---|
| [`BlastRadius`](api:Explosion.BlastRadius) | The explosion's reach in studs, used for the push, for [`Hit`](api:Explosion.Hit) and (scaled) for breaking joints. |
| [`BlastPressure`](api:Explosion.BlastPressure) | The speed, in studs per second, it gives a loose part at its very center. |

## Where to create it

Create explosions in server scripts. Parent an explosion to [`world`](api:global/world) or to a [`Folder`](api:Folder) in it, and set its [`Position`](api:DynamicInstance.Position) to the world point of the blast. Do not parent an explosion to a part.

An [`Explosion`](api:Explosion) saved in the world (inserted in TruWorlds Creator and left in the tree) goes off as soon as the world starts. Create explosions from scripts instead of saving them in the world.

## Breakable buildings

An [`Explosion`](api:Explosion) destroys [welds](welds-and-joints.md) near its center. An explosion never unanchors anything.

To make a building that can be blown up, weld unanchored parts together (for example with [`Model.MakeJoints()`](api:Model.MakeJoints)) and anchor only its foundation.

## What a blast reports

An [`Explosion`](api:Explosion)'s [`Hit`](api:Explosion.Hit) signal reports the parts caught in it. `Hit` fires once for every part whose center is within [`BlastRadius`](api:Explosion.BlastRadius), including anchored parts, non-solid parts and characters' bodies.

`Hit` checks distance only: a character behind a wall is still hit. `Hit` fires only if something is connected to it when the blast goes off. Connect `Hit` before you set the explosion's [`Parent`](api:Instance.Parent).

## Damaging characters

An [`Explosion`](api:Explosion) pushes parts but does not hurt characters by itself. Damage is your decision, made in a [`Hit`](api:Explosion.Hit) handler. To hurt a character, call its [`Damage`](api:CharacterController.Damage).

Characters built from several parts fire `Hit` once per part. In a `Hit` handler, guard against hitting the same character twice.

## Example: A blast that deals damage

This server script defines `explode_at(center)`, which makes a blast that deals up to 80 damage, less with distance.

```truscript
func explode_at(center):
    local RADIUS = 16
    local MAX_DAMAGE = 80
    local hurt = {}

    func on_hit(part):
        local character = part.Parent
        if character == nil or not character.IsA("CharacterController"):
            return
        if table.has(hurt, character):
            return                              # each character once
        hurt[character] = true
        local distance = (part.Position - center).Length()
        local falloff = math.clamp(1 - distance / RADIUS, 0, 1)
        character.Damage(math.round(MAX_DAMAGE * falloff))

    local boom = new Explosion() {
        Position = center,
        BlastRadius = RADIUS,
        BlastPressure = 60
    }
    boom.Hit.Connect(on_hit)
    boom.Parent = world

explode_at(new Vector3(0, 3, 0))
```

## Troubleshooting

| What you see | Fix |
|---|---|
| Players are not hurt by a blast. | Call the character's [`Damage`](api:CharacterController.Damage). See [Damaging characters](explosions.md#damaging-characters). |
