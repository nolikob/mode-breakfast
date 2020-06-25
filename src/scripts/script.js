const button = document.querySelector(".Navigation-button");
const menu = document.querySelector(".Navigation-menuWrapper");
const menuItems = document.querySelectorAll(".menuItem");
const slideshowItems = document.querySelectorAll(".Slideshow-item");
const dots = document.querySelectorAll(".Slideshow-dot");

let slideIndex = 0;
setSlide(slideIndex);
setInterval(() => slide(1), 3000);

button.addEventListener("click", () => {
  button.classList.toggle("Navigation-button--active");
  menu.classList.toggle("hidden");
});

window.addEventListener("load", () => {
  document.querySelector(".copyright").innerHTML += new Date().getFullYear();
});

window.addEventListener('scroll', function (event) {
  const items = ["food", "about", "home"].map(e => document.getElementById(e));
  const menuItem = menuItemInVieport(items);
	if (menuItem) {
    menuItems.forEach(mItem => mItem.classList.remove("active"));
    menuItems.forEach(item => item.children[0].getAttribute("href").substring(1) === menuItem.getAttribute("id") && item.classList.add("active"))
	}
}, false);

document.addEventListener("click", e => {
  if (!menu.classList.contains("hidden") && typeof menu !== "undefined") {
    const menuProps = menu.getClientRects()[0];
    if (e.y > (menuProps.top + menuProps.height)) {
      menu.classList.toggle("hidden");
      button.classList.toggle("Navigation-button--active");
    }
  }
});

menuItems.forEach(item => item.addEventListener("click", e => {
  menu.classList.toggle("hidden");
  button.classList.toggle("Navigation-button--active");
  e.preventDefault();
  menuItems.forEach(mItem => mItem.classList.remove("active"));
  e.target.parentElement.classList.add("active");
  const c = document.querySelector(e.target.getAttribute("href"));
  const distanceToTop = Math.floor(c.getBoundingClientRect().top);
  console.log({c, distanceToTop});
  window.scrollBy({top: distanceToTop - 79, left: 0, behavior: "smooth"});
}));

function slide(n) {
  showSlide(slideIndex += n);
}

function setSlide(n) {
  showSlide(slideIndex = n)
}

function showSlide(n) {
  if (n >= slideshowItems.length) {
    slideIndex = 0
  } else if (n === -1) {
    slideIndex = slideshowItems.length - 1
  }
  for (let i = 0; i < slideshowItems.length; i++) {
    slideshowItems[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slideshowItems[slideIndex].style.display = "block";
  dots[slideIndex].classList.add("active");
}

function isInViewport(elem) {
  const bounding = elem.getBoundingClientRect();
  return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom * 0.65 <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

function menuItemInVieport(menuItems) {
  for (const item of menuItems) {
    if (isInViewport(item)) {
      return item;
    }
  }
  return null;
}