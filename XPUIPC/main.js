function onLoad()
{
    document.getElementById("paralaxMiddle").style.filter = "blur(0px)";
    document.getElementById("paralaxBack").style.filter = "blur(0px)";

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
    });
}

