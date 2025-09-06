// Admin Dashboard JavaScript
let contentData = {};
let isAuthenticated = false;

// GitHub API Configuration
const GITHUB_CONFIG = {
    // These will be set via environment variables in Vercel
    token: null, // Will be loaded from environment
    owner: 'RCBibwewadi', // Replace with your GitHub username
    repo: 'web', // Replace with your repository name
    filePath: 'data/content.json'
};

// Initialize GitHub config (you'll set this up in Vercel environment variables)
function initGitHubConfig() {
    // For now, we'll hardcode the values since environment variables in Vercel
    // are not directly accessible in client-side JavaScript
    // You'll need to provide your token here temporarily for testing
    GITHUB_CONFIG.token = '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'; // Replace with your actual token
    GITHUB_CONFIG.owner = 'RCBibwewadi'; // Your GitHub username
    GITHUB_CONFIG.repo = 'web'; // Your repo name
    
    // Check if token is still placeholder
    if (GITHUB_CONFIG.token === 'YOUR_GITHUB_TOKEN_HERE' || !GITHUB_CONFIG.token) {
        console.warn('⚠️ GitHub token not configured properly');
        return false;
    }
    return true;
}

// Image upload functionality
function createImageUploader(inputId, currentValue = '') {
    const uploaderId = `uploader-${inputId}`;
    const previewId = `preview-${inputId}`;
    const removeId = `remove-${inputId}`;
    
    return `
        <div class="image-uploader-container">
            <div class="flex items-center space-x-4">
                <div class="flex-1">
                    <input type="url" id="${inputId}" value="${currentValue}" 
                           class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan"
                           placeholder="Enter image URL or upload below">
                </div>
                <div class="flex flex-col space-y-2">
                    <input type="file" id="${uploaderId}" accept="image/*" class="hidden">
                    <button type="button" onclick="document.getElementById('${uploaderId}').click()" 
                            class="bg-rose-tan text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-tan-dark transition-colors text-sm">
                        Upload Image
                    </button>
                    ${currentValue ? `<button type="button" id="${removeId}" onclick="removeImage('${inputId}')" 
                            class="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm">
                        Remove Image
                    </button>` : ''}
                </div>
            </div>
            <div id="${previewId}" class="mt-3">
                ${currentValue ? `<img src="${currentValue}" alt="Preview" class="h-20 w-20 object-cover rounded-lg border">` : ''}
            </div>
        </div>
    `;
}

