[batchess]: https://batchess.yatko.dev

<p align="center">
  <img src="public/logo/batchess_with_bg.svg" height="256" radius="100px">
  <p align="center">
    <sub>
      <i>DISCLAIMER: Work In Progress</i>
    </sub>
  </p>
  <a href="https://batchess.yatko.dev">
    <h1 align="center">
      <b>Batchess</b>
    </h1>
  </a>
  <p align="center">
    <a href="#about">About</a>
    |
    <a href="#development">Development</a>
    |
    <a href="#contributing">Contributing</a>
    |
    <a href="#license">License</a>
  </p>
</p>

# About

Blazingly fast digital carved wood game.

## Tech Stack

[vite]: https://vitejs.dev
[vitest]: https://vitest.dev
[react]: https://reactjs.org
[motion]: https://www.framer.com/motion
[cfpages]: https://pages.cloudflare.com/

- [Vite][vite] + [Vitest][vitest] (build tool and testing framework)
- [React][react] (frontend libray, using only built-in state management)
- [Motion][motion] (animations and dragging support for React)
- [Cloudflare Pages][cfpages] (static file hosting service)

# Development

To develop Batchess you will first need to install
[NodeJS](https://nodejs.org/en/download/).

Next, download the source code and run the following commands in the root
directory of the project:

1. Install dependencies:
   ```
   npm install
   ```
2. Start dev environment:
   ```
   npm run dev
   ```
3. Visit the url shown in the output to view the application.

## Building

Running this command will build the project and output all files to `dist/`:

```
npm run build
```

## Testing

Simply run the following command to run all tests:

```
npm test
```

## Typecheck

I like to run the following command to watch for changes and typecheck
the project:

```
npx tsc --noEmit -w
```

# Contributing

Bug reports and fixes are appreciated as well as ideas or discussions!

However, since this project is a work in progress, please only create pull
requests which link to an issue in this GitHub repo.

Thanks for your comprehension.

# License

MIT
