# TruWorlds Documentation

This repository holds the source of the guides and code examples on [create.truworlds.com/docs](https://create.truworlds.com/docs).

Anyone can contribute to the guides, examples, and Engine API prose.

## Preview

There's a simple tool that you can use to run the docs site locally. It emulates the reading experience of the TruWorlds create site without any external dependencies or complex build tooling.

```
node scripts/preview.mjs
```

Then open http://localhost:4321/docs/guides. Use `--port 4322` if 4321 is taken. The preview needs no install, renders pages the way the site does, and reloads the browser when a file changes. It differs from the site in two ways: placeholders show as labeled boxes, and a banner at the top of a page lists its problems, starting with everything `validate.mjs` fails on. `api:` links point at the class page on create.truworlds.com.

## Validate

```
node scripts/validate.mjs
node --test "scripts/test/*.test.mjs"
```

## Licenses

- The prose in this project is licensed under CC-BY-4.0, see [LICENSE](LICENSE).
- The code samples in this project are licensed under MIT, see [LICENSE-CODE](LICENSE-CODE).

By opening a pull request you agree that your contribution is licensed the same way.

## Third-party library licenses

- `markdown-it.mjs`: markdown-it 14.1.0, with its dependencies entities 4.5.0, linkify-it 5.0.2, mdurl 2.1.0, punycode.js 2.3.1 and uc.micro 2.1.0
- `yaml.mjs`: yaml 2.6.1

Their licenses are in `scripts/vendor/licenses/`.