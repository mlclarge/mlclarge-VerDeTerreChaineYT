// Application State
let allVideos = [];
let filteredVideos = [];
let currentView = 'grid';

// Configuration
const CSV_FILE = 'videos_ENRICHI.csv';

// DOM Elements
const elements = {
    loading: document.getElementById('loading'),
    videoGrid: document.getElementById('videoGrid'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    categoryFilter: document.getElementById('categoryFilter'),
    intervenantFilter: document.getElementById('intervenantFilter'),
    dateFilter: document.getElementById('dateFilter'),
    sortFilter: document.getElementById('sortFilter'),
    resetFilters: document.getElementById('resetFilters'),
    activeFilters: document.getElementById('activeFilters'),
    resultsHeader: document.getElementById('resultsHeader'),
    resultsCount: document.getElementById('resultsCount'),
    noResults: document.getElementById('noResults'),
    videoCount: document.getElementById('videoCount'),
    gridView: document.getElementById('gridView'),
    listView: document.getElementById('listView')
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        await loadCSV();
        setupEventListeners();
        displayVideos(allVideos);
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        showError('Erreur lors du chargement des données');
    }
}

// Load CSV Data
async function loadCSV() {
    try {
        const response = await fetch(CSV_FILE);
        const text = await response.text();
        
        // Parse CSV (semicolon-delimited)
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(';').map(h => h.trim());
        
        allVideos = lines.slice(1).map((line, index) => {
            const values = parseCSVLine(line);
            const video = {};
            
            headers.forEach((header, i) => {
                video[header] = values[i] ? values[i].trim() : '';
            });
            
            // Parse numeric values
            video.Vues = parseInt(video.Vues || 0);
            video.Likes = parseInt(video.Likes || 0);
            video.Commentaires = parseInt(video.Commentaires || 0);
            
            // Parse date
            if (video.Date_Publication) {
                const parts = video.Date_Publication.split('/');
                if (parts.length === 3) {
                    video.Date_Parsed = new Date(parts[2], parts[1] - 1, parts[0]);
                }
            }
            
            return video;
        }).filter(v => v.video_id && v.Titre);
        
        elements.videoCount.textContent = `${allVideos.length} vidéos`;
        populateFilters();
        
    } catch (error) {
        console.error('Erreur lors du chargement du CSV:', error);
        throw error;
    }
}

// Parse CSV line handling quoted values
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ';' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values;
}

// Populate filter dropdowns
function populateFilters() {
    // Catégories uniques
    const categories = new Set();
    allVideos.forEach(v => {
        if (v.Categories) {
            v.Categories.split(',').forEach(cat => {
                const trimmed = cat.trim();
                if (trimmed && trimmed !== 'Général') {
                    categories.add(trimmed);
                }
            });
        }
    });
    
    [...categories].sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        elements.categoryFilter.appendChild(option);
    });
    
    // Intervenants uniques
    const intervenants = new Set();
    allVideos.forEach(v => {
        if (v.Intervenants) {
            v.Intervenants.split(',').forEach(interv => {
                const trimmed = interv.trim();
                if (trimmed) intervenants.add(trimmed);
            });
        }
    });
    
    [...intervenants].sort().forEach(interv => {
        const option = document.createElement('option');
        option.value = interv;
        option.textContent = interv;
        elements.intervenantFilter.appendChild(option);
    });
}

// Event Listeners
function setupEventListeners() {
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    elements.clearSearch.addEventListener('click', clearSearch);
    elements.categoryFilter.addEventListener('change', applyFilters);
    elements.intervenantFilter.addEventListener('change', applyFilters);
    elements.dateFilter.addEventListener('change', applyFilters);
    elements.sortFilter.addEventListener('change', applyFilters);
    elements.resetFilters.addEventListener('click', resetFilters);
    elements.gridView.addEventListener('click', () => setView('grid'));
    elements.listView.addEventListener('click', () => setView('list'));
}

// Search Handler
function handleSearch() {
    const query = elements.searchInput.value.trim();
    elements.clearSearch.style.display = query ? 'block' : 'none';
    applyFilters();
}

function clearSearch() {
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    applyFilters();
}

