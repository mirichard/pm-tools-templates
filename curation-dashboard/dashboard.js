document.addEventListener('DOMContentLoaded', () => {
    let metricsData = null;
    let templatesData = [];
    
    // Fetch curation metrics data
    async function fetchCurationData() {
        try {
            const response = await fetch('../public/metrics/curation-metrics.json');
            if (!response.ok) throw new Error('Failed to fetch curation data');
            
            metricsData = await response.json();
            templatesData = metricsData.templates.map(template => ({
                templateName: template.name,
                overallScore: template.overallScore,
                tier: template.tier,
                categoryScores: template.categoryScores,
                lastUpdated: new Date(template.lastUpdated).toLocaleDateString()
            }));
            
            updateDashboard();
        } catch (error) {
            console.error('Error fetching curation data:', error);
            showError('Failed to load template data. Please refresh the page.');
        }
    }
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    function updateDashboard() {
        if (!metricsData) return;
        
        // Update summary cards
        updateSummaryCards();
        
        // Update charts
        updateCharts();
        
        // Update templates table
        renderTemplatesTable(templatesData);
        
        // Update last updated timestamp
        document.getElementById('lastUpdated').textContent = 
            new Date(metricsData.lastGenerated).toLocaleString();
    }
    
    function updateSummaryCards() {
        if (!metricsData) return;
        
        document.getElementById('premiumCount').textContent = metricsData.totals.premium;
        document.getElementById('featuredCount').textContent = metricsData.totals.featured;
        document.getElementById('recommendedCount').textContent = metricsData.totals.recommended;
        document.getElementById('standardCount').textContent = metricsData.totals.standard;
        document.getElementById('communityCount').textContent = metricsData.totals.community;
    }
    
    let scoreChart = null;
    let tierChart = null;
    
    function updateCharts() {
        if (!metricsData) return;
        
        // Score Distribution Chart
        const scoreCtx = document.getElementById('scoreChart').getContext('2d');
        if (scoreChart) scoreChart.destroy();
        
        scoreChart = new Chart(scoreCtx, {
            type: 'bar',
            data: {
                labels: metricsData.scoreBuckets.map(bucket => bucket.range),
                datasets: [{
                    label: 'Number of Templates',
                    data: metricsData.scoreBuckets.map(bucket => bucket.count),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
        
        // Tier Distribution Chart
        const tierCtx = document.getElementById('tierChart').getContext('2d');
        if (tierChart) tierChart.destroy();
        
        const tierData = [
            metricsData.totals.premium,
            metricsData.totals.featured,
            metricsData.totals.recommended,
            metricsData.totals.standard,
            metricsData.totals.community
        ];
        
        tierChart = new Chart(tierCtx, {
            type: 'doughnut',
            data: {
                labels: ['Premium', 'Featured', 'Recommended', 'Standard', 'Community'],
                datasets: [{
                    data: tierData,
                    backgroundColor: [
                        '#9333ea', // Purple for Premium
                        '#3b82f6', // Blue for Featured
                        '#10b981', // Green for Recommended
                        '#f59e0b', // Orange for Standard
                        '#6b7280'  // Gray for Community
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function renderTemplatesTable(data) {
        const tableBody = document.getElementById('templatesTableBody');
        tableBody.innerHTML = '';

        data.forEach(template => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${template.templateName}</td>
                <td class="px-6 py-4"><span class="tier-badge tier-${template.tier.toLowerCase()}">${template.tier}</span></td>
                <td class="px-6 py-4">${template.overallScore.toFixed(1)}</td>
                <td class="px-6 py-4">
                    Quality: ${template.categoryScores.quality},
                    Community: ${template.categoryScores.community},
                    Engagement: ${template.categoryScores.engagement},
                    Maintenance: ${template.categoryScores.maintenance},
                    Innovation: ${template.categoryScores.innovation}
                </td>
                <td class="px-6 py-4">${template.lastUpdated}</td>
                <td class="px-6 py-4">
                    <button class="text-blue-600 hover:text-blue-900">Details</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            fetchCurationData(); // Refresh data from source
        });
    }

    function initDashboard() {
        setupEventListeners();
        fetchCurationData(); // Initial data load
    }

    initDashboard();
});
