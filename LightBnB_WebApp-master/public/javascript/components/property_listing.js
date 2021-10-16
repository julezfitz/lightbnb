$(() => {
  window.propertyListing = {};
  
  function createListing(property, isReservation) {
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}"
          onerror="this.onerror=null; this.src='florian-schmidinger-b_79nOqf95I-unsplash.jpg'"
       alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details_list">
          
          <i class="fa fa-solid fa-bed" aria-hidden="true"></i>
          <span>${property.number_of_bedrooms}</span>
          <i class="fa fa-solid fa-bath" aria-hidden="true"></i>
          <span>${property.number_of_bathrooms}</span>
          <i class="fa fa-solid fa-car"></i>
            <span>${property.parking_spaces}</span>
            </ul>

            <div class="property-listing__rate">
            <div class="property-listing__price">$${property.cost_per_night/100.0}</div>
            <div class="property-listing_night">/night</div>
            </div>

          ${isReservation ? 
            `<p>${moment.utc(property.start_date).format('ll')} - ${moment.utc(property.end_date).format('ll')}</p>` : 
            `<button id="reserve-property-${property.id}" class="reserve-button">Reserve</button>`}

          <footer class="property-listing__footer">            
            <div class="rating">
              <span class = ${((Math.round(property.average_rating * 100) / 100) >=0.5) ? 'light-up': 'unlit'}>&#9734;</span>
              <span class = ${((Math.round(property.average_rating * 100) / 100) >=1.5) ? 'light-up': 'unlit'}>&#9734;</span>
              <span class = ${((Math.round(property.average_rating * 100) / 100) >=2.5) ? 'light-up': 'unlit'}>&#9734;</span>
              <span class = ${((Math.round(property.average_rating * 100) / 100) >=3.5) ? 'light-up': 'unlit'}>&#9734;</span>
              <span class = ${((Math.round(property.average_rating * 100) / 100) >=4.5) ? 'light-up': 'unlit'}>&#9734;</span>
              </div>

            ${isReservation.upcoming ? 
              `<div class ="current-res-options"><button id="update-property-${property.id}" class="update-button">Update</button>
                <button id="delete-property-${property.id}" class="delete-button">Delete</button></div>
              ` : ``
            }
            ${(isReservation && !isReservation.upcoming) ? 
              `<button id="add-review-${property.id}" class="add-review-button">Add a Review</button>` : ``
            } 
            ${!isReservation ? `<span id="review-details-${property.id}" class="review_details">
              ${property.review_count} reviews
            </span>` : ``}
          </footer>
        </section>
      </article>
    `
  }

  window.propertyListing.createListing = createListing;

});