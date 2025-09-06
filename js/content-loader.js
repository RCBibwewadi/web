// Enhanced Content Loader for Main Website with Real-time Admin Updates
let siteContent = {};

// Load content on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSiteContent();
    
    // Set up periodic check for admin updates (every 2 seconds)
    setInterval(checkForUpdates, 2000);
});

// Load content from localStorage first, then fallback to JSON
async function loadSiteContent() {
    try {
        console.log('🚀 Starting loadSiteContent...');
        
        // First, check if we have updated content in localStorage (from admin changes)
        const localStorageContent = localStorage.getItem('rotaract_content_backup');
        console.log('🗺 LocalStorage content found:', localStorageContent ? 'Yes' : 'No');
        
        if (localStorageContent) {
            // Use the updated content from admin dashboard
            const newContent = JSON.parse(localStorageContent);
            console.log('🗺 LocalStorage site config:', {
                siteName: newContent.siteConfig?.siteName,
                tagline: newContent.siteConfig?.tagline,
                clubLogo: newContent.siteConfig?.clubLogo ? 'Present (' + newContent.siteConfig.clubLogo.length + ' chars)' : 'Missing'
            });
            
            // Check if content is different from current
            if (JSON.stringify(newContent) !== JSON.stringify(siteContent)) {
                siteContent = newContent;
                console.log('✅ Loading updated content from admin changes');
                populateWebsiteContent();
                showUpdateNotification();
            } else {
                console.log('🔄 Content already up to date');
                // Still ensure content is populated even if same
                if (Object.keys(siteContent).length === 0) {
                    siteContent = newContent;
                    populateWebsiteContent();
                }
            }
            return;
        }
        
        // Fallback to loading from JSON file
        console.log('📄 Loading from JSON file as fallback...');
        const response = await fetch('data/content.json');
        const jsonContent = await response.json();
        
        if (JSON.stringify(jsonContent) !== JSON.stringify(siteContent)) {
            siteContent = jsonContent;
            console.log('📄 Loading content from JSON file');
            populateWebsiteContent();
        }
    } catch (error) {
        console.error('❌ Error loading content:', error);
        // Fallback to default content if both methods fail
    }
}

// Check for updates periodically
function checkForUpdates() {
    const localStorageContent = localStorage.getItem('rotaract_content_backup');
    if (localStorageContent) {
        const newContent = JSON.parse(localStorageContent);
        
        // Compare specifically site settings for debugging
        const currentSiteConfig = siteContent.siteConfig || {};
        const newSiteConfig = newContent.siteConfig || {};
        
        // Debug board members specifically
        const currentBoardMembers = siteContent.boardMembers || [];
        const newBoardMembers = newContent.boardMembers || [];
        
        if (JSON.stringify(newContent) !== JSON.stringify(siteContent)) {
            console.log('🔄 Detected content update!');
            console.log('📊 Current board members:', currentBoardMembers.map(m => ({name: m.name, position: m.position})));
            console.log('🔄 New board members:', newBoardMembers.map(m => ({name: m.name, position: m.position})));
            console.log('📊 Current site config:', {
                siteName: currentSiteConfig.siteName,
                tagline: currentSiteConfig.tagline,
                clubLogo: currentSiteConfig.clubLogo ? 'Present (' + currentSiteConfig.clubLogo.length + ' chars)' : 'Missing'
            });
            console.log('🔄 New site config:', {
                siteName: newSiteConfig.siteName,
                tagline: newSiteConfig.tagline,
                clubLogo: newSiteConfig.clubLogo ? 'Present (' + newSiteConfig.clubLogo.length + ' chars)' : 'Missing'
            });
            
            siteContent = newContent;
            console.log('🔄 Auto-updating content from admin changes');
            populateWebsiteContent();
            showUpdateNotification();
        }
    }
}

