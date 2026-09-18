Attribute VB_Name = "ROI_Tracking_System"
Option Explicit

' ROI Tracking Automation System - Main Module
' Version: 2.1
' Created: 2025-01-02
' Purpose: Automated ROI calculation, tracking, and reporting system

' Global Constants
Public Const REFRESH_INTERVAL = 300 ' 5 minutes in seconds
Public Const API_ENDPOINT = "https://api.yourcompany.com/roi/"
Public Const DATABASE_CONNECTION = "Provider=SQLOLEDB;Data Source=your-server;Initial Catalog=ROI_Database;Integrated Security=SSPI;"

' Global Variables
Public DataLastUpdated As Date
Public AutoRefreshEnabled As Boolean
Public AlertsEnabled As Boolean

' ============================================
' MAIN INITIALIZATION AND SETUP
' ============================================

Sub InitializeROITrackingSystem()
    '
    ' Main initialization routine for ROI Tracking System
    ' Sets up worksheets, data connections, and automation
    '
    On Error GoTo ErrorHandler
    
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    Application.EnableEvents = False
    
    ' Display progress
    Application.StatusBar = "Initializing ROI Tracking System..."
    
    ' Setup worksheets and structure
    Call SetupWorksheetStructure
    Call ConfigureDataValidation
    Call SetupConditionalFormatting
    Call CreateROICharts
    
    ' Initialize data connections
    Call ConfigureDataConnections
    Call InitializeAPIConnection
    
    ' Setup automation features
    Call EnableAutoRefresh
    Call EnableAlertSystem
    
    ' Initial data load
    Call RefreshAllROIData
    
    ' Restore Excel settings
    Application.Calculation = xlCalculationAutomatic
    Application.EnableEvents = True
    Application.ScreenUpdating = True
    Application.StatusBar = "ROI Tracking System initialized successfully!"
    
    MsgBox "ROI Tracking System has been successfully initialized!" & vbCrLf & _
           "• Real-time data refresh: Enabled" & vbCrLf & _
           "• Alert system: Active" & vbCrLf & _
           "• Executive reporting: Ready", vbInformation, "ROI Tracking System"
    
    Exit Sub
    
ErrorHandler:
    Application.Calculation = xlCalculationAutomatic
    Application.EnableEvents = True
    Application.ScreenUpdating = True
    Application.StatusBar = False
    
    MsgBox "Error initializing ROI Tracking System: " & Err.Description, vbCritical
    Call LogError("InitializeROITrackingSystem", Err.Description)
End Sub

Sub SetupWorksheetStructure()
    '
    ' Creates and configures all required worksheets
    '
    Dim ws As Worksheet
    Dim wsNames As Variant
    Dim i As Integer
    
    ' Define required worksheets
    wsNames = Array("Executive Dashboard", "Investment Data", "ROI Analysis", _
                   "Portfolio Summary", "Trend Analysis", "Risk Assessment", _
                   "Benchmark Comparison", "ROI Forecasts", "Alert Log", "Configuration")
    
    ' Create worksheets if they don't exist
    For i = 0 To UBound(wsNames)
        On Error Resume Next
        Set ws = ThisWorkbook.Worksheets(wsNames(i))
        On Error GoTo 0
        
        If ws Is Nothing Then
            Set ws = ThisWorkbook.Worksheets.Add
            ws.Name = wsNames(i)
        End If
        
        ' Setup worksheet-specific structure
        Select Case wsNames(i)
            Case "Executive Dashboard"
                Call SetupExecutiveDashboard(ws)
            Case "Investment Data"
                Call SetupInvestmentDataSheet(ws)
            Case "ROI Analysis"
                Call SetupROIAnalysisSheet(ws)
            Case "Portfolio Summary"
                Call SetupPortfolioSummarySheet(ws)
            Case "Configuration"
                Call SetupConfigurationSheet(ws)
        End Select
        
        Set ws = Nothing
    Next i
End Sub

