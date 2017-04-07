class IPL2017 extends UiHandler {}

let ipl = new IPL2017();



function start() {


    if (Scrapper.checkInternetStatus()) {


        if (matchData.uniqueId == undefined)
            $.get("https://cricapi.com/api/matches?apikey=dBkVNxeFMrZ0g3dfTEDp0ph5CNb2", function (allNewMatchesData) {
                Scrapper.getUniqueIdOfRequiredMatch(allNewMatchesData);
                ipl.getCricApiData();
            });
        else
            ipl.getCricApiData();
    }


    setTimeout(function () {
        start();
    }, 30000);

}


start();
