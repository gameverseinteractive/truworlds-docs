---
title: Seats and vehicles
description: Seat characters, and build vehicles a player can drive
---

# Seats and vehicles

[`Seat`](api:Seat) and [`VehicleSeat`](api:VehicleSeat) are parts characters can sit on. A `VehicleSeat` also turns the rider's movement keys into driving.

## Sitting and standing

A player's character sits the moment it stands on top of a [`Seat`](api:Seat). To stand up, the player presses jump (Space). An unanchored, unwelded seat is a loose object that falls over.

## Who is sitting

A seat's [`Occupant`](api:Seat.Occupant) is the character sitting on the seat, or `nil` when it is empty. Listening on a seat's [`Changed`](api:TruWorldsObject.Changed) signal for `"Occupant"` is how you react to someone sitting down or standing up.

## Example: An ejector seat

This server script, attached to a [`Seat`](api:Seat), throws out whoever sits down, five seconds after they sit.

```truscript
local busy = false

func on_changed(property):
    if property != "Occupant" or busy:
        return
    if this.Occupant == nil:
        return
    busy = true
    print("Ejecting in 5 seconds")
    wait(5)
    this.Occupant = nil
    busy = false

this.Changed.Connect(on_changed)
```

## VehicleSeat

While someone sits in a [`VehicleSeat`](api:VehicleSeat), it reads the rider's keys into [`Throttle`](api:VehicleSeat.Throttle), [`Steer`](api:VehicleSeat.Steer) and [`Lift`](api:VehicleSeat.Lift), and the rider's camera direction into [`AimYaw`](api:VehicleSeat.AimYaw) and [`AimPitch`](api:VehicleSeat.AimPitch).

A `VehicleSeat` drives [hinges](constraints.md#hingeconstraint): hinges whose [`ActuatorType`](api:HingeConstraint.ActuatorType) is [`Motor`](constraints.md#driving-a-hinge) become drive wheels, and hinges whose `ActuatorType` is [`Servo`](constraints.md#driving-a-hinge) and whose [`Name`](api:Instance.Name) starts with `Steer` become steering.

> [!WARNING]
> [Weld](welds-and-joints.md) the `VehicleSeat` to the vehicle body, or it finds no wheels, and never weld the wheels to the chassis, or they cannot turn. [`Model.MakeJointsToPrimaryBody()`](api:Model.MakeJointsToPrimaryBody) welds the seat and the bodywork and leaves the jointed wheels free.

## Which way is forward

For a [`VehicleSeat`](api:VehicleSeat), forward is the direction the seat faces (its -Z). Turn a `VehicleSeat` to face the front of the vehicle.

## Example: Building a vehicle

Build a vehicle in this order: create a [`Model`](api:Model) in [`world`](api:global/world); create the chassis, bodywork and [`VehicleSeat`](api:VehicleSeat) inside it, all unanchored; set the model's [`PrimaryBody`](api:Model.PrimaryBody) to the chassis and call [`MakeJointsToPrimaryBody()`](welds-and-joints.md#welding-a-whole-model); then create the wheels and their joints. For a wheel, rotate a cylinder part `(0, 0, 90)` so its axle lies across the vehicle (along X).

This server script builds a four-wheeled buggy. W/S drive, A/D turn, Space gets out.

```truscript
local ORIGIN = new Vector3(0, 4, -15)           # center of the chassis when the buggy is created

local buggy = new Model() { Name = "Buggy", Parent = world }

local chassis = new Part() {
    Name = "Chassis",
    Size = new Vector3(3, 0.6, 5),
    Position = ORIGIN,
    Material = PartMaterial.Metal,
    Color = new Color3(0.9, 0.5, 0.1),
    Parent = buggy
}
local seat = new VehicleSeat() {
    Name = "DriverSeat",
    Size = new Vector3(2, 0.6, 2),
    Position = ORIGIN + new Vector3(0, 0.6, 0.5),
    MaxSpeed = 32,
    TurnSensitivity = 0.6,
    Parent = buggy
}

buggy.PrimaryBody = chassis
buggy.MakeJointsToPrimaryBody()

func add_wheel(name, x, z):
    local wheel = new Part() {
        Name = name,
        Shape = PartShape.Cylinder,
        Size = new Vector3(1.6, 0.9, 1.6),
        CMatrix = new CMatrix(ORIGIN + new Vector3(x, -0.95, z), new Vector3(0, 0, 90)),
        Material = PartMaterial.Carpet,
        Color = new Color3(0.1, 0.1, 0.1),
        Parent = buggy
    }
    local mount = new Attachment() {
        CMatrix = new CMatrix(new Vector3(x, -0.95, z)),
        Parent = chassis
    }
    local hub = new Attachment() {
        CMatrix = new CMatrix(new Vector3(0, 0, 0), new Vector3(0, 0, -90)),
        Parent = wheel
    }
    new HingeConstraint() {
        Name = name + "Hinge",
        Attachment0 = mount,
        Attachment1 = hub,
        ActuatorType = HingeActuatorType.Motor,
        MotorMaxTorque = 14000,
        Parent = buggy
    }

add_wheel("WheelFL", -2.1, -1.9)
add_wheel("WheelFR", 2.1, -1.9)
add_wheel("WheelRL", -2.1, 1.9)
add_wheel("WheelRR", 2.1, 1.9)
```

## When the driver leaves

When the rider leaves, a [`VehicleSeat`](api:VehicleSeat) stops giving orders but does not stop the wheels, so a moving cart keeps rolling. After the rider leaves, the wheels keep the last speed they were told to turn at.

Writing `0` to the drive wheels' speed properties does nothing on its own: they already read 0, and writing a property's current value changes nothing. Nudge the drive wheels' speed properties to a tiny speed first, then set 0.

## Example: Stopping the wheels when the driver leaves

This server script, attached to the `VehicleSeat` of a vehicle, stops the drive wheels whenever the driver leaves. It needs the seat, its wheels and their joints to be inside the same [Model](api:Model).

```truscript
local vehicle = this.Parent

func set_wheel_speed(speed):
    for item in vehicle.GetDescendants():
        if item.IsA("HingeConstraint") and item.ActuatorType == HingeActuatorType.Motor:
            item.AngularVelocity = speed
        if item.IsA("Motor"):
            item.TargetVelocity = speed

func on_changed(property):
    if property != "Occupant" or this.Occupant != nil:
        return
    # The speed properties still read 0, and writing the value a property already has changes nothing.
    # So nudge them to a tiny speed first, then set 0.
    set_wheel_speed(0.01)
    wait()
    set_wheel_speed(0)

this.Changed.Connect(on_changed)
```

## Custom vehicles

Reading a [`VehicleSeat`](api:VehicleSeat)'s input values in a server script is all you need to drive anything with [movers](forces-and-movers.md#movers). Scripts can read a `VehicleSeat`'s [`Throttle`](api:VehicleSeat.Throttle), [`Steer`](api:VehicleSeat.Steer), [`Lift`](api:VehicleSeat.Lift), [`AimYaw`](api:VehicleSeat.AimYaw) and [`AimPitch`](api:VehicleSeat.AimPitch) on the server, and can also write them.

## Troubleshooting

| What you see | Fix |
|---|---|
| The vehicle drives backwards when you press W. | Turn the [`VehicleSeat`](api:VehicleSeat) to face the front of the vehicle. See [Which way is forward](seats-and-vehicles.md#which-way-is-forward). |
| The vehicle drives away by itself after the driver gets out. | Nudge the drive wheels' speed properties to a tiny speed first, then set 0. See [When the driver leaves](seats-and-vehicles.md#when-the-driver-leaves). |
