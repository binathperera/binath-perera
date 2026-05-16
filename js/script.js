(function ($) {
  "use strict";

  $(document).ready(function () {
    // Set initial home section height based on viewport
    setInitialHomeHeight();

    // masonoary //

    initIsotope();

    // lightbox

    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      fitImagesInViewport: true,
    });

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
        },
      },
    });
  }); // End of a document ready

  // init Isotope
  var initIsotope = function () {
    $(".grid").each(function () {
      // $('.grid').imagesLoaded( function() {
      // images have loaded
      var $buttonGroup = $(".button-group");
      var $checked = $buttonGroup.find(".is-checked");
      var filterValue = $checked.attr("data-filter");

      var $grid = $(".grid").isotope({
        itemSelector: ".portfolio-item",
        // layoutMode: 'fitRows',
        filter: filterValue,
      });

      // bind filter button click
      $(".button-group").on("click", "a", function (e) {
        e.preventDefault();
        filterValue = $(this).attr("data-filter");
        $grid.isotope({ filter: filterValue });
      });

      // change is-checked class on buttons
      $(".button-group").each(function (i, buttonGroup) {
        $buttonGroup.on("click", "a", function () {
          $buttonGroup.find(".is-checked").removeClass("is-checked");
          $(this).addClass("is-checked");
        });
      });
      // });
    });
  };

  // Function to set initial home height based on viewport
  function setInitialHomeHeight() {
    var viewportHeight = window.innerHeight;
    var headerHeight = 80; // Adjust this if your header height is different
    var paddingHeight = 40; // Total vertical padding (top + bottom) of the banner
    var homeHeight = viewportHeight - headerHeight - paddingHeight;

    // Set the height as fixed pixels
    $(".banner").css("height", homeHeight + "px");
  }

  // Contact form submission to Google Sheets
  $(document).ready(function () {
    $("#contactForm").on("submit", function (e) {
      e.preventDefault();

      var submitBtn = $("#submitBtn");
      var responseMessage = $("#responseMessage");

      // Show loading state
      submitBtn.prop("disabled", true).text("Submitting...");

      // Get form data
      var formData = {
        name: $("#name").val(),
        email: $("#email").val(),
        message: $("#message").val(),
        timestamp: new Date().toISOString(),
        type: "message",
      };

      // Replace this URL with your Google Apps Script web app URL
      var scriptURL =
        "https://script.google.com/macros/s/AKfycbyAyXL5Fy_d-hY8wFPC306VPeONo1UestUJXV2HP--AdJxjf_rHxffFe5li0fZYMytZ/exec";

      $.ajax({
        url: scriptURL,
        method: "POST",
        data: formData,
        dataType: "json",
        success: function (response) {
          responseMessage
            .html(
              '<div class="alert alert-success">Thank you! Your message has been sent successfully.</div>',
            )
            .show();
          $("#contactForm")[0].reset();
        },
        error: function (xhr, status, error) {
          responseMessage
            .html(
              '<div class="alert alert-danger">Sorry, there was an error sending your message. Please try again.</div>',
            )
            .show();
        },
        complete: function () {
          submitBtn.prop("disabled", false).text("Submit");
        },
      });
    });

    // Newsletter Form Handler
    $("#newsletterForm").on("submit", function (e) {
      e.preventDefault();

      var email = $("#newsletterEmail").val().trim();
      var messageDiv = $("#newsletterMessage");
      var subscribeBtn = $("#subscribeBtn");

      if (!email) {
        showMessage(messageDiv, "Please enter a valid email address.", "error");
        return;
      }

      // Show loading state
      subscribeBtn.prop("disabled", true).text("Subscribing...");

      // Prepare newsletter data
      var newsletterData = {
        email: email,
        subscription_date: new Date().toISOString(),
        source: "website",
        type: "subscribe",
      };

      // Replace this URL with your Google Apps Script web app URL for newsletter
      var newsletterScriptURL =
        "https://script.google.com/macros/s/AKfycbyAyXL5Fy_d-hY8wFPC306VPeONo1UestUJXV2HP--AdJxjf_rHxffFe5li0fZYMytZ/exec";

      // Send data to Google Sheets via Google Apps Script
      $.ajax({
        url: newsletterScriptURL,
        method: "POST",
        data: newsletterData,
        dataType: "json",
        success: function (response) {
          showMessage(
            messageDiv,
            "✓ Thank you for subscribing! Check your email for updates.",
            "success",
          );
          $("#newsletterForm")[0].reset();
          $("#newsletterEmail").focus();
        },
        error: function (xhr, status, error) {
          showMessage(
            messageDiv,
            "✗ There was an error. Please try again or check your email format.",
            "error",
          );
          console.error("Newsletter Submission Error:", error);
        },
        complete: function () {
          subscribeBtn.prop("disabled", false).text("Subscribe");
        },
      });
    });

    // Helper function to show messages
    function showMessage(element, message, type) {
      element.removeClass("success error").addClass(type).html(message).show();

      // Auto-hide success message after 5 seconds
      if (type === "success") {
        setTimeout(function () {
          element.fadeOut();
        }, 5000);
      }
    }
  });
})(jQuery);
