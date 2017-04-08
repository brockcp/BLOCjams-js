
    var points = document.getElementsByClassName('point');
        //getelementsbyclassname is a selector that
        //returns list of element nodes which use index notation
    var revealPoint = function(index) {
      points[index].style.opacity = 1;
      points[index].style.transform = "scaleX(1) translateY(0)";
      points[index].style.msTransform = "scaleX(1) translateY(0)";
      points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
    for(var i =0; i<points.length; i++){
        revealPoint(i);
    }