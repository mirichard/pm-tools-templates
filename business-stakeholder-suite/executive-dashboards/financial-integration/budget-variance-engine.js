/**
 * Real-Time Budget Variance Analysis Engine
 * Provides comprehensive budget tracking with variance analysis and forecasting
 */

class BudgetVarianceEngine {
    constructor(config = {}) {
        this.config = {
            refreshInterval: config.refreshInterval || 300000, // 5 minutes
            varianceThresholds: {
                excellent: 2,
                good: 5,
                caution: 10,
                warning: 15
            },
            alertThresholds: {
                WARNING: 5,
                CRITICAL: 10,
                EMERGENCY: 15
            },
            ...config
        };
        
        this.dataCache = new Map();
        this.subscribers = new Set();
        this.isRunning = false;
    }

    /**
     * Calculate comprehensive budget performance metrics
     */
    calculateBudgetPerformance(projectData) {
        const {
            approvedBudget,
            actualSpend,
            earnedValue,
            timeElapsed,
            totalDuration,
            historicalSpend = []
        } = projectData;

        // Core Variance Calculations
        const budgetVariance = approvedBudget - actualSpend;
        const budgetVariancePercent = (budgetVariance / approvedBudget) * 100;

        // Performance Indices
        const costPerformanceIndex = earnedValue / actualSpend;
        const plannedSpendToDate = (approvedBudget * timeElapsed) / totalDuration;
        const budgetPerformanceIndex = plannedSpendToDate / actualSpend;

        // Trend Analysis
        const varianceTrend = this.calculateVarianceTrend(historicalSpend);

        // Forecasting
        const estimateAtCompletion = actualSpend + (approvedBudget - earnedValue) / costPerformanceIndex;
        const varianceAtCompletion = approvedBudget - estimateAtCompletion;

        // Health Status
        const healthStatus = this.getBudgetHealthStatus(budgetVariancePercent);
        const alertLevel = this.getAlertLevel(budgetVariancePercent, varianceTrend);

        // Burn Rate Analysis
        const burnRateAnalysis = this.calculateBurnRate(projectData);

        return {
            budgetVariance,
            budgetVariancePercent,
            costPerformanceIndex,
            budgetPerformanceIndex,
            varianceTrend,
            estimateAtCompletion,
            varianceAtCompletion,
            healthStatus,
            alertLevel,
            burnRateAnalysis,
            lastCalculated: new Date().toISOString(),
            confidence: this.calculateConfidence(projectData)
        };
    }

    /**
     * Analyze budget variance trends
     */
    calculateVarianceTrend(historicalSpend) {
        if (historicalSpend.length < 3) {
            return {
                trend: 'INSUFFICIENT_DATA',
                slope: 0,
                confidence: 0
            };
        }

        const recent = historicalSpend.slice(-6); // Last 6 data points
        const variances = recent.map(period => period.variancePercent || 0);
        
        // Linear regression to determine trend
        const trend = this.linearRegression(variances);
        
        let trendDirection;
        if (trend.slope > 0.5) trendDirection = 'IMPROVING';
        else if (trend.slope < -0.5) trendDirection = 'DETERIORATING';
        else trendDirection = 'STABLE';

        return {
            trend: trendDirection,
            slope: trend.slope,
            confidence: trend.r2,
            recentVariances: variances,
            projection: this.projectTrend(trend, 3) // 3 periods ahead
        };
    }

    /**
     * Calculate burn rate and runway analysis
     */
    calculateBurnRate(projectData) {
        const {
            actualSpend,
            timeElapsed,
            totalDuration,
            approvedBudget,
            historicalSpend = []
        } = projectData;

        const actualBurnRate = actualSpend / timeElapsed;
        const plannedBurnRate = approvedBudget / totalDuration;
        const burnRateRatio = actualBurnRate / plannedBurnRate;

        const remainingBudget = approvedBudget - actualSpend;
        const runway = remainingBudget / actualBurnRate;

        // Recent burn rate trend
        const recentBurnRates = historicalSpend.slice(-4).map(period => 
            period.actualSpend / period.timeElapsed
        );

        return {
            actualBurnRate,
            plannedBurnRate,
            burnRateRatio,
            remainingBudget,
            runway,
            recentBurnRates,
            isAccelerating: this.isBurnRateAccelerating(recentBurnRates),
            riskLevel: this.assessBurnRateRisk(burnRateRatio, runway)
        };
    }

