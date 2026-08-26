(function ($) {
  "use strict";

  $(document).ready(function () {
    // Set initial home section height based on viewport
    setInitialHomeHeight();

    initHandModeToggle();
    initScrollTopButton();

    // Hide navbar name while hero section is visible
    initNavbarNameVisibility();

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

  function initNavbarNameVisibility() {
    var homeSection = document.getElementById("home");
    var navbarName = document.querySelector(".navbar .name-fluid");
    var navbar = document.querySelector(".navbar");

    if (!homeSection || !navbarName) {
      return;
    }

    function setNameHiddenState(isHidden) {
      navbarName.classList.toggle("nav-name-hidden", isHidden);
      if (navbar) {
        navbar.classList.toggle("nav-controls-hidden", !isHidden);
      }
    }

    function isHomeInView() {
      var rect = homeSection.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }

    // Ensure correct state on first paint.
    setNameHiddenState(isHomeInView());

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          setNameHiddenState(entries[0].isIntersecting);
        },
        { threshold: 0.15 },
      );

      observer.observe(homeSection);
      return;
    }

    // Fallback for older browsers without IntersectionObserver.
    window.addEventListener("scroll", function () {
      setNameHiddenState(isHomeInView());
    });
  }

  function initHandModeToggle() {
    var navbar = document.querySelector(".navbar");
    var toggleButton = document.querySelector("[data-hand-toggle]");
    var offcanvas = document.getElementById("offcanvasNavbar");
    var menuIconUse = document.querySelector(".menu-icon-use");

    if (!navbar || !toggleButton) {
      return;
    }

    var storageKey = "handMode";

    function setHandMode(mode) {
      var isLeftMode = mode === "left";

      navbar.classList.toggle("left-hand-mode", isLeftMode);

      if (offcanvas) {
        offcanvas.classList.toggle("offcanvas-start", isLeftMode);
        offcanvas.classList.toggle("offcanvas-end", !isLeftMode);
      }

      if (menuIconUse) {
        var iconRef = isLeftMode ? "#menu-left" : "#menu";
        menuIconUse.setAttribute("xlink:href", iconRef);
        menuIconUse.setAttribute("href", iconRef);
      }

      toggleButton.setAttribute("aria-pressed", String(isLeftMode));
      toggleButton.setAttribute(
        "aria-label",
        isLeftMode ? "Switch to right-hand mode" : "Switch to left-hand mode",
      );
    }

    var savedMode = localStorage.getItem(storageKey);
    setHandMode(savedMode === "left" ? "left" : "right");

    toggleButton.addEventListener("click", function () {
      var nextMode = navbar.classList.contains("left-hand-mode")
        ? "right"
        : "left";

      setHandMode(nextMode);
      localStorage.setItem(storageKey, nextMode);
    });
  }

  function initScrollTopButton() {
    var scrollTopButton = document.querySelector("[data-scroll-top]");

    if (!scrollTopButton) {
      return;
    }

    scrollTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
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
