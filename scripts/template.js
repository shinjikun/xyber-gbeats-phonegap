$(function(){
    $(".trigger-subscribe").click(function() {      
        var content_type = $(this).text();
        var content_title = $(this).parent().parent(".music-item").attr('contenttitle');
        var service_id = $(this).attr("serviceId");
        var service_offering_id = $(this).attr("serviceOffering");
        var price = "P20";
        var frequency = "2x a week";
  
        if (content_type == "MP3") {
            price = "P30";
            frequency = "3x a week";
        }
        else if (content_type == "Caller ringback") {
            price = "P15";
            frequency = "15 days";
        }

        $("#theType").html(content_type);
        $("#oType").html(content_type);
        $("#lepoint").html("3");
        $("#days").html("5");
        $("#price").html(price);
        $("#frequency").html(frequency); 
        $("#songTitle").html(content_title); 
        $(".goLink").attr("sid", service_id);
        $(".goLink").attr("soid", service_offering_id);
    });

    $(".trigger-download").click(function() {
        var content_type = $(this).text();
        var content_title = $(this).parent().parent(".music-item").attr('contenttitle');
        var content_id = $(this).attr("contentId");

        $("#ftmsong").html(content_title);
        $("#leFeatured").attr("href", 'http://' + site_url + '/artistspace/index.php/content/download/');
        $("#leFeatured").attr("rel", "external");
    });

    $(".goLink").click(function test() {
        var service_id = $(this).attr('sid');
        var service_offering_id = $(this).attr('soid');
        var content_title = $("#songTitle").html();
        var content_type = $("#oType").html();

        $.post('/artistspace/index.php/content/subscribe/',
            {
                'service_id'            : service_id,
                'service_offering_id'   : service_offering_id
            },
            function (data) {
               if (data.status == "ok"){
                    var post_download = 'Your ' + content_title + ' by Katy Perry ' + content_type + ' will be delivered shortly.<br><br>';
                        post_download += 'Get more Katy Perry downloads and earn more raffle entries! ';
                        post_download += 'Your raffle entries make you eligible to win an All-Expense Paid Trip for 2 to watch Katy Perry,';
                        post_download += ' Madonna or Coldplay LIVE in concert! Get to see your favorite artist in Singapore, ';
                        post_download += 'Los Angeles or Australia!';
                    $(".lemodal").html(post_download);
               }
            }, "json"
        );
    });

    $('#le-modal .lemodal-header').click(function() {
/*
        var reset_ui = '<h5>Enjoy this <span id="songTitle">song</span> by Katy Perry <span id="theType">music</span> ';
            reset_ui += 'for *FREE and earn <span id="lepoint"></span> points to the Concert Tour Promo!</h5>';
            reset_ui += '<a class="goLink" data-role="button" href="">GET IT NOW</a>';
            reset_ui += '<h6 style="font-style:italic">*Earn more raffle entries with your download as you\'ll be subscribed to the ';
            reset_ui += '<span id="oType">music</span> service, free for <span id="days">days</span> days, after which you will be ';
            reset_ui += 'charged <span id="price">price</span>, <span id="frequency">frequency</span></h6>';
        $(".lemodal").html(reset_ui);
*/

        location.reload();
    });
});