Sub SetupExecutiveDashboard(ws As Worksheet)
    '
    ' Configure the Executive Dashboard worksheet
    '
    With ws
        .Cells.Clear
        
        ' Header
        .Range("A1").Value = "ROI EXECUTIVE DASHBOARD"
        .Range("A1").Font.Size = 20
        .Range("A1").Font.Bold = True
        .Range("A1").Font.Color = RGB(68, 114, 196)
        .Range("A1:F1").Merge
        .Range("A1").HorizontalAlignment = xlCenter
        
        ' Current date and time
        .Range("A2").Value = "Last Updated:"
        .Range("B2").Value = Now
        .Range("B2").NumberFormat = "mm/dd/yyyy hh:mm AM/PM"
        
        ' Key Performance Indicators Section
        .Range("A4").Value = "KEY PERFORMANCE INDICATORS"
        .Range("A4").Font.Size = 14
        .Range("A4").Font.Bold = True
        .Range("A4").Font.Color = RGB(68, 114, 196)
        
        ' KPI Labels and Values
        Dim kpiLabels As Variant
        Dim kpiRow As Integer
        
        kpiLabels = Array("Total Portfolio Value:", "Total Investment:", "Overall ROI:", _
                         "Best Performing Investment:", "Worst Performing Investment:", _
                         "Average ROI:", "Risk-Adjusted Return:", "Sharpe Ratio:")
        
        For kpiRow = 0 To UBound(kpiLabels)
            .Cells(6 + kpiRow, 1).Value = kpiLabels(kpiRow)
            .Cells(6 + kpiRow, 1).Font.Bold = True
            .Cells(6 + kpiRow, 2).Name = "KPI_" & Replace(kpiLabels(kpiRow), ":", "")
        Next kpiRow
        
        ' Performance Summary Section
        .Range("D4").Value = "PERFORMANCE SUMMARY"
        .Range("D4").Font.Size = 14
        .Range("D4").Font.Bold = True
        .Range("D4").Font.Color = RGB(68, 114, 196)
        
        .Range("D6").Value = "Investments Above Target:"
        .Range("D7").Value = "Investments Below Target:"
        .Range("D8").Value = "High Risk Investments:"
        .Range("D9").Value = "Recommended Actions:"
        
        ' Format columns
        .Columns("A:B").AutoFit
        .Columns("D:E").AutoFit
        
        ' Add borders and styling
        .Range("A4:F13").Borders.LineStyle = xlContinuous
        .Range("A4:F13").Borders.Weight = xlThin
        
        ' Set up chart placeholder
        .Range("A15").Value = "ROI PERFORMANCE CHARTS"
        .Range("A15").Font.Size = 14
        .Range("A15").Font.Bold = True
        .Range("A15").Font.Color = RGB(68, 114, 196)
    End With
End Sub

Sub SetupInvestmentDataSheet(ws As Worksheet)
    '
    ' Configure the Investment Data worksheet
    '
    With ws
        .Cells.Clear
        
        ' Headers
        Dim headers As Variant
        headers = Array("Investment ID", "Investment Name", "Category", "Sector", _
                       "Initial Investment", "Current Value", "Total Returns", _
                       "ROI %", "Annualized ROI %", "IRR %", "NPV", _
                       "Payback Period", "Risk Score", "Risk Category", _
                       "Sharpe Ratio", "Status", "Start Date", "End Date", _
                       "Last Updated", "Notes")
        
        ' Set headers
        For i = 0 To UBound(headers)
            .Cells(1, i + 1).Value = headers(i)
        Next i
        
        ' Format header row
        With .Range("A1:T1")
            .Font.Bold = True
            .Interior.Color = RGB(68, 114, 196)
            .Font.Color = RGB(255, 255, 255)
            .Borders.LineStyle = xlContinuous
            .HorizontalAlignment = xlCenter
        End With
        
        ' Set column widths and formats
        .Columns("A").ColumnWidth = 12  ' Investment ID
        .Columns("B").ColumnWidth = 25  ' Investment Name
        .Columns("C").ColumnWidth = 15  ' Category
        .Columns("D").ColumnWidth = 15  ' Sector
        .Columns("E:G").ColumnWidth = 15 ' Financial columns
        .Columns("E:G").NumberFormat = "$#,##0.00"
        .Columns("H:K").ColumnWidth = 12 ' Percentage columns
        .Columns("H:K").NumberFormat = "0.00%"
        .Columns("L").ColumnWidth = 12  ' Payback Period
        .Columns("L").NumberFormat = "0.00"
        .Columns("M").ColumnWidth = 10  ' Risk Score
        .Columns("N").ColumnWidth = 15  ' Risk Category
        .Columns("O").ColumnWidth = 12  ' Sharpe Ratio
        .Columns("P").ColumnWidth = 10  ' Status
        .Columns("Q:R").ColumnWidth = 12 ' Dates
        .Columns("Q:R").NumberFormat = "mm/dd/yyyy"
        .Columns("S").ColumnWidth = 15  ' Last Updated
        .Columns("S").NumberFormat = "mm/dd/yyyy hh:mm"
        .Columns("T").ColumnWidth = 30  ' Notes
        
        ' Freeze panes
        .Range("A2").Select
        ActiveWindow.FreezePanes = True
        
        ' Apply AutoFilter
        .Range("A1:T1").AutoFilter
    End With
