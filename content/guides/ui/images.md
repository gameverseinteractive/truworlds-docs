---
title: Images
description: Show images in panels and circles, and choose how they fit
---

# Images

Any picture in a UI (icons, logos, item pictures, decorated window frames, patterned backgrounds) is shown with a [`UIBackgroundImage`](api:UIBackgroundImage). There is no image element with its own position and size: an image is something you put inside a shape (a panel, a text panel, a button or a circle), which is then filled with the picture instead of a flat color.

## Showing an image

[`ImageId`](api:UIBackgroundImage.ImageId) is text of the form `asset://` followed by the number of an image you have uploaded, for example `"asset://123456"`. It is not a file path or a web address: the image has to be [uploaded](../creator/asset-library.md) to your TruWorlds account first.

The image is clipped to the shape: in a panel with [`Roundness`](api:UIPanel.Roundness) it gets rounded corners, and in a [`UICircle`](api:UICircle) it is round. Text and child elements of the shape are drawn over the image, so a button with an image inside is an image button. When something inside an image button is taking the pointer, set `BlocksPointer = false` on the button's children; see [BlocksPointer](buttons-and-pointer.md#blockspointer).

## Example: A picture with rounded corners

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, shows a 128 by 128 picture with rounded corners. Replace the id with the asset id of an image you uploaded.

```truscript
local screen = new ScreenUI() { Name = "ImageDemo", Parent = game.UICanvas }

local picture = new UIPanel() {
    Name = "Picture",
    Position = new Vector2(40, 40),
    Size = new Vector2(128, 128),
    Color = new Color4(1, 1, 1),            # white: show the image in its own colors
    Roundness = 16,
    Parent = screen
}

local image = new UIBackgroundImage() {
    ImageId = "asset://123456",
    Fit = UIImageFit.Cover,
    Parent = picture
}
```

## Where the image goes

A [`UIBackgroundImage`](api:UIBackgroundImage) only does something as a direct child of a shape. Under a [`ScreenUI`](api:ScreenUI), a layout container, a folder or anything else, it shows nothing. Only the first `UIBackgroundImage` among a shape's children is used. Others do nothing. To layer pictures, nest panels: each panel can have its own image.

## While an image loads

While an image is loading, a placeholder picture shows in its place: a dark, almost black fill with a gray page icon in the middle. If the id is wrong, or the image cannot be loaded, the placeholder stays, and a warning appears in the console.

Nothing is reported to your script when an image cannot be loaded: no error is raised, and no signal says an image has finished loading or failed.

## Fitting the image to the shape

[`Fit`](api:UIBackgroundImage.Fit) is how the image is fitted into the parent's rectangle. You choose the shape's size; use `Center` or `Cover` to keep the proportions right.

| Fit | What it does |
|---|---|
| `Stretch` | Stretches the image to fill the rectangle exactly, distorting it if the proportions differ. Use it for images made at the right proportions, and for gradients and plain textures. |
| `Center` | Keeps the image's proportions and scales it to fit inside the rectangle, centered, leaving the part it does not cover transparent. Use it for icons and logos that must be seen whole. |
| `Cover` | Keeps the image's proportions and scales it to cover the rectangle, centered, cropping whatever hangs over the edges. Use it for photos, thumbnails and avatars. |
| `Slice` | Is 9-slice: the corners keep their size, the edges stretch one way and the middle both ways. Use it for window frames, buttons and speech bubbles drawn as images that must work at any size. |
| `Tile` | The image is repeated across the rectangle at [`TileSize`](api:UIBackgroundImage.TileSize). Use it for patterns: stripes, checks, paper textures. |

## Tinting

The parent shape's [`Color`](api:UIShape.Color) multiplies the image's colors, channel by channel: a pure red `Color` turns a yellow star on a blue background into a red star on black. A parent `Color` tints the image toward that color: a white icon becomes exactly that color.

A new [`UIButton`](api:UIButton) is light gray, which darkens an image slightly. Set the button's `Color` to white for a true-color image button.

## Example: One icon in three states

This client script, attached to a [`UIPanel`](api:UIPanel) that contains a [`UIBackgroundImage`](api:UIBackgroundImage) showing a white icon, recolors one white icon to show three states.

```truscript
local available = Color4.FromHex("#58CC60")
local locked = new Color4(1, 1, 1, 0.3)
local selected = Color4.FromHex("#FFD93B")

this.Color = locked
wait(2)
this.Color = available
wait(2)
this.Color = selected
```

## Troubleshooting

| What you see | Fix |
|---|---|
| The image is squashed. | Use `Center` or `Cover` to keep the proportions right. See [Fitting the image to the shape](#fitting-the-image-to-the-shape). |
| A second image on the same panel does not show. | To layer pictures, nest panels: each panel can have its own image. See [Where the image goes](#where-the-image-goes). |
