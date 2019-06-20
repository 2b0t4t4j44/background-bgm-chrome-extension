(function () {
  'use strict';

  customElements.define('bgm-time-display', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._append('span', { class: 'bgm-time-current', id: 'data-current' });
      this._append('span', { class: 'bgm-time-separator', innerText: ' / ' });
      this._append('span', { class: 'bgm-time-duration', id: 'data-duration' });
    }
    static get observedAttributes() {
      return ['data-current', 'data-duration'];
    }
    _append(tag, opt) {
      return this.shadowRoot
        .appendChild(Object.assign(document.createElement(tag), opt));
    }
    _parseTime(sec) {
      return !sec ? '0:00' :
        (sec < 3600 ? [sec / 60, sec % 60] : [sec / 3600, sec / 60 % 60, sec % 60])
          .map(t => ('00' + Math.floor(t)).slice(-2))
          .join(':')
          .replace(/^0/, '');
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this.shadowRoot.getElementById(attr).innerText = this._parseTime(newValue);
    }
  });
  customElements.define('bgm-search-result-card', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' })
        .appendChild(this._template.cloneNode(this));
    }
    get _template() {
      return document.getElementById('bgmSearchResultCard').content;
    }
    set item({ id, snippet }) {
      this._append('span', { slot: 'title', innerText: snippet.title });
      this._append('span', { slot: 'channelTitle', innerText: snippet.channelTitle });
      this._append('img', { slot: 'thumbnail', src: snippet.thumbnails.default.url });
      this._append('p', { slot: 'description', innerText: snippet.description });
      this.dataset.videoId = id.videoId;
      this.dataset.channelId = snippet.channelId;
    }    
    _append(tag, opt) {
      return this.appendChild(Object.assign(document.createElement(tag), opt));
    }    
  });
  customElements.define('bgm-search-result', class extends HTMLElement {
    set items(items) {
      this.innerHTML = '';
      items.forEach((item) => {
        this.appendChild(document.createElement('bgm-search-result-card')).item = item;
      });
    }
    get videoId() {
      return this.firstChild ? this.firstChild.dataset.videoId : '';
    }
    close() {
      this.innerHTML = ''
    } 
    next() {
      this.firstChild ? this.insertBefore(this.firstChild, this.lastChild) : null;
    }
    prev() {
      this.firstChild ? this.insertBefore(this.lastChild, this.firstChild) : null;
    }
  });
  customElements.define('bgm-playlist-select', class extends HTMLSelectElement {
    appendOption(name, value) {
      return this._append('option', { innerText: name, value: value });
    } 
    _append(tag, opt) {
      return this.appendChild(Object.assign(document.createElement(tag), opt));
    }    
  }, { extends: 'select' });
})();