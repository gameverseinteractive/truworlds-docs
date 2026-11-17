---
title: Blending and states
description: Mix clips by one number, and switch between named states
---

# Blending and states

An [`AnimationBlend1D`](api:AnimationBlend1D) mixes several looping clips according to one number. Walk and run mixed by speed is the classic case. An [`AnimationStateMachine`](api:AnimationStateMachine) holds named states and the transitions between them. Blends and state machines are both made by an [`Animator`](api:Animator) and drive ordinary [`AnimationTrack`](api:AnimationTrack) objects, so everything about an `Animator`'s tracks still applies to them.

## Blending clips by one number

The clips of an [`AnimationBlend1D`](api:AnimationBlend1D) sit at positions along one axis (walk at 16, run at 25.6, say), and [`Value`](api:AnimationBlend1D.Value) is a pointer on that axis. The two clips either side of a blend's `Value` are mixed, more of whichever is closer. Move `Value` and the mix follows. [`CreateBlend1D`](api:Animator.CreateBlend1D) on an [`Animator`](api:Animator) makes an empty `AnimationBlend1D`.

While a blend is stopped, `Value` is only remembered. The next [`Play`](api:AnimationBlend1D.Play) applies it. When setting `Value` on a blend does nothing because the blend is not playing, call `Play`, or enter its state.

## Example: A jogger that speeds up and slows down

This server script, attached to a folder in `game.ScriptSystem`, makes a non-player character that speeds up and slows down, its legs blending between walk and run.

```truscript
local npc = new CharacterController() { Name = "Jogger" }
local body = new Avatar() { Parent = npc }
npc.PrimaryBody = body
npc.Parent = world
npc.Position = new Vector3(0, 1, -15)
npc.FindFirstChild("Animations").FindFirstChild("AutoAnimate").Value = false
while npc.Animator == nil:
    wait(0.1)

local move = npc.Animator.CreateBlend1D(AnimationPriority.Movement)
move.AddClip("local://avatar/avatar.glb#Idle", 0)
move.AddClip("local://avatar/avatar.glb#Walk", 16)
move.AddClip("local://avatar/avatar.glb#Run", 25.6)
move.Play()

local t = 0
while true:
    local dt = wait()
    t += dt
    move.Value = math.ping_pong(t * 5, 25.6)    # sweeps 0 up to 25.6 and back, forever
```

## Keeping the clips of a blend in step

A blend makes every clip after the first follow the first one's progress, so clips of different lengths are always the same fraction of the way through. Author a blend's clips so the same thing happens at the same fraction: left foot down at 0 and right foot down at halfway, in both walk and run. See [keeping two tracks in step](layers-and-timing.md#keeping-two-tracks-in-step) for how a track follows another.

## The pieces of a state machine

| Piece | What it is |
|---|---|
| State | A name plus something to play: either one clip ([`AddClipState`](api:AnimationStateMachine.AddClipState)) or a blend ([`AddBlendState`](api:AnimationStateMachine.AddBlendState)). |
| Parameter | A named value you set from your script. There are three kinds: numbers ([`SetNumber`](api:AnimationStateMachine.SetNumber)), true/false values ([`SetBool`](api:AnimationStateMachine.SetBool)) and triggers ([`SetTrigger`](api:AnimationStateMachine.SetTrigger)). A trigger is a one-time signal: "this just happened". |
| Transition | An arrow from one state (or from any state) to another, with a fade time and rules for when it may fire. |
| Condition | One rule on a transition, comparing a parameter: "Speed greater than 0.5", "Grounded is true", "Jump was triggered". |

## Building a machine

The order matters: add every state, then every transition and its conditions, then call [`Start`](api:AnimationStateMachine.Start). Once a state machine is running, states, transitions and conditions can no longer be added.

## Example: A greeter that dances when a player joins

This server script, attached to a folder in `game.ScriptSystem`, makes a non-player character that idles, and dances for a while whenever a player joins.

```truscript
local npc = new CharacterController() { Name = "Greeter" }
local body = new Avatar() { Parent = npc }
npc.PrimaryBody = body
npc.Parent = world
npc.Position = new Vector3(0, 1, -15)
npc.FindFirstChild("Animations").FindFirstChild("AutoAnimate").Value = false
while npc.Animator == nil:
    wait(0.1)

local sm = npc.Animator.CreateStateMachine()

# 1. States
sm.AddClipState("Idle", "local://avatar/avatar.glb#Idle")              # clip states start out looped
local dance = sm.AddClipState("Dance", "local://avatar/avatar.glb#HappyDance")
dance.Looped = false                                                    # play once, then end

# 2. Transitions
local toDance = sm.AddTransition("Idle", "Dance", 0.3)
toDance.AddCondition("Greet", AnimationConditionOp.Triggered, 0)
local toIdle = sm.AddTransition("Dance", "Idle", 0.3)
toIdle.OnEnd = true                                                     # fires when the dance clip ends

# 3. Start
sm.Start("Idle")
sm.StateChanged.Connect(func(state):
    print("Greeter is now in " + state)
)

game.Players.PlayerAdded.Connect(func(player):
    sm.SetTrigger("Greet")
)

# Expected output when a player joins:
# Greeter is now in Dance
# Greeter is now in Idle
```

It prints `Greeter is now in Dance`, then `Greeter is now in Idle`.

## Transitions

Each frame, a running state machine checks the arrows leaving the current state and follows one whose conditions are met, fading from the old state's animation to the new one. `AddTransition(from, to, duration)` adds an arrow, an [`AnimationTransition`](api:AnimationTransition).

| Setting | When the transition may fire |
|---|---|
| Conditions | Every condition added to the transition with [`AddCondition`](api:AnimationTransition.AddCondition) must hold. |
| [`ExitTime`](api:AnimationTransition.ExitTime) | When it is 0 or more, the transition may fire only once the current state's animation has passed this fraction of the way through (0 is the start, 1 is the end). |
| [`OnEnd`](api:AnimationTransition.OnEnd) | When it is true, the transition may fire only after the current state's non-looped clip has reached its end. |

## Conditions and parameters

`transition.AddCondition(parameter, op, value)` adds one rule. `op` is an [`AnimationConditionOp`](api:AnimationConditionOp). Pass 0 as the `value` of [`AddCondition`](api:AnimationTransition.AddCondition) for `IsTrue`, `IsFalse` and `Triggered`.

A transition with no condition, no `ExitTime` and `OnEnd` false could never fire, so `Start` refuses it with an error.

## Triggers

A trigger stays set until a transition that reads it fires. Firing uses it up. A trigger set when no transition can use it is not lost: it waits. If you press attack in mid-air and the only arrow that reads `Attack` leaves `Idle`, the attack happens when the character next reaches `Idle`.

If you do not want a waiting trigger to fire later, call [`ResetTrigger`](api:AnimationStateMachine.ResetTrigger) when the moment has passed.

## Which side builds them

Blends and state machines are not sent between the server and players' devices. Only the tracks they drive are. Build a blend or machine only on the side that [owns](animator.md#which-side-plays-the-animation) the [`Animator`](api:Animator): a client script on the owning player's device for a player's character, a server script for non-player characters and unowned meshes.

## Troubleshooting

| What you see | Fix |
|---|---|
| An action fires long after you pressed the key. | Call `ResetTrigger` when the moment has passed, if you do not want a waiting trigger to fire later: [Triggers](#triggers). |
| Setting `Value` on your blend does nothing. | Call `Play`, or enter its state: [Blending clips by one number](#blending-clips-by-one-number). |
