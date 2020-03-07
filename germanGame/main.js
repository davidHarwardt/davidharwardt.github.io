var questionsData = 
[
    "die Akkumulation;Reihung von Begriffen;Und es wallet und siedet und brauset und zischt",
    "die Alliteration;Wiederholung von gleichen Anfangskonsonanten bei aufeinanderfolgenden Wörter;Milch macht müde Männer munter",
    "die Anapher;Wiederholung gleicher Wörter oder der selben Wortgruppe Vers- oder Satzanfängen;Hätte sie Gedanken [...] Hätte sie Gefühl [...]",
    "die Anrede;Hinwendung zu den Adressaten durch direkte Ansprache;Meine sehr geehrten Damen und Herren!",
    "die Antithese;Entgegenstellung von Gedanken oder Begriffen;Was dieser heute baut, reißt jener morgen ein",
    "der Chiasmus;Überkreuzstellung von ähnlichen Satzstrukturen;Freust du dich deines Lebens, auch ich hab mich des Lebens gefreut",
    "die Dreierfigur;dreifache Wiederholung von gleichen Wortarten oder Satzteilen;Ich kam, ich sah, ich siegte",
    "die Ellipse;unvollständiger Satz, der aber leicht zu Ergänzen ist;Je eher desto besser.",
    "die Epipher;Wiederholung gleicher Wörter oder derselben Wortgruppe an Vers- oder Satzenden;Sie sprach zu ihm, sie sang zu ihm.",
    "der Euphemismus;verhüllende Umschreibung oder Beschönigung;Vorwärtsverteidigung anstadt Angriff",
    "das Hochwertwort;ein besonders positiv bewertendes Wort;das ultimative Tanzvergnügnen",
    "die Hyperbel;starke Unter- oder Übertreibung;Ein Meer von Tränen.",
    "die Inversion;Umstellung des üblichen Satzbaus;Schwer ist aller Anfang.",
    "die Ironie;Äußerung, die durchblicken lässt, dass das Gegenteil gemeint ist;Das hast du ja ganz toll hinbekommen!",
    "die Klimax;Steigerung;Gut, besser, am bessten.",
    "die Metapher; verkürzter bildhafter Vergleich;Geldwäsche",
    "der Neologismus;Wortneuschöpfung;Kaufrausch",
    "das Paradoxon;Zusammenstellung von Wörtern mit scheinbarem Wiederspruch;Bittersüß",
    "der Parallelismus;Wiederholung gleicher syntaktischer Strukturen;Ein Blitz leuchtete, der Donner folgte, ein Gewitter setzte ein.",
    "die Paranthese;Einschub einer Wortgruppe in einen Satz;Wir sollten uns - und das meine ich ernst - endlich an die Arbeit machen",
    "die Personifikation;Vermenschlichung;Die Sonne lacht",
    "die Phrase;leeres Gerede;...oder so...",
    "die Pointe;Höhe- und Schlusspunkt einer Anekdote;Orthogravieh - das sieht man hier - Ist nicht gut für Mensch und Tier",
    "die Rethorische Frage;scheinbare Frage, deren Antwort die Leser kennen, da ihr Einverständnis vorausgesetzt wird;Wer ist schon perfekt?",
    "das Symbol;Zeichen, das auf einen abstrakteren Bereich verweist;weiße Taube = Frieden",
    "der Vergleich;Verknüpfung zweier Begriffe mit 'wie';Still wie eine Maus",
    //"das Wortspiel;Ausnutzung von sprachlicher Vieldeutigkeit;Lieber arm dran als Arm ab"
];

var activeQuestion ="";

var questionsLeft = questionsData.length;

var uncoveredAmmount = 0;

var teamTurn = 0;

var teamPoints = [0, 0];

var won = false;

selectQuestion();

function onLoad()
{
    //win(1);
}

function answer(answerValue)
{
    if(answerValue)
    {
        teamPoints[teamTurn] += 5;
        document.querySelector("#pointsTeam" + (teamTurn + 1)).innerHTML = teamPoints[teamTurn];
    }
    document.querySelector("#scoreTeam1").classList.remove("true");
    document.querySelector("#scoreTeam2").classList.remove("false");

    var pointsTeam1 = parseInt(document.querySelector("#pointsTeam" + (1)).innerHTML);
    var pointsTeam2 = parseInt(document.querySelector("#pointsTeam" + (2)).innerHTML);

    var max;

    if(pointsTeam1 >= pointsTeam2)
    {
        max = pointsTeam1;
    }
    else
    {
        max = pointsTeam2;
    }

    document.querySelector("#bgGradient").style.background = "linear-gradient(90deg, rgb(0, 58, 71) " + ((pointsTeam1 / max)*25) + "%, rgb(11, 17, 58) " + (((pointsTeam2 / max)*(-25))+100) + "%)";

    uncoveredAmmount = 0;

    if(teamTurn == 0)
    {
        teamTurn = 1;
    }
    else
    {
        teamTurn = 0;
    }

    document.querySelector("#scoreTeam1").setAttribute("onclick", "null");
    document.querySelector("#scoreTeam2").setAttribute("onclick", "null");

    rotateQuestions();
}

