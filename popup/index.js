'use strict';

const $ = selector => document.querySelector(selector);
const $on = (event, selector, fn, opt) => $(selector).addEventListener(event, fn, opt);

$on('click', '#debugReload', _ => chrome.runtime.reload());

chrome.runtime.connect()
  .onMessage.addListener(fn => window[fn]());

function syncPlayer() {
  chrome.runtime.getBackgroundPage(({ BGM: { player } }) => {
    $on('input', '#bgmProgressSlider', e => player.seekTo(e.target.value));
    $on('input', '#bgmProgressSlider', e => $('#bgmProgressBar').value = e.target.value);

    $on('click', '#bgmVideoPrev', _ => player.previousVideo());
    $on('click', '#bgmVideoPlay', _ => player.playVideo());
    $on('click', '#bgmVideoPause', _ => player.pauseVideo());
    $on('click', '#bgmVideoReplay', _ => player.replayVideo());
    $on('click', '#bgmVideoNext', _ => player.nextVideo());

    $on('click', '#bgmVolume', function () {
      setTimeout(() => this.dataset.state = player.getVolumeState(), 500);
    });
    $on('click', '#bgmVolumeIcon', _ => player.toggleMute());
    $on('input', '#bgmVolumeSlider', e => player.setVolume(e.target.value));

    $on('click', '#bgmSearchResultPrev', _ => $('#bgmSearchResult').prev());
    $on('click', '#bgmSearchResultNext', _ => $('#bgmSearchResult').next());
    $on('click', '#bgmSearchResultClose', _ => $('#bgmSearchResult').close());
    $on('click', '#bgmSearchResult', function () { player.loadVideoById(this.videoId); });
    $on('keyup', '#bgmSearchBox', e => {
      if (e.key === "Enter" && e.target.value) {
        player.search(e.target.value)
          .then(response => $('#bgmSearchResult').items = response.items);
      }
    });

    $on('click', '#bgmVideoOpenUrl', _ => player.openVideoUrl());
    $on('click', '#bgmPlaylistOpenUrl', _ => player.openPlaylistUrl());
    $on('click', '#bgmPlaylistLoop', function () { this.dataset.state = player.toggleLoop(); });
    $on('click', '#bgmPlaylistShuffle', function () { this.dataset.state = player.toggleShuffle(); });
    $on('change', '#bgmPlaylistSelect', e => player.loadPlaylistById(e.target.value));
  });
}

function syncData() {
  chrome.runtime.getBackgroundPage(({ BGM: { player } }) => {
    const state = player.getPlayerStateString();
    const bar = $('#bgmProgressBar');
    const slider = $('#bgmProgressSlider');
    const time = $('#bgmTimeDisplay');
    
    $('#bgmHeader').style.backgroundImage = `url("${player.getThumbnailUrl()}")`;
    $('#bgmHeaderAuthor').innerText = player.getVideoAuthor() || '';
    $('#bgmHeaderTitle').innerText = player.getVideoTitle() || 'Loading...';
    $('#bgmVideoState').dataset.state = state || '-1';
    $('#bgmVolumeSlider').value = player.getVolume() || 0;
    $('#bgmVolume').dataset.state = player.getVolumeState();
    $('#bgmPlaylistLoop').dataset.state = player.state.loop;
    $('#bgmPlaylistShuffle').dataset.state = player.state.shuffle;

    time.dataset.current = bar.value = slider.value = player.getCurrentTime() || 0;
    time.dataset.duration = bar.max = slider.max = player.getDuration() || 0;

    clearInterval(window.intervalId);
    if (state == 'PLAYING') {
      window.intervalId = setInterval(() => {
        time.dataset.current = bar.value = slider.value = player.getCurrentTime() || 0;
      }, 1000);
    }
  });
}