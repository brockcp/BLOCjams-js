albumItemTemplate = '';

for(var i=0, len=albums.length; i<len; i++){
  var albumBuild =
     '<div class="collection-album-container column fourth">'
   + '  <a href="album.html#' + albums[i].id +'">'
   + '    <img src="' + albums[i].albumArtUrl + '"/>'
   + '    <div class="collection-album-info caption">'
   + '      <p>'
   + '        <a class="album-name" href="album.html#' + albums[i].id +'">' + albums[i].title + '</a>'
   + '        <br/>'
   + '        <a class="">' + albums[i].artist + '</a>'
   + '        <br/>'
   + '        ' + albums[i].songs.length + ' Tracks'
   + '        <br/>'
   + '      </p>'
   + '    </div>'
   + '  </a>'
   + '</div>'
   ;
   albumItemTemplate = albumItemTemplate + albumBuild;
 }

var collectionContainer = document.getElementsByClassName("album-covers")[0];

collectionContainer.innerHTML += albumItemTemplate;
