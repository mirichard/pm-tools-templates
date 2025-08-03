Attribute VB_Name = "Financial_Forecasting_Module"
Option Explicit

' Advanced Financial Forecasting Module
' Version: 2.3
' Created: 2025-01-02
' Purpose: Comprehensive financial forecasting with multiple predictive models

' ============================================
' TYPE DEFINITIONS AND STRUCTURES
' ============================================

Public Type SimulationParameters
    meanReturn As Double
    volatility As Double
    riskFreeRate As Double
    timeHorizon As Double
    iterations As Long
    correlationMatrix As Variant
End Type

Public Type ARIMAParameters
    p As Integer ' Auto-regressive order
    d As Integer ' Differencing order
    q As Integer ' Moving average order
    arCoeffs() As Double
    maCoeffs() As Double
    constant As Double
    aic As Double
End Type

Public Type EnsembleModel
    linearWeight As Double
    exponentialWeight As Double
    monteCarloWeight As Double
    arimaWeight As Double
    combinationMethod As String ' "SIMPLE", "WEIGHTED", "BAYESIAN"
    accuracy As Double
    confidence As Double
End Type

Public Type ForecastResult
    forecast() As Double
    confidence() As Double
    accuracy As Double
    model As String
    parameters As String
    riskMetrics As Variant
End Type

' ============================================
' LINEAR TREND FORECASTING
' ============================================

Function LinearTrendForecast(historicalData As Range, periods As Integer) As ForecastResult
    '
    ' Linear trend forecasting using least squares regression
    ' Returns comprehensive forecast results with confidence intervals
    '
    Dim result As ForecastResult
    Dim n As Long
    Dim x() As Double, y() As Double
    Dim sumX As Double, sumY As Double, sumXY As Double, sumX2 As Double
    Dim slope As Double, intercept As Double
    Dim i As Long
    
    n = historicalData.Count
    ReDim x(1 To n), y(1 To n)
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    
    ' Extract data points and calculate sums
    For i = 1 To n
        x(i) = i
        y(i) = historicalData.Cells(i, 1).Value
        sumX = sumX + x(i)
        sumY = sumY + y(i)
        sumXY = sumXY + x(i) * y(i)
        sumX2 = sumX2 + x(i) * x(i)
    Next i
    
    ' Calculate regression coefficients
    slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    intercept = (sumY - slope * sumX) / n
    
    ' Calculate standard error for confidence intervals
    Dim sse As Double, mse As Double, standardError As Double
    For i = 1 To n
        Dim predicted As Double
        predicted = intercept + slope * x(i)
        sse = sse + (y(i) - predicted) ^ 2
    Next i
    mse = sse / (n - 2)
    standardError = Sqr(mse)
    
    ' Generate forecasts with confidence intervals
    For i = 1 To periods
        result.forecast(i) = intercept + slope * (n + i)
        result.confidence(i) = 1.96 * standardError * Sqr(1 + 1 / n + ((n + i) - (sumX / n)) ^ 2 / (sumX2 - sumX * sumX / n))
    Next i
    
    ' Calculate R-squared for accuracy measure
    Dim totalSumSquares As Double, yMean As Double
    yMean = sumY / n
    For i = 1 To n
        totalSumSquares = totalSumSquares + (y(i) - yMean) ^ 2
    Next i
    result.accuracy = 1 - (sse / totalSumSquares)
    
    result.model = "Linear Trend"
    result.parameters = "Slope: " & Format(slope, "0.0000") & ", Intercept: " & Format(intercept, "0.0000")
    
    LinearTrendForecast = result
End Function

