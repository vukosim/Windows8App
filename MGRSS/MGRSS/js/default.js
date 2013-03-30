﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var articlesList;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            var articlelistElement = document.getElementById("articlelist");
            articlelistElement.addEventListener("iteminvoked", itemInvoked);
            backbutton.addEventListener("click", backButtonClick);

            articlesList = new WinJS.Binding.List();
            var publicMembers = { ItemList: articlesList };
            WinJS.Namespace.define("MGData", publicMembers);

            args.setPromise(WinJS.UI.processAll().then(downloadMGNewsFeed));
        }
    };

        function backButtonClick(e) {
        articlecontent.style.display = "none";
        articlelist.style.display = "";
        WinJS.UI.Animation.enterPage(articlelist);
    }

    function itemInvoked(e) {
        var currentArticle = articlesList.getAt(e.detail.itemIndex);
       // WinJS.Utilities.setInnerHTMLUnsafe(youtubevideolink, currentArticle.youtubevideo);
        WinJS.Utilities.setInnerHTMLUnsafe(articlecontent, currentArticle.content);
        articlelist.style.display = "none";
        articlecontent.style.display = "";
        WinJS.UI.Animation.enterPage(articlecontent);
       // WinJS.UI.Animation.enterPage(youtubevideolink);
    }

    function downloadMGNewsFeed() {
        WinJS.xhr({ url: "http://gdata.youtube.com/feeds/api/users/MGOnlineVideo/uploads" }).then(function (rss) {
            var items = rss.responseXML.querySelectorAll("entry");

            for (var n = 0; n < items.length; n++) {
                var article = {};
                article.title = items[n].querySelector("title").textContent;
                var media_group = items[n].querySelector("group");
                var thumbs = media_group.querySelectorAll("thumbnail");
                if (thumbs.length > 1) {
                    article.thumbnail = thumbs[1].attributes.getNamedItem("url").textContent;
                    article.content = media_group.querySelector("description").textContent;;
                    article.youtubevideo = media_group.querySelector("player").textContent;;
                    articlesList.push(article);
                }
            }
        });
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();


