var setSong = function(songNumber) {
  if(currentSoundFile){
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
   formats: [ 'mp3' ],
   preload: true
  });
  setVolume(currentVolume);
};


var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}


var setVolume = function(volume){
  if(currentSoundFile){
    currentSoundFile.setVolume(volume);
  }
};


var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};


var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'//HTML TARGET IS <table class="album-view-song-list">
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;
  var $row = $(template);


  var clickHandler = function(){  //WHY INSIDE createSongRow?
      var songNumber = parseInt($(this).attr('data-song-number'));
        	if (currentlyPlayingSongNumber !== null) {
        		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        		currentlyPlayingCell.html(currentlyPlayingSongNumber);
        	}
        	if (currentlyPlayingSongNumber !== songNumber) {
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            $(this).html(pauseButtonTemplate);
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
        	}
          else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
              $(this).html(playButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.play();
              updateSeekBarWhileSongPlays();
            }
            else {
             $(this).html(playButtonTemplate);
             $('.main-controls .play-pause').html(playerBarPlayButton);
             currentSoundFile.pause();
            }
        	}
};

    var onHover = function(event){
          var songNumberCell = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberCell.attr('data-song-number'));
          if(songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(playButtonTemplate);
          }
    };

    var offHover = function(event){
          var songNumberCell = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberCell.attr('data-song-number'));
          if(songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(songNumber);
          }
          //console.log("songNumber type " + typeof songNumber +
          //"\n currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var $albumImage = $('.album-cover-art'); //necessary here for click function to work

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();
      for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i+1, album.songs[i].title ,album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};


var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            setCurrentTimeInPlayerBar(this.getTime());
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};


var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100; //multi. the ratio to get %
    offsetXPercent = Math.max(0, offsetXPercent); // so not less than 0
    offsetXPercent = Math.min(100, offsetXPercent); //so not more than 100
    var percentageString = offsetXPercent + '%'; //convert % to string and add % sign
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};


var setCurrentTimeInPlayerBar = function(currentTime){
  $('.seek-control .current-time').html(filterTimeCode(currentTime));
};


var setTotalTimeInPlayerBar = function(totalTime) {
  $('.seek-control .total-time').html(filterTimeCode(totalTime));
}


function filterTimeCode (timeInSeconds) {
    var parseAnswer = parseFloat(timeInSeconds);
    var songLengthInMins = Math.floor(parseAnswer / 60);
    var songSecondsRemainder = Math.floor(parseAnswer % 60);
    if (songSecondsRemainder<10) {
        songSecondsRemainder = "0" + songSecondsRemainder;
    }
    return(songLengthInMins + ":" + songSecondsRemainder);
}


var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');
  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left; //pageX jQuery value for horizon. coord.
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
    if($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    }
    else {
      setVolume(seekBarFillRatio * 100);
    }
    updateSeekPercentage($(this), seekBarFillRatio);
  });
  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();
    $(document).bind('mousemove.thumb', function(event){
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;
      if($seekBar.parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      }
      else {
        setVolume(seekBarFillRatio);
      }
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};


var trackIndex = function(album, song){
  return album.songs.indexOf(song);
};


var nextSong = function() {
  var getLastSongNumber = function(index){
    return index == 0 ? currentAlbum.songs.length : index;
  };
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }
  setSong(currentSongIndex+1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};


var previousSong = function() {
  var getLastSongNumber = function(index){
    return index ==(currentAlbum.songs.length-1) ? 1 : index + 2;
  };
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = currentAlbum.songs.length - 1;
    }
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    $('.main-controls .play-pause').html(playerBarPauseButton);
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


var togglePlayFromPlayerBar = function () {
  var info = $('.main-controls .play-pause').html();
  if (info === playerBarPauseButton) {
    ($('.main-controls .play-pause').html() === playerBarPauseButton)
    $('.main-controls .play-pause').html(playerBarPlayButton);
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(playButtonTemplate);
    currentSoundFile.pause();
  }
  else {
    $('.main-controls .play-pause').html(playerBarPauseButton);
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
    currentSoundFile.play();
  }
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPause.click(togglePlayFromPlayerBar);
});

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

  var albums = [albumPicasso, albumMarconi, albumRadiohead];
  var index = 1;
  $albumImage.click(function(){
    setCurrentAlbum(albums[index]);
    index++;
    if(index == albums.length){
      index = 0;
    }
  });
