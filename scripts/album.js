window.onload = function(){ //necessary if no local albums

  var urlPassedAlbum = window.location.hash.substr(1);

  for(var i=0, len=albums.length; i<len; i++){
    if(albums[i].title == urlPassedAlbum){
      var chosenAlbum = albums[i];
    }
  }

  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.innerHTML = chosenAlbum.title;
  albumArtist.innerHTML = chosenAlbum.artist;
  albumReleaseInfo.innerHTML = chosenAlbum.year + ' ' + chosenAlbum.label;
  document.getElementById("fff").src = chosenAlbum.albumArtUrl;


  var createSongRow = function(songNumber, songName, songLength) {
      //HTML TARGET IS <table class="album-view-song-list">
      var template =
         '<tr class="album-view-song-item">'
       + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
       + '  <td class="song-item-title">' + songName + '</td>'
       + '  <td class="song-item-duration">' + songLength + '</td>'
       + '</tr>'
       ;
      return template;
  };

  albumSongList.innerHTML = '';
  for(var j = 0; j<chosenAlbum.songs.length; j++){
    albumSongList.innerHTML += createSongRow(j+1, chosenAlbum.songs[j].title, chosenAlbum.songs[j].duration);
  }


}
