"use strict";

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
///////////////////////////////////////
// Modal window

const openModal = function () {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

const closeModal = function (e) {
	e.preventDefault();
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modal.classList.contains("hidden")) {
		closeModal();
	}
});

//button scrolling
//Page Navigation

btnScrollTo.addEventListener("click", function (e) {
	section1.scrollIntoView({ behavior: "smooth" });
});

// document.querySelectorAll(".nav__link").forEach(function (el) {
// 	el.addEventListener("click", function (e) {
// 		e.preventDefault();
// 		const id = this.getAttribute("href");
// 		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
// 	});
// });

document.querySelector(".nav__links").addEventListener("click", function (e) {
	e.preventDefault();

	//Matching Strategy
	if (e.target.classList.contains("nav__link")) {
		const id = e.target.getAttribute("href");
		console.log(e.target.getAttribute("href"));

		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
	}
});

//Tabbed Component

tabsContainer.addEventListener("click", function (e) {
	//mencari parent terdekat yang mempunyai class operations_tab, kalau tidak ada yang sama, akan mereturn diri sendiri
	const clicked = e.target.closest(".operations__tab");

	//guard clause
	if (!clicked) {
		return;
	}

	//hapus dulu class tab active
	tabs.forEach((t) => t.classList.remove("operations__tab--active"));
	//kemudian ditambahkan lagi pada button yang kita pencet
	clicked.classList.add("operations__tab--active");

	//hapus dulu tabs content yang punya class active
	tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
	//active content area
	document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
});

////////////////////////////////////

//Menu fade animation
const handleHover = function (e, opacity) {
	if (e.target.classList.contains("nav__link")) {
		const link = e.target;
		const siblings = link.closest(".nav").querySelectorAll(".nav__link");
		const logo = link.closest(".nav").querySelector("img");

		siblings.forEach((el) => {
			if (el !== link) {
				el.style.opacity = opacity;
			}
		});

		logo.style.opacity = opacity;
	}
};

nav.addEventListener("mouseover", (e) => handleHover(e, 0.5));
nav.addEventListener("mouseout", (e) => handleHover(e, 1));

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function (e) {
// 	if (window.scrollY > initialCoords.top) {
// 		nav.classList.add("sticky");
// 	} else {
// 		nav.classList.remove("sticky");
// 	}
// });

// const obsCallback = function (entries, observer) {
// 	entries.forEach((entry) => {
// 		console.log(entry);
// 	});
// };
// const obsOptions = {
// 	root: null,
// 	threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(section1);
//cosnt headerH

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries;

	if (entry.isIntersecting === false) {
		nav.classList.add("sticky");
	} else {
		nav.classList.remove("sticky");
	}
};
const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

const revealSelection = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.classList.remove("section--hidden");
	observer.unobserve(entry.target);
};

const allSections = document.querySelectorAll(".section");

