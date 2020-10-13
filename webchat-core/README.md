# webchat-core

### Usage/Props

```
<ChatWindow
    primaryColor="#3bafbf"
    secondaryColor="#000"
    headerColor="#3bafbf"
    title="Test Chat"
    client="Dialogflow"
    clientOptions={options}
    fullscreen={false}
    initialActive={false}
    policyText={privacyPolicy}
    mapConfig={mapConfig}
    activationText={activationText}
    feedbackUrl={feedbackUrl}
  />
```

- `primaryColor` can be any hex or material-ui color (e.g. 'blue', 'red', 'yellow', 'cyan')
- `secondaryColor` can be any hex or material-ui color (e.g. 'blue', 'red', 'yellow', 'cyan')
- `headerColor` can be any hex or material-ui color (e.g. 'blue', 'red', 'yellow', 'cyan')
- `title` can be any string
- `client` can only currently be 'dialogflow'
- `clientOptions` is an object containing URLs for fulfillment APIs:

```
{
eventUrl: 'https://us-central1-webchat-core.cloudfunctions.net/eventRequest',
textUrl: 'https://us-central1-webchat-core.cloudfunctions.net/textRequest',
}
```

- `fullscreen` is whether or not the window is currently fullscreen
- `initialActive` describes whether or not the window is open and active on page load
- `policyText` can be any string
- `mapConfig` an object containing a google maps key and center coordinates

```
{
googleMapsKey: process.env.GOOGLE_MAPS_KEY
centerCoordinates: {
  lat: latitude,
  lng: longitude,
}
}
```

- `feedbackUrl` a URL string of the endpoint to send feedback data to analytics

```feedbackUrl =
  'https://us-central1-webchat-analytics.cloudfunctions.net/storeFeedback'
```

- `activationText` a string message to call out action

```activationText = 'Talk to Gen'

```

### Deployment Process

1. Create an .npmrc file inside of the `chatframe` folder :

```
//registry.npmjs.org/:_authToken=xxx-xxx-xxx-xxx-xxx
```

2. Build the chatframe module from the chatframe folder with `yarn build`
3. Bump version number for chatframe in `package.json`
4. Publish module with `npm publish`

### Function Deployment Process

This project's functions directory is associated with two separate firebase
projects:

1. "webchat-core" serves as the production firebase project
2. "webchat-core-dev" serves as the dev firebase project

Each firebase project is defined as a project aliases with the corresponding project id
in the `.firebaserc` file.

```
{
  "projects": {
    "prod": "webchat-core",
    "dev": "webchat-45a9c"
  }
}
```

To manually define which project to deploy to, run `firebase use *alias_or_project-id* followed by`firebase deploy --only functions`to deploy the whole functions folder, or use the script`deploy-dev`or`deploy-prod`.
