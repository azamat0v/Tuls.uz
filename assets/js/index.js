$(".search-bar input")
.focus(function () {
 $(".header").addClass("wide");
 $(".logo").addClass("hidden");
})
.blur(function () {
 $(".header").removeClass("wide");
 $(".logo").removeClass("hidden");
});

$(document).ready(function(){
    $("#search").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#searchitem .col").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });