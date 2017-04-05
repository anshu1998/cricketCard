
"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}
function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}
function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var Scrapper=function(){function Scrapper(){_classCallCheck(this,Scrapper);}
_createClass(Scrapper,[{key:"getLiveMatchUniqueId",value:function getLiveMatchUniqueId(){$.get("https://cricapi.com/api/matches?apikey=dBkVNxeFMrZ0g3dfTEDp0ph5CNb2",function(allNewMatchesData){Scrapper.getUniqueIdOfRequiredMatch(allNewMatchesData);start();});}},{key:"getCricApiData",value:function getCricApiData(){$.get("https://cricapi.com/api/cricketScore?apikey=dBkVNxeFMrZ0g3dfTEDp0ph5CNb2&unique_id="+matchData.uniqueId+"",function(liveMatchData){Scrapper.scrapCricApiResponse(liveMatchData);UiHandler.updateUi(liveMatchData);});}}],[{key:"getUniqueIdOfRequiredMatch",value:function getUniqueIdOfRequiredMatch(allNewMatchesData){var allNewMatches,today,team1,team2,i;allNewMatches=allNewMatchesData.matches;today=new Date();if(today.getHours()>=16&&today.getHours()<20)matchData.currentMatchHourSlot=1600;else matchData.currentMatchHourSlot=2000;matchData.currentMatch=iplScheduleJson[today.toLocaleDateString()][matchData.currentMatchHourSlot];team1=matchData.currentMatch.team1;team2=matchData.currentMatch.team2;for(i in allNewMatches){if(allNewMatches[i]["team-1"]==team1&&allNewMatches[i]["team-2"]==team2||allNewMatches[i]["team-1"]==team2&&allNewMatches[i]["team-2"]==team1){matchData.uniqueId=allNewMatches[i].unique_id;break;}}}},{key:"scrapCricApiResponse",value:function scrapCricApiResponse(liveMatchData){matchData.team1=iplTeamProps[matchData.currentMatch.team1];matchData.team2=iplTeamProps[matchData.currentMatch.team2];var scoreDetails=liveMatchData.score,inningsRequirement=liveMatchData["innings-requirement"],i=1,scorePattern=/^[0-9]+(\/[0-9]{1,2})?/,temp1=scoreDetails.split(' '),temp2=scoreDetails.split(',');matchData.currentScore=temp1[1];while(scorePattern.test(matchData.currentScore)!=true){matchData.currentScore=temp1[i+1];i+=1;}
matchData.playingTeam=temp1.slice(0,i).join(' ');matchData.overs=scoreDetails.split('(')[1].split(',')[0];if(inningsRequirement.includes('require another')){var currentRuns=parseInt(matchData.currentScore.split('/').slice(0,1).toString());var runsToWin=matchData.runsToWin=parseInt(inningsRequirement.slice(3,4));matchData.target=currentRuns+runsToWin-1;matchData.batsman2=temp2.slice(2,3).toString();}else if(inningsRequirement.includes('won the match')==true){matchData.winningTeam=inningsRequirement.split(' ').slice(0,1).toString();if(matchData.winningTeam==matchData.currentMatch.team1){matchData.loosingTeam=matchData.currentMatch.team2;}else{matchData.loosingTeam=matchData.currentMatch.team1;}
currentRuns=parseInt(matchData.currentScore.toString());runsToWin="";matchData.target="";matchData.batsman2="";}else{currentRuns=parseInt(matchData.currentScore.split('/').slice(0,1).toString());runsToWin="";matchData.target="";matchData.batsman2=temp2.slice(2,3).toString();if(matchData.batsman2.includes('/'))matchData.batsman2="";}
if(scoreDetails.includes('- Match over'))matchData.bowler=scoreDetails.split('-').slice(0,1).toString().split(',').slice(2,3).toString().split(')').slice(0,1).toString();else if(inningsRequirement.includes('require another')||inningsRequirement.includes('won the toss')){matchData.bowler=scoreDetails.split(',').slice(3,4).toString().split(')').slice(0,1).toString();}else{matchData.bowler=temp2.slice(3,4).toString().substr(1,temp2.slice(3,4).toString().length-2);matchData.bowler=matchData['bowler'].split(')').slice(0,1).toString();}
if(scoreDetails.includes('ODI')==true){matchData.batsman1="";matchData.batsman2="";matchData.bowler="";matchData.playingTeam="";matchData.currentScore="";matchData.overs="";}else matchData.batsman1=temp2.slice(1,2).toString().substr(1,temp2.slice(1,2).toString().length);if(scoreDetails.includes('Innings break')==true){matchData.firstInningsScore=matchData.currentScore;}}}]);return Scrapper;}();var UiHandler=function(_Scrapper){_inherits(UiHandler,_Scrapper);function UiHandler(){_classCallCheck(this,UiHandler);return _possibleConstructorReturn(this,(UiHandler.__proto__||Object.getPrototypeOf(UiHandler)).apply(this,arguments));}
_createClass(UiHandler,null,[{key:"getElement",value:function getElement(selector){return document.querySelector(selector);}},{key:"updateUi",value:function updateUi(liveMatchData){document.title=liveMatchData["score"];UiHandler.getElement(".footerMessage").innerText=liveMatchData["innings-requirement"];UiHandler.getElement("#preMatch #stadiumName").innerText=matchData.currentMatch.venue;if(liveMatchData["innings-requirement"].includes('Match scheduled to begin')==true){UiHandler.getElement('#preMatch').style.display="block";}else if(liveMatchData["innings-requirement"].includes("the toss")==true){UiHandler.getElement('#firstInnings').style.display="block";UiHandler.getElement('#firstInnings .headerThirdInternalDiv').style.display='block';}else if(liveMatchData["innings-requirement"].includes("require another")==true){UiHandler.getElement('#secondInnings').style.display="block";UiHandler.getElement('#secondInnings .headerThirdInternalDiv').style.display='block';}else{UiHandler.getElement('#postMatch').style.display="block";UiHandler.getElement("#postMatch .headerThirdInternalDiv").style.display='none';}
if(matchData.currentMatchHourSlot=='1600')UiHandler.getElement("#matchTime").innerText='4:00 PM';else UiHandler.getElement("#matchTime").innerText='8:00 PM';UiHandler.getElement('#triangleTopLeft').setAttribute("style","border-top:100vh solid "+matchData.team1.jersyColor);UiHandler.getElement('#triangleBottomRight').setAttribute("style","border-bottom:100vh solid "+matchData.team2.jersyColor);UiHandler.getElement('#preMatch .team1 .playingTeamLogoPreMatch').src=UiHandler.getElement('#firstInnings .team1 .playingTeamLogoAfterToss').src=UiHandler.getElement('#secondInnings .team1 .playingTeamLogoAfterToss').src=UiHandler.getElement('#postMatch .team1 .playingTeamLogoAfterToss').src=matchData.team1.logo;UiHandler.getElement('#preMatch .team2 .playingTeamLogoPreMatch').src=UiHandler.getElement('#firstInnings .team2 .playingTeamLogoAfterToss').src=UiHandler.getElement('#secondInnings .team2 .playingTeamLogoAfterToss').src=UiHandler.getElement('#postMatch .team2 .playingTeamLogoAfterToss').src=matchData.team2.logo;UiHandler.getElement('.playingTeam').innerText=matchData.playingTeam;UiHandler.getElement('.currentScore').innerText=matchData.currentScore;UiHandler.getElement('.overs').innerText=matchData.overs;UiHandler.getElement(".headerMessage").innerText=matchData.team1.shortName+' V/S '+matchData.team2.shortName+' from '+matchData.currentMatch.venue;if(matchData.playingTeam==matchData.currentMatch.team1){UiHandler.getElement('#firstInnings .team1 .battingOrBowlingStatusLogo').src=UiHandler.getElement('#secondInnings .team1 .battingOrBowlingStatusLogo').src=matchData.battingStatusLogo;UiHandler.getElement('#firstInnings .team2 .battingOrBowlingStatusLogo').src=UiHandler.getElement('#secondInnings .team2 .battingOrBowlingStatusLogo').src=matchData.bowlingStatusLogo;UiHandler.getElement("#firstInnings .team1 .liveBattingOrBowlingStatus").innerText=UiHandler.getElement("#secondInnings .team1 .liveBattingOrBowlingStatus").innerText=matchData.batsman1;UiHandler.getElement("#firstInnings .team2 .liveBattingOrBowlingStatus").innerText=UiHandler.getElement("#secondInnings .team2 .liveBattingOrBowlingStatus").innerText=matchData.bowler;}else{UiHandler.getElement('#firstInnings .team2 .battingOrBowlingStatusLogo').src=UiHandler.getElement('#secondInnings .team2 .battingOrBowlingStatusLogo').src=matchData.battingStatusLogo;UiHandler.getElement('#firstInnings .team1 .battingOrBowlingStatusLogo').src=UiHandler.getElement('#secondInnings .team1 .battingOrBowlingStatusLogo').src=matchData.bowlingStatusLogo;UiHandler.getElement("#firstInnings .team2 .liveBattingOrBowlingStatus").innerText=UiHandler.getElement("#secondInnings .team2 .liveBattingOrBowlingStatus").innerText=matchData.batsman1;UiHandler.getElement("#firstInnings .team1 .liveBattingOrBowlingStatus").innerText=UiHandler.getElement("#secondInnings .team1 .liveBattingOrBowlingStatus").innerText=matchData.bowler;}}}]);return UiHandler;}(Scrapper);var iplScheduleJson={"05/04/2017":{"1600":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Malaysian Armed Forces","team2":"Universiti Kebangsaan Malaysia"},"2000":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Sunrisers Hyderabad","team2":"Royal Challengers Bangalore"}},"06/04/2017":{"2000":{"venue":"Maharashtra Cricket Association's International Stadium, Pune","team1":"Rising Pune Supergiant","team2":"Mumbai Indians"}},"07/04/2017":{"2000":{"venue":"Saurashtra Cricket Association Stadium, Rajkot","team1":"Gujarat Lions","team2":"Kolkata Knight Riders"}},"08/04/2017":{"1600":{"venue":"Holkar Cricket Stadium, Indore","team1":"Kings XI Punjab","team2":"Rising Pune Supergiant"},"2000":{"venue":"M. Chinnaswamy Stadium, Bengaluru","team1":"Royal Challengers Bangalore","team2":"Delhi Daredevils"}},"09/04/2017":{"1600":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Sunrisers Hyderabad","team2":"Gujarat Lions"},"2000":{"venue":"Wankhede Stadium, Mumbai","team1":"Mumbai Indians","team2":"Kolkata Knight Riders"}},"10/04/2017":{"2000":{"venue":"Holkar Cricket Stadium, Indore","team1":"Kings XI Punjab","team2":"Royal Challengers Bangalore"}},"11/04/2017":{"2000":{"venue":"Maharashtra Cricket Association's International Stadium, Pune","team1":"Rising Pune Supergiant","team2":"Delhi Daredevils"}},"12/04/2017":{"2000":{"venue":"Wankhede Stadium, Mumbai","team1":"Mumbai Indians","team2":"Sunrisers Hyderabad"}},"13/04/2017":{"2000":{"venue":"Eden Gardens, Kolkata","team1":"Kolkata Knight Riders","team2":"Kings XI Punjab"}},"14/04/2017":{"1600":{"venue":"M. Chinnaswamy Stadium, Bengaluru","team1":"Royal Challengers Bangalore","team2":"Mumbai Indians"},"2000":{"venue":"Saurashtra Cricket Association Stadium, Rajkot","team1":"Gujarat Lions","team2":"Rising Pune Supergiant"}},"15/04/2017":{"1600":{"venue":"Eden Gardens, Kolkata","team1":"Kolkata Knight Riders","team2":"Sunrisers Hyderabad"},"2000":{"venue":"Feroz Shah Kotla Ground, Delhi","team1":"Delhi Daredevils","team2":"Kings XI Punjab"}},"16/04/2017":{"1600":{"venue":"Wankhede Stadium, Mumbai","team1":"Mumbai Indians","team2":"Gujarat Lions"},"2000":{"venue":"M. Chinnaswamy Stadium, Bengaluru","team1":"Royal Challengers Bangalore","team2":"Rising Pune Supergiant"}},"17/04/2017":{"1600":{"venue":"Feroz Shah Kotla Ground, Delhi","team1":"Delhi Daredevils","team2":"Kolkata Knight Riders"},"2000":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Sunrisers Hyderabad","team2":"Kings XI Punjab"}},"18/04/2017":{"2000":{"venue":"Saurashtra Cricket Association Stadium, Rajkot","team1":"Gujarat Lions","team2":"Royal Challengers Bangalore"}},"19/04/2017":{"2000":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Sunrisers Hyderabad","team2":"Delhi Daredevils"}},"20/04/2017":{"2000":{"venue":"Holkar Cricket Stadium, Indore","team1":"Kings XI Punjab","team2":"Mumbai Indians"}},"21/04/2017":{"2000":{"venue":"Eden Gardens, Kolkata","team1":"Kolkata Knight Riders","team2":"Gujarat Lions"}},"22/04/2017":{"1600":{"venue":"Maharashtra Cricket Association's International Stadium, Pune","team1":"Rising Pune Supergiant","team2":"Sunrisers Hyderabad"},"2000":{"venue":"Wankhede Stadium, Mumbai","team1":"Mumbai Indians","team2":"Delhi Daredevils"}},"23/04/2017":{"1600":{"venue":"Saurashtra Cricket Association Stadium, Rajkot","team1":"Gujarat Lions","team2":"Kings XI Punjab"},"2000":{"venue":"Eden Gardens, Kolkata","team1":"Kolkata Knight Riders","team2":"Royal Challengers Bangalore"}},"24/04/2017":{"2000":{"venue":"Wankhede Stadium, Mumbai","team1":"Mumbai Indians","team2":"Rising Pune Supergiant"}},"25/04/2017":{"2000":{"venue":"M. Chinnaswamy Stadium, Bengaluru","team1":"Royal Challengers Bangalore","team2":"Sunrisers Hyderabad"}},"26/04/2017":{"2000":{"venue":"Maharashtra Cricket Association's International Stadium, Pune","team1":"Rising Pune Supergiant","team2":"Kolkata Knight Riders"}},"27/04/2017":{"2000":{"venue":"M. Chinnaswamy Stadium, Bengaluru","team1":"Royal Challengers Bangalore","team2":"Gujarat Lions"}},"28/04/2017":{"1600":{"venue":"Eden Gardens, Kolkata","team1":"Kolkata Knight Riders","team2":"Delhi Daredevils"},"2000":{"venue":"IS Bindra Stadium, Mohali","team1":"Kings XI Punjab","team2":"Sunrisers Hyderabad"}},"29/04/2017":{"1600":{"venue":"Maharashtra Cricket Association's International Stadium","team1":"Rising Pune Supergiant","team2":"Royal Challengers Bangalore"},"2000":{"venue":"Saurashtra Cricket Association Stadium, Rajkot","team1":"Gujarat Lions","team2":"Mumbai Indians"}},"30/04/2017":{"1600":{"venue":"IS Bindra Stadium, Mohali","team1":"Kings XI Punjab","team2":"Delhi Daredevils"},"2000":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Sunrisers Hyderabad","team2":"Kolkata Knight Riders"}},"01/05/2017":{"1600":{"venue":"Wankhede Stadium, Mumbai","team1":"Mumbai Indians","team2":"Royal Challengers Bangalore"},"2000":{"venue":"Maharashtra Cricket Association's International Stadium, Pune","team1":"Rising Pune Supergiant","team2":"Gujarat Lions"}},"02/05/2017":{"2000":{"venue":"Feroz Shah Kotla Ground, Delhi","team1":"Delhi Daredevils","team2":"Sunrisers Hyderabad"}},"03/05/2017":{"2000":{"venue":"Eden Gardens, Kolkata","team1":"Kolkata Knight Riders","team2":"Rising Pune Supergiant"}},"04/05/2017":{"2000":{"venue":"Feroz Shah Kotla Ground, Delhi","team1":"Delhi Daredevils","team2":"Gujarat Lions"}},"05/05/2017":{"2000":{"venue":"M. Chinnaswamy Stadium, Bengaluru","team1":"Royal Challengers Bangalore","team2":"Kings XI Punjab"}},"06/05/2017":{"1600":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Sunrisers Hyderabad","team2":"Rising Pune Supergiant"},"2000":{"venue":"Feroz Shah Kotla Ground, Delhi","team1":"Delhi Daredevils","team2":"Mumbai Indians"}},"07/05/2017":{"1600":{"venue":"M. Chinnaswamy Stadium, Bengaluru","team1":"Royal Challengers Bangalore","team2":"Kolkata Knight Riders"},"2000":{"venue":"IS Bindra Stadium, Mohali","team1":"Kings XI Punjab","team2":"Gujarat Lions"}},"08/05/2017":{"2000":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"Sunrisers Hyderabad","team2":"Mumbai Indians"}},"09/05/2017":{"2000":{"venue":"IS Bindra Stadium, Mohali","team1":"Kings XI Punjab","team2":"Kolkata Knight Riders"}},"10/05/2017":{"2000":{"venue":"Green Park, Kanpur","team1":"Gujarat Lions","team2":"Delhi Daredevils"}},"11/05/2017":{"2000":{"venue":"Wankhede Stadium, Mumbai","team1":"Mumbai Indians","team2":"Kings XI Punjab"}},"12/05/2017":{"2000":{"venue":"Feroz Shah Kotla Ground, Delhi","team1":"Delhi Daredevils","team2":"Rising Pune Supergiant"}},"13/05/2017":{"1600":{"venue":"Green Park, Kanpur","team1":"Gujarat Lions","team2":"Sunrisers Hyderabad"},"2000":{"venue":"Eden Gardens, Kolkata","team1":"Kolkata Knight Riders","team2":"Mumbai Indians"}},"14/05/2017":{"1600":{"venue":"Maharashtra Cricket Association's International Stadium, Pune","team1":"Rising Pune Supergiant","team2":"Kings XI Punjab"},"2000":{"venue":"Feroz Shah Kotla Ground, Delhi","team1":"Delhi Daredevils","team2":"Royal Challengers Bangalore"}},"16/05/2017":{"2000":{"venue":"TBD","team1":"TBD","team2":"TBD"}},"17/05/2017":{"2000":{"venue":"TBD","team1":"TBD","team2":"TBD"}},"19/05/2017":{"2000":{"venue":"TBD","team1":"TBD","team2":"TBD"}},"21/05/2017":{"2000":{"venue":"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad","team1":"TBD","team2":"TBD"}}};var iplTeamProps={"Delhi Daredevils":{"jersyColor":"#004589","shortName":"DD","logo":"images/DDD.jpg"},"Gujarat Lions":{"jersyColor":"#692c13","shortName":"GL","logo":"images/GL.png"},"Kings XI Punjab":{"jersyColor":"#c10019","shortName":"KXIP","logo":"images/KP.png"},"Kolkata Knight Riders":{"jersyColor":"#3d275d","shortName":"KKR","logo":"images/KKR.jpg"},"Mumbai Indians":{"jersyColor":"#005597","shortName":"MI","logo":"images/MI.jpg"},"Rising Pune Supergiant":{"jersyColor":"#382858","shortName":"RPS","logo":"images/RPS.png"},"Royal Challengers Bangalore":{"jersyColor":"#fd0021","shortName":"RCB","logo":"images/RCB.jpg"},"Sunrisers Hyderabad":{"jersyColor":"#004589","shortName":"SRH","logo":"images/SRH.jpg"},"Malaysian Armed Forces":{"jersyColor":"green","shortName":"ME","logo":"images/DDD.jpg"},"Universiti Kebangsaan Malaysia":{"jersyColor":"red","shortName":"MWR","logo":"images/MI.jpg"}};var matchData={"firstInningsScore":"","secondInningsScore":"","target":"","winningTeam":"","loosingTeam":"","currentScore":"","battingStatusLogo":"images/Bat.png","bowlingStatusLogo":"images/Ball.png"};var IPL2017=function(_UiHandler){_inherits(IPL2017,_UiHandler);function IPL2017(){_classCallCheck(this,IPL2017);return _possibleConstructorReturn(this,(IPL2017.__proto__||Object.getPrototypeOf(IPL2017)).apply(this,arguments));}
return IPL2017;}(UiHandler);var ipl=new IPL2017();ipl.getLiveMatchUniqueId();function start(){ipl.getCricApiData();setInterval(function(){ipl.getCricApiData();},20000);}