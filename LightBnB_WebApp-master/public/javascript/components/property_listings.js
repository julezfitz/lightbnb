$(() => {

  const $propertyListings = $(`
  <section class="property-listings" id="property-listings">
      <p>Loading...</p>
    </section>
  `);
  window.$propertyListings = $propertyListings;

  window.propertyListings = {};

  function addListing(listing) {
    $propertyListings.append(listing);
  }
  function clearListings() {
    $propertyListings.empty();
  }
  window.propertyListings.clearListings = clearListings;

  function addProperties(properties, isReservation = false) {
    // if it's a reservation, we don't want to clear the listings a second time in the addProperties function call
    if (!isReservation) {
      clearListings();
    }
    // check for user login
    getMyDetails()
      .then()
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = propertyListing.createListing(property, isReservation);
      addListing(listing);
    }
    if (isReservation) {
      $('.update-button').on('click', function () {
        const idData = $(this).attr('id').substring(16);
        getIndividualReservation(idData)
        .then(data => {
          views_manager.show("updateReservation", data);
        });
      })
      $('.delete-button').on('click', function () {
        const idData = $(this).attr('id').substring(16);
        $(this).closest('article').remove();
        deleteReservation(idData)
          .then(() => {
            console.log('deleted');
            propertyListings.clearListings();
            return getFulfilledReservations()
            // location.reload(true);
          })
          .then((json) => {
            propertyListings.addProperties(json.reservations, { upcoming: false });
            return getUpcomingReservations()
          })
          .then(json => {
            return propertyListings.addProperties(json.reservations, { upcoming: true });
          })
          .then(() => views_manager.show('listings'))
          .catch(err => console.error(err));
      })
      $('.add-review-button').on('click', function () {
        const idData = $(this).attr('id').substring(11);
        console.log(`clicked review me for ${idData}`);
        views_manager.show("newReview", idData);
      })
    } else {
      $('.reserve-button').on('click', function () {
        const idData = $(this).attr('id').substring(17);
        views_manager.show('newReservation', idData);
      })
      $('.review_details').on('click', function () {
        const idData = $(this).attr('id').substring(15);
        views_manager.show('showReviews', idData);
      })
    }
  }

  window.propertyListings.addProperties = addProperties;

});