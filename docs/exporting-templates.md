# Exporting Templates to Office Formats

Many project managers need Word, Excel, or PowerPoint versions of these templates. You can use **Pandoc** to convert Markdown files.

## Install Pandoc

```
# macOS (Homebrew)
brew install pandoc

# Ubuntu/Debian
sudo apt-get install pandoc
```

## Convert to Word

```
pandoc source.md -o output.docx
```

## Convert to Excel

For tables or lists, convert to CSV then open in Excel:

```
pandoc source.md -t csv -o output.csv
```

## Convert to PowerPoint

```
pandoc source.md -t pptx -o slides.pptx
```

You can script these commands to batch convert multiple templates. See `scripts/generate_template_index.js` for a list of template paths.
