const totalPages = 39;
let currentPage = 1;
let isTurning = false;
const bookImage = document.getElementById("bookImage");
const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const pageNumber = document.querySelector(".page-number");
const bookContainer = document.querySelector('.book-container');
const mainElement = document.querySelector('main');

// Create page fold effect element
const pageFold = document.createElement('div');
pageFold.className = 'page-fold';
bookImage.parentElement.appendChild(pageFold);

// Function to set background color
function setBackgroundColor() {
    mainElement.style.backgroundColor = 'rgba(128, 0, 0, 0.5)'; // Maroon with 50% opacity
}

// Preload all images
function preloadImages() {
    for(let i = 1; i <= totalPages; i++) {
        const img = new Image();
        img.src = `img/${i}.png`;
    }
}

// Function to calculate viewport center
function calculateViewportCenter() {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const containerHeight = bookContainer.offsetHeight;
    const containerWidth = bookContainer.offsetWidth;
    
    return {
        top: Math.max(0, (viewportHeight - containerHeight) / 2),
        left: Math.max(0, (viewportWidth - containerWidth) / 2)
    };
}

// Function to update image dimensions and centering based on screen size
function updateImageDimensions() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Set base dimensions
    let maxWidth = Math.min(600, screenWidth * 0.9);
    let maxHeight = Math.min(800, screenHeight * 0.7);
    
    // Adjust dimensions based on screen size
    if (screenWidth <= 480) {
        maxHeight = screenHeight * 0.6;
        maxWidth = screenWidth * 0.9;
    } else if (screenWidth <= 768) {
        maxHeight = screenHeight * 0.7;
        maxWidth = screenWidth * 0.8;
    }
    
    // Apply dimensions and centering
    bookImage.style.maxWidth = `${maxWidth}px`;
    bookImage.style.maxHeight = `${maxHeight}px`;
    bookImage.style.width = 'auto';
    bookImage.style.height = 'auto';
    
    // Center the container
    const { top, left } = calculateViewportCenter();
    mainElement.style.minHeight = '100vh';
    mainElement.style.display = 'flex';
    mainElement.style.justifyContent = 'center';
    mainElement.style.alignItems = 'center';
    
    // Ensure the book container is centered
    bookContainer.style.position = 'relative';
    bookContainer.style.display = 'flex';
    bookContainer.style.flexDirection = 'column';
    bookContainer.style.justifyContent = 'center';
    bookContainer.style.alignItems = 'center';
    
    // Update button visibility based on current page
    updateButtonVisibility();
}

// Function to update button visibility
function updateButtonVisibility() {
    prevButton.style.display = currentPage > 1 ? 'flex' : 'none';
    nextButton.style.display = currentPage < totalPages ? 'flex' : 'none';
}

// Function to update page number display
function updatePageNumber() {
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Function to handle page turning
async function turnPage(direction) {
    if (isTurning) return;
    isTurning = true;

    // Add fade animation class
    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
        bookImage.classList.add('page-fade');
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
        bookImage.classList.add('page-fade-back');
    }

    // Update image source with current page number
    bookImage.src = `img/${currentPage}.png`;
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Remove animation classes
    bookImage.classList.remove('page-fade');
    bookImage.classList.remove('page-fade-back');
    
    // Update page number display
    updatePageNumber();
    
    // Update button visibility
    updateButtonVisibility();
    
    // Update dimensions and centering
    updateImageDimensions();
    
    isTurning = false;
}

// Initialize the book
function initializeBook() {
    // Set initial page
    bookImage.src = 'img/1.png';
    
    // Set background color
    setBackgroundColor();
    
    // Set initial dimensions and page number
    updateImageDimensions();
    updatePageNumber();
    updateButtonVisibility();
    
    // Preload all images for smooth transitions
    preloadImages();
}

// Set initial dimensions and add resize listener
window.addEventListener('load', initializeBook);
window.addEventListener('resize', () => {
    updateImageDimensions();
    // Recenter after resize
    const { top, left } = calculateViewportCenter();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        turnPage('next');
    } else if (e.key === 'ArrowLeft') {
        turnPage('prev');
    }
});

// Add touch swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            turnPage('prev');
        } else {
            turnPage('next');
        }
    }
}

// Add button event listeners
prevButton.addEventListener("click", () => turnPage('prev'));
nextButton.addEventListener("click", () => turnPage('next'));
