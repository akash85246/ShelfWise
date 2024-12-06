let lastScrollTop = 0;
const navbar = document.querySelector("nav");
const menu = document.getElementById("menu");

window.addEventListener("scroll", function () {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    menu.classList.remove("show");
    const isMenuVisible = menu.classList.contains("show");
    openIcon.style.display = isMenuVisible ? "none" : "inline";
    closeIcon.style.display = isMenuVisible ? "inline" : "none";
    navbar.style.top = "-100px";
    menu.style.top = "-100px";
  } else {
    navbar.style.top = "0";
    menu.style.top = "2vh";
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

const menuToggle = document.getElementById("menu-toggle");
const openIcon = document.getElementById("open-icon");
const closeIcon = document.getElementById("close-icon");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
  const isMenuVisible = menu.classList.contains("show");
  openIcon.style.display = isMenuVisible ? "none" : "inline";
  closeIcon.style.display = isMenuVisible ? "inline" : "none";
});

document.addEventListener('DOMContentLoaded', function () {
  toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      showDuration: '1000',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
  };
});