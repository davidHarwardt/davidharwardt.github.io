var shownPopup = false;

function onLoad()
{
    document.getElementById("randomKilo").innerHTML = Math.floor(Math.random() * 1000000) / 1000;
    document.getElementById("randomKilo1").innerHTML = Math.floor(Math.random() * 100000000) / 1000;

    document.getElementById("popUp").innerHTML += "<p>" +  generatePopUp() + "</p>";
}

setInterval(function tick()
{
    var date = new Date();

    if(Math.floor(Math.random()*100) == 1 && !shownPopup)
    {
        document.getElementById("popUp").classList.add("active");
        shownPopup = true;
    }

    document.getElementById("liveClock").innerHTML = date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ":" + date.getSeconds().toString().padStart(2, "0");
}, 100);

function closePopUp()
{
    document.getElementById("popUp").classList.remove("active");
}

var phrasesStart0 = ["Wussten sie, dass", "Haben sie schon gehöhrt, dass", "Haben sie auch immer Probleme damit, dass"];
var phrasesMiddleUp0 = ["das Coronavirus von Echsenmenschen aus der inneren Hohlerde kommt?", "Computerviren eigentlich Bakterien sind?", "Finger organische 3D-Drucker sind, die Fingernägel drucken?", "Obama ein Prisma aus Zahnpasta ist, dass das Licht der Sonne unschädlich macht? (weshalb er keine Sonnencreme braucht)", "es objektive Argumente dafür gibt, dass Ananas auf Pizza gesundheitsschädlich ist (100% von Lil Lano versprochen)?"];
var phrasesMiddle0 = ["Dann kaufen sie jetzt das neue", "Dann besorgen sie sich schnell das", "Dann rufen sie schnell in unserem Teleshoppingcenter an, und kaufen sie sich das"];
var phrasesEnd0 = ["Iphone XVII Max Pro Ultradense Supersonic für den unschlagbaren Preis von", "TeBe Trikot mit unterschriften vom einzig wahren Stammspieler aus dem <a href='https://www.tebe.de/fanshop/artikel_18-006/'>Shop</a> für nur"];
var phrasesPriceUnit0 = ["$", "%", "cm", "s³", "€", "Geld", "¥", "Böller", "Menschen", "₿", "Maiskolben", "₽", ];

var phrasesStart1 = ["Wussten sie, dass", "Haben sie schon gehöhrt, dass", "Haben sie auch immer Probleme damit, dass"];
var phrasesMiddle1 = ["das Coronavirus von Echsenmenschen aus der inneren Hohlerde kommt?", "Computerviren eigentlich Bakterien sind?", "Finger organische 3D-Drucker sind, die Fingernägel drucken?", "Obama ein Prisma aus Zahnpasta ist, dass das Licht der Sonne unschädlich macht? (weshalb er keine Sonnencreme braucht)", "es objektive Argumente dafür gibt, dass Ananas auf Pizza gesundheitsschädlich ist (100% von Lil Lano versprochen)?"];
var phrasesEnd1 = ["Mehr erfahren sie hier: <a href='www.maiskolbenwitz.de'>mehr></a>"];

function generatePopUp()
{
    var category = Math.floor(Math.random()*2);

    var outText = "";

    if(category == 0)
    {
        outText += phrasesStart0[Math.floor(Math.random()*phrasesStart0.length)] + " ";
        outText += phrasesMiddleUp0[Math.floor(Math.random()*phrasesMiddleUp0.length)] + " ";
        outText += phrasesMiddle0[Math.floor(Math.random()*phrasesMiddle0.length)] + " ";
        outText += phrasesEnd0[Math.floor(Math.random()*phrasesEnd0.length)] + " ";
        outText += Math.floor(Math.random()*1000000) / 100;
        outText += phrasesPriceUnit0[Math.floor(Math.random()*phrasesPriceUnit0.length)];
    }
    else
    {
        outText += phrasesStart1[Math.floor(Math.random()*phrasesStart1.length)] + " ";
        outText += phrasesMiddle1[Math.floor(Math.random()*phrasesMiddle1.length)] + " ";
        outText += phrasesEnd1[Math.floor(Math.random()*phrasesEnd1.length)];
    }

    return outText;
}