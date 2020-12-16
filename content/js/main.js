const { jsPDF } = window.jspdf;
const doc = new jsPDF();
doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");

url = "http://ec2-3-17-77-133.us-east-2.compute.amazonaws.com:8000/"


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    var cookie = cname + "=" + cvalue + ";" + expires + "; Path=/;"
    console.log(cookie)
    document.cookie = cookie;
  }


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function addAuthTokenCookie(data) {
    console.log(data)
    token = data.token
    console.log('adding csrf token cookie to document')
    setCookie("csrftoken", token, 7);

  }

function deleteCsrfToken(){
    document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }


V = {
    urlData: "", // Global değişkenler
    ajaxType: "",
    key: 0,
    gameStatus: url + "gameStatus/",
    makeMove: url + "makeMove/",
    cancelMove: url + "cancelLastMove/",
    deleteCard: url + "dropCardOwner/", // TODO: kullanimda url sonuna silinecek kartin idsi eklenmeli orn" += "13/"
    getToken: url + 'api-token-auth/',
    NumberColumn: "",
    cardColor: "",
    cardID: "",
    winnerText: "",
    isBirinciCinko: "",
    isIkinciCinko: "",
    isTombala: "",

    init: function () {
        V.global();
        V.bingo.init();
        V.forms.init();
    },

    ajaxRequest: function (baseUrl, requestType, sentData = null) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl,
                cache: true,
                //crossDomain: true,
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", "Token " + getCookie('csrftoken'));
                  },
                type: requestType,
                data: ((sentData != null && requestType != "GET") ? sentData : (sentData != null && requestType == "GET") ? sentData : null),
                dataType: "json",
                /*contentType: "application/json",*/
                success: function (response) {
                    resolve(response)
                },
                error: function (error) {
                    console.log(error)
                    reject(error)
                },
            })
        })
    },
    

    getNumberColumn: function (NumberColumn) {
        let returnColumn = Math.floor((NumberColumn + 9) / 10);
        return returnColumn;
    },

    createCard: function (cardID, cardColor, winnerText,cinkoNo) {
        let content = "<p style=\"display:none\" id=\"user" + cardID + "\" class=\"winner-name "+cinkoNo+"\">" + winnerText + "<\/p>\r\n<ul id=\"user" + cardID + "\" class=\""+cinkoNo+" t-card " + cardColor + "\">\r\n<li id=\"column1\">\r\n<div id=\"A1\"><\/div>\r\n<div id=\"B1\"><\/div>\r\n<div id=\"C1\"><\/div>\r\n<\/li>\r\n<li id=\"column2\">\r\n<div id=\"A2\"><\/div>\r\n<div id=\"B2\"><\/div>\r\n<div id=\"C2\"><\/div>\r\n<\/li>\r\n<li id=\"column3\">\r\n<div id=\"A3\"><\/div>\r\n<div id=\"B3\"><\/div>\r\n<div id=\"C3\"><\/div>\r\n<\/li>\r\n<li id=\"column4\">\r\n<div id=\"A4\"><\/div>\r\n<div id=\"B4\"><\/div>\r\n<div id=\"C4\"><\/div>\r\n<\/li>\r\n<li id=\"column5\">\r\n<div id=\"A5\"><\/div>\r\n<div id=\"B5\"><\/div>\r\n<div id=\"C5\"><\/div>\r\n<\/li>\r\n<li id=\"column6\">\r\n<div id=\"A6\"><\/div>\r\n<div id=\"B6\"><\/div>\r\n<div id=\"C6\"><\/div>\r\n<\/li>\r\n<li id=\"column7\">\r\n<div id=\"A7\"><\/div>\r\n<div id=\"B7\"><\/div>\r\n<div id=\"C7\"><\/div>\r\n<\/li>\r\n<li id=\"column8\">\r\n<div id=\"A8\"><\/div>\r\n<div id=\"B8\"><\/div>\r\n<div id=\"C8\"><\/div>\r\n<\/li>\r\n<li id=\"column9\">\r\n<div id=\"A9\"><\/div>\r\n<div id=\"B9\"><\/div>\r\n<div id=\"C9\"><\/div>\r\n<\/li>\r\n<\/ul>";

        return content;
    },

    getCinko : function(cinkoArray, UserID, columnLet,pickedNumArray){

        $(eval(cinkoArray)).each(function (index, rowNum) {
            
            number = V.getNumberColumn(rowNum);

            for(i=0; i<10; i++){
                if (number == i) {
                    $("#user" + UserID + " #"+ columnLet + i).text(rowNum);
                    if(pickedNumArray.includes(rowNum) == true){
                    $("#user" + UserID + " #"+ columnLet + i).addClass("picked");
                    }
                }
            }

        });

    },

    global: function () {

        //Notification Menu
        $(".notification .numbers .wrap").click(function () {

            $(".notification .numbers .wrap").removeClass("active");
            $(this).addClass("active");

            var numberID = $(this).attr("id");

            $(".notification .people .wrap").removeClass("active animate__animated animate__faster animate__bounceInDown");
            $(".notification .people " + "#" + numberID).addClass("active animate__animated animate__faster animate__bounceInDown");

        });

        //Ekrana Numaraları yazdırma fonksiyonu
        var numberSelectHTML = "";
        for (i = 1; i < 91; i++) {
            numberSelectHTML += `
        <div class="round ${i}">
        <input type="checkbox" class="picked" name="picked" id="num${i}" value="${i}">
        <label>${i}</label>
        </div>`;
        }
        document.querySelector("#number-select").innerHTML = numberSelectHTML;

        $('input:checkbox').click(function () {
            $('input:checkbox').not(this).prop('checked', false);
        });

        //People Card Open
        $(document).on('click', '.wrap .name a', function () {
            $(".winner-card ul").css("display", "none");
            $(".winner-card p").css("display", "none");
            
            $(".winner-card ul").removeClass("animate__animated animate__flipInX");
            $(".winner-card p").removeClass("animate__animated animate__flipInX");

            $("#post-picked-numbers").css("display", "none");
            $("#post-picked-numbers").removeClass("animate__animated animate__fadeIn");
            $("#go-back").css("display", "none");

            $(".winner-card").css("display", "block");
            $("#close-winner-card").css("display", "block");
            $(".winner-card").addClass("animate__animated animate__lightSpeedInLeft");
            $("#close-winner-card").addClass("animate__animated animate__lightSpeedInLeft");
        });

        $(document).on('click', '.wrap .name a', function () {
            nameID = $(this).attr('id');
            $(".winner-card ul#" + nameID).css("display", "flex");
            $(".winner-card p#" + nameID).css("display", "block");
            $(".winner-card ul#"+ nameID).addClass("animate__animated animate__flipInX");
            $(".winner-card p#"+ nameID).addClass("animate__animated animate__flipInX");

        });

        
        //Winner Card Close
        $("#close-winner-card").click(function () {
            $(".winner-card").css("display", "none");
            $("#close-winner-card").css("display", "none");
            $(".winner-card").removeClass("animate__animated animate__lightSpeedInLeft");
            $("#close-winner-card").removeClass("animate__animated animate__lightSpeedInLeft");

            $("#go-back").css("display", "block");
            $("#post-picked-numbers").css("display", "block");
            $("#post-picked-numbers").addClass("animate__animated animate__fadeIn");

        });


        // Post methodunda gönderilecek değişkenleri burada tanımlıyoruz
        // obj değeri Method olarak GET kullanılacak ise yazılmasına gerek yoktur ajaxRequest("url adresin", 'GET')
        // Dolu mu boş mu kontrolü için, null / undefined / isNaN(değişken adın) veya == ""

    },

    bingo: {
        init: function () {
            V.bingo.setData();
            V.bingo.clickBingo();
            V.bingo.moveBack();
        },
        setData: function () {
            $("#loader_form").addClass("show"); //Loading
            // Post methodunda gönderilecek değişkenleri burada tanımlıyoruz
            // obj değeri Method olarak GET kullanılacak ise yazılmasına gerek yoktur ajaxRequest("url adresin", 'GET')
            // Dolu mu boş mu kontrolü için, null / undefined / isNaN(değişken adın) veya == ""

            V.ajaxRequest(V.gameStatus, 'GET')
                .then((response) => {
                    let data = response;
                    $("input").removeAttr("disabled")
                    // Seçilen Numaralar Disabled Yapılıyor
                    $(eval(data.picked_numbers)).each(function (index, value) {
                        $("#num" + value).prop('disabled', true);
                    });
                    $(data.last_three_moves).each(function (index, value) {
                            $(".last-number .number" + index).text(value);
                    });


                    $(".wrap .num").removeClass("win win2 win-bingo");
                    $(".wrap .name a").removeClass("win win2 win-bingo");
                    confetti.stop();

                    //Puan Tablosu Ad ve Kişi Sayısı Hesaplanan Veriler
                    for (var i = 0; i < Object.keys(data.leader_boards).length; i++) {
                        $(data.leader_boards[i]).each(function (index, value) {

                            var countPeople = Object.keys(data.leader_boards[i]).length;
                            $("#num-to-people-" + i + " .count").text(countPeople + " Kişi");
                            $("#num-to-people-" + i + " .name").append("<a id=\"user" + value.id + "\">" + value.owner + "<\/a>");
                                                      

                            //Birinci Çinko Bildirim
                            if (value.is_birinci_cinko) {
                                     $("ul#user" + value.id).remove();
                                    $("p#user" + value.id).remove();

                                    $("#num-to-people-" + i + " .num").addClass("win");
                                    $("#num-to-people-" + i + " .name #user" + value.id).addClass("win");
                                    $(".winner-card").append(V.createCard(value.id, value.color, value.owner + " Birinci Çinko! Tebrikler","birinci-cinko"));
                                    $(".winner-card ul#user" + value.id).css("display","none");
                                    V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                    V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                    V.getCinko(value.third_row, value.id, "C", data.picked_numbers);
                            }

                            else if (value.is_ikinci_cinko) {
                                $("ul#user" + value.id).remove();
                                $("p#user" + value.id).remove();

                                $("#num-to-people-" + i + " .num").addClass("win2");
                                $("#num-to-people-" + i + " .name #user" + value.id).addClass("win2");
                                $(".winner-card ul#user" + value.id).css("display","none");
                                $(".winner-card").append(V.createCard(value.id, value.color, value.owner + " ikinci Çinko! Tebrikler"),"ikinci-cinko");

                                V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                V.getCinko(value.third_row, value.id, "C", data.picked_numbers);
                            }

                            else if (value.is_tombala) {
                                $("ul#user" + value.id).remove();
                                $("p#user" + value.id).remove();

                                $("#num-to-people-" + i + " .num").addClass("win-bingo");
                                $("#num-to-people-" + i + " .name #user" + value.id).addClass("win-bingo");
                                $(".winner-card ul#user" + value.id).css("display","none");
                                $(".winner-card").append(V.createCard(value.id, value.color, value.owner + " Tombala! Tebrikler"),"tombala");
                                V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                V.getCinko(value.third_row, value.id, "C", data.picked_numbers);

                            }
                            else{
                                $("ul#user" + value.id).remove();
                                $("p#user" + value.id).remove();

                                $(".winner-card").append(V.createCard(value.id, value.color, value.owner ,"userID" + value.id ));
                                V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                V.getCinko(value.third_row, value.id, "C", data.picked_numbers);
                            }

                        });
                    }
                    $("#loader_form").removeClass("show"); //Loading
                })
                .catch((error) => {
                    console.log("error get")
                    console.log(error)
                    $("#loader_form").removeClass("show"); //Loading
                });
        },
        clickBingo: function () {
            $("#isaretle").click(function () {
                $("#loader_form").addClass("show"); //Loading
                let obj = {
                    "number": $('.picked:checked').val(),
                }
                let content = "";
                V.ajaxRequest(V.makeMove, 'POST', obj)
                    .then((response) => {
                        let data = response;
                        // Seçilen Numaralar Disabled Yapılıyor
                        $(eval(data.picked_numbers)).each(function (index, value) {
                            $("#num" + value).prop('disabled', true);
                        });
                        $(data.last_three_moves).each(function (index, value) {
                            $(".last-number .number" + index).text(value);
                         });

                        //Puan Tablosu Ad ve Kişi Sayısı Hesaplanan Veriler
                        $(".wrap .count").empty();
                        $(".wrap .name").empty();
                        if ($(".wrap .count").text() == "") {
                            $(".wrap .count").text("-")
                        }
                        $( ".winner-card" ).empty();

                        $(".wrap .num").removeClass("win win2 win-bingo");
                        $(".wrap .name a").removeClass("win win2 win-bingo");
                        confetti.stop();
                        

                        for (var i = 0; i < Object.keys(data.leader_boards).length; i++) {
                            $(data.leader_boards[i]).each(function (index, value) {
    
                                var countPeople = Object.keys(data.leader_boards[i]).length;
                                $("#num-to-people-" + i + " .count").text(countPeople + " Kişi");
                                $("#num-to-people-" + i + " .name").append("<a id=\"user" + value.id + "\">" + value.owner + "<\/a>");
                               


                             
                                //Birinci Çinko Bildirim
                                if (value.is_birinci_cinko) {
                                    $("ul#user" + value.id).remove();
                                    $("p#user" + value.id).remove();

                                        $("#num-to-people-" + i + " .num").addClass("win");
                                        $("#num-to-people-" + i + " .name #user" + value.id).addClass("win");
                                        $(".winner-card").append(V.createCard(value.id, value.color, value.owner + " Birinci Çinko! Tebrikler","birinci-cinko"));

                                        V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                        V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                        V.getCinko(value.third_row, value.id, "C", data.picked_numbers);
                                        confetti.start();



                                } 
                                else if (value.is_ikinci_cinko) {
                                    $("ul#user" + value.id).remove();
                                    $("p#user" + value.id).remove();

                                    $("#num-to-people-" + i + " .num").addClass("win2");
                                    $("#num-to-people-" + i + " .name #user" + value.id).addClass("win2");
    
                                    
                                    $(".winner-card").append(V.createCard(value.id, value.color, value.owner + " ikinci Çinko! Tebrikler","ikinci-cinko"));
    
                                    V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                    V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                    V.getCinko(value.third_row, value.id, "C", data.picked_numbers);
                                    confetti.start();



                                }
                                else if (value.is_tombala) {
                                    $("ul#user" + value.id).remove();
                                    $("p#user" + value.id).remove();

                                    $("#num-to-people-" + i + " .num").addClass("win-bingo");
                                    $("#num-to-people-" + i + " .name #user" + value.id).addClass("win-bingo");
                                   
                                    $(".winner-card").append(V.createCard(value.id, value.color, value.owner + " Tombala! Tebrikler","tombala"));
                                    V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                    V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                    V.getCinko(value.third_row, value.id, "C", data.picked_numbers);
                                    confetti.start();
                                }
                                else{
                                    $("ul#user" + value.id).remove();
                                    $(".winner-card").append(V.createCard(value.id, value.color, value.owner ,"userID" + value.id ));
                                    V.getCinko(value.first_row, value.id, "A", data.picked_numbers);
                                    V.getCinko(value.second_row, value.id, "B", data.picked_numbers);
                                    V.getCinko(value.third_row, value.id, "C", data.picked_numbers);
                                }
                                
                                  
                            });
                        }
                        $("#loader_form").removeClass("show"); //Loading

                    })
                    .catch((error) => {
                        console.log("post error")
                        console.log(error)
                        $("#loader_form").removeClass("show"); //Loading
                    });

            });
        },
        moveBack: function () {
            $("#loader_form").addClass("show"); //Loading
            $("#go-back").click(function () {
                V.ajaxRequest(V.cancelMove, 'DELETE')
                    .then((response) => {
                        $(".wrap .count").empty();
                        $(".wrap .name").empty();
                        if ($(".wrap .count").text() == "") {
                            $(".wrap .count").text("-")
                        }
                        $(".wrap .num").removeClass("win win2 win-bingo");
                        $(".wrap .name a").removeClass("win win2 win-bingo");
                        $( ".winner-card" ).empty();
                        $("#loader_form").removeClass("show"); //Loading
                        V.bingo.setData();

                    })
                    .catch((error) => {
                        console.log("error get")
                        $("#loader_form").removeClass("show"); //Loading
                    });
            });

        }

    },

    forms: {
        init: function () {
            V.forms.inputMasks();
        },

        inputMasks: function () {

        },
    },
};

$(document).ready(function () {
    console.log('initial cookie: ' + getCookie("csrftoken"))

    var csrftoken = getCookie("csrftoken")

    if (csrftoken.length == 0){
        console.log('undef token')
        console.log('getting a csrf token')
        data = {'username':'hakan', 'password':'pa'}
        $.ajax({
            type: "POST",
            url: V.getToken,
            data: data,
            success: addAuthTokenCookie,
            dataType: "JSON",
            async: false
        });
    }
    V.init();
});

$(window).on('load', function () {
    
    // console.log('cookie: ' + document.cookie)
    


});