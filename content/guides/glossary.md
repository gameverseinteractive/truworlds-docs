---
title: Glossary
description: Every TruWorlds term in the manual, defined once
---

# Glossary

## A

- **Anchored**: when [`Anchored`](api:PhysicsInstance.Anchored) is true, [gravity and collisions do not move the part](physics/index.md).
- **Anchors**: [tie an element to a corner, an edge or the whole of its parent](ui/index.md#placing-elements), so that it stays put on every screen size.
- **AnimationTrack**: [one playable copy of a clip](animation/animator.md#load-once-play-many-times), which an [Animator](api:Animator) gives you when you give it a clip id.
- **Animator**: [plays clips](animation/animator.md) on an [Armature](api:Armature). You ask it for a track, and you play the track.
- **Armature**: [the object that holds a rig's skeleton](animation/armatures-and-bones.md) in the world.
- **Asset Browser**: [the panel that shows the files stored inside your world](creator/asset-browser.md).
- **Asset id**: [the id every asset gets](creator/asset-library.md#asset-ids), such as `asset://123456`.
- **Asset Library**: [holds meshes, images, sounds, animations and prefabs](creator/asset-library.md) stored in your TruWorlds account.
- **Attachment**: [a point with a direction, fixed to a part](physics/constraints.md#attachments), that exists only to say "the joint acts here, pointing this way".
- **Avatar**: [the standard TruWorlds character body](players/index.md#characters-and-avatars), with a head, a torso, two arms and two legs, that every player has by default.

## B

- **BillboardUI**: [draws the same kind of UI](ui/billboard-ui.md) as a [ScreenUI](api:ScreenUI), but in the 3D world: a name over a shop, a health bar over an enemy, a price tag on an item.
- **Block**: [a colon at the end of the line that opens it](truscript/syntax-basics.md#blocks-and-indentation), and a body on the following lines, indented further than that line.
- **Bone**: [the object under an Armature for each joint of a rig](animation/armatures-and-bones.md), nested the way the skeleton is nested.

## C

- **Camera**: [the view the player sees the world through](gameplay/camera.md).
- **Character**: [the body a player walks around in](players/players-and-characters.md): a [CharacterController](api:CharacterController) in the world.
- **CharacterController**: a [Model](api:Model) that [walks, runs, jumps, climbs, sits, trips, holds a tool and dies](players/index.md); it is a player's character.
- **Client script**: [a script whose type is set to Client](scripting/script-types.md#client-scripts).
- **Client-server boundary**: [the line between the server and the clients](networking/client-server-model.md).
- **Clip**: [a recording of bones moving over time](animation/animation-clips.md), such as a wave or a walk cycle, that lives in an uploaded file and is named by a clip id, a string.
- **Closure**: [a function together with the variables it holds on to](truscript/closures.md).
- **CMatrix**: [a position and an orientation in one value](engine/index.md#values-and-units).
- **Command bar**: [a quick way to inspect or change the world](creator/script-console.md#the-command-bar) without writing a script file.
- **Constraint**: [joins two parts but leaves them free to move in one particular way](physics/constraints.md).
- **Coroutine**: [a piece of running code that can pause in the middle](truscript/coroutines-and-yield.md), let everything else carry on, and continue later from exactly where it stopped, with all its variables intact.
- **Create site**: [the TruWorlds website where you manage your projects](worlds/publishing-your-game.md#your-project-on-the-create-site).

## D

- **Data store**: [a named box of saved values](players/saving-data.md).
- **Data type**: [a small value with no name, no parent and no place in the tree](engine/data-types.md).
- **Debounce**: [a flag that guards a handler against overlapping runs](scripting/signals-and-events.md#each-run-is-a-task).
- **Delta time**: [the seconds between one frame and the next](networking/frames-and-time.md#framestepped-and-delta-time).
- **Device**: [a player's computer, phone or tablet running the TruWorlds App](networking/client-server-model.md); it shows the world to one player, runs client scripts, and is also called a client.

## E

- **Edit History**: [lists the changes you made to the world](creator/edit-history.md) and lets you step back and forward through them.
- **Explorer**: [the panel that shows everything in a world as a tree of its instances](creator/explorer.md).

## F

- **Fog**: [fades far-away things into a color](environment/sky-and-fog.md), which gives a sense of distance and hides the edge of the world.
- **Folder**: [a plain container](building/index.md#models-and-folders) used only to organize.
- **Frame**: [one pass of the loop that advances the world](networking/frames-and-time.md).

## G

- **game**: [the root of everything](scripting/this-game-world.md#game-and-world): use it to reach the systems, such as [game.Players](api:Players), [game.Storage](api:Storage) and [game.Lighting](api:Lighting).
- **Global variable**: a variable of the whole script: [any name you assign without `local` becomes one](truscript/variables-and-scope.md#globals-by-default).

## H

- **Handler**: [a function you connect to a signal](scripting/signals-and-events.md), which runs every time the signal fires.
- **HingeConstraint**: [keeps its two attachment points together](physics/constraints.md#hingeconstraint) and lets the parts turn only around the X axis of [`Attachment0`](api:TwoAttachmentConstraint.Attachment0).

## I

- **Initializer block**: [sets several properties in one go](truscript/objects-and-construction.md#initializer-blocks) when you create an instance, exactly as assigning them one after another.
- **Input action**: [a named input a world reacts to](gameplay/input-actions.md), such as "Jump"; it is an [InputAction](api:InputAction) instance under `game.InputSystem`.
- **Instance**: [an object that can live in the tree](engine/instance-tree.md) that the Explorer panel shows: it has a [Name](api:Instance.Name), a [Parent](api:Instance.Parent) and children; the class all instances build on is called [Instance](api:Instance).
- **Interaction**: a [`PointInstance`](api:PointInstance) that is [a prompt players activate by pressing a key nearby](gameplay/interactions.md).
- **Inventory**: [holds a player's tools](gameplay/index.md#interactions-and-tools).

## J

- **Joint**: [tells physics that two parts belong together](physics/welds-and-joints.md).

## L

- **Layout container**: [places the elements inside it one after another, in order](ui/layout-containers.md), with the spacing and alignment you choose.
- **Light**: [a small source of light](environment/lights.md) that you place where you want it, unlike the [Lighting](api:Lighting) system's one sun.
- **Lighting**: [controls the light that reaches the whole world at once](environment/lighting.md): the sun, the ambient light that fills in shadows, and the color behind everything.
- **Local space**: also called own space, [measured from a particular thing, along that thing's own axes](engine/cmatrix.md#world-space-and-local-space), as in "2 studs in front of the cannon and 1 stud above it".
- **Local variable**: [made by putting `local` in front of the first assignment](truscript/variables-and-scope.md#local-variables-and-blocks), it belongs to the current block only.
- **LocalEvent**: [an instance that scripts on the same side use to send each other messages](scripting/scripts-working-together.md#localevent).

## M

- **Material**: [sets how the part's surface is drawn](building/parts.md#material) and, for a [Part](api:Part), how heavy the part is, because each material has a density.
- **Member**: [a named thing you reach by writing a dot after the object](engine/properties-methods-signals.md); there are three kinds, and all three use a dot.
- **Mesh**: [a shape made in a 3D modeling program](building/meshes.md): a surface built from many small triangles.
- **MeshPart**: [a part shaped by an uploaded mesh](building/index.md#surfaces-and-new-shapes).
- **Method**: [something the object can do](engine/properties-methods-signals.md#methods), called with parentheses: [`part.Destroy()`](api:Instance.Destroy).
- **Model**: [a group of parts and other instances that can be moved as one](building/index.md#models-and-folders).
- **Module script**: [a script whose job is to be used by other scripts](scripting/modules-and-import.md).
- **Motor**: [spins one part against another around an axle](physics/welds-and-joints.md#kinds-of-joint), for wheels, fans and propellers.
- **Mover**: [moves a part by pushing on it](physics/forces-and-movers.md).

## N

- **NaN**: ("not a number") [a special number value](truscript/value-types.md#nan-and-infinity): the result of a calculation with no answer.
- **Network owner**: [the one machine, the server or one player's device, where a loose part's physics runs](physics/network-ownership.md); every other machine is told where the part is.
- **nil**: [the only "nothing" value in TruScript](truscript/value-types.md#nil).

## P

- **Panel**: [a docked tool window](creator/interface-overview.md#panels-and-docks) such as the Explorer or Properties.
- **Part**: [a block, sphere, cylinder or wedge that you size, color and place](building/index.md), the most important building object.
- **ParticleEmitter**: [sprays many small pictures, called particles, from a point](environment/particles-and-fire.md), and moves, resizes, recolors and fades each one over its life.
- **Player**: [the person](players/players-and-characters.md): their account name, their account number, their tools, their stats.
- **PlayerDefaults**: [holds what every player starts with](players/player-defaults.md), including the default character.
- **PlayerStart**: [a point, not a part](playtesting/player-start-and-spawning.md): it has a position and a rotation but no size, and nothing collides with it.
- **Playtest**: [runs a copy of your world inside TruWorlds Creator](playtesting/index.md).
- **PointInstance**: [has a position but no size or shape of its own](engine/point-instances.md): a light, a flame, a source of particles, a floating name tag, the spot where players appear.
- **Prefab**: [a model published to your Asset Library](creator/asset-library.md#publishing-a-prefab), which you (and, if you share it, others) can insert into any world.
- **Primary body**: [the one part of a Model](building/models-and-folders.md#the-primary-body) that you choose to give the model a place in the world.
- **Project**: [one game as players see it](worlds/universes-and-worlds.md): one page, one name, one Play button.
- **Properties panel**: [shows the properties of whatever is selected](creator/properties-panel.md).
- **Property**: [a value the object holds](engine/properties-methods-signals.md#properties), which you read and usually assign to: `part.Color = new Color3(1, 0, 0)`.

## R

- **Raycast**: [draws a line from a starting point in a direction](physics/raycasting.md) and reports the first part it hits, where, and how far away.
- **RemoteEvent**: [an instance that carries messages between the server and players' devices](networking/remote-communication.md).
- **RemoteFunction**: [lets a client script ask the server a question and wait for the answer](networking/remote-communication.md#asking-a-question-and-waiting).
- **Replication**: [the automatic sending of instances and property changes from the server to devices](networking/replication.md).
- **Reserved server**: [a private server of one of your worlds](worlds/reserved-servers.md).
- **Ribbon**: [the band of buttons under the menu bar](creator/ribbon-and-insert.md).
- **Rig**: [a skeleton plus the mesh it deforms](animation/index.md); the built-in avatar has one, and so does any mesh imported with bones (a skinned mesh).
- **Runtime error**: [a problem found while the script runs](scripting/errors-and-debugging.md).

## S

- **ScreenUI**: [one full-screen layer of UI](ui/canvas-and-screenui.md#screenui); a world can have as many as you like, each a direct child of [game.UICanvas](api:UICanvas).
- **Script**: [a text file in your world containing instructions written in TruScript](scripting/what-is-a-script.md).
- **Script component**: [one attachment of a script file to an instance](scripting/script-components.md#script-components): one link between one instance and one script file.
- **Script Console**: [the panel that shows messages](creator/script-console.md), including a log of what TruWorlds Creator itself did.
- **Script editor**: [the code editor built into TruWorlds Creator](creator/script-editor.md).
- **Seat**: [a part characters can sit on](physics/seats-and-vehicles.md); a [VehicleSeat](api:VehicleSeat) also turns the rider's movement keys into driving.
- **Server**: [the computer that runs the real copy of a world](networking/client-server-model.md) and its server scripts.
- **Server script**: [a script that runs on the server only](scripting/script-types.md); a client script runs on each player's device, separately, and a module script runs wherever the script that imports it runs.
- **Session**: [the server's or one player's own copy of the world in a playtest](playtesting/index.md), with its own tab.
- **Side**: [either the server or a device](networking/client-server-model.md); a script runs on exactly one side.
- **Signal**: [how an object tells your script that something happened](engine/properties-methods-signals.md#signals).
- **Sky**: [what players see behind and above the world](environment/sky-and-fog.md).
- **Solid modeling**: [makes new shapes out of blocks, spheres, cylinders and wedges](building/index.md#surfaces-and-new-shapes) by combining parts in three ways: union, negate and intersect.
- **Spawning**: [the server putting a player's character somewhere](playtesting/index.md#spawning): when the player joins, and every time their character comes back after dying.
- **Stack trace**: [the third part of an error](scripting/errors-and-debugging.md#reading-an-error): one or more lines starting with `-- At Line`, each giving a position as `line:column - line:column`, where a piece of code starts and where it ends.
- **Standard library**: [what a script can use without creating or importing anything](truscript/standard-library.md): a few global functions, and five libraries reached through the globals [`math`](api:global/math), [`string`](api:global/string), [`table`](api:global/table), [`random`](api:global/random) and [`host`](api:global/host).
- **Starting World**: [the one world in each project](worlds/universes-and-worlds.md) that pressing Play always opens.
- **Storage**: [holds objects kept out of the 3D world until a script needs them](creator/explorer.md#the-systems).
- **Streaming**: [the server sending each player only the parts near them](networking/replication.md#streaming), and more as they move.
- **Stud**: [a quarter of a meter (0.25 m)](engine/coordinates-and-units.md#studs-and-the-avatar).
- **Surface**: [a small object that lives inside a part](building/surfaces-and-textures.md) and shows one image on one face of that part.
- **Syntax error**: [a problem found before the script runs](scripting/errors-and-debugging.md), also called a compile error; a problem found while it runs is a runtime error.
- **System**: [a child of `game`](engine/instance-tree.md#the-tree-under-game).

## T

- **Table**: [TruScript's general-purpose record and dictionary](truscript/tables.md).
- **Task**: [one piece of script code that is running or paused part-way through](scripting/waiting-and-tasks.md).
- **Teleport**: [moves a player out of the server they are in](worlds/teleporting.md) and into a server of another world.
- **Texture**: [an image file uploaded to TruWorlds](building/surfaces-and-textures.md), which a [Surface](api:Surface) refers to by its asset id.
- **this**: [the instance the script is attached to](scripting/this-game-world.md#this): use it for working on "my" object, such as the part to spin or the door to open.
- **Tool**: [an item a character holds in its hand and uses](gameplay/creating-tools.md), such as a sword or a torch; it is a [Tool](api:Tool) instance.
- **Top level**: [the code of a script that is not inside any function](scripting/what-is-a-script.md#the-life-of-a-script).
- **Transform**: [to change an object's position, orientation or size](creator/transform-tools.md).
- **Trigger zone**: [an invisible, non-solid part](physics/touch-and-overlap.md#trigger-zones) that only exists to notice things entering it.
- **TruScript**: [the scripting language you use to bring a TruWorlds world to life](truscript/index.md).
- **Truthiness**: the rule that [every value is either truthy (counts as true) or falsy (counts as false) when it is tested](truscript/truthiness.md).
- **TruWorlds Creator**: [the application you use to build, script, test and publish worlds](creator/index.md).
- **Tween**: [changes a property smoothly over time](animation/tweens.md): from its current value to a value you choose, over a number of seconds, along an easing curve.

## U

- **UI editor**: [lets you click, drag and resize a world's UI elements](creator/ui-editor.md) right in the viewport.
- **UI element**: [one thing drawn in a user interface](ui/ui-objects.md): a box, a line of text, a button.
- **UICanvas**: [the place all on-screen UI lives](ui/canvas-and-screenui.md#the-uicanvas); a world has exactly one, and scripts reach it as [game.UICanvas](api:UICanvas).
- **UnionPart**: [a solid made by combining parts](building/index.md#surfaces-and-new-shapes).
- **Universe**: [what scripts and IDs call a project](worlds/universes-and-worlds.md).
- **User interface (UI)**: [everything a player sees and uses that is not the 3D world itself](ui/index.md), from the coin counter in the corner to the label floating over a shop.

## V

- **Value object**: [an instance whose whole job is to hold one value](engine/value-objects.md).
- **Viewport**: [the 3D view in the center of TruWorlds Creator](creator/viewport-and-selection.md), on the first tab.
- **Virtual file system (VFS)**: [a world's file system](scripting/script-components.md): it works like the folders on your computer, but exists only inside the world.
- **VisualInstance**: [any instance that can be seen](engine/visual-instances.md).

## W

- **Weld**: [makes two parts one rigid body](physics/welds-and-joints.md#kinds-of-joint), exactly as they are placed.
- **WeldConstraint**: [holds one part at a fixed offset from another](physics/welds-and-joints.md#kinds-of-joint) while keeping them separate bodies.
- **Welded group**: [parts chained by welds into one rigid body](physics/welds-and-joints.md#welded-groups): when A is welded to B and B to C, the three parts are one.
- **World**: [a tree of instances](engine/index.md).
- **World (in a project)**: [one playable place inside a project](worlds/universes-and-worlds.md): one tree of parts, scripts and files, saved as one file; a project has at least one.
- **World space**: [measured from the world's origin along the world's axes](engine/cmatrix.md#world-space-and-local-space), as in "20 studs east of the origin".

## Y

- **yield**: [a keyword that suspends the current coroutine on the spot](truscript/coroutines-and-yield.md#the-yield-statement).
- **Yielding call**: [a call that pauses a task until something it waits for happens](scripting/waiting-and-tasks.md#calls-that-pause).