// Handle image upload
function setupImageUploader(inputId) {
    const uploaderId = `uploader-${inputId}`;
    const previewId = `preview-${inputId}`;
    
    const uploaderElement = document.getElementById(uploaderId);
    if (uploaderElement) {
        uploaderElement.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showNotification('Please select a valid image file.', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Image size must be less than 5MB.', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64String = e.target.result;
                    
                    // Update the URL input with base64 data
                    document.getElementById(inputId).value = base64String;
                    
                    // Update preview
                    document.getElementById(previewId).innerHTML = 
                        `<img src="${base64String}" alt="Preview" class="h-20 w-20 object-cover rounded-lg border">`;
                    
                    showNotification('Image uploaded successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Remove image function
function removeImage(inputId) {
    const previewId = `preview-${inputId}`;
    const removeId = `remove-${inputId}`;
    
    // Clear the input value
    document.getElementById(inputId).value = '';
    
    // Clear the preview
    document.getElementById(previewId).innerHTML = '';
    
    // Remove the remove button
    const removeButton = document.getElementById(removeId);
    if (removeButton) {
        removeButton.remove();
    }
    
    showNotification('Image removed successfully!', 'success');
}

// Authentication
document.getElementById('auth-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    try {
        // Check localStorage first for latest data including password
        const localStorageContent = localStorage.getItem('rotaract_content_backup');
        let data;
        
        if (localStorageContent) {
            data = JSON.parse(localStorageContent);
        } else {
            const response = await fetch('data/content.json');
            data = await response.json();
        }
        
        if (password === data.siteConfig.adminPassword) {
            isAuthenticated = true;
            contentData = data;
            document.getElementById('auth-modal').classList.add('hidden');
            document.getElementById('admin-dashboard').classList.remove('hidden');
            loadContent();
            showNotification('Login successful!', 'success');
        } else {
            document.getElementById('auth-error').classList.remove('hidden');
            document.getElementById('admin-password').value = '';
        }
    } catch (error) {
        showNotification('Error loading content data.', 'error');
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    isAuthenticated = false;
    contentData = {};
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('auth-modal').classList.remove('hidden');
    document.getElementById('admin-password').value = '';
    document.getElementById('auth-error').classList.add('hidden');
});

// Load content from JSON and localStorage
async function loadContent() {
    try {
        console.log('🚀 loadContent() called in admin');
        
        // First check localStorage for latest changes
        const localStorageContent = localStorage.getItem('rotaract_content_backup');
        console.log('🗺 LocalStorage content exists:', !!localStorageContent);
        
        if (localStorageContent) {
            // Use the updated content from localStorage (admin changes)
            contentData = JSON.parse(localStorageContent);
            console.log('✅ Loading updated content from localStorage in admin');
            console.log('📊 Loaded board members from localStorage:', contentData.boardMembers?.length || 0, 'members');
        } else {
            // Fallback to loading from JSON file
            const response = await fetch('data/content.json');
            contentData = await response.json();
            console.log('📄 Loading content from JSON file in admin');
            console.log('📊 Loaded board members from JSON:', contentData.boardMembers?.length || 0, 'members');
        }
        
        console.log('📊 Final contentData.boardMembers:', contentData.boardMembers);
    } catch (error) {
        console.error('❌ Error in loadContent():', error);
        showNotification('Error loading content data.', 'error');
    }
}

// Show different sections
function showSection(section) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';
    
    console.log(`🔄 Loading section: ${section}`);
    console.log(`📊 Current contentData:`, contentData);
    
    switch(section) {
        case 'hero':
            showHeroEditor();
            break;
        case 'about':
            showAboutEditor();
            break;
        case 'board':
            console.log('👥 Loading Board Members section...');
            console.log('📊 Board members data:', contentData.boardMembers);
            showBoardEditor();
            break;
        case 'projects':
            showProjectsEditor();
            break;
        case 'events':
            showEventsEditor();
            break;
        case 'contact':
            showContactEditor();
            break;
        case 'settings':
            showSiteSettingsEditor();
            break;
        default:
            console.log(`⚠️ Unknown section: ${section}`);
    }
}

// Hero Section Editor
function showHeroEditor() {
    const content = `
        <div class="glass-effect rounded-xl p-6 luxury-shadow fade-in">
            <h3 class="text-2xl font-bold text-mauve-wine mb-6">Hero Section</h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Background Image</label>
                    ${createImageUploader('hero-bg-image', contentData.hero.backgroundImage || '')}
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Main Title</label>
                    <input type="text" id="hero-title" value="${contentData.hero.title || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Subtitle</label>
                    <input type="text" id="hero-subtitle" value="${contentData.hero.subtitle || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Description</label>
                    <textarea id="hero-description" rows="4" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">${contentData.hero.description || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Call-to-Action Text</label>
                    <input type="text" id="hero-cta" value="${contentData.hero.ctaText || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <button onclick="saveHeroContent()" class="luxury-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                    Save Changes
                </button>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
    
    // Setup image uploader
    setupImageUploader('hero-bg-image');
}

// About Section Editor
function showAboutEditor() {
    const content = `
        <div class="glass-effect rounded-xl p-6 luxury-shadow fade-in">
            <h3 class="text-2xl font-bold text-mauve-wine mb-6">About Section</h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Section Title</label>
                    <input type="text" id="about-title" value="${contentData.about.title || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Main Title</label>
                    <input type="text" id="about-main-title" value="${contentData.about.mainTitle || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">First Paragraph</label>
                    <textarea id="about-desc1" rows="3" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">${contentData.about.description1 || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Second Paragraph</label>
                    <textarea id="about-desc2" rows="3" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">${contentData.about.description2 || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Third Paragraph</label>
                    <textarea id="about-desc3" rows="3" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">${contentData.about.description3 || ''}</textarea>
                </div>
                <button onclick="saveAboutContent()" class="luxury-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                    Save Changes
                </button>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
}

// Board Members Editor - Updated for new card layout
function showBoardEditor() {
    console.log('🚀 showBoardEditor() function called - NEW VERSION!');
    console.log('📊 Initial contentData.boardMembers:', contentData.boardMembers);
    
    // Ensure we have the right data structure for the new layout
    if (!contentData.boardMembers || contentData.boardMembers.length === 0) {
        console.log('⚠️ No board members found, creating default structure...');
        contentData.boardMembers = [
            {
                id: 1,
                name: "President",
                position: "President", 
                description: "Leading with Vision",
                image: "",
                gradient: "from-mauve-wine to-mauve-wine-dark",
                initial: "P",
                label: "VISIONARY"
            },
            {
                id: 2,
                name: "Vice President",
                position: "Vice President",
                description: "Supporting Excellence", 
                image: "",
                gradient: "from-rose-tan to-rose-tan-dark",
                initial: "VP",
                label: "STRATEGIC"
            },
            {
                id: 3,
                name: "Secretary",
                position: "Secretary",
                description: "Organizing Success",
                image: "",
                gradient: "from-luxury-gold to-rose-tan", 
                initial: "S",
                label: "CREATIVE"
            },
            {
                id: 4,
                name: "Treasurer",
                position: "Treasurer",
                description: "Financial Stewardship",
                image: "",
                gradient: "from-rose-tan-light to-mauve-wine-light",
                initial: "T",
                label: "MASTERMIND"
            }
        ];
    } else {
        // Ensure existing members have labels if they don't
        const defaultLabels = ['VISIONARY', 'STRATEGIC', 'CREATIVE', 'MASTERMIND', 'LEADER', 'INNOVATOR', 'CATALYST', 'PIONEER'];
        contentData.boardMembers.forEach((member, index) => {
            if (!member.label) {
                member.label = defaultLabels[index] || 'LEADER';
            }
        });
    }
    
    let content = `
        <div class="glass-effect rounded-xl p-6 luxury-shadow fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-mauve-wine">Board Members</h3>
                <div class="flex items-center space-x-4">
                    <div class="text-sm text-mauve-wine-light">
                        Manage board member cards with custom labels
                    </div>
                    <button onclick="addBoardMember()" class="bg-rose-tan text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-tan-dark transition-colors">
                        Add Member
                    </button>
                    <button onclick="location.reload(true)" class="bg-red-500 text-white px-3 py-1 rounded text-xs">
                        Force Refresh
                    </button>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
    `;
    
    // Define the default card colors cycling through them
    const cardColors = [
        'bg-gradient-to-br from-mauve-wine-dark to-mauve-wine', 
        'bg-gradient-to-br from-rose-tan to-rose-tan-dark', 
        'bg-gradient-to-br from-luxury-gold to-rose-tan', 
        'bg-gradient-to-br from-rose-tan-light to-mauve-wine-light',
        'bg-gradient-to-br from-mauve-wine to-rose-tan',
        'bg-gradient-to-br from-luxury-gold to-mauve-wine-dark',
        'bg-gradient-to-br from-rose-tan-dark to-mauve-wine-light',
        'bg-gradient-to-br from-mauve-wine-light to-luxury-gold'
    ];
    
    contentData.boardMembers.forEach((member, index) => {
        const cardColor = cardColors[index % cardColors.length];
        
        content += `
            <div class="border border-rose-tan-light rounded-xl p-6 bg-white luxury-shadow">
                <!-- Preview Card -->
                <div class="mb-4">
                    <div class="text-xs text-mauve-wine-light mb-2">Preview (${member.label || 'LEADER'} Card):</div>
                    <div class="h-40 ${cardColor} rounded-lg relative overflow-hidden">
                        <div class="absolute top-2 left-3">
                            <div class="text-white text-sm font-bold">${member.label || 'LEADER'}</div>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 p-3 text-center">
                            <div class="text-white font-bold text-sm">${member.name || 'Name'}</div>
                            <div class="text-rose-tan-light text-xs">${member.position || 'Position'}, ${member.description || 'Description'}</div>
                        </div>
                        ${member.image ? 
                            `<img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover absolute inset-0">` :
                            `<div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                                    <span class="text-white text-2xl font-bold">${(member.name || 'M').charAt(0).toUpperCase()}</span>
                                </div>
                            </div>`
                        }
                    </div>
                </div>
                
                <!-- Edit Form -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Card Label</label>
                        <input type="text" id="board-label-${index}" value="${member.label || ''}" 
                               class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan"
                               placeholder="e.g., VISIONARY, STRATEGIC, CREATIVE"
                               onchange="updatePreview(${index})">
                        <p class="text-xs text-mauve-wine-light mt-1">This appears in the top-left corner of the card</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Member Name</label>
                            <input type="text" id="board-name-${index}" value="${member.name || ''}" 
                                   class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan"
                                   placeholder="e.g., John Doe"
                                   onchange="updatePreview(${index})">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Position Title</label>
                            <input type="text" id="board-position-${index}" value="${member.position || ''}" 
                                   class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan"
                                   placeholder="e.g., President"
                                   onchange="updatePreview(${index})">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Description</label>
                        <input type="text" id="board-desc-${index}" value="${member.description || ''}" 
                               class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan"
                               placeholder="e.g., Leading with Vision"
                               onchange="updatePreview(${index})">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Professional Photo</label>
                        <p class="text-xs text-mauve-wine-light mb-2">Upload a professional headshot for the ${member.label || 'LEADER'} card</p>
                        ${createImageUploader(`board-image-${index}`, member.image || '')}
                    </div>
                    ${contentData.boardMembers.length > 1 ? `
                        <div class="flex justify-end mt-4">
                            <button onclick="deleteBoardMember(${index})" class="text-red-500 hover:text-red-700 font-medium text-sm">
                                Delete Member
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    content += `
            </div>
            <div class="mt-8 flex justify-between items-center">
                <div class="text-sm text-mauve-wine-light">
                    Changes will update the board member cards on your website immediately
                </div>
                <button onclick="saveBoardMembers()" class="luxury-gradient text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all luxury-shadow">
                    Save All Board Members
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = content;
    
    // Setup image uploaders for all board members
    contentData.boardMembers.forEach((member, index) => {
        setupImageUploader(`board-image-${index}`);
    });
}

// Projects Editor
function showProjectsEditor() {
    let content = `
        <div class="glass-effect rounded-xl p-6 luxury-shadow fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-mauve-wine">Projects</h3>
                <button onclick="addProject()" class="bg-rose-tan text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-tan-dark transition-colors">
                    Add Project
                </button>
            </div>
            <div class="space-y-4">
    `;
    
    contentData.projects.forEach((project, index) => {
        content += `
            <div class="border border-rose-tan-light rounded-lg p-4">
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Title</label>
                        <input type="text" id="project-title-${index}" value="${project.title}" class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Description</label>
                        <textarea id="project-desc-${index}" rows="3" class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan">${project.description}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Project Image</label>
                        ${createImageUploader(`project-image-${index}`, project.image)}
                    </div>
                </div>
                <div class="mt-4 flex justify-end">
                    <button onclick="deleteProject(${index})" class="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </div>
            </div>
        `;
    });
    
    content += `
            </div>
            <div class="mt-6">
                <button onclick="saveProjects()" class="luxury-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                    Save All Changes
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = content;
    
    // Setup image uploaders for all projects
    contentData.projects.forEach((project, index) => {
        setupImageUploader(`project-image-${index}`);
    });
}

// Events Editor  
function showEventsEditor() {
    let content = `
        <div class="glass-effect rounded-xl p-6 luxury-shadow fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-mauve-wine">Events</h3>
                <button onclick="addEvent()" class="bg-rose-tan text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-tan-dark transition-colors">
                    Add Event
                </button>
            </div>
            <div class="space-y-4">
    `;
    
    contentData.events.forEach((event, index) => {
        content += `
            <div class="border border-rose-tan-light rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Title</label>
                        <input type="text" id="event-title-${index}" value="${event.title}" class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Date</label>
                        <input type="date" id="event-date-${index}" value="${event.date}" class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Time</label>
                        <input type="text" id="event-time-${index}" value="${event.time}" class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Location</label>
                        <input type="text" id="event-location-${index}" value="${event.location}" class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan">
                    </div>
                </div>
                <div class="mt-4">
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Description</label>
                    <textarea id="event-desc-${index}" rows="3" class="w-full px-3 py-2 border border-rose-tan-light rounded focus:ring-2 focus:ring-rose-tan">${event.description}</textarea>
                </div>
                <div class="mt-4 flex justify-end">
                    <button onclick="deleteEvent(${index})" class="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </div>
            </div>
        `;
    });
    
    content += `
            </div>
            <div class="mt-6">
                <button onclick="saveEvents()" class="luxury-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                    Save All Changes
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = content;
}

// Contact Editor
function showContactEditor() {
    const content = `
        <div class="glass-effect rounded-xl p-6 luxury-shadow fade-in">
            <h3 class="text-2xl font-bold text-mauve-wine mb-6">Contact Information</h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Email Address</label>
                    <input type="email" id="contact-email" value="${contentData.contact.email || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Phone Number</label>
                    <input type="text" id="contact-phone" value="${contentData.contact.phone || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Address</label>
                    <input type="text" id="contact-address" value="${contentData.contact.address || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <button onclick="saveContactContent()" class="luxury-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                    Save Changes
                </button>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
}

// Site Settings Editor
function showSiteSettingsEditor() {
    // Ensure siteConfig exists with defaults
    if (!contentData.siteConfig) {
        contentData.siteConfig = {
            siteName: 'Rotaract Club of Bibwewadi Pune',
            tagline: 'From solos to symphony',
            clubLogo: '',
            adminPassword: 'rotaract2024admin'
        };
    }
    
    const content = `
        <div class="glass-effect rounded-xl p-6 luxury-shadow fade-in">
            <h3 class="text-2xl font-bold text-mauve-wine mb-6">Site Settings</h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Site Name</label>
                    <input type="text" id="site-name" value="${contentData.siteConfig.siteName || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Tagline</label>
                    <input type="text" id="site-tagline" value="${contentData.siteConfig.tagline || ''}" class="w-full px-4 py-3 border border-rose-tan-light rounded-lg focus:ring-2 focus:ring-rose-tan focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-mauve-wine-dark mb-2">Club Logo</label>
                    <p class="text-sm text-mauve-wine-light mb-3">Upload your club logo that will appear in the navigation bar</p>
                    ${createImageUploader('club-logo', contentData.siteConfig.clubLogo || '')}
                </div>
                <button onclick="saveSiteSettings()" class="luxury-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                    Save Settings
                </button>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
    
    // Setup image uploader
    setupImageUploader('club-logo');
}

// Save Functions
function saveHeroContent() {
    contentData.hero.backgroundImage = document.getElementById('hero-bg-image').value;
    contentData.hero.title = document.getElementById('hero-title').value;
    contentData.hero.subtitle = document.getElementById('hero-subtitle').value;
    contentData.hero.description = document.getElementById('hero-description').value;
    contentData.hero.ctaText = document.getElementById('hero-cta').value;
    saveToJSON();
}

function saveAboutContent() {
    contentData.about.title = document.getElementById('about-title').value;
    contentData.about.mainTitle = document.getElementById('about-main-title').value;
    contentData.about.description1 = document.getElementById('about-desc1').value;
    contentData.about.description2 = document.getElementById('about-desc2').value;
    contentData.about.description3 = document.getElementById('about-desc3').value;
    saveToJSON();
}

function saveContactContent() {
    contentData.contact.email = document.getElementById('contact-email').value;
    contentData.contact.phone = document.getElementById('contact-phone').value;
    contentData.contact.address = document.getElementById('contact-address').value;
    saveToJSON();
}

function saveSiteSettings() {
    // Ensure siteConfig exists
    if (!contentData.siteConfig) {
        contentData.siteConfig = {};
    }
    
    // Get values from form inputs
    const siteNameInput = document.getElementById('site-name');
    const taglineInput = document.getElementById('site-tagline');
    const logoInput = document.getElementById('club-logo');
    
    console.log('💾 Saving site settings...');
    console.log('📝 Site name input:', siteNameInput?.value);
    console.log('📝 Tagline input:', taglineInput?.value);
    console.log('🖼️ Logo input value (first 100 chars):', logoInput?.value?.substring(0, 100));
    
    if (siteNameInput) contentData.siteConfig.siteName = siteNameInput.value;
    if (taglineInput) contentData.siteConfig.tagline = taglineInput.value;
    if (logoInput) contentData.siteConfig.clubLogo = logoInput.value;
    
    console.log('✅ Final site settings to save:', {
        siteName: contentData.siteConfig.siteName,
        tagline: contentData.siteConfig.tagline,
        clubLogo: contentData.siteConfig.clubLogo ? 'Logo data present (' + contentData.siteConfig.clubLogo.length + ' chars)' : 'No logo'
    });
    
    saveToJSON();
}

function saveBoardMembers() {
    console.log('💾 Saving board members...');
    console.log('📊 Before save - contentData.boardMembers:', contentData.boardMembers);
    
    // Update each board member with form data (supports unlimited members now)
    contentData.boardMembers.forEach((member, index) => {
        const nameElement = document.getElementById(`board-name-${index}`);
        const positionElement = document.getElementById(`board-position-${index}`);
        const descElement = document.getElementById(`board-desc-${index}`);
        const imageElement = document.getElementById(`board-image-${index}`);
        const labelElement = document.getElementById(`board-label-${index}`);
        
        console.log(`📝 Updating member ${index}:`);
        console.log(`  - Name input: ${nameElement?.value || 'NOT FOUND'}`);
        console.log(`  - Position input: ${positionElement?.value || 'NOT FOUND'}`);
        console.log(`  - Description input: ${descElement?.value || 'NOT FOUND'}`);
        console.log(`  - Label input: ${labelElement?.value || 'NOT FOUND'}`);
        console.log(`  - Image input: ${imageElement?.value ? 'Present (' + imageElement.value.substring(0, 50) + '...)' : 'Empty'}`);
        
        if (nameElement && nameElement.value.trim()) {
            member.name = nameElement.value.trim();
        }
        if (positionElement && positionElement.value.trim()) {
            member.position = positionElement.value.trim();
        }
        if (descElement && descElement.value.trim()) {
            member.description = descElement.value.trim();
        }
        if (labelElement && labelElement.value.trim()) {
            member.label = labelElement.value.trim();
        }
        if (imageElement) {
            member.image = imageElement.value;
        }
        
        // Update the initial based on the name
        if (member.name) {
            member.initial = member.name.charAt(0).toUpperCase();
        }
        
        console.log(`  - Updated member:`, {
            name: member.name,
            position: member.position,
            description: member.description,
            label: member.label,
            initial: member.initial,
            hasImage: !!member.image
        });
    });
    
    console.log('📊 After save - contentData.boardMembers:', contentData.boardMembers.map(m => ({
        name: m.name,
        position: m.position,
        description: m.description,
        label: m.label,
        initial: m.initial,
        hasImage: !!m.image
    })));
    
    // Force save to localStorage
    console.log('💾 Forcing save to localStorage...');
    saveToJSON();
    
    // Show success message
    showNotification('Board Members updated successfully! Check the main website.', 'success');
}

function saveProjects() {
    contentData.projects.forEach((project, index) => {
        const titleElement = document.getElementById(`project-title-${index}`);
        const descElement = document.getElementById(`project-desc-${index}`);
        const imageElement = document.getElementById(`project-image-${index}`);
        
        if (titleElement) project.title = titleElement.value;
        if (descElement) project.description = descElement.value;
        if (imageElement) project.image = imageElement.value;
    });
    saveToJSON();
}

function saveEvents() {
    contentData.events.forEach((event, index) => {
        const titleElement = document.getElementById(`event-title-${index}`);
        const dateElement = document.getElementById(`event-date-${index}`);
        const timeElement = document.getElementById(`event-time-${index}`);
        const locationElement = document.getElementById(`event-location-${index}`);
        const descElement = document.getElementById(`event-desc-${index}`);
        
        if (titleElement) event.title = titleElement.value;
        if (dateElement) event.date = dateElement.value;
        if (timeElement) event.time = timeElement.value;
        if (locationElement) event.location = locationElement.value;
        if (descElement) event.description = descElement.value;
    });
    saveToJSON();
}

// Add/Delete Functions
// Debug function - call from browser console
function debugBoardMembers() {
    console.log('=== BOARD MEMBERS DEBUG ===');
    console.log('contentData:', contentData);
    console.log('contentData.boardMembers:', contentData.boardMembers);
    console.log('localStorage content:', localStorage.getItem('rotaract_content_backup'));
    console.log('showBoardEditor function:', showBoardEditor.toString().substring(0, 200) + '...');
    
    // Try to reload the board section
    console.log('Attempting to reload board section...');
    showSection('board');
    
    return 'Debug complete - check console output above';
}

// Make it globally available
window.debugBoardMembers = debugBoardMembers;

// Enhanced Board Member Management Functions
// Add new board member with cycling color scheme
function addBoardMember() {
    const newId = Math.max(...contentData.boardMembers.map(m => m.id || 0)) + 1;
    const defaultLabels = ['LEADER', 'INNOVATOR', 'CATALYST', 'PIONEER', 'DIRECTOR', 'MENTOR', 'CHAMPION', 'GUARDIAN'];
    const currentIndex = contentData.boardMembers.length;
    
    const newMember = {
        id: newId,
        name: "New Member",
        position: "Board Member",
        description: "Contributing to Excellence",
        image: "",
        label: defaultLabels[currentIndex % defaultLabels.length],
        initial: "N"
    };
    
    contentData.boardMembers.push(newMember);
    console.log('✅ Added new board member:', newMember);
    
    // Refresh the editor to show the new member
    showBoardEditor();
    
    showNotification('New board member added! Don\'t forget to save changes.', 'success');
}

// Delete board member (with minimum of 1 member)
function deleteBoardMember(index) {
    if (contentData.boardMembers.length <= 1) {
        showNotification('You must have at least one board member.', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${contentData.boardMembers[index].name || 'this member'}?`)) {
        const deletedMember = contentData.boardMembers.splice(index, 1)[0];
        console.log('🗑️ Deleted board member:', deletedMember);
        
        // Refresh the editor to reflect the deletion
        showBoardEditor();
        
        showNotification('Board member deleted! Don\'t forget to save changes.', 'success');
    }
}

// Real-time preview update for board member cards
function updatePreview(index) {
    const nameInput = document.getElementById(`board-name-${index}`);
    const positionInput = document.getElementById(`board-position-${index}`);
    const descInput = document.getElementById(`board-desc-${index}`);
    const labelInput = document.getElementById(`board-label-${index}`);
    
    if (!nameInput || !positionInput || !descInput || !labelInput) {
        return; // Elements not found
    }
    
    // Get the preview card for this member
    const memberCards = document.querySelectorAll('.border.border-rose-tan-light.rounded-xl');
    const memberCard = memberCards[index];
    
    if (!memberCard) {
        return; // Card not found
    }
    
    // Update the preview card elements
    const previewLabel = memberCard.querySelector('.text-white.text-sm.font-bold');
    const previewName = memberCard.querySelector('.text-white.font-bold.text-sm');
    const previewPosition = memberCard.querySelector('.text-rose-tan-light.text-xs');
    const previewInitial = memberCard.querySelector('.text-white.text-2xl.font-bold');
    
    if (previewLabel) previewLabel.textContent = labelInput.value || 'LEADER';
    if (previewName) previewName.textContent = nameInput.value || 'Name';
    if (previewPosition) previewPosition.textContent = `${positionInput.value || 'Position'}, ${descInput.value || 'Description'}`;
    if (previewInitial && nameInput.value) previewInitial.textContent = nameInput.value.charAt(0).toUpperCase();
    
    // Update the preview card description
    const previewCardDesc = memberCard.querySelector('.text-xs.text-mauve-wine-light.mb-2');
    if (previewCardDesc) {
        previewCardDesc.textContent = `Preview (${labelInput.value || 'LEADER'} Card):`;
    }
}

function addProject() {
    const newProject = {
        id: Date.now(),
        title: "New Project",
        description: "Project description",
        image: "",
        gradient: "from-rose-tan to-rose-tan-dark",
        status: "active"
    };
    contentData.projects.push(newProject);
    showProjectsEditor();
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        contentData.projects.splice(index, 1);
        showProjectsEditor();
    }
}

function addEvent() {
    const newEvent = {
        id: Date.now(),
        title: "New Event",
        date: new Date().toISOString().split('T')[0],
        time: "6:00 PM - 8:00 PM",
        location: "Location",
        description: "Event description",
        gradient: "from-rose-tan to-rose-tan-dark",
        status: "upcoming"
    };
    contentData.events.push(newEvent);
    showEventsEditor();
}

function deleteEvent(index) {
    if (confirm('Are you sure you want to delete this event?')) {
        contentData.events.splice(index, 1);
        showEventsEditor();
    }
}

// Push changes to GitHub and trigger website update
async function pushChangesToWebsite() {
    console.log('🚀 Starting push to website...');
    
    // Initialize GitHub config
    const configValid = initGitHubConfig();
    
    if (!configValid) {
        showNotification('GitHub token not configured. Please add your token to admin.js and redeploy.', 'error');
        console.log('🛠️ To configure: Edit admin.js, replace YOUR_GITHUB_TOKEN_HERE with your actual token');
        return;
    }
    
    const pushButton = document.getElementById('push-to-website-btn');
    const originalContent = pushButton.innerHTML;
    
    try {
        // Show loading state
        pushButton.disabled = true;
        pushButton.innerHTML = `
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Pushing...</span>
        `;
        
        showNotification('Preparing to push changes to website...', 'success');
        
        // Convert contentData to formatted JSON
        const jsonContent = JSON.stringify(contentData, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonContent))); // Proper UTF-8 encoding
        
        console.log('📝 Content prepared for GitHub commit');
        
        // Step 1: Get current file to obtain SHA
        console.log('📡 Getting current file information...');
        const getFileResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Rotaract-Admin-Dashboard'
                }
            }
        );
        
        if (!getFileResponse.ok) {
            const errorData = await getFileResponse.json();
            throw new Error(`Failed to get file info: ${errorData.message || getFileResponse.statusText}`);
        }
        
        const fileData = await getFileResponse.json();
        console.log('✅ File information retrieved');
        
        // Step 2: Update the file
        console.log('📡 Committing changes to GitHub...');
        const commitMessage = `Update content from admin dashboard - ${new Date().toLocaleString()}`;
        
        const updateResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Rotaract-Admin-Dashboard'
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: encodedContent,
                    sha: fileData.sha,
                    committer: {
                        name: 'Rotaract Admin',
                        email: 'admin@rotaract.local'
                    }
                })
            }
        );
        
        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Failed to commit changes: ${errorData.message || updateResponse.statusText}`);
        }
        
        const commitData = await updateResponse.json();
        console.log('✅ Changes committed to GitHub successfully!');
        console.log('🔗 Commit URL:', commitData.commit.html_url);
        
        // Success notification
        showNotification('🎉 Changes pushed successfully! Website will update in 1-2 minutes.', 'success');
        
        // Also save to localStorage for immediate local preview
        localStorage.setItem('rotaract_content_backup', JSON.stringify(contentData));
        
        setTimeout(() => {
            showNotification('🌐 Your changes are now live on the website!', 'success');
        }, 90000); // Notify after 1.5 minutes
        
    } catch (error) {
        console.error('❌ Error pushing to GitHub:', error);
        showNotification(`Failed to push changes: ${error.message}`, 'error');
        
        // Fallback to localStorage save
        try {
            localStorage.setItem('rotaract_content_backup', JSON.stringify(contentData));
            showNotification('Changes saved locally as fallback.', 'warning');
        } catch (localError) {
            console.error('❌ Even localStorage save failed:', localError);
        }
    } finally {
        // Restore button state
        pushButton.disabled = false;
        pushButton.innerHTML = originalContent;
    }
}

// Save to JSON (seamless auto-update without downloads)
function saveToJSON() {
    console.log('💾 Starting saveToJSON process...');
    console.log('🗺 Content data to save:', {
        siteName: contentData.siteConfig?.siteName,
        tagline: contentData.siteConfig?.tagline,
        clubLogo: contentData.siteConfig?.clubLogo ? 'Present (' + contentData.siteConfig.clubLogo.length + ' chars)' : 'Missing'
    });
    
    try {
        // Save to localStorage for immediate sync with main website
        const jsonString = JSON.stringify(contentData);
        localStorage.setItem('rotaract_content_backup', jsonString);
        console.log('✅ Successfully saved to localStorage!');
        
        // Verify the save
        const saved = localStorage.getItem('rotaract_content_backup');
        if (saved) {
            const parsedSaved = JSON.parse(saved);
            console.log('✅ Verification: Data successfully stored in localStorage');
            console.log('🗺 Verified site config:', {
                siteName: parsedSaved.siteConfig?.siteName,
                tagline: parsedSaved.siteConfig?.tagline,
                clubLogo: parsedSaved.siteConfig?.clubLogo ? 'Present (' + parsedSaved.siteConfig.clubLogo.length + ' chars)' : 'Missing'
            });
        } else {
            console.error('❌ Failed to verify localStorage save');
        }
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
        showNotification('Error saving changes!', 'error');
        return;
    }
    
    // Show seamless update notification
    showNotification('Changes saved and live on main website instantly!', 'success');
    
    // Optional: Trigger immediate content refresh on main website
    // by dispatching a custom event that the main website can listen to
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
            type: 'CONTENT_UPDATED',
            content: contentData
        }, '*');
        console.log('🚀 Sent update message to main website');
    }
}

// Enhanced notification system with more types
function showNotification(message, type) {
    const notification = document.createElement('div');
    let bgColor = 'bg-gray-500';
    let icon = '';
    
    switch(type) {
        case 'success':
            bgColor = 'bg-green-500';
            icon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            icon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>';
            break;
        case 'warning':
            bgColor = 'bg-orange-500';
            icon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>';
            break;
        default:
            bgColor = 'bg-blue-500';
            icon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
    }
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-md`;
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${icon}
            </svg>
            <div>
                <div class="font-semibold">${message}</div>
                ${type === 'success' && message.includes('pushed') ? '<div class="text-sm opacity-90">✨ Check your website in 1-2 minutes!</div>' : ''}
                ${type === 'success' && !message.includes('pushed') ? '<div class="text-sm opacity-90">✨ No downloads needed - everything happens automatically!</div>' : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds (longer for important messages)
    const duration = type === 'success' && message.includes('pushed') ? 8000 : 4000;
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}