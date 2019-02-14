# mdhs-csa

Customer service automation project for MDHS

## Geocode script

We use [Google's Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) to extract the coordinates needed to populate the map response
with pins of locations. The Geocoding API request has two required parameters.

1. address - the street address we want to geocode
2. key - the application's API [key](https://developers.google.com/maps/documentation/geocoding/get-api-key)

## Running the script

1. Inside the scripts directory, create a .env file with
   `GOOGLE_MAPS_KEY=apikey`
2. Inside of the `retrieveCoordinates.js` file, populate the `locations` variable with
   and array of addresses.
3. Run `node retrieveCoordinates.js`

## Chatframe Props

```
<ChatWindow
    primaryColor="#3bafbf"
    secondaryColor="#000"
    title="Test Chat"
    client="Dialogflow"
    clientOptions={options}
    fullscreen={false}
    initialActive={false}
    policyText={privacyPolicy}
    googleMapsKey={googleMapsKey}
  />
```

- `primaryColor` can be any hex or material-ui color (e.g. 'blue', 'red', 'yellow', 'cyan')
- `secondaryColor` can be any hex or material-ui color (e.g. 'blue', 'red', 'yellow', 'cyan')
- `title` can be any string
- `client` can only currently be 'dialogflow'
- `clientOptions` is an object containing URLs for fulfillment APIs:

```
{
eventUrl: 'https://us-central1-mdhs-csa-ENVIRONMENT.cloudfunctions.net/eventRequest',
textUrl: 'https://us-central1-mdhs-csa-ENVIRONMENT.cloudfunctions.net/textRequest',
}
```

- `fullscreen` is whether or not the window is currently fullscreen
- `initialActive` describes whether or not the window is open and active on page load
- `policyText` can be any string
- `googleMapsKey` a valid [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial) key, should be stored in a .env file
- `centerCoordinates` is an object containing coordinates for the map payload to center on:

```
const centerCoordinates = {
  lat: 32.777025,
  lng: -89.543724,
}
```
