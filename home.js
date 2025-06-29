// Slideshow functionality
let slideIndex = 0;
let slides = document.querySelectorAll(".slide");
let slideshowPaused = false;
let slideInterval;

// Create dots for slide navigation
function createDots() {
    const slideDots = document.querySelector(".slide-dots");
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.onclick = function() { 
            slideIndex = i; 
            showSlide(slideIndex);
        };
        slideDots.appendChild(dot);
    }
}

// Display current slide
function showSlide(n) {
    // Update slide index
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    
    // Hide all slides
    slides.forEach(slide => {
        slide.style.opacity = "0";
        slide.style.zIndex = "1";
    });
    
    // Show current slide
    slides[slideIndex].style.opacity = "1";
    slides[slideIndex].style.zIndex = "2";
}

// Change slide manually
function changeSlide(n) {
    pauseSlideshow();
    slideIndex += n;
    showSlide(slideIndex);
    
    // Resume slideshow after 10 seconds of inactivity
    setTimeout(resumeSlideshow, 10000);
}

// Start automatic slideshow
function startSlideshow() {
    // Show first slide immediately
    slides.forEach(slide => {
        slide.style.opacity = "0";
        slide.style.zIndex = "1";
    });
    slides[0].style.opacity = "1";
    slides[0].style.zIndex = "2";
    
    // Clear any existing interval
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    // Start automatic slideshow with 7 second interval
    slideInterval = setInterval(() => {
        if (!slideshowPaused) {
            slideIndex++;
            showSlide(slideIndex);
        }
    }, 7000);
}

// Pause slideshow
function pauseSlideshow() {
    slideshowPaused = true;
}

// Resume slideshow
function resumeSlideshow() {
    slideshowPaused = false;
}

// Initialize slideshow when page loads
window.addEventListener('load', function() {
    startSlideshow();
});

// Chat functionality
function toggleChat() {
    const chatPopup = document.getElementById("chatPopup");
    chatPopup.classList.toggle("hidden");
    
    if (!chatPopup.classList.contains("hidden")) {
        setTimeout(() => chatPopup.classList.add("visible"), 10);
        document.getElementById("userInput").focus();
    } else {
        chatPopup.classList.remove("visible");
    }
}

function createTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    return typingIndicator;
}

