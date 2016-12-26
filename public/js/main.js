$(function() {
  $('.visibility-toggle').on('click', function() {
    $($(this).data('for')).toggle();
    return false;
  });

  if ($.fn.DataTable) {
    $('.jquery-datatable').DataTable({
      paging: false,
      order: [[1, 'desc']],
      bFilter: false
    });
  }

  $('.search-cta-container').on('click', function() {
    var zip = prompt('Please enter your zipcode', '94043');

    if (zip!= null) {
      window.location.href = '/' + zip + '-schools';
    }
  });
});
