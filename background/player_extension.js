// make sure the script is loaded after ytplayer is ready
(function () {
  'use strict';

  this.PLAYER_STATES = {
    '-1': 'UNSTARTED',
    '0': 'ENDED',
    '1': 'PLAYING',
    '2': 'PAUSED',
    '3': 'BUFFERING',
    '5': 'CUED'
  }
  this.state = {
    loop: false,
    loopOne: false,
    shuffle: false    
  }
  this.focus = function () {
    this.a.focus();
  }
  this.getPlayerStateString = function() {
    return this.PLAYER_STATES[this.getPlayerState()];
  }
  this.getThumbnailUrl = function () {
    return (id => id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`: '')
      (this.getVideoId());
  }
  this.getVideoAuthor = function () {
    return (data => data ? data.author : '')(this.getVideoData());
  }
  this.getVideoId = function () {
    return (data => data ? data.video_id : '')(this.getVideoData());
  }
  this.getVideoTitle = function () {
    return (data => data ? data.title : '')(this.getVideoData());
  }
  this.getVolumeState = function () {    
    return this.isMuted() ? 'MUTE' : 
      (vol => vol > 49 ? 'UP' : vol > 1 ? 'DOWN' : 'OFF')(this.getVolume());
  }
  this.loadPlaylistById = function (playlistId) {
    playlistId ? this.loadPlaylist({ listType: 'playlist', list: playlistId }) : null;
  }
  this.minimizeData = function () {
    if (!['small', 'medium'].includes(this.getPlaybackQuality())) {
      this.setPlaybackQuality('small');
    }
  }
  this.openVideoUrl = function () {
    window.open(this.getVideoUrl());
  }
  this.openPlaylistUrl = function () {
    !this.l ? 0 :
      !this.l.playlistId ? 0 :
        window.open(`https://www.youtube.com/playlist?list=${this.l.playlistId}`);
  }
  this._createRequest = function (method, params) {
    return ((m, p) => new Request(`https://www.googleapis.com/youtube/v3/${m}?${p}`))
      (method, Object.entries(params).map(entry => entry.join('=')).join('&'));
  }
  this.search = function (query) {
    return fetch(this._createRequest('search', {
      part: 'snippet',
      q: query,
      type: 'video',
      key: 'AIzaSyDPVsDVt62jNBFQrfu2IBJloNv3sUHz9eQ'
    })).then(response => response.json());
  }
  this.playlists = function (playlistId) {    
    return fetch(this._createRequest('playlists', {
      part: 'snippet',
      id: playlistId,
      key: 'AIzaSyDPVsDVt62jNBFQrfu2IBJloNv3sUHz9eQ'
    })).then(response => response.json());
  }
  this.toggleMute = function () {
    this.isMuted() ? this.unMute() : this.mute();
  }
  this.toggleLoop = function () {
    this.state.loop = !this.state.loop;
    this.setLoop(this.state.loop);
    return this.state.loop;
  }
  this.toggleShuffle = function () {
    this.state.shuffle = !this.state.shuffle;
    this.setShuffle(this.state.shuffle);
    return this.state.shuffle;
  }
  console.log('Applied player extension.', this);
}).call(window.BGM.player);