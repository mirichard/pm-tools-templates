#!/usr/bin/env python3
"""
Quick Test Runner for Integrated Financial System
Validates that all VBA files are properly structured and ready for Excel import
"""

import os
import re
from pathlib import Path

def validate_vba_file(file_path):
    """Validate VBA file structure and syntax"""
    print(f"\n📁 Validating: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check basic VBA structure
    checks = [
        ("Module declaration", r"Attribute VB_Name"),
        ("Option Explicit", r"Option Explicit"),
        ("Public functions", r"Public (Sub|Function)"),
        ("Error handling", r"On Error GoTo"),
        ("End statements", r"End (Sub|Function)")
    ]
    
    passed = 0
    for check_name, pattern in checks:
        if re.search(pattern, content, re.IGNORECASE):
            print(f"  ✅ {check_name}")
            passed += 1
        else:
            print(f"  ⚠️  {check_name} - not found or incomplete")
    
    # Count functions and subs
    functions = len(re.findall(r"(Public|Private) (Sub|Function)", content, re.IGNORECASE))
    print(f"  📊 Functions/Subs found: {functions}")
    
    # Check file size
    size_kb = os.path.getsize(file_path) / 1024
    print(f"  📏 File size: {size_kb:.1f} KB")
    
    return passed >= 3  # Minimum checks to pass

def validate_documentation(file_path):
    """Validate documentation file"""
    print(f"\n📖 Validating documentation: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ Documentation not found: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = [
        "Overview",
        "Prerequisites", 
        "Step-by-Step",
        "Test Components",
        "Troubleshooting"
    ]
    
    found_sections = 0
    for section in sections:
        if section.lower() in content.lower():
            print(f"  ✅ {section} section found")
            found_sections += 1
        else:
            print(f"  ⚠️  {section} section missing")
    
    word_count = len(content.split())
    print(f"  📊 Word count: {word_count}")
    
    return found_sections >= 4

def check_file_structure():
    """Check if all required files exist"""
    print("\n🗂️  Checking file structure...")
    
    base_path = Path(__file__).parent
    required_files = [
        "templates/excel/vba/IntegratedFinancialSystem.bas",
        "templates/excel/vba/IntegratedFinancialSystemTest.bas", 
        "templates/excel/Testing_Instructions.md"
    ]
    
    all_exist = True
    for file_path in required_files:
        full_path = base_path / file_path
        if full_path.exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path}")
            all_exist = False
    
    return all_exist

def generate_test_summary():
    """Generate a test summary report"""
    print("\n📋 Generating test summary...")
    
    base_path = Path(__file__).parent
    
    # Count total lines of VBA code
    vba_files = [
        base_path / "templates/excel/vba/IntegratedFinancialSystem.bas",
        base_path / "templates/excel/vba/IntegratedFinancialSystemTest.bas"
    ]
    
    total_lines = 0
    for vba_file in vba_files:
        if vba_file.exists():
            with open(vba_file, 'r', encoding='utf-8') as f:
                lines = len(f.readlines())
                total_lines += lines
                print(f"  📄 {vba_file.name}: {lines} lines")
    
    print(f"  📊 Total VBA code: {total_lines} lines")
    
    # Estimate functions
    main_vba = base_path / "templates/excel/vba/IntegratedFinancialSystem.bas"
    if main_vba.exists():
        with open(main_vba, 'r', encoding='utf-8') as f:
            content = f.read()
            functions = len(re.findall(r"(Public|Private) (Sub|Function)", content, re.IGNORECASE))
            print(f"  🔧 Main system functions: {functions}")

def main():
    """Main test runner"""
    print("🚀 Integrated Financial System - Test Validation")
    print("=" * 50)
    
    # Check file structure
    if not check_file_structure():
        print("\n❌ File structure validation failed!")
        return False
    
    base_path = Path(__file__).parent
    
    # Validate main system
    main_system_valid = validate_vba_file(
        base_path / "templates/excel/vba/IntegratedFinancialSystem.bas"
    )
    
    # Validate test suite
    test_suite_valid = validate_vba_file(
        base_path / "templates/excel/vba/IntegratedFinancialSystemTest.bas"
    )
    
    # Validate documentation
    docs_valid = validate_documentation(
        base_path / "templates/excel/Testing_Instructions.md"
    )
    
    # Generate summary
    generate_test_summary()
    
    # Final results
    print("\n🏁 VALIDATION RESULTS")
    print("=" * 30)
    
    results = [
        ("File Structure", check_file_structure()),
        ("Main System", main_system_valid),
        ("Test Suite", test_suite_valid),
        ("Documentation", docs_valid)
    ]
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name}: {status}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ALL VALIDATIONS PASSED!")
        print("\nNext steps:")
        print("1. Open Excel")
        print("2. Import both .bas files")
        print("3. Run RunIntegratedSystemTests()")
        print("4. Review TestLog worksheet")
    else:
        print("⚠️  Some validations failed. Check the details above.")
    
    return all_passed

if __name__ == "__main__":
    main()