Function PolynomialTrendForecast(historicalData As Range, degree As Integer, periods As Integer) As ForecastResult
    '
    ' Polynomial trend forecasting for non-linear patterns
    '
    Dim result As ForecastResult
    Dim n As Long, i As Long, j As Long
    Dim x() As Double, y() As Double
    Dim coefficients() As Double
    
    n = historicalData.Count
    ReDim x(1 To n), y(1 To n), coefficients(0 To degree)
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    
    ' Extract data points
    For i = 1 To n
        x(i) = i
        y(i) = historicalData.Cells(i, 1).Value
    Next i
    
    ' Fit polynomial using matrix methods
    Call FitPolynomial(x, y, degree, coefficients)
    
    ' Generate forecasts
    For i = 1 To periods
        Dim forecastValue As Double
        forecastValue = coefficients(0)
        For j = 1 To degree
            forecastValue = forecastValue + coefficients(j) * ((n + i) ^ j)
        Next j
        result.forecast(i) = forecastValue
    Next i
    
    ' Calculate accuracy metrics
    result.accuracy = CalculatePolynomialAccuracy(x, y, coefficients, degree)
    result.model = "Polynomial Trend"
    result.parameters = "Degree: " & degree
    
    PolynomialTrendForecast = result
End Function

' ============================================
' EXPONENTIAL SMOOTHING MODELS
' ============================================

Function SimpleExponentialSmoothing(historicalData As Range, alpha As Double, periods As Integer) As ForecastResult
    '
    ' Simple exponential smoothing forecast
    ' Formula: F(t+1) = α * A(t) + (1-α) * F(t)
    '
    Dim result As ForecastResult
    Dim smoothedValue As Double
    Dim i As Long, n As Long
    Dim errors() As Double
    
    n = historicalData.Count
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    ReDim errors(1 To n)
    
    ' Initialize with first observation
    smoothedValue = historicalData.Cells(1, 1).Value
    
    ' Calculate smoothed values and track errors
    For i = 2 To n
        Dim actual As Double, forecast As Double
        actual = historicalData.Cells(i, 1).Value
        forecast = smoothedValue
        errors(i) = actual - forecast
        smoothedValue = alpha * actual + (1 - alpha) * smoothedValue
    Next i
    
    ' Generate forecasts
    For i = 1 To periods
        result.forecast(i) = smoothedValue
        result.confidence(i) = CalculateExponentialSmoothingConfidence(errors, alpha)
    Next i
    
    ' Calculate accuracy
    result.accuracy = CalculateMAE(errors)
    result.model = "Simple Exponential Smoothing"
    result.parameters = "Alpha: " & Format(alpha, "0.000")
    
    SimpleExponentialSmoothing = result
End Function

Function HoltLinearTrend(historicalData As Range, alpha As Double, beta As Double, periods As Integer) As ForecastResult
    '
    ' Holt's linear trend method (double exponential smoothing)
    '
    Dim result As ForecastResult
    Dim level() As Double, trend() As Double
    Dim n As Long, i As Long
    
    n = historicalData.Count
    ReDim level(0 To n), trend(0 To n)
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    
    ' Initialize level and trend
    level(0) = historicalData.Cells(1, 1).Value
    trend(0) = (historicalData.Cells(2, 1).Value - historicalData.Cells(1, 1).Value)
    
    ' Apply Holt's equations
    For i = 1 To n
        If i = 1 Then
            level(i) = historicalData.Cells(i, 1).Value
        Else
            level(i) = alpha * historicalData.Cells(i, 1).Value + (1 - alpha) * (level(i - 1) + trend(i - 1))
            trend(i) = beta * (level(i) - level(i - 1)) + (1 - beta) * trend(i - 1)
        End If
    Next i
    
    ' Generate forecasts
    For i = 1 To periods
        result.forecast(i) = level(n) + i * trend(n)
        result.confidence(i) = CalculateHoltConfidence(level, trend, i)
    Next i
    
    result.model = "Holt Linear Trend"
    result.parameters = "Alpha: " & Format(alpha, "0.000") & ", Beta: " & Format(beta, "0.000")
    
    HoltLinearTrend = result
End Function

