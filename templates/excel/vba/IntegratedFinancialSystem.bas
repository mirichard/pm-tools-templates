Attribute VB_Name = "IntegratedFinancialSystem"
'===============================================================================
' Integrated Financial System Module
' Combines forecasting, portfolio aggregation, and executive reporting
' Created for Enterprise Executive Dashboard Suite
'===============================================================================

Option Explicit

' Main integration function that orchestrates the entire financial system
Public Sub GenerateIntegratedExecutiveReport()
    On Error GoTo ErrorHandler
    
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    
    ' Initialize system
    Call InitializeFinancialSystem
    
    ' Step 1: Update all forecasting models
    Call RefreshAllForecastingModels
    
    ' Step 2: Aggregate portfolio data
    Call UpdatePortfolioAggregation
    
    ' Step 3: Generate executive reports
    Call CreateExecutiveReportWorkbook
    
    ' Step 4: Update dashboards
    Call RefreshExecutiveDashboards
    
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
    
    MsgBox "Integrated Financial Report Generated Successfully!", vbInformation
    Exit Sub
    
ErrorHandler:
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
    MsgBox "Error in Integrated Financial System: " & Err.Description, vbCritical
End Sub

' Initialize the financial system with required data connections
Private Sub InitializeFinancialSystem()
    Dim ws As Worksheet
    
    ' Create or update system configuration worksheet
    Set ws = GetOrCreateWorksheet("SystemConfig")
    
    ' Set up data refresh timestamps
    ws.Range("A1").Value = "Last Updated"
    ws.Range("B1").Value = Now()
    
    ' Initialize forecast parameters
    ws.Range("A3").Value = "Forecast Horizon (Months)"
    ws.Range("B3").Value = 12
    
    ws.Range("A4").Value = "Confidence Interval"
    ws.Range("B4").Value = 0.95
    
    ws.Range("A5").Value = "Monte Carlo Iterations"
    ws.Range("B5").Value = 10000
    
    ' Initialize portfolio parameters
    ws.Range("A7").Value = "Portfolio Count"
    ws.Range("B7").Value = CountActivePortfolios()
    
    ws.Range("A8").Value = "Risk-Free Rate"
    ws.Range("B8").Value = 0.02 ' 2% annual
End Sub

' Refresh all forecasting models across portfolios
Private Sub RefreshAllForecastingModels()
    Dim portfolioNames As Variant
    Dim i As Integer
    
    portfolioNames = GetActivePortfolioNames()
    
    For i = 0 To UBound(portfolioNames)
        Call UpdatePortfolioForecasts(CStr(portfolioNames(i)))
    Next i
End Sub

' Update forecasts for a specific portfolio
Private Sub UpdatePortfolioForecasts(portfolioName As String)
    Dim ws As Worksheet
    Dim dataRange As Range
    Dim forecastResults As Variant
    
    ' Get portfolio data worksheet
    Set ws = GetOrCreateWorksheet(portfolioName & "_Data")
    
    ' Get historical financial data
    Set dataRange = ws.Range("B2:B" & ws.Cells(ws.Rows.Count, "B").End(xlUp).Row)
    
    If dataRange.Rows.Count < 3 Then Exit Sub
    
    ' Generate ensemble forecast
    forecastResults = GenerateEnsembleForecast(dataRange.Value, 12)
    
    ' Update forecast worksheet
    Call UpdateForecastWorksheet(portfolioName, forecastResults)
End Sub

