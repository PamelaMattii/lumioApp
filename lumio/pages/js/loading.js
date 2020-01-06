var loading;

function myFunction() {
  loading = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}


var updateScrollPos = function(e) {
    $('html').css('cursor', 'row-resize');
    $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
}