function scrollToBottom() {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "bot-message";
    
    // Handle line breaks and formatting
    const formattedMessage = message.split('\n').map(line => {
        if (line.startsWith('•') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
            return `<div class="list-item">${line}</div>`;
        }
        return line;
    }).join('<br>');
    
    messageDiv.innerHTML = formattedMessage;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

async function generateResponse(query) {
    // This is where you would integrate with your AI service
    // For now, we'll use an enhanced local response system
    
    const responses = {
        portfolio: {
            message: "Our portfolio showcases our finest architectural works. You can explore our projects including:\n• Grand Entrance Project\n• K S Reddy Project\n• Lavish Villa\n• The Vijay Lakshmi Silks Project\n• Narayani Silks Project\n• Commercial Project\n\nWould you like to know more about any specific project?",
            followUp: ["Tell me about Grand Entrance", "What's special about K S Reddy Project", "Show me Lavish Villa details"]
        },
        contact: {
            message: "You can reach us through multiple channels:\n📧 Email: info@tecknion.com\n📞 Phone: +91-9876543210\n📍 Address: Hyderabad, India\n\nWould you like to:\n• Schedule a consultation\n• Request a quote\n• Visit our office",
            followUp: ["Schedule consultation", "Request quote", "Office location"]
        },
        about: {
            message: "Tecknion Architects is a premier architectural firm specializing in innovative and sustainable designs. Our expertise includes:\n• Modern Architecture\n• Sustainable Design\n• Interior Design\n• Urban Planning\n• Renovation Projects\n\nWould you like to know more about our team or specific services?",
            followUp: ["Tell me about the team", "What are your specialties", "Show me your awards"]
        },
        services: {
            message: "We offer comprehensive architectural services:\n1. Architectural Design\n   - Residential\n   - Commercial\n   - Institutional\n2. Interior Design\n   - Space Planning\n   - Material Selection\n   - Custom Furniture\n3. 3D Visualization\n4. Construction Management\n5. Sustainable Design\n\nWhich service interests you the most?",
            followUp: ["Tell me about residential design", "What's sustainable design", "Show me 3D visualization examples"]
        },
        process: {
            message: "Our design process is thorough and client-focused:\n1. Initial Consultation\n   - Understanding requirements\n   - Site analysis\n   - Budget discussion\n2. Concept Development\n   - Initial sketches\n   - Material selection\n   - Client feedback\n3. Design Development\n   - Detailed drawings\n   - 3D visualization\n   - Technical specifications\n4. Construction Documentation\n5. Project Management\n\nWould you like details about any specific phase?",
            followUp: ["Tell me about concept development", "What's construction documentation", "How do you handle project management"]
        },
        default: {
            message: "I'm here to help you with information about Tecknion Architects. You can ask me about:\n• Our Projects\n• Services\n• Design Process\n• Team\n• Contact Information\n\nWhat would you like to know?",
            followUp: ["Show me projects", "Tell me about services", "How to contact"]
        }
    };

    // Convert query to lowercase for matching
    query = query.toLowerCase();

    // Determine which response to use
    let response;
    if (query.includes("portfolio") || query.includes("project")) {
        response = responses.portfolio;
    } else if (query.includes("contact") || query.includes("call") || query.includes("email")) {
        response = responses.contact;
    } else if (query.includes("about") || query.includes("who") || query.includes("team")) {
        response = responses.about;
    } else if (query.includes("service") || query.includes("offer") || query.includes("what do you do")) {
        response = responses.services;
    } else if (query.includes("process") || query.includes("work") || query.includes("how do you")) {
        response = responses.process;
    } else {
        response = responses.default;
    }

    // Add follow-up suggestions
    const followUpDiv = document.createElement("div");
    followUpDiv.className = "follow-up-suggestions";
    response.followUp.forEach(suggestion => {
        const button = document.createElement("button");
        button.textContent = suggestion;
        button.onclick = () => {
            addMessage(suggestion, true);
            generateResponse(suggestion);
        };
        followUpDiv.appendChild(button);
    });

    return {
        message: response.message,
        followUp: followUpDiv
    };
}

async function handleInput(event) {
    if (event.key === "Enter") {
        const userInput = document.getElementById("userInput");
        const chatMessages = document.getElementById("chatMessages");
        
        if (userInput.value.trim() === "") return;

        // Display user message
        addMessage(userInput.value, true);

        // Save user query
        const query = userInput.value;
        userInput.value = "";

        // Show typing indicator
        const typingIndicator = createTypingIndicator();
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();

        // Generate and display response
        setTimeout(async () => {
            typingIndicator.remove();
            
            const response = await generateResponse(query);
            addMessage(response.message);
            
            // Add follow-up suggestions
            chatMessages.appendChild(response.followUp);
            scrollToBottom();
        }, 1500);
    }
}

// Close chat when clicking outside
document.addEventListener('click', function(event) {
    const chatPopup = document.getElementById("chatPopup");
    const queryButton = document.querySelector(".query-button");
    
    if (!chatPopup.contains(event.target) && 
        !queryButton.contains(event.target) && 
        !chatPopup.classList.contains("hidden")) {
        toggleChat();
    }
});

// Enable keyboard navigation for slideshow
document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowLeft") {
        changeSlide(-1);
    } else if (event.key === "ArrowRight") {
        changeSlide(1);
    }
});

// Portfolio Side Panel functionality
let currentProjectSlide = 0;
let projectSlides = [];
let projectSlideInterval = null;

