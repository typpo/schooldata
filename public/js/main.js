$(function() {
  $('.visibility-toggle').on('click', function() {
    $($this.data('for')).toggle();
    return false;
  });

  $('.jquery-datatable').DataTable({
    paging: false,
    order: [[1, 'desc']],
    bFilter: false
  });
});
