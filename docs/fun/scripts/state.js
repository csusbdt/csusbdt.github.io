const initial_state = {
	version: '0'
};

let state = null;

let state_string = localStorage.getItem('home');
if (state_string === null) {
	state = initial_state;
} else {
	state = JSON.parse(state_string);
	if (!('version' in state) || state.version !== initial_state.version) {
		state = initial_state;
	}
}

if ('save' in state) throw new Error("'save' not allowed as key in state");

state.save = function() {
	localStorage.setItem('home', JSON.stringify(this));
};

export default state;