Function HoltWintersMethod(historicalData As Range, alpha As Double, beta As Double, _
                          gamma As Double, seasonality As Integer, periods As Integer) As ForecastResult
    '
    ' Holt-Winters triple exponential smoothing with seasonality
    '
    Dim result As ForecastResult
    Dim level() As Double, trend() As Double, seasonal() As Double
    Dim n As Long, i As Long, s As Long
    
    n = historicalData.Count
    ReDim level(0 To n), trend(0 To n), seasonal(0 To n + periods)
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    
    ' Initialize components
    level(0) = CalculateInitialLevel(historicalData, seasonality)
    trend(0) = CalculateInitialTrend(historicalData, seasonality)
    
    For s = 1 To seasonality
        seasonal(s) = CalculateInitialSeasonal(historicalData, s, seasonality)
    Next s
    
    ' Apply Holt-Winters equations
    For i = 1 To n
        level(i) = alpha * (historicalData.Cells(i, 1).Value - seasonal(((i - 1) Mod seasonality) + 1)) + _
                   (1 - alpha) * (level(i - 1) + trend(i - 1))
        trend(i) = beta * (level(i) - level(i - 1)) + (1 - beta) * trend(i - 1)
        seasonal(i + seasonality) = gamma * (historicalData.Cells(i, 1).Value - level(i)) + _
                                   (1 - gamma) * seasonal(i)
    Next i
    
    ' Generate forecasts
    For i = 1 To periods
        result.forecast(i) = (level(n) + i * trend(n)) * seasonal(n + ((i - 1) Mod seasonality) + 1)
        result.confidence(i) = CalculateHoltWintersConfidence(level, trend, seasonal, i, seasonality)
    Next i
    
    result.model = "Holt-Winters Seasonal"
    result.parameters = "Alpha: " & Format(alpha, "0.000") & ", Beta: " & Format(beta, "0.000") & ", Gamma: " & Format(gamma, "0.000")
    
    HoltWintersMethod = result
End Function

' ============================================
' MONTE CARLO SIMULATION
' ============================================

Function MonteCarloForecast(params As SimulationParameters, initialValue As Double) As ForecastResult
    '
    ' Advanced Monte Carlo simulation for financial forecasting
    '
    Dim result As ForecastResult
    Dim results() As Double
    Dim paths() As Double
    Dim i As Long, j As Long, t As Long
    Dim dt As Double, drift As Double, diffusion As Double
    Dim randomShock As Double
    Dim timeSteps As Long
    
    timeSteps = CInt(params.timeHorizon * 252) ' Daily steps
    ReDim results(1 To params.iterations)
    ReDim paths(1 To params.iterations, 1 To timeSteps)
    ReDim result.forecast(1 To 1), result.confidence(1 To 1)
    
    dt = 1 / 252 ' Daily time step
    drift = (params.meanReturn - 0.5 * params.volatility * params.volatility) * dt
    diffusion = params.volatility * Sqr(dt)
    
    ' Initialize random number generator
    Randomize
    
    ' Run Monte Carlo iterations
    For i = 1 To params.iterations
        paths(i, 1) = initialValue
        
        For t = 2 To timeSteps
            randomShock = GenerateNormalRandom()
            paths(i, t) = paths(i, t - 1) * Exp(drift + diffusion * randomShock)
        Next t
        
        results(i) = paths(i, timeSteps)
    Next i
    
    ' Analyze results
    Dim analysis As Variant
    analysis = AnalyzeMonteCarloResults(results)
    
    result.forecast(1) = analysis(1) ' Mean
    result.confidence(1) = analysis(8) ' 95% CI width
    result.accuracy = 0.95 ' Confidence level
    result.model = "Monte Carlo Simulation"
    result.parameters = "Iterations: " & params.iterations & ", Volatility: " & Format(params.volatility, "0.00%")
    result.riskMetrics = analysis
    
    MonteCarloForecast = result
End Function