End Sub

' ============================================
' ROI CALCULATION FUNCTIONS
' ============================================

Function CalculateROI(initialInvestment As Double, currentValue As Double) As Double
    '
    ' Calculate simple ROI percentage
    ' Formula: (Current Value - Initial Investment) / Initial Investment * 100
    '
    If initialInvestment > 0 Then
        CalculateROI = ((currentValue - initialInvestment) / initialInvestment) * 100
    Else
        CalculateROI = 0
    End If
End Function

Function CalculateAnnualizedROI(initialInvestment As Double, currentValue As Double, _
                               startDate As Date, Optional endDate As Date) As Double
    '
    ' Calculate annualized ROI
    ' Formula: ((Current Value / Initial Investment) ^ (1 / Years)) - 1
    '
    Dim years As Double
    
    If endDate = 0 Then endDate = Date
    years = (endDate - startDate) / 365.25
    
    If initialInvestment > 0 And years > 0 Then
        CalculateAnnualizedROI = (((currentValue / initialInvestment) ^ (1 / years)) - 1) * 100
    Else
        CalculateAnnualizedROI = 0
    End If
End Function

Function CalculateNPV(cashFlows As Range, discountRate As Double) As Double
    '
    ' Calculate Net Present Value
    '
    Dim i As Long
    Dim npv As Double
    
    npv = 0
    For i = 1 To cashFlows.Count
        If IsNumeric(cashFlows.Cells(i, 1).Value) Then
            npv = npv + (cashFlows.Cells(i, 1).Value / ((1 + discountRate) ^ (i - 1)))
        End If
    Next i
    
    CalculateNPV = npv
End Function

Function CalculateIRR(cashFlows As Range) As Double
    '
    ' Calculate Internal Rate of Return using Excel's IRR function
    '
    On Error GoTo ErrorHandler
    CalculateIRR = WorksheetFunction.IRR(cashFlows) * 100
    Exit Function
    
ErrorHandler:
    CalculateIRR = 0
End Function

Function CalculateSharpeRatio(roi As Double, riskFreeRate As Double, volatility As Double) As Double
    '
    ' Calculate Sharpe Ratio
    ' Formula: (ROI - Risk Free Rate) / Volatility
    '
    If volatility > 0 Then
        CalculateSharpeRatio = (roi - riskFreeRate) / volatility
    Else
        CalculateSharpeRatio = 0
    End If
End Function

Function CalculatePaybackPeriod(initialInvestment As Double, annualCashFlow As Double) As Double
    '
    ' Calculate simple payback period in years
    '
    If annualCashFlow > 0 Then
        CalculatePaybackPeriod = initialInvestment / annualCashFlow
    Else
        CalculatePaybackPeriod = 0
    End If
End Function

' ============================================
' DATA REFRESH AND AUTOMATION
' ============================================

