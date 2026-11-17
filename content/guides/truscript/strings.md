---
title: Strings
description: Write, join, slice, format and compare text with the string library
---

# Strings

A string is written between double quotes `"like this"` or single quotes `'like this'`, which mean the same. Strings never change. Every string function returns a new string and leaves the original alone.

## Writing a string

A string literal must start and end on the same line: a line break inside the quotes is a compile error. To put a line break in the text, use the `\n` escape.

With an unknown escape the script still runs, the backslash is dropped, and the script editor shows warning `TS0007`. When a backslash is followed by a character that is not an escape, write `\\` if you want a real backslash.

When a string literal has no closing quote on the same line, close the quote, or use `\n` for a line break.

| Escape | Gives |
|---|---|
| `\n` | In a string, the escape `\n` is a line break (new line). |
| `\t` | In a string, the escape `\t` is a tab. |
| `\\` | In a string, the escape `\\` is one backslash. |
| `\"` | In a string, the escape `\"` is a double quote (useful inside a `"..."` string). |

## Joining

`+` joins when either side is a string, turning the other side into text with the same rules as [tostring](api:global/tostring): `"Coins: " + 25` is `"Coins: 25"`.

There is no string interpolation such as `"{name}"`. Only `+` works on strings. The other arithmetic operators raise a runtime error. To repeat a string, use [string.repeat](api:global/string.repeat).

## No methods on strings

A string supports exactly two things directly: reading its [length](api:builtin/string.length), and reading one character with `[ ]`. Everything else is a function in the [string](api:global/string) library that takes the text as its first argument: `string.upper(name)`, never `name.upper()`.

This script calls [string.upper](api:global/string.upper) with the text as its argument and prints the result.

```truscript
local shout = string.upper("hi")
print(shout)    # HI
```

`length` is a property, so you write it without parentheses.

## Characters and positions

String positions are counted from 0, like arrays. `text[i]` gives the character at position `i` as a new one-character string. A negative string position counts from the end: `-1` is the last character.

You cannot assign to a position in a string: `word[0] = "j"` is a runtime error. To change a character, build a new string instead: strings cannot be changed.

A `for` loop cannot walk a string directly: `for c in "abc":` is a runtime error. To walk the characters of a string, loop over the positions with [range](api:global/range) and index: `for i in range(text.length):`.

## Comparing strings

`==` and `!=` compare strings by their content, character by character, and are case-sensitive.

`<`, `<=`, `>` and `>=` compare two strings character by character by each character's code, which is dictionary order for text all in one case. In string ordering every capital letter sorts before every lower-case letter: `"Zebra" < "apple"` is `true`. In string ordering, digits are compared as characters, not as numbers: `"10" < "9"` is `true` because `"1"` comes before `"9"`.

To compare strings without caring about upper and lower case, convert both sides first.

## Formatting with string.format

`string.format(template, ...)` replaces numbered placeholders in the template: `{0}` with the first value after the template, `{1}` with the second, and so on.

This script builds strings with [string.format](api:global/string.format), using placeholders in order, out of order and more than once.

```truscript
print(string.format("{0} has {1} coins", "Ada", 25))       # Ada has 25 coins
print(string.format("{1}, {0}! {1}!", "world", "Hello"))   # Hello, world! Hello!
```

Round a number yourself with [math.round_digits](api:global/math.round_digits) before you pass it to `string.format`.

## The string library

| Function | What it does |
|---|---|
| [string.contains](api:global/string.contains) | `string.contains(str, value)` tells whether `value` appears anywhere in `str`. It is case-sensitive: `string.contains("Hello", "hell")` is `false`. |
| [string.trim](api:global/string.trim) | `string.trim(str)` gives a copy with spaces, tabs and line breaks removed from both ends. Whitespace in the middle is kept. There is no trim-left-only or trim-right-only function. |
| [string.replace](api:global/string.replace) | `string.replace(str, old, new)` gives a copy with every `old` replaced by `new`, case-sensitive and as plain text. `old` must not be empty. |
| [string.substring](api:global/string.substring) | `string.substring(str, start, length)` gives `length` characters of `str` from position `start` (from 0). All three arguments are required, a range past the end is a runtime error, and negative positions are not allowed. |
| [string.split](api:global/string.split) | `string.split(str, separator)` splits `str` into an array of the pieces between each `separator`, which is plain text of any length. Two separators in a row give an empty piece; a separator that never appears, or `""`, gives the whole string as one element. |

## Troubleshooting

| What you see | Fix |
|---|---|
| The script does not run, and compile error `TS0001` says a string literal is unterminated: `Unterminated string literal.` | Close the quote, or use `\n` for a line break. See [Writing a string](#writing-a-string). |
| An error says a string cannot be indexed, on a line that assigns to `text[i]`: `Cannot index string.` | Build a new string instead: strings cannot be changed. See [Characters and positions](#characters-and-positions). |
