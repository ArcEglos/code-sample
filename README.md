# Code sample context

## Origin

This is a copy of a code challenge that I did in the context of a technical interview cycle.
The challenge already included a pre-built setup to extend. You can read the content of the
setup and challenge below the tripple line and in [CHALLENGE.md](./CHALLENGE.md). The initial
commit is code that was not written by me.

## Change descriptions

In the code challenge I did the three tasks in individual branches that were then merged
using PRs. This structure could not be copied over here. Instead, I added three markdown
files that include the descriptions of the PRs that I initially wrote for the challenge:

1. [Task 1](./docs/task-1.md)
2. [Task 2](./docs/task-2.md)
3. [Task 3](./docs/task-3.md)

Also, each PR consisted of multiple commits that were squashed on merge. You can see the
changes in each PR in the commit on the main branch with the respective task number in the
commit message.

## Timeframe

This code challenge was done over the course of a Saturday and Sunday, working on it
intermittently.

---
---
---

# ¡Space·Rockets! app

### [👉 Go to the challenge 👈](./CHALLENGE.md)

## Develop

> You'll need [Node >=16](https://nodejs.org/en/) and
> [Yarn v1](https://classic.yarnpkg.com/en/) installed

- run `yarn` to install dependencies
- run `yarn start` to start development environment

## Build

> You'll need [Node >=16](https://nodejs.org/en/) and
> [Yarn v1](https://classic.yarnpkg.com/en/) installed

- run `yarn` to install dependencies
- run `yarn build` to build app for production
- output is in `build` directory,
  [ready to be deployed](https://create-react-app.dev/docs/deployment/)

## Data

All data is fetched from the unofficial SpaceX API V3 at
[spacexdata.com](https://docs.spacexdata.com/?version=latest).

## Technologies

> This project was bootstrapped with
> [Create React App](https://github.com/facebook/create-react-app). You can
> learn more in the
> [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

- [React](https://reactjs.org) - UI library
- [Chakra UI](https://chakra-ui.com) - Design system and component library, with
  [Emotion](https://emotion.sh), its peer dependency
- [SWR](https://swr.vercel.app) - Data fetching and caching library
- [React Router](https://reactrouter.com/docs/en/v6) - routing library
- [React Feathers](https://github.com/feathericons/react-feather) - Icons
  ([Feather icons](https://feathericons.com/) wrapper for React)
- [timeago.js](https://timeago.org/) - Tiny library to display human-readable
  relative time difference
