/* Search */

var UI = {};

UI.submitClick = function(){
    document.querySelector('.js-submit').addEventListener('click', function(e){
        var input = document.querySelector('.js-search').value;
        SoundCloudAPI.getTrack(input);
    });
};

UI.enterPress = function(){
    document.querySelector('.js-search').addEventListener('keyup', function(e){
        var input = document.querySelector('.js-search').value;
        if(e.which === 13){
            SoundCloudAPI.getTrack(input);
        }
    });
};

UI.submitClick();
UI.enterPress();

/* Query Soundcloud API */

var SoundCloudAPI = {};

// wrap initialization in anonymous function of Class object
SoundCloudAPI.init = function() {
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });
}

// wrap get tracks in anonymous function of Class object
SoundCloudAPI.getTrack = function(inputValue) {
    SC.get('/tracks', {
        q: inputValue
    }).then(function(tracks) {
        SoundCloudAPI.renderTracks(tracks);
    });
}

SoundCloudAPI.init();

/* Display cards */

SoundCloudAPI.renderTracks = function(tracks) {
    var searchResults = document.querySelector('.js-search-results');
    searchResults.innerHTML = '';

    tracks.forEach(function(track) {

        var card = document.createElement('div');
        card.classList.add('card');

        var image = document.createElement('div');
        image.classList.add('image');

        var artwork = document.createElement('img');
        artwork.classList.add('image_img');
        artwork.src = track.artwork_url || 'https://lorempixel.com/100/100/abstract/';

        var content = document.createElement('div');
        content.classList.add('content');

        var header = document.createElement('div');
        header.classList.add('header');

        var link = document.createElement('a');
        link.href = track.permalink_url;
        link.target = '_blank';
        link.innerHTML = track.title;

        var footer = document.createElement('div');
        footer.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');

        var icon = document.createElement('i');
        icon.classList.add('add', 'icon');

        var subtitle = document.createElement('span');
        subtitle.innerHTML = 'Add to playlist';

        var searchResults = document.querySelector('.js-search-results');

        card.appendChild(image);
        image.appendChild(artwork);

        card.appendChild(content);
        content.appendChild(header);
        header.appendChild(link);

        card.appendChild(footer);
        footer.appendChild(icon);
        footer.appendChild(subtitle);

        footer.addEventListener('click', function(){
            SoundCloudAPI.getEmbed(track.permalink_url);
        });

        searchResults.innerHTML
        searchResults.appendChild(card);

    });
}

/* Add to playlist and play */

SoundCloudAPI.getEmbed = function(url){
    SC.oEmbed(url, {
        maxheight: 166,
        auto_play: false
    }).then(function(embed){

        var sidebar = document.querySelector('.js-playlist');
        var box = document.createElement('div');

        // insert embed object and save sidebar div to localStorage
        box.innerHTML = embed.html;
        sidebar.insertBefore(box, sidebar.firstChild);
        localStorage.setItem('key', sidebar.innerHTML);
    });
}

// load in existing playlist
var sidebar = document.querySelector('.js-playlist');
sidebar.innerHTML = localStorage.getItem('key');
