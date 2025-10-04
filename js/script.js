(function($) {

    "use strict";

    $(document).ready(function() {
      
      // Set initial home section height based on viewport
      setInitialHomeHeight();
      
      // masonoary //

      initIsotope();

      // lightbox

      lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'fitImagesInViewport': true
      })
      
      /* swiper */
      

      var testimonialSwiper = new Swiper(".testimonial-swiper", {
        spaceBetween: 20,
        pagination: {
            el: ".testimonial-swiper-pagination",
            clickable: true,
          },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          800: {
            slidesPerView: 3,
          },
          1400: {
            slidesPerView: 3,
          }
        },
      });

    }); // End of a document ready

  // init Isotope
  var initIsotope = function() {
    
    $('.grid').each(function(){

      // $('.grid').imagesLoaded( function() {
        // images have loaded
        var $buttonGroup = $( '.button-group' );
        var $checked = $buttonGroup.find('.is-checked');
        var filterValue = $checked.attr('data-filter');
  
        var $grid = $('.grid').isotope({
          itemSelector: '.portfolio-item',
          // layoutMode: 'fitRows',
          filter: filterValue
        });
    
        // bind filter button click
        $('.button-group').on( 'click', 'a', function(e) {
          e.preventDefault();
          filterValue = $( this ).attr('data-filter');
          $grid.isotope({ filter: filterValue });
        });
    
        // change is-checked class on buttons
        $('.button-group').each( function( i, buttonGroup ) {
          $buttonGroup.on( 'click', 'a', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });
      // });

    });
  }

  // Function to set initial home height based on viewport
  function setInitialHomeHeight() {
    var viewportHeight = window.innerHeight;
    var headerHeight = 80; // Adjust this if your header height is different
    var paddingHeight = 40; // Total vertical padding (top + bottom) of the banner
    var homeHeight = viewportHeight - headerHeight - paddingHeight;

    // Set the height as fixed pixels
    $('.banner').css('height', homeHeight + 'px');
  }

  // Contact form submission to Google Sheets
  $(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
      e.preventDefault();
      
      var submitBtn = $('#submitBtn');
      var responseMessage = $('#responseMessage');
      
      // Show loading state
      submitBtn.prop('disabled', true).text('Submitting...');
      
      // Get form data
      var formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        message: $('#message').val(),
        timestamp: new Date().toISOString()
      };
      
      // Replace this URL with your Google Apps Script web app URL
      var scriptURL = 'https://script.google.com/macros/s/AKfycbw8OIrMEm9RjQaf117wZEnAutSEmYlW0ngG6M8v0Yrkj1lKq0hyP9ULWLtLQBaCcgSp/exec';
      
      $.ajax({
        url: scriptURL,
        method: 'POST',
        data: formData,
        success: function(response) {
          responseMessage.html('<div class="alert alert-success">Thank you! Your message has been sent successfully.</div>').show();
          $('#contactForm')[0].reset();
        },
        error: function(xhr, status, error) {
          responseMessage.html('<div class="alert alert-danger">Sorry, there was an error sending your message. Please try again.</div>').show();
        },
        complete: function() {
          submitBtn.prop('disabled', false).text('Submit');
        }
      });
    });
  });

})(jQuery);