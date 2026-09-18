# OBS Studio Setup Guide for PM Tools Templates Demo

## Quick Setup Instructions

### 1. Initial OBS Configuration
- **Scene Setup**: Create a new scene called "Desktop Recording"
- **Source**: Add "Display Capture" source
- **Resolution**: Set to 1920x1080 (Full HD) for best quality
- **Frame Rate**: 30 FPS is sufficient for demo content

### 2. Audio Configuration
- **Microphone**: Add "Audio Input Capture" for voiceover
- **Desktop Audio**: Enable to capture system sounds
- **Test levels**: Ensure microphone is around -12dB to -6dB
- **Noise Suppression**: Enable built-in noise filters

### 3. Recording Settings
```
Format: MP4
Encoder: Hardware (if available) or Software x264
Quality: High Quality, Medium File Size
Bitrate: 8000-12000 kbps
Keyframe Interval: 2 seconds
```

### 4. Optimal Recording Environment
- **Screen**: Clean desktop, close unnecessary applications
- **Terminal**: Use full-screen terminal with large, readable font
- **Lighting**: Good lighting for webcam if including face
- **Quiet Space**: Minimize background noise

### 5. Demo Recording Workflow

#### Pre-Recording Checklist:
- [ ] OBS scenes configured
- [ ] Audio levels tested
- [ ] Terminal font size increased (18pt+)
- [ ] Demo script ready
- [ ] Template files accessible
- [ ] ecosystem-gateway.js tested

#### Recording Steps:
1. **Start Recording** in OBS
2. **Launch Terminal** and navigate to project directory
3. **Run ecosystem gateway**: `node ecosystem-gateway.js`
4. **Follow demo script** from demo-video-script.md
5. **Stop recording** when complete

### 6. Post-Recording
- **File Location**: Check OBS recording folder
- **Quick Review**: Verify audio/video quality
- **Backup**: Save to cloud storage immediately
- **Edit**: Use built-in tools or external editor for final touches

### 7. Common Issues & Solutions

**Issue**: Low audio quality
**Solution**: Increase mic gain, add noise gate filter

**Issue**: Blurry screen capture
**Solution**: Ensure display capture matches native resolution

**Issue**: Large file size
**Solution**: Reduce bitrate or use hardware encoding

**Issue**: Terminal text too small
**Solution**: Increase terminal font to 18pt or larger

### 8. Quick Test Recording
Before the full demo, do a 30-second test:
1. Record terminal with basic commands
2. Check audio levels
3. Verify screen clarity
4. Test OBS controls

## Ready to Record!
Once setup is complete, you'll be ready to create professional-quality demo videos for the PM Tools Templates onboarding system.

---
*This guide supports the UX-102 Demo Video creation as part of the Q3 2025 roadmap priority items.*