// Show update notification
function showUpdateNotification() {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-rose-tan text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Content updated from admin dashboard!
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Populate website with dynamic content
function populateWebsiteContent() {
    // Update Hero Section
    updateHeroSection();
    
    // Update About Section
    updateAboutSection();
    
    // Update Board Members
    updateBoardMembers();
    
    // Update Projects
    updateProjects();
    
    // Update Events
    updateEvents();
    
    // Update Contact Information
    updateContactInfo();
    
    // Update Site Settings (Logo)
    updateSiteSettings();
    
    // Update Page Title
    if (siteContent.siteConfig) {
        document.title = `${siteContent.siteConfig.siteName} | ${siteContent.siteConfig.tagline}`;
    }
}

// Update Hero Section
function updateHeroSection() {
    if (!siteContent.hero) return;
    
    // Update background image
    const heroSection = document.getElementById('home');
    if (heroSection && siteContent.hero.backgroundImage) {
        const bgDiv = heroSection.querySelector('.bg-cover.bg-center');
        if (bgDiv) {
            bgDiv.style.backgroundImage = `url('${siteContent.hero.backgroundImage}')`;
        }
    }
    
    // Update title
    const titleElement = heroSection?.querySelector('h1');
    if (titleElement && siteContent.hero.title) {
        const titleParts = siteContent.hero.title.split(' of ');
        if (titleParts.length === 2) {
            titleElement.innerHTML = `
                ${titleParts[0]} of
                <span class="bg-gradient-to-r from-rose-tan to-luxury-gold bg-clip-text text-transparent">
                    ${titleParts[1]}
                </span>
            `;
        } else {
            titleElement.textContent = siteContent.hero.title;
        }
    }
    
    // Update subtitle
    const subtitleElement = heroSection?.querySelector('.text-xl.md\\:text-2xl');
    if (subtitleElement && siteContent.hero.subtitle) {
        subtitleElement.textContent = siteContent.hero.subtitle;
    }
    
    // Update description
    const descElement = heroSection?.querySelector('.text-lg.text-gray-300');
    if (descElement && siteContent.hero.description) {
        descElement.textContent = siteContent.hero.description;
    }
    
    // Update CTA button
    const ctaElement = heroSection?.querySelector('a[href="#join"]');
    if (ctaElement && siteContent.hero.ctaText) {
        ctaElement.textContent = siteContent.hero.ctaText;
    }
}

// Update About Section
function updateAboutSection() {
    if (!siteContent.about) return;
    
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    // Update section title
    const sectionTitle = aboutSection.querySelector('h2');
    if (sectionTitle && siteContent.about.title) {
        sectionTitle.textContent = siteContent.about.title;
    }
    
    // Update main title
    const mainTitle = aboutSection.querySelector('h3');
    if (mainTitle && siteContent.about.mainTitle) {
        mainTitle.textContent = siteContent.about.mainTitle;
    }
    
    // Update paragraphs
    const paragraphs = aboutSection.querySelectorAll('.text-mauve-wine-light.leading-relaxed');
    if (paragraphs.length >= 3) {
        if (siteContent.about.description1) paragraphs[0].textContent = siteContent.about.description1;
        if (siteContent.about.description2) paragraphs[1].textContent = siteContent.about.description2;
        if (siteContent.about.description3) paragraphs[2].textContent = siteContent.about.description3;
    }
}

// Update Board Members
function updateBoardMembers() {
    if (!siteContent.boardMembers) {
        console.log('❌ No board members data found in siteContent');
        return;
    }
    
    console.log('🔧 Updating board members...');
    console.log('📊 Board members data:', siteContent.boardMembers);
    
    // Target the specific board members container
    let boardContainer = document.getElementById('board-members-container');
    
    if (!boardContainer) {
        console.log('❌ Board container #board-members-container not found! Available containers:');
        const allGrids = document.querySelectorAll('.grid');
        allGrids.forEach((grid, index) => {
            console.log(`Grid ${index}:`, grid.className, grid.id, grid);
        });
        return;
    }
    
    console.log('✅ Found board container:', boardContainer.className);
    
    // Clear existing content
    boardContainer.innerHTML = '';
    
    // Define default gradient colors and label colors (cycling for unlimited members)
    const gradients = [
        'from-mauve-wine to-mauve-wine-dark',
        'from-rose-tan to-rose-tan-dark', 
        'from-luxury-gold to-rose-tan',
        'from-rose-tan-light to-mauve-wine-light',
        'from-mauve-wine to-rose-tan',
        'from-luxury-gold to-mauve-wine-dark',
        'from-rose-tan-dark to-mauve-wine-light',
        'from-mauve-wine-light to-luxury-gold'
    ];
    const labelColors = [
        'text-rose-tan', 
        'text-luxury-gold', 
        'text-mauve-wine-dark', 
        'text-luxury-cream',
        'text-rose-tan-light',
        'text-mauve-wine-light',
        'text-luxury-gold',
        'text-rose-tan'
    ];
    const labelPositions = [
        'top-6 left-6', 
        'top-6 right-6', 
        'top-6 left-6', 
        'top-6 right-6',
        'top-6 left-6',
        'top-6 right-6',
        'top-6 left-6',
        'top-6 right-6'
    ];
    
    siteContent.boardMembers.forEach((member, index) => {
        console.log(`📝 Processing member ${index}:`, member);
        
        const memberDiv = document.createElement('div');
        memberDiv.className = 'group relative bg-gradient-to-br from-mauve-wine-dark to-black rounded-xl overflow-hidden luxury-shadow hover-scale';
        
        // Use member's label if available, otherwise fall back to default labels
        const gradient = gradients[index % gradients.length] || member.gradient || 'from-mauve-wine to-mauve-wine-dark';
        const label = member.label || 'LEADER';
        const labelColor = labelColors[index % labelColors.length] || 'text-rose-tan';
        const labelPosition = labelPositions[index % labelPositions.length] || 'top-6 left-6';
        
        // Image content - use uploaded image or placeholder with member's initial
        const imageContent = member.image && member.image.trim() !== '' ? 
            `<img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover absolute inset-0">` :
            `<div class="w-48 h-48 bg-opacity-30 bg-white rounded-full flex items-center justify-center opacity-50">
                <span class="text-6xl text-white font-bold">${(member.name || 'M').charAt(0).toUpperCase()}</span>
            </div>`;
        
        memberDiv.innerHTML = `
            <div class="relative h-96 bg-gradient-to-br ${gradient} flex items-center justify-center">
                ${imageContent}
                
                <!-- Dynamic Descriptive Label -->
                <div class="absolute ${labelPosition}">
                    <h4 class="${labelColor} text-2xl font-bold tracking-wide">${label}</h4>
                </div>
            </div>
            
            <!-- Info Section -->
            <div class="bg-black p-6 text-center">
                <h5 class="text-xl font-bold text-white mb-1">${member.name || 'Board Member'}</h5>
                <p class="text-rose-tan-light text-sm">${member.position || member.name}, ${member.description || 'Description'}</p>
            </div>
        `;
        
        boardContainer.appendChild(memberDiv);
    });
    
    console.log(`✅ Successfully updated ${siteContent.boardMembers.length} board members with dynamic labels`);
}

// Update Projects
function updateProjects() {
    if (!siteContent.projects) return;
    
    const projectsContainer = document.querySelector('#projects .grid.md\\:grid-cols-2.lg\\:grid-cols-3');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '';
    
    siteContent.projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'bg-white rounded-xl luxury-shadow overflow-hidden hover-scale';
        
        const imageContent = project.image ? 
            `<img src="${project.image}" alt="${project.title}" class="h-48 w-full object-cover">` :
            `<div class="h-48 bg-gradient-to-br ${project.gradient}"></div>`;
        
        projectDiv.innerHTML = `
            ${imageContent}
            <div class="p-6">
                <h3 class="text-xl font-semibold text-mauve-wine mb-3">${project.title}</h3>
                <p class="text-mauve-wine-light mb-4">${project.description}</p>
                <div class="flex items-center text-rose-tan font-medium">
                    <span>Learn More</span>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectDiv);
    });
}

// Update Events
function updateEvents() {
    if (!siteContent.events) return;
    
    // Update list view
    updateEventsList();
    
    // Update calendar view events data
    updateCalendarEvents();
}

function updateEventsList() {
    const listView = document.getElementById('list-view');
    if (!listView) return;
    
    listView.innerHTML = '';
    
    siteContent.events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'glass-effect rounded-xl p-6 lg:p-8 hover-scale luxury-shadow';
        
        eventDiv.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between">
                <div class="flex-1">
                    <div class="flex items-center mb-4">
                        <div class="bg-gradient-to-r ${event.gradient} text-white px-4 py-2 rounded-lg font-semibold text-sm luxury-shadow">
                            ${formatEventDate(event.date)}
                        </div>
                        <div class="ml-4 text-mauve-wine-light">
                            <span class="font-medium">${event.time}</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold text-mauve-wine mb-3">${event.title}</h3>
                    <p class="text-mauve-wine-light mb-4 leading-relaxed">${event.description}</p>
                    <p class="text-sm text-rose-tan font-medium">
                        <span class="font-semibold">Location:</span> ${event.location}
                    </p>
                </div>
            </div>
        `;
        
        listView.appendChild(eventDiv);
    });
}