function show(pos)
{
    if(!document.querySelector(".now .part" + pos).classList.contains("visible"))
    {
        showQuestion(pos, activeQuestion, pos-1);
    
        document.querySelector(".now .part" + pos).classList.add("visible");

        uncoveredAmmount++;
    }

    if(uncoveredAmmount >= 2)
    {
        document.querySelector(".now .part1").classList.add("visible");
        document.querySelector(".now .part2").classList.add("visible");
        document.querySelector(".now .part3").classList.add("visible");

        showQuestion(1, activeQuestion, 0);
        showQuestion(2, activeQuestion, 1);
        showQuestion(3, activeQuestion, 2);

        document.querySelector("#scoreTeam1").classList.add("true");
        document.querySelector("#scoreTeam2").classList.add("false");

        document.querySelector("#scoreTeam1").setAttribute("onclick", "answer(true)");
        document.querySelector("#scoreTeam2").setAttribute("onclick", "answer(false)");
    }
}

function rotateQuestions()
{
    var prevPrev = document.querySelector(".prevPrev");
    var prev = document.querySelector(".prev");
    var now = document.querySelector(".now");
    var next = document.querySelector(".next");
    var nextNext = document.querySelector(".nextNext");
    var storage = document.querySelector(".storage");

    prevPrev.classList.remove("prevPrev");
    prev.classList.remove("prev");
    now.classList.remove("now");
    next.classList.remove("next");
    nextNext.classList.remove("nextNext");
    storage.classList.remove("storage");

    //1 2
    //2 3
    //3 4
    //4 5
    //5 6
    //6 1

    selectQuestion();

    prev.classList.add("prevPrev");
    now.classList.add("prev");
    next.classList.add("now");
    nextNext.classList.add("next");
    prevPrev.classList.add("storage");
    storage.classList.add("nextNext");

    document.querySelector(".prevPrev .part1").classList.remove("visible");
    document.querySelector(".prevPrev .part2").classList.remove("visible");
    document.querySelector(".prevPrev .part3").classList.remove("visible");

    document.querySelector(".prevPrev").querySelector(".part1").innerHTML = "?";
    document.querySelector(".prevPrev").querySelector(".part2").innerHTML = "?";
    document.querySelector(".prevPrev").querySelector(".part3").innerHTML = "?";
}

function selectQuestion()
{
    if(questionsLeft == 0)
    {
        document.querySelector("#quizBody").style.visibility = "hidden";
        if(parseInt(document.querySelector("#pointsTeam1").innerHTML) > parseInt(document.querySelector("#pointsTeam2").innerHTML))
        {
            win(1);
        }
        else if(parseInt(document.querySelector("#pointsTeam1").innerHTML) < parseInt(document.querySelector("#pointsTeam2").innerHTML))
        {
            win(2);
        }
        else
        {
            win(0);
        }
    }
    else
    {
        var questionPos = Math.floor(Math.random() * (questionsData.length - 1));

        activeQuestion = questionsData[questionPos];
    
        questionsData.splice(questionPos, 1);
    
        questionsLeft--;
    }
}

function showQuestion(pos, question, typePos)
{
    var selectedRow = document.querySelector(".now");
    
    selectedRow.querySelector(".part" + pos).innerHTML = question.split(";")[typePos];
}

function win(team)
{
    var otherTeam;

    if(team == 1)
    {
        otherTeam = 2;
    }
    else
    {
        otherTeam = 1;
    }

    document.querySelector("#quizBody").classList.add("blured");
    document.querySelector("#scoreboard").classList.add("visible");
    document.querySelector("#scoreWinner").classList.add("visible");
    document.querySelector("#scoreWinner").classList.add("team" + team);

    document.querySelector("#scoreWinnerPoints").classList.add("visible");
    document.querySelector("#scoreWinnerPoints").classList.add("team" + team);

    if(team != 0)
    {
        document.querySelector("#scoreWinner").innerHTML = "Team " + team + " gewinnt";
        document.querySelector("#scoreWinnerPoints").innerHTML = document.querySelector("#pointsTeam" + team).innerHTML + " : " + document.querySelector("#pointsTeam" + otherTeam).innerHTML;
    }
    else
    {
        document.querySelector("#scoreWinner").innerHTML = "Unentschieden";
        document.querySelector("#scoreWinnerPoints").innerHTML = document.querySelector("#pointsTeam1").innerHTML + " : " + document.querySelector("#pointsTeam2").innerHTML;
    }
    
    won = true;
}

var fireworks = new Array();

//new Firework(new Vector2d(500, 1000), new Vector2d(0, 4), 100, 150, 5, "#ff0000")

//console.log(fireworks);

setInterval(function tick()
{
    if(won)
    {
        Graphics.clearCanvas("canvas");

        if(fireworks.length > 0)
        {
            for(var i = 0; i < fireworks.length; i++)
            {
                fireworks[i].update();
                fireworks[i].draw();

                if(fireworks[i].particles.length <= 0)
                {
                    fireworks.slice(i, 1);
                }
            }
        }
        if(Math.floor(Math.random()*100) == 10)
        {
            fireworks.push(new Firework(new Vector2d(Math.random()*800+100, 1000), new Vector2d(Math.random()*0.5 - 0.25, 4), 50, 220*(Math.random()*0.5 + 0.5), 5, "hsl(" + Math.random()*255 + ", 100%, 50%)"));
        }
    }
}, 10);

function setActiveTeam(team)
{
    teamTurn = team;
    return ("activeTeam: " + teamTurn);
}