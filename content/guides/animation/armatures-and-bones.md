---
title: Armatures and bones
description: The skeleton objects an Animator drives, and reading where each bone is
---

# Armatures and bones

An [`Armature`](api:Armature) is the object that holds a rig's skeleton in the world. Every rig in the world has an `Armature` in the tree, and under it one [`Bone`](api:Bone) for each joint, nested the way the skeleton is nested.

## Bones are read-only

Bones are read-only. A script can read where a bone is, but cannot move, re-parent, create or destroy one. The only thing that moves a bone is an [`Animator`](api:Animator) playing a clip on the [`Armature`](api:Armature).

You never create an `Armature`: TruWorlds makes and keeps them. An `Armature` is never saved with the world and never copied by [`Clone`](api:Instance.Clone).

## Where the Armature is

Read the [`Armature`](api:Armature) with `avatar.Armature` or `character.Armature`.

| Rig | Its Armature |
|---|---|
| An [`Avatar`](api:Avatar) that has an [`Animator`](api:Animator) (every character with an [`Avatar`](api:Avatar) body does) | One [`Armature`](api:Armature), a child of the [`Avatar`](api:Avatar), named [Armature](api:Armature). |
| A skinned [`MeshPart`](api:MeshPart) that is inside [`world`](api:global/world) | One [`Armature`](api:Armature), a child of the [`MeshPart`](api:MeshPart), named [Armature](api:Armature). |
| A [`MeshPart`](api:MeshPart) whose mesh has no skeleton, or a [`MeshPart`](api:MeshPart) that has never been inside [`world`](api:global/world) | None. |

## Waiting for the skeleton

On a [`MeshPart`](api:MeshPart) the [`Armature`](api:Armature) appears a moment after the part enters `world`, not on the same line. To get a `MeshPart`'s `Armature`, use `WaitForChild("Armature", 10)`. Until the rig has arrived, the `Armature` exists but is empty.

An `Armature`'s [`Loaded`](api:Armature.Loaded) signal fires when the rig has loaded and the [`Bone`](api:Bone) children exist. Check [`IsLoaded`](api:Armature.IsLoaded) first, before waiting for `Loaded`.

This script, attached to a skinned `MeshPart`, gets its `Armature` and, if its rig has not loaded yet, waits for `Loaded`. The last two lines work in any script that has an `Armature` in `armature`.

```truscript
local armature = this.WaitForChild("Armature", 10)
if armature != nil and not armature.IsLoaded:
    armature.Loaded.Wait()
```

An avatar's rig is usually loaded before your script gets to look, and `Loaded.Wait()` after the fact would wait for a second load that may never come.

| Before the rig has loaded | After |
|---|---|
| [`IsLoaded`](api:Armature.IsLoaded) is `false`. | `IsLoaded` is `true`. |
| [`GetBone`](api:Armature.GetBone) finds nothing. | `GetBone` finds the [`Bone`](api:Bone), or nothing if there is no such bone. |
| [`GetBoneCMatrix`](api:Armature.GetBoneCMatrix) gives an identity [`CMatrix`](api:CMatrix) (position 0, 0, 0, no rotation). | `GetBoneCMatrix` gives the bone's place in the world. |

## Reading a bone

To read where a bone is, rather than attach to it, use the avatar's [`Armature`](api:Armature). A rig's own bone names are case-sensitive: `GetBone("head")` finds nothing on a rig whose bone is called `Head`. When [`GetBone`](api:Armature.GetBone) finds no bone because the name is wrong, print [`GetBoneNames()`](api:Armature.GetBoneNames) to see what the rig calls its bones.

[`bone.CMatrix`](api:Bone.CMatrix) includes the [`MeshPart`](api:MeshPart)'s or [`Avatar`](api:Avatar)'s own position and rotation, and a `MeshPart`'s [`MeshScale`](api:MeshPart.MeshScale). Moving the part moves the bones with it; see [`CMatrix`](../engine/cmatrix.md).

| What differs | [`GetBone`](api:Armature.GetBone) and [`GetBoneCMatrix`](api:Armature.GetBoneCMatrix) |
|---|---|
| What you get | [`GetBone`](api:Armature.GetBone) gives the [`Bone`](api:Bone) object: keep it and read it as often as you like. [`GetBoneCMatrix`](api:Armature.GetBoneCMatrix) gives a [`CMatrix`](api:CMatrix): a snapshot of where the bone is now. |
| An unknown name | [`GetBone`](api:Armature.GetBone) finds nothing, silently. [`GetBoneCMatrix`](api:Armature.GetBoneCMatrix) warns in the console and gives the [`CMatrix`](api:CMatrix) of the mesh or avatar itself. |

## Standard humanoid names

On a humanoid rig you can also use the [standard names](animating-meshparts.md#what-makes-a-rig-humanoid), whatever the rig's own names are. On a generic rig the standard names find nothing: `GetBone("LeftHand")` and `GetHumanoidBone("LeftHand")` both find nothing.

## Troubleshooting

| What you see | Fix |
|---|---|
| `GetBone` returns `nil`. | Check `IsLoaded` first, before waiting for `Loaded`; print `GetBoneNames()` to see what the rig calls its bones: [Waiting for the skeleton](#waiting-for-the-skeleton), [Reading a bone](#reading-a-bone), [Standard humanoid names](#standard-humanoid-names). |
| `GetBoneCMatrix` gives position 0, 0, 0. | Check `IsLoaded` first, before waiting for `Loaded`: [Waiting for the skeleton](#waiting-for-the-skeleton). |
| `armature.Loaded.Wait()` never returns. | Check `IsLoaded` first, before waiting for `Loaded`: [Waiting for the skeleton](#waiting-for-the-skeleton). |
