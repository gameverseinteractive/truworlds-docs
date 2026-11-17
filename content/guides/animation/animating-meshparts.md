---
title: Animating MeshParts
description: Import a mesh with a skeleton, give it an Animator, and animate it
---

# Animating MeshParts

A skinned mesh is a mesh built with a skeleton inside: its surface is attached to bones, and it bends when they move. The [import window](../creator/asset-library.md) imports a [mesh](../building/meshes.md) with a skeleton as a Character, and any animations in the file as Animations.

## Adding the Animator

Add an [`Animator`](api:Animator) under the [`MeshPart`](api:MeshPart) or under the [`Model`](api:Model).

This server script, attached to a skinned `MeshPart` or to a `Model` that contains one, adds an `Animator` to it.

```truscript
local animator = new Animator() { Parent = this }
```

An `Animator` whose parent is a `Model` or [`Folder`](api:Folder) plays on the first skinned `MeshPart` found inside it, searching children in order and going into each child before the next. The search skips an [`Avatar`](api:Avatar), and anything with an `Animator` of its own.

If a `Model` holds several skinned `MeshPart`s and one `Animator`, only the first one found is animated. To animate each mesh, give each `MeshPart` its own `Animator`; see [where an Animator lives](animator.md#where-an-animator-lives).

## Playing a clip

You do not have to wait for the mesh to load before calling [`LoadClip`](api:Animator.LoadClip) and [`Play`](api:AnimationTrack.Play). Nothing plays by default. Unlike a character with an [`Avatar`](api:Avatar) body, a skinned [`MeshPart`](api:MeshPart) has no built-in movement animations.

## Example: An animated creature

This server script, attached to a folder in `game.ScriptSystem`, builds an animated creature from two asset ids and makes it play its idle animation.

```truscript
local CHARACTER = "asset://111111"      # replace with the id of your Character asset
local IDLE = "asset://222222"           # replace with the id of one of its animations

local model = new Model() { Name = "Creature" }
local mesh = new MeshPart() {
    Name = "Body",
    MeshId = CHARACTER,
    Anchored = true,
    Position = new Vector3(0, 0, -20),
    Parent = model
}
local animator = new Animator() { Parent = model }
model.Parent = world

local idle = animator.LoadClip(IDLE)
idle.Looped = true
idle.Play()
```

## Humanoid and generic rigs

When a rig loads, TruWorlds tries to recognize it as a [human body](animation-clips.md#which-rigs-a-clip-plays-on) by looking at the names and arrangement of its bones. The result is [`Armature.RigType`](api:Armature.RigType).

| RigType | Means |
|---|---|
| `None` | No rig has loaded yet, or the mesh has no skeleton. |
| `Humanoid` | The bones were matched to a human body. |
| `Generic` | A rig is loaded, but it could not be matched to a human body. |

## What makes a rig humanoid

Bones are matched to roles by name. The match ignores capital letters, spaces and punctuation. If your character should be humanoid but is reported as generic, the console tells you why when the rig loads, and lists the bones it could not match. Rename the bones listed as unmatched to ordinary names and import again.

| Body part | Roles a humanoid rig needs |
|---|---|
| Body | Bones for the roles `Hips`, `Spine`, `Chest` and `Head`. |
| Each arm, left and right | Bones for the roles `Shoulder`, `UpperArm`, `LowerArm` and `Hand`. |
| Each leg, left and right | Bones for the roles `UpperLeg`, `LowerLeg` and `Foot`. |

## The MeshPart itself does not move

The [`MeshPart`](api:MeshPart) itself does not move: a clip moves bones, the bones move the surface, and `Position` and `Rotation` stay as they were. A walk clip moves the legs but does not carry the character across the floor. Move the `MeshPart` (or its [`Model`](api:Model)) yourself, with a [tween](tweens.md), a script, or physics.

The solid shape of a `MeshPart`, the shape other things bump into, comes from the mesh as it was uploaded and does not follow the animation. A creature that raises its arm does not push things with the arm. For hits and touches on a moving limb, read the [bone's position](armatures-and-bones.md) instead.

## Which side plays the animation

If a player owns the [`MeshPart`](api:MeshPart)'s physics (a server script called `SetNetworkOwner(player)` on it), that player's device owns its [`Animator`](api:Animator), and a client script there is the one whose calls [everyone sees](animator.md#which-side-plays-the-animation).

A client script may always play animations on a mesh for itself only. That is useful for things only one player should see, such as a preview in a shop.

## Troubleshooting

| What you see | Fix |
|---|---|
| The mesh shows but never moves. | Add an [`Animator`](api:Animator) under the [`MeshPart`](api:MeshPart) or under the [`Model`](api:Model): [Where an Animator lives](animator.md#where-an-animator-lives), [Adding the Animator](#adding-the-animator), [Playing a clip](#playing-a-clip). |
| Only one of the meshes in your model animates. | Give each [`MeshPart`](api:MeshPart) its own [`Animator`](api:Animator): [Adding the Animator](#adding-the-animator). |
| The character is animated but stays in one place. | Move the [`MeshPart`](api:MeshPart) (or its [`Model`](api:Model)) yourself, with a tween, a script, or physics: [The MeshPart itself does not move](#the-meshpart-itself-does-not-move). |
