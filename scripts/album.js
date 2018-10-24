window.onload = function(){ //necessary if no local albums

var urlPassedAlbum = window.location.hash.substr(1);

for(var i=0, len=albums.length; i<len; i++){
  if(albums[i].id == urlPassedAlbum){
    var chosenAlbum = albums[i];
  }
}

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];

albumTitle.innerHTML = chosenAlbum.title;
albumArtist.innerHTML = chosenAlbum.artist;
albumReleaseInfo.innerHTML = chosenAlbum.year + ' ' + chosenAlbum.label;
document.getElementById("fff").src = chosenAlbum.albumArtUrl;

}
