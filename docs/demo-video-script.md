# Demo Video Script: PM Tools Templates Quick Start

**Target Length:** 2 minutes 45 seconds  
**Audience:** First-time visitors and new users  
**Purpose:** Show template selection and basic usage  

---

## Video Outline

### Opening (0:00 - 0:15)
**Scene:** GitHub repository homepage  
**Voiceover:** "Welcome to PM Tools Templates - your comprehensive project management toolkit. In under 3 minutes, I'll show you how to find and use the perfect template for your project."

**Actions:**
- Show repository main page
- Highlight star count and key features
- Scroll to show organized structure

### Template Discovery (0:15 - 1:00)
**Scene:** Interactive onboarding launch  
**Voiceover:** "Let's start with our Interactive Onboarding Experience. This guides you to the right templates based on your specific needs."

**Actions:**
- Run: `node ecosystem-gateway.js`
- Select "Start Interactive Onboarding"
- Quick demo of profile questions:
  - Experience level: "Some experience (2-4 years)"
  - Project type: "Software/IT Development"
  - Team size: "Small team (2-5 people)"
  - Methodology: "Agile/Scrum"

### Template Recommendations (1:00 - 1:45)
**Scene:** AI-powered recommendations  
**Voiceover:** "Based on your profile, our AI recommends these templates. Notice how each recommendation explains why it's perfect for your situation."

**Actions:**
- Show personalized template recommendations
- Highlight the "why" explanations
- Demonstrate template selection process
- Show direct links to recommended templates

### Template Usage (1:45 - 2:30)
**Scene:** Using a selected template  
**Voiceover:** "Let's see a template in action. Here's how you'd use the Sprint Planning Template."

**Actions:**
- Open Sprint Planning Template
- Show the blank template structure
- Switch to completed example
- Highlight key sections and how to fill them out
- Show the before/after comparison

### Resources & Next Steps (2:30 - 2:45)
**Scene:** Additional resources  
**Voiceover:** "Need more help? Check out our getting started guide, methodology selector, and community support. Start your project management journey today!"

**Actions:**
- Show docs/getting-started/
- Highlight community resources
- End with call-to-action: "Star the repo and try the onboarding!"

---

## Screen Recording Setup

### Tool Recommendations (macOS)
1. **Built-in:** QuickTime Player (free)
2. **Advanced:** ScreenFlow ($129) - recommended for professional quality
3. **Free alternative:** OBS Studio (free, open source)

### Recording Settings
- **Resolution:** 1920x1080 (1080p)
- **Frame rate:** 30 fps
- **Audio:** 44.1 kHz, 16-bit
- **Format:** MP4 (H.264)

---

## Pre-Recording Checklist

### Environment Setup
- [ ] Clean desktop/browser
- [ ] Close unnecessary applications
- [ ] Set up terminal with larger font (16pt minimum)
- [ ] Prepare browser bookmarks for quick navigation
- [ ] Test microphone audio levels

### Content Preparation
- [ ] Practice the script timing (aim for 2:30-2:45)
- [ ] Set up example project data for realistic demo
- [ ] Prepare clean repository state
- [ ] Test all interactive features work smoothly

### Technical Setup
- [ ] Install/configure screen recording software
- [ ] Set recording area to capture full screen or specific window
- [ ] Test audio recording quality
- [ ] Prepare editing software (if needed)

---

## Recording Instructions

### Phase 1: Screen Recording
```bash
# Prepare the environment
cd /Users/michael/pm-tools-templates
git status  # Ensure clean state
node ecosystem-gateway.js  # Test onboarding works
```

### Phase 2: Audio Recording
- Record voiceover separately for better quality control
- Use script timing markers
- Speak clearly and at moderate pace
- Include natural pauses for visual actions

### Phase 3: Post-Production
- Sync audio with video
- Add subtle zoom-ins for important UI elements
- Include captions for accessibility
- Add intro/outro graphics (optional)
- Export in multiple formats for web compatibility

---

## Quick Setup Commands

### Install OBS Studio (Free Option)
```bash
# Using Homebrew
brew install --cask obs

# Manual download from: https://obsproject.com/
```

### Install ScreenFlow (Premium Option)
```bash
# Available from Mac App Store or:
# https://www.telestream.net/screenflow/
```

### Alternative: Use Built-in QuickTime
```bash
# Launch QuickTime Player
open -a "QuickTime Player"
# File > New Screen Recording
```

---

## Video Hosting & Embedding

### Recommended Platforms
1. **YouTube** (recommended for GitHub integration)
2. **Vimeo** (professional, customizable player)
3. **GitHub Releases** (direct hosting for small files)

### Embedding Code Template
```html
<!-- Responsive YouTube embed -->
<div class="video-container">
    <iframe 
        src="https://www.youtube.com/embed/VIDEO_ID"
        title="PM Tools Templates Demo"
        frameborder="0"
        allowfullscreen>
    </iframe>
</div>

<style>
.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
```

---

## Success Metrics

After publishing, track:
- **View count** and watch time
- **Click-through rate** to repository
- **Star/fork increases** after video views
- **User feedback** in comments
- **Mobile playback** performance

---

## Next Steps

1. **Practice the script** (run through 2-3 times)
2. **Set up recording environment**
3. **Record in segments** (can edit together)
4. **Review and refine**
5. **Upload and embed**
6. **Gather feedback** and iterate

---

*This script fulfills UX-102 requirements: under 3 minutes, shows template selection and usage, designed for GitHub Pages embedding with mobile responsiveness.*