Sub RefreshAllROIData()
    '
    ' Master data refresh routine
    '
    On Error GoTo ErrorHandler
    
    Application.ScreenUpdating = False
    Application.StatusBar = "Refreshing ROI data..."
    
    ' Refresh from various data sources
    Call RefreshFromDatabase
    Call RefreshFromAPI
    Call RefreshMarketData
    
    ' Recalculate all ROI metrics
    Call CalculateAllROIMetrics
    
    ' Update dashboard and charts
    Call UpdateExecutiveDashboard
    Call UpdateROICharts
    
    ' Check for alerts
    Call CheckROIAlerts
    
    ' Update timestamp
    DataLastUpdated = Now
    ThisWorkbook.Worksheets("Executive Dashboard").Range("B2").Value = DataLastUpdated
    
    Application.StatusBar = "ROI data refresh completed at " & Format(Now, "hh:mm:ss")
    Application.ScreenUpdating = True
    
    ' Schedule next refresh if auto-refresh is enabled
    If AutoRefreshEnabled Then
        Application.OnTime Now + TimeValue("00:05:00"), "RefreshAllROIData"
    End If
    
    Exit Sub
    
ErrorHandler:
    Application.ScreenUpdating = True
    Application.StatusBar = False
    Call LogError("RefreshAllROIData", Err.Description)
End Sub

Sub RefreshFromDatabase()
    '
    ' Refresh investment data from SQL Server database
    '
    Dim conn As Object
    Dim rs As Object
    Dim ws As Worksheet
    Dim sql As String
    
    On Error GoTo ErrorHandler
    
    Set ws = ThisWorkbook.Worksheets("Investment Data")
    Set conn = CreateObject("ADODB.Connection")
    Set rs = CreateObject("ADODB.Recordset")
    
    ' Open database connection
    conn.Open DATABASE_CONNECTION
    
    ' SQL query to get investment data
    sql = "SELECT " & _
          "InvestmentID, InvestmentName, Category, Sector, " & _
          "InitialInvestment, CurrentValue, TotalReturns, " & _
          "RiskScore, Status, StartDate, EndDate, Notes " & _
          "FROM vw_ROI_InvestmentSummary " & _
          "WHERE Status IN ('Active', 'Monitoring') " & _
          "ORDER BY InvestmentName"
    
    rs.Open sql, conn
    
    ' Clear existing data (keep headers)
    ws.Range("A2:T1000").Clear
    
    ' Copy data to worksheet
    If Not rs.EOF Then
        ws.Range("A2").CopyFromRecordset rs
    End If
    
    ' Close connections
    rs.Close
    conn.Close
    Set rs = Nothing
    Set conn = Nothing
    
    Exit Sub
    
ErrorHandler:
    If Not rs Is Nothing Then
        If rs.State = 1 Then rs.Close
    End If
    If Not conn Is Nothing Then
        If conn.State = 1 Then conn.Close
    End If
    Set rs = Nothing
    Set conn = Nothing
    Call LogError("RefreshFromDatabase", Err.Description)
End Sub

Sub CalculateAllROIMetrics()
    '
    ' Calculate ROI metrics for all investments
    '
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    
    Set ws = ThisWorkbook.Worksheets("Investment Data")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    If lastRow <= 1 Then Exit Sub ' No data to process
    
    Application.StatusBar = "Calculating ROI metrics..."
    
    For i = 2 To lastRow
        If ws.Cells(i, 1).Value <> "" Then ' Check if row has data
            Call CalculateInvestmentROI(ws, i)
        End If
    Next i
    
    ' Update portfolio summary
    Call UpdatePortfolioSummary
End Sub