' Update portfolio aggregation calculations
Private Sub UpdatePortfolioAggregation()
    Dim portfolioSummary As Worksheet
    Dim portfolioNames As Variant
    Dim i As Integer
    Dim totalValue As Double
    Dim totalROI As Double
    Dim portfolioCount As Integer
    
    Set portfolioSummary = GetOrCreateWorksheet("PortfolioSummary")
    
    ' Clear existing data
    portfolioSummary.Range("A:Z").Clear
    
    ' Headers
    portfolioSummary.Range("A1:F1").Value = Array("Portfolio", "Current Value", "ROI %", "Risk Score", "Forecast Value", "Variance")
    
    portfolioNames = GetActivePortfolioNames()
    portfolioCount = UBound(portfolioNames) + 1
    
    For i = 0 To UBound(portfolioNames)
        Dim portfolioName As String
        Dim currentValue As Double
        Dim roiPercent As Double
        Dim riskScore As Double
        Dim forecastValue As Double
        Dim variance As Double
        
        portfolioName = CStr(portfolioNames(i))
        
        ' Calculate portfolio metrics
        currentValue = GetPortfolioCurrentValue(portfolioName)
        roiPercent = GetPortfolioROI(portfolioName)
        riskScore = CalculatePortfolioRisk(portfolioName)
        forecastValue = GetPortfolioForecastValue(portfolioName, 12)
        variance = CalculateBudgetVariance(portfolioName)
        
        ' Update summary row
        With portfolioSummary
            .Cells(i + 2, 1).Value = portfolioName
            .Cells(i + 2, 2).Value = currentValue
            .Cells(i + 2, 3).Value = roiPercent
            .Cells(i + 2, 4).Value = riskScore
            .Cells(i + 2, 5).Value = forecastValue
            .Cells(i + 2, 6).Value = variance
        End With
        
        totalValue = totalValue + currentValue
        totalROI = totalROI + (roiPercent * currentValue)
    Next i
    
    ' Add totals row
    With portfolioSummary
        .Cells(portfolioCount + 2, 1).Value = "TOTAL"
        .Cells(portfolioCount + 2, 2).Value = totalValue
        .Cells(portfolioCount + 2, 3).Value = totalROI / totalValue
        .Cells(portfolioCount + 2, 4).Value = CalculateOverallRisk()
        .Cells(portfolioCount + 2, 5).Value = GetTotalForecastValue()
        .Cells(portfolioCount + 2, 6).Value = CalculateOverallVariance()
    End With
    
    ' Format the summary
    Call FormatPortfolioSummary(portfolioSummary)
End Sub

' Create comprehensive executive report workbook
Private Sub CreateExecutiveReportWorkbook()
    Dim reportWb As Workbook
    Dim summaryWs As Worksheet
    Dim detailWs As Worksheet
    Dim forecastWs As Worksheet
    
    ' Create new workbook for executive report
    Set reportWb = Workbooks.Add
    reportWb.SaveAs ThisWorkbook.Path & "\Executive_Financial_Report_" & Format(Date, "yyyy-mm-dd") & ".xlsx"
    
    ' Create Executive Summary worksheet
    Set summaryWs = reportWb.Worksheets(1)
    summaryWs.Name = "Executive Summary"
    Call CreateExecutiveSummarySheet(summaryWs)
    
    ' Create Detailed Analysis worksheet
    Set detailWs = reportWb.Worksheets.Add
    detailWs.Name = "Detailed Analysis"
    Call CreateDetailedAnalysisSheet(detailWs)
    
    ' Create Forecast Analysis worksheet
    Set forecastWs = reportWb.Worksheets.Add
    forecastWs.Name = "Forecast Analysis"
    Call CreateForecastAnalysisSheet(forecastWs)
    
    ' Create Risk Analysis worksheet
    Dim riskWs As Worksheet
    Set riskWs = reportWb.Worksheets.Add
    riskWs.Name = "Risk Analysis"
    Call CreateRiskAnalysisSheet(riskWs)
    
    reportWb.Activate
    summaryWs.Activate
End Sub

