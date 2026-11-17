---
title: Animation
description: How clips, the Animator and skeletons make characters and meshes move
---

# Animation

Animation in TruWorlds moves the skeleton inside a body: a set of connected bones that the visible surface is attached to. A rig is a skeleton plus the mesh it deforms. The built-in [`Avatar`](api:Avatar) has one, and so does any mesh imported with bones (a skinned mesh). Moving a whole object smoothly from one place to another is not skeleton animation: that is a [tween](tweens.md).

## Rigs

- The [`Avatar`](animating-avatars.md) is already rigged: it has a skeleton of 25 bones, an [`Animator`](api:Animator), and a set of built-in animations that play by themselves as the character moves.
- A [skinned mesh](animating-meshparts.md) is a mesh built with a skeleton inside: its surface is attached to bones, and it bends when they move.
- Every rig in the world has an [`Armature`](armatures-and-bones.md) in the tree, and under it one [`Bone`](api:Bone) for each joint, nested the way the skeleton is nested.

## Clips and the Animator

A [clip](animation-clips.md) is a recording of bones moving over time, such as a wave or a walk cycle. It lives in an uploaded file and is named by a clip id, a string. An [`Animator`](animator.md) plays clips on an [`Armature`](api:Armature). You ask it for a track, and you play the track. [Several tracks](layers-and-timing.md) can play on one [`Animator`](api:Animator) at once.

## Blending and state machines

An [`AnimationBlend1D`](state-machines-and-blending.md) mixes several looping clips according to one number. Walk and run mixed by speed is the classic case. An [`AnimationStateMachine`](api:AnimationStateMachine) holds named states and the transitions between them.
