# doctorpricer-web

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Dev

Run `npm run serve` for preview. It'll be served at port `9001`.

If you want to change the API URL to something local then the place to do that is `app/scripts/services/practicescollection.js` at line 82.

## Production

Run `npm run build` to build it. Currently we deploy this by checking out gh-pages then committing the dist folder, which is a bit rubbish so we'll look at improving this in the future.