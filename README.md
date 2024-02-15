[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# ICJIA R3 NUXT 3

## Install

```bash
git clone https://github.com/ICJIA/icjia-r3-v5-nuxt.git
cd icjia-r3-v5-nuxt
nvm use
yarn install
cp .env.sample .env
```

## Development Server

Start the development server on http://localhost:8000

```bash
yarn dev
```

## Preview

```bash
yarn preview
```

## Build & Preview

Locally preview production build (port 3000):

```bash
yarn generate:serve
```

## Production

Build the application for production:

```bash
yarn generate
```

_Netlify will automatically deploy the live site when changes are pushed to the master branch._

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
