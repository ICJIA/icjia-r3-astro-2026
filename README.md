# Institute to Innovate (i2i)

The Illinois Criminal Justice Information Authority (ICJIA) has launched a new capacity-building hub for statewide community- based organizations entitled Institute 2 Innovate (i2i). The i2i staff will help organizations strengthen infrastructure, increase sustainability, and address capacity needs. Cohort members will include local organizations that have yet to receive funding from the state of Illinois and ICJIA grantees with capacity constraints.

## Install

```bash
git clonehttps://github.com/ICJIA/icjia-i2i-v2-2024.git
cd icjia-i2i-v2-2024
nvm use
cp .env.sample .env
yarn install
```

> Note: If you don't have `nvm` installed, you can install it with `brew install nvm` or `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`

## Start development server

Start the development server on http://localhost:8000

```bash
yarn dev
```

## Preview

```bash
yarn preview
```

## Manually generate static site and serve locally (port 3000):

```bash
yarn generate:serve
```

> Note: Vercel's 'Serve' must be installed globally: `npm install -g serve`

## Manually run build scripts for a remote API (i.e., a headless CMS such as Strapi)

```bash
yarn scripts
```

## Production

Build the application for production:

```bash
yarn generate
```

_Netlify will automatically deploy the live site when changes are pushed to the master branch._
