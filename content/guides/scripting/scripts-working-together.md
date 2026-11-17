---
title: Scripts working together
description: Combine small scripts, and pass state and messages between them
---

# Scripts working together

Each [script component](script-components.md) on an instance is a separate, independent running script, with [this](api:global/this) set to the same instance. Each has its own variables, invisible to the others, even a global one: in TruScript, global means global to that one running script. The scripts on one instance share the instance: if one script changes `this.Color`, the others see the new color.

## Small scripts that combine

Give each property one owner: each script should own the properties it changes.

> [!WARNING]
> Do not rely on the order in which the scripts on one instance start, or react to the same signal. If script B needs something script A sets up, make B wait for it (for example with [WaitForChild](api:Instance.WaitForChild)) or put both steps in one script.

When script B reads something script A has not created yet, use `WaitForChild`, or connect to a signal and act when it fires.

## Ways scripts talk

| Way | Good for |
|---|---|
| The instance tree (properties and value objects) | State that others read or watch: "is the door open", "how many coins". |
| A [LocalEvent](api:LocalEvent) | Announcements: "the round started", "this coin was collected". It can have any number of listeners. |
| A [LocalFunction](api:LocalFunction) | Questions with an answer: "what does this item cost?". Exactly one script answers. |
| A module script | Shared code and shared state for every script that imports it. |
| [RemoteEvent](api:RemoteEvent) and [RemoteFunction](api:RemoteFunction) | Messages between the server and players' devices. To send a message across, use a [RemoteEvent](api:RemoteEvent) or a [RemoteFunction](api:RemoteFunction). |

## Settings in value objects

The simplest place for a setting is a value object child, such as a [NumberValue](api:NumberValue), [StringValue](api:StringValue) or [BoolValue](api:BoolValue), that you add in the Explorer and edit in the Properties panel. See [Value objects](../engine/value-objects.md).

This server script, attached to any part, uses the `Value` of a `NumberValue` child named "SpinSpeed" as the speed in degrees per second, if the part has one.

```truscript
local setting = this.FindFirstChild("SpinSpeed")
local speed = 90
if setting != nil:
    speed = setting.Value

while true:
    local dt = wait(0.03)
    this.Rotation = this.Rotation + new Vector3(0, speed * dt, 0)
```

## LocalEvent

A [LocalEvent](api:LocalEvent) is an instance that scripts on the same side use to send each other messages. One script calls [Fire](api:LocalEvent.Fire) on a `LocalEvent`; every function connected with [Connect](api:EventInstance.Connect) receives the values.

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, creates the event and fires it when each round starts.

```truscript
local round_started = new LocalEvent() {
    Name = "RoundStarted",
    Parent = game.ScriptSystem
}

local round = 0
while true:
    wait(5)
    round = round + 1
    round_started.Fire(round, "Arena")
```

This server script, attached to any instance in `world`, waits for the `RoundStarted` event that the previous script makes in `game.ScriptSystem`, and prints the round number and map name each time it is fired.

```truscript
local round_started = game.ScriptSystem.WaitForChild("RoundStarted")

round_started.Connect(func(number, map_name):
    print("Round " + number + " begins on " + map_name)
)
# Output every five seconds:
# Round 1 begins on Arena
# Round 2 begins on Arena
```

It prints `Round 1 begins on Arena`, then `Round 2 begins on Arena`.

`LocalEvent` handlers are queued, [like signal handlers](signals-and-events.md#when-handlers-run): [Fire](api:Fire) returns at once, and handlers start the next time scripts run.

If nobody is connected to a `LocalEvent`, `Fire` does nothing. A message fired before a listener connected is not kept for it.

## LocalFunction

A [LocalFunction](api:LocalFunction) is for a question that needs an answer. One script sets the function that answers a `LocalFunction` with [Bind](api:FunctionInstance.Bind). Any other script on the same side calls [InvokeAsync](api:LocalFunction.InvokeAsync), which pauses the caller until the answer comes back.

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem` that has a `LocalFunction` child named "GetPrice", binds a function that answers with the price of an item, or 0 for an unknown item.

```truscript
local prices = { sword = 50, shield = 30 }

func get_price(item):
    return prices[item] or 0

this.WaitForChild("GetPrice").Bind(get_price)
```

`InvokeAsync` raises an error, which you can catch with `try`, when nothing is bound to the `LocalFunction` yet.

> [!WARNING]
> Because the order in which scripts start is not guaranteed, a caller can run before the other script has called `Bind`. Wrap the call in `try` and retry after a short `wait`, or make the call from a signal handler that runs later, not from the top level of the script.

## Troubleshooting

| What you see | Fix |
|---|---|
| Script B reads something script A has not created yet. | Use `WaitForChild`, or connect to a signal and act when it fires; see [Small scripts that combine](#small-scripts-that-combine). |
| An error says no function is bound to a LocalFunction: `LocalFunction '<name>' Invoke: no function bound` | See [LocalFunction](#localfunction). |
