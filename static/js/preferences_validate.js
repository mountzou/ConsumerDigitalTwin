$("#range_min").change(function() {

  if (parseInt($("#range_min").val()) > parseInt($("#range_max").val())) {
    $('#submit_preferences').prop('disabled', true);
  }
  else {
    $('#submit_preferences').prop('disabled', false);
  }

});

$("#range_max").change(function() {

  if (parseInt($("#range_max").val()) < parseInt($("#range_min").val())) {
    $('#submit_preferences').prop('disabled', true);
  }
  else {
    $('#submit_preferences').prop('disabled', false);
  }

});
