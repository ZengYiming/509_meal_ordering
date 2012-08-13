/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-10
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */

//var headline = document.getElementById('headline');
//var inner_html = '<th><a href="http://localhost:8888/">首页</a></th>';

window.onload = function() {
    setHeadLine();
    //alert(title);
}

function setHeadLine() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            document.getElementById('headline').innerHTML = xmlhttp.responseText;
        }
    }

    xmlhttp.open("post", "http://localhost:8888/headline/", true);
    //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //xmlhttp.send("fname=Bill&lname=Gates");
    xmlhttp.send();


}
