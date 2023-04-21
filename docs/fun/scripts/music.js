// note: for safari on iOS, need to call play in a user interaction event

function c_music(file) {
	this.start_set = [];
	this.stop_set  = [];
	this.audio_element = new Audio();
    fetch(file)
        .then(response => response.blob())
        .then(blob => {
            this.audio_element.src = URL.createObjectURL(blob);
         })
         .catch(e => log(e));
	this.audio_element.addEventListener('ended', () => {
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	});
	this.audio_element.addEventListener('error', e => {
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
		log('c_music error', file);
	});
}

c_music.prototype.starts = mixin.starts;
c_music.prototype.stops  = mixin.stops;

c_music.prototype.start = function() {
	this.audio_element.play();
};

c_music.prototype.stop = function() {
	this.audio_element.pause();
};

c_music.prototype.rewind = function() {
	this.audio_element.pause();
	this.audio_element.currentTime = 0;	
};

const music = function(file) {
	return new c_music(file);
};

export default music;
