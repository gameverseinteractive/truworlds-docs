---
title: Syntax basics
description: Comments, indented blocks, statements, line breaks and names
---

# Syntax basics

A script runs from the top, one statement after another. Normally you write one statement per line, and the end of the line ends it: nothing goes at the end of a line. A semicolon separates statements written on the same line.

## Comments

`#` starts a comment that runs to the end of the line, on a line of its own or after code.

This script writes a comment on a line of its own and another after an assignment, then prints the value.

```truscript
# This whole line is a comment.
health = 100   # this part is a comment, the assignment still runs
print(health)  # prints 100
```

It prints `100`.

`//` and `--` are not comments.

Three hash characters in a row (`###`) start a block comment: everything up to the next `###` is ignored, across any number of lines.

Four or more `#` in a row still begin with three, so a banner line of hashes opens a block comment and swallows the code after it, up to the next `###`.

## Blocks and indentation

A block is a colon at the end of the line that opens it, and a body on the following lines, indented further than that line.

This script runs two lines inside an `if` block, then one line back at the outer level.

```truscript
score = 120
if score > 100:
    print("high score")      # inside the if block
    print("well played")     # still inside
print("done")                # back at the outer level, always runs
# prints:
# high score
# well played
# done
```

It prints `high score`, then `well played`, then `done`.

The block ends at the first line that goes back to the earlier indentation. TruScript is not Lua: there is no `end`, no `then` and no `do`. Every line of one block must be indented by the same amount. A tab counts as exactly four spaces, so a block that mixes a tab and four spaces works, but mixing is easy to get wrong.

When indentation is wrong, the script does not run at all. When a line that opens a block has no colon, add the colon.

## Empty and one-line blocks

A block cannot be empty, because there would be nothing to indent. When you need a block that does nothing, write the statement `pass`. It does nothing at all.

When a line ends with a colon but the next line is not indented, indent the body, or write `pass` if the body should be empty.

When a block's body is short, you may write it on the same line, straight after the colon.

Everything after the colon on that line is the body: in `if x > 3: print("big"); print("more")` both prints are inside the `if`.

## Breaking a long line

TruScript has no line-continuation character, and you cannot break a line after an operator. You can break a line inside round brackets, square brackets and curly braces, which covers call arguments, array literals, table literals and initializer blocks.

This script breaks an array literal, a table literal and a call over several lines inside their brackets.

```truscript
names = [
    "Ann",
    "Bo",
    "Cy",
]

limits = {
    min = 0,
    max = 10,
}

biggest = math.max(
    limits.min,
    limits.max
)

print(names.length)   # prints 3
print(biggest)        # prints 10
```

It prints `3`, then `10`.

> [!WARNING]
> If you indent the continuation lines and close the bracket at the end of an indented line, the script fails to compile. Put the closing bracket on its own line, lined up with the start of the statement.

## Names

A name starts with a letter or an underscore. After the first character it may contain letters, digits and underscores. Names are case-sensitive: `count`, `Count` and `COUNT` are three different names.

These 26 words have a fixed meaning and cannot be used as names: `and`, `break`, `catch`, `continue`, `elif`, `else`, `expr`, `extends`, `false`, `finally`, `for`, `func`, `if`, `in`, `local`, `new`, `nil`, `not`, `or`, `pass`, `return`, `throw`, `true`, `try`, `while` and `yield`.

Functions and libraries such as [print](api:global/print), [range](api:global/range), [wait](api:global/wait), [math](api:global/math), [string](api:global/string) and [table](api:global/table), and the script globals [this](api:global/this), [game](api:global/game) and [world](api:global/world), are ordinary names that already hold a value when your script starts, not reserved words, so a script can assign something else to them. A global assignment can overwrite one of them; see [this, game and world](../scripting/this-game-world.md#the-other-names-a-script-starts-with).

Engine classes, properties, methods and signals use `PascalCase`: [Part](api:Part), [Anchored](api:PhysicsInstance.Anchored), [FindFirstChild](api:Instance.FindFirstChild), [Touched](api:PhysicsInstance.Touched).

## Troubleshooting

| What you see | Fix |
|---|---|
| The script does not run, and the error says a `:` was expected after a statement: `Expected ':' after if statement, got newline` | Add the colon. See [Blocks and indentation](#blocks-and-indentation). |
| The script does not run, and the error says an indented block was expected after a statement: `Expected indented block after if statement, got 'print'` | Indent the body, or write `pass` if the body should be empty. See [Empty and one-line blocks](#empty-and-one-line-blocks). |
