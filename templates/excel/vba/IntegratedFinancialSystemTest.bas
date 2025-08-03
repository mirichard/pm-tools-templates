Attribute VB_Name = "IntegratedFinancialSystemTest"
'===============================================================================
' Test Suite for Integrated Financial System
' Validates all components and generates sample data for testing
' Created for Enterprise Executive Dashboard Suite
'===============================================================================

Option Explicit

' Main test runner that validates the entire integrated system
Public Sub RunIntegratedSystemTests()
    On Error GoTo ErrorHandler
    
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    
    Dim startTime As Double
    startTime = Timer
    
    ' Create test log worksheet
    Dim testLog As Worksheet
    Set testLog = CreateTestLogWorksheet()
    
    Call LogTest(testLog, "=== INTEGRATED FINANCIAL SYSTEM TEST SUITE ===", True)
    Call LogTest(testLog, "Start Time: " & Format(Now(), "yyyy-mm-dd hh:mm:ss"), True)
    
    ' Test 1: Setup sample data
    Call LogTest(testLog, "Test 1: Setting up sample data...", True)
    Call SetupSamplePortfolioData()
    Call LogTest(testLog, "✓ Sample data created successfully", True)
    
    ' Test 2: Test forecasting module
    Call LogTest(testLog, "Test 2: Testing forecasting module...", True)
    If TestForecastingModule(testLog) Then
        Call LogTest(testLog, "✓ Forecasting module tests passed", True)
    Else
        Call LogTest(testLog, "✗ Forecasting module tests failed", False)
    End If
    
    ' Test 3: Test portfolio aggregation
    Call LogTest(testLog, "Test 3: Testing portfolio aggregation...", True)
    If TestPortfolioAggregation(testLog) Then
        Call LogTest(testLog, "✓ Portfolio aggregation tests passed", True)
    Else
        Call LogTest(testLog, "✗ Portfolio aggregation tests failed", False)
    End If
    
    ' Test 4: Test executive reporting
    Call LogTest(testLog, "Test 4: Testing executive reporting...", True)
    If TestExecutiveReporting(testLog) Then
        Call LogTest(testLog, "✓ Executive reporting tests passed", True)
    Else
        Call LogTest(testLog, "✗ Executive reporting tests failed", False)
    End If
    
    ' Test 5: Run full integration test
    Call LogTest(testLog, "Test 5: Running full integration test...", True)
    If TestFullIntegration(testLog) Then
        Call LogTest(testLog, "✓ Full integration test passed", True)
    Else
        Call LogTest(testLog, "✗ Full integration test failed", False)
    End If
    
    ' Performance metrics
    Dim endTime As Double
    endTime = Timer
    Call LogTest(testLog, "Total execution time: " & Format(endTime - startTime, "0.00") & " seconds", True)
    
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
    
    ' Show results
    testLog.Activate
    MsgBox "Integrated Financial System testing completed! Check the Test Log worksheet for detailed results.", vbInformation
    Exit Sub
    
ErrorHandler:
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
    MsgBox "Error during testing: " & Err.Description, vbCritical
End Sub

' Create test log worksheet
Private Function CreateTestLogWorksheet() As Worksheet
    Dim ws As Worksheet
    
    ' Delete existing test log if it exists
    On Error Resume Next
    Application.DisplayAlerts = False
    ThisWorkbook.Worksheets("TestLog").Delete
    Application.DisplayAlerts = True
    On Error GoTo 0
    
    ' Create new test log worksheet
    Set ws = ThisWorkbook.Worksheets.Add
    ws.Name = "TestLog"
    
    ' Setup headers
    ws.Range("A1").Value = "Timestamp"
    ws.Range("B1").Value = "Test Description"
    ws.Range("C1").Value = "Status"
    ws.Range("D1").Value = "Details"
    
    ' Format headers
    With ws.Range("A1:D1")
        .Font.Bold = True
        .Interior.Color = RGB(79, 129, 189)
        .Font.Color = RGB(255, 255, 255)
    End With
    
    ws.Columns("A:D").AutoFit
    
    Set CreateTestLogWorksheet = ws
End Function

' Log test results
Private Sub LogTest(testLog As Worksheet, description As String, success As Boolean, Optional details As String = "")
    Dim nextRow As Long
    nextRow = testLog.Cells(testLog.Rows.Count, 1).End(xlUp).Row + 1
    
    testLog.Cells(nextRow, 1).Value = Format(Now(), "hh:mm:ss")
    testLog.Cells(nextRow, 2).Value = description
    testLog.Cells(nextRow, 3).Value = IIf(success, "PASS", "FAIL")
    testLog.Cells(nextRow, 4).Value = details
    
    If Not success Then
        testLog.Cells(nextRow, 3).Interior.Color = RGB(255, 200, 200)
    End If
