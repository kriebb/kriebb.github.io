# fix-translation-suffix-based.ps1

# Language mapping for permalinks (if using translated URLs)
$translatedUrls = @{
    "about" = "over-mij"
    "resume" = "cv"
    "services" = "diensten"
    "work-experience" = "werkervaring"
    "privacy-policy" = "privacybeleid"
    "cookies" = "cookiebeleid"
}

# Get all English files
$englishFiles = Get-ChildItem -Path "." -Filter "*.en.md" | Where-Object { $_.Name -match "\.en\.md$" }

Write-Host "Finding missing translations..." -ForegroundColor Cyan

foreach ($file in $englishFiles) {
    # Get base name without language suffix
    $baseName = $file.BaseName -replace "\.en$", ""
    
    # Read the file to extract the ref from front matter
    $content = Get-Content -Path $file.FullName -Raw
    $ref = $null
    
    if ($content -match "ref:\s*(\S+)") {
        $ref = $matches[1].Trim()
    } else {
        # If no ref attribute, use the base name
        $ref = $baseName
    }
    
    # Check if Dutch version exists using the SAME BASE FILENAME
    $dutchFile = "$baseName.nl.md"
    
    if (-not (Test-Path $dutchFile)) {
        Write-Host "Missing Dutch translation: $dutchFile" -ForegroundColor Yellow
        
        # Create template Dutch file
        $dutchContent = $content -replace "lang:\s*en", "lang: nl"
        
        # Fix permalink if needed - use two approaches
        if ($dutchContent -match "permalink:\s*[""']?([^""'\r\n]+)[""']?") {
            $engPath = $matches[1].Trim('/')
            
            # Option 1: Use /nl/ prefix for Dutch pages (recommended)
            $dutchPath = "nl/$engPath"
            
            # Option 2: Use translated slug (alternative)
            # Uncomment the next two lines to use translated slugs instead
            # $dutchSlug = if ($translatedUrls.ContainsKey($ref)) { $translatedUrls[$ref] } else { $engPath }
            # $dutchPath = $dutchSlug
            
            $dutchContent = $dutchContent -replace "permalink:\s*[""']?([^""'\r\n]+)[""']?", "permalink: `"/$dutchPath/`""
        }
        
        # Make sure ref is consistent with the English version
        if (-not ($dutchContent -match "ref:")) {
            $dutchContent = $dutchContent -replace "(lang:\s*nl)", "`$1`r`nref: $ref"
        } else {
            $dutchContent = $dutchContent -replace "ref:\s*\S+", "ref: $ref"
        }
        
        Set-Content -Path $dutchFile -Value $dutchContent
        Write-Host "Created template: $dutchFile" -ForegroundColor Green
    }
}

# Now check for inconsistencies in all files
Write-Host "`nChecking front matter consistency..." -ForegroundColor Cyan

$allMdFiles = Get-ChildItem -Path "." -Recurse -File -Filter "*.md" | 
            Where-Object { $_.FullName -notmatch "_site|node_modules|vendor" -and $_.Name -notmatch "README" }

$langPairs = @{}
$issuesFound = 0

foreach ($file in $allMdFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Skip files without front matter
    if (-not ($content -match "^---\s*\r?\n(.*?)\r?\n---")) {
        continue
    }
    
    $frontMatter = $matches[1]
    $lang = if ($frontMatter -match "lang:\s*(\S+)") { $matches[1].Trim() } else { $null }
    $ref = if ($frontMatter -match "ref:\s*(\S+)") { $matches[1].Trim() } else { $null }
    $permalink = if ($frontMatter -match "permalink:\s*[""']?([^""'\r\n]+)[""']?") { $matches[1].Trim() } else { $null }
    
    # Check expected file naming pattern
    $expectedPattern = if ($lang) { "*.$lang.md" } else { "*.md" }
    if ($lang -and -not ($file.Name -like $expectedPattern)) {
        Write-Host "Warning: File $($file.Name) has lang: $lang but doesn't follow the .$lang.md pattern" -ForegroundColor Yellow
        $issuesFound++
    }
    
    # Track language pairs by ref
    if ($ref) {
        if (-not $langPairs.ContainsKey($ref)) {
            $langPairs[$ref] = @{}
        }
        if ($lang) {
            $langPairs[$ref][$lang] = $file.Name
        }
    }
    
    # Check for missing attributes
    if (-not $lang) {
        Write-Host "Warning: $($file.Name) is missing lang attribute" -ForegroundColor Yellow
        $issuesFound++
    }
    
    if (-not $ref) {
        Write-Host "Warning: $($file.Name) is missing ref attribute" -ForegroundColor Yellow
        $issuesFound++
    }
    
    if (-not $permalink) {
        Write-Host "Warning: $($file.Name) is missing permalink attribute" -ForegroundColor Yellow
        $issuesFound++
    }
}

# Check for incomplete language pairs
Write-Host "`nChecking language pair completeness..." -ForegroundColor Cyan
foreach ($ref in $langPairs.Keys) {
    $langs = $langPairs[$ref]
    
    if (-not $langs.ContainsKey("en")) {
        Write-Host "Missing English version for ref: $ref (Dutch: $($langs['nl']))" -ForegroundColor Yellow
        $issuesFound++
    }
    
    if (-not $langs.ContainsKey("nl")) {
        Write-Host "Missing Dutch version for ref: $ref (English: $($langs['en']))" -ForegroundColor Yellow
        $issuesFound++
    }
}

# Summary
Write-Host "`nSummary:" -ForegroundColor Cyan
if ($issuesFound -eq 0) {
    Write-Host "✅ No issues found! All front matter is consistent." -ForegroundColor Green
} else {
    Write-Host "⚠️ Found $issuesFound issues that need attention." -ForegroundColor Yellow
}

Write-Host "`nTranslation check complete!" -ForegroundColor Cyan