function updateCalendarEvents() {
    // Update the events object used by calendar
    window.events = {};
    siteContent.events.forEach(event => {
        window.events[event.date] = {
            title: event.title,
            time: event.time,
            location: event.location,
            description: event.description,
            color: event.gradient
        };
    });
    
    // Regenerate calendar if calendar view is currently active
    const calendarView = document.getElementById('calendar-view');
    if (calendarView && !calendarView.classList.contains('hidden')) {
        // Check if generateCalendar function exists and call it
        if (typeof window.generateCalendar === 'function') {
            window.generateCalendar();
        }
    }
}

// Update Contact Information
function updateContactInfo() {
    if (!siteContent.contact) return;
    
    console.log('🔧 Updating contact information...');
    
    // Find and update contact elements by searching through spans
    const spans = document.querySelectorAll('footer span');
    spans.forEach(span => {
        const text = span.textContent.trim();
        
        // Update email
        if (text.includes('rotaractbibwewadi@example.com') && siteContent.contact.email) {
            span.textContent = siteContent.contact.email;
            console.log('✅ Updated email to:', siteContent.contact.email);
        }
        
        // Update phone
        if (text.includes('+91 XXXXX XXXXX') && siteContent.contact.phone) {
            span.textContent = siteContent.contact.phone;
            console.log('✅ Updated phone to:', siteContent.contact.phone);
        }
        
        // Update address
        if (text.includes('Bibwewadi, Pune, Maharashtra') && siteContent.contact.address) {
            span.textContent = siteContent.contact.address;
            console.log('✅ Updated address to:', siteContent.contact.address);
        }
    });
    
    // Update social links if available
    if (siteContent.contact.socialLinks) {
        const socialLinks = document.querySelectorAll('footer a[href="#"]');
        const linkTypes = ['twitter', 'facebook', 'instagram', 'linkedin'];
        socialLinks.forEach((link, index) => {
            if (linkTypes[index] && siteContent.contact.socialLinks[linkTypes[index]] && siteContent.contact.socialLinks[linkTypes[index]] !== '#') {
                link.href = siteContent.contact.socialLinks[linkTypes[index]];
                console.log(`✅ Updated ${linkTypes[index]} link`);
            }
        });
    }
}

