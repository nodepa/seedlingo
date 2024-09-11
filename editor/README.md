<h1 align="center">Seedlingo Apiary</h1>
<h3 align="center">Content editor for Seedlingo</h3>
<p align="center">
  <img src="../docs/.vuepress/public/images/seedlingo-logo-blue.svg"
    alt="seedlingo-logo" height="160px" width="160px"/>
  <br/>
  <b>Modern mobile multi-language literacy</b>
  <br/>
  <i>A first-language digital learning tool for adults</i>
</p>
<hr>

# Seedlingo Apiary

Seedlingo Apiary is a content editor for the language learning tool [Seedlingo](../README.md).


## Setup

Make sure to install the dependencies:

```sh
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```sh
npm run dev
```

## Production

Build the application for production:

```sh
npm run build
```

Locally preview production build:

```sh
npm run preview
```

## AWS Amplify Setup

1. Sign up for a user at [AWS](https://signin.aws.amazon.com/signup?request_type=register).
2. Navigate to [Amplify](https://console.aws.amazon.com/amplify).
3. Press `Create new app`-button.
4. At `Choose source code provider`, select `Github` and press `Next`.
5. In the popup, log in to Github with credentials that has access to the Seedlingo repo.
6. In the first dropdown, select `nodepa/seedlingo`. In the second dropdown, select `main`. Also check the box for `My app is a monorepo`, then press `Next`.
7. Enter the name of the app, i.e. `Seedlingo Apiary`. Leave the rest at defaults and press `Next`. (The `Frontend build command` and `Build output directory` will be overridden by the content of the `amplify.yml` file anyway, see `Edit YML file` for details/content).
8. Press `Save and deploy`.
9. If deploy fails, hunt for clues under `Deployments`. A log of all the build steps can be found by expanding the `Build` line.
10. If the deploy succeeds, any new git push to the same branch, i.e. `main`, will be picked up and deployed immediately.

## Configure Amplify for local dev

Follow the guide in the [Amplify docs](https://docs.amplify.aws/vue/start/account-setup/).