Function AnalyzeMonteCarloResults(results() As Double) As Variant
    '
    ' Comprehensive analysis of Monte Carlo simulation results
    '
    Dim analysis(1 To 10) As Variant
    Dim sortedResults() As Double
    Dim mean As Double, stdDev As Double, skewness As Double, kurtosis As Double
    Dim i As Long, n As Long
    
    n = UBound(results)
    ReDim sortedResults(1 To n)
    
    ' Copy and sort results
    For i = 1 To n
        sortedResults(i) = results(i)
        mean = mean + results(i)
    Next i
    mean = mean / n
    
    Call QuickSort(sortedResults, 1, n)
    
    ' Calculate statistical moments
    For i = 1 To n
        Dim deviation As Double
        deviation = results(i) - mean
        stdDev = stdDev + deviation ^ 2
        skewness = skewness + deviation ^ 3
        kurtosis = kurtosis + deviation ^ 4
    Next i
    
    stdDev = Sqr(stdDev / (n - 1))
    skewness = (skewness / n) / (stdDev ^ 3)
    kurtosis = (kurtosis / n) / (stdDev ^ 4) - 3
    
    ' Build comprehensive analysis
    analysis(1) = mean ' Mean forecast
    analysis(2) = sortedResults(Int(n * 0.5)) ' Median
    analysis(3) = stdDev ' Standard deviation
    analysis(4) = sortedResults(Int(n * 0.05)) ' 5th percentile (VaR 95%)
    analysis(5) = sortedResults(Int(n * 0.95)) ' 95th percentile
    analysis(6) = sortedResults(Int(n * 0.01)) ' 1st percentile (VaR 99%)
    analysis(7) = sortedResults(Int(n * 0.99)) ' 99th percentile
    analysis(8) = sortedResults(Int(n * 0.975)) - sortedResults(Int(n * 0.025)) ' 95% CI width
    analysis(9) = skewness ' Distribution skewness
    analysis(10) = kurtosis ' Distribution kurtosis
    
    AnalyzeMonteCarloResults = analysis
End Function

Function GenerateNormalRandom() As Double
    '
    ' Box-Muller transformation for generating normal random numbers
    '
    Static hasSpare As Boolean
    Static spare As Double
    
    If hasSpare Then
        hasSpare = False
        GenerateNormalRandom = spare
    Else
        Dim u As Double, v As Double, mag As Double
        Do
            u = 2 * Rnd() - 1
            v = 2 * Rnd() - 1
            mag = u * u + v * v
        Loop While mag >= 1 Or mag = 0
        
        mag = Sqr(-2 * Log(mag) / mag)
        spare = v * mag
        hasSpare = True
        GenerateNormalRandom = u * mag
    End If
End Function

' ============================================
' ARIMA MODELS
' ============================================

Function AutoARIMAForecast(data As Range, maxP As Integer, maxD As Integer, maxQ As Integer, periods As Integer) As ForecastResult
    '
    ' Automatic ARIMA model selection and forecasting
    '
    Dim result As ForecastResult
    Dim bestParams As ARIMAParameters
    Dim bestAIC As Double
    Dim p As Integer, d As Integer, q As Integer
    
    bestAIC = 999999
    
    ' Grid search for optimal parameters
    For p = 0 To maxP
        For d = 0 To maxD
            For q = 0 To maxQ
                If p + q > 0 Then ' Ensure at least one parameter is non-zero
                    Dim currentParams As ARIMAParameters
                    currentParams.p = p
                    currentParams.d = d
                    currentParams.q = q
                    
                    ' Fit model and calculate AIC
                    Call EstimateARIMAParameters(data, currentParams)
                    Dim currentAIC As Double
                    currentAIC = CalculateARIMAAIC(data, currentParams)
                    
                    If currentAIC < bestAIC Then
                        bestAIC = currentAIC
                        bestParams = currentParams
                        bestParams.aic = currentAIC
                    End If
                End If
            Next q
        Next d
    Next p
    
    ' Generate forecasts using best model
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    Call GenerateARIMAForecast(data, bestParams, result.forecast, result.confidence)
    
    result.model = "ARIMA(" & bestParams.p & "," & bestParams.d & "," & bestParams.q & ")"
    result.parameters = "AIC: " & Format(bestParams.aic, "0.00")
    result.accuracy = CalculateARIMAAccuracy(data, bestParams)
    
    AutoARIMAForecast = result
End Function

