---
title: "uLuCuMuTu uPuroject uSutartup uGuuidebook uv1u1u u0u5u uNuov"
version: "v1.0.0"
template_state: "clean"
intended_audience: ["PM","Team"]
internal_view: true
external_view: true
dependencies: []
tags: ["project-management"]
description: "Sanitized template converted from legacy PM tools collection"
source_file: "CMT_Project Startup Guidebook_v11_05 Nov.docx"
integration_date: "2025-08-19"
sanitization_level: "full"
---

# {{template_title}}

## Purpose

This template provides a structured approach for {{template_purpose}}. It has been sanitized and converted from legacy project management tools to ensure consistency with modern PM practices.

## Instructions

1. Replace all placeholder values marked with {{double_braces}}
2. Customize sections based on your project context
3. Remove sections that don't apply to your specific use case
4. Update stakeholder information as appropriate

## Template Content

> **Note:** This content has been extracted and sanitized from original source files. Review and adapt as needed for your organization's specific requirements.


### Extracted Content

```
Project Startup Guide
Document Control Information
Document Information
Document Identification

Document Name
Project Startup Guide
Project Name
MS-Project, Project Management Center, HP-Quality Center
Client
Deloitte Technology Service Area
Document Author
Rohan Bhate
Document Version
1.0
Document Status
First Release
Date Released
Aug-29-2012
File Name
CMT_Project Startup Guidebook_v1.docx
Document Edit History
Version
Date
Additions/Modifications
Prepared/Revised by
1.0
Aug-29-2012
Initial Version
Rohan Bhate
2.0
Aug-31-2012
Outline changes to make it as per process
Rohan Bhate








Document Review/Approval History
Date
Name
Organization/Title
Comments
Aug-30-2012
Rusty Greer






















Distribution of Final Document
The following people are designated recipients of the final version of this document:
Name
Organization/Title
<Name>
<Organization/Title>






Table of Contents
1	Project Startup Guide Overview	4
Objective	4
Audience	5
Background	5
Solution Architecture	5
Summary	5
2	Develop the Work Plan	6
Download Starter plans	6
Develop integrated Work Plan	7
Develop USI Actuals Tracking Plan	15
3	Create Users in PMC	21
4	PMC Settings	22
Change Project status in PMC from “New” to “In Planning”	22
Automate approval of timesheets	22
Synchronize work plan to PMC	22
Check work plan details in PMC after copying from MS-Project	23
5	Loading Object information into HP-QC from PMC	25
6	Appendix	26



Project Startup Guide Overview
Objective
The objective for creating this document is to enable a consistent and an easy approach to planning a project using MS-Project (MSP), Project Management Center (PMC), and HP-Quality Center (HP-QC), for the very first time.

This document will help to address the following objectives:
	•	Provides a consistent approach to creation of Work Plans across the US and USI.
	•	Provides a consistent approach for using MSP, PMC, and HP_QC
	•	Provides a set of actionable steps that produce consistent and repeatable results
	•	Provides a stakeholder feedback process to revise this document regularly

There are three guides that the Project Manager (PM)/Team Leads can access – PM Tools Setup Guide, Project Startup Guide, and Project Operations Guide.

Setup
Startup
Operate
Setup
Startup
Operate




The PM Tools Setup Guide provides detailed information on how to setup the Project Management Tools (Microsoft Project (MSP), Project Management Center (PMC), and HP Quality Center (HP-QC)) on an individual’s laptop.  
This is a one-time process and should be executed on each Project Managers laptop.  This step should be completed before moving on with the project start-up process.

The Project Startup Guide provides details on setting up MS-Project work plans, planning the project in PMC and setting up HP-QC.  These processes are performed at the start of each Project.

The Project Operations Guide describes how to manage projects on an on-going basis.  Typically operational processes are performed weekly for the duration of each project.


Audience 
This document is intended to assist PMs, across Consulting Technology Service Area.
Background
Deloitte Technology One (DT/1) is a journey to innovate and transform our service delivery through standards, methods, tools and training that will make our sales and delivery more efficient, more disciplined, and better able to address the global and complex needs of our clients.
A key focus of DT/1 is to put greater emphasis on standards, which will bring a more consistent approach to how we execute pursuits and projects, while maintaining the innovation, creativity, and attention on business value that has always been our strong suit. Standards, defined as minimum requirements that all pursuits and projects should meet, are developed and will be deployed in a phased approach.  
Solution Architecture 
The integrated solution architecture is based on MSP, PMC, and HP-QC tools.

Summary
This Setup Guide will cover the following sections:
#
SECTION TITLE
SECTION DESCRIPTION
1.
Background
Provides various Solution details
2.
Develop the work plan
Developing project work plan using the starter plans
3.
Create Users in PMC/HP-QC
Create Users in PMC/HP-QC for accessing the system, creating timesheets etc.
4.
Tailor PMC
Change project status, synchronize work plan, Check work plan details in PMC, configure dashboards
5.
Loading object information into HP-QC
Retrieve object information from MS-Project, import the information into HP-QC, Check HP-QC
Develop the Work Plan
This section provides detailed information which will assist the Project Manager/Leads to download the templates/starter plans and develop the Project specific work plans.
The following topics are discussed below:
	•	Download Starter plans
	•	Develop Integrated work plan (IWP)
	•	Develop USI Actuals tracking plan (ATP)
	•	

The following table lists the plans that might be required and the criteria for which one(s) should be developed:
Name
Brief Description
Criteria
Integrated Work Plan (IWP)
	•	One single Work Plan for the global team
	•	Work Plan construct enables using the Development Object Dashboard
	•	Easiest Work Plan to build and maintain
	•	
	•	Almost all projects should build an IWP
Actuals Tracking Plan (ATP)
	•	Not a complete Work Plan (not used to schedule work, nor track progress)
	•	Contains tasks in MS-Project that map to XD Portal to facilitate capturing actual effort.
	•	All USI projects that build an IWP must also build an ATP

Actuals Work Plan (AWP)
	•	A resource loaded, resource levelled Work Plan that is decomposed to the step level
	•	Most difficult Work Plan to build and maintain
	•	The US team is not building an IWP
	•	The USI team does not want Development Object Dashboard capability

Download Starter plans 
Projects should use the available templates/starter plans available in EVD or custom built for USI for building the project specific work plan/plans. 

Performed by:  Project Manager(s)
Frequency: Once per Project
Guidelines: 
The following Starter Plans are available:
	•	<SAP-OPT Integrated Work Plan – Task Level with Objects>
	•	<SAP-OPT Integrated Work Plan – Object Level with tasks>
	•	<USI Actuals Tracking Plan>
	•	<SAP-OPT USI Actuals Work Plan – Tasks Level with Objects>
	•	<SAP-OPT USI Actuals Work Plan – Object Level with Tasks>

NOTE: The cells highlighted in green in each template are the cells that need to be updated by the PM.

IMP - Starter plans have been set up with the options that are recommended. Care should be taken not to make changes to these options.  All starter plans are setup with sample data.  Fields marked with a green highlight are fields that must be reviewed and populated.
Once the starter plans have been downloaded, the plan has to be modified to make it specific to the project. 

Develop integrated Work Plan	

The following topics are discussed below:
	•	Set-up Activities
	•	Create Work Breakdown Structure (WBS)
	•	Define Dependencies
	•	Enter Resources
	•	Enter Effort
	•	Estimate Duration
	•	Refine Work Plan

The US work plan templates comprise the 5 tasks for RICEFW development as per EVD 3.5.  The 5 tasks are:
	•	Develop Functional Specifications
	•	Develop Technical Specifications
	•	Develop Software Code
	•	Conduct Software Development Technical Unit Test
	•	Conduct Software Development Functional Unit Test

This work plan will be developed by the US team with the USI PM participating to confirm and validate the resource assumptions and dates.  These instructions are included here so that the USI PM understands the entire process and can participate in any or all of it as appropriate.  In cases where the US team is not using PMC, or not following the PM Standards, then the USI team might decide to develop an Integrated Work Plan solely for the USI work due to ease of development as well as access to the Development Object Dashboard.
The Integrated Work Plan contains details of the US as well as the USI RICEFW object information.

	•	Perform Set-up Activities
This includes the following:
	•	Set the project start date.
Guidelines – Set the Project start date 
Steps
Navigate to Project -> Project Information – Enter the Start date as depicted below.



	•	Set up the work plan calendar
Guidelines - Adjust the project calendar to incorporate holidays and any planned shut-downs.  
Steps
	•	Adjust the project calendar to incorporate holidays and any planned shut-downs - (Project > Change Working Time > Exceptions Tab).

	
NOTE: The working time that has been set in the templates should not be changed.

	•	Enter Resources
Guidelines - Resources working on the project have to be created in the work plan and assigned to the various tasks. Resources have to be created irrespective of the type of work plan. 
	•	While using generic resource types, adjust the “max units” field in the resource sheet to reflect the size of the team e.g. a team of 5 programmers could be 500%.
	•	For USI resources, the USI Team Lead is assigned to all the USI specific tasks. 

All the tasks USI is doing should be assigned to the USI PM
Steps
	•	Navigate to the Menu – Resource -> Resource Sheet
Enter the USI Team Lead into the resource sheet. These resources once entered can be assigned to tasks in the work plan.
Enter the email address as the resource name (without the extension @deloitte.com
Enter the USI PM into the resource sheet.


	•	Create WBS (CMMI rollup fields here) 
The task hierarchy needs to be defined first followed by the task definition.
This includes the following:
Create WBS levels
Guidelines – Levels need to be created in the work plan to ensure that the structure and the levels are in alignment with the EVD structure (depicted below).
Steps:

	•	For each summary task, copy the dummy object details by selecting the entire row (child tasks). You can choose to copy one row or multiple rows. The screenshot below has copied the first 3 rows for the Develop Functional Specifications phase.



	•	Go to the cell below the dummy task and paste the copied cells. Repeat this for all the objects in scope.


	•	Change the following Object information in line with the actual object details:
	•	Change the Task Type attribute to reflect the correct task type based on the Summary Task information.
The task types are FS, TS, C, TUT, FUT
	•	Object Type – select from the drop-down list in MS-Project. The different object types available are RPT, PNT, MID, CONV, ENH, WFL, FRM, POR, EDI
	•	Object ID – a unique identifier for each object that will be used for all five tasks in scope; the object id is free format and can have any value that the project team decides to use, but each object id must be linked to exactly 5 lines in the work plan
	•	Name – In order to distinguish the tasks in PMC, use consistent naming conventions….go through and decide and put the naming convention in the work plan itself in the screenshot and that will be a given.
For each of the 5 tasks, the following abbreviations can be used in the work plan
	•	FS – Develop Functional Specifications
	•	TS – Develop Technical Specifications
	•	Code – Develop Software Code
	•	TUT - Conduct Software Development Technical Unit Test
	•	FUT - Conduct Software Development Functional Unit Test
	•	Complexity – select from the drop-down list in MS-Project; there are 4 standard complexity values used in EVD, S, M, C, V
	•	Enter the Object Team and Object Sub-Team information for each child task.

	•	Once the tasks have been created and attributes defined for the “Develop Functional Specifications” summary task, the same tasks can be copied to the other summary tasks. This will ensure that the Object Type, Object ID, complexity, other information will remain the same for those tasks.
	•	Enter the Task Code according to the summary task that those tasks reside in.

	•	Create Milestones, if required – A milestone is a task with zero duration and zero work. Milestones can be used to document when a set of tasks is completed.
The milestones will already have been set in the template. Change milestones only if required else use the existing set milestones.


	•	Define Dependencies 
Link tasks according to their natural relationships to other tasks by assigning predecessors and successors
	•	The dependencies in the template will already have been defined for the tasks. The same dependencies should be used for the other tasks.
	•	Each FS is linked to start project milestone
	•	Each object id is linked to prior steps for that object ID (FS -> TS -> C -> TUT -> FUT)
	•	Each FUT completion is linked to Application Development Complete” milestone

Steps:
	•	Identify and select the tasks for each object, starting from the first summary task “Develop Functional Specifications”
	•	Identify the successor task e.g. Develop Technical Specifications, enter the row number for the same in the successor column.
	•	Repeat this step for the other tasks.



	•	Enter resources.
Assign the USI Team Lead to all the USI tasks.





	•	Estimate Effort
Estimate the effort associated with each task (in hours)
Effort estimates are obtained from PE&PS. These estimates are based on the tasks, object types and complexity. The effort estimates have to be entered against each child task in the integrated plan.
The task type of each child task being “Fixed Work”, entering the effort estimate automatically changes the finish date as well as the duration of the task.

	•	Estimate Durations
All the child tasks have been set to the task type “Fixed Work”. Hence we do not need to change the durations for the child tasks.
Once the work field and the resources have been populated, the duration field automatically gets updated based on the entries.
It is not recommended to make changes to the durations if the work field has been updated.
		

	•	Refine work plan

resource balancing

Adjusting work/effort: 
Steps:
	•	Select each task.
	•	Enter the effort estimate for the task in the “Work” column.
	•	This changes the end date and duration of the task and also impacts the Start and End dates of the dependent tasks.
Move below 2 points to refine work plan step.
	•	Reducing the effort displays the “I” icon in the work field. Clicking on it displays the following options (refer screenshot). Select the appropriate option.


	•	Similarly increasing the effort displays the following information in the work field (refer screenshot)



Baseline the Work Plan
Once the work plan has been created, it should be baselined in order to be able to track the actual performance of the project against the originally planned timelines and dates.

Steps:
	•	Go to Project menu
	•	Click on “Set Baseline”. 
	•	Ensure the “Entire Project” radio button is checked.




Achieve Workload
	•	Add dependencies to sequence deliverables (see below)
	•	Add lead/lag time to smooth workload (next slide)
	•	Extend task durations to flatten resource requirements


Develop USI Actuals Tracking Plan
	•	This work plan will be developed by the USI team and will contains details of the USI RICEFW objects to be developed

This plan enables the USI QRM team to get the CMMi L5 metrics based on actual effort capture in PMC

The following topics are discussed below:
	•	Set-up Activities
	•	Set Duration
	•	Create Work Breakdown Structure (WBS)
	•	Allocate Effort
	•	Assign Resources

	•	Perform Set-up Activities
This includes the following:
	•	Set the project start date.
Guidelines – Set the Project start date 
Steps
Navigate to Project -> Project Information – Enter the Start date as depicted below.



	•	Enter Resources
Guidelines - Resources working on the project have to be created in the work plan and assigned to the various tasks. Resources have to be created irrespective of the type of work plan. 

Steps
	•	Navigate to the Menu – Resource -> Resource Sheet
Enter the resources into the resource sheet. These resources once entered can be assigned to tasks in the work plan.


	•	Estimate Durations
Set the task duration for the dummy object in the work plan to the duration of the entire project. This ensures that the same durations are also replicated for the other objects on the project.

	•	Create WBS (CMMI rollup fields here) 
The task hierarchy needs to be defined first followed by the task definition.
This includes the following:
Create WBS levels
Guidelines – Levels need to be created in the work plan to ensure that the structure and the levels are in alignment with the USI applicable structure (depicted below).
Steps:
	•	Go to the Gantt Chart menu option and select the DC USI Plan view. This ensures all the columns including the CMMi Rollup column are visible.
	•	Refer the structure in the USI Starter Plan. The structure will be as depicted below, and aligned to be able to provide the data in PMC required for pulling the CMMi metrics:



	•	The USI Actuals Tracking plan will have a dummy object AAA created which will have the details of the tasks for which time must be tracked. This includes the CMMi Rollup field as well.  The values in the CMMi Rollup field map directly to the tasks in XD portal – this facilitates collecting comparable data for CMMI metrics generation. Please do not change the default values defined in this field.
 

	•	For each summary task, copy the dummy object details by selecting the entire rows (child tasks) (refer screenshot).


	•	Go to the cell below the dummy task and paste the copied cells. Paste this same block for all the objects in scope (you can paste the same block n times, where n is the total number of objects). Outdent the tasks in case they are copied to one level ahead of the dummy object AAA tasks.

	•	Replace the dummy object names to the actual object name.


	•	Change the following Object information in line with the actual object details:
	•	Object Type: RPT, PNT, MID, CONV, ENH, WFL, FRM, POR, EDI 
	•	Object ID: The unique identifier of a development object in the work plan (free form)
	•	Complexity: S, M, C, V 
NOTE: Please do not change the values set in the CMMi Rollup fields. These values have been defined to enable the QRM team to collect the CMMi metrics.
	•	Go to the Gantt Chart view and select the DC Dev Object Plan View. 
	•	Change the Object Information in the following fields.
	•	Task Code: FS, TS, C, TUT, FUT

	•	Create Milestones, if required – A milestone is a task with zero duration and zero work. Milestones can be used to document when a set of tasks is completed.
The milestones will already have been set in the template. Change milestones only if required else use the existing set milestones

	•	Estimate Effort
Estimate the effort associated with each task (in hours)
	•	Project teams estimate work (effort) 
	•	When estimating work, indicate the total hours of effort required regardless of team size or task duration
	•	Be sure to include the effort to review and revise and obtain sign-off

Effort estimates are obtained from PE&PS. These estimates are based on the tasks, object types and complexity. The effort estimates have to be entered against each objects child task in the integrated plan.
The development effort for the objects is broken up into the effort for the individual tasks as depicted below:
Tech Spec
IOR
8.0%
100.0%
 
Develop
80.0%
 
 
Review
12.0%
 
Code
Develop
80.0%
100.0%
 
Review
20.0%
 
TUT
Conduct
100.0%
100.0%


Steps:
	•	Select each task.
	•	Enter the effort estimate for the task in the “Work” column.
	•	This changes the end date and duration of the task and also impacts the Start and End dates of the dependent tasks.


	•	Assign Resources

	•	Baseline the Work Plan
Once the work plan has been created, it should be baselined in order to be able to track the actual performance of the project against the originally planned timelines and dates.
Steps:
	•	Go to Project menu
	•	Click on “Set Baseline”. 
	•	Ensure the “Entire Project” radio button is checked.




Create Users in PMC
This section provides information which will assist the Project Manager/Leads to create users in PMC.  Generally, USI team members will need to be setup in two PMC projects – the one the US team is using for the IWP and the one the USI team is using the track actuals.  The US PMC Lead should do this for the US project and the USI PMC Lead should do this for the USI project.Create Users in PMC
Guidelines – The Steps below help the PM/Leads to create the necessary users in PMC. These users are the project resources e.g. developers, Team Leads etc. 
Steps
	•	Project Manager fills up the User Creation request Infopath form in KX.
	•	PMC Support team creates the users and informs the Project Manager
	•	Project Manager then informs the Project team Users and provides details of using PMC
	•	Project Manager assigns PM access to users requiring the same.




PMC Settings
This section provides information which will assist the Project Manager/Leads to create users in PMC and HP-QC
The following topics are discussed below:
	•	Change Project status in PMC from “New” to “In Planning”
	•	Automate approval of timesheets
	•	Synchronize work plan to PMC

Change Project status in PMC from “New” to “In Planning”
Guidelines – The Project status in PMC needs to be changed to “In Planning” before copying the Object information from MS-Project.  
Steps
	•	In PMC, click on dashboards in the menu.
	•	Click on Frontpage dashboard (Standard PPM dashboard)
	•	Click on the Project Name in the “My Projects” portlet. 
	•	Go to the project details tab 
	•	Click on the “in planning” action button
	•	Click on Save
	•	Mention changes in notes
Automate approval of timesheets
Guidelines – Timesheets created by resources should be approved automatically.  
Steps
	•	In PMC, click on dashboards in the menu.
	•	Click on Frontpage dashboard (Standard PPM dashboard)
	•	Click on the Project Name in the “My Projects” portlet.
	•	Go to Project Settings
	•	Click on the Cost and Effort button
	•	Navigate to the “Time Management” section
	•	Uncheck the “Time logged against this project must be approved by a project representative from the following group” check box
	•	Click on the Done button.

Synchronize work plan to PMC
Guidelines – Once the work plan is ready and baselined, it has to be synchronized with PMC in order to copy the Project information to  PMC.
The US PM is responsible for synchronizing the Integrated Plan with the US instance of PMC. Similarly, the USI PM is responsible for synchronizing the USI Actuals Tracking plan with the USI instance of PMC.
Steps
	•	Select HP PPM Center -> Send work plan to PPM…
	•	Enter server information (if required) https://pmcenter.deloitte.com
	•	Enter PMC login info and click OK
	•	Find and select the desired project
	•	Click Select button
	•	From completion dialog, click Done



Check work plan details in PMC after copying from MS-Project
Guidelines – After synchronizing the work plan with PMC, The PM/Leads should log into PMC and check if the work plan information has got copied successfully to PMC. 
Steps
	•	Click on Frontpage dashboard (Standard PPM dashboard)
	•	Click on the Project Name in the “My Projects” portlet. 
	•	Go to the Project Summary tab.
	•	Check work plan portlet 
	•	Refer the Gantt Chart
	•	Check My Task portlet

Loading Object information into HP-QC from PMC
This section provides information on loading the initial object information from PMC into HP-QC. Once the work plans have been copied to PMC (Refer section 5), the objects have to be loaded into HP-QC.
PMC-QC integration is manual and uni-directional, i.e. object information will flow from PMC to QC, and not vice-versa.
The project manager role for Defect Management (QC) will have access to run the Work Plan Extract Report in PMC.
The project manager role for Defect Management will be authorized to upload the object information to QC.
The manual interface will detect whether or not an object being uploaded to QC already exists there. If it exists, the object should not be updated in QC. If it does not exist, the object should uploaded to QC. 

Steps
	•	Run the work plan extract report in PMC. On the selection screen, only select the Object ID, Object Type and complexity information, deselect the other fields.  information for the objects. 
	•	Copy object information from the Work plan extract report to excel with the QC macro.
	•	From the report, paste the 3 fields into the macro excel sheet 
	•	Enter the URL as https://qcenter.deloitte.com/qcbin/
	•	Enter the Project name in the excel, this is the same project name in HP-QC
	•	Run the excel macro to upload the Object information to QC
NOTE: The excel macro only uploads from a 64-bit machine. Please ensure that a 64-bit machine is available to complete this activity.
	•	Check if there are any errors.
	•	If errors, follow the support process <TO provide link to support process>
	•	If no errors, Verify the object information in QC.
	•	If object information in QC is correct, inform users with resource rights with access to QC to do their regular activities related to QC.

Appendix

Work planning can include several types of plans, depending upon the project and the approach.  

The PM Standards require two types of plans:
	•	Master Plan – A high level Gantt chart of releases, rollouts, phases, major activities and major milestones of the project. These are typically built using MS-Excel.

The Master Plan covers the entire project so it’s typically built and maintained by the US PM/PMO.  USI PMs should get a copy and understand the timing of the activities listed on the Master Plan, especially those being performed in USI.  Developing the Master Plan is outside the scope of this guide.

	•	Work Plan – An execution plan showing the responsibilities, dependencies, schedule, and planned effort of a set of tasks. These are typically built using MS-Project.


This development process is iterative in nature and consists of the following steps depicted in the diagram below:


These standard steps apply regardless of the size or complexity of the work plan being developed

About Deloitte
Deloitte provides audit, tax, consulting, and financial advisory services to public and private clients spanning multiple industries. With a globally connected network of member firms in 140 countries, Deloitte brings world-class capabilities and deep local expertise to help clients succeed wherever they operate. Deloitte's 165,000 professionals are committed to becoming the standard of excellence.
Deloitte's professionals are unified by a collaborative culture that fosters integrity, outstanding value to markets and clients, commitment to each other, and strength from cultural diversity. They enjoy an environment of continuous learning, challenging experiences, and enriching career opportunities. Deloitte's professionals are dedicated to strengthening corporate responsibility, building public trust, and making a positive impact in their communities.
Deloitte refers to one or more of Deloitte Touche Tohmatsu, a Swiss Verein, and its network of member firms, each of which is a legally separate and independent entity. Please see www.deloitte.com/about for a detailed description of the legal structure of Deloitte Touche Tohmatsu and its member firms. Please see http://www.deloitte.com/us/about for a detailed description of the legal structure of Deloitte LLP and its subsidiaries.
Internal Usage Statement
This publication is for internal distribution and use only among personnel of Deloitte Touche Tohmatsu, its member firms, and its and their affiliates. Deloitte Touche Tohmatsu, its member firms, and its and their affiliates shall not be responsible for any loss whatsoever sustained by any person who relies on this publication.
Copyright © 2012 Deloitte Development LLC. All rights reserved.
Member of Deloitte Touche Tohmatsu
```

## Key Placeholders

Replace the following placeholders with your specific information:

- `{{project_name}}` - Name of your project
- `{{project_manager}}` - Project manager name
- `{{organization}}` - Your organization name
- `{{stakeholder_role}}` - Specific stakeholder roles
- `{{contact_email}}` - Relevant contact information
- `{{contact_phone}}` - Phone number if appropriate
- `{{person_name}}` - Individual names as needed
- `{{company_name}}` - Partner/vendor company names
- `{{date_placeholder}}` - Relevant dates
- `{{template_purpose}}` - Specific purpose for this template instance
- `{{template_title}}` - Descriptive title for the template

## Internal vs External Use

### Internal View
- Include technical details and internal processes
- Reference internal systems and tools
- Use internal terminology and abbreviations

### External View  
- Focus on outcomes and deliverables
- Use client/stakeholder-friendly language
- Emphasize business value and benefits

## Related Templates

- See `/templates/universal/` for additional project management templates
- Check `/examples/` for completed template samples
- Reference `/docs/` for detailed usage guides

---

*This template is part of the pm-tools-templates collection. For issues or improvements, please contribute back to the repository.*