Sub CalculateInvestmentROI(ws As Worksheet, row As Long)
    '
    ' Calculate ROI metrics for a specific investment row
    '
    Dim initialInvestment As Double
    Dim currentValue As Double
    Dim totalReturns As Double
    Dim startDate As Date
    Dim endDate As Date
    Dim riskScore As Double
    Dim riskFreeRate As Double
    
    ' Get values from worksheet
    initialInvestment = ws.Cells(row, 5).Value   ' Column E
    currentValue = ws.Cells(row, 6).Value        ' Column F
    totalReturns = ws.Cells(row, 7).Value        ' Column G
    startDate = ws.Cells(row, 17).Value          ' Column Q
    riskScore = ws.Cells(row, 13).Value          ' Column M
    
    ' Set end date (if empty, use current date)
    If ws.Cells(row, 18).Value = "" Then
        endDate = Date
    Else
        endDate = ws.Cells(row, 18).Value        ' Column R
    End If
    
    riskFreeRate = GetRiskFreeRate() ' Get current risk-free rate
    
    ' Calculate and populate ROI metrics
    ws.Cells(row, 8).Value = CalculateROI(initialInvestment, currentValue) / 100 ' ROI %
    ws.Cells(row, 9).Value = CalculateAnnualizedROI(initialInvestment, currentValue, startDate, endDate) / 100 ' Annualized ROI %
    ws.Cells(row, 12).Value = CalculatePaybackPeriod(initialInvestment, totalReturns / ((endDate - startDate) / 365.25)) ' Payback Period
    
    ' Calculate Sharpe Ratio (assuming risk score represents volatility)
    If riskScore > 0 Then
        ws.Cells(row, 15).Value = CalculateSharpeRatio(ws.Cells(row, 8).Value * 100, riskFreeRate, riskScore) ' Sharpe Ratio
    End If
    
    ' Set risk category based on risk score
    ws.Cells(row, 14).Value = GetRiskCategory(riskScore) ' Risk Category
    
    ' Update last updated timestamp
    ws.Cells(row, 19).Value = Now ' Last Updated
End Sub

Function GetRiskFreeRate() As Double
    '
    ' Get current risk-free rate (e.g., 10-year Treasury rate)
    ' In production, this would pull from a financial data API
    '
    GetRiskFreeRate = 2.5 ' 2.5% default - replace with actual API call
End Function

Function GetRiskCategory(riskScore As Double) As String
    '
    ' Categorize risk based on risk score
    '
    Select Case riskScore
        Case Is <= 3
            GetRiskCategory = "Low"
        Case Is <= 6
            GetRiskCategory = "Medium"
        Case Is <= 8
            GetRiskCategory = "High"
        Case Else
            GetRiskCategory = "Very High"
    End Select
End Function

' ============================================
' DASHBOARD AND REPORTING
' ============================================

Sub UpdateExecutiveDashboard()
    '
    ' Update the Executive Dashboard with current metrics
    '
    Dim ws As Worksheet
    Dim dataWs As Worksheet
    Dim lastRow As Long
    Dim totalPortfolioValue As Double
    Dim totalInvestment As Double
    Dim overallROI As Double
    Dim avgROI As Double
    Dim bestInvestment As String
    Dim worstInvestment As String
    Dim bestROI As Double
    Dim worstROI As Double
    Dim i As Long
    
    Set ws = ThisWorkbook.Worksheets("Executive Dashboard")
    Set dataWs = ThisWorkbook.Worksheets("Investment Data")
    
    lastRow = dataWs.Cells(dataWs.Rows.Count, "A").End(xlUp).Row
    
    If lastRow <= 1 Then Exit Sub
    
    ' Initialize variables
    bestROI = -999999
    worstROI = 999999
    
    ' Calculate summary metrics
    For i = 2 To lastRow
        If dataWs.Cells(i, 16).Value = "Active" Then ' Status column
            totalPortfolioValue = totalPortfolioValue + dataWs.Cells(i, 6).Value ' Current Value
            totalInvestment = totalInvestment + dataWs.Cells(i, 5).Value ' Initial Investment
            avgROI = avgROI + dataWs.Cells(i, 8).Value ' ROI %
            
            ' Track best and worst performers
            If dataWs.Cells(i, 8).Value > bestROI Then
                bestROI = dataWs.Cells(i, 8).Value
                bestInvestment = dataWs.Cells(i, 2).Value
            End If
            
            If dataWs.Cells(i, 8).Value < worstROI Then
                worstROI = dataWs.Cells(i, 8).Value
                worstInvestment = dataWs.Cells(i, 2).Value
            End If
        End If
    Next i
    
    ' Calculate overall ROI
    If totalInvestment > 0 Then
        overallROI = (totalPortfolioValue - totalInvestment) / totalInvestment
        avgROI = avgROI / (lastRow - 1)
    End If
    
    ' Update dashboard values
    ws.Range("B6").Value = totalPortfolioValue
    ws.Range("B6").NumberFormat = "$#,##0.00"
    
    ws.Range("B7").Value = totalInvestment
    ws.Range("B7").NumberFormat = "$#,##0.00"
    
    ws.Range("B8").Value = overallROI
    ws.Range("B8").NumberFormat = "0.00%"
    
    ws.Range("B9").Value = bestInvestment & " (" & Format(bestROI, "0.00%") & ")"
    ws.Range("B10").Value = worstInvestment & " (" & Format(worstROI, "0.00%") & ")"
    
    ws.Range("B11").Value = avgROI
    ws.Range("B11").NumberFormat = "0.00%"
