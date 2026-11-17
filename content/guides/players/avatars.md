---
title: Avatars
description: The standard character body, its colors, clothing and accessories
---

# Avatars

An [Avatar](api:Avatar) is the standard body every player has by default; see [Players and data](index.md). An `Avatar` is not the character: the character is a [CharacterController](api:CharacterController), which handles walking, health and dying, and the `Avatar` is the body inside it, its [PrimaryBody](api:Model.PrimaryBody). For the character, see [Players and characters](players-and-characters.md).

## Size

An [Avatar](api:Avatar) has no `Size` property. Its size is fixed. For sizes in studs, see [Coordinates and units](../engine/coordinates-and-units.md).

| Measure | Value |
|---|---|
| Bounds (overall size) | 6.6 studs tall, and about 2.4 studs wide and deep. |
| Collision shape | An upright cylinder 2.4 studs across and 6.4 studs tall. |
| Facing | Forward is -Z. |

## Body colors

Eight [Color3](api:Color3) properties color an [Avatar](api:Avatar)'s body.

## Example: A paint pad

This server script, attached to a Part used as a paint pad, paints the character's torso the color of the pad when stepped on.

```truscript
func on_touch(other):
    if other == nil or other.Parent == nil:
        return
    local character = other.Parent
    if not character.IsA("CharacterController"):
        return
    local body = character.PrimaryBody
    if body and body.IsA("Avatar"):
        body.BodyColor = this.Color

this.Touched.Connect(on_touch)
```

## Clothing

Clothing is added by putting a clothing instance inside the [Avatar](api:Avatar). Each kind of clothing has one property, [ItemId](api:AvatarItem.ItemId): the asset id of the image to draw. An `Avatar` draws only the first child of each kind of clothing. To change a shirt, destroy the old [AvatarShirt](api:AvatarShirt) before adding the new one.

| Class | Dresses |
|---|---|
| [AvatarShirt](api:AvatarShirt) | The torso and arms. |
| [AvatarPants](api:AvatarPants) | The legs. |
| [AvatarShoes](api:AvatarShoes) | The feet. |
| [AvatarFace](api:AvatarFace) | The face. |

## Attaching parts to bones

An [AvatarWeld](api:AvatarWeld) makes a part follow one bone of an [Avatar](api:Avatar), so it moves with the animated body. For bones, see [Armatures and bones](../animation/armatures-and-bones.md), and for a tool held in the hand, [Creating tools](../gameplay/creating-tools.md).

While an `AvatarWeld` is active, its target is anchored and its [CanCollide](api:PhysicsInstance.CanCollide) is off, so it cannot push the character around.

An `AvatarWeld`'s [Offset](api:AvatarWeld.Offset), [Position](api:AvatarWeld.Position) and [Rotation](api:AvatarWeld.Rotation) are in the bone's own directions, which point opposite to the character's: for a weld, +Z is in front of the `Avatar`, -Z behind it, and +Y up.

Parent a welded hat to the character, not `world`, so it is cleaned up on respawn.

## Example: A hat on every player

This server script, attached to a Folder in `game.ScriptSystem`, gives every player's character a hat [Part](api:Part), parented to the character and attached to the `Avatar`'s Head bone with an `AvatarWeld`.

```truscript
func give_hat(character):
    local body = character.PrimaryBody
    if body == nil or not body.IsA("Avatar"):
        return
    local hat = new Part() {
        Name = "Hat",
        Size = new Vector3(2.6, 0.6, 2.6),
        Color = Color3.FromHex("#8b2f2f"),
        Parent = character
    }
    local weld = new AvatarWeld() {
        Target = hat,
        AttachmentBoneName = AvatarBoneName.Head,
        Position = new Vector3(0, 2.8, 0),   # studs above the Head bone, which is at the bottom of the head
        Parent = body
    }

func on_join(player):
    player.CharacterAdded.Connect(give_hat)
    if player.Character:
        give_hat(player.Character)

game.Players.PlayerAdded.Connect(on_join)
for player in game.Players.GetPlayers():
    on_join(player)
```

## Loading a player's look

A player's own character loads the player's look by itself when it spawns, as long as the character's [LoadCharacterAppearance](api:CharacterController.LoadCharacterAppearance) is `true` (the default). Three functions change the whole look of an [Avatar](api:Avatar) at once. [LoadAppearanceForPlayer](api:Avatar.LoadAppearanceForPlayer), [LoadAppearanceForUserId](api:Avatar.LoadAppearanceForUserId) and [ClearAppearance](api:Avatar.ClearAppearance) work only in server scripts and only on an `Avatar` that has a parent; otherwise they do nothing. You never call them in a client script.

For a look of your own, see [Custom characters](custom-characters.md).

## The avatar rig

You can download the standard avatar's rig from the [TruWorlds Engine Assets](https://github.com/gameverseinteractive/truworlds-engine-assets) repository as a `.glb` file and as a Blender file, for making your own [avatar animations](../animation/animating-avatars.md#making-your-own-avatar-animations).

## Troubleshooting

| What you see | Fix |
|---|---|
| You add a second shirt and nothing changes. | Destroy the old [AvatarShirt](api:AvatarShirt) before adding the new one: [Clothing](#clothing). |
| [LoadAppearanceForPlayer](api:Avatar.LoadAppearanceForPlayer) called in a client script does nothing. | Never call it in a client script: [Loading a player's look](#loading-a-players-look). |