End Sub

' Setup sample portfolio data for testing
Private Sub SetupSamplePortfolioData()
    Dim portfolioNames As Variant
    Dim i As Integer
    
    portfolioNames = Array("Product Development", "Infrastructure", "Marketing", "R&D", "Operations")
    
    For i = 0 To UBound(portfolioNames)
        Call CreateSamplePortfolioData(CStr(portfolioNames(i)))
    Next i
End Sub

' Create sample data for a specific portfolio
Private Sub CreateSamplePortfolioData(portfolioName As String)
    Dim dataWs As Worksheet
    Dim budgetWs As Worksheet
    Dim i As Integer
    
    ' Create data worksheet
    Set dataWs = GetOrCreateWorksheet(portfolioName & "_Data")
    dataWs.Range("A:Z").Clear
    
    ' Headers
    dataWs.Range("A1").Value = "Month"
    dataWs.Range("B1").Value = "Value"
    
    ' Generate 24 months of sample data with trend and some volatility
    Dim baseValue As Double
    baseValue = 500000 + (i * 200000) + (Rnd() * 300000)
    
    For i = 1 To 24
        dataWs.Cells(i + 1, 1).Value = DateAdd("m", i - 24, Date)
        dataWs.Cells(i + 1, 2).Value = baseValue * (1 + (i * 0.02) + (Rnd() - 0.5) * 0.1)
    Next i
    
    ' Create budget worksheet
    Set budgetWs = GetOrCreateWorksheet(portfolioName & "_Budget")
    budgetWs.Range("A:Z").Clear
    
    budgetWs.Range("A1").Value = "Budgeted"
    budgetWs.Range("B1").Value = baseValue * 1.2
    budgetWs.Range("A2").Value = "Actual"
    budgetWs.Range("B2").Value = baseValue * (0.9 + Rnd() * 0.2)
End Sub

' Test forecasting module functionality
Private Function TestForecastingModule(testLog As Worksheet) As Boolean
    On Error GoTo ErrorHandler
    
    Dim portfolioName As String
    portfolioName = "Product Development"
    
    ' Test 1: Verify sample data exists
    Dim dataWs As Worksheet
    Set dataWs = GetOrCreateWorksheet(portfolioName & "_Data")
    
    If dataWs.Cells(2, 2).Value = 0 Then
        Call LogTest(testLog, "  - Sample data missing", False)
        TestForecastingModule = False
        Exit Function
    End If
    
    ' Test 2: Generate forecast
    Dim dataRange As Range
    Set dataRange = dataWs.Range("B2:B25")
    
    Dim forecastResults As Variant
    forecastResults = GenerateEnsembleForecast(dataRange.Value, 12)
    
    If UBound(forecastResults, 1) <> 12 Then
        Call LogTest(testLog, "  - Forecast generation failed", False)
        TestForecastingModule = False
        Exit Function
    End If
    
    ' Test 3: Verify forecast values are reasonable
    Dim lastHistorical As Double
    lastHistorical = dataRange.Cells(dataRange.Rows.Count, 1).Value
    
    If forecastResults(1, 1) < lastHistorical * 0.5 Or forecastResults(1, 1) > lastHistorical * 2 Then
        Call LogTest(testLog, "  - Forecast values unreasonable", False, "Last: " & lastHistorical & ", Forecast: " & forecastResults(1, 1))
        TestForecastingModule = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - Forecast range validation passed", True)
    TestForecastingModule = True
    Exit Function
    
ErrorHandler:
    Call LogTest(testLog, "  - Forecasting module error: " & Err.Description, False)
    TestForecastingModule = False
End Function

' Test portfolio aggregation functionality
Private Function TestPortfolioAggregation(testLog As Worksheet) As Boolean
    On Error GoTo ErrorHandler
    
    ' Test 1: Calculate total portfolio value
    Dim totalValue As Double
    totalValue = GetTotalPortfolioValue()
    
    If totalValue <= 0 Then
        Call LogTest(testLog, "  - Total portfolio value calculation failed", False)
        TestPortfolioAggregation = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - Total portfolio value: " & Format(totalValue, "$#,##0"), True)
    
    ' Test 2: Calculate weighted average ROI
    Dim avgROI As Double
    avgROI = GetWeightedAverageROI()
    
    If avgROI < -1 Or avgROI > 5 Then ' Reasonable bounds
        Call LogTest(testLog, "  - Weighted ROI out of reasonable bounds", False, "ROI: " & Format(avgROI, "0.00%"))
        TestPortfolioAggregation = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - Weighted average ROI: " & Format(avgROI, "0.00%"), True)
    
    ' Test 3: Test portfolio summary generation
    Call UpdatePortfolioAggregation
    
    Dim summaryWs As Worksheet
    Set summaryWs = GetOrCreateWorksheet("PortfolioSummary")
    
    If summaryWs.Cells(2, 1).Value = "" Then
        Call LogTest(testLog, "  - Portfolio summary generation failed", False)
        TestPortfolioAggregation = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - Portfolio summary generated successfully", True)
    TestPortfolioAggregation = True
    Exit Function
    
