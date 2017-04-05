class Scrapper {

    getLiveMatchUniqueId() {
        $.get("https://cricapi.com/api/matches?apikey=dBkVNxeFMrZ0g3dfTEDp0ph5CNb2", function (allNewMatchesData) {
            Scrapper.getUniqueIdOfRequiredMatch(allNewMatchesData);
            start();
        });
    }

    static getUniqueIdOfRequiredMatch(allNewMatchesData) {

        var allNewMatches, today, team1, team2, i;

        allNewMatches = allNewMatchesData.matches;

        today = new Date();

        if (today.getHours() >= 16 && today.getHours() < 20)
            matchData.currentMatchHourSlot = 1600;
        else
            matchData.currentMatchHourSlot = 2000;

        matchData.currentMatch = iplScheduleJson[today.toLocaleDateString()][matchData.currentMatchHourSlot];



        team1 = matchData.currentMatch.team1;
        team2 = matchData.currentMatch.team2;

        for (i in allNewMatches) {
            if ((allNewMatches[i]["team-1"] == team1 && allNewMatches[i]["team-2"] == team2) ||
                (allNewMatches[i]["team-1"] == team2 && allNewMatches[i]["team-2"] == team1)) {
                matchData.uniqueId = allNewMatches[i].unique_id;
                break;
            }
        }
    }

    getCricApiData() {

        $.get("https://cricapi.com/api/cricketScore?apikey=dBkVNxeFMrZ0g3dfTEDp0ph5CNb2&unique_id=" + matchData.uniqueId + "", function (liveMatchData) {

            Scrapper.scrapCricApiResponse(liveMatchData);
            UiHandler.updateUi(liveMatchData);
        });


    }

    static scrapCricApiResponse(liveMatchData) {

        matchData.team1 = iplTeamProps[matchData.currentMatch.team1];
        matchData.team2 = iplTeamProps[matchData.currentMatch.team2];

        var scoreDetails = liveMatchData.score,
            inningsRequirement = liveMatchData["innings-requirement"],
            i = 1,
            scorePattern = /^[0-9]+(\/[0-9]{1,2})?/,
            temp1 = scoreDetails.split(' '),
            temp2 = scoreDetails.split(',');


        matchData.currentScore = temp1[1];


        while (scorePattern.test(matchData.currentScore) != true) {
            matchData.currentScore = temp1[i + 1];
            i += 1;

        }


        matchData.playingTeam = temp1.slice(0, i).join(' ');
        matchData.overs = scoreDetails.split('(')[1].split(',')[0];


        if (inningsRequirement.includes('require another')) {

            var currentRuns = parseInt(matchData.currentScore.split('/').slice(0, 1).toString());
            var runsToWin = matchData.runsToWin = parseInt(inningsRequirement.slice(3, 4));
            matchData.target = currentRuns + runsToWin - 1;
            matchData.batsman2 = temp2.slice(2, 3).toString();


        } else if (inningsRequirement.includes('won the match') == true) {

            matchData.winningTeam = inningsRequirement.split(' ').slice(0, 1).toString();
            if (matchData.winningTeam == matchData.currentMatch.team1) {
                matchData.loosingTeam = matchData.currentMatch.team2;
            } else {
                matchData.loosingTeam = matchData.currentMatch.team1;
            }

            currentRuns = parseInt(matchData.currentScore.toString());
            runsToWin = "";
            matchData.target = "";
            matchData.batsman2 = "";
        } else {

            currentRuns = parseInt(matchData.currentScore.split('/').slice(0, 1).toString());
            runsToWin = "";
            matchData.target = "";
            matchData.batsman2 = temp2.slice(2, 3).toString();
            if (matchData.batsman2.includes('/'))
                matchData.batsman2 = "";

        }

        if (scoreDetails.includes('- Match over'))
            matchData.bowler = scoreDetails.split('-').slice(0, 1).toString().split(',').slice(2, 3).toString().split(')').slice(0, 1).toString();
        else if ((inningsRequirement.includes('require another') ||
                (inningsRequirement.includes('won the toss')))) {
            matchData.bowler = scoreDetails.split(',').slice(3, 4).toString().split(')').slice(0, 1).toString();
            //            matchData['secondInningsScore'] = matchData["currentScore"];
        } else {
            matchData.bowler = temp2.slice(3, 4).toString().substr(1, temp2.slice(3, 4).toString().length - 2);
            matchData.bowler = matchData['bowler'].split(')').slice(0, 1).toString();
        }
        if (scoreDetails.includes('ODI') == true) {
            matchData.batsman1 = "";
            matchData.batsman2 = "";
            matchData.bowler = "";
            matchData.playingTeam = "";
            matchData.currentScore = "";
            matchData.overs = "";
        } else
            matchData.batsman1 = temp2.slice(1, 2).toString().substr(1, temp2.slice(1, 2).toString().length);

        if (scoreDetails.includes('Innings break') == true) {
            matchData.firstInningsScore = matchData.currentScore;
        }

        //console.log(matchData);
    }
}
