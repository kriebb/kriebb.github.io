# Debug Multilingual Setup

# List all markdown files and their language/ref configuration
Write-Host "Checking Markdown Files..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "." -Recurse -Include "*.md" | Where-Object { 
    $_.FullName -notlike "*/_site/*" -and 
    $_.FullName -notlike "*/vendor/*" -and 
    $_.Name -ne "README.md" 
}

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract frontmatter details
    $lang = if ($content -match "lang:\s*(\w+)") { $matches[1] } else { "NOT SET" }
    $ref = if ($content -match "ref:\s*(\w+)") { $matches[1] } else { "NOT SET" }
    $permalink = if ($content -match "permalink:\s*[""']?([^""'\r\n]+)[""']?") { $matches[1] } else { "NOT SET" }
    
    Write-Host "`nFile: $($file.Name)" -ForegroundColor White
    Write-Host "  Language: $lang" -ForegroundColor Cyan
    Write-Host "  Ref: $ref" -ForegroundColor Green
    Write-Host "  Permalink: $permalink" -ForegroundColor Yellow
}

# Check language switcher include
Write-Host "`n`nChecking Language Switcher Include..." -ForegroundColor Cyan
if (Test-Path "_includes/language-switcher.html") {
    $switcherContent = Get-Content "_includes/language-switcher.html"
    Write-Host "Language Switcher Content:" -ForegroundColor Green
    Write-Host ($switcherContent | Out-String)
} else {
    Write-Host "Language Switcher Include NOT FOUND!" -ForegroundColor Red
}

# Check config settings
Write-Host "`n`nChecking _config.yml Language Settings..." -ForegroundColor Cyan
$configContent = Get-Content "_config.yml"
$languageSettings = $configContent | Select-String -Pattern "languages:|default_lang:|locale_from_file_extension"
Write-Host ($languageSettings | Out-String)