const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER_CONFIG";
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const previousBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
	currentIndex: 0,
	isPlay: false,
	isRandom: false,
	isRepeat: false,
	// Parse to render UI
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
	// Set and stringify to store in localStorage
	setConfig: function (key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},
	songs: [
		{
			name: "Dung lam trai tim anh dau",
			singer: "Son Tung M-TP",
			path: "./assets/music/song-01.mp3",
			image: "./assets/img/img-01.png",
		},
		{
			name: "Mong Du",
			singer: "AMEE",
			path: "./assets/music/song-02.mp3",
			image: "./assets/img/img-02.png",
		},
		{
			name: "2 4",
			singer: "W/N",
			path: "./assets/music/song-03.mp3",
			image: "./assets/img/img-03.png",
		},
		{
			name: "id thang may",
			singer: "W/N, 267",
			path: "./assets/music/song-04.mp3",
			image: "./assets/img/img-04.png",
		},
		{
			name: "Sau con mua",
			singer: "CoolKid",
			path: "./assets/music/song-05.mp3",
			image: "./assets/img/img-05.png",
		},
		{
			name: "Dung lam trai tim anh dau",
			singer: "Son Tung M-TP",
			path: "./assets/music/song-01.mp3",
			image: "./assets/img/img-01.png",
		},
		{
			name: "Mong Du",
			singer: "AMEE",
			path: "./assets/music/song-02.mp3",
			image: "./assets/img/img-02.png",
		},
		{
			name: "2 4",
			singer: "W/N",
			path: "./assets/music/song-03.mp3",
			image: "./assets/img/img-03.png",
		},
		{
			name: "id thang may",
			singer: "W/N, 267",
			path: "./assets/music/song-04.mp3",
			image: "./assets/img/img-04.png",
		},
		{
			name: "Sau con mua",
			singer: "CoolKid",
			path: "./assets/music/song-05.mp3",
			image: "./assets/img/img-05.png",
		},
	],

	// Render data to UI
	render: function () {
		htmls = this.songs.map((song, index) => {
			return `
                <div class="song ${
					this.currentIndex === index ? "active" : ""
				}" data-id="${index}">
					<div
						class="thumb"
						style="background-image: url('${song.image}')"
					></div>
					<div class="body">
						<h3 class="title">${song.name}</h3>
						<p class="author">${song.singer}</p>
					</div>
					<div class="option">
						<i class="fas fa-ellipsis-h"></i>
					</div>
				</div>
            `;
		});
		playlist.innerHTML = htmls.join("");
	},

	// Define properties for app
	defineProperties: function () {
		Object.defineProperty(this, "currentSong", {
			get: function () {
				return this.songs[this.currentIndex];
			},
		});
	},

	// Handle all events
	handleEvents: function () {
		const _this = this;
		const cdWidth = cd.offsetWidth;

		// Handle CD rotate
		const cdThumbAnimation = cdThumb.animate(
			[
				{
					transform: "rotate(360deg)",
				},
			],
			{
				duration: 10000,
				iterations: Infinity,
			}
		);
		cdThumbAnimation.pause();

		// Handle scroll up/ down
		document.onscroll = () => {
			const scrollTop =
				window.scrollY || document.documentElement.scrollTop;
			const newWidth = cdWidth - scrollTop;

			cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
			cd.style.opacity = (newWidth / cdWidth) * 1;
		};

		// Handle play/ pause button
		playBtn.onclick = () => {
			if (_this.isPlay) {
				audio.pause();
			} else {
				audio.play();
			}
		};

		// Handle play property
		audio.onplay = () => {
			_this.isPlay = true;
			player.classList.add("playing");
			cdThumbAnimation.play();
		};

		// Handle pause property
		audio.onpause = () => {
			_this.isPlay = false;
			player.classList.remove("playing");
			cdThumbAnimation.pause();
		};

		// Handle progress bar
		audio.ontimeupdate = () => {
			if (audio.duration) {
				const currentTime = (audio.currentTime / audio.duration) * 100;
				progress.value = currentTime;
			}
		};

		// Handle seek, using oninput instead of using onchange, avoid shaky
		progress.oninput = (e) => {
			const timeInput = (e.target.value * audio.duration) / 100;
			audio.currentTime = timeInput;
		};

		// Handle next song button
		nextBtn.onclick = () => {
			if (_this.isRandom) {
				_this.randomSong();
			} else {
				_this.nextSong();
			}
			audio.play();
			_this.scrollIntoActiveSong();
		};

		// Handle previous song button
		previousBtn.onclick = () => {
			if (_this.isRandom) {
				_this.randomSong();
			} else {
				_this.previousSong();
			}
			audio.play();
			_this.scrollIntoActiveSong();
		};

		// Handle random song button
		randomBtn.onclick = (e) => {
			_this.isRandom = !_this.isRandom;
			_this.setConfig("isRandom", _this.isRandom);
			e.target.closest(".btn").classList.toggle("active");
		};

		// Handle when ended
		audio.onended = () => {
			if (_this.isRepeat) {
				audio.play();
			} else {
				nextBtn.click();
			}
		};

		// Handle repeat button
		repeatBtn.onclick = (e) => {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig("isRepeat", _this.isRepeat);
			e.target.closest(".btn").classList.toggle("active");
		};

		// Listening playlist
		playlist.onclick = (e) => {
			if (e.target.closest(".option")) return;
			const song = e.target.closest(".song:not(.active)");
			if (song) {
				const index = song.dataset.id;
				_this.currentIndex = index;
				_this.loadCurrentSong();
				audio.play();
				_this.scrollIntoActiveSong();
			}
		};
	},

	// Handle scroll into view
	scrollIntoActiveSong: function () {
		setTimeout(() => {
			$(".song.active").scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, 300);
	},

	// Load config
	loadConfig: function () {
		this.isRandom = this.config.isRandom;
		this.isRepeat = this.config.isRepeat;
	},

	renderConfig: function () {
		if (this.isRandom) randomBtn.classList.toggle("active");
		if (this.isRepeat) repeatBtn.classList.toggle("active");
	},

	// Load the current song into UI
	loadCurrentSong: function () {
		heading.textContent = this.currentSong.name;
		cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
		audio.src = this.currentSong.path;
		this.activeSong();
	},

	// Calculate next song
	nextSong: function () {
		this.currentIndex++;
		if (this.currentIndex > this.songs.length - 1) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},

	// Calculate previous song
	previousSong: function () {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1;
		}
		this.loadCurrentSong();
	},

	// Handle random algorithms
	randomSong: function () {
		let newIndexSong;
		do {
			newIndexSong = Math.floor(Math.random() * this.songs.length);
		} while (newIndexSong === this.currentIndex);
		this.currentIndex = newIndexSong;
		this.loadCurrentSong();
	},

	// Handle active song
	activeSong: function () {
		const currentSongBlock = $(`.song[data-id="${this.currentIndex}"]`);
		if (currentSongBlock) {
			$(".song.active").classList.remove("active");
			currentSongBlock.classList.add("active");
		}
	},

	start: function () {
		// Load config
		this.loadConfig();

		// Render config
		this.renderConfig();

		// Declare properties for object
		this.defineProperties();

		// Set up listen and handle events
		this.handleEvents();

		// Load the first song
		this.loadCurrentSong();

		// Render playlist
		this.render();
	},
};

app.start();
