document.addEventListener('DOMContentLoaded', function() {
    // Service descriptions
    const serviceDescriptions = {
        'semi-permanent': {
            title: 'Semi-Permanent Nail Polish Gallery',
            description: 'Browse our collection of stunning semi-permanent nail designs. These long-lasting, chip-resistant polishes keep your nails looking perfect for weeks.'
        },
        'gel-nails': {
            title: 'Gel Nails Gallery',
            description: 'Explore our gallery of gel nail designs. Gel nails provide a natural-looking, durable enhancement that strengthens and beautifies your natural nails.'
        },
        'manicure': {
            title: 'Manicure Gallery',
            description: 'View our classic and luxury manicure designs. Our manicures shape your nails, care for your cuticles, and leave your hands looking beautiful.'
        },
        'pedicure': {
            title: 'Pedicure Gallery',
            description: 'Discover our pedicure designs and treatments. Our pedicures rejuvenate tired feet, soften rough skin, and leave your toes perfectly polished.'
        },
        'nail-art': {
            title: 'Nail Art Gallery',
            description: 'Get inspired by our creative nail art designs. From simple patterns to elaborate masterpieces, our nail artists can bring your vision to life.'
        },
        'nail-extensions': {
            title: 'Nail Extensions Gallery',
            description: 'See our nail extension transformations. We offer various techniques to achieve your desired length and shape while maintaining a natural look.'
        }
    };
    
    // Elements
    const galleryGrid = document.getElementById('gallery-grid');
    const serviceDescription = document.getElementById('service-description');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryDesc = document.getElementById('gallery-description');
    const navButtons = document.querySelectorAll('.gallery-nav-btn');
    const carouselModal = document.getElementById('carousel-modal');
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselClose = document.getElementById('close-carousel');
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselCaption = document.getElementById('carousel-caption');
    
    // Get service from URL parameter
    let currentService = new URLSearchParams(window.location.search).get('service') || 'semi-permanent';
    
    // Update active nav button
    function updateActiveButton() {
        navButtons.forEach(button => {
            if (button.dataset.service === currentService) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Update service description
    function updateServiceDescription() {
        const service = serviceDescriptions[currentService];
        
        if (service) {
            serviceDescription.innerHTML = `
                <h2>${service.title}</h2>
                <p>${service.description}</p>
            `;
            
            galleryTitle.textContent = service.title;
            galleryDesc.textContent = service.description;
        }
    }
    
    // Modifica la función loadGalleryImages para que muestre todas las imágenes
    function loadGalleryImages() {
        // Limpia la galería existente
        galleryGrid.innerHTML = '';
        
        // En una aplicación real, obtendrías el número de imágenes desde el servidor
        // Para este ejemplo, vamos a aumentar el número o usar una función para detectar imágenes
        
        // Aumenta este número al total de imágenes que tienes
        const imageCount = 30; // Cambia este número al total de imágenes que tienes
        
        for (let i = 1; i <= imageCount; i++) {
            // Ruta de la imagen
            const imagePath = `images/services/gallery/${currentService}/${i}.jpg`;
            
            // Crea el elemento de la galería
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.index = i - 1;
            
            // Usa una técnica para manejar errores de carga de imágenes
            const img = new Image();
            img.src = imagePath;
            img.alt = `${currentService} design ${i}`;
            
            // Solo agrega imágenes que existen
            img.onload = function() {
                galleryItem.innerHTML = `
                    <img src="${imagePath}" alt="${currentService} design ${i}">
                    <div class="gallery-item-overlay">
                        <h3 class="gallery-item-title">${formatServiceName(currentService)} Design ${i}</h3>
                    </div>
                `;
                
                // Agrega evento de clic para abrir el carrusel
                galleryItem.addEventListener('click', function() {
                    openCarousel(parseInt(this.dataset.index));
                });
                
                galleryGrid.appendChild(galleryItem);
                
                // Actualiza los indicadores del carrusel cuando se carguen todas las imágenes
                updateCarouselIndicators();
            };
            
            // No necesitamos hacer nada si la imagen no existe
            img.onerror = function() {
                // La imagen no existe, simplemente no la agregamos a la galería
            };
        }
    }
    
    // Función para actualizar los indicadores del carrusel
    function updateCarouselIndicators() {
        // Esta función se llamará después de cargar las imágenes
        // para asegurarse de que los indicadores del carrusel estén actualizados
    }
    
    // Format service name for display
    function formatServiceName(service) {
        return service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    // Carousel functionality
    let currentSlide = 0;
    let slides = [];
    
    // Open carousel
    function openCarousel(index) {
        currentSlide = index;
        
        // Get all gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        slides = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-item-title').textContent;
            
            return {
                src: img.src,
                alt: img.alt,
                title: title
            };
        });
        
        // Build carousel slides
        carouselTrack.innerHTML = '';
        carouselIndicators.innerHTML = '';
        
        slides.forEach((slide, i) => {
            // Create slide
            const slideElement = document.createElement('div');
            slideElement.className = 'carousel-slide';
            slideElement.innerHTML = `<img src="${slide.src}" alt="${slide.alt}">`;
            carouselTrack.appendChild(slideElement);
            
            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === currentSlide) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', function() {
                goToSlide(i);
            });
            
            carouselIndicators.appendChild(indicator);
        });
        
        // Position track to show current slide
        updateCarousel();
        
        // Show modal
        carouselModal.classList.add('active');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    // Update carousel position and caption
    function updateCarousel() {
        // Update track position
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update caption
        if (slides[currentSlide]) {
            carouselCaption.innerHTML = `
                <h3>${slides[currentSlide].title}</h3>
                <p>${formatServiceName(currentService)} Collection</p>
            `;
        }
        
        // Update indicators
        const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, i) => {
            if (i === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Next slide
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        updateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        updateCarousel();
    }
    
    // Close carousel
    function closeCarousel() {
        carouselModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentService = this.dataset.service;
            
            // Update URL without reloading the page
            const url = new URL(window.location);
            url.searchParams.set('service', currentService);
            window.history.pushState({}, '', url);
            
            updateActiveButton();
            updateServiceDescription();
            loadGalleryImages();
        });
    });
    
    // Carousel navigation
    if (carouselPrev) {
        carouselPrev.addEventListener('click', prevSlide);
    }
    
    if (carouselNext) {
        carouselNext.addEventListener('click', nextSlide);
    }
    
    if (carouselClose) {
        carouselClose.addEventListener('click', closeCarousel);
    }
    
    // Close carousel with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && carouselModal.classList.contains('active')) {
            closeCarousel();
        }
    });
    
    // Swipe functionality for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselModal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselModal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next slide
            nextSlide();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous slide
            prevSlide();
        }
    }
    
    // Initialize gallery
    updateActiveButton();
    updateServiceDescription();
    loadGalleryImages();
});