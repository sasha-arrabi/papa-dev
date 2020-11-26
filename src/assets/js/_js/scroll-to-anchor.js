function scrollToAnchor(id){
  var aTag = $("#" + id);
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}
