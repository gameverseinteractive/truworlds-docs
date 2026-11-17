---
title: Monetization
description: Sell passes and products for TruCoins
---

# Monetization

Players can spend TruCoins inside your world. [`MarketplaceSystem`](api:MarketplaceSystem) (`game.MarketplaceSystem`) opens the built-in purchase window, tells you what was bought, and checks what a player owns. You sell two kinds of thing in a world: passes and products. Give players what they paid for only from server scripts, because `MarketplaceSystem` told the server so, never because a player's device says a purchase happened.

## Passes and products

| What differs | Pass and product |
|---|---|
| Bought | A pass is bought once, and the player owns it forever. A product is bought again and again. |
| Finding out | For a pass, you ask whether the player owns it, with [`UserOwnsPassAsync`](api:MarketplaceSystem.UserOwnsPassAsync). For a product, you are handed a receipt for each purchase, in [`ProcessReceipt`](api:MarketplaceSystem.ProcessReceipt). |
| Price | A pass can be free. A product costs at least 1 TruCoin. |

## Setting up what you sell

Passes and products are created on the Create site, not in TruWorlds Creator. To add a pass or product, open your [universe](../worlds/universes-and-worlds.md) on the Create site and click the Store tab. An item's number id is what your scripts pass to [`MarketplaceSystem`](api:MarketplaceSystem). A prompt for an id that the world does not sell ends with `NotFound`.

## Opening the purchase window

[`game.MarketplaceSystem.PromptPurchase(player, productId)`](api:MarketplaceSystem.PromptPurchase) shows the built-in purchase window to a player. A client script can prompt only its own player, [`game.Players.LocalPlayer`](api:Players.LocalPlayer).

Prompting inside [`PlayerAdded`](api:Players.PlayerAdded) is too early: the prompt is refused with `PlayerNotReady`. A prompt is refused with `PlayerNotReady` when the player's device has not finished loading the world.

Prompt from something the player does (a click, a button, an [`Interaction`](api:Interaction)), or from the player's first [`CharacterAdded`](api:Player.CharacterAdded), which fires once their device has loaded.

## Example: A button that sells coins

This client script, attached to a [`UIButton`](api:UIButton) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, offers the coin pack when the button is pressed. Replace 202 with your product id.

```truscript
local COIN_PACK = 202

this.Pressed.Connect(func():
    game.MarketplaceSystem.PromptPurchase(game.Players.LocalPlayer, COIN_PACK)
)
```

## When the window closes

[`PromptPurchaseFinished`](api:MarketplaceSystem.PromptPurchaseFinished) fires on the server and on the buyer's device when a purchase window closes or a prompt is refused.

[`print`](api:global/print) and [`tostring`](api:global/tostring) show an enum value as its number, so the [`Result`](api:PurchasePromptResult.Result) of a window closed without buying prints `1`, for `Cancelled`. Compare a [`PurchaseResult`](api:PurchaseResult) with the names (`result.Result == PurchaseResult.Cancelled`), never with the numbers.

On the server, [`WasPurchased`](api:PurchasePromptResult.WasPurchased) in `PromptPurchaseFinished`'s result for a pass is safe to act on. For a product, deliver from [`ProcessReceipt`](api:MarketplaceSystem.ProcessReceipt), not from `PromptPurchaseFinished`.

## Example: Printing each purchase result

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, prints the player's name, the result and the item id each time it fires.

```truscript
game.MarketplaceSystem.PromptPurchaseFinished.Connect(func(result):
    print(result.Player.Name + " " + tostring(result.Result) + " for " + result.ProductId)
)
# Expected output when Player1 closes the window for item 101 without buying:
# Player1 1 for 101
```

It prints `Player1 1 for 101` when Player1 closes the window for item 101 without buying.

## Checking a pass

[`UserOwnsPassAsync`](api:MarketplaceSystem.UserOwnsPassAsync) tells whether a user owns the pass, and waits for the answer. It is server only. Called from a client script, it writes a warning and reports that the pass is not owned. Pass it the player's [`UserId`](api:Player.UserId), a number, not the [`Player`](api:Player).

Check a pass each time the player joins, and again when they buy it during play. Let devices learn about pass ownership from something the server sets, like a [`BoolValue`](api:BoolValue) named `VIP` under the `Player`.

## Delivering a product

Each purchase of a product produces a *receipt*, and your server function delivers it. Assign a function to `game.MarketplaceSystem.ProcessReceipt` once, in a server script. [`ProcessReceipt`](api:MarketplaceSystem.ProcessReceipt) is server only. Assigned from a client script, it writes a warning and never runs. The function assigned to `ProcessReceipt` receives a [`ReceiptInfo`](api:ReceiptInfo).

## Troubleshooting

| What you see | Fix |
|---|---|
| The purchase window does not open when a player joins. | Prompt from something the player does, or from the player's first [`CharacterAdded`](api:Player.CharacterAdded). See [Opening the purchase window](monetization.md#opening-the-purchase-window). |
| [`UserOwnsPassAsync`](api:MarketplaceSystem.UserOwnsPassAsync) always says the pass is not owned. | Pass `UserOwnsPassAsync` the player's [`UserId`](api:Player.UserId), a number, not the [`Player`](api:Player). See [Checking a pass](monetization.md#checking-a-pass). |
| A warning says [`ProcessReceipt`](api:MarketplaceSystem.ProcessReceipt) only runs in server scripts: `MarketplaceSystem.ProcessReceipt only runs in server scripts; set it from a Server script.` | Assign a function to `game.MarketplaceSystem.ProcessReceipt` once, in a server script. See [Delivering a product](monetization.md#delivering-a-product). |