// Helper function to format event date
function formatEventDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    }).replace(/ /g, ' ').toUpperCase();
}

// Helper function for text contains selector (polyfill)
function getElementByText(text) {
    return Array.from(document.querySelectorAll('*')).find(el => 
        el.textContent.includes(text) && el.children.length === 0
    );
}

// Force refresh content function (can be called manually)
window.refreshContent = function() {
    loadSiteContent();
};

// Update Site Settings (Logo and other settings)
function updateSiteSettings() {
    if (!siteContent.siteConfig) {
        console.log('No siteConfig found in content');
        return;
    }
    
    console.log('🔧 Updating site settings with:', siteContent.siteConfig);
    
    // Update club logo in navigation using the specific container ID
    const logoContainer = document.getElementById('club-logo-container');
    console.log('🎯 Logo container found:', logoContainer);
    console.log('🖼️ Club logo URL:', siteContent.siteConfig.clubLogo);
    
    if (logoContainer) {
        if (siteContent.siteConfig.clubLogo && siteContent.siteConfig.clubLogo.trim() !== '') {
            console.log('✅ Replacing logo with uploaded image');
            
            // Create a new logo element
            const newLogoElement = document.createElement('img');
            newLogoElement.id = 'club-logo-container';
            newLogoElement.src = siteContent.siteConfig.clubLogo;
            newLogoElement.alt = 'Club Logo';
            newLogoElement.className = 'w-10 h-10 rounded-full object-cover luxury-shadow';
            
            // Replace the current logo container
            logoContainer.parentNode.replaceChild(newLogoElement, logoContainer);
            
            console.log('✅ Logo successfully updated!');
        } else {
            console.log('📝 No logo found, keeping default R');
            // Reset to default gradient circle with "R" if no logo is uploaded
            logoContainer.innerHTML = '<span class="text-white font-bold text-lg">R</span>';
            logoContainer.className = 'w-10 h-10 luxury-gradient rounded-full flex items-center justify-center';
            // Ensure it's a div element for the default state
            if (logoContainer.tagName === 'IMG') {
                const newDefaultElement = document.createElement('div');
                newDefaultElement.id = 'club-logo-container';
                newDefaultElement.className = 'w-10 h-10 luxury-gradient rounded-full flex items-center justify-center';
                newDefaultElement.innerHTML = '<span class="text-white font-bold text-lg">R</span>';
                logoContainer.parentNode.replaceChild(newDefaultElement, logoContainer);
            }
        }
    } else {
        console.log('❌ Logo container not found!');
    }
    
    // Update site name and tagline in navigation
    const navContainer = document.querySelector('nav .flex.items-center.space-x-3');
    const textContainer = navContainer?.querySelector('.hidden.sm\\:block');
    console.log('📝 Text container found:', textContainer);
    
    if (textContainer) {
        const siteNameElement = textContainer.querySelector('h1');
        if (siteNameElement && siteContent.siteConfig.siteName) {
            siteNameElement.textContent = siteContent.siteConfig.siteName;
            console.log('✅ Updated site name to:', siteContent.siteConfig.siteName);
        }
        
        const taglineElement = textContainer.querySelector('p');
        if (taglineElement && siteContent.siteConfig.tagline) {
            taglineElement.textContent = siteContent.siteConfig.tagline;
            console.log('✅ Updated tagline to:', siteContent.siteConfig.tagline);
        }
    }
    
    // Also update footer logo if it exists
    const footerLogoContainer = document.querySelector('footer .w-12.h-12');
    if (footerLogoContainer && siteContent.siteConfig.clubLogo && siteContent.siteConfig.clubLogo.trim() !== '') {
        footerLogoContainer.innerHTML = `<img src="${siteContent.siteConfig.clubLogo}" alt="Club Logo" class="w-12 h-12 rounded-full object-cover luxury-shadow">`;
        console.log('✅ Updated footer logo as well');
    }
}