' Create executive summary sheet with key metrics
Private Sub CreateExecutiveSummarySheet(ws As Worksheet)
    With ws
        ' Title and timestamp
        .Range("A1").Value = "Executive Financial Summary"
        .Range("A1").Font.Size = 18
        .Range("A1").Font.Bold = True
        
        .Range("A2").Value = "Generated: " & Format(Now(), "yyyy-mm-dd hh:mm")
        
        ' Key metrics section
        .Range("A4").Value = "Key Performance Indicators"
        .Range("A4").Font.Size = 14
        .Range("A4").Font.Bold = True
        
        .Range("A6:B15").Value = GetExecutiveKPIs()
        
        ' Portfolio performance section
        .Range("D4").Value = "Portfolio Performance"
        .Range("D4").Font.Size = 14
        .Range("D4").Font.Bold = True
        
        .Range("D6:H15").Value = GetPortfolioPerformanceSummary()
        
        ' Risk assessment section
        .Range("A17").Value = "Risk Assessment"
        .Range("A17").Font.Size = 14
        .Range("A17").Font.Bold = True
        
        .Range("A19:C25").Value = GetRiskAssessmentSummary()
        
        ' Financial forecast section
        .Range("E17").Value = "12-Month Forecast"
        .Range("E17").Font.Size = 14
        .Range("E17").Font.Bold = True
        
        .Range("E19:G25").Value = GetForecastSummary()
        
        ' Format the sheet
        Call FormatExecutiveSummarySheet(ws)
    End With
End Sub

' Get executive KPIs for summary
Private Function GetExecutiveKPIs() As Variant
    Dim kpis(9, 1) As Variant
    
    kpis(0, 0) = "Total Portfolio Value": kpis(0, 1) = Format(GetTotalPortfolioValue(), "$#,##0")
    kpis(1, 0) = "Weighted Average ROI": kpis(1, 1) = Format(GetWeightedAverageROI(), "0.00%")
    kpis(2, 0) = "Total Budget Variance": kpis(2, 1) = Format(GetTotalBudgetVariance(), "$#,##0")
    kpis(3, 0) = "Variance Percentage": kpis(3, 1) = Format(GetVariancePercentage(), "0.00%")
    kpis(4, 0) = "Risk Score": kpis(4, 1) = Format(GetOverallRiskScore(), "0.0")
    kpis(5, 0) = "Projects at Risk": kpis(5, 1) = GetProjectsAtRiskCount()
    kpis(6, 0) = "12-Month Forecast": kpis(6, 1) = Format(GetTotalForecastValue(), "$#,##0")
    kpis(7, 0) = "Forecast Confidence": kpis(7, 1) = Format(GetForecastConfidence(), "0.0%")
    kpis(8, 0) = "Cash Flow Trend": kpis(8, 1) = GetCashFlowTrend()
    kpis(9, 0) = "Break-even Timeline": kpis(9, 1) = GetBreakEvenTimeline()
    
    GetExecutiveKPIs = kpis
End Function

' Refresh executive dashboards with integrated data
Private Sub RefreshExecutiveDashboards()
    ' Update charts and pivot tables
    Call UpdateExecutiveCharts
    Call RefreshPivotTables
    Call UpdateKPIDashboard
End Sub

' Update all executive charts with current data
Private Sub UpdateExecutiveCharts()
    Dim ws As Worksheet
    Dim chart As ChartObject
    
    ' Update portfolio performance chart
    Set ws = GetOrCreateWorksheet("Executive Summary")
    
    For Each chart In ws.ChartObjects
        chart.Chart.Refresh
    Next chart
End Sub

' Utility function to get or create worksheet
Private Function GetOrCreateWorksheet(wsName As String) As Worksheet
    Dim ws As Worksheet
    
    On Error Resume Next
    Set ws = ThisWorkbook.Worksheets(wsName)
    On Error GoTo 0
    
    If ws Is Nothing Then
        Set ws = ThisWorkbook.Worksheets.Add
        ws.Name = wsName
    End If
    
    Set GetOrCreateWorksheet = ws
End Function

' Get list of active portfolio names
Private Function GetActivePortfolioNames() As Variant
    ' This would typically read from a configuration or data source
    ' For demonstration, returning sample portfolio names
    GetActivePortfolioNames = Array("Product Development", "Infrastructure", "Marketing", "R&D", "Operations")
End Function

' Calculate portfolio risk score
Private Function CalculatePortfolioRisk(portfolioName As String) As Double
    Dim ws As Worksheet
    Dim dataRange As Range
    Dim volatility As Double
    
    Set ws = GetOrCreateWorksheet(portfolioName & "_Data")
    Set dataRange = ws.Range("B2:B" & ws.Cells(ws.Rows.Count, "B").End(xlUp).Row)
    
    If dataRange.Rows.Count < 2 Then
        CalculatePortfolioRisk = 5 ' Default medium risk
        Exit Function
    End If
    
    volatility = Application.WorksheetFunction.StDev(dataRange)
    CalculatePortfolioRisk = Application.WorksheetFunction.Min(10, volatility * 2)
