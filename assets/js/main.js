$(document).ready(function () {
  // Script for Sticky header
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#extra-header").addClass("show");
    } else {
      $("#extra-header").removeClass("show");
    }
  });

  // Script for Offcanvas menu
  $("#offcanvas-trigger").on("click", function () {
    $("#offcanvas").addClass("show");
  });
  $("#close-offcanvas").on("click", function () {
    $("#offcanvas").removeClass("show");
  });

  // Slick Slider activation
  $(".slider-for").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    draggable: false,
    asNavFor: ".slider-nav",
  });
  $(".slider-nav").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    focusOnSelect: true,
  });

  // slider activation for pit
  $(".pit-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: `<button class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" class="bi bi-chevron-left" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
  </svg></button>`,
    nextArrow: `<button class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" class="bi bi-chevron-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg></button>`,
  });

  // Script for Accordion
  var acc = document.getElementsByClassName("course-accordion");
  var i;
  for (i = 0; i < acc.length; i++) {
    //when one of the buttons are clicked run this function
    acc[i].onclick = function () {
      //variables
      var panel = this.nextElementSibling;
      var coursePanel = document.getElementsByClassName("course-panel");
      var courseAccordion = document.getElementsByClassName("course-accordion");
      var courseAccordionActive = document.getElementsByClassName(
        "course-accordion active"
      );

      /*if pannel is already open - minimize*/
      if (panel.style.maxHeight) {
        //minifies current pannel if already open
        panel.style.maxHeight = null;
        //removes the 'active' class as toggle didnt work on browsers minus chrome
        this.classList.remove("active");
      } else {
        //pannel isnt open...
        //goes through the buttons and removes the 'active' css (+ and -)
        for (var ii = 0; ii < courseAccordionActive.length; ii++) {
          courseAccordionActive[ii].classList.remove("active");
        }
        //Goes through and removes 'activ' from the css, also minifies any 'panels' that might be open
        for (var iii = 0; iii < coursePanel.length; iii++) {
          this.classList.remove("active");
          coursePanel[iii].style.maxHeight = null;
        }
        //opens the specified pannel
        panel.style.maxHeight = panel.scrollHeight + "px";
        //adds the 'active' addition to the css.
        this.classList.add("active");
      }
    }; //closing to the acc onclick function
  } //closing to the for loop.
}); // End line
