// Eesti Kaartirakendus - JavaScript
class EstonianMapApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.points = [];
        this.currentEditId = null;
        this.isAddingPoint = false;
        
        // Kategooriate ikoonid
        this.categoryIcons = {
            mansion: '🏰',
            architecture: '🏛️',
            swimming: '🏊',
            restaurant: '🍽️',
            museum: '🏛️',
            monument: '🗿'
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.initMap();
        this.bindEvents();
        this.loadSampleData();
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
    
    // Andmete salvestamine
    saveData() {
        localStorage.setItem('estonianMapPoints', JSON.stringify(this.points));
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
        
        const iconHtml = `
            <div class="custom-marker ${statusClass} ${categoryClass}">
                ${this.categoryIcons[point.category]}
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
}

// Rakenduse käivitamine
const app = new EstonianMapApp();