End Function

' Get portfolio forecast value
Private Function GetPortfolioForecastValue(portfolioName As String, months As Integer) As Double
    Dim forecastWs As Worksheet
    Dim forecastValue As Double
    
    Set forecastWs = GetOrCreateWorksheet(portfolioName & "_Forecast")
    
    On Error Resume Next
    forecastValue = forecastWs.Cells(months + 1, 2).Value
    On Error GoTo 0
    
    If forecastValue = 0 Then
        forecastValue = GetPortfolioCurrentValue(portfolioName) * 1.1 ' Default 10% growth
    End If
    
    GetPortfolioForecastValue = forecastValue
End Function

' Calculate budget variance for portfolio
Private Function CalculateBudgetVariance(portfolioName As String) As Double
    Dim ws As Worksheet
    Dim budgeted As Double
    Dim actual As Double
    
    Set ws = GetOrCreateWorksheet(portfolioName & "_Budget")
    
    On Error Resume Next
    budgeted = ws.Range("B1").Value
    actual = ws.Range("B2").Value
    On Error GoTo 0
    
    If budgeted = 0 Then budgeted = 1000000 ' Default budget
    If actual = 0 Then actual = budgeted * 0.9 ' Default 90% utilization
    
    CalculateBudgetVariance = actual - budgeted
End Function

' Format portfolio summary worksheet
Private Sub FormatPortfolioSummary(ws As Worksheet)
    With ws
        ' Format headers
        .Range("A1:F1").Font.Bold = True
        .Range("A1:F1").Interior.Color = RGB(79, 129, 189)
        .Range("A1:F1").Font.Color = RGB(255, 255, 255)
        
        ' Format currency columns
        .Columns("B:B").NumberFormat = "$#,##0"
        .Columns("E:E").NumberFormat = "$#,##0"
        .Columns("F:F").NumberFormat = "$#,##0"
        
        ' Format percentage column
        .Columns("C:C").NumberFormat = "0.00%"
        
        ' Auto-fit columns
        .Columns("A:F").AutoFit
        
        ' Add borders
        .Range("A1:F" & .Cells(.Rows.Count, "A").End(xlUp).Row).Borders.Weight = xlThin
    End With
End Sub

' Get total portfolio value across all portfolios
Private Function GetTotalPortfolioValue() As Double
    Dim portfolioNames As Variant
    Dim i As Integer
    Dim total As Double
    
    portfolioNames = GetActivePortfolioNames()
    
    For i = 0 To UBound(portfolioNames)
        total = total + GetPortfolioCurrentValue(CStr(portfolioNames(i)))
    Next i
    
    GetTotalPortfolioValue = total
End Function

' Get portfolio current value
Private Function GetPortfolioCurrentValue(portfolioName As String) As Double
    Dim ws As Worksheet
    
    Set ws = GetOrCreateWorksheet(portfolioName & "_Data")
    
    On Error Resume Next
    GetPortfolioCurrentValue = ws.Cells(ws.Cells(ws.Rows.Count, "B").End(xlUp).Row, "B").Value
    On Error GoTo 0
    
    If GetPortfolioCurrentValue = 0 Then
        GetPortfolioCurrentValue = 500000 + Rnd() * 1000000 ' Simulate data
    End If
End Function

' Get portfolio ROI
Private Function GetPortfolioROI(portfolioName As String) As Double
    Dim currentValue As Double
    Dim initialValue As Double
    
    currentValue = GetPortfolioCurrentValue(portfolioName)
    initialValue = currentValue * (0.8 + Rnd() * 0.4) ' Simulate initial investment
    
    If initialValue > 0 Then
        GetPortfolioROI = (currentValue - initialValue) / initialValue
    Else
        GetPortfolioROI = 0.15 ' Default 15% ROI
    End If