ErrorHandler:
    Call LogTest(testLog, "  - Portfolio aggregation error: " & Err.Description, False)
    TestPortfolioAggregation = False
End Function

' Test executive reporting functionality
Private Function TestExecutiveReporting(testLog As Worksheet) As Boolean
    On Error GoTo ErrorHandler
    
    ' Test 1: Generate KPIs
    Dim kpis As Variant
    kpis = GetExecutiveKPIs()
    
    If UBound(kpis, 1) < 5 Then
        Call LogTest(testLog, "  - KPI generation failed", False)
        TestExecutiveReporting = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - Executive KPIs generated: " & (UBound(kpis, 1) + 1) & " metrics", True)
    
    ' Test 2: Test executive summary creation
    Dim summaryWs As Worksheet
    Set summaryWs = GetOrCreateWorksheet("ExecutiveSummaryTest")
    Call CreateExecutiveSummarySheet(summaryWs)
    
    If summaryWs.Range("A1").Value = "" Then
        Call LogTest(testLog, "  - Executive summary creation failed", False)
        TestExecutiveReporting = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - Executive summary sheet created successfully", True)
    TestExecutiveReporting = True
    Exit Function
    
ErrorHandler:
    Call LogTest(testLog, "  - Executive reporting error: " & Err.Description, False)
    TestExecutiveReporting = False
End Function

' Test full system integration
Private Function TestFullIntegration(testLog As Worksheet) As Boolean
    On Error GoTo ErrorHandler
    
    ' Test the main integration function
    Call RefreshAllForecastingModels
    Call UpdatePortfolioAggregation
    
    ' Verify all components are working together
    Dim portfolioNames As Variant
    portfolioNames = GetActivePortfolioNames()
    
    Dim allPortfoliosValid As Boolean
    allPortfoliosValid = True
    
    Dim i As Integer
    For i = 0 To UBound(portfolioNames)
        Dim portfolioName As String
        portfolioName = CStr(portfolioNames(i))
        
        ' Check if forecast worksheet exists and has data
        Dim forecastWs As Worksheet
        Set forecastWs = GetOrCreateWorksheet(portfolioName & "_Forecast")
        
        If forecastWs.Cells(2, 2).Value = 0 Then
            Call LogTest(testLog, "  - Portfolio " & portfolioName & " forecast missing", False)
            allPortfoliosValid = False
        End If
    Next i
    
    If Not allPortfoliosValid Then
        TestFullIntegration = False
        Exit Function
    End If
    
    ' Check portfolio summary
    Dim summaryWs As Worksheet
    Set summaryWs = GetOrCreateWorksheet("PortfolioSummary")
    
    If summaryWs.Cells(2, 1).Value = "" Then
        Call LogTest(testLog, "  - Portfolio summary integration failed", False)
        TestFullIntegration = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - All portfolio integrations validated", True)
    
    ' Test performance metrics
    Dim totalValue As Double
    Dim totalForecast As Double
    totalValue = GetTotalPortfolioValue()
    totalForecast = GetTotalForecastValue()
    
    If totalForecast <= totalValue * 0.5 Or totalForecast >= totalValue * 3 Then
        Call LogTest(testLog, "  - Forecast integration seems unreasonable", False, "Current: " & Format(totalValue, "$#,##0") & ", Forecast: " & Format(totalForecast, "$#,##0"))
        TestFullIntegration = False
        Exit Function
    End If
    
    Call LogTest(testLog, "  - Integration performance metrics validated", True)
    TestFullIntegration = True
    Exit Function
    
ErrorHandler:
    Call LogTest(testLog, "  - Full integration error: " & Err.Description, False)
    TestFullIntegration = False
End Function

' Performance benchmark test
Public Sub RunPerformanceBenchmark()
    Dim startTime As Double
    Dim endTime As Double
    
    startTime = Timer
    
    ' Run the main integration multiple times
    Dim i As Integer
    For i = 1 To 5
        Call RefreshAllForecastingModels
        Call UpdatePortfolioAggregation
    Next i
    
    endTime = Timer
    
    MsgBox "Performance Benchmark Results:" & vbCrLf & _
           "5 full integrations completed in " & Format(endTime - startTime, "0.00") & " seconds" & vbCrLf & _
           "Average time per integration: " & Format((endTime - startTime) / 5, "0.00") & " seconds", vbInformation
End Sub

' Utility function to get or create worksheet (duplicated for testing independence)
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
