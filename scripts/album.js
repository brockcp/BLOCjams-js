var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};
var albumRadiohead = {
   title: 'OK Computer',
   artist: 'Radiohead',
   label: 'Indy',
   year: '1997',
   albumArtUrl: 'assets/images/album_covers/20.png',
   songs: [
       {title: 'The Tourist', duration:'3:43'},
       {title: 'Let Down', duration:'4;44'},
       {title: 'Karma Police', duration:'6:23'},
       {title: 'Fitter Happier', duration:'5:32'},
       {title: 'Electioneering', duration:'5:65'},
   ]
};

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

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    albumSongList.innerHTML = '';

    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

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

window.onload = function() {

  setCurrentAlbum(albumPicasso);

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

  var albums = [albumPicasso, albumMarconi, albumRadiohead];
  var index = 1;

    //ALBUM ROTATE
    albumImage.addEventListener('click',function(event){
      setCurrentAlbum(albums[index]);
      index++;
      if(index == albums.length){
        index = 0;
      }
    });

};
