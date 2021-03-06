$(() => {

  const $main = $('#main-content');

  window.views_manager = {};

  window.views_manager.show = function (item, data = '') {
    $newPropertyForm.detach();
    $propertyListings.detach();
    $searchPropertyForm.detach();
    $logInForm.detach();
    $signUpForm.detach();
    $newReservationForm.detach();
    $updateReservationForm.detach();
    $propertyReviews.detach();

    //if single reservation details from an update exists, detach it
    if ($("#reservation-details")) {
      $("#reservation-details").detach();
    };

    if ($('.new-review')) {
      $('.new-review').detach();
    };

    let dataTag = "";

    switch (item) {
      case 'listings':
        $propertyListings.appendTo($main);
        break;
      case 'newProperty':
        $newPropertyForm.appendTo($main);
        break;
      case 'searchProperty':
        $searchPropertyForm.appendTo($main);
        break;
      case 'logIn':
        $logInForm.appendTo($main);
        break;
      case 'signUp':
        $signUpForm.appendTo($main);
        break;
      case 'newReservation':
        dataTag = `<h4>${data}</h4>`;
        $newReservationForm.appendTo($main);
        $("#datatag").empty();
        $(dataTag).appendTo("#datatag");
        break;
      case 'showReviews':
        getReviewsByProperty(data)
          .then(reviews => propertyReviews.addReviews(reviews));
        $propertyReviews.appendTo($main);
        break;
      case 'newReview':
        dataTag = `<h4>${data}</h4>`;
        $newReviewForm.appendTo($main);
        $("#datatag").empty();
        $(dataTag).appendTo("#datatag");
        break;
      case 'updateReservation':
        // extend data tag with additional information
        dataTag = `
            <span id="datatag-reservation-id">${data.id}</span>
            <span id="datatag-start-date">${data.start_date}</span>
            <span id="datatag-end-date">${data.end_date}</span>
            <span id="datatag-property-id">${data.property_id}</span>
          `
        const reservationDetails = `
            <div id="reservation-details">
              <h3>Reservation Details</h3>
              <h4>Start date: ${moment.utc(data.start_date).format("MMMM DD, YYYY")}</h4>
              <h4>End date: ${moment.utc(data.end_date).format("MMMM DD, YYYY")}</h4>
            </div>
          `
        // display errors
        const errorMessage = data.error_message ? `<h4>${data.error_message}</h4>` : ``;
        $(reservationDetails).appendTo($main);
        $updateReservationForm.appendTo($main);
        //drops previous data tags
        $("#datatag").empty(); 
        $(dataTag).appendTo("#datatag");
        //drops previous error messages
        $('#error-message').empty();
        $(errorMessage).appendTo('#error-message');
        break;
      case 'error': {
        const $error = $(`<p>${arguments[1]}</p>`);
        $error.appendTo('body');
        setTimeout(() => {
          $error.remove();
          views_manager.show('listings');
        }, 2000);

        break;
      }
    }
  };

});