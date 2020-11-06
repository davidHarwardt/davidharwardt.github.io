document.body.onclick = () =>
{
    if(document.getElementsByTagName("title")[0].innerHTML.split(".").length > 1)
    {
        document.location.href = "../page" + (parseInt(document.getElementsByTagName("title")[0].innerHTML.split(".")[0]) + 1) + "/page.html";
    }
};

window.onkeydown = (ev) =>
{
    if(ev.keyCode == 39)
    {
        if(document.getElementsByTagName("title")[0].innerHTML.split(".").length > 1)
        {
            //next slide
            document.location.href = "../page" + (parseInt(document.getElementsByTagName("title")[0].innerHTML.split(".")[0]) + 1) + "/page.html";
        }
    }
    else if( ev.keyCode == 37)
    {
        if(parseInt(document.getElementsByTagName("title")[0].innerHTML.split(".")[0]) > 1)
        {
            //prev slide
            document.location.href = "../page" + (parseInt(document.getElementsByTagName("title")[0].innerHTML.split(".")[0]) - 1) + "/page.html";
        }
        else if(document.getElementsByTagName("title")[0].innerHTML == "MSA")
        {
            document.location.href = "../page13/page.html";
        }
    }
}