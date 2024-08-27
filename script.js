const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");

const app = {
	currentIndex: 0,
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
			image: "/assets/img/img-05.png",
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
			image: "/assets/img/img-05.png",
		},
	],

	// render data to UI
	render: function () {
		htmls = this.songs.map((song) => {
			return `
                <div class="song">
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
		$(".playlist").innerHTML = htmls.join("");
	},

	// define currentSong for app
	defineProperties: function () {
		Object.defineProperty(this, "currentSong", {
			get: function () {
				return this.songs[this.currentIndex];
			},
		});
	},

	// scroll top
	handleEvents: function () {
		const cd = $(".cd");
		const cdWidth = cd.offsetWidth;
		document.onscroll = function () {
			const scrollTop =
				window.scrollY || document.documentElement.scrollTop;
			const newWidth = cdWidth - scrollTop;

			cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
			cd.style.opacity = (newWidth / cdWidth) * 1;
		};
	},

	// Load the current song into UI
	loadCurrentSong: function () {
		heading.textContent = this.currentSong.name;
		cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
		audio.src = this.currentSong.path;

		console.log(heading, cdThumb, audio);
	},

	start: function () {
		// Declare properties for object
		this.defineProperties();
		// Listen and handle events
		this.handleEvents();

		this.loadCurrentSong();

		// Render playlist
		this.render();
	},
};

app.start();
