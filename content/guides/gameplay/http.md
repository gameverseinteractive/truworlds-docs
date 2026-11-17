---
title: HTTP requests
description: Call outside web services from server scripts
---

# HTTP requests

With [`HttpSystem`](api:HttpSystem) a server script can fetch a daily challenge from your site, post a high score to a web hook or read a configuration file. `HttpSystem` requests can only run from server scripts; from the client they are refused with an error. When a request is in a client script, move it to a server script. Devices that need something from the web ask the server through a [`RemoteFunction`](../networking/remote-communication.md).

## Example: A first request

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, sends a GET request to https://example.com/ and prints the status code and whether it succeeded.

```truscript
local response = game.HttpSystem.GetAsync("https://example.com/")
print(response.StatusCode)
print(response.Success)
# Expected output:
# 200
# true
```

It prints `200`, then `true`.

Requests work in a TruWorlds Creator playtest: the playtest's server really sends them. Failures come back as a response, not an error: a timeout, a network problem or a 404 gives an [`HttpResponse`](api:HttpResponse) with [`Success`](api:HttpResponse.Success) `false`. Always check `Success`.

[`StatusCode`](api:HttpResponse.StatusCode) is the HTTP status code, such as 200 or 404. It is 0 when no answer arrived, and 429 when this server's request limit was hit or the service answered 429.

## Sending data

A table, array, number or boolean passed as the body is sent as JSON, with Content-Type `application/json`. A string passed as the body is sent unchanged, with Content-Type `text/plain`. To send JSON, pass the table and let [`HttpSystem`](api:HttpSystem) encode it.

> [!WARNING]
> To send JSON, pass the table, not a string from `JsonEncode`: a string body is sent as plain text, and Content-Type is always set from the body, replacing any in the headers.

## Example: Posting a score

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, posts a score as JSON. The service receives `{"name":"Ava","score":1200}`.

```truscript
local response = game.HttpSystem.PostAsync("https://example.com/scores", {
    name = "Ava",
    score = 1200
})
print(response.StatusCode)
```

## JSON

[`game.HttpSystem`](api:HttpSystem) converts tables to and from JSON text: `JsonEncode({ a = 1, b = [1, 2] })` gives `{"a":1,"b":[1,2]}`, and [`JsonDecode`](api:HttpSystem.JsonDecode) turns it back. [`JsonEncode`](api:HttpSystem.JsonEncode) and `JsonDecode` work in client scripts too.

`JsonDecode` raises an error for text that is not valid JSON. So decode with `JsonDecode` inside [`try`](../truscript/error-handling.md).

## Example: Decoding JSON safely

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, defines `decode`, which decodes JSON text inside `try` and warns and gives `nil` when the text is not valid JSON. It then decodes a valid and an invalid text with it.

```truscript
func decode(text):
    try:
        return game.HttpSystem.JsonDecode(text)
    catch err:
        warn("Not valid JSON: " + err.message)
        return nil

print(decode('{"ok": true}').ok)
print(decode("<html>Server error</html>"))
# Expected output:
# true
# (a warning line that starts "Not valid JSON:")
# nil
```

It prints `true`, then a warning line that starts `Not valid JSON:`, then `nil`.

## The request limit

There is a limit of 15 requests per minute for each server. A request over the limit gives a response with `Success` `false`, `StatusCode` 429 and an [`Error`](api:HttpResponse.Error) saying how long to wait, and a warning is written to the console. Always read how long to wait from `Error` rather than assuming a number.

To stay inside the request limit, fetch once and keep the answer: load configuration when the server starts and keep it in a variable. Do not make a request per player action: collect events and send them together.

## Safety

Keep secrets in server scripts. Never build a URL from something a device sent; at most, let a device choose from a fixed list.

## Troubleshooting

| What you see | Fix |
|---|---|
| An [`HttpSystem`](api:HttpSystem) request from the client fails with an error: `HttpSystem requests are not allowed from the client. They can only run from server scripts.` | When a request is in a client script, move it to a server script. See [HTTP requests](http.md). |
| The service says the JSON is invalid, or that the body is plain text. | To send JSON, pass the table and let [`HttpSystem`](api:HttpSystem) encode it. See [Sending data](http.md#sending-data). |
| Requests work, then stop for a while, and a warning about the rate limit is written to the console: `HttpSystem: rate limit exceeded; retry in 3.8s` | Fetch once and keep the answer, and do not make a request per player action: collect events and send them together. See [The request limit](http.md#the-request-limit). |
