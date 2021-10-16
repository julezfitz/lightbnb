# LightBnB

Welcome to LightBnB, the place to be for all of your BnB related needs. Search listings and reviews publicly, or create a personal account to search listings, make, update and delete reservations and review places you've stayed. If you are a BnB owner, we have you covered - Create your own listings and keep them all organized in a single place.  

This project was created to fulfill my Lighthouse Labs program requirements, and included practicing HTML, CSS, Sass, JS, jQuery and AJAX front-end skills, and Node, Express and PostgreSQL back-end skills.

## Project Structure

```
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
  ├── apiRoutes.js
  ├── database.js
  ├── json
  ├── server.js
  └── userRoutes.js
```

* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `sass` contains all of the sass files. 
* `server` contains all of the server side and database code.
  * `server.js` is the entry point to the application. This connects the routes to the database.
  * `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`. 
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.

## Project Views

### Sign Up View
!["Sign Up View"](https://github.com/julezfitz/lightbnb/blob/main/LightBnB_WebApp-master/docs/Sign-up-view.png)

### Login View
!["Login View"](https://github.com/julezfitz/lightbnb/blob/main/LightBnB_WebApp-master/docs/Login-view.png)

### Search Properties Form View
!["Search Properties Form View"](https://github.com/julezfitz/lightbnb/blob/main/LightBnB_WebApp-master/docs/Search-form-view.png)

### Property Listings View
!["Property Listings View"](https://github.com/julezfitz/lightbnb/blob/main/LightBnB_WebApp-master/docs/Listings-search-view.png)

### My Reservations View
!["My Reservations View"](https://github.com/julezfitz/lightbnb/blob/main/LightBnB_WebApp-master/docs/My-reservations-view.png)

### Review View
!["Review View"](https://github.com/julezfitz/lightbnb/blob/main/LightBnB_WebApp-master/docs/Review-view.png)

## Future Development
Future planned developments and known bugs include the following:
1. Create new listing currently updates the database adding the new listing to the properties table, but does not display the new listing in the user's "My Listings". This will be added.
2. There is no back button while viewing a properties reviews. This will be added
3. Navigation does not indicate the current page the user is on, which makes filling out forms a little confusing at times. Sass and CSS will be used to improve the navigation experience.
4. Tables exist in the datatbase for guest reviews and to assign special property rates, however the web app doesn't currently support this functionality. This will be added. 

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
4. Go to <http://localhost:3000/> in your browser.

## Dependencies

- Express
- Body-parser
- Chance
- md5
- @fortawesome/fontawesome-svg-core
- Node 5.10.x or above
- bcrypt 3.0.6 or above
- cookie-session 1.3.3 or above
- nodemon 1.19.1 or above
- pg 8.7.1 or above