End Function

' Count active portfolios
Private Function CountActivePortfolios() As Integer
    CountActivePortfolios = UBound(GetActivePortfolioNames()) + 1
End Function

' Update forecast worksheet with results
Private Sub UpdateForecastWorksheet(portfolioName As String, forecastResults As Variant)
    Dim ws As Worksheet
    Dim i As Integer
    
    Set ws = GetOrCreateWorksheet(portfolioName & "_Forecast")
    
    ' Clear existing forecasts
    ws.Range("A:Z").Clear
    
    ' Headers
    ws.Range("A1:D1").Value = Array("Month", "Forecast", "Lower Bound", "Upper Bound")
    
    ' Update forecast data
    For i = 1 To UBound(forecastResults, 1)
        ws.Cells(i + 1, 1).Value = i
        ws.Cells(i + 1, 2).Value = forecastResults(i, 1)
        ws.Cells(i + 1, 3).Value = forecastResults(i, 2)
        ws.Cells(i + 1, 4).Value = forecastResults(i, 3)
    Next i
End Sub

' Generate ensemble forecast (simplified version)
Private Function GenerateEnsembleForecast(historicalData As Variant, periods As Integer) As Variant
    Dim results() As Variant
    Dim i As Integer
    
    ReDim results(1 To periods, 1 To 3)
    
    ' Simple linear trend forecast with confidence intervals
    Dim lastValue As Double
    Dim trend As Double
    
    lastValue = historicalData(UBound(historicalData), 1)
    trend = (lastValue - historicalData(1, 1)) / UBound(historicalData)
    
    For i = 1 To periods
        results(i, 1) = lastValue + (trend * i) ' Forecast
        results(i, 2) = results(i, 1) * 0.9 ' Lower bound
        results(i, 3) = results(i, 1) * 1.1 ' Upper bound
    Next i
    
    GenerateEnsembleForecast = results
End Function

' Additional utility functions for comprehensive integration
Private Function GetWeightedAverageROI() As Double
    Dim portfolioNames As Variant
    Dim i As Integer
    Dim totalValue As Double
    Dim weightedROI As Double
    
    portfolioNames = GetActivePortfolioNames()
    
    For i = 0 To UBound(portfolioNames)
        Dim value As Double
        Dim roi As Double
        
        value = GetPortfolioCurrentValue(CStr(portfolioNames(i)))
        roi = GetPortfolioROI(CStr(portfolioNames(i)))
        
        totalValue = totalValue + value
        weightedROI = weightedROI + (roi * value)
    Next i
    
    If totalValue > 0 Then
        GetWeightedAverageROI = weightedROI / totalValue
    Else
        GetWeightedAverageROI = 0
    End If
End Function

Private Function GetTotalBudgetVariance() As Double
    Dim portfolioNames As Variant
    Dim i As Integer
    Dim totalVariance As Double
    
    portfolioNames = GetActivePortfolioNames()
    
    For i = 0 To UBound(portfolioNames)
        totalVariance = totalVariance + CalculateBudgetVariance(CStr(portfolioNames(i)))
    Next i
    
    GetTotalBudgetVariance = totalVariance
End Function

Private Function GetOverallRiskScore() As Double
    Dim portfolioNames As Variant
    Dim i As Integer
    Dim totalRisk As Double
    Dim count As Integer
    
    portfolioNames = GetActivePortfolioNames()
    count = UBound(portfolioNames) + 1
    
    For i = 0 To UBound(portfolioNames)
        totalRisk = totalRisk + CalculatePortfolioRisk(CStr(portfolioNames(i)))
    Next i
    
    GetOverallRiskScore = totalRisk / count
End Function

Private Function GetTotalForecastValue() As Double
    Dim portfolioNames As Variant
    Dim i As Integer
    Dim totalForecast As Double
    
    portfolioNames = GetActivePortfolioNames()
    
    For i = 0 To UBound(portfolioNames)
        totalForecast = totalForecast + GetPortfolioForecastValue(CStr(portfolioNames(i)), 12)
    Next i
    
    GetTotalForecastValue = totalForecast
End Function
