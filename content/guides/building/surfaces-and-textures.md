---
title: Surfaces and textures
description: Put an image on a face of a part
---

# Surfaces and textures

To show a picture on a part, such as a sign, a poster, a screen or a road marking, add a [Surface](api:Surface) to it. A `Surface` is a small object that lives inside a part and shows one image on one face of that part. A texture is an image file [uploaded](../creator/asset-library.md) to TruWorlds; a `Surface` refers to it by its asset id.

## Adding a Surface

To add a [Surface](api:Surface) by hand, right-click the part in the Explorer and choose **Insert Object**, then **Surface**. With the new `Surface` selected, set [Direction](api:Surface.Direction) in the Properties panel to the face you want. Set the `Surface`'s [TextureId](api:Surface.TextureId) to the asset id of your image, for example `asset://123456`.

`TextureId` is not a file path or a web address: an image must be uploaded to your TruWorlds account before a `Surface` can show it.

## Which parts show a Surface

A [Surface](api:Surface) works only as the direct child of a plain [Part](api:Part). Anywhere else, such as in a [Model](api:Model), a [Folder](api:Folder) or a [MeshPart](api:MeshPart), it does nothing and causes no error.

A [UnionPart](api:UnionPart) is a kind of `Part`, but a `Surface` inside one shows nothing.

## Faces

A part's faces are named from the part's own point of view and turn with it: rotate the part and its `Front` face rotates too.

| Face | Side and size |
|---|---|
| `Front` | The `Front` face is on -Z, the part's forward side. It is `Size.X` wide and `Size.Y` tall. |
| `Back` | The `Back` face is on +Z. It is `Size.X` wide and `Size.Y` tall. |
| `Left` | The `Left` face is on -X. It is `Size.Z` wide and `Size.Y` tall. |
| `Right` | The `Right` face is on +X. It is `Size.Z` wide and `Size.Y` tall. |
| `Top` | The `Top` face is on +Y. It is `Size.X` by `Size.Z`. |
| `Bottom` | The `Bottom` face is on -Y. It is `Size.X` by `Size.Z`. |

## Stretch or tile

[MapMode](api:Surface.MapMode) decides how the image is laid onto the face.

| MapMode | How the image is laid on |
|---|---|
| `Stretch` | In `Stretch` mode the image fills the face once, edge to edge, squashed or stretched if the face is not the image's shape. It is the default, and right for signs, posters and screens. |
| `Tile` | In `Tile` mode the image repeats across the face, each copy covering `StudsPerTile.X` studs across and `StudsPerTile.Y` studs down, whatever the face's size. It is right for floors, walls, roads and fences. |

## Example: A floating image

Because a [Surface](api:Surface)'s [Transparency](api:VisualInstance.Transparency) is added to its part's, a `Surface` on a fully transparent part is fully transparent too, unless its [IgnoreParent](../engine/visual-instances.md) is on.

For a picture that seems to float with nothing behind it, such as a decal, a logo in mid-air or a painted line, make a thin part where the image goes, set its `Transparency` to 1, and add a `Surface` with `IgnoreParent` on.

This server script, attached to any instance in the world, builds a floating logo: an invisible board that shows only its image.

```truscript
local board = new Part() {
    Name = "Logo",
    Size = new Vector3(10, 10, 0.2),
    Position = new Vector3(0, 12, -30),
    Transparency = 1,
    CanCollide = false,
    CastShadow = false,
    Anchored = true,
    Parent = world
}

local image = new Surface() {
    Direction = SurfaceDirection.Front,
    TextureId = "asset://123456",          # replace with the id of your own image
    IgnoreParent = true,                   # stay visible although the board is fully transparent
    Parent = board
}
```
