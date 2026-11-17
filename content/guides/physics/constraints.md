---
title: Constraints
description: Build hinges, sliders and other mechanisms from attachments
---

# Constraints

Like a [`Weld`](welds-and-joints.md), a constraint joins two parts, but it leaves them free to move in one particular way.

## The three constraints

TruWorlds has three working constraints.

| Constraint | Lets the parts | Use it for |
|---|---|---|
| [`HingeConstraint`](api:HingeConstraint) | Turn around one axis. | Doors, wheels, flaps, fans, turrets, steering and swings. |
| [`PrismaticConstraint`](api:PrismaticConstraint) | Slide along one line, without turning. | Sliding doors, drawers, lifts, pistons and suspension travel. |
| [`SpringConstraint`](api:SpringConstraint) | Bounce toward a set distance apart. | Suspension, trampolines, hanging lamps and wobbly props. |

## Attachments

An [`Attachment`](api:Attachment) is a point with a direction, fixed to a part. It exists only to say "the joint acts here, pointing this way". All three working constraints connect two attachments.

Every attachment constraint joins a mount (often anchored, or welded to something bigger) to an unanchored moving part. Each part holds one attachment, marking where and in which direction the joint acts on it. The constraint names the mount's attachment as [`Attachment0`](api:TwoAttachmentConstraint.Attachment0) and the moving part's as [`Attachment1`](api:TwoAttachmentConstraint.Attachment1).

An attachment must be a direct child of a part. Under a [`Model`](api:Model), a [`Folder`](api:Folder), or another [`Attachment`](api:Attachment) it does nothing.

## Aiming an attachment

An attachment's X axis is the important one. With no rotation, an attachment's X axis is the part's own X axis (the part's right). To aim it elsewhere, rotate the attachment.

The Properties panel does not show an attachment's [`CMatrix`](api:Attachment.CMatrix), and the Move, Resize and Rotate tools are grayed out for an attachment. Position attachments from a script.

## HingeConstraint

A [`HingeConstraint`](api:HingeConstraint) keeps its two attachment points together and lets the parts turn only around [`Attachment0`](api:TwoAttachmentConstraint.Attachment0)'s X axis. Put an attachment on each part at the pivot, aim both X axes along the hinge line, and name them in the hinge.

If a hinge's attachment points are apart when the joint starts, the moving part is pulled until they meet.

## Example: A swinging door

This server script builds an anchored frame post and a door that swings on a vertical hinge when pushed.

```truscript
local frame = new Part() {
    Name = "DoorFrame",
    Size = new Vector3(1, 7, 1),
    Position = new Vector3(0, 3.5, 0),
    Anchored = true,
    Parent = world
}
local door = new Part() {
    Name = "Door",
    Size = new Vector3(4, 6.6, 0.3),
    Position = new Vector3(2.6, 3.6, 0),
    Material = PartMaterial.Wood,
    Parent = world
}

# Both X axes point up (rotation 0, 0, 90), so the door turns around a vertical line.
# a0 is 0.6 studs to the right of the frame's center; a1 is on the door's left edge.
# Both are at the same place in the world: x = 0.6.
local a0 = new Attachment() {
    Name = "FrameHinge",
    CMatrix = new CMatrix(new Vector3(0.6, 0.1, 0), new Vector3(0, 0, 90)),
    Parent = frame
}
local a1 = new Attachment() {
    Name = "DoorHinge",
    CMatrix = new CMatrix(new Vector3(-2, 0, 0), new Vector3(0, 0, 90)),
    Parent = door
}

local hinge = new HingeConstraint() {
    Name = "DoorHinge",
    Attachment0 = a0,
    Attachment1 = a1,
    Friction = 5,
    Parent = frame
}
```

## Driving a hinge

A [`HingeConstraint`](api:HingeConstraint)'s [`ActuatorType`](api:HingeConstraint.ActuatorType) is how the hinge is driven: not at all, as a motor, or as a servo.

Mind a `HingeConstraint`'s units: [`TargetAngle`](api:HingeConstraint.TargetAngle) is in degrees; [`AngularVelocity`](api:HingeConstraint.AngularVelocity) and [`AngularSpeed`](api:HingeConstraint.AngularSpeed) are in radians per second.

| ActuatorType | Behavior |
|---|---|
| `None` | The hinge turns freely. Only gravity, collisions and [`Friction`](api:HingeConstraint.Friction) act on it. |
| [Motor](api:Motor) | The hinge spins continuously at [`AngularVelocity`](api:HingeConstraint.AngularVelocity), using up to [`MotorMaxTorque`](api:HingeConstraint.MotorMaxTorque). |
| `Servo` | The hinge turns to [`TargetAngle`](api:HingeConstraint.TargetAngle) at up to [`AngularSpeed`](api:HingeConstraint.AngularSpeed) and holds there, using up to [`ServoMaxTorque`](api:HingeConstraint.ServoMaxTorque). |

## PrismaticConstraint

A [`PrismaticConstraint`](api:PrismaticConstraint) has no motor. Something else moves the part: gravity, a player pushing, a spring or a mover. For a lift, drawer or piston, use a `PrismaticConstraint` with a [mover](forces-and-movers.md).

## SpringConstraint

A [`SpringConstraint`](api:SpringConstraint) pushes or pulls so that the distance between its two attachment points moves toward [`FreeLength`](api:SpringConstraint.FreeLength).

## When a constraint does nothing

While the world runs, a constraint does nothing, with no error, when [`Enabled`](api:TwoAttachmentConstraint.Enabled) is false; when it, or an attachment's part, is not inside [`world`](api:global/world); when [`Attachment0`](api:TwoAttachmentConstraint.Attachment0) or [`Attachment1`](api:TwoAttachmentConstraint.Attachment1) is unset or not an [`Attachment`](api:Attachment); when both attachments are in the same part; or when both parts are anchored.

Most often a constraint does nothing because its two parts are welded into one group, as when [`Model.MakeJoints()`](api:Model.MakeJoints) welds a door to the frame it touches.

Give the moving part room: leave a small gap, or turn [`CanCollide`](api:PhysicsInstance.CanCollide) off on one of the two parts.

## Constraints to avoid

> [!WARNING]
> Do not use [`PinConstraint`](api:PinConstraint) or [`ConeConstraint`](api:ConeConstraint). They never connect their two parts, and one in a running world with two parts set as its targets only produces an error.