// Initialize portfolio functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for slideshow
    const slideshow = document.querySelector('.project-slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', stopSlideshow);
        slideshow.addEventListener('mouseleave', startSlideshow);
    }

    // Add event listener for closing side panel when clicking outside
    const sidePanel = document.getElementById('sidePanel');
    if (sidePanel) {
        sidePanel.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSidePanel();
            }
        });

        // Add event listener for close button
        const closeButton = sidePanel.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', closeSidePanel);
        }

        // Add event listeners for slide arrows
        const prevButton = sidePanel.querySelector('.slide-prev');
        const nextButton = sidePanel.querySelector('.slide-next');
        if (prevButton) {
            prevButton.addEventListener('click', () => changeProjectSlide(-1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => changeProjectSlide(1));
        }
    }

    // Add click handlers to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            expandProject(this);
        });
    });

    // Enhanced header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            
            // Calculate opacity based on scroll position (max 0.9 opacity)
            const scrollOpacity = Math.min(0.9, window.scrollY / 500);
            header.style.backgroundColor = `rgba(20, 20, 20, ${scrollOpacity})`;
            header.style.backdropFilter = `blur(${Math.min(10, window.scrollY / 50)}px)`;
        } else {
            header.classList.remove('scrolled');
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
        }
    });
});

