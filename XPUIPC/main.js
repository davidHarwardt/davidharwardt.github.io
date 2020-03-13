function onLoad()
{
    document.getElementById("paralaxMiddle").style.filter = "blur(0px)";
    document.getElementById("paralaxBack").style.filter = "blur(0px)";

    document.querySelector("html").style.filter = "hue-rotate(" + (Math.random() * 20 - 10) + "deg)";

    document.querySelector(".paralaxDiv").addEventListener("scroll", function()
    {
        var paralaxDiv = document.querySelector(".paralaxDiv");

        if(paralaxDiv.scrollTop < 200)
        {
            document.getElementById("paralaxMiddle").style.filter = "blur(" + paralaxDiv.scrollTop / 20 + "px)";
            document.getElementById("paralaxBack").style.filter = "blur(" + paralaxDiv.scrollTop / 20 + "px)";
        }
        else
        {
            document.getElementById("paralaxMiddle").style.filter = "blur(10px)";
            document.getElementById("paralaxBack").style.filter = "blur(10px)";
        }

        //remove "&& paralaxDiv.scrollWidth >= 2000"
        if(paralaxDiv.scrollTop >= window.innerHeight)
        {
            document.getElementById("navDiv").classList.add("active");
        }
        else
        {
            document.getElementById("navDiv").classList.remove("active");
        }
    });
}

function scrollDown()
{
    var paralaxDiv = document.querySelector(".paralaxDiv");

    paralaxDiv.scrollTop = window.innerHeight;
}