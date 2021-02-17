# Contributing to Calenderly

Calenderly needs help. You can help by writing code! Just a couple of things
to follow before you get going!

## Setup
1. Clone this repo and install dependencies (both in the frontend and backend
folders) using `yarn`
2. Copy `.env.example` to `.env` in both directories and modify the variables
as appropriate
3. Create a new branch for whatever feature/fix you are working on
4. Startup the frontend (`yarn start`) and backend (`yarn run dev`)
5. Write *good* code
6. Once done, push your branch and make a PR against the `dev` branch

## Tests
Good code has tests and passes them. A testing suite should be coming soon.
In general, write tests for the code you are producing and be sure to check
those edge cases!

## Linters
To enforce a consistent code style, we've added some linters. Make sure your
code passes all of these strict linting tests before pushing anything. You can
do this with `yarn run eslint ./`. A shorter command _might_ come soon.

We are using the [Airbnb JS style guide](https://github.com/airbnb/javascript)
with ESLint, with a couple of extra rules found in the `.eslintrc.json` files.

To actually run the linter while you are editing, check out the [ESLint
Integrations] (https://eslint.org/docs/user-guide/integrations) page. You
should be able to find your editor here. If not, use one of these editors.
