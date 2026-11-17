---
title: Remote communication
description: Send messages between the server and devices, or ask the server and wait
---

# Remote communication

A [RemoteEvent](api:RemoteEvent) is an instance that carries messages between the server and players' devices. A `RemoteEvent` message is fire and forget: the sender does not wait and gets no answer. When you need an answer, use a [RemoteFunction](api:RemoteFunction), or send a second message back. A `RemoteFunction` lets a client script ask the server a question and wait for the answer.

## How they differ

| | RemoteEvent | RemoteFunction |
|---|---|---|
| What it does | Sends a message, and nothing comes back. | Asks a question and gets an answer. |
| Direction | From a device to the server, from the server to one device, or from the server to all devices. | From a device to the server only. |
| Who receives it | Any number of handlers, added with `Connect`. | Exactly one function, set with `Bind`. |
| The sender | Carries on immediately. | Pauses until the answer arrives or the call fails. |
| Failing | Fails at the call site only for a bad argument or a misuse. | Can fail in several ways; wrap it in `try`/`catch`. |

## Which one to use

| When | Use |
|---|---|
| The device needs an answer now, the answer is not already available, and waiting is acceptable. | A `RemoteFunction`. This is the only time it is the right tool. |
| The device tells the server something and needs no reply. | A `RemoteEvent`: no pause, no 10 second limit, no failure to handle. |
| The result will be visible in the world anyway (a door opens, a coin disappears). | A `RemoteEvent`. [Replication](replication.md) shows the result. |
| The answer is a value every player may know (a score, the time left, a price list). | A [value object](replication.md#showing-server-state-with-a-value-object) in `world` or under the [Player](api:Player): it is already on the device, updates by itself, and reading it never fails. |
| The server wants something from a device. | A `RemoteEvent` in each direction, with a deadline on the server. |
| The work may take more than a few seconds. | A `RemoteEvent` to start, and a `RemoteEvent` or a replicated value to report the result. |
| Something happens every frame (aiming, dragging). | A `RemoteEvent`, sent at a limited rate. A paused call per frame piles up, and each one can fail. |
| Two scripts are on the same side. | A [LocalFunction](../scripting/scripts-working-together.md#localfunction), or a [module](../scripting/modules-and-import.md). |

## Making a RemoteEvent

`new RemoteEvent()`, in a server script, makes the channel. Give it a [Name](api:Instance.Name) and a [Parent](api:Instance.Parent) so client scripts can find it.

> [!WARNING]
> A [RemoteEvent](api:RemoteEvent) must be created by the server (or placed in the world in TruWorlds Creator).

Put a `RemoteEvent` directly in [world](api:global/world), or in a [Folder](api:Folder) in `world`. A client script finds a `RemoteEvent` the server created by its name. For waiting on a child something else creates, see [Finding children](../engine/instance-tree.md#finding-children).

A [RemoteFunction](api:RemoteFunction) is created and placed by the same rules as a `RemoteEvent`.

## Asking the server

When a client script needs a change that other players see, ask the server to make it through a [RemoteEvent](api:RemoteEvent).

`event.Fire(...)` in a client script sends the values to the server. On the server, a handler's first argument is the [Player](api:Player) whose device sent the message, followed by the values sent. A server handler written as `func on_buy(item)` receives the player in `item`.

> [!WARNING]
> Never let a client script say which player it acts for (`Fire(game.Players.LocalPlayer)`), and never trust such an argument. Use the first argument the server handler is given.

Every argument after `player` was chosen by the player's device and must be checked; see [Checking arguments](trusting-the-client.md#checking-arguments).

The server holds nothing: a message from a device that arrives while no server handler is connected is lost. Connect the server handler at the top of the server script, before any waiting.

## Example: Saying hello to the server

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, creates a `RemoteEvent` named `SayHello` and prints each greeting a device sends with it, with the sending player.

```truscript
local say_hello = new RemoteEvent() {
    Name = "SayHello",
    Parent = world
}

func on_hello(player, greeting, times):
    print(player.Name + " says " + greeting + " x" + times)

say_hello.Connect(on_hello)
# Output when a player presses H:
# Player1 says hi x3
```

When a player presses H, it prints `Player1 says hi x3`.

This client script, attached to a `Folder` in `game.ScriptSystem`, fires the `SayHello` `RemoteEvent` with `"hi"` and `3` when the player presses H.

```truscript
local say_hello = world.WaitForChild("SayHello")

func on_key(key):
    if key == KeyName.H and say_hello != nil:
        say_hello.Fire("hi", 3)

game.InputSystem.KeyPressed.Connect(on_key)
```

## Telling players

On the server, `Fire(...)` sends to every player connected at that moment. A player who joins a second after the server's [Fire](api:Fire) does not receive it.

`FireTo(player, ...)` sends to a single player. [FireTo](api:RemoteEvent.FireTo) works only on the server; on a device it is an error.

On a device, early messages from the server are held: one that arrives before the `RemoteEvent` itself, or before any client script has connected a handler, is kept and delivered as soon as a handler connects, in the original order.

## Example: A private welcome

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, welcomes each player privately when they join.

```truscript
local welcome = new RemoteEvent() {
    Name = "Welcome",
    Parent = world
}

func on_join(player):
    welcome.FireTo(player, "Welcome, " + player.Name + "!", game.Players.PlayerCount)

game.Players.PlayerAdded.Connect(on_join)
```

This client script, attached to a `Folder` in `game.ScriptSystem`, prints the welcome message and player count that the server sends with the `Welcome` [RemoteEvent](api:RemoteEvent).

```truscript
local welcome = world.WaitForChild("Welcome")

func on_welcome(message, player_count):
    print(message + " There are " + player_count + " players here.")

if welcome != nil:
    welcome.Connect(on_welcome)
# Output on the joining player's device only (with two players, each sees their own name and the count 2):
# Welcome, Player1! There are 1 players here.
```

It prints `Welcome, Player1! There are 1 players here.` on the joining player's device only; with two players, each sees their own name and the count 2.

## Each side hears only the other

[Connect](api:EventInstance.Connect) hears only the other side: a server handler runs for messages from devices, a device's handler for messages from the server. There is no path from one device to another: a device's [Fire](api:Fire) reaches only the server.

## Asking a question and waiting

A server script supplies the function that answers calls with [Bind](api:FunctionInstance.Bind). A client script calls [InvokeAsync](api:RemoteFunction.InvokeAsync), which sends its values to the server, pauses the calling script until the server's function returns, and gives back the returned value.

The first parameter of the bound function is always the player: `func price_of(item)` receives the player in `item`.

A bound function that ends without `return` answers `nil`. The answer must be sendable, under [the same rules and limits](#what-you-can-send) as `RemoteEvent` values.

## Example: Asking the server for a price

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, makes a [RemoteFunction](api:RemoteFunction) named `GetPrice` in [world](api:global/world) and binds a function that answers with the price of an item, or `nil` for an item the shop does not sell.

```truscript
local get_price = new RemoteFunction() {
    Name = "GetPrice",
    Parent = world
}

local PRICES = { sword = 50, shield = 30, potion = 5 }

func price_of(player, item):
    if not table.has(PRICES, item):
        return nil
    return PRICES[item]

get_price.Bind(price_of)
```

This client script, attached to a `Folder` in `game.ScriptSystem`, finds the `GetPrice` `RemoteFunction`, asks it for the price of a sword, and prints the answer, or warns when the call fails.

```truscript
local get_price = world.WaitForChild("GetPrice")

try:
    local cost = get_price.InvokeAsync("sword")
    if cost == nil:
        print("The shop does not sell that")
    else:
        print("A sword costs " + cost + " coins")
catch err:
    warn("Could not ask for the price: " + err.message)
# Output:
# A sword costs 50 coins
```

It prints `A sword costs 50 coins`.

## Only devices ask

`Bind` works only on the server; in a client script it raises an error. `InvokeAsync` works only in client scripts; in a server script it raises an error.

The server cannot ask a device a question: there is no server-to-device `InvokeAsync`. See [Which one to use](#which-one-to-use) for what to do instead.

## When a call fails

A failed call raises an error at the `InvokeAsync` line, which you catch with `try`/`catch`. Wrap every `InvokeAsync` call in `try`/`catch`: any failure stops the task.

An uncaught error from `InvokeAsync` stops the calling task like any other script error, and is reported in that device's console.

A [RemoteFunction](api:RemoteFunction) call gives up after 10 seconds, on both the server and the device. A call that arrives while nothing is bound fails at once on the caller's side; it is not kept until you bind. Bind at the top of the server script, before any waiting.

## What you can send

| Value | Can be sent |
|---|---|
| `nil` | Can be sent, and arrives as `nil`. |
| Booleans | Can be sent. |
| Numbers | Can be sent, at full precision. |
| Strings | Can be sent, up to 64 KB of text each (and the whole message is limited too). |
| [Vector2](api:Vector2) and [Vector3](api:Vector3) | Can be sent. |
| [CMatrix](api:CMatrix) | Is sent in a compact form. Expect tiny rounding differences in the rotation. |
| [Color3](api:Color3) | Is sent with each channel reduced to one of 256 levels (0 to 255), rounding down, so `new Color3(0.5, 0.25, 1)` arrives with [R](api:Color3.R) equal to `0.498039` (127/255) and [G](api:Color3.G) equal to `0.247059` (63/255). Compare received colors with a tolerance, not with `==`. |
| Enum values | Arrive as plain numbers. `PartShape.Ball` arrives as `1`. |
| Arrays | Can be sent, up to 1024 items. Items may be any value that can be sent. |
| Tables | Can be sent, up to 4096 entries. Keys and values may be any value that can be sent; number and boolean keys arrive as numbers and booleans, not as text. Tables may be nested up to 8 deep. |
| Instances | Are sent as a reference to the same instance on the other side, not as a copy. |

## What cannot be sent

Functions cannot be sent: you cannot send a callback for the other side to call. Other data types cannot be sent through a [RemoteEvent](api:RemoteEvent), including [Quaternion](api:Quaternion), [Color4](api:Color4), [Rect2D](api:Rect2D), [NumberRange](api:NumberRange) and the sequence types.

An instance created by a client script cannot be sent through a `RemoteEvent` or [RemoteFunction](api:RemoteFunction): the server has no such instance, and trying to send it raises an error in the client script.

Sending a value that cannot be sent raises an error at the [Fire](api:Fire) or `FireTo` call, on either side, and nothing is sent. One whole `RemoteEvent` message is at most 64 KB (65,536 bytes).

## Common patterns

The most robust pattern: the device asks, the server changes a replicated value, and the device shows the value. No message comes back. See [Showing server state with a value object](replication.md#showing-server-state-with-a-value-object).

## Troubleshooting

| What you see | Fix |
|---|---|
| The server handler is connected after a `wait`. | Connect the server handler at the top of the server script, before any waiting. See [Asking the server](#asking-the-server). |
| The server trusts the values a device sends. | Check every argument after `player`. See [Checking arguments](trusting-the-client.md#checking-arguments). |
| You call `InvokeAsync` without `try`/`catch`, and a failed call stops the task. | Wrap every [InvokeAsync](api:RemoteFunction.InvokeAsync) call in `try`/`catch`. See [When a call fails](#when-a-call-fails). |
| You bind after a wait, and the first calls fail. `no function bound: <name>` | Bind at the top of the server script, before any waiting. See [When a call fails](#when-a-call-fails). |
| You call `InvokeAsync` in a server script. | Use a [RemoteEvent](api:RemoteEvent) in each direction, with a deadline on the server. See [Only devices ask](#only-devices-ask). |
