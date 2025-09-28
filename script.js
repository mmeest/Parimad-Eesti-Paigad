// Eesti Kaartirakendus - JavaScript
class EstonianMapApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.points = [];
        this.categories = [];
        this.currentEditId = null;
        this.isAddingPoint = false;
        this.currentEditCategoryId = null;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.loadCategories();
        this.initMap();
        this.bindEvents();
        this.loadSampleData();
        this.initTouchSupport();
        this.setupKeyboardSupport();
    }
    
    // Kaardi initsialiseerimine
    initMap() {
        // Eesti keskpunkt
        const estoniaCenter = [58.5953, 25.0136];
        
        this.map = L.map('map').setView(estoniaCenter, 7);
        
        // OpenStreetMap tasuta kaart
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        // Klikkimise sündmus uue punkti lisamiseks
        this.map.on('click', (e) => {
            if (this.isAddingPoint) {
                this.setCoordinates(e.latlng.lat, e.latlng.lng);
            }
        });
        
        // Touch tugi tahvlearvutitele
        this.map.on('touchstart', (e) => {
            // Vältida kaardi liigutamist kui lisame punkti
            if (this.isAddingPoint) {
                e.originalEvent.preventDefault();
            }
        });
    }
    
    // Sündmuste sidumine
    bindEvents() {
        // Sidebar toggle
        document.getElementById('toggleSidebar').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        });
        
        // Filterite sündmused
        const filterInputs = document.querySelectorAll('.filter-options input[type="checkbox"]');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.applyFilters());
        });
        
        // Modal sulgemine
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal('pointModal');
        });
        
        document.getElementById('closeEditModal').addEventListener('click', () => {
            this.closeModal('editModal');
        });
        
        // Uue punkti lisamine
        document.getElementById('addPointBtn').addEventListener('click', () => {
            this.openAddPointModal();
        });
        
        // Form submit
        document.getElementById('pointForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePoint();
        });
        
        // Cancel button
        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal('editModal');
        });
        
        // Category management
        document.getElementById('manageCategoriesBtn').addEventListener('click', () => {
            this.openCategoryModal();
        });
        
        document.getElementById('closeCategoryModal').addEventListener('click', () => {
            this.closeModal('categoryModal');
        });
        
        // Category form
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });
        
        // Modal sulgemine klikkides väljaspool
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }
    
    // Andmete laadimine localStorage-st
    loadData() {
        const saved = localStorage.getItem('estonianMapPoints');
        if (saved) {
            this.points = JSON.parse(saved);
        }
    }
    
    // Kategooriate laadimine
    loadCategories() {
        const saved = localStorage.getItem('estonianMapCategories');
        if (saved) {
            this.categories = JSON.parse(saved);
        } else {
            // Vaikimisi kategooriad
            this.categories = [
                { id: 'mansion', name: 'Mõis', icon: '🏰', color: '#8B4513' },
                { id: 'architecture', name: 'Arhitektuur', icon: '🏛️', color: '#4169E1' },
                { id: 'swimming', name: 'Ujumiskoht', icon: '🏊', color: '#00CED1' },
                { id: 'restaurant', name: 'Söögikoht', icon: '🍽️', color: '#FF6347' },
                { id: 'museum', name: 'Muuseum', icon: '🏛️', color: '#9370DB' },
                { id: 'monument', name: 'Monument', icon: '🗿', color: '#696969' }
            ];
            this.saveCategories();
        }
    }
    
    // Andmete salvestamine
    saveData() {
        localStorage.setItem('estonianMapPoints', JSON.stringify(this.points));
    }
    
    // Kategooriate salvestamine
    saveCategories() {
        localStorage.setItem('estonianMapCategories', JSON.stringify(this.categories));
    }
    
    // Näidisandmete laadimine
    loadSampleData() {
        if (this.points.length === 0) {
            this.points = [
                {
                    id: 1,
                    name: "Kadrioru loss",
                    category: "mansion",
                    description: "Barokne loss Tallinnas, ehitatud 1718-1725",
                    lat: 59.4419,
                    lng: 24.7925,
                    status: "visited",
                    posts: [
                        {
                            id: 1,
                            content: "Väga ilus loss, soovitan külastada!",
                            date: "2024-01-15",
                            images: []
                        }
                    ]
                },
                {
                    id: 2,
                    name: "Pärnu rand",
                    category: "swimming",
                    description: "Eesti kuulsaim suvepealinn",
                    lat: 58.3859,
                    lng: 24.4967,
                    status: "not-visited",
                    posts: []
                },
                {
                    id: 3,
                    name: "Tartu Ülikool",
                    category: "architecture",
                    description: "Eesti vanim ülikool, asutatud 1632",
                    lat: 58.3780,
                    lng: 26.7290,
                    status: "visited-partial",
                    posts: []
                },
                {
                    id: 4,
                    name: "Eesti Rahva Muuseum",
                    category: "museum",
                    description: "Eesti kultuuri ja ajaloo muuseum Tartus",
                    lat: 58.3780,
                    lng: 26.7290,
                    status: "not-visited",
                    posts: []
                },
                {
                    id: 5,
                    name: "Vabaduse väljak",
                    category: "monument",
                    description: "Tallinna peaväljak Vabadussõja mälestusmärgiga",
                    lat: 59.4339,
                    lng: 24.7453,
                    status: "visited",
                    posts: []
                }
            ];
            this.saveData();
        }
        
        // Uuenda kategooriate valikud ja filterid
        this.updateCategorySelect();
        this.updateFilters();
        this.renderMarkers();
    }
    
    // Märkerite renderimine
    renderMarkers() {
        // Eelmised märkerid eemaldada
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
        
        this.points.forEach(point => {
            if (this.shouldShowPoint(point)) {
                const marker = this.createMarker(point);
                this.markers.push(marker);
                marker.addTo(this.map);
            }
        });
    }
    
    // Märkeri loomine
    createMarker(point) {
        const icon = this.createCustomIcon(point);
        const marker = L.marker([point.lat, point.lng], { icon: icon });
        
        marker.on('click', () => {
            this.showPointDetails(point);
        });
        
        return marker;
    }
    
    // Kohandatud ikooni loomine
    createCustomIcon(point) {
        const statusClass = `marker-${point.status}`;
        const categoryClass = `marker-${point.category}`;
        const category = this.categories.find(c => c.id === point.category);
        const icon = category ? category.icon : '📍';
        
        const iconHtml = `
            <div class="custom-marker ${statusClass} ${categoryClass}" style="background-color: ${category ? category.color : '#667eea'}">
                ${icon}
            </div>
        `;
        
        return L.divIcon({
            html: iconHtml,
            className: 'custom-marker-container',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }
    
    // Kas punkt peaks olema nähtav
    shouldShowPoint(point) {
        const categoryFilter = document.getElementById(`filter-${point.category}`).checked;
        const statusFilter = document.getElementById(`filter-${point.status}`).checked;
        
        return categoryFilter && statusFilter;
    }
    
    // Filterite rakendamine
    applyFilters() {
        this.renderMarkers();
    }
    
    // Punkti detailide kuvamine
    showPointDetails(point) {
        const modal = document.getElementById('pointModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = point.name;
        
        const statusText = {
            'not-visited': 'Pole külastatud',
            'visited-partial': 'Vajab külastamist',
            'visited': 'Külastatud'
        };
        
        const categoryText = {
            'mansion': 'Mõis',
            'architecture': 'Arhitektuur',
            'swimming': 'Ujumiskoht',
            'restaurant': 'Söögikoht',
            'museum': 'Muuseum',
            'monument': 'Monument'
        };
        
        modalBody.innerHTML = `
            <div class="point-details">
                <div class="point-info">
                    <h4>${point.name}</h4>
                    <p><strong>Kategooria:</strong> ${categoryText[point.category]}</p>
                    <p><strong>Kirjeldus:</strong> ${point.description || 'Kirjeldus puudub'}</p>
                    <p><strong>Asukoht:</strong> ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
                    <span class="point-status status-${point.status}">${statusText[point.status]}</span>
                </div>
                
                <div class="point-actions">
                    <button class="edit-btn" onclick="app.editPoint(${point.id})">
                        <i class="fas fa-edit"></i> Muuda
                    </button>
                    <button class="delete-btn" onclick="app.deletePoint(${point.id})">
                        <i class="fas fa-trash"></i> Kustuta
                    </button>
                </div>
                
                <div class="posts-section">
                    <h4>Postitused</h4>
                    <div id="postsContainer">
                        ${this.renderPosts(point.posts || [])}
                    </div>
                    <button class="add-post-btn" onclick="app.addPost(${point.id})">
                        <i class="fas fa-plus"></i> Lisa postitus
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('pointModal');
    }
    
    // Postituste renderimine
    renderPosts(posts) {
        if (posts.length === 0) {
            return '<p>Postitusi pole veel lisatud.</p>';
        }
        
        return posts.map(post => `
            <div class="post">
                <div class="post-header">
                    <strong>Postitus</strong>
                    <span class="post-date">${post.date}</span>
                </div>
                <div class="post-content">${post.content}</div>
            </div>
        `).join('');
    }
    
    // Uue punkti lisamise modali avamine
    openAddPointModal() {
        this.isAddingPoint = true;
        this.currentEditId = null;
        
        document.getElementById('editModalTitle').textContent = 'Lisa uus punkt';
        document.getElementById('pointForm').reset();
        
        // Koordinaatide automaatne täitmine
        const center = this.map.getCenter();
        document.getElementById('pointLat').value = center.lat.toFixed(6);
        document.getElementById('pointLng').value = center.lng.toFixed(6);
        
        this.showModal('editModal');
        
        // Force focus on first input for tablet mode
        setTimeout(() => {
            const firstInput = document.getElementById('pointName');
            if (firstInput) {
                firstInput.focus();
                // Trigger click to ensure onscreen keyboard shows
                firstInput.click();
            }
        }, 300);
    }
    
    // Punkti muutmise modali avamine
    editPoint(id) {
        const point = this.points.find(p => p.id === id);
        if (!point) return;
        
        this.isAddingPoint = false;
        this.currentEditId = id;
        
        document.getElementById('editModalTitle').textContent = 'Muuda punkti';
        document.getElementById('pointName').value = point.name;
        document.getElementById('pointCategory').value = point.category;
        document.getElementById('pointDescription').value = point.description || '';
        document.getElementById('pointStatus').value = point.status;
        document.getElementById('pointLat').value = point.lat;
        document.getElementById('pointLng').value = point.lng;
        
        this.showModal('editModal');
        
        // Force focus on first input for tablet mode
        setTimeout(() => {
            const firstInput = document.getElementById('pointName');
            if (firstInput) {
                firstInput.focus();
                firstInput.click();
            }
        }, 300);
    }
    
    // Koordinaatide seadmine klikkimisel
    setCoordinates(lat, lng) {
        document.getElementById('pointLat').value = lat.toFixed(6);
        document.getElementById('pointLng').value = lng.toFixed(6);
    }
    
    // Punkti salvestamine
    savePoint() {
        const formData = {
            name: document.getElementById('pointName').value,
            category: document.getElementById('pointCategory').value,
            description: document.getElementById('pointDescription').value,
            status: document.getElementById('pointStatus').value,
            lat: parseFloat(document.getElementById('pointLat').value),
            lng: parseFloat(document.getElementById('pointLng').value)
        };
        
        if (this.currentEditId) {
            // Muudame olemasolevat punkti
            const pointIndex = this.points.findIndex(p => p.id === this.currentEditId);
            if (pointIndex !== -1) {
                this.points[pointIndex] = {
                    ...this.points[pointIndex],
                    ...formData
                };
            }
        } else {
            // Lisame uue punkti
            const newPoint = {
                id: Date.now(),
                ...formData,
                posts: []
            };
            this.points.push(newPoint);
        }
        
        this.saveData();
        this.renderMarkers();
        this.closeModal('editModal');
        this.isAddingPoint = false;
    }
    
    // Punkti kustutamine
    deletePoint(id) {
        if (confirm('Kas oled kindel, et soovid selle punkti kustutada?')) {
            this.points = this.points.filter(p => p.id !== id);
            this.saveData();
            this.renderMarkers();
            this.closeModal('pointModal');
        }
    }
    
    // Postituse lisamine
    addPost(pointId) {
        const content = prompt('Sisesta postituse sisu:');
        if (content) {
            const point = this.points.find(p => p.id === pointId);
            if (point) {
                if (!point.posts) point.posts = [];
                
                const newPost = {
                    id: Date.now(),
                    content: content,
                    date: new Date().toISOString().split('T')[0],
                    images: []
                };
                
                point.posts.push(newPost);
                this.saveData();
                this.showPointDetails(point);
            }
        }
    }
    
    // Modali kuvamine
    showModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }
    
    // Modali sulgemine
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        this.isAddingPoint = false;
    }
    
    // Touch tugi tahvlearvutitele
    initTouchSupport() {
        // Vältida kaardi zoomimist kahekordse puudutamisega
        this.map.doubleClickZoom.disable();
        
        // Lisada touch tugi märkeritele
        this.map.on('popupopen', () => {
            // Vältida kaardi liigutamist kui popup on avatud
            this.map.dragging.disable();
        });
        
        this.map.on('popupclose', () => {
            // Lubada kaardi liigutamine kui popup on suletud
            this.map.dragging.enable();
        });
        
        // Responsiivne sidebar tahvlearvutitele
        this.handleOrientationChange();
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });
        
        window.addEventListener('resize', () => {
            this.handleOrientationChange();
        });
    }
    
    // Orienteerimise muutuse käsitlemine
    handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth >= 768;
        
        if (isTablet) {
            const sidebar = document.querySelector('.sidebar');
            if (isLandscape) {
                // Horisontaalasend - sidebar kõrvale
                sidebar.style.position = 'relative';
                sidebar.style.transform = 'translateX(0)';
                sidebar.classList.remove('collapsed');
            } else {
                // Vertikaalasend - sidebar ülevalt alla
                sidebar.style.position = 'absolute';
                sidebar.classList.add('collapsed');
            }
        }
        
        // Kaardi uuendamine orientatsiooni muutuse järel
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 200);
    }
    
    // Kategooriate modali avamine
    openCategoryModal() {
        this.currentEditCategoryId = null;
        this.showModal('categoryModal');
        this.renderCategoriesList();
        this.updateCategorySelect();
    }
    
    // Kategooriate nimekirja renderimine
    renderCategoriesList() {
        const container = document.getElementById('categoriesList');
        container.innerHTML = '';
        
        this.categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <div class="category-info">
                    <div class="category-icon" style="background-color: ${category.color}">
                        ${category.icon}
                    </div>
                    <div class="category-details">
                        <div class="category-name">${category.name}</div>
                        <div class="category-id">ID: ${category.id}</div>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="edit-category-btn" onclick="app.editCategory('${category.id}')">
                        <i class="fas fa-edit"></i> Muuda
                    </button>
                    <button class="delete-category-btn" onclick="app.deleteCategory('${category.id}')">
                        <i class="fas fa-trash"></i> Kustuta
                    </button>
                </div>
            `;
            container.appendChild(categoryItem);
        });
    }
    
    // Kategooria salvestamine
    saveCategory() {
        const name = document.getElementById('categoryName').value;
        const icon = document.getElementById('categoryIcon').value;
        const color = document.getElementById('categoryColor').value;
        
        if (!name || !icon) {
            alert('Palun täida kõik väljad');
            return;
        }
        
        if (this.currentEditCategoryId) {
            // Muudame olemasolevat kategooriat
            const category = this.categories.find(c => c.id === this.currentEditCategoryId);
            if (category) {
                category.name = name;
                category.icon = icon;
                category.color = color;
            }
        } else {
            // Lisame uue kategooria
            const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const newCategory = { id, name, icon, color };
            this.categories.push(newCategory);
        }
        
        this.saveCategories();
        this.renderCategoriesList();
        this.updateCategorySelect();
        this.updateFilters();
        this.renderMarkers();
        
        // Tühjenda vorm
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryColor').value = '#667eea';
        this.currentEditCategoryId = null;
    }
    
    // Kategooria muutmine
    editCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;
        
        this.currentEditCategoryId = id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryIcon').value = category.icon;
        document.getElementById('categoryColor').value = category.color;
    }
    
    // Kategooria kustutamine
    deleteCategory(id) {
        if (confirm('Kas oled kindel, et soovid selle kategooria kustutada? Kõik selle kategooria punktid jäävad ilma kategooriata.')) {
            this.categories = this.categories.filter(c => c.id !== id);
            this.saveCategories();
            this.renderCategoriesList();
            this.updateCategorySelect();
            this.updateFilters();
            this.renderMarkers();
        }
    }
    
    // Kategooriate valiku uuendamine
    updateCategorySelect() {
        const select = document.getElementById('pointCategory');
        select.innerHTML = '';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }
    
    // Filterite uuendamine
    updateFilters() {
        const filterSection = document.querySelector('.filter-section');
        const existingFilters = filterSection.querySelectorAll('.filter-option');
        existingFilters.forEach(filter => filter.remove());
        
        this.categories.forEach(category => {
            const filterOption = document.createElement('label');
            filterOption.className = 'filter-option';
            filterOption.innerHTML = `
                <input type="checkbox" id="filter-${category.id}" checked>
                <span class="checkmark"></span>
                <i class="fas fa-map-marker-alt" style="color: ${category.color}"></i> ${category.name}
                <span class="category-count" id="count-${category.id}">0</span>
            `;
            filterSection.appendChild(filterOption);
            
            // Add event listener
            filterOption.querySelector('input').addEventListener('change', () => this.applyFilters());
        });
        
        this.updateCategoryCounts();
    }
    
    // Kategooriate loendite uuendamine
    updateCategoryCounts() {
        this.categories.forEach(category => {
            const count = this.points.filter(p => p.category === category.id).length;
            const countElement = document.getElementById(`count-${category.id}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }
    
    // Onscreen keyboard tugi
    setupKeyboardSupport() {
        // Tuvasta Windows tablet mode
        this.detectTabletMode();
        
        const textInputs = document.querySelectorAll('input[type="text"], textarea, input[type="number"]');
        textInputs.forEach(input => {
            // Force focus for onscreen keyboard
            input.addEventListener('focus', () => {
                this.handleInputFocus(input);
            });
            
            // Touch event for better tablet support
            input.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                input.focus();
            });
            
            // Click event as fallback
            input.addEventListener('click', () => {
                input.focus();
            });
        });
        
        // Listen for virtual keyboard events
        this.setupVirtualKeyboardDetection();
    }
    
    // Tuvasta Windows tablet mode
    detectTabletMode() {
        // Check for Windows tablet mode indicators
        const isTabletMode = window.navigator.maxTouchPoints > 1 && 
                           (window.navigator.userAgent.includes('Windows') || 
                            window.navigator.userAgent.includes('Lenovo'));
        
        if (isTabletMode) {
            document.body.classList.add('tablet-mode');
            console.log('Tablet mode detected');
        }
    }
    
    // Handle input focus for onscreen keyboard
    handleInputFocus(input) {
        // Force input to be visible
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // For Windows tablets, ensure the input gets focus
        setTimeout(() => {
            input.focus();
            
            // Trigger input event to ensure keyboard shows
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        }, 100);
        
        // Additional delay for slow devices
        setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
    
    // Setup virtual keyboard detection
    setupVirtualKeyboardDetection() {
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            // If height decreased significantly, virtual keyboard is likely open
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
                console.log('Virtual keyboard detected as open');
            } else {
                document.body.classList.remove('keyboard-open');
                console.log('Virtual keyboard detected as closed');
            }
        });
    }
}

// Rakenduse käivitamine
const app = new EstonianMapApp();


