function c_sfx(file, volume) {
	this.file = file;
	if (typeof(volume) === 'undefined') {
		this.volume = 1;
	} else {
		this.volume = volume;
	}
	this.array_buffer = null;  // can only decode once
	this.audio_buffer = null;  // decoded audio data

	this.buffer_source_node = null;  // can only play once
	this.fetching = false;
	this.decoding = false;
	this.fetch();
}

// fetch allowed before user interaction 
// use this function to prefetch audio before user interaction
c_sfx.prototype.fetch = function() {
	if (this.array_buffer !== null) {
		return Promise.resolve(this.array_buffer);
	} else if (this.fetching) {
		return Promise.reject("fetching"); // not sure of this logic
	} else {
		this.fetching = true;
		return fetch(this.file).then(response => {
			if (response.ok) {
				return response.arrayBuffer();
			} else {
				this.fetching = false;
				throw new Error(response.status);
			}
		})
		.then(array_buffer => {
			this.array_buffer = array_buffer;
			this.fetching = false;
			return this.array_buffer;
		});
	}
};

// decode (decompressing) requires an audioContext, which requires user interaction 
// Can only decode array_buffer once!
c_sfx.prototype.decode = function() {
	if (this.audio_buffer !== null) {
		return Promise.resolve(this.audio_buffer);
	} else if (this.decoding) {
		return Promise.reject("decoding");
	} else {
		this.decoding = true;
		return this.fetch()
		.then(array_buffer => {
			return new Promise((resolve, reject) => {
				if (audio_context === null) {
					this.decoding = false;
					return reject("no audio context");
				}
				audio_context.decodeAudioData(
					array_buffer,
					audio_buffer => {
						this.audio_buffer = audio_buffer;
						this.decoding = false;
						resolve(audio_buffer);
					},
					e => {
						this.decoding = false;
						reject(e);
					}
				);
			});
		});
	}
};

c_sfx.prototype.start = function() {
//	if (this.decoding) return;
	this.decode()
	.then(audio_buffer => {
		if (audio_context === null) {
			return;
		}
		const buffer_source_node = audio_context.createBufferSource();
		buffer_source_node.buffer = audio_buffer;
		const gain_node = audio_context.createGain();
		buffer_source_node.connect(gain_node);
		gain_node.connect(audio_context.destination);
		gain_node.gain.setValueAtTime(this.volume, audio_context.currentTime);	
		buffer_source_node.start();
	})
	.catch(() => {}); // does this happen when still decoding?
};

const sfx = function(file, volume) {
	return new c_sfx(file, volume);
};

export default sfx;
