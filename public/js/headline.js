/**
 * Created with JetBrains WebStorm.
 * User: zengyiming
 * Date: 12-8-10
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */

var headline = document.getElementById('headline');

window.onload = function() {

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

    xmlhttp.open("post", "http://localhost:8888/headline/", true);
    xmlhttp.send();
}
