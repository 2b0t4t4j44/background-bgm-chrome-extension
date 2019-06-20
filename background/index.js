'use strict';

var BGM = { player: null, ready: false };

const $append = (tag, opt) => document.body
  .appendChild(Object.assign(document.createElement(tag), opt));

chrome.runtime.onConnect.addListener((port) => {
  BGM.syncPlayer = () => port.postMessage('syncPlayer') || BGM.syncData();
  BGM.syncData = () => port.postMessage('syncData');
  BGM.ready ? BGM.syncPlayer() : loadYouTubeAPI();
  port.onDisconnect.addListener(() => BGM.syncPlayer = BGM.syncData = () => false);
});

function loadYouTubeAPI() {
  $append('div', { id: 'player' });
  $append('script', { src: 'assets/iframe.api.js' });
}

function onYouTubeIframeAPIReady() {
  BGM.player = new YT.Player('player', {
    playerVars: { 'autoplay': 1 },
    events: {
      onReady: onReady,
      onPlaybackQualityChange: onQualityChange,
      onStateChange: onStateChange
    }
  });
  $append('script', { src: 'background/player_extension.js' });
}

function onReady({ target }) {
  console.log('Ready to play video.');
  target.loadPlaylistById('PL0bHKk6wuUGLWGipKSf0dFrpuzDitERqD');
  target.focus();
  BGM.syncPlayer();
  BGM.ready = true;
}

function onQualityChange({ data, target }) {
  console.log(`Quality -> ${data}.`);
  target.minimizeData();
}

function onStateChange({ target }) {
  console.log(target.getPlayerStateString(), target.getVideoTitle());
  BGM.syncData();
}