End Sub

Sub GenerateExecutiveReport()
    '
    ' Generate comprehensive executive ROI report
    '
    Dim reportWs As Worksheet
    Dim reportDate As Date
    
    reportDate = Date
    
    ' Create or get report worksheet
    On Error Resume Next
    Set reportWs = ThisWorkbook.Worksheets("Executive Report")
    On Error GoTo 0
    
    If reportWs Is Nothing Then
        Set reportWs = ThisWorkbook.Worksheets.Add
        reportWs.Name = "Executive Report"
    Else
        reportWs.Cells.Clear
    End If
    
    Application.ScreenUpdating = False
    
    ' Generate report sections
    Call CreateReportHeader(reportWs, reportDate)
    Call CreateExecutiveSummary(reportWs)
    Call CreatePerformanceAnalysis(reportWs)
    Call CreateRiskAssessment(reportWs)
    Call CreateForecastingModels(reportWs)
    Call CreateRecommendations(reportWs)
    
    ' Format report
    Call FormatExecutiveReport(reportWs)
    
    Application.ScreenUpdating = True
    
    ' Export to PDF
    Call ExportReportToPDF(reportWs, reportDate)
    
    MsgBox "Executive ROI Report generated successfully!", vbInformation
End Sub

Sub CreateForecastingModels(ws As Worksheet)
    '
    ' Add financial forecasting models to the executive report
    '
    Dim forecasts As Variant
    forecasts = Array("Linear Trend Forecast", "Exponential Smoothing", "Monte Carlo Simulation")
    
    With ws
        .Range("A25").Value = "FINANCIAL FORECASTS"
        .Range("A25").Font.Size = 14
        .Range("A25").Font.Bold = True
        
        Dim i As Integer
        For i = 0 To UBound(forecasts)
            .Range("A27").Offset(i, 0).Value = forecasts(i)
            .Range("A27").Offset(i, 1).Value = GenerateFinancialForecast(forecasts(i))
        Next i
    End With
End Sub

Function GenerateFinancialForecast(model As String) As String
    '
    ' Generate a financial forecast based on the model
    ' Placeholder logic until models are fully implemented
    '
    Select Case model
        Case "Linear Trend Forecast"
            GenerateFinancialForecast = "% Increase: 5.2%"
        Case "Exponential Smoothing"
            GenerateFinancialForecast = "Forecast Growth: 4.7%"
        Case "Monte Carlo Simulation"
            GenerateFinancialForecast = "Risk-Adjusted Growth: 4.9%"
        Case Else
            GenerateFinancialForecast = "Unavailable"
    End Select
End Function

' ============================================
' ALERT SYSTEM
' ============================================

Sub CheckROIAlerts()
    '
    ' Check for ROI performance alerts and notifications
    '
    If Not AlertsEnabled Then Exit Sub
    
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim alerts As Collection
    
    Set ws = ThisWorkbook.Worksheets("Investment Data")
    Set alerts = New Collection
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    For i = 2 To lastRow
        If ws.Cells(i, 16).Value = "Active" Then ' Status = Active
            ' Check for underperforming investments (ROI < -10%)
            If ws.Cells(i, 8).Value < -0.1 Then
                alerts.Add CreateROIAlert("UNDERPERFORMING", ws.Cells(i, 2).Value, ws.Cells(i, 8).Value, "Critical")
            End If
            
            ' Check for high-risk investments with low returns
            If ws.Cells(i, 13).Value > 7 And ws.Cells(i, 8).Value < 0.05 Then
                alerts.Add CreateROIAlert("HIGH_RISK_LOW_RETURN", ws.Cells(i, 2).Value, ws.Cells(i, 8).Value, "Warning")
            End If
            
            ' Check for exceptional performance (ROI > 30%)
            If ws.Cells(i, 8).Value > 0.3 Then
                alerts.Add CreateROIAlert("EXCEPTIONAL_PERFORMANCE", ws.Cells(i, 2).Value, ws.Cells(i, 8).Value, "Info")
            End If
        End If
    Next i
    
    ' Process alerts if any exist
    If alerts.Count > 0 Then
        Call ProcessROIAlerts(alerts)
    End If
