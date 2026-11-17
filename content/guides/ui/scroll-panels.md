---
title: Scroll panels
description: Scrolling lists and grids that hold more than fits
---

# Scroll panels

A [`UIScrollPanel`](api:UIScrollPanel) is a panel that can hold more than fits: it shows a window onto its contents, cuts off the rest, and lets the player move the contents with the mouse wheel, a trackpad or a scrollbar.

## Example: A scrolling list

The standard arrangement of a scrolling list has three levels: the scroll panel, with the size of the visible window; one [layout container](layout-containers.md) inside it, as wide as the panel and as tall as its rows; and the rows.

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes a scrolling list of thirty rows in a 300 by 320 window.

```truscript
local screen = new ScreenUI() { Name = "ListDemo", Parent = game.UICanvas }

local scroll = new UIScrollPanel() {
    Name = "List",
    Position = new Vector2(40, 40),
    Size = new Vector2(300, 320),
    Padding = new Vector2(8, 8),
    Color = new Color4(0, 0, 0, 0.6),
    Roundness = 12,
    Parent = screen
}

local rows = new UIVerticalLayout() {
    Name = "Rows",
    AnchorRight = 1,                        # as wide as the scroll panel's content area...
    Size = new Vector2(-12, 0),             # ...less 12 pixels, to leave room for the scrollbar
    FitContents = UIContentFit.Y,           # as tall as all the rows together
    Spacing = 6,
    Parent = scroll
}

for i in range(30):
    local row = new UIButton() {
        Name = "Row" + i,
        Text = "Item " + (i + 1),
        MinSize = new Vector2(0, 40),
        Parent = rows
    }
```

A scroll panel does not stack its children: they are placed freely, with [`Position`](api:UIObject.Position) and anchors, like the children of any panel. The stacking comes from the layout container you put inside. When rows in a scroll panel are piled on top of each other, put a [`UIVerticalLayout`](api:UIVerticalLayout) inside the scroll panel.

A scroll panel always clips. Setting its [`ClipsChildren`](api:UIObject.ClipsChildren) has no effect.

The inner container of a scroll panel must be allowed to be taller than the panel, which is what `FitContents = UIContentFit.Y` does. If the inner container is stretched to the scroll panel's height instead, nothing overflows and nothing scrolls. When a scroll panel does not scroll because its contents are not bigger than it, set `FitContents = UIContentFit.Y` on the inner layout, and give the rows a [`MinSize`](api:UIObject.MinSize).

## Scrolling from a script

[`ScrollOffset`](api:UIScrollPanel.ScrollOffset) can be assigned directly. The value is limited to the valid range, so assigning a huge number goes to the end.

[`ScrollIntoView`](api:UIScrollPanel.ScrollIntoView) with an element scrolls by the smallest amount that brings `element`, which must be somewhere inside the panel, fully into view. It takes effect on the next frame, and does nothing if `element` is `nil` or not inside the panel.

## Following new content

`StickToEnd = true` makes a view follow new content: while the view is at the bottom it stays there as content is added, it stops following the moment the player scrolls up, and it follows again when the player scrolls back to the bottom. You do not call [`ScrollToEnd()`](api:UIScrollPanel.ScrollToEnd) after adding a row. That is what [`StickToEnd`](api:UIScrollPanel.StickToEnd) is for.

While the view is following, a script that assigns [`ScrollOffset`](api:UIScrollPanel.ScrollOffset) is overruled: the view goes back to the bottom on the next frame. To move a following view from a script, call [`ScrollTo`](api:UIScrollPanel.ScrollTo), which counts as the player scrolling (it stops the following unless it lands at the bottom), or turn `StickToEnd` off first.

## Troubleshooting

| What you see | Fix |
|---|---|
| A scroll panel does not scroll. | Set `FitContents = UIContentFit.Y` on the inner layout, and give the rows a `MinSize`. See [A scrolling list](#example-a-scrolling-list) and [Size is ignored inside a layout](layout-containers.md#size-is-ignored-inside-a-layout). |
| Rows in a scroll panel are piled on top of each other. | Put a [`UIVerticalLayout`](api:UIVerticalLayout) inside the scroll panel. See [A scrolling list](#example-a-scrolling-list). |
| Setting `ScrollOffset` snaps back. | Call `ScrollTo(...)`, or turn `StickToEnd` off first. See [Following new content](#following-new-content). |
