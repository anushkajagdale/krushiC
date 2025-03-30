// Function to navigate to a specific page
function navigateTo(page) {
    window.location.href = page;
}

// Function to handle search functionality
function search(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        alert(`Search functionality is not implemented yet. Query: ${query}`);
    } else {
        alert('Please enter a search term.');
    }
}

// Function to register labour
async function registerLabour(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const location = document.getElementById('location').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const amount = document.getElementById('amount').value.trim();

    if (!name || !location || !phone || !amount) {
        alert('Please fill in all fields.');
        return;
    }

    const labourData = { name, location, phone, amount };

    try {
        const response = await fetch('http://localhost:3000/api/labour/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(labourData),
        });

        if (!response.ok) {
            throw new Error('Failed to register labour.');
        }

        const result = await response.json();
        alert(`Labour registered successfully! ID: ${result.id}`);
        document.getElementById('register-labour-form').reset();
    } catch (error) {
        console.error('Error registering labour:', error);
        alert('Failed to register labour. Please try again.');
    }
}

// Function to load labour list
async function loadLabourList() {
    const labourListContainer = document.getElementById('labour-list');
    if (!labourListContainer) return;

    labourListContainer.innerHTML = 'Loading...';

    try {
        const response = await fetch('http://localhost:3000/api/labour');
        if (!response.ok) {
            throw new Error('Failed to fetch labour list.');
        }

        const labourList = await response.json();
        labourListContainer.innerHTML = '';

        labourList.forEach((labour) => {
            const labourCard = document.createElement('div');
            labourCard.classList.add('labour-card');
            labourCard.innerHTML = `
                <p><strong>Name:</strong> ${labour.name}</p>
                <p><strong>Location:</strong> ${labour.location}</p>
                <p><strong>Phone:</strong> ${labour.phone}</p>
                <p><strong>Rent per Day:</strong> $${labour.rent_per_day}</p>
            `;
            labourListContainer.appendChild(labourCard);
        });
    } catch (error) {
        console.error('Error loading labour list:', error);
        labourListContainer.innerHTML = 'Failed to load labour list.';
    }
}

// Function to initialize the page
function initializePage() {
    if (window.location.pathname.includes('register-labour.html')) {
        const registerForm = document.getElementById('register-labour-form');
        if (registerForm) {
            registerForm.addEventListener('submit', registerLabour);
        }
    }

    if (window.location.pathname.includes('hire-labour.html')) {
        loadLabourList();
    }
}

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);
