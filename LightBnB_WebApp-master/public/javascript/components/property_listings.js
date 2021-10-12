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
    // if it's a reservation, don't clear listings
    if (!isReservation) {
      clearListings();
    }
    // check user login
    getMyDetails()
      .then()
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = propertyListing.createListing(property, isReservation);
      addListing(listing);
    }

    console.log(jQuery('.update-button'));

    if (isReservation) {
      $('.update-button').on('click', function() {
        const idData = $(this).attr('id').substring(16);
        getIndividualReservation(idData).then(data => {
          views_manager.show("updateReservation", data);       
        });
      })
      $('.delete-button').on('click', function() {
        const idData = $(this).attr('id').substring(16);
        console.log(`delete ${idData}`);
      });
    }
  }

  window.propertyListings.addProperties = addProperties;

});