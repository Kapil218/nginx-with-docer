// API base URL - adjust based on your backend container
const API_BASE_URL = '';

// DOM elements
const userForm = document.getElementById('userForm');
const usersContainer = document.getElementById('users');
const healthResult = document.getElementById('health-result');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Frontend application initialized');
    
    // Set up form submission
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }
    
    // Load initial data
    loadUsers();
    checkHealth();
});

// Check backend health
async function checkHealth() {
    try {
        showLoading(healthResult);
        
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        
        if (response.ok) {
            healthResult.innerHTML = `
                <div class="health-healthy">
                    <h4>✅ Backend is healthy!</h4>
                    <h2>${data.message}</h2>
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Database:</strong> ${data.database}</p>
                    <p><strong>Timestamp:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                </div>
            `;
        } else {
            throw new Error(data.error || 'Health check failed');
        }
    } catch (error) {
        console.error('Health check failed:', error);
        healthResult.innerHTML = `
            <div class="health-unhealthy">
                <h4>❌ Backend is not responding</h4>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Make sure the backend container is running and accessible.</p>
            </div>
        `;
    }
}

// Load users from the backend
async function loadUsers() {
    try {
        showLoading(usersContainer);
        
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const users = await response.json();
        
        if (response.ok) {
            displayUsers(users);
        } else {
            throw new Error(users.error || 'Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        usersContainer.innerHTML = `
            <div class="error">
                <h4>Error loading users</h4>
                <p>${error.message}</p>
                <p>Please check if the backend is running and try again.</p>
            </div>
        `;
    }
}

// Display users in the UI
function displayUsers(users) {
    if (users.length === 0) {
        usersContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h4>No users found</h4>
                <p>Add some users using the form above!</p>
            </div>
        `;
        return;
    }
    
    const usersHTML = users.map(user => `
        <div class="user-card">
            <h4>${escapeHtml(user.name)}</h4>
            <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Created:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
        </div>
    `).join('');
    
    usersContainer.innerHTML = usersHTML;
}

// Handle user form submission
async function handleUserSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim()
    };
    
    // Basic validation
    if (!userData.name || !userData.email) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(userData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        // Disable form during submission
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading"></span> Adding...';
        
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(`User "${result.name}" added successfully!`, 'success');
            event.target.reset(); // Clear the form
            loadUsers(); // Refresh the users list
        } else {
            throw new Error(result.error || 'Failed to add user');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showMessage(`Error: ${error.message}`, 'error');
    } finally {
        // Re-enable form
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Add User';
    }
}

// Utility functions
function showLoading(container) {
    container.innerHTML = '<div class="loading"></div>';
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Insert after the form
    const form = document.getElementById('userForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export functions for global access
window.checkHealth = checkHealth;
window.loadUsers = loadUsers;