function expandProject(card) {
    console.log('Opening side panel...');
    const sidePanel = document.getElementById('sidePanel');
    const title = card.querySelector('.project-title').textContent;
    const description = card.querySelector('.project-description').textContent;
    const image = card.querySelector('.project-image').src;
    const projectId = card.id;

    // Set the content
    document.querySelector('.panel-title').textContent = title;
    document.querySelector('.panel-description').textContent = description;

    // Clear existing slides
    const slidesContainer = document.querySelector('.project-slides');
    const slideNav = document.querySelector('.slide-nav');
    slidesContainer.innerHTML = '';
    slideNav.innerHTML = '';

    // Project-specific data
    const projectData = getProjectData(projectId, title);
    
    // Update project meta information
    const metaContainer = document.querySelector('.project-meta');
    if (metaContainer) {
        metaContainer.innerHTML = `
            <span><i class="fas fa-calendar-alt"></i> Completed: ${projectData.year}</span>
            <span><i class="fas fa-map-marker-alt"></i> Location: ${projectData.location}</span>
        `;
    }
    
    // Update features list
    const featuresList = document.querySelector('.features-list');
    if (featuresList) {
        featuresList.innerHTML = '';
        projectData.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${feature}</span>`;
            featuresList.appendChild(li);
        });
    }

    // Add slides (using the same image for variations)
    const imageVariations = getImageVariations(image, 5);
    imageVariations.forEach((imgSrc, i) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `project-slide ${i === 0 ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `${title} - View ${i + 1}`;
        slide.appendChild(img);
        slidesContainer.appendChild(slide);

        // Create dot
        const dot = document.createElement('div');
        dot.className = `slide-dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => goToProjectSlide(i);
        slideNav.appendChild(dot);
    });

    // Store slides for navigation
    projectSlides = document.querySelectorAll('.project-slide');
    currentProjectSlide = 0;

    // Show the side panel with animation
    sidePanel.classList.add('active');
    document.body.classList.add('panel-active');
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation to panel content
    const panelContent = document.querySelector('.panel-content');
    if (panelContent) {
        panelContent.style.opacity = '0';
        panelContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            panelContent.style.transition = 'all 0.5s ease';
            panelContent.style.opacity = '1';
            panelContent.style.transform = 'translateY(0)';
        }, 100);
    }

    // Start the slideshow
    startSlideshow();
}

// Helper function to get project-specific data
function getProjectData(projectId, title) {
    // Default data
    const defaultData = {
        year: '2023',
        location: 'Hyderabad, India',
        features: [
            'Modern Design',
            'Sustainable Materials',
            'Energy Efficient',
            'Smart Home Integration'
        ]
    };
    
    // Project-specific data
    const projectsData = {
        'grand-entrance': {
            year: '2023',
            location: 'Hyderabad, India',
            features: [
                'Grand Entrance Design',
                'Premium Materials',
                'Landscaped Gardens',
                'Smart Security Systems'
            ]
        },
        'ks-reddy': {
            year: '2022',
            location: 'Bangalore, India',
            features: [
                'Luxury Villa Design',
                'Infinity Pool',
                'Home Automation',
                'Sustainable Architecture'
            ]
        },
        'lavish-villa': {
            year: '2023',
            location: 'Goa, India',
            features: [
                'Beachfront Property',
                'Open Floor Plan',
                'Natural Materials',
                'Indoor-Outdoor Living'
            ]
        },
        'vijay-lakshmi': {
            year: '2021',
            location: 'Chennai, India',
            features: [
                'Retail Space Design',
                'Customer Flow Optimization',
                'Brand-focused Aesthetics',
                'Energy-efficient Lighting'
            ]
        },
        'narayani-silks': {
            year: '2022',
            location: 'Hyderabad, India',
            features: [
                'Traditional-Modern Fusion',
                'Display-optimized Layout',
                'Custom Lighting Solutions',
                'Heritage Elements'
            ]
        },
        'commercial': {
            year: '2023',
            location: 'Mumbai, India',
            features: [
                'Modern Office Design',
                'Collaborative Spaces',
                'Sustainable Materials',
                'Wellness-focused Elements'
            ]
        }
    };
    
    return projectsData[projectId] || defaultData;
}

// Helper function to create image variations (in a real scenario, you'd use actual different images)
function getImageVariations(baseImage, count) {
    // In a real implementation, you would have different actual images
    // For now, we'll just return the same image multiple times
    return Array(count).fill(baseImage);
}

function closeSidePanel() {
    const sidePanel = document.getElementById('sidePanel');
    sidePanel.classList.remove('active');
    document.body.classList.remove('panel-active');
    document.body.style.overflow = '';
    stopSlideshow();
}

function changeProjectSlide(direction) {
    showProjectSlide(currentProjectSlide + direction);
}

function goToProjectSlide(index) {
    showProjectSlide(index);
}

function showProjectSlide(index) {
    if (index >= projectSlides.length) {
        currentProjectSlide = 0;
    } else if (index < 0) {
        currentProjectSlide = projectSlides.length - 1;
    } else {
        currentProjectSlide = index;
    }

    // Update slides
    projectSlides.forEach(slide => slide.classList.remove('active'));
    projectSlides[currentProjectSlide].classList.add('active');

    // Update dots
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentProjectSlide].classList.add('active');
}

function stopSlideshow() {
    if (projectSlideInterval) {
        clearInterval(projectSlideInterval);
        projectSlideInterval = null;
    }
}

// Contact form submission functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Send data to server
        const response = await fetch('process_form.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            event.target.reset(); // Clear the form
        } else {
            // Show error message
            showFormMessage('Sorry, there was a problem sending your message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('Sorry, there was a problem sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

function showFormMessage(message, type) {
    // Check if message container exists, if not create it
    let messageContainer = document.querySelector('.form-message');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'form-message';
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(messageContainer, contactForm);
    }
    
    // Set message and class
    messageContainer.textContent = message;
    messageContainer.className = `form-message ${type}`;
    
    // Add styles if not already in document
    if (!document.getElementById('form-message-styles')) {
        const styles = document.createElement('style');
        styles.id = 'form-message-styles';
        styles.textContent = `
            .form-message {
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
                font-weight: 500;
                animation: fadeIn 0.3s ease-in-out;
            }
            
            .form-message.success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .form-message.error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageContainer.style.animation = 'fadeOut 0.3s ease-in-out forwards';
        setTimeout(() => {
            messageContainer.remove();
        }, 300);
    }, 5000);
}