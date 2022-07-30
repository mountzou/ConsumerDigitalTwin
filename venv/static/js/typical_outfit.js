$(document).ready(function() {
    $('#clothing-area').hide();

    $("button").click(function(){
      $("#summer-outfit").removeClass("btn-primary");
      $("#autumn-outfit").removeClass("btn-primary");
      $("#winter-outfit").removeClass("btn-primary");
      $("#spring-outfit").removeClass("btn-primary");
      $("#spring-outfit").addClass("btn-outline-primary");
      $("#winter-outfit").addClass("btn-outline-primary");
      $("#summer-outfit").addClass("btn-outline-primary");
      $("#autumn-outfit").addClass("btn-outline-primary");
    });

    $("#summer-outfit").click(function(){
        $('#clothing-area').show();
        $('#text-outfit').html('Enter your preferences about your Typical Summer Outfit');
        $('#suit-jackets').hide();
        $('#sweaters').hide();
        $('#submit-outfit-text').html('Submit Summer Outfit');
        $("#summer-outfit").removeClass("btn-outline-primary");
        $("#summer-outfit").addClass("btn-primary");
        document.cookie = 'Season=Summer; expires=Sun, 1 Jan 2024 00:00:00 UTC; path=/'
    });

    $("#winter-outfit").click(function(){
        $('#clothing-area').show();
        $('#text-outfit').html('Enter your preferences about your Typical Winter Outfit');
        $('#suit-jackets').show();
        $('#sweaters').show();
        $('#submit-outfit-text').html('Submit Winter Outfit');
        $("#winter-outfit").removeClass("btn-outline-primary");
        $("#winter-outfit").addClass("btn-primary");
        document.cookie = 'Season=Winter; expires=Sun, 1 Jan 2024 00:00:00 UTC; path=/'
    });

    $("#spring-outfit").click(function(){
        $('#clothing-area').show();
        $('#text-outfit').html('Enter your preferences about your Typical Spring Outfit');
        $('#suit-jackets').show();
        $('#sweaters').show();
        $('#submit-outfit-text').html('Submit Spring Outfit');
        $("#spring-outfit").removeClass("btn-outline-primary");
        $("#spring-outfit").addClass("btn-primary");
        document.cookie = 'Season=Spring; expires=Sun, 1 Jan 2024 00:00:00 UTC; path=/'
    });

    $("#autumn-outfit").click(function(){
        $('#clothing-area').show();
        $('#text-outfit').html('Enter your preferences about your Typical Autumn Outfit');
        $('#suit-jackets').show();
        $('#sweaters').show();
        $('#submit-outfit-text').html('Submit Autumn Outfit');
        $("#autumn-outfit").removeClass("btn-outline-primary");
        $("#autumn-outfit").addClass("btn-primary");
        document.cookie = 'Season=Autumn; expires=Sun, 1 Jan 2024 00:00:00 UTC; path=/'
    });

});
