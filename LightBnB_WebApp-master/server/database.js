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
const getUserWithEmail = function (email) {
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
const getUserWithId = function (id) {
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
const getFulfilledReservations = function (guest_id, limit = 10) {
  const queryParams = [guest_id, limit];

  return pool.query(`SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = $1 
AND end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT $2;`, queryParams)
    .then(res => {
      console.log(res.rows);
      return res.rows;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
exports.getFulfilledReservations = getFulfilledReservations;

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
SELECT properties.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
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

const addReservation = function (reservation) {
  // Adds a reservation from a specific user to the database
  return pool.query(`
    INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `, [reservation.start_date, reservation.end_date, reservation.property_id, reservation.guest_id])
    .then(res => res.rows[0]);
};

exports.addReservation = addReservation;

//
//  Gets upcoming reservations
//
const getUpcomingReservations = function (guest_id, limit = 10) {
  const queryParams = [guest_id, limit];

  return pool.query(`
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, queryParams)
    .then(res => res.rows);
};

exports.getUpcomingReservations = getUpcomingReservations;

//  Updates an existing reservation with new information
const updateReservation = function (newReservationData, reservationId) {
  let queryString = `UPDATE reservations SET `;
  const queryParams = [];

  if (newReservationData.start_date) {
    queryParams.push(newReservationData.start_date);
    queryString += `start_date = $1`;
    if (newReservationData.end_date) {
      queryParams.push(newReservationData.end_date);
      queryString += `, end_date = $2`;
    }
  } else {
    queryParams.push(newReservationData.end_date);
    queryString += `end_date = $1`;
  }
  queryString += ` WHERE id = $${queryParams.length + 1} RETURNING *;`
  queryParams.push(newReservationData.reservation_id);
  console.log(queryString);
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => console.error(err));
};

exports.updateReservation = updateReservation;

//  Deletes an existing reservation
const deleteReservation = function (reservationId) {
  const queryParams = [reservationId];
  const queryString = `DELETE FROM reservations WHERE id = $1`;
  return pool.query(queryString, queryParams)
    .then(() => console.log("Successfully deleted!"))
    .catch(err => console.error(err));
};

exports.deleteReservation = deleteReservation;


// Obtains an individual reservation
const getIndividualReservation = function (reservationId) {
  const queryParams = [reservationId];
  console.log(reservationId);

  return pool.query(`SELECT * FROM reservations WHERE reservations.id = $1`, queryParams)
    .then(res => {
      console.log(res.rows);
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
exports.getIndividualReservation = getIndividualReservation;

//get reviews by property
const getReviewsByProperty = function (propertyId) {
  const queryString = `
   SELECT property_reviews.id, property_reviews.rating AS review_rating, property_reviews.message AS review_text, 
   users.name, properties.title AS property_title, reservations.start_date, reservations.end_date
   FROM property_reviews
   JOIN reservations ON reservations.id = property_reviews.reservation_id  
   JOIN properties ON properties.id = property_reviews.property_id
   JOIN users ON users.id = property_reviews.guest_id
   WHERE properties.id = $1
   ORDER BY reservations.start_date ASC;
 `
  const queryParams = [propertyId];
  return pool.query(queryString, queryParams).then(res => res.rows);
}

const addReview = function (review) {
  console.log('called add review function');
  const queryString = `
    INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [review.guest_id, review.property_id, review.reservationId, parseInt(review.rating), review.message];
  return pool.query(queryString, queryParams).then(res => res.rows)
    .catch(err => {
      console.log(err);
      return null;
    });
}

exports.addReview = addReview;

exports.getReviewsByProperty = getReviewsByProperty;

