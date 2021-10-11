const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users
//connect to database
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect()
  .then((client) => {
    console.log('connected');
  })
  .catch(err => {
    console.error(err);
  });

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryParams = [email];
  return pool.query(`SELECT id, name, email, password FROM users WHERE email = $1`, queryParams)
    .then(res => {
      if (res.rows.length < 1) {
        return null;
      }
      console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryParams = [id];

  return pool.query(`SELECT id, name, email, password FROM users WHERE id = $1`, queryParams)
    .then(res => {
      if (res.rows.length < 1) {
        return null;
      }
      return res.rows[0];
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryParams = [];
  queryParams.push(user.name, user.password, user.email);

  return pool.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *;`, queryParams)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryParams = [guest_id, limit];

  return pool.query(`SELECT reservations.*, properties.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = $1 
AND end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT $2;`, queryParams)
    .then(res => {
      return res.rows;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
`;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(parseInt(options.owner_id));
    if (options.city) {
      queryString += `AND owner_id = $${queryParams.length} `;
    } else {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    }
  }

  queryString += `GROUP BY properties.id`;
  let havingAddOns = 0;

  if (options.minimum_rating || options.minimum_price_per_night || options.maximum_price_per_night) {
    queryString += ` HAVING `;
  }

  if (options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    queryString += `avg(property_reviews.rating) >= $${queryParams.length} `;
    havingAddOns += 1;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(parseInt(options.minimum_price_per_night) * 100);
    if (havingAddOns > 0) {
      queryString += `AND `;
    }
    queryString += `properties.cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(parseInt(options.maximum_price_per_night) * 100);
    if (havingAddOns > 0) {
      queryString += `AND `;
    }
    queryString += `properties.cost_per_night <= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
ORDER BY cost_per_night
LIMIT $${queryParams.length};
`;

  return pool.query(queryString, queryParams)
    .then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function (property) {
  const queryParams = [];
  queryParams.push(property.owner_id, property.title, property.description, property.thumbnail_photo_url,
    property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code,
    property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms);

  return pool.query(`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
    cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, 
    number_of_bedrooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`, queryParams)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
exports.addProperty = addProperty;
