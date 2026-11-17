---
title: Welds and joints
description: Join parts into one rigid body
---

# Welds and joints

A joint tells physics that two parts belong together. In play, every unanchored part is its own loose object, so a crate built from six loose boards falls apart.

## Kinds of joint

| Joint | What it does |
|---|---|
| [`Weld`](api:Weld) | Makes two parts one rigid body, exactly as they are placed. It is the right joint nine times out of ten. |
| [`WeldConstraint`](api:WeldConstraint) | Holds one part at a fixed offset from another while keeping them separate bodies. |
| [`Motor`](api:Motor) | Spins one part against another around an axle, for wheels, fans and propellers. |

## Welding two parts

[`MakeJoint`](api:PhysicsInstance.MakeJoint) welds a part to the part passed to it, where the two are now. Place first, weld second: a weld does not move parts together, it freezes their arrangement, gap or overlap included.

`MakeJoint` needs both parts inside [`world`](api:global/world) already, or it stops your function with an error. The most common welding mistake is calling `MakeJoint` before setting [`Parent`](api:Instance.Parent), when the parts are not yet inside `world`.

## Example: Parent first, then weld

This server script creates two parts, puts both in `world`, and only then welds them.

```truscript
local a = new Part() { Name = "A", Position = new Vector3(0, 5, 0) }
local b = new Part() { Name = "B", Position = new Vector3(0, 6, 0) }

# Wrong: neither part is in world yet. This line would raise an error.
# a.MakeJoint(b)

# Right: parent first, then weld.
a.Parent = world
b.Parent = world
a.MakeJoint(b)
```

## Welded groups

Welds chain: when A is welded to B and B to C, the three parts are one rigid body. That is called a welded group. Welded parts move as one body whose mass is the sum of the parts. If any part of a welded group is anchored, the whole group holds still.

Anchor one part of a welded group, not several. Set [`Massless`](api:PhysicsInstance.Massless) to true on welded decoration that should not count, and it adds no weight and no resistance to turning.

## Welding a whole model

| Method | What it does |
|---|---|
| [`model.MakeJoints()`](api:Model.MakeJoints) | Welds each part in the model to every part it touches or overlaps. |
| [`model.MakeJointsToPrimaryBody()`](api:Model.MakeJointsToPrimaryBody) | Welds every part in the model straight to the model's [`PrimaryBody`](api:Model.PrimaryBody), touching or not. |

## Choosing between them

[`MakeJoints`](api:Model.MakeJoints) also welds to things outside the model, such as the floor it stands on; an anchored floor then holds the whole model still. [`MakeJointsToPrimaryBody`](api:Model.MakeJointsToPrimaryBody) is the right choice for vehicles, tools, props and anything self-contained.

## Removing welds

[`RemoveJoint`](api:PhysicsInstance.RemoveJoint) removes every weld directly between a part and the part passed to it. Welds never break by themselves, however hard something hits them. For things that should break under load, remove the welds from a script, or use an [`Explosion`](api:Explosion).

## Parts that turn

A wheel welded to a car cannot spin, and a door welded to its frame cannot swing. Leave a part that should turn or slide against something else unwelded, and join it with the right joint. [Hinges for doors and steering](constraints.md#hingeconstraint) are one.

## Motors

A [`Motor`](api:Motor) needs no attachments: you name two parts and a face, and it works out the axle.

A `Motor`'s [`TargetVelocity`](api:Motor.TargetVelocity) is the spin speed it tries to reach, in radians per second. A positive value turns [`TargetB`](api:Motor.TargetB) clockwise, seen from outside the chosen face of [`TargetA`](api:Motor.TargetA); a negative one turns it the other way.

A `Motor` between two parts of the same welded group does nothing. A `Motor` that seems too weak needs more [`MaxTorque`](api:Motor.MaxTorque), not more `TargetVelocity`.

## Example: A ceiling fan

This server script builds a ceiling fan: an anchored hub with a blade that spins around the hub's vertical axis.

```truscript
local hub = new Part() {
    Name = "FanHub",
    Size = new Vector3(2, 2, 2),
    Position = new Vector3(0, 10, 0),
    Anchored = true,
    Parent = world
}
local blade = new Part() {
    Name = "Blade",
    Size = new Vector3(8, 0.2, 1),
    Position = new Vector3(0, 11.2, 0),
    Parent = world
}
local motor = new Motor() {
    Name = "FanMotor",
    TargetA = hub,
    TargetB = blade,
    Face = PartSide.Top,
    TargetVelocity = 6,
    MaxTorque = 2000,
    Parent = hub
}
```

## WeldConstraint (Glue)

In TruWorlds Creator, a [`WeldConstraint`](api:WeldConstraint) is listed as Glue, and a new one is named `Glue`. Choose a [`Weld`](api:Weld) over a `WeldConstraint` unless you have a specific reason not to.

With a `WeldConstraint`'s default offsets, [`OffsetBPosition`](api:Constraint.OffsetBPosition) minus [`OffsetAPosition`](api:Constraint.OffsetAPosition) is zero, so [`TargetB`](api:Constraint.TargetB) is pulled onto the center of [`TargetA`](api:Constraint.TargetA). Always set an offset on a `WeldConstraint`.

## Troubleshooting

| What you see | Fix |
|---|---|
| A welded object will not fall. | See [Welded groups](welds-and-joints.md#welded-groups) and [Choosing between them](welds-and-joints.md#choosing-between-them). |
| Parts snapped together into one spot. | Choose a [`Weld`](api:Weld), and always set an offset on a [`WeldConstraint`](api:WeldConstraint). See [WeldConstraint (Glue)](welds-and-joints.md#weldconstraint-glue). |
