document.addEventListener("DOMContentLoaded", () => {

    /*   PAGE 1 LOGO ANIMATION (REPEAT)   */
  const page1 = document.querySelector("#page1");
  const page1Logo = document.querySelector("#page1 .logo");

  if (page1 && page1Logo) {
    const page1Observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Logo animation
            page1Logo.classList.remove("animate");
            void page1Logo.offsetWidth;
            page1Logo.classList.add("animate");

            // Other page1 direct child images animate
            const page1Images = entry.target.querySelectorAll("> img:not(.logo)");
            page1Images.forEach((img, idx) => {
              img.classList.remove("animate-in");
              void img.offsetWidth;
              setTimeout(() => img.classList.add("animate-in"), 300 + (idx * 250));
            });

            // Navbar
            const navbar = entry.target.querySelector(".navbar");
            if (navbar) {
              navbar.classList.remove("animate-in");
              void navbar.offsetWidth;
              setTimeout(() => navbar.classList.add("animate-in"), 250);
            }

            // Social icons
            const socialIcons = entry.target.querySelector(".social-icons");
            if (socialIcons) {
              socialIcons.classList.remove("animate-in");
              void socialIcons.offsetWidth;
              setTimeout(() => socialIcons.classList.add("animate-in"), 300);
            }

            // Bottom text t1
            const t1 = entry.target.querySelector("#t1");
            if (t1) {
              t1.classList.remove("animate-in");
              void t1.offsetWidth;
              setTimeout(() => t1.classList.add("animate-in"), 600);
            }

            // Bottom text t2
            const t2 = entry.target.querySelector("#t2");
            if (t2) {
              t2.classList.remove("animate-in");
              void t2.offsetWidth;
              setTimeout(() => t2.classList.add("animate-in"), 750);
            }

            // Description
            const description = entry.target.querySelector("#page1-description");
            if (description) {
              description.classList.remove("animate-in");
              void description.offsetWidth;
              setTimeout(() => description.classList.add("animate-in"), 900);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    page1Observer.observe(page1);
  }


        /*  PAGE 2, 3, 4 AUTOMATIC ANIMATIONS ON SCROLL  */
  
  const animatePageElements = (pageSelector) => {
    const page = document.querySelector(pageSelector);
    if (!page) return;

    const pageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Logo animation - remove and re-add to replay
            const logo = entry.target.querySelector(".logo");
            if (logo) {
              logo.classList.remove("animate-in");
              void logo.offsetWidth;
              setTimeout(() => logo.classList.add("animate-in"), 20);
            }

            // Navbar animation
            const navbar = entry.target.querySelector(".navbar");
            if (navbar) {
              navbar.classList.remove("animate-in");
              void navbar.offsetWidth;
              setTimeout(() => navbar.classList.add("animate-in"), 180);
            }

            // Image animation (page2, page3, page4)
            const images = entry.target.querySelectorAll("img[src*='page']:not(.logo)");
            images.forEach((img) => {
              img.classList.remove("animate-in");
              void img.offsetWidth;
              setTimeout(() => img.classList.add("animate-in"), 350);
            });

            // Buttons animation
            const buttons = entry.target.querySelectorAll(".btn1, .btn2");
            buttons.forEach((btn, idx) => {
              btn.classList.remove("animate-in");
              void btn.offsetWidth;
              const delay = idx === 0 ? 550 : 850;
              setTimeout(() => btn.classList.add("animate-in"), delay);
            });

            // Description text animation
            const description = entry.target.querySelector(".description");
            if (description) {
              description.classList.remove("animate-in");
              void description.offsetWidth;
              setTimeout(() => description.classList.add("animate-in"), 1100);
            }

            // Social icons animation
            const socialIcons = entry.target.querySelector(".social-icons");
            if (socialIcons) {
              socialIcons.classList.remove("animate-in");
              void socialIcons.offsetWidth;
              setTimeout(() => socialIcons.classList.add("animate-in"), 150);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    pageObserver.observe(page);
  };

  // Trigger animations for pages 2, 3, 4
  animatePageElements("#page2");
  animatePageElements("#page3");
  animatePageElements("#page4");

});
