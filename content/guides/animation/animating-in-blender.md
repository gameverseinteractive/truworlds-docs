---
title: Animating in Blender
description: Pose the TruWorlds avatar rig in Blender and export your animations as a GLB
---

# Animating in Blender

Blender is a free 3D modeling program that many creators use to make animations for TruWorlds. Make your own avatar animations on the TruWorlds [avatar rig](animating-avatars.md#making-your-own-avatar-animations), so that they use the avatar's own skeleton and play on the standard avatar.

## Opening the avatar rig

Download `truworlds-avatar.blend` from the TruWorlds Engine Assets repository and open it in Blender. The Blender file needs Blender 5.2.2 LTS or newer; see [Making your own avatar animations](animating-avatars.md#making-your-own-avatar-animations).

In Blender a skeleton is an object called an armature. Each bone of the avatar's armature is a bone of the standard avatar, with the same name. Do not rename, add or remove the armature's bones, and do not change its rest pose. Animate the bones as they are. Keep the skeleton the same in every file that belongs to one character: same bone names, same rest pose; see [Making your own clips](animation-clips.md#making-your-own-clips).

## Posing and keyframes

1. Select the armature and switch to Pose Mode, with the mode menu at the top left of the 3D viewport or with Ctrl+Tab. In Pose Mode you select, move and rotate bones.
2. Pose the bones for one moment of the animation, then, with those bones selected and the pointer over the 3D viewport, press I to insert a keyframe for them on the current frame.
3. Move to a later frame in the Timeline, change the pose, and insert another keyframe. Blender fills in the movement between keyframes.

From each animation, TruWorlds reads the position, rotation and scale changes of bones, with stepped, straight-line or curved movement between keyframes, exactly as stored in the file.

The frame rate is set in Blender's Output Properties, under Format. A keyframe on frame 30 of a 30 frames-per-second animation is one second from the start. Clips play in real time using the keyframe times stored in the file. An animation's length is the time of its last keyframe.

## One action per animation

Blender keeps each animation of an object as an action. Each action becomes one animation in the exported file, under the action's name.

1. To start another animation, open the Dope Sheet and switch it to the Action Editor.
2. Click New, and type the action's name in place of the one Blender suggests.
3. Click the shield button (Fake User) beside each action's name, so Blender keeps the action in the file when the armature is showing a different one.

Give every animation a clear, distinct name when you export it. For a looping animation, make the last frame lead into the first.

Make walk and run clips on the spot (or import them with Stay in place), and make the walk clip so that it looks right at the default walking speed. The playback rate is then adjusted for you as the speed changes.

## Exporting a GLB

1. Select the armature in Object Mode and choose File > Export > glTF 2.0 (.glb/.gltf).
2. In the export settings, set Format to glTF Binary (.glb), so the skeleton and every animation are packed into one file. A plain-text `.gltf` file with separate data files is not accepted.
3. Under Include, tick Selected Objects, so the file holds only the armature and its animations, not the avatar's body. When a file holds animations only, with a skeleton but no mesh, each animation is imported as an Animation.
4. Under Animation, keep animation export switched on, with its mode set to export actions, so every action is written as its own animation.

Compression is not supported. A file that needs Draco or meshopt mesh compression, or Basis texture compression, is refused. Turn compression off in your export settings.

## Importing into TruWorlds Creator

Import Assets... is in both the File menu and the Insert menu. See the [Asset Library](../creator/asset-library.md) for the import window.

The import window lists each animation as Animation, with its length in seconds, indented under its character when it has one. The import preview's Play on: TruWorlds avatar option shows you the result on the avatar before you upload.

In the Review step, turn Loop on for animations that should repeat (idle, walk, run).

Each animation is uploaded as its own asset with its own id, even when several came from one file. That is why a plain `asset://123456` is enough to name one: there is only one animation inside. See [clip ids](animation-clips.md#clip-ids), and how to [replace a movement animation](animating-avatars.md#replacing-a-movement-animation).

## When the animation looks wrong

- When a replacement animation twists the body or does nothing, check the import warnings.
- When a clip plays faster than in your modeling program, check the frame rate you exported with.
- When a character slides forward and snaps back on every loop because the clip contains forward movement, import the clip again with Stay in place turned on.
