// navbar
const menuBtn = document.querySelector('.toggleBtn');
const centerSide = document.querySelector('.center-menu');

menuBtn.addEventListener('click', () => {
    centerSide.classList.toggle('show');
});

const links = document.querySelectorAll(".center-menu a");
links.forEach(link => {
  link.addEventListener("click", () => {
    centerSide.classList.remove("show");
  });
});

// counter
function startCounter(section) {
  const counters = section.querySelectorAll(".counter");

  counters.forEach(counter => {
    if (counter.dataset.animated === "true") return; 
    const target = +counter.dataset.target;
    const duration = 1200;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(ease * target);
      counter.textContent = "+" + value;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = "+" + target;
        counter.dataset.animated = "true"; 
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

const sections = document.querySelectorAll(".stats, .about");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounter(entry.target);
      observer.unobserve(entry.target); 
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => {
  observer.observe(section);
});

// tools bar
let tools = document.querySelectorAll(".tool");
tools.forEach(tool => tool.dataset.animated = "false");

window.addEventListener("scroll", () => {
  tools.forEach(tool => {
    let top = tool.getBoundingClientRect().top;
    if (top < window.innerHeight - 50 && tool.dataset.animated === "false") {
      let bar = tool.querySelector(".progress span");
      let percent = tool.querySelector(".percent");
      let target = parseInt(bar.dataset.width);
      bar.style.width = bar.dataset.width;

      let count = 0;
      let interval = setInterval(() => {
        if (count >= target) {
          clearInterval(interval);
        } else {
          count++;
          percent.textContent = count + "%";
        }
      }, 15);

      tool.dataset.animated = "true";
    }
  });
});

// view more btn
const cards = document.querySelectorAll('.projects .cards .card');
const viewMoreBtn = document.querySelector('.viewmorebtn');
const lang = document.documentElement.lang;
let showingAll = false;

function showInitialCards() {
    cards.forEach((card, index) => {
        if(index < 3) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
showInitialCards();

viewMoreBtn.addEventListener('click', () => {
    showingAll = !showingAll;
    if(showingAll){
        cards.forEach(card => card.style.display = 'flex');
        if(lang == "ar"){
          viewMoreBtn.innerHTML = 'عرض أقل <i class="fa-solid fa-chevron-up"></i>';
        }else{
          viewMoreBtn.innerHTML = ' View Less <i class="fa-solid fa-chevron-up"></i>';
        }
    } else {
        showInitialCards(); 
        if(lang == "ar"){
          viewMoreBtn.innerHTML = ' عرض المزيد <i class="fa-solid fa-chevron-down"></i>';
        }else{
          viewMoreBtn.innerHTML = ' View More <i class="fa-solid fa-chevron-down"></i>';
        }
      }
});
// scroll to top button
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
// form logic
const form = document.getElementById("contact-form");
const btn = document.getElementById("submitBtn");
console.log(form);
const GOOGLE_FORM_ACTION = "https://script.google.com/macros/s/AKfycbwu0vuNJIzpKD0ohsPJ4jWvT2ts8WxDIkRS-ZFm7vckh873QuGqUUl9V1OBYKN0SSPVfg/exec";

// النصوص
const texts = {
  ar: {
    sending: "جاري الإرسال...",
    success: "تم الإرسال ",
    error: "حدث خطأ",
    default: "أطلب الأن"
  },
  en: {
    sending: "Sending...",
    success: "Sent ",
    error: "Error",
    default: "Send Now"
  }
};

form.addEventListener("submit", function(e) {
  e.preventDefault();

  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }

  btn.value = texts[lang].sending;
  btn.disabled = true;

  const formData = {
    name: document.getElementById("username").value,
    phone: document.getElementById("phonenumber").value,
    email: document.getElementById("email").value,
    details: document.getElementById("details").value
  };

  fetch(GOOGLE_FORM_ACTION, {
    method: "POST",
    body: JSON.stringify(formData),
    mode: "no-cors"
  })
  .then(() => {
    btn.value = texts[lang].success;
    form.reset();
    setTimeout(() => {
      btn.value = texts[lang].default;
      btn.disabled = false;
    }, 5000);

  })
  .catch(() => {
    btn.value = texts[lang].error;

    setTimeout(() => {
      btn.value = texts[lang].default;
      btn.disabled = false;
    }, 5000);
  });

});