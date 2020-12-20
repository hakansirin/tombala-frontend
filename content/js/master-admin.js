url = "http://ec2-3-17-77-133.us-east-2.compute.amazonaws.com:8000/"

V = {
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
    gamesUrl : url + "games/",
    generateUrl:url + "generateUrlCsv/",
    createGameUrl : url + "create_user_and_game/",
    listGameUrl: url + "list_games_with_users/",
    NumberColumn: "",
    cardColor: "",
    cardID: "",
    winnerText: "",
    isBirinciCinko: "",
    isIkinciCinko: "",
    isTombala: "",
    gameID:"",
    gameOwner:"",
    cardlimit:"",

    init: function () {
        V.AuthToken.init();
        V.global();
        V.masterAdmin.init();
    },

    ajaxRequest: function (baseUrl, requestType, sentData = null,async=false) {
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
                async : async,
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
        $("#loader_form").removeClass("show"); //Loading

        $("#create-game-btn").click(function () {

            $("#create-game-btn").css("display", "none");
            $("#game-list-btn").css("display", "block");
            $("footer").css("position", "absolute");


            $(".game-list").css("display", "none");
            $(".game-list").removeClass("animate__animated animate__lightSpeedInLeft");

            $(".game-create").css("display", "block");
            $(".game-create").addClass("animate__animated animate__fadeIn");
        });
        $("#game-list-btn").click(function () {

            $("#create-game-btn").css("display", "block");
            $("#game-list-btn").css("display", "none");
            $("footer").css("position", "relative");

            $(".game-create").css("display", "none");
            $(".game-create").removeClass("animate__animated animate__lightSpeedInLeft");
            
            
            $(".game-list").css("display", "block");
            $(".game-list").addClass("animate__animated animate__fadeIn");
            
        });

        $('#card-limit').change(function(){
            V.cardlimit = $(this).val();
        });

        //quit
        $("#quit").click(function () {
            document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.replace("/admin-login.html");
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

    masterAdmin: {

        init: function () {
            V.masterAdmin.createGame();
            V.masterAdmin.listGame();

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
        createGame:function () {

            $("#create-game").submit(function(e) {
            $("#loader_form").addClass("show"); //Loading

                e.preventDefault();    
                var formData = new FormData(this);
                
                getUser = $("#user").val();
                getPass = $("#pass").val();
                urlCount = $("#url_count").val();


                let obj = {
                    "username":getUser,
                    "password":getPass,
                    "url_count":urlCount,
                    "card_limit_per_url": V.cardlimit
                }

                $.ajax({
                    url: V.createGameUrl,
                    type: 'POST',
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", "Token " + V.AuthToken.getCookie('csrftoken'));
                    },
                    cache: false,
                    dataType: "json",
                    data: obj,
                    success: function (data) {
                    $("#loader_form").removeClass("show"); //Loading

                        alert("Başarıyla kaydedildi.");

                        location.reload();

                    },
                    error: function (error) {
                    console.log(error)
        $("#loader_form").removeClass("show"); //Loading

                }
                });
            });
    
        },
        listGame:function () { 

            V.ajaxRequest(V.listGameUrl,"GET")
            .then((response) => {

                $(".game-list").html("<table id=\"game-list\">\r\n<tr class=\"table100-head\" >\r\n<th>ID<\/th>\r\n<th>Kullanici Adi<\/th>\r\n<th>Sifre<\/th>\r\n<th>Baslama Tarihi<\/th>\r\n<th>Kart Sayisi<\/th>\r\n<th>URL Sayisi<\/th>\r\n<th>Kullanilan Url Sayisi<\/th>\r\n<th>Dağıtılan Kart Sayisi<\/th><\/tr>\r\n<\/table>")

               

                console.log("listGame - Success - Get")
                console.log(response)

                /* 

                */


                $(response.reverse()).each(function (index, value) {
                    console.log(index)
                    
                    $("#game-list tbody").append(`
                    <tr>
                    <td>${value.id}</td>
                    <td>${value.username}</td>
                    <td>${value.password}</td>
                    <td>${value.start_datetime}</td>
                    <td>${value.card_limit_per_url}</td>
                    <td>${value.url_count}</td>
                    <td>${value.used_url_count}</td>
                    <td>${value.distributed_cards_count}</td>

                    </tr>`
                    )
                });


            })
            .catch((error) => {
               console.log("listGame - Error - Get")
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
    V.init();
});

$(window).on('load', function () {

    // console.log('cookie: ' + document.cookie)



});