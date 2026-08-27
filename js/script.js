(function ($) {
  "use strict";

  $(document).ready(function () {
    // Set initial home section height based on viewport
    setInitialHomeHeight();

    initHandModeToggle();
    initScrollTopButton();

    // Hide navbar name while hero section is visible
    initNavbarNameVisibility();
    initDevtoPosts();

    // masonoary //

    initIsotope();
    initGithubPortfolio();

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
        transitionDuration: "0.45s",
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

  function initDevtoPosts() {
    var blogContainer = document.getElementById("blog-posts-container");

    if (!blogContainer || !window.fetch) {
      return;
    }

    var username = "binath";
    var apiUrl =
      "https://dev.to/api/articles?username=" +
      encodeURIComponent(username) +
      "&per_page=4";
    var fallbackImages = [
      "images/post-thumb-1.jpg",
      "images/post-thumb-2.jpg",
      "images/post-thumb-3.jpg",
      "images/post-thumb-4.jpg",
    ];

    fetch(apiUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch Dev.to posts");
        }
        return response.json();
      })
      .then(function (posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
          return;
        }

        var topPosts = posts.slice(0, 4);
        var postCardsHtml = topPosts
          .map(function (post, index) {
            var coverImage = post.cover_image || fallbackImages[index % 4];
            var publishedDate = post.published_at
              ? new Date(post.published_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";
            var primaryTag =
              post.tag_list && post.tag_list.length
                ? post.tag_list[0]
                : "Dev.to";

            return (
              '<div class="col-lg-6 p-3">' +
              '<a class="post-item p-3 border rounded-5 d-block text-decoration-none" href="' +
              escapeHtml(post.url) +
              '" target="_blank" rel="noopener noreferrer">' +
              '<div class="row g-md-5">' +
              '<div class="col-lg-5">' +
              '<img src="' +
              escapeHtml(coverImage) +
              '" class="img-fluid rounded-4" alt="' +
              escapeHtml(post.title) +
              '">' +
              "</div>" +
              '<div class="col-lg-7">' +
              '<p class="text-uppercase text-muted mt-3">' +
              escapeHtml(primaryTag) +
              (publishedDate ? " / " + escapeHtml(publishedDate) : "") +
              "</p>" +
              '<h3 class="text-body">' +
              escapeHtml(post.title) +
              "</h3>" +
              "</div>" +
              "</div>" +
              "</a>" +
              "</div>"
            );
          })
          .join("");

        blogContainer.innerHTML = postCardsHtml;
      })
      .catch(function (error) {
        console.warn("Unable to load Dev.to posts:", error);
      });
  }

  function initGithubPortfolio() {
    var portfolioGrid = document.querySelector(".portfolio .grid");
    var filterGroup = document.getElementById("filters");

    if (!portfolioGrid || !window.fetch) {
      return;
    }

    var username = "binathperera";
    var apiUrl =
      "https://api.github.com/users/" +
      encodeURIComponent(username) +
      "/repos?sort=updated&per_page=50&type=public";

    fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub repositories");
        }
        return response.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos) || repos.length === 0) {
          return;
        }

        var primaryRepos = repos.filter(function (repo) {
          return !repo.fork;
        });
        var repoList = primaryRepos.length ? primaryRepos : repos;

        var limits = {
          apps: 6,
          analytics: 6,
          home: 6,
          industry: 6,
        };
        var counts = {
          apps: 0,
          analytics: 0,
          home: 0,
          industry: 0,
        };

        var categorizedRepos = [];

        repoList.forEach(function (repo) {
          var description = (repo.description || "").toLowerCase();
          var topics = Array.isArray(repo.topics) ? repo.topics : [];
          var matchedCategories = getPortfolioCategories(description, topics);

          var availableCategories = matchedCategories.filter(
            function (category) {
              return counts[category] < limits[category];
            },
          );

          if (!availableCategories.length) {
            return;
          }

          availableCategories.forEach(function (category) {
            counts[category] += 1;
          });

          categorizedRepos.push({
            repo: repo,
            categories: availableCategories,
          });
        });

        if (!categorizedRepos.length) {
          return;
        }

        var cardsHtml = categorizedRepos
          .map(function (entry) {
            var repo = entry.repo;
            var categories = entry.categories;
            var language = repo.language || "General";
            var updatedDate = repo.updated_at
              ? new Date(repo.updated_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";
            var description = repo.description || "Public project on GitHub.";
            var categoryClasses = categories.join(" ");

            return (
              '<div class="col mb-4 portfolio-item github-project ' +
              escapeHtml(categoryClasses) +
              '">' +
              '<a href="' +
              escapeHtml(repo.html_url) +
              '" target="_blank" rel="noopener noreferrer" class="card h-100 border rounded-4 text-decoration-none">' +
              '<div class="card-body d-flex flex-column gap-3">' +
              '<p class="text-uppercase text-muted m-0">' +
              escapeHtml(language) +
              (updatedDate ? " / " + escapeHtml(updatedDate) : "") +
              "</p>" +
              '<h5 class="card-title m-0 text-body">' +
              escapeHtml(repo.name) +
              "</h5>" +
              '<p class="card-text text-muted m-0">' +
              escapeHtml(description) +
              "</p>" +
              '<div class="mt-auto d-flex gap-3 text-muted small">' +
              "<span>★ " +
              escapeHtml(repo.stargazers_count) +
              "</span>" +
              "<span>⑂ " +
              escapeHtml(repo.forks_count) +
              "</span>" +
              "</div>" +
              "</div>" +
              "</a>" +
              "</div>"
            );
          })
          .join("");

        portfolioGrid.innerHTML = cardsHtml;

        refreshPortfolioLayout(filterGroup);
      })
      .catch(function (error) {
        console.warn("Unable to load GitHub projects:", error);
      });
  }

  function getPortfolioCategories(description, topics) {
    var normalizedTopics = Array.isArray(topics)
      ? topics.map(function (topic) {
          return normalizeTopicSlug(topic);
        })
      : [];
    var descriptionText = normalizeForKeywordMatch(description || "");

    // Prefer explicit GitHub topics first.
    var categories = getCategoriesFromTopics(normalizedTopics);

    // Fallback to description-based matching if topics are not categorized.
    if (!categories.length) {
      categories = getCategoriesFromText(descriptionText);
    }

    if (!categories.length) {
      categories.push("apps");
    }

    return categories;
  }

  function getCategoriesFromTopics(topics) {
    var categoryMap = {
      app: "apps",
      analytics: "analytics",
      "home-automation": "home",
      "industrial-automation": "industry",
    };
    var categories = [];

    (topics || []).forEach(function (topic) {
      var mappedCategory = categoryMap[topic];
      if (mappedCategory && categories.indexOf(mappedCategory) === -1) {
        categories.push(mappedCategory);
      }
    });

    return categories;
  }

  function getCategoriesFromText(text) {
    var categories = [];

    if (/\bapp\b|\bapps\b|\bapplication\b|\bwebapp\b|\bmobile\b/.test(text)) {
      categories.push("apps");
    }

    if (
      /\banalytic\b|\banalytics\b|\bdata\b|\bdashboard\b|\bvisualization\b/.test(
        text,
      )
    ) {
      categories.push("analytics");
    }

    if (
      /\bhome\b|\bsmart\s+home\b|\bdomotic\b|\bhome\s+automation\b|\bhome\-automation\b/.test(
        text,
      )
    ) {
      categories.push("home");
    }

    if (
      /\bindustrial\b|\bindustry\b|\biiot\b|\bplc\b|\bscada\b|\bfactory\b|\bindustrial\-automation\b/.test(
        text,
      )
    ) {
      categories.push("industry");
    }

    return categories;
  }

  function normalizeForKeywordMatch(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[-_/.]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeTopicSlug(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  }

  function refreshPortfolioLayout(filterGroup) {
    if (!window.jQuery || !jQuery.fn.isotope) {
      return;
    }

    var $grid = jQuery(".grid");

    if (!$grid.length) {
      return;
    }

    if ($grid.data("isotope")) {
      $grid.isotope("reloadItems");
      $grid.isotope({ filter: ".apps", transitionDuration: "0.45s" });

      if (filterGroup) {
        var buttons = filterGroup.querySelectorAll("a");
        buttons.forEach(function (button) {
          button.classList.remove("is-checked");
        });

        var defaultButton = filterGroup.querySelector('a[data-filter=".apps"]');
        if (defaultButton) {
          defaultButton.classList.add("is-checked");
        }
      }

      return;
    }

    $grid.isotope({
      itemSelector: ".portfolio-item",
      transitionDuration: "0.45s",
      filter: ".apps",
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
        "https://script.google.com/macros/s/AKfycbzwXm1lb7phu1AqKcsZf5xDg30auZugaZGr3xQ-La6VmQqXjSBLp2614qmY9PfwZjE/exec";

      $.ajax({
        url: scriptURL,
        method: "POST",
        data: formData,
        dataType: "json",
        success: function (response) {
          responseMessage
            .html(
              '<div class="alert alert-success">Thank you, your message has been received.</div>',
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
          submitBtn.prop("disabled", false).text("Send");
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
