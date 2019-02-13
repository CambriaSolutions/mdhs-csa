# mdhs-csa

Customer service automation project for MDHS

# Geocode script

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