    /**
     * Multi-dimensional variance analysis by category
     */
    analyzeCategoryVariances(budgetData) {
        const categories = ['labor', 'vendor', 'infrastructure', 'training', 'contingency'];
        const analysis = {};

        categories.forEach(category => {
            const categoryData = budgetData[category];
            if (!categoryData) return;

            analysis[category] = {
                approved: categoryData.approved || 0,
                actual: categoryData.actual || 0,
                forecast: categoryData.forecast || 0,
                variance: (categoryData.approved || 0) - (categoryData.actual || 0),
                variancePercent: this.calculatePercentage(
                    (categoryData.approved || 0) - (categoryData.actual || 0),
                    categoryData.approved || 1
                ),
                trend: this.calculateCategoryTrend(categoryData.historical || []),
                driverAnalysis: this.identifyVarianceDrivers(categoryData),
                recommendations: this.generateCategoryRecommendations(categoryData),
                riskScore: this.calculateCategoryRisk(categoryData)
            };
        });

        return {
            categories: analysis,
            topVariances: this.getTopVariances(analysis),
            riskFactors: this.identifyBudgetRisks(analysis),
            executiveSummary: this.generateExecutiveSummary(analysis)
        };
    }

    /**
     * Identify specific variance drivers
     */
    identifyVarianceDrivers(categoryData) {
        const drivers = [];

        // Rate variance analysis
        if (categoryData.actualRate && categoryData.plannedRate) {
            const rateVariance = categoryData.actualRate - categoryData.plannedRate;
            const rateVariancePercent = (rateVariance / categoryData.plannedRate) * 100;
            
            if (Math.abs(rateVariancePercent) > 5) {
                drivers.push({
                    type: 'RATE_VARIANCE',
                    impact: rateVariance * (categoryData.actualQuantity || 0),
                    impactPercent: rateVariancePercent,
                    description: `Rate variance: ${rateVariancePercent > 0 ? '+' : ''}${rateVariancePercent.toFixed(1)}%`,
                    severity: Math.abs(rateVariancePercent) > 15 ? 'HIGH' : 'MEDIUM'
                });
            }
        }

        // Quantity variance analysis
        if (categoryData.actualQuantity && categoryData.plannedQuantity) {
            const quantityVariance = categoryData.actualQuantity - categoryData.plannedQuantity;
            const quantityVariancePercent = (quantityVariance / categoryData.plannedQuantity) * 100;
            
            if (Math.abs(quantityVariancePercent) > 5) {
                drivers.push({
                    type: 'QUANTITY_VARIANCE',
                    impact: quantityVariance * (categoryData.plannedRate || 0),
                    impactPercent: quantityVariancePercent,
                    description: `Quantity variance: ${quantityVariancePercent > 0 ? '+' : ''}${quantityVariancePercent.toFixed(1)}%`,
                    severity: Math.abs(quantityVariancePercent) > 20 ? 'HIGH' : 'MEDIUM'
                });
            }
        }

        // Timing variance analysis
        if (categoryData.actualTiming && categoryData.plannedTiming) {
            const timingVariance = categoryData.actualTiming - categoryData.plannedTiming;
            
            if (Math.abs(timingVariance) > 7) { // More than 1 week variance
                drivers.push({
                    type: 'TIMING_VARIANCE',
                    impact: this.calculateTimingImpact(timingVariance, categoryData),
                    impactDays: timingVariance,
                    description: `Timing variance: ${timingVariance > 0 ? '+' : ''}${timingVariance} days`,
                    severity: Math.abs(timingVariance) > 30 ? 'HIGH' : 'MEDIUM'
                });
            }
        }

        return drivers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    }

    /**
     * Advanced forecasting with multiple models
     */
    generateAdvancedForecast(projectData) {
        const {
            plannedValue,
            earnedValue,
            actualCost,
            budgetAtCompletion
        } = projectData;

        // Core EVM calculations
        const scheduleVariance = earnedValue - plannedValue;
        const costVariance = earnedValue - actualCost;
        const schedulePerformanceIndex = earnedValue / plannedValue;
        const costPerformanceIndex = earnedValue / actualCost;

        // Multiple forecasting models
        const forecasts = {
            // CPI-based forecast
            cpiBasedForecast: {
                estimateAtCompletion: actualCost + (budgetAtCompletion - earnedValue) / costPerformanceIndex,
                confidence: this.calculateForecastConfidence(costPerformanceIndex, 'CPI'),
                scenario: 'Current cost efficiency continues'
            },

            // Combined SPI*CPI forecast
            combinedForecast: {
                estimateAtCompletion: actualCost + (budgetAtCompletion - earnedValue) / (schedulePerformanceIndex * costPerformanceIndex),
                confidence: this.calculateForecastConfidence([schedulePerformanceIndex, costPerformanceIndex], 'COMBINED'),
                scenario: 'Both schedule and cost efficiency considered'
            },

            // Monte Carlo simulation
            monteCarloForecast: this.generateMonteCarloForecast(projectData),

            // Trend-based forecast
            trendBasedForecast: this.generateTrendBasedForecast(projectData)
        };

        // Consensus forecast (weighted average)
        const consensusForecast = this.calculateConsensusForecast(forecasts);

        return {
            currentMetrics: {
                scheduleVariance,
                costVariance,
                schedulePerformanceIndex,
                costPerformanceIndex
            },
            forecasts,
            consensusForecast,
            riskAnalysis: this.analyzeForecastRisks(forecasts),
            recommendations: this.generateForecastRecommendations(forecasts)
        };
    }

