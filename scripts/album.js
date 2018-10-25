
window.onload = function(){ //WHERE TO PUT?

  var urlPassedAlbum = window.location.hash.substr(1); //CATCHES SELECTED ALBUMS ID FROM COLLECTION.HTML
  for(var i=0, len=albums.length; i<len; i++){
    if(albums[i].id == urlPassedAlbum){ //MATCHES urlPassedAlbum TO AN ALBUM WITH SAME ID
      var chosenAlbum = albums[i];  //chosenAlbum BECOMES VAR FOR PAGES ALBUM
    }
  }

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

albumTitle.innerHTML = chosenAlbum.title;
albumArtist.innerHTML = chosenAlbum.artist;
albumReleaseInfo.innerHTML = chosenAlbum.year + ' ' + chosenAlbum.label;
document.getElementById("album-art").src = chosenAlbum.albumArtUrl;

var createSongRow = function(songNumber, songName, songLength) {

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


//LOOP UP DOM TREE TO SELECT PARENT OF ELEMENT WITH SPECIFIED CLASS.
var findParentByClassName = function(element, targetClass) {
    if (element) {
        var currentParent = element.parentElement;
        while (currentParent.className !== targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};

//RETURNS TARGET(ELEMENT) WITH CLASS OF 'song-item-number'
var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
        case 'ion-stop':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);
    // IF NULL THEN SETS TO PAUSE
  if (currentlyPlayingSong === null) {
       songItem.innerHTML = pauseButtonTemplate;
       currentlyPlayingSong = songItem.getAttribute('data-song-number');

    //REVERTS BUTTON BACK TO PLAY BUTTON IF PLAYING BUTTON CLICKED AGAIN
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
       songItem.innerHTML = playButtonTemplate;
       currentlyPlayingSong = null;

  //IF CLICKED SONG IS NOT ACTIVE SET CONTENT OF NEW SONG TO PAUSE BUTTON
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
           var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
           currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
           songItem.innerHTML = pauseButtonTemplate;
           currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null; //NULL SO THAT NO SONG ID'ed AS PLAYING UNTIL SELECTED

songListContainer.addEventListener('mouseover', function(event){
    if (event.target.parentElement.className === 'album-view-song-item'){
        var songItem = getSongItem(event.target);

        if(songItem.getAttribute('data-song-number') !== currentlyPlayingSong){
            songItem.innerHTML = playButtonTemplate;
        }
    }
});

for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
        var songItem = getSongItem(event.target);
        var songItemNumber = songItem.getAttribute('data-song-number');

        if (songItemNumber !== currentlyPlayingSong) {
             songItem.innerHTML = songItemNumber;
         }
    });

 //CLICK
 songRows[i].addEventListener('click', function(event) {
    clickHandler(event.target);
 });
}



}
