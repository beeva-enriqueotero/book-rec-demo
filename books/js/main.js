var book_svg='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><path d="M464,64v416H80c-17.672,0-32-14.313-32-32s14.328-32,32-32h352V0H80C44.656,0,16,28.656,16,64v384c0,35.344,28.656,64,64,64 h416V64H464z"/></svg>'
//var requestURL = 'http://localhost:8080';
var requestURL = 'http://54.229.189.82:3000';
var N = 3;
var N_2 = Math.floor((N+1)/2);

var recommendation = {

    init: function(){
        this.books();

        $("#rec").submit(function(e) {
            e.preventDefault();
            recommendation.submit();
        });

        $(".chosen-select").chosen({no_results_text: "Oops, nothing found!"});

	$(window).load(function(){
    function MultiAjaxAutoComplete(element, url) {
     
        $(element).select2({
            initSelection: function(elm, callback) {
              var movies;
              movies = $(elm).data("movies");
              return callback(movies);
            },
            placeholder: "Search for a book",
            minimumInputLength: 2,
            multiple: true,
            ajax: {
                url: url,
                dataType: 'jsonp',
                data: function(term, page) {

                    return {
                        query: term
                    };
                },
                results: function(data, page) {
                    return {
                        results: data.books
                    };
                }
            },
            formatResult: formatMovie,
            formatSelection: formatMovie
        });
    };

    function formatMovie(movie) {
        return movie.t;
    };

 MultiAjaxAutoComplete('#e6', requestURL + '/search');
    $('#save').click(function() {
        //alert($('#e6').val());
    });
});

    },
    books: function(){
        // 2 columns version
        /*for (var i=0; i < N_2; i++){
            $('.col-1').append('<li class="book" data-id="'+i+'">'+book_svg+'<span class="name"></span></li>');
        }
        for (var i=N_2; i < N; i++){
            $('.col-2').append('<li class="book" data-id="'+i+'">'+book_svg+'<span class="name"></span></li>');
        }*/
        // 3 columns version
        var x = 1;
        for (var i=1; i < N+1; i++){
            console.log(".col-"+x)
            $('.col-'+x).append('<li class="book" data-id="'+i+'">'+book_svg+'<span class="name"></span></li>');
            (x%3==0) ? x=1 : x++;
        }
    },
    submit: function(){
        var chosen_book = $("#e6").val();
        console.log(chosen_book);
        var payload = {
            libros: chosen_book.split(','),
            limite : 10,
            tipo : 0,
            familia : 0
        };
	$("#save").html('Wait...').css("cursor", "wait");
	//$('body').addClass('cursor_wait');
	this.reset();
       // var postUrl = "http://54.229.189.82:3000/books/";
       var postUrl = requestURL + "/books/";
        $.ajax({
            type: "POST",
            url: postUrl,
            data: JSON.stringify(payload),
            contentType: "application/json",
            success: function(d) {
		$("#save").html('Go').css("cursor","auto");
                recommendation.reset();
                $("#result").show().children('code').text(JSON.stringify(d, null, 2));
                if (d.result.length){
                    $('.results p').addClass('show');
                }
                // 3 columns version
                var x = 1;
                for (var i=1; i < N+1; i++){
                    console.log(".col-"+x)
                    //ToDo: nth-child index for more than 3 elements
                    var $this_book = $('.col-'+x+' .book:nth-child('+Math.floor(i/x)+')');
                    (x%3==0) ? x=1 : x++;
                    $this_book.find('.name').html(d.result[i-1].t);
                    console.log(d.result[i-1].t)
                    $this_book.addClass('show');
                }
                // 2 columns version
                /*for (var i=0; i < N_2; i++){
                    var $this_book = $('.col-1 .book:nth-child('+(i+1)+')');
                    $this_book.find('.name').html(d.result[i].t);
                    $this_book.addClass('show');
                }
                for (var i=N_2; i < N; i++){
                    var $this_book = $('.col-2 .book:nth-child('+(i-N_2+1)+')');
                    $this_book.find('.name').html(d.result[i].t);
                    $this_book.addClass('show');
                }*/
                Prism.highlightAll();
            }
        });
        return false;
    },
    reset: function(){
        $('.results p').removeClass('show');
        $('.book').removeClass('show');
        $('#result').hide().children('code').text('');
    },

};


$(document).ready(function(){
    recommendation.init();
});
