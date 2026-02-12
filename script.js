const pages = document.querySelectorAll(".page");
const app = document.querySelector("#app");

function setActivePage() {
    pages.forEach(page => {
        const rect = page.getBoundingClientRect();
        const middle = window.innerHeight / 2;

        if (rect.top < middle && rect.bottom > middle) {
            page.classList.add("active");
        } else {
            page.classList.remove("active");
        }
    });
}

app.addEventListener("scroll", setActivePage);
window.addEventListener("load", setActivePage);