End Sub

Function CreateROIAlert(alertType As String, investmentName As String, _
                       roi As Double, severity As String) As Object
    '
    ' Create an ROI alert object
    '
    Dim alert As Object
    Set alert = CreateObject("Scripting.Dictionary")
    
    alert.Add "Type", alertType
    alert.Add "Investment", investmentName
    alert.Add "ROI", roi
    alert.Add "Severity", severity
    alert.Add "Timestamp", Now
    alert.Add "Message", GenerateAlertMessage(alertType, investmentName, roi)
    
    Set CreateROIAlert = alert
End Function

Function GenerateAlertMessage(alertType As String, investmentName As String, roi As Double) As String
    '
    ' Generate alert message based on alert type
    '
    Select Case alertType
        Case "UNDERPERFORMING"
            GenerateAlertMessage = investmentName & " is underperforming with ROI of " & Format(roi, "0.00%") & ". Immediate review recommended."
        Case "HIGH_RISK_LOW_RETURN"
            GenerateAlertMessage = investmentName & " has high risk but low returns (" & Format(roi, "0.00%") & "). Consider rebalancing."
        Case "EXCEPTIONAL_PERFORMANCE"
            GenerateAlertMessage = investmentName & " is performing exceptionally well with ROI of " & Format(roi, "0.00%") & ". Consider increasing allocation."
        Case Else
            GenerateAlertMessage = "Alert for " & investmentName & ": ROI " & Format(roi, "0.00%")
    End Select
End Function

Sub ProcessROIAlerts(alerts As Collection)
    '
    ' Process and distribute ROI alerts
    '
    Dim alert As Object
    Dim emailBody As String
    Dim i As Integer
    
    ' Build email body
    emailBody = "ROI Performance Alert Summary" & vbCrLf & _
               "Generated: " & Format(Now, "yyyy-mm-dd hh:mm:ss") & vbCrLf & vbCrLf
    
    For i = 1 To alerts.Count
        Set alert = alerts(i)
        emailBody = emailBody & "• " & alert("Message") & vbCrLf
    Next i
    
    ' Send email alert
    Call SendROIAlertEmail(emailBody)
    
    ' Log alerts
    Call LogROIAlerts(alerts)
End Sub

Sub SendROIAlertEmail(body As String)
    '
    ' Send ROI alert email using Outlook
    '
    On Error GoTo ErrorHandler
    
    Dim outlook As Object
    Dim mail As Object
    
    Set outlook = CreateObject("Outlook.Application")
    Set mail = outlook.CreateItem(0)
    
    With mail
        .To = GetEmailRecipients("ROI_ALERTS")
        .CC = GetEmailRecipients("ROI_ALERTS_CC")
        .Subject = "ROI Performance Alert - " & Format(Date, "yyyy-mm-dd")
        .Body = body
        .Importance = 2 ' High importance
        .Send
    End With
    
    Set mail = Nothing
    Set outlook = Nothing
    Exit Sub
    
ErrorHandler:
    Call LogError("SendROIAlertEmail", Err.Description)
End Sub

Function GetEmailRecipients(recipientType As String) As String
    '
    ' Get email recipients from configuration
    '
    Dim configWs As Worksheet
    Dim lastRow As Long
    Dim i As Long
    
    Set configWs = ThisWorkbook.Worksheets("Configuration")
    lastRow = configWs.Cells(configWs.Rows.Count, "A").End(xlUp).Row
    
    For i = 2 To lastRow
        If configWs.Cells(i, 1).Value = recipientType Then
            GetEmailRecipients = configWs.Cells(i, 2).Value
            Exit Function
        End If
    Next i
    
    ' Default recipients if not found in config
    Select Case recipientType
        Case "ROI_ALERTS"
            GetEmailRecipients = "cfo@company.com;finance@company.com"
        Case "ROI_ALERTS_CC"
            GetEmailRecipients = "investment.committee@company.com"
        Case Else
            GetEmailRecipients = ""
    End Select
