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
    NumberColumn: "",
    cardColor: "",
    cardID: "",
    winnerText: "",
    isBirinciCinko: "",
    isIkinciCinko: "",
    isTombala: "",

    init: function () {
        V.AuthToken.init();
        V.global();
        V.forms.init();
    },

    ajaxRequest: function (baseUrl, requestType, sentData = null) {
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

    global: function () {


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

                V.AuthToken.checkAuth(getUser, getPass);
            });
        },

        checkAuth: function (user, pass) {
            console.log('initial cookie: ' + V.AuthToken.getCookie("csrftoken"))

            var csrftoken = V.AuthToken.getCookie("csrftoken")
            console.log("if before : " + csrftoken)
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
                dataType: "JSON",
                success: V.AuthToken.addAuthTokenCookie,
                async: false,
                error: function (error) {
                    console.log(error)
                    if (error.status == 400) {
                        $(".error-login").text("Kullanıcı Adı veya Şifre Yanlış! 400");
                    } else {
                        $(".error-login").text("Kullanıcı Adı veya Şifre Yanlış! ERROR: " + error.status);
                    }

                },
            });

        },

        setCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            var cookie = cname + "=" + cvalue + ";" + expires + "; Path=/"
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
            console.log("DATA:" + data)
            token = data.token
            console.log('adding csrf token cookie to document')
            V.AuthToken.setCookie("csrftoken", token, 7);
            console.log("token: " + token)
            window.location.replace("/cekilen-rakamlar.html")

        },

        deleteCsrfToken: function () {
            document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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