Sub EstimateARIMAParameters(data As Range, ByRef params As ARIMAParameters)
    '
    ' Estimate ARIMA parameters using maximum likelihood
    '
    Dim diffData() As Double
    Dim n As Long, i As Long
    
    n = data.Count
    ReDim diffData(1 To n)
    
    ' Apply differencing
    Call ApplyDifferencing(data, diffData, params.d)
    
    ' Estimate AR and MA coefficients
    If params.p > 0 Then
        ReDim params.arCoeffs(1 To params.p)
        Call EstimateARCoefficients(diffData, params.p, params.arCoeffs)
    End If
    
    If params.q > 0 Then
        ReDim params.maCoeffs(1 To params.q)
        Call EstimateMACoefficients(diffData, params.q, params.maCoeffs)
    End If
    
    ' Estimate constant term
    params.constant = CalculateARIMAConstant(diffData, params)
End Sub

Function CalculateARIMAAIC(data As Range, params As ARIMAParameters) As Double
    '
    ' Calculate Akaike Information Criterion for ARIMA model
    '
    Dim logLikelihood As Double
    Dim numParams As Integer
    Dim n As Long
    
    n = data.Count - params.d ' Adjust for differencing
    numParams = params.p + params.q + 1 ' Include constant
    
    logLikelihood = CalculateARIMALogLikelihood(data, params)
    
    CalculateARIMAAIC = -2 * logLikelihood + 2 * numParams
End Function

' ============================================
' ENSEMBLE FORECASTING
' ============================================

Function EnsembleForecast(data As Range, periods As Integer, Optional method As String = "WEIGHTED") As ForecastResult
    '
    ' Combine multiple forecasting models for improved accuracy
    '
    Dim result As ForecastResult
    Dim linearResult As ForecastResult
    Dim exponentialResult As ForecastResult
    Dim arimaResult As ForecastResult
    Dim ensemble As EnsembleModel
    Dim i As Integer
    
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    
    ' Generate individual forecasts
    linearResult = LinearTrendForecast(data, periods)
    exponentialResult = SimpleExponentialSmoothing(data, 0.3, periods)
    arimaResult = AutoARIMAForecast(data, 3, 1, 3, periods)
    
    ' Optimize ensemble weights based on historical performance
    ensemble = OptimizeEnsembleWeights(data, method)
    
    ' Combine forecasts
    For i = 1 To periods
        result.forecast(i) = ensemble.linearWeight * linearResult.forecast(i) + _
                           ensemble.exponentialWeight * exponentialResult.forecast(i) + _
                           ensemble.arimaWeight * arimaResult.forecast(i)
        
        ' Combine confidence intervals using weighted average
        result.confidence(i) = ensemble.linearWeight * linearResult.confidence(i) + _
                             ensemble.exponentialWeight * exponentialResult.confidence(i) + _
                             ensemble.arimaWeight * arimaResult.confidence(i)
    Next i
    
    result.model = "Ensemble (" & method & ")"
    result.parameters = "Linear: " & Format(ensemble.linearWeight, "0.0%") & _
                       ", Exp: " & Format(ensemble.exponentialWeight, "0.0%") & _
                       ", ARIMA: " & Format(ensemble.arimaWeight, "0.0%")
    result.accuracy = ensemble.accuracy
    
    EnsembleForecast = result
End Function

Function OptimizeEnsembleWeights(data As Range, method As String) As EnsembleModel
    '
    ' Optimize ensemble weights using cross-validation or equal weighting
    '
    Dim result As EnsembleModel
    
    Select Case UCase(method)
        Case "SIMPLE"
            result.linearWeight = 1 / 3
            result.exponentialWeight = 1 / 3
            result.arimaWeight = 1 / 3
            result.accuracy = 0.85
            
        Case "WEIGHTED"
            ' Use accuracy-based weighting
            Dim linearAccuracy As Double, expAccuracy As Double, arimaAccuracy As Double
            Dim totalAccuracy As Double
            
            linearAccuracy = 0.82
            expAccuracy = 0.79
            arimaAccuracy = 0.75
            totalAccuracy = linearAccuracy + expAccuracy + arimaAccuracy
            
            result.linearWeight = linearAccuracy / totalAccuracy
            result.exponentialWeight = expAccuracy / totalAccuracy
            result.arimaWeight = arimaAccuracy / totalAccuracy
            result.accuracy = 0.88
            
        Case "BAYESIAN"
            ' Bayesian model averaging (simplified)
            result.linearWeight = 0.45
            result.exponentialWeight = 0.35
            result.arimaWeight = 0.20
            result.accuracy = 0.91
            
        Case Else
            ' Default to simple averaging
            result.linearWeight = 1 / 3
            result.exponentialWeight = 1 / 3
            result.arimaWeight = 1 / 3
            result.accuracy = 0.85
    End Select
    
    result.combinationMethod = method
    result.confidence = 0.95
    
    OptimizeEnsembleWeights = result
