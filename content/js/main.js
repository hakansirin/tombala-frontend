url = "https://sirkettombalasi.com:8443/"

V = {
    winAudio: new Audio("content/sound/win.mp3"),
    urlData: "", // Global değişkenler
    ajaxType: "",
    key: 0,
    gameStatus: url + "gameStatus/",
    makeMove: url + "makeMove/",
    cancelMove: url + "cancelLastMove/",
    deleteCard: url + "dropCardOwner/", // TODO: kullanimda url sonuna silinecek kartin idsi eklenmeli orn" += "13/"
    getToken: url + 'api-token-auth/',
    adminGameData: url + "adminGameData/",
    resetGameUrl: url + "deleteAllMoves/",
    gamesUrl: url + "games/",
    generateUrl: url + "generateUrlCsv/",
    cardsUrl: url + "cards/",
    NumberColumn: "",
    cardColor: "",
    cardID: "",
    winnerText: "",
    isBirinciCinko: "",
    isIkinciCinko: "",
    isTombala: "",
    gameID: "",
    gameOwner: "",
    objGame: "",


    init: function () {
        V.AuthToken.init();
        V.global();
        V.admin.init();
        V.bingo.init();
        V.forms.init();
    },

    ajaxRequest: function (baseUrl, requestType, sentData = null, async = false) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl,
                cache: true,
                //crossDomain: true,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Token " + V.AuthToken.getCookie('csrftoken'));
                },
                type: requestType,
                data: ((sentData != null && requestType != "GET") ? sentData : (sentData != null && requestType == "GET") ? sentData : null),
                dataType: "json",
                async: async,
                // contentType: "application/json",
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

    ajaxRequestMultiPart: function (baseUrl, requestType, sentData = null) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl,
                cache: true,
                //crossDomain: true,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Token " + V.AuthToken.getCookie('csrftoken'));
                },
                type: requestType,
                data: ((sentData != null && requestType != "GET") ? sentData : (sentData != null && requestType == "GET") ? sentData : null),
                dataType: "json",
                prossesData: false,
                contentType: "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
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
        <div class="round" id="roundid${i}">
        <input type="checkbox" class="picked" name="picked" id="num${i}" value="${i}">
        <label>${i}</label>
        </div>`;
        }
        if ($('#number-select').length) {
            document.querySelector("#number-select").innerHTML = numberSelectHTML;
        }

        $('#number-select input:checkbox').click(function () {
            $('#number-select input:checkbox').not(this).prop('checked', false);
        });

        //People Card Open
        $(document).on('click', '.wrap .name a', function () {
            cardID = $(this).attr('id');
            $("#loader_form").addClass("show"); //Loading

            $(".winner-card .newCard").css("display", "none");

            $(".admin-screen").css("display", "none");
            $(".admin-screen").removeClass("animate__animated animate__fadeIn");

            $(".game-screen").css("display", "none");
            $(".game-screen").removeClass("animate__animated animate__fadeIn");

            $(".card-screen").css("display", "block");
            $(".card-screen").addClass("animate__animated animate__lightSpeedInLeft");

            //
            cardID = cardID.replace("user", "");

            V.ajaxRequest(V.cardsUrl + cardID + "/", 'GET')
                .then((response) => {
                    console.log("Kart Click")
                    console.log(response)
                    $(".winner-card #cardID" + cardID).remove();

                    $(".winner-card").append(V.bingo.createCard(cardID, response.color, response.owner, "userID" + cardID));

                    V.bingo.getCinko(response.first_row, response.id, "A", V.objGame.picked_numbers);
                    V.bingo.getCinko(response.second_row, response.id, "B", V.objGame.picked_numbers);
                    V.bingo.getCinko(response.third_row, response.id, "C", V.objGame.picked_numbers);
                    
                    $(".winner-card .newcard").css("display", "block");
                    $(".winner-card #cardID" + cardID).addClass("animate__animated animate__flipInX");

                    if(response.is_birinci_cinko){
                        $(".winner-card .winner-name#user" + response.id).text(response.owner + " Birinci Çinko! Tebrikler");
                        $(".winner-card .winner-name#user" + response.id).addClass("birinci-cinko");
                    }
                    if(response.is_ikinci_cinko){
                        $(".winner-card .winner-name#user" + response.id).text(response.owner + " İkinci Çinko! Tebrikler");
                        $(".winner-card .winner-name#user" + response.id).addClass("ikinci-cinko");
                    }
                    if(response.is_tombala){
                        $(".winner-card .winner-name#user" + response.id).text(response.owner + "Tombala! Tebrikler");
                        $(".winner-card .winner-name#user" + response.id).addClass("tombala");
                    }

                    $("#loader_form").removeClass("show"); //Loading
                })
                .catch((error) => {
                    console.log(error)
                });


            $("#loader_form").removeClass("show"); //Loading

        });

        //Winner Card Close
        $("#close-winner-card").click(function () {

            $(".admin-screen").css("display", "none");
            $(".admin-screen").removeClass("animate__animated animate__fadeIn");

            $(".card-screen").css("display", "none");
            $(".card-screen").removeClass("animate__animated animate__lightSpeedInLeft");

            $(".game-screen").css("display", "block");
            $(".game-screen").addClass("animate__animated animate__fadeIn");

        });

        // Open Admin Panel
        $("#yonetim").click(function () {
            $(".game-screen").css("display", "none");
            $(".game-screen").removeClass("animate__animated animate__fadeIn");

            $(".card-screen").css("display", "none");
            $(".card-screen").removeClass("animate__animated animate__lightSpeedInLeft");

            $(".admin-screen").css("display", "block");
            $(".admin-screen").addClass("animate__animated animate__fadeIn");

            $(".round").removeClass("last-number-effect animate__animated animate__heartBeat animate__slower");
        });
        // Admin Panel to game
        $("#turn-game").click(function () {
            $(".admin-screen").css("display", "none");
            $(".admin-screen").removeClass("animate__animated animate__fadeIn");

            $(".card-screen").css("display", "none");
            $(".card-screen").removeClass("animate__animated animate__lightSpeedInLeft");

            $(".game-screen").css("display", "block");
            $(".game-screen").addClass("animate__animated animate__fadeIn");
        });

        //quit
        $("#quit").click(function () {
            document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.replace("/login.html");
        });


    },

    AuthToken: {

        init: function () {
            V.AuthToken.setCookie();
            V.AuthToken.login();

        },

        login: function () {
            $("#login-send").click(function () {
                getUser = $("#user").val();
                getPass = $("#pass").val();
                checkAuth(getUser, getpass);
            });
        },

        checkAuth: function (user, pass) {
            console.log('initial cookie: ' + V.AuthToken.getCookie("csrftoken"))


            var csrftoken = V.AuthToken.getCookie("csrftoken")

            console.log("if before : " + csrftoken)
            if (csrftoken.length == 0) {
                console.log('undef token')
                console.log('getting a csrf token')
                data = {
                    'username': '' + user + '',
                    'password': '' + pass + ''
                }
                $.ajax({
                    type: "POST",
                    url: V.getToken,
                    data: data,
                    success: V.AuthToken.addAuthTokenCookie,
                    dataType: "JSON",
                    async: false
                });
            }

        },

        setCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            var cookie = cname + "=" + cvalue + ";" + expires + "; Path=/;"
            console.log(cookie)
            document.cookie = cookie;
        },

        getCookie: function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        addAuthTokenCookie: function (data) {
            console.log(data)
            token = data.token
            console.log('adding csrf token cookie to document')
            V.AuthToken.setCookie("csrftoken", token, 7);
        },

        deleteCsrfToken: function () {
            document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    },

    bingo: {
        init: function () {
            V.bingo.setData();
            V.bingo.clickBingo();
            V.bingo.moveBack();
            V.bingo.deletePerson();
            V.bingo.resetGame();
            V.bingo.downloadUrls();
        },

        gameStatus:function (response) { 

            let data = response;
            V.objGame = response;
            $("#post-picked-numbers .round input").removeAttr("checked");
            $("input").removeAttr("disabled")
            // Seçilen Numaralar Disabled Yapılıyor
            $(eval(data.picked_numbers)).each(function (index, value) {
                $("#num" + value).prop('disabled', true);
            });
            $(data.last_three_moves).each(function (index, value) {
                $(".last-number .number" + index).text(value);
            });
            //Game Text
            $("#gameText").text(response.game_text);
            //Change Logo
            $(".sirket-logo .logo").html(' <img id="companyLogo" src="' + url + data.logo + '" alt="">')
            //Background Color 
            $("body").addClass(response.background_color);

            //Change BG
            $('#background_color').change(function () {
                $("body").removeClass();
                $("body").addClass($(this).val());
            });

            //Random Button Show
            $("input[name='random_token_select']").attr('checked', response.random_token_select)

            //Random Button Display 
            if (response.random_token_select == true) {
                $("#random-isaretle").removeClass("d-none");
                $("#isaretle").addClass("d-none");
                $("#number-select").addClass("click-block");
                $(".round input[type=checkbox]").prop('checked', false);
            } else {
                $("#random-isaretle").addClass("d-none");
                $("#isaretle").removeClass("d-none");
                $("#number-select").removeClass("click-block");
            }

            $(".round").removeClass("last-number-effect animate__animated animate__heartBeat animate__slower");
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
                        $(".winner-card #cardID" + value.id).remove();

                        $("#num-to-people-" + i + " .num").addClass("win");
                        $("#num-to-people-" + i + " .name #user" + value.id).addClass("win");
                        $(".winner-card").append(V.bingo.createCard(value.id, value.color, value.owner + " Birinci Çinko! Tebrikler", "birinci-cinko"));

                        $(".winner-card .winner-name#" + value.id).text(value.owner + " Birinci Çinko! Tebrikler");
                        $(".winner-card .winner-name#" + value.id).addClass("birinci-cinko");


                    } else if (value.is_ikinci_cinko) {
                        $(".winner-card #cardID" + value.id).remove();

                        $("#num-to-people-" + i + " .num").addClass("win2");
                        $("#num-to-people-" + i + " .name #user" + value.id).addClass("win2");
                        $(".winner-card ul#user" + value.id).css("display", "none");
                        $(".winner-card").append(V.bingo.createCard(value.id, value.color, value.owner + " ikinci Çinko! Tebrikler"), "ikinci-cinko");

                        $(".winner-card .winner-name#" + value.id).text(value.owner + " ikinci Çinko! Tebrikler");
                        $(".winner-card .winner-name#" + value.id).addClass("ikinci-cinko");

                    } else if (value.is_tombala) {
                        $(".winner-card #cardID" + value.id).remove();

                        $("#num-to-people-" + i + " .num").addClass("win-bingo");
                        $("#num-to-people-" + i + " .name #user" + value.id).addClass("win-bingo");
                        $(".winner-card ul#user" + value.id).css("display", "none");
                        $(".winner-card").append(V.bingo.createCard(value.id, value.color, value.owner + " Tombala! Tebrikler"), "tombala");

                        $(".winner-card .winner-name#" + value.id).text(value.owner + "Tombala! Tebrikler");
                        $(".winner-card .winner-name#" + value.id).addClass("tombala");


                    } else {
                       

                    }

                });
            }

            $("#loader_form").removeClass("show"); //Loading

         },

        setData: function () {
            var t0 = performance.now();
            $("#loader_form").addClass("show"); //Loading

            V.ajaxRequest(V.gameStatus, 'GET')
                .then((response) => {
                 
                    V.bingo.gameStatus(response);

                })
                .catch((error) => {
                    console.log("V.bingo.Setdata() - error get")
                    console.log(error)
                    if (error.status == 403) {
                        $("#loader_form").addClass("show");
                        $("#loader_form .error-text").text("Giriş Başarısız. Error! 403");
                        window.location.replace("/login.html");

                    } else if (error.status == 0) {
                        $("#loader_form").addClass("show");
                        $("#loader_form .error-text").text("İnternet Erişimini Kontrol Ediniz! Error: 0");
                        window.location.replace("/login.html");

                    } else {
                        $("#loader_form").addClass("show");
                        $("#loader_form .error-text").text("Giriş Başarısız!");
                        window.location.replace("/login.html");

                    }
                });
        },
        clickBingo: function () {
            $("#isaretle, #random-isaretle").click(function () {
              
                confetti.stop();
                var selectNumber = 0;
                selectNumber = $('.picked:checked').val();
                let obj;
                btnID = $(this).attr("id");
                if (btnID == "isaretle") {
                    if (selectNumber == undefined) {
                        alert("Lütfen bir numara seçiniz!")
                        return $("#loader_form").removeClass("show");
                    }
                    obj = {
                        "number": selectNumber,
                    }
                } else {
                    obj = {
                        //Empty Obj Random Response
                    }
                }
                $('.round input[type=checkbox]').removeAttr('checked');
                V.ajaxRequest(V.makeMove, 'POST', obj)
                    .then((response) => {
                        let data = response;
                        V.objGame = response;
                        // Seçilen Numaralar Disabled Yapılıyor
                        $(eval(data.picked_numbers)).each(function (index, value) {
                            $("#num" + value).prop('disabled', true);
                        });
                        $(data.last_three_moves).each(function (index, value) {
                            if (index == 0) {
                                $(".round").removeClass("last-number-effect animate__animated animate__heartBeat animate__slower");
                                $("#roundid" + value).addClass("last-number-effect animate__animated animate__heartBeat animate__slower");
                                $("#roundid" + value + " input").prop('checked',false)
                                //console.log("#roundid" + value)
                            }
                            $(".last-number .number" + index).text(value);
                        });

                        //Puan Tablosu Ad ve Kişi Sayısı Hesaplanan Veriler
                        $(".wrap .count").empty();
                        $(".wrap .name").empty();
                        if ($(".wrap .count").text() == "") {
                            $(".wrap .count").text("-")
                        }
                        $(".winner-card").empty();

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
                                    $(".winner-card #cardID" + value.id).remove();

                                    $("#num-to-people-" + i + " .num").addClass("win");
                                    $("#num-to-people-" + i + " .name #user" + value.id).addClass("win");
                                    $(".winner-card").append(V.bingo.createCard(value.id, value.color, value.owner + " Birinci Çinko! Tebrikler", "birinci-cinko"));

                                    confetti.start();
                                    V.winAudio.play();



                                } else if (value.is_ikinci_cinko) {
                                    $(".winner-card #cardID" + value.id).remove();

                                    $("#num-to-people-" + i + " .num").addClass("win2");
                                    $("#num-to-people-" + i + " .name #user" + value.id).addClass("win2");

                                    $(".winner-card").append(V.bingo.createCard(value.id, value.color, value.owner + " ikinci Çinko! Tebrikler", "ikinci-cinko"));

                                    confetti.start();
                                    V.winAudio.play();



                                } else if (value.is_tombala) {
                                    $(".winner-card #cardID" + value.id).remove();

                                    $("#num-to-people-" + i + " .num").addClass("win-bingo");
                                    $("#num-to-people-" + i + " .name #user" + value.id).addClass("win-bingo");
                                    $(".winner-card").append(V.bingo.createCard(value.id, value.color, value.owner + " Tombala! Tebrikler", "tombala"));

                                    confetti.start();
                                    V.winAudio.play();

                                } else {
                                   // $("ul#user" + value.id).remove();
                                   // $(".winner-card").append(V.bingo.createCard(value.id, value.color, value.owner, "userID" + value.id));

                                }


                            });
                        }
                    })
                    .catch((error) => {
                        console.log("V.bingo.clickBingo() - post error")
                        console.log(error)
                    });

            });


        },
        moveBack: function () {
            $("#go-back").click(function () {
                $("#loader_form").addClass("show"); //Loading
                V.ajaxRequest(V.cancelMove, 'DELETE')
                    .then((response) => {
                        $("#loader_form").addClass("show"); //Loading
                        $(".round").removeClass("last-number-effect animate__animated animate__heartBeat animate__slower");
                        $(".wrap .count").empty();
                        $(".wrap .name").empty();
                        if ($(".wrap .count").text() == "") {
                            $(".wrap .count").text("-")
                        }
                        $(".wrap .num").removeClass("win win2 win-bingo");
                        $(".wrap .name a").removeClass("win win2 win-bingo");
                        $(".winner-card").empty();
                        $("#loader_form").removeClass("show"); //Loading
                      
                        V.bingo.gameStatus(response);

                    })
                    .catch((error) => {
                        console.log("V.bingo.moveBack() - error get")
                    });
                    $("#loader_form").removeClass("show"); //Loading
            });

        },
        getNumberColumn: function (NumberColumn) {
            let returnColumn = Math.floor((NumberColumn + 9) / 10);
            return returnColumn;
        },
        createCard: function (cardID, cardColor, winnerText, cinkoNo) {
            let content = "<div id=\"cardID" + cardID + "\" class=\"newCard\"><p id=\"user" + cardID + "\" class=\"winner-name " + cinkoNo + "\">" + winnerText + "<\/p>\r\n<ul id=\"user" + cardID + "\" class=\"" + cinkoNo + " t-card " + cardColor + "\">\r\n<li id=\"column1\">\r\n<div id=\"A1\"><\/div>\r\n<div id=\"B1\"><\/div>\r\n<div id=\"C1\"><\/div>\r\n<\/li>\r\n<li id=\"column2\">\r\n<div id=\"A2\"><\/div>\r\n<div id=\"B2\"><\/div>\r\n<div id=\"C2\"><\/div>\r\n<\/li>\r\n<li id=\"column3\">\r\n<div id=\"A3\"><\/div>\r\n<div id=\"B3\"><\/div>\r\n<div id=\"C3\"><\/div>\r\n<\/li>\r\n<li id=\"column4\">\r\n<div id=\"A4\"><\/div>\r\n<div id=\"B4\"><\/div>\r\n<div id=\"C4\"><\/div>\r\n<\/li>\r\n<li id=\"column5\">\r\n<div id=\"A5\"><\/div>\r\n<div id=\"B5\"><\/div>\r\n<div id=\"C5\"><\/div>\r\n<\/li>\r\n<li id=\"column6\">\r\n<div id=\"A6\"><\/div>\r\n<div id=\"B6\"><\/div>\r\n<div id=\"C6\"><\/div>\r\n<\/li>\r\n<li id=\"column7\">\r\n<div id=\"A7\"><\/div>\r\n<div id=\"B7\"><\/div>\r\n<div id=\"C7\"><\/div>\r\n<\/li>\r\n<li id=\"column8\">\r\n<div id=\"A8\"><\/div>\r\n<div id=\"B8\"><\/div>\r\n<div id=\"C8\"><\/div>\r\n<\/li>\r\n<li id=\"column9\">\r\n<div id=\"A9\"><\/div>\r\n<div id=\"B9\"><\/div>\r\n<div id=\"C9\"><\/div>\r\n<\/li>\r\n<\/ul>  <a id=\"person-delete\" userid=\"" + cardID + "\"  class=\"btn-main\"> Kişiyi Sil<\/a> <\/div>";

            return content;
        },
        getCinko: function (cinkoArray, UserID, columnLet, pickedNumArray) {

            $(eval(cinkoArray)).each(function (index, rowNum) {

                number = V.bingo.getNumberColumn(rowNum);

                for (i = 0; i < 10; i++) {
                    if (number == i) {
                        $("#user" + UserID + " #" + columnLet + i).text(rowNum);
                        if (pickedNumArray.includes(rowNum) == true) {
                            $("#user" + UserID + " #" + columnLet + i).addClass("picked");
                        }
                    }
                }

            });

        },
        deletePerson: function () {

            $(document).on('click', '#person-delete', function () {

                var answer = window.confirm("Kullanıcıyı silmek istediğinize emin misiniz?");
                if (answer) {
                    deleteid = $(this).attr('userid');

                    V.ajaxRequest(V.deleteCard + deleteid + "/", "DELETE")
                        .then(() => {
                            $("#loader_form").addClass("show"); //Loading
                            $(".wrap .count").empty();
                            $(".wrap .name").empty();
                            if ($(".wrap .count").text() == "") {
                                $(".wrap .count").text("-")
                            }
                            $(".wrap .num").removeClass("win win2 win-bingo");
                            $(".wrap .name a").removeClass("win win2 win-bingo");
                            $(".winner-card").empty();



                            $(".admin-screen").css("display", "none");
                            $(".admin-screen").removeClass("animate__animated animate__fadeIn");

                            $(".card-screen").css("display", "none");
                            $(".card-screen").removeClass("animate__animated animate__lightSpeedInLeft");

                            $(".game-screen").css("display", "block");
                            $(".game-screen").addClass("animate__animated animate__fadeIn");
                         
                            //setData-deletePerson

                            V.bingo.gameStatus(response);
                            
                        })
                        .catch((error) => {
                            console.log("V.bingo.Setdata() - error get")
                            console.log(error)

                        });
                }




            });




        },
        resetGame: function () {

            $("#reset-game").click(function () {

                var answer = window.confirm("Oyun geri dönülemez şekilde yeniden başlatılacaktır?");
                if (answer) {
                    $("#loader_form").addClass("show"); //Loading
                    V.ajaxRequest(V.resetGameUrl, "DELETE")
                        .then((response) => {

                            $(".wrap .count").empty();
                            $(".wrap .name").empty();
                            if ($(".wrap .count").text() == "") {
                                $(".wrap .count").text("-")
                            }
                            $(".wrap .num").removeClass("win win2 win-bingo");
                            $(".wrap .name a").removeClass("win win2 win-bingo");
                            $(".winner-card").empty();


                            $(".admin-screen").css("display", "none");
                            $(".admin-screen").removeClass("animate__animated animate__fadeIn");

                            $(".card-screen").css("display", "none");
                            $(".card-screen").removeClass("animate__animated animate__lightSpeedInLeft");

                            $(".game-screen").css("display", "block");
                            $(".game-screen").addClass("animate__animated animate__fadeIn");

                            $(".last-number .num").text("-");

                            V.bingo.setData();
                        })
                        .catch((error) => {
                            console.log("V.bingo.resetGame() - error delete")
                            console.log(error)
                        });
                    $("#loader_form").removeClass("show"); //Loading

                }



            });




        },
        downloadUrls: function () {
            $("#get-links").click(function () {

                // var answer = window.confirm("Oyun geri dÃ¶nÃ¼lemez ÅŸekilde yeniden baÅŸlatÄ±lacaktÄ±r?");
                //(baseUrl, requestType, sentData = null,async=false)
                console.log('ins atcaz')
                V.ajaxRequest(V.generateUrl, "GET")
                    .then((response) => {
                        // TODO: nedense buraya girmiyo amk kodu
                        console.log('satir 660')
                        console.log(response)
                        var blob = new Blob([data]);
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = "file.csv";
                        link.click();
                    })
                    .catch((error) => {
                        console.log("V.bingo.download_urls() - error get")
                        console.log(error)
                        // TODO: ama benden kacar mi yakaladim indirdim valla file i
                        var blob = new Blob([error.responseText]);
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = "file.csv";
                        link.click();
                    });
            });

        }

    },

    admin: {

        init: function () {
            V.admin.getGameData();
            V.admin.saveGameData();

        },

        parseDate: function (date) {
            var dateArray = [];
            year = date.substring(0, 4);
            month = date.substring(5, 7);
            day = date.substring(8, 10);
            hour = date.substring(11, 13);
            minute = date.substring(14, 16);
            second = date.substring(17, 19);
            dateArray = [year, month, day, hour, minute, second];
            return dateArray;
        },
        combDate: function (date) {

            parseDate = V.admin.parseDate(date);


            newFormat = "";
            newFormat += parseDate[0];
            newFormat += "-";
            newFormat += parseDate[1];
            newFormat += "-";
            newFormat += parseDate[2];
            newFormat += "T";
            newFormat += parseDate[3];
            newFormat += ":";
            newFormat += parseDate[4];


            return newFormat;

        },
        getGameData: function () {

            $("#yonetim").click(function () {

                V.ajaxRequest(V.adminGameData, "GET", null, false)
                    .then((response) => {
                        console.log(response)
                      
                        $("textarea[name='game_text']").val(response.game_text);
                        $("textarea[name='register_text']").val(response.register_text);
                        $("input[name='webinar_link']").val(response.webinar_link);
                        $("input[name='disp_webinar_link_dt']").val(V.admin.combDate(response.disp_webinar_link_dt));
                        $("input[name='start_datetime']").val(V.admin.combDate(response.start_datetime));
                        $("select option[value='" + response.background_color + "']").attr("selected", "selected");

                        V.gameOwner = response.owner;
                        V.gameID = response.id;
                        $("input[name='owner']").val(response.owner);

                    })
                    .catch((error) => {
                        console.log("ERROR - company - GET ")
                        console.log(error)
                    });

            });
        },
        saveGameData: function () {

            $("#games-data").submit(function (e) {
                e.preventDefault();
                var formData = new FormData(this);

                if ($('#random_token_select').is(":checked")) {
                    checkBox = true;
                } else {
                    checkBox = false;
                }
                formData.append('random_token_select', checkBox);



                // formData.append('background_color', );
                // console.log($('select[name=background_color] option').filter(':selected').val())

                $.ajax({
                    url: V.gamesUrl + V.gameID + "/",
                    type: 'PUT',
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", "Token " + V.AuthToken.getCookie('csrftoken'));
                    },
                    data: formData,
                    success: function (data) {

                        alert("Başarıyla kaydedildi.");
                        // location.reload();
                        console.log(data)
                        location.reload();

                    },
                    cache: false,
                    contentType: false,
                    processData: false,
                    error: function (error) {
                        console.log(error)
                    }
                });
            });


        },


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
    V.init();
});

$(window).on('load', function () {

    // console.log('cookie: ' + document.cookie)



});