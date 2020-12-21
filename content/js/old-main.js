$.fn.funcButton = function () {
    //1 
    $(".notification .numbers .wrap").click(function () {

        $(".notification .numbers .wrap").removeClass("active");
        $(this).addClass("active");

        var numberID = $(this).attr("id");

        $(".notification .people .wrap").removeClass("active animate__animated animate__faster animate__bounceInDown");
        $(".notification .people " + "#" + numberID).addClass("active animate__animated animate__faster animate__bounceInDown");

    });
}



//Game.html ->
// Pick Number Create
window.onload = function() {
    var numberSelectHTML ="";
    for(i=1;i<91;i++){
        numberSelectHTML += `
        <div class="round ${i}">
        <input type="checkbox" class="picked" name="picked" id="num${i}" value="${i}">
        <label>${i}</label>
        </div>`;
        }
        document.querySelector("#number-select").innerHTML = numberSelectHTML;

        $(document).ready(function(){
            $('input:checkbox').click(function() {
                $('input:checkbox').not(this).prop('checked', false);
            });
        });
  }


$(document).ready(function () {

    $.fn.funcGetPicked = function () {
            $.ajax({
                url: 'http://ec2-3-17-77-133.us-east-2.compute.amazonaws.com:8000/gameStatus/1/',
                dataType: 'json',
                type: 'GET',
                data: {}, 
                cache: false,
                success: function (data) {
                    // Seçilen Numaralar Disabled Yapılıyor
                    $(eval(data.picked_numbers)).each(function (index, value) {
                        $("#num" + value).prop('disabled', true);
                    });
            
                    //Puan Tablosu Ad ve Kişi Sayısı Hesaplanan Veriler
                    for (var i = 0; i < Object.keys(data.leader_boards).length; i++) {
                        $(data.leader_boards[i]).each(function (index, value) {
            
                            var countPeople = Object.keys(data.leader_boards[i]).length;
                            $("#num-to-people-" + i + " .count").text(countPeople + " Kişi");
                            $("#num-to-people-" + i + " .name").append("<span id=\"user"+ value.id +"\">" + value.owner + "<\/span>");
                            
                            
            
                            
                             //Birinci Çinko Bildirim
                       if ( data.birinci_cinko.length != 0 && data.birinci_cinko[0].owner == value.owner) {
                           $("#num-to-people-" + i + " .num").addClass("win");
                           $("#num-to-people-" + i + " .name #user" + data.birinci_cinko[0].id).addClass("win");
                       }
                       if ( data.ikinci_cinko.length != 0 && data.ikinci_cinko[0].owner == value.owner) {
                         $("#num-to-people-" + i + " .num").removeClass("win");
                         $("#num-to-people-" + i + " .name span").removeClass("win");
                         $("#num-to-people-" + i + " .num").addClass("win2");
                         $("#num-to-people-" + i + " .name #user" + data.ikinci_cinko[0].id).addClass("win2");
                         }
                         if ( data.tombala.length != 0 && data.tombala[0].owner == value.owner) {
                             $("#num-to-people-" + i + " .num").removeClass("win");
                             $("#num-to-people-" + i + " .name span").removeClass("win");
                             $("#num-to-people-" + i + " .num").removeClass("win2");
                             $("#num-to-people-" + i + " .name span").removeClass("win2");
                             $("#num-to-people-" + i + " .num").addClass("win-bingo");
                             $("#num-to-people-" + i + " .name #user" + data.tombala[0].id).addClass("win-bingo");
                             }
                        });
                    }
            
                }
            });
    }
    $().funcGetPicked();
    
    $("#go-back").click(function () {
        $.ajax({
            url: 'http://ec2-3-17-77-133.us-east-2.compute.amazonaws.com:8000/cancelLastMove/1/',
            dataType:'json',
            type: 'delete',
            success: function () {
                location.reload();
            }
        });
    });

  

    $("#isaretle").click(function () {
        var post_picked_number = $('.picked:checked').val();
        $.ajax({
            url: 'http://ec2-3-17-77-133.us-east-2.compute.amazonaws.com:8000/makeMove/1/',
            dataType: 'json',
            type: 'POST',
            data: { 
                number:post_picked_number,
            },
            cache: false,
            success: function (data) {
                // Seçilen Numaralar Disabled Yapılıyor
                $(eval(data.picked_numbers)).each(function (index, value) {
                    $("#num" + value).prop('disabled', true);
                });
        
                //Puan Tablosu Ad ve Kişi Sayısı Hesaplanan Veriler
                $(".wrap .count").empty();
                $(".wrap .name").empty();
                if($(".wrap .count").text() == ""){$(".wrap .count").text("-")}
                    for (var i = 0; i < Object.keys(data.leader_boards).length; i++) {
                        $(data.leader_boards[i]).each(function (index, value) {
                            var countPeople = Object.keys(data.leader_boards[i]).length;
                            $("#num-to-people-" + i + " .count").text(countPeople + " Kişi");
                            $("#num-to-people-" + i + " .name").append("<span> " + value.owner + "</span>");
            
                            
    
                            //Birinci Çinko Bildirim
                                $(".wrap .num").removeClass("win win2 win-bingo");
                                $(".wrap .name span").removeClass("win win2 win-bingo");
                          if ( data.birinci_cinko.length != 0 && data.birinci_cinko[0].owner == value.owner) {
                              $("#num-to-people-" + i + " .num").addClass("win");
                              $("#num-to-people-" + i + " .name #user" + data.birinci_cinko[0].id).addClass("win");
                          }
                          if ( data.ikinci_cinko.length != 0 && data.ikinci_cinko[0].owner == value.owner) {
                            $("#num-to-people-" + i + " .num").removeClass("win");
                            $("#num-to-people-" + i + " .name span").removeClass("win");
                            $("#num-to-people-" + i + " .num").addClass("win2");
                            $("#num-to-people-" + i + " .name #user" + data.ikinci_cinko[0].id).addClass("win2");
                            }
                            if ( data.tombala.length != 0 && data.tombala[0].owner == value.owner) {
                                $("#num-to-people-" + i + " .num").removeClass("win");
                                $("#num-to-people-" + i + " .name span").removeClass("win");
                                $("#num-to-people-" + i + " .num").removeClass("win2");
                                $("#num-to-people-" + i + " .name span").removeClass("win2");
                                $("#num-to-people-" + i + " .num").addClass("win-bingo");
                                $("#num-to-people-" + i + " .name #user" + data.tombala[0].id).addClass("win-bingo");
                                }
                        });
                    }
            
        
            }
        });
    });


  

});




//Func Call Area

$().funcButton();