url = "https://sirkettombalasi.com:8443/"

V = {
    urlData: "", // Global değişkenler
    ajaxType: "",
    validateUrl: "validateUrl/",
    cardUrl: "cards/",
    gamersUrl: "gamers/",
    multipleCardCreate: url + "create_gamer_and_attach_cards/",
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
    CompanyName: "",
    logo: "",
    register_text: "",
    start_datetime: "",
    webinar_link: "",
    disp_webinar_link_dt: "",
    cardLetter: "",
    card_A_id: "",
    card_B_id: "",
    card_C_id: "",
    card_D_id: "",
    familyData: "",
    card_A_color: "",
    card_B_color: "",
    card_C_color: "",
    card_D_color: "",
    dateDistance: "",
    Key: "",
    colors: ["blue", "yellow", "green", "pink", "darkblue", "red"],
    cardLimit: "",
    isRegister: "",

    init: function () {
        V.global();
        V.game.init();
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

            // Change CARD
            V.buttons.changeCard("A");
            V.buttons.changeCard("B");
            V.buttons.changeCard("C");
            V.buttons.changeCard("D");

            //Change COLOR
            V.buttons.changeColor("A");
            V.buttons.changeColor("B");
            V.buttons.changeColor("C");
            V.buttons.changeColor("D");


            // PDF Download
            $(document).on('click', '#download-pdf', function () {
                var element = document.getElementById('card-wrap');
                html2pdf(element);
            });

            //Family Number Select
            $('#family').change(function () {
                V.familyData = $(this).val();

                if (V.familyData == 1) {
                    $("#card-A").removeClass("d-none");
                    $("#card-B").addClass("d-none");
                    $("#card-C").addClass("d-none");
                    $("#card-D").addClass("d-none");
                    $("#card-name-A").removeClass("d-none");
                    $("#card-name-B").addClass("d-none");
                    $("#card-name-C").addClass("d-none");
                    $("#card-name-D").addClass("d-none");
                }
                if (V.familyData == 2) {
                    $("#card-A").removeClass("d-none");
                    $("#card-B").removeClass("d-none");
                    $("#card-C").addClass("d-none");
                    $("#card-D").addClass("d-none");
                    $("#card-name-A").removeClass("d-none");
                    $("#card-name-B").removeClass("d-none");
                    $("#card-name-C").addClass("d-none");
                    $("#card-name-D").addClass("d-none");
                }
                if (V.familyData == 3) {
                    $("#card-A").removeClass("d-none");
                    $("#card-B").removeClass("d-none");
                    $("#card-C").removeClass("d-none");
                    $("#card-D").addClass("d-none");
                    $("#card-name-A").removeClass("d-none");
                    $("#card-name-B").removeClass("d-none");
                    $("#card-name-C").removeClass("d-none");
                    $("#card-name-D").addClass("d-none");
                }
                if (V.familyData == 4) {
                    $("#card-A").removeClass("d-none");
                    $("#card-B").removeClass("d-none");
                    $("#card-C").removeClass("d-none");
                    $("#card-D").removeClass("d-none");
                    $("#card-name-A").removeClass("d-none");
                    $("#card-name-B").removeClass("d-none");
                    $("#card-name-C").removeClass("d-none");
                    $("#card-name-D").removeClass("d-none");
                }
            });


        },
        changeColor: function (letter) {

            $(document).on('click', "#change-color-" + letter, function () {
                var currentColor = $("#card-" + letter + " ul").attr("class");
                console.log(currentColor)
                currentColor = currentColor.replace("t-card ", "");
                newColor = V.buttons.randomExcet(currentColor);
                if (letter == "A") {
                    V.card_A_color = newColor
                }
                if (letter == "B") {
                    V.card_B_color = newColor
                }
                if (letter == "C") {
                    V.card_C_color = newColor
                }
                if (letter == "D") {
                    V.card_D_color = newColor
                }

                $("#card-" + letter + " ul").removeAttr('class').attr('class', '');
                $("#card-" + letter + " ul").addClass('t-card ' + newColor);

            });



        },

        randomExcet: function (color = NaN) {
            color_set = new Set(V.colors)
            color_set.delete(color)
            rest_colors = Array.from(color_set);
            returnColor = rest_colors[Math.floor(Math.random() * rest_colors.length)];
            return returnColor;
        },

        changeCard: function (letter) {
            $(document).on('click', "#change-card-" + letter, function () {
                dontChangeColor = $("#card-" + letter + " ul").attr('class').replace("t-card", "");
                V.register.newCard(letter, dontChangeColor);
            });
        }

    },

    register: {

        init: function () {
            V.register.checkValidateUrl(location.search);
            V.register.registerData();

        },

        registerData: function () {

            $("#form-register").submit(function (e) {
                e.preventDefault();
                var formData = new FormData(this);

                getEmail = "";
                getName = $("input#name").val();
                getSurname = $("input#surname").val();

                V.register.newGamerWithCard(getName, getSurname, getEmail, V.GamersURLID, V.register.getValidateKey(location.search), V.newCard);

            });

        },

        getValidateKey: function (url) {
            validateKey = "";
            validateKey = url.replace("key", "");
            validateKey = validateKey.replace("?", "");
            validateKey = validateKey.replace("=", "");
            if (validateKey.length > 36) {
                validateKey = validateKey.substring(0, 36);
            }

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


        newCard: function (letter, color) {

            V.ajaxRequest(url + V.cardUrl, "POST", false)
                .then((response) => {

                    console.log("newCARD(" + letter + ")");
                    console.log(response);


                    if (letter == "A") {
                        $("#card-A").html(V.bingo.createCard(V.GamersURLID, color, letter));
                        V.card_A_id = response.id;
                        V.card_A_color = color;
                    }
                    if (letter == "B") {
                        $("#card-B").html(V.bingo.createCard(V.GamersURLID, color, letter));
                        V.card_B_id = response.id;
                        V.card_B_color = color;
                    }
                    if (letter == "C") {
                        $("#card-C").html(V.bingo.createCard(V.GamersURLID, color, letter));
                        V.card_C_id = response.id;
                        V.card_C_color = color;
                    }
                    if (letter == "D") {
                        $("#card-D").html(V.bingo.createCard(V.GamersURLID, color, letter));
                        V.card_D_id = response.id;
                        V.card_D_color = color;
                    }

                    V.bingo.getCinko(JSON.parse(response.first_row), "A", letter);
                    V.bingo.getCinko(JSON.parse(response.second_row), "B", letter);
                    V.bingo.getCinko(JSON.parse(response.third_row), "C", letter);

                    // V.newCardID = response.id;
                    // V.newCard = response;

                })
                .catch((error) => {
                    console.log("V.register.checkValidateUrl() - error get")
                    console.log(error)
                });
        },

        newGamerWithCard: function (name, surname, email, gamer_url, key) {


            card_ids = [V.card_A_id];
            card_colors = ["\"" + V.card_A_color + "\""];
            if (V.familyData > 1) {
                card_ids.push(V.card_B_id);
                card_colors.push("\"" + V.card_B_color + "\"");
            };
            if (V.familyData > 2) {
                card_ids.push(V.card_C_id);
                card_colors.push("\"" + V.card_C_color + "\"");
            };
            if (V.familyData > 3) {
                card_ids.push(V.card_D_id);
                card_colors.push("\"" + V.card_D_color + "\"");
            };

            card_ids = "[" + card_ids.toString() + "]";
            card_colors = "[" + card_colors.toString() + "]";

            console.log("Gamer BEFORE Post Work")
            console.log(card_ids);
            console.log(card_colors);

            let obj = {
                "name": name,
                "surname": surname,
                "email": email,
                "gamer_url": gamer_url,
                "key": key,
                "card_id_list": card_ids,
                "card_color_list": card_colors,
            }

            V.ajaxRequest(V.multipleCardCreate, "POST", false, obj)
                .then((response) => {
                    console.log("Gamer After Post Work")
                    console.log(response)

                    V.isRegister = true;
                    $(".form-or-name .text").removeClass("d-none");
                    $("#form-register").addClass("d-none");
                    $("#register .button-wrap").addClass("d-none");
                    $(".card-wrap div").removeClass("d-none");
                    $("#card-name-A").empty();
                    $("#card-name-B").empty();
                    $("#card-name-C").empty();
                    $("#card-name-D").empty();
                    $("#card-A").empty();
                    $("#card-B").empty();
                    $("#card-C").empty();
                    $("#card-D").empty();



                    $(".form-or-name .text").html("Merhaba " + response.gamer.name + " " + response.gamer.surname + ".<br>Kartını indirmek için <a id=\"download-pdf\"><span>buraya tıkla</span></a><br>Çekiliş öncesi kartını bastırmayı unutma!")


                    $("#card-name-A").html(response.gamer.cards[0].owner);
                    console.log(response.gamer.cards[0].owner)
                    $(".card-wrap #card-A").html(V.bingo.createCard(response.id, response.gamer.cards[0].color, "A"));
                    V.bingo.getCinko(JSON.parse(response.gamer.cards[0].first_row), "A", "A");
                    V.bingo.getCinko(JSON.parse(response.gamer.cards[0].second_row), "B", "A");
                    V.bingo.getCinko(JSON.parse(response.gamer.cards[0].third_row), "C", "A");

                    if (response.gamer.cards.length > 1) {
                        $("#card-name-B").html(response.gamer.cards[1].owner);
                        $(".card-wrap #card-B").html(V.bingo.createCard(response.id, response.gamer.cards[1].color, "B"));
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[1].first_row), "A", "B");
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[1].second_row), "B", "B");
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[1].third_row), "C", "B");
                    };
                    if (response.gamer.cards.length > 2) {
                        $("#card-name-C").html(response.gamer.cards[2].owner);
                        $(".card-wrap #card-C").html(V.bingo.createCard(response.id, response.gamer.cards[2].color, "C"));
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[2].first_row), "A", "C");
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[2].second_row), "B", "C");
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[2].third_row), "C", "C");
                    };
                    if (response.gamer.cards.length > 3) {
                        $("#card-name-D").html(response.gamer.cards[3].owner);
                        $(".card-wrap #card-D").html(V.bingo.createCard(response.id, response.gamer.cards[3].color, "D"));
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[3].first_row), "A", "D");
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[3].second_row), "B", "D");
                        V.bingo.getCinko(JSON.parse(response.gamer.cards[3].third_row), "C", "D");
                    };
                    $(".buttons").css("display", "none");

                });

        },

        checkValidateUrl: function (key) {

            V.Key = V.register.getValidateKey(key);
            if (V.Key.length == 36) {
                V.ajaxRequest(url + V.validateUrl + V.Key + "/", "GET", true)
                    .then((response) => {
                        console.log("checkValidateUrl Success ")
                        console.log(response)

                        V.CompanyName = response.company_name;
                        V.logo = response.logo;
                        V.register_text = response.register_text;
                        V.start_datetime = response.start_datetime;
                        V.webinar_link = response.webinar_link;
                        V.disp_webinar_link_dt = response.disp_webinar_link_dt;


                        V.cardLimit = response.card_limit_per_url;
                        console.log("card limit" + V.cardLimit)
                        //Change Logo
                        $(".sirket-logo .logo").html(' <img id="companyLogo" src="' + url + response.logo + '" alt="">')

                        //Family Data - Card Limit
                        $("#family option").remove();
                        $("#family").append('<option value="1">1</option>')
                        if (V.cardLimit > 1) {
                            $("#family").append('<option value="2">2</option>')
                        };
                        if (V.cardLimit > 2) {
                            $("#family").append('<option value="3">3</option>')
                        };
                        if (V.cardLimit > 3) {
                            $("#family").append('<option value="4">4</option>')
                        };

                        $(".register-text").text(V.register_text);
                        $(".sirket-logo .logo").html(' <img id="companyLogo" src="' + url + response.logo + '" alt="">')

                        // Register NO
                        if (response.gamer == null) {
                            V.isRegister = false;
                            // POST - create card
                            $("#form-register").removeClass("d-none");
                            $("#register .button-wrap").removeClass("d-none");
                            $(".form-or-name .text").addClass("d-none");
                            V.GamersURLID = response.id;

                            // V.register.newCard("A", "red");
                            // if (V.cardLimit > 1) {
                            //     V.register.newCard("B", "blue");
                            // };
                            // if (V.cardLimit > 2) {
                            //     V.register.newCard("C", "yellow");
                            // };
                            // if (V.cardLimit > 3) {
                            //     V.register.newCard("D", "pink");
                            // };

                            cardColor = V.buttons.randomExcet();
                            $(".card-wrap #card-A").append(V.bingo.createCard(response.id, cardColor, "A"));
                            V.bingo.getCinko(JSON.parse(response.free_cards[0].first_row), "A", "A");
                            V.bingo.getCinko(JSON.parse(response.free_cards[0].second_row), "B", "A");
                            V.bingo.getCinko(JSON.parse(response.free_cards[0].third_row), "C", "A");
                            V.card_A_id = response.free_cards[0].id;
                            V.card_A_color = V.buttons.randomExcet();

                            if (response.free_cards.length > 1) {
                                cardColor = V.buttons.randomExcet();
                                $(".card-wrap #card-B").append(V.bingo.createCard(response.id, cardColor, "B"));
                                V.bingo.getCinko(JSON.parse(response.free_cards[1].first_row), "A", "B");
                                V.bingo.getCinko(JSON.parse(response.free_cards[1].second_row), "B", "B");
                                V.bingo.getCinko(JSON.parse(response.free_cards[1].third_row), "C", "B");
                                V.card_B_id = response.free_cards[1].id;
                                V.card_B_color = cardColor;

                            };
                            if (response.free_cards.length > 2) {
                                cardColor = V.buttons.randomExcet();
                                $(".card-wrap #card-C").append(V.bingo.createCard(response.id, cardColor, "C"));
                                V.bingo.getCinko(JSON.parse(response.free_cards[2].first_row), "A", "C");
                                V.bingo.getCinko(JSON.parse(response.free_cards[2].second_row), "B", "C");
                                V.bingo.getCinko(JSON.parse(response.free_cards[2].third_row), "C", "C");
                                V.card_C_id = response.free_cards[2].id;
                                V.card_C_color = cardColor;

                            };
                            if (response.free_cards.length > 3) {
                                cardColor = V.buttons.randomExcet();
                                $(".card-wrap #card-D").append(V.bingo.createCard(response.id, cardColor, "D"));
                                V.bingo.getCinko(JSON.parse(response.free_cards[3].first_row), "A", "D");
                                V.bingo.getCinko(JSON.parse(response.free_cards[3].second_row), "B", "D");
                                V.bingo.getCinko(JSON.parse(response.free_cards[3].third_row), "C", "D");
                                V.card_D_id = response.free_cards[3].id;
                                V.card_D_color = cardColor;

                            };

                        }
                        // Register YES
                        else {
                            V.isRegister = true;
                            $(".form-or-name .text").removeClass("d-none");
                            $("#form-register").addClass("d-none");
                            $("#register .button-wrap").addClass("d-none");
                            $(".card-wrap div").removeClass("d-none");
                            $("#card-name-A").empty();
                            $("#card-name-B").empty();
                            $("#card-name-C").empty();
                            $("#card-name-D").empty();


                            $(".form-or-name .text").html("Merhaba " + response.gamer.name + " " + response.gamer.surname + ".<br>Kartını indirmek için <a id=\"download-pdf\"><span>buraya tıkla</span></a><br>Çekiliş öncesi kartını bastırmayı unutma!")


                            $("#card-name-A").text(response.gamer.cards[0].owner);
                            console.log(response.gamer.cards[0].owner)
                            $(".card-wrap #card-A").append(V.bingo.createCard(response.id, response.gamer.cards[0].color, "A"));
                            V.bingo.getCinko(JSON.parse(response.gamer.cards[0].first_row), "A", "A");
                            V.bingo.getCinko(JSON.parse(response.gamer.cards[0].second_row), "B", "A");
                            V.bingo.getCinko(JSON.parse(response.gamer.cards[0].third_row), "C", "A");

                            if (response.gamer.cards.length > 1) {
                                $("#card-name-B").text(response.gamer.cards[1].owner);
                                $(".card-wrap #card-B").append(V.bingo.createCard(response.id, response.gamer.cards[1].color, "B"));
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[1].first_row), "A", "B");
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[1].second_row), "B", "B");
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[1].third_row), "C", "B");
                            };
                            if (response.gamer.cards.length > 2) {
                                $("#card-name-C").text(response.gamer.cards[2].owner);
                                $(".card-wrap #card-C").append(V.bingo.createCard(response.id, response.gamer.cards[2].color, "C"));
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[2].first_row), "A", "C");
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[2].second_row), "B", "C");
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[2].third_row), "C", "C");
                            };
                            if (response.gamer.cards.length > 3) {
                                $("#card-name-D").text(response.gamer.cards[3].owner);
                                $(".card-wrap #card-D").append(V.bingo.createCard(response.id, response.gamer.cards[3].color, "D"));
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[3].first_row), "A", "D");
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[3].second_row), "B", "D");
                                V.bingo.getCinko(JSON.parse(response.gamer.cards[3].third_row), "C", "D");
                            };
                            $(".buttons").css("display", "none");

                        }
                        V.register.parseDate(response.start_datetime);

                        //Loading
                    })
                    .catch((error) => {
                        console.log("V.register.checkValidateUrl() - error get")
                        console.log(error)
                        $("#loader_form .error-text").text("Validate Error!");

                    });
            } else {
                console.log("Wrong KEY!!!")
                $("#loader_form .error-text").text("Lütfen size verilen özel linkten giriş yapınız!");
            }

        },


        countdown: function (year, month, day, hour, minute, second) {
            // Set Launch Date (ms)

            const launchDate = new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second).getTime();
            const tnow = new Date().getTime();

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

                    if (distance < 1000) {

                        $(".countdown").remove();
                        $("#game-start").css("display", "flex");
                    }
                    if (distance < 1000 && V.isRegister == true) {
                        $("#game-start").css("height", "10vh");
                        $("#loader_form").removeClass("show");
                    }
                    if (distance < 1000 && V.isRegister == false) {
                        $(".form-sec").remove();
                        $(".tombala").remove();
                        $("button").remove();
                        $("#loader_form").removeClass("show");
                    } else {
                        $(".countdown").removeClass("d-none");
                        $("#loader_form").removeClass("show");
                    }

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
        createCard: function (id, cardColor, letter) {
            let content = " <ul id=\"user" + id + "\"  class=\"t-card " + cardColor + "\">\r\n<li id=\"column1\">\r\n<div id=\"A1\"><\/div>\r\n<div id=\"B1\"><\/div>\r\n<div id=\"C1\"><\/div>\r\n<\/li>\r\n<li id=\"column2\">\r\n<div id=\"A2\"><\/div>\r\n<div id=\"B2\"><\/div>\r\n<div id=\"C2\"><\/div>\r\n<\/li>\r\n<li id=\"column3\">\r\n<div id=\"A3\"><\/div>\r\n<div id=\"B3\"><\/div>\r\n<div id=\"C3\"><\/div>\r\n<\/li>\r\n<li id=\"column4\">\r\n<div id=\"A4\"><\/div>\r\n<div id=\"B4\"><\/div>\r\n<div id=\"C4\"><\/div>\r\n<\/li>\r\n<li id=\"column5\">\r\n<div id=\"A5\"><\/div>\r\n<div id=\"B5\"><\/div>\r\n<div id=\"C5\"><\/div>\r\n<\/li>\r\n<li id=\"column6\">\r\n<div id=\"A6\"><\/div>\r\n<div id=\"B6\"><\/div>\r\n<div id=\"C6\"><\/div>\r\n<\/li>\r\n<li id=\"column7\">\r\n<div id=\"A7\"><\/div>\r\n<div id=\"B7\"><\/div>\r\n<div id=\"C7\"><\/div>\r\n<\/li>\r\n<li id=\"column8\">\r\n<div id=\"A8\"><\/div>\r\n<div id=\"B8\"><\/div>\r\n<div id=\"C8\"><\/div>\r\n<\/li>\r\n<li id=\"column9\">\r\n<div id=\"A9\"><\/div>\r\n<div id=\"B9\"><\/div>\r\n<div id=\"C9\"><\/div>\r\n<\/li>\r\n<\/ul> <div class=\"buttons\"><a id=\"change-card-" + letter + "\" class=\"btn-main\">Rakam Değiştir<\/a><a id=\"change-color-" + letter + "\" class=\"btn-main\">Renk Değiştir<\/a><\/div> ";

            return content;
        },
        getCinko: function (cinkoArray, columnLet, cardName) {

            $(eval(cinkoArray)).each(function (index, rowNum) {

                number = V.bingo.getNumberColumn(rowNum);

                for (i = 0; i < 10; i++) {
                    if (number == i) {
                        $("#card-" + cardName + " #" + columnLet + i).text(rowNum);
                    }
                }



            });

        },
        getNumberColumn: function (NumberColumn) {
            let returnColumn = Math.floor((NumberColumn + 9) / 10);
            return returnColumn;
        },
    },

    game: {

        init: function () {

        },

        setData: function () {
            $("#loader_form").addClass("show"); //Loading - Validate URL çek
            V.ajaxRequest(V.validateUrl, 'GET')
                .then((response) => {
                    let data = response;




                    $("#loader_form").removeClass("show"); //Loading
                })
                .catch((error) => {
                    console.log("V.game.Setdata() - error get")
                    console.log(error)

                });
        }
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