class UiHandler extends Scrapper {


    static getElement(selector) {
        return document.querySelector(selector);
    }
    static updateUi(liveMatchData) {


        if (liveMatchData["innings-requirement"].includes('Match scheduled to begin')) {

            UiHandler.getElement('#preMatch').style.display = "block";
            UiHandler.getElement(".matchInfoLiveStatus").innerHTML = "Stay Tunes<br>For Live Updates";

            document.title = liveMatchData["innings-requirement"];


        } else if (liveMatchData["innings-requirement"].includes("the toss")) {
            UiHandler.getElement('#firstInnings').style.display = "block";
            UiHandler.getElement('#firstInnings .headerThirdInternalDiv').style.display = 'block';

        } else if (liveMatchData["innings-requirement"].includes("require another")) {
            UiHandler.getElement('#secondInnings').style.display = "block";
            UiHandler.getElement('#secondInnings .headerThirdInternalDiv').style.display = 'block';

        } else {

            UiHandler.getElement('#postMatch').style.display = "block";
            UiHandler.getElement("#postMatch .headerThirdInternalDiv").style.display = 'none';
            UiHandler.getElement("#postMatch .team1 .liveBattingOrBowlingStatus").innerText = matchData.team1.score;
            UiHandler.getElement("#postMatch .team2 .liveBattingOrBowlingStatus").innerText = matchData.team2.score;

        }

        if (!liveMatchData["innings-requirement"].includes('Match scheduled to begin'))
            document.title = liveMatchData["score"];

        UiHandler.getElement(".footerMessage").innerText = liveMatchData["innings-requirement"];
        UiHandler.getElement("#preMatch #stadiumName").innerText = matchData.currentMatch.venue;




        if (matchData.currentMatchHourSlot == '1600')
            UiHandler.getElement("#matchTime").innerText = '4:00 PM';
        else
            UiHandler.getElement("#matchTime").innerText = '8:00 PM';

        UiHandler.getElement('#triangleTopLeft').setAttribute("style", "border-top:100vh solid " + matchData.team1.jersyColor);

        UiHandler.getElement('#triangleBottomRight').setAttribute("style", "border-bottom:100vh solid " + matchData.team2.jersyColor);

        UiHandler.getElement('#preMatch .team1 .playingTeamLogoPreMatch').src = UiHandler.getElement('#firstInnings .team1 .playingTeamLogoAfterToss').src = UiHandler.getElement('#secondInnings .team1 .playingTeamLogoAfterToss').src = UiHandler.getElement('#postMatch .team1 .playingTeamLogoAfterToss').src = matchData.team1.logo;

        UiHandler.getElement('#preMatch .team2 .playingTeamLogoPreMatch').src = UiHandler.getElement('#firstInnings .team2 .playingTeamLogoAfterToss').src = UiHandler.getElement('#secondInnings .team2 .playingTeamLogoAfterToss').src = UiHandler.getElement('#postMatch .team2 .playingTeamLogoAfterToss').src = matchData.team2.logo;

        UiHandler.getElement('.playingTeam').innerText = matchData.playingTeam;
        UiHandler.getElement('.currentScore').innerText = matchData.currentScore;
        UiHandler.getElement('.overs').innerText = matchData.overs;

        UiHandler.getElement(".headerMessage").innerText = matchData.team1.shortName + ' V/S ' + matchData.team2.shortName + ' from ' + matchData.currentMatch.venue;


        if (matchData.playingTeam == matchData.currentMatch.team1) {
            UiHandler.getElement('#firstInnings .team1 .battingOrBowlingStatusLogo').src = UiHandler.getElement('#secondInnings .team1 .battingOrBowlingStatusLogo').src = matchData.battingStatusLogo;

            UiHandler.getElement('#firstInnings .team2 .battingOrBowlingStatusLogo').src = UiHandler.getElement('#secondInnings .team2 .battingOrBowlingStatusLogo').src = matchData.bowlingStatusLogo;

            UiHandler.getElement("#firstInnings .team1 .liveBattingOrBowlingStatus").innerText = UiHandler.getElement("#secondInnings .team1 .liveBattingOrBowlingStatus").innerText = matchData.batsman1;

            UiHandler.getElement("#firstInnings .team2 .liveBattingOrBowlingStatus").innerText = UiHandler.getElement("#secondInnings .team2 .liveBattingOrBowlingStatus").innerText = matchData.bowler;
        } else {
            UiHandler.getElement('#firstInnings .team2 .battingOrBowlingStatusLogo').src = UiHandler.getElement('#secondInnings .team2 .battingOrBowlingStatusLogo').src = matchData.battingStatusLogo;

            UiHandler.getElement('#firstInnings .team1 .battingOrBowlingStatusLogo').src = UiHandler.getElement('#secondInnings .team1 .battingOrBowlingStatusLogo').src = matchData.bowlingStatusLogo;

            UiHandler.getElement("#firstInnings .team2 .liveBattingOrBowlingStatus").innerText = UiHandler.getElement("#secondInnings .team2 .liveBattingOrBowlingStatus").innerText = matchData.batsman1;

            UiHandler.getElement("#firstInnings .team1 .liveBattingOrBowlingStatus").innerText = UiHandler.getElement("#secondInnings .team1 .liveBattingOrBowlingStatus").innerText = matchData.bowler;


        }






    }
}