// Apply Filters
function applyFilters() {
    const searchQuery = elements.searchInput.value.toLowerCase().trim();
    const categoryFilter = elements.categoryFilter.value;
    const intervenantFilter = elements.intervenantFilter.value;
    const dateFilter = elements.dateFilter.value;
    const sortBy = elements.sortFilter.value;
    
    const now = new Date();
    
    // Filter videos
    filteredVideos = allVideos.filter(video => {
        // Search filter
        const matchesSearch = !searchQuery || 
            video.Titre.toLowerCase().includes(searchQuery) ||
            video.Description?.toLowerCase().includes(searchQuery) ||
            video.Tags?.toLowerCase().includes(searchQuery) ||
            video.Categories?.toLowerCase().includes(searchQuery) ||
            video.Intervenants?.toLowerCase().includes(searchQuery);
        
        // Category filter
        const matchesCategory = !categoryFilter || 
            video.Categories?.includes(categoryFilter);
        
        // Intervenant filter
        const matchesIntervenant = !intervenantFilter || 
            video.Intervenants?.includes(intervenantFilter);
        
        // Date filter
        let matchesDate = true;
        if (dateFilter && video.Date_Parsed) {
            const daysDiff = Math.floor((now - video.Date_Parsed) / (1000 * 60 * 60 * 24));
            
            switch(dateFilter) {
                case 'week':
                    matchesDate = daysDiff <= 7;
                    break;
                case 'month':
                    matchesDate = daysDiff <= 30;
                    break;
                case '3months':
                    matchesDate = daysDiff <= 90;
                    break;
                case '6months':
                    matchesDate = daysDiff <= 180;
                    break;
                case 'year':
                    matchesDate = daysDiff <= 365;
                    break;
                case 'last-year':
                    matchesDate = daysDiff > 365 && daysDiff <= 730;
                    break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesIntervenant && matchesDate;
    });
    
    // Sort videos
    sortVideos(filteredVideos, sortBy);
    
    // Update active filters display
    updateActiveFilters({ searchQuery, categoryFilter, intervenantFilter, dateFilter });
    
    // Display results
    displayVideos(filteredVideos);
}

// Sort Videos
function sortVideos(videos, sortBy) {
    switch(sortBy) {
        case 'date-desc':
            videos.sort((a, b) => (b.Date_Parsed || 0) - (a.Date_Parsed || 0));
            break;
        case 'date-asc':
            videos.sort((a, b) => (a.Date_Parsed || 0) - (b.Date_Parsed || 0));
            break;
        case 'views-desc':
            videos.sort((a, b) => (b.Vues || 0) - (a.Vues || 0));
            break;
        case 'views-asc':
            videos.sort((a, b) => (a.Vues || 0) - (b.Vues || 0));
            break;
        case 'title-asc':
            videos.sort((a, b) => a.Titre.localeCompare(b.Titre));
            break;
        case 'title-desc':
            videos.sort((a, b) => b.Titre.localeCompare(a.Titre));
            break;
        case 'duration-desc':
            videos.sort((a, b) => parseDuration(b.Duree) - parseDuration(a.Duree));
            break;
        case 'duration-asc':
            videos.sort((a, b) => parseDuration(a.Duree) - parseDuration(b.Duree));
            break;
        default:
            // Relevance - keep original order from search
            break;
    }
}

// Parse duration to seconds
function parseDuration(duration) {
    if (!duration) return 0;
    const parts = duration.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return 0;
}

// Update Active Filters Display
function updateActiveFilters(filters) {
    elements.activeFilters.innerHTML = '';
    
    if (filters.searchQuery) {
        addFilterTag('Recherche', filters.searchQuery, () => clearSearch());
    }
    
    if (filters.categoryFilter) {
        addFilterTag('Catégorie', filters.categoryFilter, () => {
            elements.categoryFilter.value = '';
            applyFilters();
        });
    }
    
    if (filters.intervenantFilter) {
        addFilterTag('Intervenant', filters.intervenantFilter, () => {
            elements.intervenantFilter.value = '';
            applyFilters();
        });
    }
    
    if (filters.dateFilter) {
        const dateLabels = {
            'week': 'Cette semaine',
            'month': 'Ce mois-ci',
            '3months': '3 derniers mois',
            '6months': '6 derniers mois',
            'year': 'Cette année',
            'last-year': 'Année dernière'
        };
        addFilterTag('Date', dateLabels[filters.dateFilter] || filters.dateFilter, () => {
            elements.dateFilter.value = '';
            applyFilters();
        });
    }
}

function addFilterTag(label, value, onRemove) {
    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    tag.innerHTML = `
        <span>${label}: ${value}</span>
        <button onclick="event.preventDefault()">✕</button>
    `;
    tag.querySelector('button').addEventListener('click', onRemove);
    elements.activeFilters.appendChild(tag);
}

// Reset Filters
function resetFilters() {
    elements.searchInput.value = '';
    elements.categoryFilter.value = '';
    elements.intervenantFilter.value = '';
    elements.dateFilter.value = '';
    elements.sortFilter.value = 'date-desc';
    clearSearch();
}

// Display Videos
function displayVideos(videos) {
    elements.loading.style.display = 'none';
    elements.resultsHeader.style.display = 'flex';
    
    if (videos.length === 0) {
        elements.videoGrid.style.display = 'none';
        elements.noResults.style.display = 'block';
        elements.resultsCount.textContent = '0 résultat';
        return;
    }
    
    elements.noResults.style.display = 'none';
    elements.videoGrid.style.display = 'grid';
    elements.resultsCount.textContent = `${videos.length} résultat${videos.length > 1 ? 's' : ''}`;
    
    elements.videoGrid.innerHTML = videos.map(video => createVideoCard(video)).join('');
}

// Create Video Card HTML
function createVideoCard(video) {
    const views = formatNumber(video.Vues || 0);
    const duration = formatDuration(video.Duree);
    const date = video.Date_Publication || '';
    
    // Extraire catégories (limiter à 3)
    const categories = video.Categories ? 
        video.Categories.split(',').map(c => c.trim()).filter(c => c && c !== 'Général').slice(0, 3) : [];
    
    // Extraire intervenant principal
    const intervenant = video.Intervenants ? 
        video.Intervenants.split(',')[0].trim() : '';
    
    // Extraire et nettoyer la description (150 caractères max)
    let description = '';
    if (video.Description) {
        // Nettoyer les balises HTML et caractères spéciaux
        description = video.Description
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
            .trim();
        
        // Limiter à 150 caractères et couper au dernier mot complet
        if (description.length > 150) {
            description = description.substring(0, 150);
            const lastSpace = description.lastIndexOf(' ');
            if (lastSpace > 0) {
                description = description.substring(0, lastSpace);
            }
            description += '...';
        }
    }
    
    return `
        <div class="video-card">
            <div class="video-thumbnail">
                <div class="play-icon">▶</div>
                ${duration ? `<div class="video-duration">${duration}</div>` : ''}
            </div>
            <div class="video-content">
                <div class="video-header">
                    <span class="video-id">${video.video_id || ''}</span>
                    ${date ? `<span class="video-date">📅 ${date}</span>` : ''}
                </div>
                
                <h3 class="video-title">${escapeHtml(video.Titre)}</h3>
                
                ${intervenant ? `<div class="video-intervenant">👤 ${escapeHtml(intervenant)}</div>` : ''}
                
                ${description ? `<p class="video-description">${escapeHtml(description)}</p>` : ''}
                
                <div class="video-meta">
                    ${views > 0 ? `<span class="meta-item">👁️ ${views} vues</span>` : ''}
                    ${video.Likes > 0 ? `<span class="meta-item">👍 ${formatNumber(video.Likes)}</span>` : ''}
                </div>
                
                ${categories.length > 0 ? `
                <div class="video-categories">
                    ${categories.map(cat => `<span class="category-tag">${escapeHtml(cat)}</span>`).join('')}
                </div>
                ` : ''}
                
                <div class="video-actions">
                    <a href="${video.URL}" target="_blank" rel="noopener noreferrer" class="watch-btn">
                        🎥 Voir sur YouTube
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Format numbers with spaces
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Format duration
function formatDuration(duration) {
    if (!duration) return '';
    const parts = duration.split(':');
    if (parts.length === 3) {
        const h = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        if (h > 0) return `${h}h${m}min`;
        return `${m}min`;
    } else if (parts.length === 2) {
        const m = parseInt(parts[0]);
        return `${m}min`;
    }
    return duration;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Set View Mode
function setView(view) {
    currentView = view;
    elements.videoGrid.className = view === 'list' ? 'video-grid list-view' : 'video-grid';
    elements.gridView.classList.toggle('active', view === 'grid');
    elements.listView.classList.toggle('active', view === 'list');
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error Display
function showError(message) {
    elements.loading.style.display = 'none';
    elements.videoGrid.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">⚠️</div>
            <h3>Erreur</h3>
            <p>${message}</p>
        </div>
    `;
}