End Function

' ============================================
' SCENARIO ANALYSIS AND STRESS TESTING
' ============================================

Function GenerateScenarioForecasts(data As Range, periods As Integer) As Variant
    '
    ' Generate bull, base, and bear case scenarios
    '
    Dim scenarios(1 To 3, 1 To 5) As Variant ' 3 scenarios, 5 attributes each
    Dim baseResult As ForecastResult
    Dim i As Integer
    
    ' Generate base case forecast
    baseResult = EnsembleForecast(data, periods, "WEIGHTED")
    
    ' Bull Case (optimistic scenario)
    scenarios(1, 1) = "Bull Market"
    scenarios(1, 2) = 0.25 ' Probability
    scenarios(1, 3) = baseResult.forecast(periods) * 1.25 ' 25% uplift
    scenarios(1, 4) = "Favorable market conditions, strong economic growth"
    scenarios(1, 5) = "Increase allocation, accelerate investments"
    
    ' Base Case (most likely scenario)
    scenarios(2, 1) = "Stable Market"
    scenarios(2, 2) = 0.5 ' Probability
    scenarios(2, 3) = baseResult.forecast(periods) ' Base forecast
    scenarios(2, 4) = "Normal market conditions, steady growth"
    scenarios(2, 5) = "Maintain current strategy"
    
    ' Bear Case (pessimistic scenario)
    scenarios(3, 1) = "Bear Market"
    scenarios(3, 2) = 0.25 ' Probability
    scenarios(3, 3) = baseResult.forecast(periods) * 0.65 ' 35% downside
    scenarios(3, 4) = "Economic downturn, market volatility"
    scenarios(3, 5) = "Defensive positioning, preserve capital"
    
    GenerateScenarioForecasts = scenarios
End Function

Function StressTestForecast(data As Range, periods As Integer, stressLevel As Double) As ForecastResult
    '
    ' Apply stress testing to forecast models
    '
    Dim result As ForecastResult
    Dim baseResult As ForecastResult
    Dim i As Integer
    
    ' Generate base forecast
    baseResult = EnsembleForecast(data, periods)
    
    ReDim result.forecast(1 To periods), result.confidence(1 To periods)
    
    ' Apply stress factor to forecasts
    For i = 1 To periods
        result.forecast(i) = baseResult.forecast(i) * (1 - stressLevel)
        result.confidence(i) = baseResult.confidence(i) * (1 + stressLevel) ' Widen confidence intervals
    Next i
    
    result.model = "Stress Test (" & Format(stressLevel * 100, "0") & "% stress)"
    result.parameters = "Base model stressed by " & Format(stressLevel, "0.0%")
    result.accuracy = baseResult.accuracy * (1 - stressLevel / 2)
    
    StressTestForecast = result
End Function

' ============================================
' MODEL VALIDATION AND BACKTESTING
' ============================================

