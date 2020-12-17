url = "http://ec2-3-17-77-133.us-east-2.compute.amazonaws.com:8000/"

V = {
    urlData: "", // Global değişkenler
    ajaxType: "",
    validateUrl: "validateUrl/",
    cardUrl: "cards/",
    gamersUrl: "gamers/",
    key: 0,
    getHash: "",
    newCardID: "",
    newCard: "",
    GamersID: "",
    GamersURLID: "",
    newFirstRow: "",
    newSecondRow: "",
    newThirdRow: "",
    colorIndex: 0,
    currentColor: "red",

    init: function () {
        V.global();
        V.buttons.init();
        V.register.init();
        V.forms.init();
    },

    ajaxRequest: function (baseUrl, requestType, asyncBool, sentData = null) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl,
                cache: true,
                type: requestType,
                data: ((sentData != null && requestType != "GET") ? sentData : (sentData != null && requestType == "GET") ? sentData : null),
                dataType: "json",
                async: asyncBool,
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
        $("#loader_form").addClass("show")



    },

    buttons: {

        init: function () {
            V.buttons.clickBtn();
        },

        clickBtn: function () {
            $("#change-card").click(function () {
                $("#loader_form").addClass("show")
                V.register.newCard();
                $("#loader_form").removeClass("show")
            });

            $("#change-color").click(function () {
                tcardID = $('.t-card').attr('id');
                color = ["blue", "yellow", "green", "pink", "darkblue", "red"]


                $('.t-card').removeAttr('class').attr('class', '');
                $("#" + tcardID).addClass('t-card ' + color[V.colorIndex]);

                V.currentColor = color[V.colorIndex];

                if (V.colorIndex == 5) {
                    V.colorIndex = 0;
                }
                V.colorIndex += 1;

            });

            $(document).on('click', '#download-pdf', function () {
                var element = document.getElementById('card-wrap');
                html2pdf(element);
            });

           
        }


    },

    register: {

        init: function () {
            V.register.checkValidateUrl(location.search);
            V.register.registerData();
        },

        registerData: function () {
            $("#send-register").click(function () {

                getEmail = $("input#email").val();
                getName = $("input#name").val();
                getSurname = $("input#surname").val();

                // if (getEmail.includes != "@" || getEmail.length == 0) {
                //     $("label#email").html("Lütfen Uygun bir E-Posta Adresi Giriniz!");
                //     $("label#email").css("color", "red");
                // }
                // if (getName.length <= 2) {
                //     $("label#name").html("Gerçek bir isim giriniz!");
                //     $("label#name").css("color", "red");
                // }
                // if (getSurname.length <= 1) {
                //     $("label#surname").html("Gerçek bir Soyisim giriniz!");
                //     $("label#surname").css("color", "red");
                // } 

                    console.log(getName, getSurname, getEmail, V.GamersURLID, V.register.getValidateKey(location.search), V.newCard);


                    V.register.newGamer(getName, getSurname, getEmail, V.GamersURLID, V.register.getValidateKey(location.search), V.newCard);


            });
        },

        getValidateKey: function (url) {
            validateKey = "";
            validateKey = url.replace("key", "");
            validateKey = validateKey.replace("?", "");
            validateKey = validateKey.replace("=", "");

            return validateKey;
        },

        parseDate: function (date) {
            var dateArray = [];
            year = date.substring(0, 4);
            month = date.substring(5, 7);
            day = date.substring(8, 10);
            hour = date.substring(11, 13);
            minute = date.substring(14, 16);
            second = date.substring(17, 19);

            V.register.countdown(year, month, day, hour, minute, second);
            return dateArray = [year, month, day, hour, minute, second];
        },

        newCard: function () {

            V.ajaxRequest(url + V.cardUrl, "POST", false)
                .then((response) => {

                    console.log("newCARD()");
                    console.log(response);

                    $(".card-wrap").html(V.bingo.createCard(V.GamersURLID, "red"));



                    V.bingo.getCinko(JSON.parse(response.first_row), "A");
                    V.bingo.getCinko(JSON.parse(response.second_row), "B");
                    V.bingo.getCinko(JSON.parse(response.third_row), "C");

                    V.newCardID = response.id;
                    V.newCard = response;

                })
                .catch((error) => {
                    console.log("V.register.checkValidateUrl() - error get")
                    console.log(error)
                });
        },

        newGamer: function (name, surname, email, gamer_url, key, cards) {

            console.log("CARD::")
            console.log(cards)

            let obj = {
                "name": name,
                "surname": surname,
                "email": email,
                "gamer_url": gamer_url,
                "key": key,
            }

            V.ajaxRequest(url + V.gamersUrl, "POST", false, obj)
                .then((response) => {
                        console.log("Gamer Post work")
                        console.log(response)

                        V.GamersID = response.id;

                        let obj = {
                            "gamer": V.GamersID,
                            "key": V.register.getValidateKey(location.search),
                            "color": V.currentColor
                        }
                        console.log("Put Object :" + obj)
                        V.ajaxRequest(url + V.cardUrl + V.newCardID + "/", "PUT", false, obj)
                            .then((response) => {

                                location.reload();

                            })
                            .catch((error) => {
                                console.log("Card - PUT ")
                                console.log(error)
                            });
                    }

                )

        },

        checkValidateUrl: function (key) {

            if (V.register.getValidateKey(key).length == 36) {
                V.ajaxRequest(url + V.validateUrl + V.register.getValidateKey(key) + "/", "GET", true)
                    .then((response) => {
                        console.log("success")
                        console.log(response)

                        // Register NO
                        if (response.gamer == null) {
                            // POST - create card
                            $("#form-register").removeClass("d-none");
                            $("#register .button-wrap").removeClass("d-none");
                            $(".form-or-name .text").addClass("d-none");
                            V.GamersURLID = response.id;

                            V.register.newCard();
                        }
                        // Register YES
                        else {
                            $(".form-or-name .text").removeClass("d-none");
                            $("#form-register").addClass("d-none");
                            $("#register .button-wrap").addClass("d-none");
                            $(".card-wrap").html(V.bingo.createCard(response.id, "red"));

                            $(".form-or-name .text").html("Merhaba " + response.gamer.name + " " + response.gamer.surname + ".<br>Kartını indirmek için <a id="+ "download-pdf" +"><span>buraya tıkla</span></a><br>Çekiliş öncesi kartını bastırmayı unutma!")

                            V.bingo.getCinko(JSON.parse(response.gamer.cards[0].first_row), "A");
                            V.bingo.getCinko(JSON.parse(response.gamer.cards[0].second_row), "B");
                            V.bingo.getCinko(JSON.parse(response.gamer.cards[0].third_row), "C");
                        }
                        V.register.parseDate(response.start_datetime);




                        $("#loader_form").removeClass("show");

                        //Loading
                    })
                    .catch((error) => {
                        console.log("V.register.checkValidateUrl() - error get")
                        console.log(error)

                    });
            } else {
                console.log("Wrong KEY!!!")
                $("#loader_form .error-text").text("Lütfen size verilen özel linkten giriş yapınız!");
            }

        },

        countdown: function (year, month, day, hour, minute, second) {
            // Set Launch Date (ms)

            const launchDate = new Date(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second).getTime();

            // Context object
            const c = {
                context: {},
                values: {},
                times: {}
            };

            // Convert radians to degrees
            function deg(d) {
                return (Math.PI / 180) * d - (Math.PI / 180) * 90;
            }

            function render() {
                c.context.seconds.clearRect(0, 0, 200, 200);
                c.context.seconds.beginPath();
                c.context.seconds.strokeStyle = "#fff";
                c.context.seconds.arc(100, 100, 90, deg(0), deg(6 * (60 - c.times.seconds)));
                c.context.seconds.lineWidth = 9;
                c.context.seconds.lineCap = "";
                c.context.seconds.stroke();

                c.context.minutes.clearRect(0, 0, 200, 200);
                c.context.minutes.beginPath();
                c.context.minutes.strokeStyle = "#fff";
                c.context.minutes.arc(100, 100, 90, deg(0), deg(6 * (60 - c.times.minutes)));
                c.context.minutes.lineWidth = 9;
                c.context.minutes.lineCap = "";
                c.context.minutes.stroke();

                c.context.hours.clearRect(0, 0, 200, 200);
                c.context.hours.beginPath();
                c.context.hours.strokeStyle = "#fff";
                c.context.hours.arc(100, 100, 90, deg(0), deg(15 * (24 - c.times.hours)));
                c.context.hours.lineWidth = 9;
                c.context.hours.lineCap = "";
                c.context.hours.stroke();

                c.context.days.clearRect(0, 0, 200, 200);
                c.context.days.beginPath();
                c.context.days.strokeStyle = "#fff";
                c.context.days.arc(100, 100, 90, deg(0), deg(365 - c.times.days));
                c.context.days.lineWidth = 9;
                c.context.days.lineCap = "";
                c.context.days.stroke();
            }

            function init() {
                // Get 2D contexts
                c.context.seconds = document.getElementById('seconds-canvas').getContext('2d');
                c.context.minutes = document.getElementById('minutes-canvas').getContext('2d');
                c.context.hours = document.getElementById('hours-canvas').getContext('2d');
                c.context.days = document.getElementById('days-canvas').getContext('2d');

                // Get displayed values
                c.values.seconds = document.getElementById('seconds-value');
                c.values.minutes = document.getElementById('minutes-value');
                c.values.hours = document.getElementById('hours-value');
                c.values.days = document.getElementById('days-value');

                setInterval(function () {
                    // Get todays date and time (ms)
                    const now = new Date().getTime();

                    // Get distance from now to launchDate
                    const distance = launchDate - now;

                    // Time calculations
                    c.times.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    c.times.hours = Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    c.times.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    c.times.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    c.values.days.innerText = c.times.days;
                    c.values.hours.innerText = c.times.hours;
                    c.values.minutes.innerText = c.times.minutes;
                    c.values.seconds.innerText = c.times.seconds;

                    render(); // Draw!
                }, 1000);
            }

            init();
        }

    },

    bingo: {
        createCard: function (id, cardColor) {
            let content = "<ul id=\"user" + id + "\"  class=\"t-card " + cardColor + "\">\r\n<li id=\"column1\">\r\n<div id=\"A1\"><\/div>\r\n<div id=\"B1\"><\/div>\r\n<div id=\"C1\"><\/div>\r\n<\/li>\r\n<li id=\"column2\">\r\n<div id=\"A2\"><\/div>\r\n<div id=\"B2\"><\/div>\r\n<div id=\"C2\"><\/div>\r\n<\/li>\r\n<li id=\"column3\">\r\n<div id=\"A3\"><\/div>\r\n<div id=\"B3\"><\/div>\r\n<div id=\"C3\"><\/div>\r\n<\/li>\r\n<li id=\"column4\">\r\n<div id=\"A4\"><\/div>\r\n<div id=\"B4\"><\/div>\r\n<div id=\"C4\"><\/div>\r\n<\/li>\r\n<li id=\"column5\">\r\n<div id=\"A5\"><\/div>\r\n<div id=\"B5\"><\/div>\r\n<div id=\"C5\"><\/div>\r\n<\/li>\r\n<li id=\"column6\">\r\n<div id=\"A6\"><\/div>\r\n<div id=\"B6\"><\/div>\r\n<div id=\"C6\"><\/div>\r\n<\/li>\r\n<li id=\"column7\">\r\n<div id=\"A7\"><\/div>\r\n<div id=\"B7\"><\/div>\r\n<div id=\"C7\"><\/div>\r\n<\/li>\r\n<li id=\"column8\">\r\n<div id=\"A8\"><\/div>\r\n<div id=\"B8\"><\/div>\r\n<div id=\"C8\"><\/div>\r\n<\/li>\r\n<li id=\"column9\">\r\n<div id=\"A9\"><\/div>\r\n<div id=\"B9\"><\/div>\r\n<div id=\"C9\"><\/div>\r\n<\/li>\r\n<\/ul>";

            return content;
        },
        getCinko: function (cinkoArray, columnLet) {

            $(eval(cinkoArray)).each(function (index, rowNum) {

                number = V.bingo.getNumberColumn(rowNum);

                for (i = 0; i < 10; i++) {
                    if (number == i) {
                        $(" #" + columnLet + i).text(rowNum);
                    }
                }

            });

        },
        getNumberColumn: function (NumberColumn) {
            let returnColumn = Math.floor((NumberColumn + 9) / 10);
            return returnColumn;
        },
    },

    forms: {
        init: function () {
            V.forms.inputMasks();
        },

        inputMasks: function () {
            //Duplicate Form Send Block
            $('form').submit(function () {
                $(this).find('button[type=submit]').prop('disabled', true);
            });

            // Use this Mask github.com/igorescobar/jQuery-Mask-Plugin - jQuery Mask Plugin v1.14.16
            $('.date').mask('00/00/0000');
            $('.time').mask('00:00:00');
            $('.date_time').mask('00/00/0000 00:00:00');
            $('.cep').mask('00000-000');
            $('.phone').mask('(000)-(000)-(0000)');
            $('.phone_with_ddd').mask('(00)-(000)-(000)-(0000)');
            $('.phone_us').mask('(000) 000-0000');
            $('.mixed').mask('AAA 000-S0S');
            $('.cpf').mask('000.000.000-00', {
                reverse: true
            });
            $('.cnpj').mask('00.000.000/0000-00', {
                reverse: true
            });
            $('.money').mask('000.000.000.000.000,00', {
                reverse: true
            });
            $('.money2').mask("#.##0,00", {
                reverse: true
            });
            $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
                translation: {
                    'Z': {
                        pattern: /[0-9]/,
                        optional: true
                    }
                }
            });
            $('.ip_address').mask('099.099.099.099');
            $('.percent').mask('##0,00%', {
                reverse: true
            });
            $('.clear-if-not-match').mask("00/00/0000", {
                clearIfNotMatch: true
            });
            $('.placeholder').mask("00/00/0000", {
                placeholder: "__/__/____"
            });
            $('.fallback').mask("00r00r0000", {
                translation: {
                    'r': {
                        pattern: /[\/]/,
                        fallback: '/'
                    },
                    placeholder: "__/__/____"
                }
            });
            $('.selectonfocus').mask("00/00/0000", {
                selectOnFocus: true
            });
        },
    },
};

$(document).ready(function () {
    V.init();
});

$(window).on('load', function () {

    // console.log('cookie: ' + document.cookie)



});