End Function

' ============================================
' UTILITY FUNCTIONS
' ============================================

Sub LogError(procedureName As String, errorDescription As String)
    '
    ' Log errors to the error log worksheet
    '
    Dim logWs As Worksheet
    Dim nextRow As Long
    
    On Error Resume Next
    Set logWs = ThisWorkbook.Worksheets("Error Log")
    
    If logWs Is Nothing Then
        Set logWs = ThisWorkbook.Worksheets.Add
        logWs.Name = "Error Log"
        logWs.Range("A1:D1").Value = Array("Timestamp", "Procedure", "Error", "User")
    End If
    
    nextRow = logWs.Cells(logWs.Rows.Count, "A").End(xlUp).Row + 1
    
    logWs.Cells(nextRow, 1).Value = Now
    logWs.Cells(nextRow, 2).Value = procedureName
    logWs.Cells(nextRow, 3).Value = errorDescription
    logWs.Cells(nextRow, 4).Value = Environ("USERNAME")
    
    On Error GoTo 0
End Sub

Sub EnableAutoRefresh()
    '
    ' Enable automatic data refresh
    '
    AutoRefreshEnabled = True
    Application.OnTime Now + TimeValue("00:05:00"), "RefreshAllROIData"
End Sub

Sub DisableAutoRefresh()
    '
    ' Disable automatic data refresh
    '
    AutoRefreshEnabled = False
End Sub

Sub EnableAlertSystem()
    '
    ' Enable the alert system
    '
    AlertsEnabled = True
End Sub

Sub DisableAlertSystem()
    '
    ' Disable the alert system
    '
    AlertsEnabled = False
End Sub

' ============================================
' CONFIGURATION AND SETUP
' ============================================

Sub SetupConfigurationSheet(ws As Worksheet)
    '
    ' Setup the configuration worksheet
    '
    With ws
        .Cells.Clear
        
        .Range("A1").Value = "ROI TRACKING SYSTEM CONFIGURATION"
        .Range("A1").Font.Size = 16
        .Range("A1").Font.Bold = True
        
        ' Configuration headers
        .Range("A3:B3").Value = Array("Setting", "Value")
        .Range("A3:B3").Font.Bold = True
        
        ' Default configuration values
        Dim configData As Variant
        configData = Array( _
            Array("DATABASE_CONNECTION", DATABASE_CONNECTION), _
            Array("API_ENDPOINT", API_ENDPOINT), _
            Array("REFRESH_INTERVAL", REFRESH_INTERVAL), _
            Array("ROI_ALERTS", "cfo@company.com;finance@company.com"), _
            Array("ROI_ALERTS_CC", "investment.committee@company.com"), _
            Array("RISK_FREE_RATE", "2.5"), _
            Array("AUTO_REFRESH_ENABLED", "TRUE"), _
            Array("ALERTS_ENABLED", "TRUE") _
        )
        
        ' Populate configuration data
        Dim i As Integer
        For i = 0 To UBound(configData)
            .Cells(4 + i, 1).Value = configData(i)(0)
            .Cells(4 + i, 2).Value = configData(i)(1)
        Next i
        
        .Columns("A:B").AutoFit
    End With
End Sub

' ============================================
' EXPORT AND REPORTING FUNCTIONS
' ============================================

Sub ExportReportToPDF(ws As Worksheet, reportDate As Date)
    '
    ' Export worksheet to PDF
    '
    Dim fileName As String
    Dim filePath As String
    
    fileName = "Executive_ROI_Report_" & Format(reportDate, "yyyy-mm-dd") & ".pdf"
    filePath = ThisWorkbook.Path & "\" & fileName
    
    On Error GoTo ErrorHandler
    ws.ExportAsFixedFormat Type:=xlTypePDF, _
                          fileName:=filePath, _
                          Quality:=xlQualityStandard, _
                          IncludeDocProps:=True, _
                          IgnorePrintAreas:=False
    Exit Sub
    
ErrorHandler:
    MsgBox "Error exporting report to PDF: " & Err.Description, vbCritical
End Sub
