// UI Scripts
    // TABS
    
    $(document).ready(function () {
        $("div.tab-content").not("[data-tab=1]").addClass("hide"),
            $(".tabs-nav li").first().addClass("active"),
            $(".tabs-nav li").on("click", function () {
                $(this).addClass("active"),
                    $(".tabs-nav li").not(this).removeClass("active");
                var a = $(this).attr("data-tab");
                $("div[data-tab = " + a + "]").removeClass("hide"),
                    $("div.tab-content").not("[data-tab=" + a + "]").addClass("hide")
            }),
            $("li[data-tab=all]").on("click", function () {
                $(this).addClass("active"),
                    $("div.tab-content").removeClass("hide")
            });
        $(".side-panel__trigger").on("click", function () {
            $(this).toggleClass("active");
            $(".side-panel").animate({ "width": "toggle" });
        });
    });

    
    

// WEBAPP Scripts

    // GLOBAL VARIABLES
    var username = "social@lyntonweb.com", //email address for your account
        password = "u0856709d93976a5", //authkey for your account
        getDataClicked = false;

    
    // SCREENSHOT TEST
    function ScreenshotTestApi(username, password) {
        this.baseUrl = "https://" + username + ":" + password + "@crossbrowsertesting.com/api/v3/screenshots";
        this.basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
        this.currentTest = null;
        this.allBrowsers = [];
        this.callApi = function (url, method, params, callback) {
            var self = this;
            $.ajax({
                type: method,
                url: url,
                data: params,
                dataType: "json",
                async: false,
                beforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader('Authorization', "Basic " + self.basicAuth);
                },
                success: function (data) {
                    callback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    resultsUi.append("<div>" + textStatus + "</div>");
                    throw "Failed: " + textStatus
                }
            });
        }
        this.startNewTest = function (params, callback) {
            var self = this;
            self.callApi(this.baseUrl, "POST", params, function (data) {
                self.log('new test started successfully', data)
                self.currentTest = data;
                resultsUi.append("<div>startNewTest completed</div>");
                callback();
            });
        }
        this.getTestId = function () {
            return this.currentTest.screenshot_test_id;
        }
        this.getTestVersion = function () {
            return this.currentTest.versions.version_id;
        }
        this.log = function (text) {
            if (window.console) console.log(text);
        }
    }

    function runNewTest() {
        var screenshot = new ScreenshotTestApi(username, password),
            resultsQuery = "?type=fullpage&size=small",
            params = {
                url: $("input[name=url]").val(),
                browser_list_name: "lw_custom",
                api_timeout: $("input[name=api_timeout]").val()
            }
        resultsUi.html("<div>Running Screenshot Test on " + params.url + "</div>");
        $("#setup").hide();
        screenshot.startNewTest(params, function () {
            resultsUi.append("<div>Screenshot Test id is <span id='testId'>" + screenshot.getTestId() + "</div>");
            resultsUi.append("<div><a class='button button--delta' href='https://app.crossbrowsertesting.com/screenshots/" + screenshot.getTestId() + resultsQuery + "' target='_blank'>View Screenshot Test on CrossBrowserTesting.com</a></div>");
            resultsUi.append("<br><br><button class=button' type='button' onclick='location.href=location.href'>Start Over</button>");
            $("input[name=testId]").val(screenshot.getTestId());
            $("input[name=testVersion]").val(screenshot.getTestVersion());
        });
    }
    var resultsUi = null;
    $(document).ready(function () {
        var api = new ScreenshotTestApi(username, password);

        resultsUi = $("#results");

    });

    // GET SCREENSHOT TEST DATA
    var testJson = null;
    function ScreenshotDataApi(username, password, testID, testVersion) {
        this.baseUrl = "https://" + username + ":" + password + "@crossbrowsertesting.com/api/v3/screenshots/" + testID + "/" + testVersion;
        this.basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
        this.callApi = function (url, method, params, callback) {
            var self = this;
            $.ajax({
                type: method,
                url: url,
                data: params,
                dataType: "json",
                async: false,
                beforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader('Authorization', "Basic " + self.basicAuth);
                },
                success: function (data) {
                    callback(data);
                    console.log(data);
                    testJson = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    resultsUi.append("<div>" + textStatus + "</div>");
                    throw "Failed: " + textStatus
                }
            });
        }
        this.getTestData = function (params, callback) {
            var self = this;
            self.callApi(this.baseUrl, "GET", params, function (data) {
                self.log('test data retrieved', data)
                self.currentTest = testJson;
                resultsUi.append("<div>getTestData completed</div>");
                console.log("test");
                callback();
            });
        }
        this.getCreatedDate = function () {
            return this.currentTest.created_date;
        }
        this.getTestVersion = function () {
            return this.currentTest.versions.version_id;
        }
        this.getVersionCount = function () {
            return this.currentTest.version_count;
        }
        this.getVersionData = function () {
            return this.currentTest.versions;
        }
        this.log = function (text) {
            if (window.console) console.log(text);
        }
    }
    var client_slug = null,
        page_slug = null,
        testId = null;
    /* var getPassRate = function(screenshot) {
        var tags = screenshot.results.tags,
            total = "",
            passes = [];
        var passes = function() {
            if tags.indexOf("pass") {
                return screenshot.results.result_id;
            }
        }
        return count(passes)/total;
    } */
    function handleData() {
        var client_slug = $("input[name=client-slug]").val(),
            page_slug = $("input[name=page-slug]").val(),
            testId = $("input[name=testId]").val(),
            testVersion = $("input[name=testVersion]").val();
        var screenshot = new ScreenshotDataApi(username, password, testId, testVersion),
            params = "";
        resultsUi.html("<div>Getting Screenshot Test data for " + client_slug + " / " + page_slug + " / " + testId + "</div>");
        screenshot.getTestData(params, function () {
            var sendData = {
                "client_slug": client_slug,
                "page_slug": page_slug,
                "testId": testId,
                "created_date": screenshot.getCreatedDate(),
                "version_count": screenshot.getVersionCount()/*,
            "passRate": passRate(screenshot) */
            };
            console.log(testJson);
            makeSheetApiCall(sendData);
        });
        getDataClicked = true;
    }

    var makeSheetApiCall = function (sendData) {
        var newSpreadsheetId = null,
            page = sendData.page_slug,
            id = sendData.testId,
            url = JSON.parse("show_result_web_url"),
            count = sendData.version_count
        var params = {
            valueInputOption: "USER_ENTERED"
        }
        var spreadsheetBody = {
            properties: {
                "title": sendData.client_slug + ": QA Documentation"
            },
            sheets: {
                "properties": {
                    "title": sendData.page_slug
                },
                "data": {
                    "rowData": [
                        {
                            "values": [
                                {
                                    "userEnteredValue": {
                                        "stringValue": page
                                    }
                                },
                                {
                                    "hyperlink": url,
                                    "userEnteredFormat": {
                                        "hyperlinkDisplayType": "LINKED"
                                    },
                                    "formattedValue": id
                                },
                                {
                                    "userEnteredValue": {
                                        "stringValue": date
                                    }
                                },
                                {
                                    "userEnteredValue": {
                                        "numberValue": count
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        };
        var createRequest = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
        createRequest.then(function (response) {
            newSpreadsheetId = response.result.spreadsheetId;
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });

    }

    function initClient() {
        var API_KEY = 'AIzaSyA09kGmIzbCL37IQt5fGIP1NFwESZH99SE';  // TODO: Update placeholder with desired API key.

        var CLIENT_ID = '407152186767-6qr0jchv3iop1vc14agbmm5t1qa3fgtc.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

        var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

        gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(function () {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function updateSignInStatus(isSignedIn) {
        if (isSignedIn && getDataClicked) {
            handleData();
        }
    }

    function handleSignInClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }
