window.onload = function(){
  var start = document.getElementById('start');

  start.onclick = function(){
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "app.js";
    document.head.appendChild(s);
    start.style.display = 'none';
  }
}
