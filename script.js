window.onload = function(){
  var start = document.getElementById('start');
  var img = document.getElementById('img');

  start.onclick = function(){
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "app.js";
    document.head.appendChild(s);
    start.style.display = 'none';
    img.style.display = 'none';
  }
}
