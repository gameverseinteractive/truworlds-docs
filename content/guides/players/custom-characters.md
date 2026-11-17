---
title: Custom characters
description: Fixed looks, a different character per player, and bodies that are not avatars
---

# Custom characters

By default every player is the standard TruWorlds [Avatar](api:Avatar), dressed the way they dressed it on the platform. [PlayerDefaults](api:PlayerDefaults) holds one template for everybody; see [Player defaults](player-defaults.md).

## What a character needs

A working character needs a [CharacterController](api:CharacterController), the object that moves, has health and dies; a plain [Model](api:Model) does not. The template needs the exact name `DefaultCharacter`, as a direct child of [PlayerDefaults](api:PlayerDefaults). A working character needs its body unanchored: an anchored body cannot move, so [MoveTo](api:CharacterController.MoveTo) does nothing and paths end at once.

When your changes to `DefaultCharacter` do nothing, check that the name is exactly `DefaultCharacter` and that it is directly inside `PlayerDefaults`. When the character cannot move because its body is anchored, turn [Anchored](api:PhysicsInstance.Anchored) off on the body.

## Example: One look for everyone

To give everyone the same look: put an [Avatar](api:Avatar) inside `DefaultCharacter`, set the `DefaultCharacter`'s [PrimaryBody](api:Model.PrimaryBody) to that `Avatar`, set the `Avatar`'s colors and add clothing children if you want them, and set the `DefaultCharacter`'s [LoadCharacterAppearance](api:CharacterController.LoadCharacterAppearance) to `false`.

This server script, attached to a Folder in `game.ScriptSystem`, makes every player spawn as the same blue robot.

```truscript
local template = game.PlayerDefaults.WaitForChild("DefaultCharacter")

local body = new Avatar() {
    Name = "Body",
    HeadColor = Color3.FromHex("#c8d2dc"),
    BodyColor = Color3.FromHex("#2f6fd6"),
    LeftArmColor = Color3.FromHex("#c8d2dc"),
    RightArmColor = Color3.FromHex("#c8d2dc"),
    LeftLegColor = Color3.FromHex("#3a3a3a"),
    RightLegColor = Color3.FromHex("#3a3a3a"),
    LeftFootColor = Color3.FromHex("#1e1e1e"),
    RightFootColor = Color3.FromHex("#1e1e1e"),
    Parent = template
}
template.PrimaryBody = body
template.LoadCharacterAppearance = false
template.TitleText = "Unit"
```

With `LoadCharacterAppearance` on, the template's `Avatar` is cleared and re-dressed as the player a moment after spawning, replacing your colors and clothes. When your colors and clothes disappear a moment after spawning, turn `LoadCharacterAppearance` off on the template.

## Example: Changing the player's own look

To keep the player's look but change parts of it, leave `LoadCharacterAppearance` on and make your changes after a brief wait, once the look has arrived.

This server script, attached to a Folder in `game.ScriptSystem`, lets players keep their own clothes, but turns every player's body red a moment after spawning.

```truscript
func on_join(player):
    func on_spawn(character):
        wait(2)
        local body = character.PrimaryBody
        if body and body.IsA("Avatar"):
            body.BodyColor = new Color3(0.8, 0.1, 0.1)

    player.CharacterAdded.Connect(on_spawn)
    if player.Character:
        on_spawn(player.Character)

game.Players.PlayerAdded.Connect(on_join)
for player in game.Players.GetPlayers():
    on_join(player)
```

## A different character per player

For characters that differ per player (teams, classes, a power-up), set whatever differs on the new character in [CharacterAdded](api:Player.CharacterAdded).

For characters spawned before a change, see [Player defaults](player-defaults.md#when-a-change-takes-effect).

## Bodies that are not an Avatar

A character's body does not have to be an [Avatar](api:Avatar): any physics body inside the character, such as a [Part](api:Part) or a [MeshPart](api:MeshPart), can be its [PrimaryBody](api:Model.PrimaryBody).

| Feature | With a body that is not an Avatar |
|---|---|
| Walking, running, jumping, health, death and respawn | Work with an [Avatar](api:Avatar) body and with any other body. |
| Name tag and health bar | Work with an [Avatar](api:Avatar) body and with any other body. |
| Built-in movement animations (`Animations` folder) | Work with an [Avatar](api:Avatar) body, but not with any other body. |
| Clothing, accessories and [AvatarWeld](api:AvatarWeld) | Work with an [Avatar](api:Avatar) body, but not with any other body. |

## Characters you build yourself

[LoadCharacterAppearance](api:CharacterController.LoadCharacterAppearance) only acts when a player's character spawns. For a character you build in a script, such as a statue or a non-player character wearing someone's look, call the [Avatar](api:Avatar)'s functions yourself. For these, see [Avatars](avatars.md#loading-a-players-look).

## Troubleshooting

| What you see | Fix |
|---|---|
| Your changes to `DefaultCharacter` do nothing. | Check that the name is exactly `DefaultCharacter` and that it is directly inside [PlayerDefaults](api:PlayerDefaults) ([What a character needs](#what-a-character-needs)); respawn players to apply a change ([Player defaults](player-defaults.md#when-a-change-takes-effect)). |
| Your colors and clothes disappear a moment after spawning. | Turn [LoadCharacterAppearance](api:CharacterController.LoadCharacterAppearance) off on the template: [One look for everyone](#example-one-look-for-everyone). |
| The character spawns but cannot move. | Turn [Anchored](api:PhysicsInstance.Anchored) off on the body: [What a character needs](#what-a-character-needs). |