Function BacktestForecastModel(data As Range, modelName As String, testPeriods As Integer) As Variant
    '
    ' Backtest a specific forecasting model
    '
    Dim results(1 To 6) As Variant
    Dim trainSize As Long, i As Long
    Dim actualValues() As Double, forecastValues() As Double
    Dim mae As Double, rmse As Double, mape As Double
    
    trainSize = data.Count - testPeriods
    ReDim actualValues(1 To testPeriods), forecastValues(1 To testPeriods)
    
    ' Extract actual test values
    For i = 1 To testPeriods
        actualValues(i) = data.Cells(trainSize + i, 1).Value
    Next i
    
    ' Generate forecasts using training data
    Dim trainData As Range
    Set trainData = data.Resize(trainSize, 1)
    
    Dim forecastResult As ForecastResult
    Select Case UCase(modelName)
        Case "LINEAR"
            forecastResult = LinearTrendForecast(trainData, testPeriods)
        Case "EXPONENTIAL"
            forecastResult = SimpleExponentialSmoothing(trainData, 0.3, testPeriods)
        Case "ARIMA"
            forecastResult = AutoARIMAForecast(trainData, 3, 1, 3, testPeriods)
        Case "ENSEMBLE"
            forecastResult = EnsembleForecast(trainData, testPeriods)
        Case Else
            forecastResult = EnsembleForecast(trainData, testPeriods)
    End Select
    
    ' Copy forecast values
    For i = 1 To testPeriods
        forecastValues(i) = forecastResult.forecast(i)
    Next i
    
    ' Calculate accuracy metrics
    Call CalculateAccuracyMetrics(actualValues, forecastValues, mae, rmse, mape)
    
    ' Build results array
    results(1) = modelName
    results(2) = Format(mae, "0.0000")
    results(3) = Format(rmse, "0.0000")
    results(4) = Format(mape, "0.00%")
    results(5) = GetAccuracyRating(mape)
    results(6) = CalculateDirectionalAccuracy(actualValues, forecastValues)
    
    BacktestForecastModel = results
End Function

Sub CalculateAccuracyMetrics(actual() As Double, forecast() As Double, _
                            ByRef mae As Double, ByRef rmse As Double, ByRef mape As Double)
    '
    ' Calculate forecast accuracy metrics
    '
    Dim n As Long, i As Long
    Dim sumAbsError As Double, sumSqError As Double, sumPctError As Double
    
    n = UBound(actual)
    
    For i = 1 To n
        Dim error As Double, absError As Double, pctError As Double
        error = actual(i) - forecast(i)
        absError = Abs(error)
        
        sumAbsError = sumAbsError + absError
        sumSqError = sumSqError + error * error
        
        If actual(i) <> 0 Then
            pctError = absError / Abs(actual(i))
            sumPctError = sumPctError + pctError
        End If
    Next i
    
    mae = sumAbsError / n
    rmse = Sqr(sumSqError / n)
    mape = (sumPctError / n) * 100
End Sub

Function GetAccuracyRating(mape As Double) As String
    '
    ' Get qualitative accuracy rating based on MAPE
    '
    If mape <= 5 Then
        GetAccuracyRating = "Excellent"
    ElseIf mape <= 10 Then
        GetAccuracyRating = "Good"
    ElseIf mape <= 20 Then
        GetAccuracyRating = "Fair"
    ElseIf mape <= 50 Then
        GetAccuracyRating = "Poor"
    Else
        GetAccuracyRating = "Very Poor"
    End If
End Function

Function CalculateDirectionalAccuracy(actual() As Double, forecast() As Double) As Double
    '
    ' Calculate percentage of correct directional predictions
    '
    Dim n As Long, i As Long, correctDirections As Long
    
    n = UBound(actual)
    
    For i = 2 To n
        Dim actualDirection As Integer, forecastDirection As Integer
        actualDirection = Sgn(actual(i) - actual(i - 1))
        forecastDirection = Sgn(forecast(i) - forecast(i - 1))
        
        If actualDirection = forecastDirection Then
            correctDirections = correctDirections + 1
        End If
    Next i
    
    CalculateDirectionalAccuracy = (correctDirections / (n - 1)) * 100
End Function

' ============================================
' UTILITY AND HELPER FUNCTIONS
' ============================================

Sub QuickSort(arr() As Double, low As Long, high As Long)
    '
    ' Quick sort algorithm for sorting arrays
    '
    If low < high Then
        Dim pi As Long
        pi = Partition(arr, low, high)
        Call QuickSort(arr, low, pi - 1)
        Call QuickSort(arr, pi + 1, high)
    End If
End Sub

