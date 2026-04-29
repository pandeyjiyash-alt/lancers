// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
      navList.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
}

// Navbar Scroll Logic
const navbar = document.querySelector('.header');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// Team Profiles Data
const teamProfiles = {
  1: {
    name: 'John Doe',
    role: 'Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80',
    about: 'With 5+ years of experience in full-stack development, I specialize in building scalable web applications. I have successfully delivered projects for startups and enterprises across various industries.',
    skills: ['PHP', 'Laravel', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    experience: '5+ years in full-stack development | 50+ projects completed | 200+ happy clients',
    rate: '$45/hr'
  },
  2: {
    name: 'Sarah Wilson',
    role: 'Frontend Specialist',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80',
    about: 'I create beautiful, responsive, and interactive user interfaces. My expertise lies in modern frontend frameworks and design systems. I focus on delivering exceptional user experiences.',
    skills: ['React', 'Vue.js', 'HTML/CSS', 'JavaScript', 'Figma', 'UI/UX Design', 'Tailwind CSS'],
    experience: '4+ years in frontend development | 80+ projects | Expert in responsive design',
    rate: '$40/hr'
  },
  3: {
    name: 'Mike Chen',
    role: 'Backend Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80',
    about: 'Backend specialist with deep expertise in Python and cloud infrastructure. I build robust, scalable APIs and manage complex database architectures. Performance and security are my priorities.',
    skills: ['Python', 'Django', 'Flask', 'AWS', 'PostgreSQL', 'Redis', 'Kubernetes'],
    experience: '6+ years in backend development | Infrastructure architect | 150+ deployments',
    rate: '$50/hr'
  },
  4: {
    name: 'Emma Garcia',
    role: 'DevOps Specialist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80',
    about: 'DevOps expert focused on automating deployment processes and optimizing infrastructure. I specialize in containerization, orchestration, and setting up CI/CD pipelines for seamless deployments.',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'AWS', 'Terraform', 'Linux'],
    experience: '3+ years in DevOps | 30+ successful deployments | Expert in automation',
    rate: '$55/hr'
  }
};

// Open Profile Modal
function openProfile(id) {
  const profile = teamProfiles[id];
  if (!profile) return;
  
  document.getElementById('profileImage').src = profile.image;
  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('profileRole').textContent = profile.role;
  document.getElementById('profileAbout').textContent = profile.about;
  document.getElementById('profileExperience').textContent = profile.experience;
  document.getElementById('profileRate').textContent = profile.rate;
  
  // Display skills
  const skillsContainer = document.getElementById('profileSkills');
  skillsContainer.innerHTML = profile.skills.map(skill => `<span>${skill}</span>`).join('');
  
  document.getElementById('profileModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close Profile Modal
function closeProfile() {
  document.getElementById('profileModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Hire Freelancer
function hireFreelancer() {
  alert('Thank you for your interest! Please fill out the contact form below.');
  closeProfile();
}

// Scroll to Contact Section
function scrollToContact() {
  closeProfile();
  const contactSection = document.getElementById('contact');
  setTimeout(() => {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('profileModal');
  if (event.target === modal) {
    closeProfile();
  }
}

// Mobile Menu Toggle (Simplified)
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        alert('Menu functionality would open a mobile-specific drawer here.');
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Sending...';
        btn.disabled = true;
        
        // Simulate Success
        setTimeout(() => {
            alert('Thanks for reaching out! I will get back to you soon.');
            btn.innerText = originalText;
            btn.disabled = false;
            contactForm.reset();
        }, 1500);
    });
}

// Reveal animations on scroll using Intersection Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes and observe
document.querySelectorAll('.project-card, .service-item, .stat-card, .hero-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

// Manual observation callback for the visibility class
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
