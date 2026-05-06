// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');
const smoothScrollLinks = document.querySelectorAll('[data-target]');

if (navToggle && navList) {
  console.log('Mobile menu toggle initialized');
  
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Toggle clicked');
    navList.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.dataset.target;
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      history.replaceState(null, '', window.location.pathname + window.location.search);

      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header') && navList.classList.contains('active')) {
      console.log('Clicked outside, closing menu');
      navList.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
} else {
  console.log('navToggle or navList not found');
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

// Removed openProfile, closeProfile, hireFreelancer, scrollToContact functions

// Supabase setup - replace with your own project values
const supabaseUrl = 'https://ujcqwbkxbkvastfkbxas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY3F3Ymt4Ymt2YXN0ZmtieGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNDY1ODQsImV4cCI6MjA5MzYyMjU4NH0.5PhXC8QKIrAxMXg9uMHufPIb2EtULINLsway4IHu3qQ';
const supabaseNotifyFunction = 'notify-contact'; // Optional Supabase Edge Function for email alerts
const supabaseClient = window.supabase ? supabase.createClient(supabaseUrl, supabaseKey) : null;

async function submitContact(payload) {
  if (!supabaseClient) {
    return { error: new Error('Supabase client is not initialized. Update your Supabase URL and anon key.') };
  }

  const { data, error } = await supabaseClient
    .from('contacts')
    .insert([{ ...payload, source: window.location.pathname, created_at: new Date().toISOString() }]);

  if (error) {
    return { error };
  }

  if (supabaseNotifyFunction) {
    const { error: notifyError } = await supabaseClient.functions.invoke(supabaseNotifyFunction, {
      body: JSON.stringify({
        subject: 'New contact submission',
        payload: { ...payload, source: window.location.pathname }
      })
    });

    if (notifyError) {
      console.warn('Supabase email notification function failed:', notifyError);
    }
  }

  return { data };
}

// Contact Form Handling
const contactForms = document.querySelectorAll('.contact-form-banner, #mainContactForm');
contactForms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const { error } = await submitContact(payload);

    if (error) {
      alert('Something went wrong while sending your message. Please try again.');
      console.error(error);
    } else {
      alert('Thank you! Your message has been sent successfully.');
      form.reset();
    }

    btn.innerText = originalText;
    btn.disabled = false;
  });
});

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
