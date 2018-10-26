$(window).load(function(){

  var $collectionContainer = $('.album-covers');
  $collectionContainer.empty(); //.empty() replaces innerHTML=''

  for (var i=0, len=albums.length; i<len; i++) {
      var template =
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
      var $newThumbnail = template;
      $collectionContainer.append($newThumbnail); //.append replaces +=
  }
});
