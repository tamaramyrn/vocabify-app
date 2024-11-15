const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' }); // Scroll ke bagian #services dengan efek smooth
    } else {
        console.error("Element with ID 'services' not found.");
    }
}
