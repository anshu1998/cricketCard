class IPL2017 extends UiHandler {}

let ipl = new IPL2017();

ipl.getLiveMatchUniqueId();

function start() {
    ipl.getCricApiData();
    setInterval(function () {
        ipl.getCricApiData();
    }, 20000);

}