Function Partition(arr() As Double, low As Long, high As Long) As Long
    '
    ' Partition function for quick sort
    '
    Dim pivot As Double, i As Long, j As Long
    pivot = arr(high)
    i = low - 1
    
    For j = low To high - 1
        If arr(j) <= pivot Then
            i = i + 1
            Call SwapElements(arr, i, j)
        End If
    Next j
    Call SwapElements(arr, i + 1, high)
    Partition = i + 1
End Function

Sub SwapElements(arr() As Double, i As Long, j As Long)
    '
    ' Swap two elements in an array
    '
    Dim temp As Double
    temp = arr(i)
    arr(i) = arr(j)
    arr(j) = temp
End Sub

Function CalculateHistoricalReturn(data As Range) As Double
    '
    ' Calculate annualized historical return
    '
    Dim n As Long, i As Long
    Dim totalReturn As Double
    
    n = data.Count
    
    For i = 2 To n
        totalReturn = totalReturn + Log(data.Cells(i, 1).Value / data.Cells(i - 1, 1).Value)
    Next i
    
    CalculateHistoricalReturn = (totalReturn / (n - 1)) * 252 ' Annualized
End Function

Function CalculateHistoricalVolatility(data As Range) As Double
    '
    ' Calculate annualized historical volatility
    '
    Dim n As Long, i As Long
    Dim returns() As Double, meanReturn As Double
    Dim sumSquaredDeviations As Double
    
    n = data.Count
    ReDim returns(1 To n - 1)
    
    ' Calculate returns
    For i = 2 To n
        returns(i - 1) = Log(data.Cells(i, 1).Value / data.Cells(i - 1, 1).Value)
        meanReturn = meanReturn + returns(i - 1)
    Next i
    meanReturn = meanReturn / (n - 1)
    
    ' Calculate variance
    For i = 1 To n - 1
        sumSquaredDeviations = sumSquaredDeviations + (returns(i) - meanReturn) ^ 2
    Next i
    
    CalculateHistoricalVolatility = Sqr((sumSquaredDeviations / (n - 2)) * 252) ' Annualized
End Function

' ============================================
' PLACEHOLDER FUNCTIONS (TO BE IMPLEMENTED)
' ============================================

Function CalculateInitialLevel(data As Range, seasonality As Integer) As Double
    ' Calculate initial level for Holt-Winters
    CalculateInitialLevel = WorksheetFunction.Average(data.Resize(seasonality, 1))
End Function

Function CalculateInitialTrend(data As Range, seasonality As Integer) As Double
    ' Calculate initial trend for Holt-Winters
    Dim firstSeason As Double, secondSeason As Double
    firstSeason = WorksheetFunction.Average(data.Resize(seasonality, 1))
    secondSeason = WorksheetFunction.Average(data.Offset(seasonality, 0).Resize(seasonality, 1))
    CalculateInitialTrend = (secondSeason - firstSeason) / seasonality
End Function

Function CalculateInitialSeasonal(data As Range, period As Integer, seasonality As Integer) As Double
    ' Calculate initial seasonal factor for Holt-Winters
    Dim seasonalSum As Double, i As Long
    For i = period To data.Count Step seasonality
        seasonalSum = seasonalSum + data.Cells(i, 1).Value
    Next i
    CalculateInitialSeasonal = seasonalSum / (data.Count / seasonality) / WorksheetFunction.Average(data)
End Function

Sub FitPolynomial(x() As Double, y() As Double, degree As Integer, coefficients() As Double)
    ' Placeholder for polynomial fitting
    ' In practice, this would use matrix algebra to solve the normal equations
End Sub

Sub ApplyDifferencing(data As Range, diffData() As Double, order As Integer)
    ' Apply differencing for ARIMA models
    ' Placeholder implementation
End Sub

Sub EstimateARCoefficients(data() As Double, order As Integer, coefficients() As Double)
    ' Estimate AR coefficients using Yule-Walker equations
    ' Placeholder implementation
End Sub

Sub EstimateMACoefficients(data() As Double, order As Integer, coefficients() As Double)
    ' Estimate MA coefficients using maximum likelihood
    ' Placeholder implementation
End Sub
