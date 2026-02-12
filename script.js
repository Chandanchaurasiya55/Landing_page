document.addEventListener("DOMContentLoaded", () => {

    /*   PAGE 1 LOGO ANIMATION (REPEAT)   */
  const page1 = document.querySelector("#page1");
  const page1Logo = document.querySelector("#page1 .logo");

  if (page1 && page1Logo) {
    const page1Observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            page1Logo.classList.remove("animate");
            void page1Logo.offsetWidth;       // reflow (restart animation)
            page1Logo.classList.add("animate");
          }
        });
      },
      { threshold: 0.6 }
    );

    page1Observer.observe(page1);
  }


        /*  page 2 , 3 , 4 LOGO ANIMATION (ONCE)  */
  const otherLogos = document.querySelectorAll("#page2 .logo, #page3 .logo, #page4 .logo");

  otherLogos.forEach((logo) => {
    // default hidden state
    logo.style.opacity = "0";
    logo.style.transform = "translateY(-40px) scale(0.8)";
    logo.style.transition = "all 900ms cubic-bezier(.22,.98,.32,1)";
  });

  const logoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const logo = entry.target;

          // Reset animation
          logo.style.transition = "none";
          logo.style.opacity = "0";
          logo.style.transform = "translateY(-40px) scale(0.8)";

          void logo.offsetWidth; // reflow

          // Animate
          logo.style.transition = "all 900ms cubic-bezier(.22,.98,.32,1)";
          logo.style.opacity = "1";
          logo.style.transform = "translateY(0px) scale(1)";
        }
      });
    },
    { threshold: 0.6 }
  );

  otherLogos.forEach((logo) => logoObserver.observe(logo));

});
