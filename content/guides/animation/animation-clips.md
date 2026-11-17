---
title: Animation clips
description: What a clip is, clip ids, the built-in clips, and making your own
---

# Animation clips

A clip is a recording of bones moving over time, such as a wave or a walk cycle. It lives in an uploaded file and is named by a clip id, a string. A clip holds only bone movement, no picture of a character, so it needs a skeleton to play on.

## Clip ids

A clip id is an [asset id](../building/meshes.md), optionally followed by `#` and the name of one animation inside that asset. Without `#Name`, the first animation in the asset plays.

| Clip id | What it names |
|---|---|
| `asset://123456#Wave` | The animation named `Wave` inside asset 123456. The name must match exactly, including capital letters. |
| `123456` | The same as `asset://123456`. The `asset://` part is assumed when it is missing. |
| `local://avatar/avatar.glb#Idle` | A clip built into TruWorlds. |

## When a clip id is wrong

With a `#Name` that the asset does not contain, nothing plays and the console lists the names that do exist. A clip id that cannot be fetched (a mistyped number, a removed asset) is not a script error: the console shows a message and the track plays nothing.

When an animation plays in the import preview but not in the world, check the console for a message from the [`Animator`](api:Animator).

## The built-in clips

TruWorlds includes ten clips made for the standard avatar. They need no upload and work in every world. The first seven (Idle, Walk, Run, Jump, Fall, Climb and Sit) are what a character [plays by itself](animating-avatars.md) while it moves.

## Which rigs a clip plays on

A clip moves bones by name. A [humanoid](animating-meshparts.md#what-makes-a-rig-humanoid) rig is one whose bones TruWorlds recognized as hips, spine, head, arms and legs.

| Clip made on | Plays on |
|---|---|
| A humanoid skeleton | Any humanoid rig, the avatar included. If the skeletons differ in proportions or bone names, the movement is retargeted, bone role by bone role. |
| Any skeleton | Directly, bone for bone, on a rig with the same bone names. |
| A non-humanoid skeleton | Nothing on a rig with different bone names, and the console shows a message. |

## Making your own clips

Animations are made in a 3D modeling program and [exported to a file](../creator/asset-library.md). Keep the skeleton the same in every file that belongs to one character: same bone names, same rest pose.

## Troubleshooting

| What you see | Fix |
|---|---|
| Your animation plays in the import preview but not in the world. | Check the console for a message from the [`Animator`](api:Animator): [When a clip id is wrong](#when-a-clip-id-is-wrong), [Which rigs a clip plays on](#which-rigs-a-clip-plays-on). |
