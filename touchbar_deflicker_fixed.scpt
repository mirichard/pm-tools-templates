global computerIsInUse, resetTime

on run
	set computerIsInUse to true
	set resetTime to (do shell script "date +%s") as integer
end run

on idle
	set idleTime to (do shell script "ioreg -c IOHIDSystem | awk '/HIDIdleTime/ {print $NF; exit}'") as integer
	if idleTime is greater than 7.4E+10 then
		if computerIsInUse then
			try
				do shell script "pkill TouchBarServer" with administrator privileges
				set computerIsInUse to false
			on error errMsg
				-- Log error but continue
				log "Error killing TouchBarServer: " & errMsg
			end try
		end if
	end if
	if idleTime is less than 7.4E+10 then
		set computerIsInUse to true
	end if
	
	set now to (do shell script "date +%s") as integer
	if (not computerIsInUse) and ((now - resetTime) is greater than 59) then
		try
			do shell script "pkill TouchBarServer" with administrator privileges
			set resetTime to (do shell script "date +%s") as integer
		on error errMsg
			-- Log error but continue
			log "Error in periodic reset: " & errMsg
		end try
	end if
	return 1
end idle