    /**
     * Monte Carlo simulation for probabilistic forecasting
     */
    generateMonteCarloForecast(projectData, iterations = 10000) {
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            // Simulate variations in key parameters
            const costVariation = this.normalRandom(1, 0.1);  // ±10% cost variation
            const scheduleVariation = this.normalRandom(1, 0.15); // ±15% schedule variation
            const riskImpact = this.exponentialRandom(0.05); // Risk impact

            // Calculate simulated final cost
            const simulatedCost = projectData.actualCost * costVariation * scheduleVariation * (1 + riskImpact);
            results.push(simulatedCost);
        }

        results.sort((a, b) => a - b);

        return {
            mean: results.reduce((sum, val) => sum + val, 0) / results.length,
            median: results[Math.floor(results.length / 2)],
            percentiles: {
                p10: results[Math.floor(results.length * 0.1)],
                p25: results[Math.floor(results.length * 0.25)],
                p75: results[Math.floor(results.length * 0.75)],
                p90: results[Math.floor(results.length * 0.9)]
            },
            probabilityOfOverrun: results.filter(cost => cost > projectData.budgetAtCompletion).length / results.length,
            confidenceInterval: {
                lower: results[Math.floor(results.length * 0.025)],
                upper: results[Math.floor(results.length * 0.975)]
            },
            scenario: 'Probabilistic forecast with risk factors'
        };
    }

    /**
     * Real-time alert processing
     */
    processRealTimeAlerts(budgetData, historicalData) {
        const alerts = [];
        const currentTime = new Date();

        // Budget variance alerts
        const variancePercent = Math.abs(budgetData.budgetVariancePercent);
        
        if (variancePercent >= this.config.alertThresholds.EMERGENCY) {
            alerts.push({
                id: `budget-emergency-${Date.now()}`,
                level: 'EMERGENCY',
                type: 'BUDGET_VARIANCE',
                title: 'Critical Budget Variance',
                message: `Budget variance of ${variancePercent.toFixed(1)}% requires immediate executive action`,
                impact: `$${Math.abs(budgetData.budgetVariance).toLocaleString()} over budget`,
                urgency: 'IMMEDIATE',
                deadline: new Date(currentTime.getTime() + 4 * 60 * 60 * 1000), // 4 hours
                escalation: ['CFO', 'CEO', 'Board'],
                actions: [
                    'Immediate budget review meeting',
                    'Scope reduction analysis',
                    'Vendor renegotiation',
                    'Board notification'
                ],
                data: {
                    currentVariance: budgetData.budgetVariance,
                    variancePercent: budgetData.budgetVariancePercent,
                    trend: budgetData.varianceTrend
                }
            });
        } else if (variancePercent >= this.config.alertThresholds.CRITICAL) {
            alerts.push({
                id: `budget-critical-${Date.now()}`,
                level: 'CRITICAL',
                type: 'BUDGET_VARIANCE',
                title: 'Significant Budget Variance',
                message: `Budget variance of ${variancePercent.toFixed(1)}% requires CFO attention`,
                impact: `$${Math.abs(budgetData.budgetVariance).toLocaleString()} variance detected`,
                urgency: 'HIGH',
                deadline: new Date(currentTime.getTime() + 24 * 60 * 60 * 1000), // 24 hours
                escalation: ['PM', 'CFO', 'ExecutiveSponsor'],
                actions: [
                    'Schedule CFO review',
                    'Prepare variance analysis',
                    'Evaluate corrective actions'
                ]
            });
        }

        // Burn rate alerts
        if (budgetData.burnRateAnalysis) {
            const { burnRateRatio, runway, riskLevel } = budgetData.burnRateAnalysis;
            
            if (riskLevel === 'HIGH' || runway <= 30) {
                alerts.push({
                    id: `burnrate-${Date.now()}`,
                    level: runway <= 15 ? 'EMERGENCY' : 'CRITICAL',
                    type: 'BURN_RATE_EXCEEDED',
                    title: 'Excessive Burn Rate',
                    message: `Burn rate ${((burnRateRatio - 1) * 100).toFixed(1)}% above plan`,
                    impact: `Budget runway: ${runway.toFixed(0)} days at current rate`,
                    urgency: runway <= 15 ? 'IMMEDIATE' : 'HIGH',
                    escalation: ['PM', 'CFO'],
                    actions: [
                        'Immediate spend freeze on non-critical items',
                        'Resource utilization review',
                        'Vendor payment schedule renegotiation'
                    ]
                });
            }
        }

        // Trend-based alerts
        if (budgetData.varianceTrend && budgetData.varianceTrend.trend === 'DETERIORATING') {
            alerts.push({
                id: `trend-${Date.now()}`,
                level: 'WARNING',
                type: 'TREND_DETERIORATION',
                title: 'Deteriorating Budget Trend',
                message: 'Budget performance showing negative trend',
                impact: 'Potential for increased variance if trend continues',
                urgency: 'MEDIUM',
                escalation: ['PM', 'FinanceManager'],
                actions: [
                    'Root cause analysis',
                    'Process improvement initiative',
                    'Resource reallocation review'
                ]
            });
        }

        return {
            alerts,
            alertSummary: this.generateAlertSummary(alerts),
            recommendedActions: this.prioritizeActions(alerts),
            escalationMatrix: this.buildEscalationMatrix(alerts)
        };
    }

    /**
     * Utility functions
     */
    getBudgetHealthStatus(variancePercent) {
        const absVariance = Math.abs(variancePercent);
        
        if (absVariance <= this.config.varianceThresholds.excellent) {
            return { status: 'EXCELLENT', level: 'excellent', color: '#27ae60', icon: '🟢' };
        } else if (absVariance <= this.config.varianceThresholds.good) {
            return { status: 'GOOD', level: 'good', color: '#2ecc71', icon: '🟢' };
        } else if (absVariance <= this.config.varianceThresholds.caution) {
            return { status: 'CAUTION', level: 'caution', color: '#f39c12', icon: '🟡' };
        } else if (absVariance <= this.config.varianceThresholds.warning) {
            return { status: 'WARNING', level: 'warning', color: '#e67e22', icon: '🟠' };
        } else {
            return { status: 'CRITICAL', level: 'critical', color: '#e74c3c', icon: '🔴' };
        }
    }

    getAlertLevel(variancePercent, trend) {
        const absVariance = Math.abs(variancePercent);
        
        if (absVariance >= this.config.alertThresholds.EMERGENCY) return 'EMERGENCY';
        if (absVariance >= this.config.alertThresholds.CRITICAL) return 'CRITICAL';
        if (absVariance >= this.config.alertThresholds.WARNING) return 'WARNING';
        if (trend && trend.trend === 'DETERIORATING') return 'CAUTION';
        
        return 'NORMAL';
    }

    calculatePercentage(value, base) {
        return base === 0 ? 0 : (value / base) * 100;
    }

    linearRegression(values) {
        const n = values.length;
        const x = Array.from({length: n}, (_, i) => i);
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate R-squared
        const yMean = sumY / n;
        const totalSumSquares = values.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
        const residualSumSquares = values.reduce((sum, yi, i) => {
            const predicted = intercept + slope * x[i];
            return sum + Math.pow(yi - predicted, 2);
        }, 0);
        const r2 = 1 - (residualSumSquares / totalSumSquares);

        return { slope, intercept, r2 };
    }

    normalRandom(mean = 0, stdDev = 1) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdDev + mean;
    }

    exponentialRandom(lambda) {
        return -Math.log(1 - Math.random()) / lambda;
    }

    // Subscribe to real-time updates
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    // Notify all subscribers
    notifySubscribers(data) {
        this.subscribers.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in subscriber callback:', error);
            }
        });
    }

    // Start real-time processing
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.processRealTimeData();
        }, this.config.refreshInterval);
        
        console.log('Budget Variance Engine started');
    }

    // Stop real-time processing
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('Budget Variance Engine stopped');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BudgetVarianceEngine;
} else if (typeof window !== 'undefined') {
    window.BudgetVarianceEngine = BudgetVarianceEngine;
}
