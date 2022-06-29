# doctorpricer-web

This is the frontend for DoctorPricer. It's an AngularJS app written a million years ago and adapted over to Webpack at some point.

AngularJS is deprecated. One day if I ever have time I might migrate it to the latest Angular, or rewrite it in something else.

## Dev

Run `npm start`. It'll be served at port `9001`.

If you want to change the API URL to something local, do that in `app.js` at line 40.

## Deploy

`npm run build`

Commit and push to master then run:

`npm run deploy`