const sectionObserver = new IntersectionObserver(revealSelection, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(function (section) {
	sectionObserver.observe(section);
	section.classList.add("section--hidden");
});

//Lazy loading images

//cari elemen img yang mempunyai properti data-src
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
	const [entry] = entries;
	if (!entry.isIntersecting) return;

	entry.target.src = entry.target.dataset.src;

	entry.target.addEventListener("load", function () {
		entry.target.classList.remove("lazy-img");
		console.log("tes");
	});

	observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0.5,
	rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

//slider
const sliders = function () {
	const slides = document.querySelectorAll(".slide");
	const btnRight = document.querySelector(".slider__btn--right");
	const btnLeft = document.querySelector(".slider__btn--left");

	const dotContainer = document.querySelector(".dots");

	const createDots = function () {
		slides.forEach(function (_, i) {
			dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`);
		});
	};

	const getActivate = function (slide) {
		document.querySelectorAll(".dots__dot").forEach((dot) => dot.classList.remove("dots__dot--active"));
		document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
	};

	let curSlide = 0;
	const maxSlide = slides.length;

	const goToSlide = function (slide) {
		slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
	};

	const nextSlide = function () {
		if (curSlide === maxSlide - 1) {
			curSlide = 0;
		} else {
			curSlide++;
		}

		goToSlide(curSlide);
		getActivate(curSlide);
	};

	const prevSlide = function () {
		if (curSlide == 0) {
			curSlide = maxSlide - 1;
		} else {
			curSlide--;
		}

		goToSlide(curSlide);
		getActivate(curSlide);
	};
	const init = function () {
		goToSlide(0);
		createDots();
		getActivate(0);
	};

	init();

	//Event Handlers

	btnRight.addEventListener("click", nextSlide);
	btnLeft.addEventListener("click", prevSlide);

	document.addEventListener("keydown", function (e) {
		if (e.key === "ArrowLeft") {
			prevSlide();
		} else if (e.key === "ArrowRight") {
			nextSlide();
		}
	});

	dotContainer.addEventListener("click", function (e) {
		if (e.target.classList.contains("dots__dot")) {
			const slide = e.target.dataset.slide;
			goToSlide(slide);
			getActivate(slide);
		}
	});
};

sliders();

//////////////////////////////////////////////////////
//console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector(".header");
// const allSection = document.querySelectorAll(".section");

// console.log(allSection); //NodeList(4) [section#section--1.section, section#section--2.section, section#section--3.section, section.section.section--sign-up]

// const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);

// const message = document.createElement("div");
// console.log(message); //<div></div>

// message.classList.add("cookie-message");
//lecture
//memasukkan teks
//message.textContent = "We use cookied for improved functionality and analytics.";

//memasukkan html
//message.innerHTML = 'We use cookied for improved functionality and analytics. <button class= "btn btn--close-cookie">Got it!</button>';

//memasukkan ke header
//header.prepend(message);

//header.append(message);
//header.append(message.cloneNode(true));

//header.before(message);
// header.after(message);

// document.querySelector(".btn--close-cookie").addEventListener("click", function () {
// 	//message.remove();
// 	message.parentElement.removeChild(message);
// });

// console.log(message.parentElement);

// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";

// console.log(message.style.height); //tidak ada apa2
// console.log(message.style.backgroundColor); //rgb(55, 56, 61)

// console.log(getComputedStyle(message)); // mereturn objek berisi properties css
// console.log(getComputedStyle(message).color); //rgb(187, 187, 187)
// console.log(getComputedStyle(message).height); //47.5px

// message.style.height = "px";
// //message.style.height = Number.parseFloat(getComputedStyle(message).height) + 40 + "px";

// document.documentElement.style.setProperty("--color-primary", "orangered");

// const logo = document.querySelector(".nav__logo");
// console.log(logo.alt); //Bankist logo
// console.log(logo.src); //http://127.0.0.1:5500/img/logo.png
// console.log(logo.className); //nav__logo

// //non -standard
// console.log(logo.designer); //undefined
// console.log(logo.getAttribute("designer")); // ardhi

// logo.alt = "Poto mantep";

// logo.setAttribute("company", "bankist");
// console.log(logo.getAttribute("src")); //img/logo.png

// const link = document.querySelector(".nav__link--btn");

// console.log(link.href); //http://127.0.0.1:5500/#
// console.log(link.getAttribute("href")); //#

// console.log(logo.dataset.versiBerapa); //3.0

// logo.classList.add("c", "j");
// logo.classList.remove("c", "j");
// logo.classList.toggle("c");
// logo.classList.add("c");

// logo.className = "ardhi";

// const btnScrollTo = document.querySelector(".btn--scroll-to");

// const section1 = document.querySelector("#section--1");

// btnScrollTo.addEventListener("click", function (e) {
// 	// const s1coords = section1.getBoundingClientRect();
// 	// console.log(s1coords);

// 	// console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);
// 	// console.log("height/width viewport", document.documentElement.clientHeight, document.documentElement.clientWidth);

// 	// window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
// 	// console.log(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
// 	section1.scrollIntoView({ behavior: "smooth" });
// });

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)} , ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector(".nav__link").addEventListener("click", function (e) {
// 	this.style.backgroundColor = randomColor();
// 	console.log("LINK", e.currentTarget);
// });

// document.querySelector(".nav__links").addEventListener(
// 	"click",
// 	function (e) {
// 		this.style.backgroundColor = randomColor();
// 		console.log("CONTAINER", e.currentTarget);
// 	},
// 	true
// );

// document.querySelector(".nav").addEventListener(
// 	"click",
// 	function (e) {
// 		this.style.backgroundColor = randomColor();
// 		console.log("NAV", e.currentTarget);
// 	},
// 	true
// );

// const h1 = document.querySelector("h1");

// console.log(h1.querySelectorAll(".highlight")); //NodeList(2) [span.highlight, span.highlight]
// console.log(h1.childNodes); //NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]
// console.log(h1.children); //HTMLCollection(3) [span.highlight, br, span.highlight]

// h1.firstElementChild.style.color = "white";
// h1.lastElementChild.style.color = "red";
// console.log(h1.parentNode); // <div class="header__title">
// console.log(h1.parentElement); // <div class="header__title">

// h1.closest("body").style.background = "var(--gradient-secondary)";

// console.log(h1.previousElementSibling); //null
// console.log(h1.nextElementSibling); // <h4>A simpler banking experience for a simpler life.</h4>

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach((el) => {
// 	if (el !== h1) {
// 		el.style.background = "blue";
// 	}
// });

// const newArr = Array.from(h1.parentElement.children);
// console.log(newArr);

// window.addEventListener("beforeunload", function (e) {
// 	e.preventDefault();
// 	console.log(e);
// 	e.returnValue = "";
// });
