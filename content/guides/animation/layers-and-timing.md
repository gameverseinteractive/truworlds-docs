---
title: Layers and timing
description: Stack tracks in layers, limit them to some bones, and control their timing
---

# Layers and timing

Several [tracks](animator.md) can play on one [`Animator`](api:Animator) at once. Every frame the `Animator` builds one pose out of all the tracks that are playing or still fading.

## Layers

A track's [`Priority`](api:AnimationTrack.Priority) is its layer. A higher layer covers lower layers only on the bones its clip moves: a wave on [`AnimationPriority.Action`](api:AnimationPriority) covers the walk on `AnimationPriority.Movement` on the arm it moves, and the legs keep walking.

| Layer | Number and use |
|---|---|
| [`AnimationPriority.Idle`](api:AnimationPriority) | 1, typically for standing still. |
| [`AnimationPriority.Movement`](api:AnimationPriority) | 2, typically for walking and running. The built-in movement animations and state machine clip states use it. |
| [`AnimationPriority.Action`](api:AnimationPriority) | 3, the default for a new track, typically for emotes, attacks and tool use. |
| [`AnimationPriority.Action2`](api:AnimationPriority) | 4, above `Action`. |

## Weight

A track's [`Weight`](api:AnimationTrack.Weight) is how strongly it counts. Tracks on the same layer are mixed by weight. Two tracks on one layer at weights 0.5 and 0.5 give the half-way pose; at 1 and 1 they do too, because the weights are scaled down to add up to 1.

Weights on a layer that add up to 1 or more cover what is below completely; below 1, what is below shows through for the remainder.

## The Movement layer on a character

On a character, the built-in movement animations keep playing on the Movement layer underneath your tracks until [`AutoAnimate`](animating-avatars.md#turning-the-built-in-animations-off) is turned off. When your track mixes with walking in a strange way, raise the track's `Priority`, mask it, or turn `AutoAnimate` off.

## Bone masks

A mask limits a track to some of the bones. There are two ways to set one: named groups with [`Mask`](api:AnimationTrack.Mask), and exact bone names with [`SetMaskBones`](api:AnimationTrack.SetMaskBones). Named mask groups other than `All` need a [humanoid rig](animation-clips.md#which-rigs-a-clip-plays-on). A mask of exact bone names works on any rig.

| Mask | Bones |
|---|---|
| [`BoneMask.All`](api:BoneMask) | Every bone. It is the default. |
| [`BoneMask.UpperBody`](api:BoneMask) | The spine, chest, neck, head and both arms. |
| [`BoneMask.LowerBody`](api:BoneMask) | The hips and both legs, down to the toes. |
| [`BoneMask.LeftArm`](api:BoneMask) | The left shoulder, upper arm, lower arm and hand. |
| [`BoneMask.RightArm`](api:BoneMask) | The right shoulder, upper arm, lower arm and hand. |
| [`BoneMask.Head`](api:BoneMask) | The neck and head. |

## Keeping two tracks in step

Two looping clips of different lengths drift apart, so mixing them looks wrong: a 1-second walk and a 0.54-second run put the left foot down at different moments.

`follower.SyncTo(leader)` locks the follower's [`NormalizedTime`](api:AnimationTrack.NormalizedTime) to the leader's every frame, so both are always the same fraction of the way through their own clip. A follower never reaches its own end, so [`HoldOnEnd`](api:AnimationTrack.HoldOnEnd) and [`Ended`](api:AnimationTrack.Ended) do nothing on it.

## Markers

A marker is a named moment inside a clip. When playback passes it, [`MarkerReached`](api:AnimationTrack.MarkerReached) fires with the name. Markers are stored in the animation file, or added by a script with `AddMarker(name, time)`, where `time` is in seconds from the start of the clip.

To act on a marker on the server (to deal damage, say), play the animation where it is owned and send a [remote event](../networking/remote-communication.md), and validate it there.

## Troubleshooting

| What you see | Fix |
|---|---|
| The animation mixes with walking in a strange way. | Raise the track's `Priority`, mask it, or turn `AutoAnimate` off: [The Movement layer on a character](#the-movement-layer-on-a-character). |
