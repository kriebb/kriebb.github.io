# PowerShell script to test multilingual setup

# Function to check if a file exists and has multilingual frontmatter
function Test-MultilingualPage {
    param (
        [string]$FilePath,
        [string]$Lang,
        [string]$ExpectedRef
    )
    
    $exists = Test-Path -Path $FilePath
    if (-not $exists) {
        Write-Host "❌ File not found: $FilePath" -ForegroundColor Red
        return $false
    }
    
    $content = Get-Content -Path $FilePath -Raw
    $hasLang = $content -match "lang:\s*$Lang"
    $hasRef = $content -match "ref:\s*$ExpectedRef"
    
    if (-not $hasLang) {
        Write-Host "❌ Missing language ($Lang) in frontmatter: $FilePath" -ForegroundColor Red
        return $false
    }
    
    if (-not $hasRef) {
        Write-Host "❌ Missing or incorrect ref ($ExpectedRef) in frontmatter: $FilePath" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Valid multilingual page: $FilePath" -ForegroundColor Green
    return $true
}

# Function to check corresponding pages in both languages
function Test-LanguagePair {
    param (
        [string]$EnPage,
        [string]$NlPage,
        [string]$Ref
    )
    
    $enSuccess = Test-MultilingualPage -FilePath $EnPage -Lang "en" -ExpectedRef $Ref
    $nlSuccess = Test-MultilingualPage -FilePath $NlPage -Lang "nl" -ExpectedRef $Ref
    
    if ($enSuccess -and $nlSuccess) {
        Write-Host "✅ Language pair complete for: $Ref" -ForegroundColor Green
    } else {
        Write-Host "❌ Incomplete language pair for: $Ref" -ForegroundColor Yellow
    }
}

# Test essential pages
Write-Host "Testing critical pages..." -ForegroundColor Cyan
Test-LanguagePair -EnPage "en/index.md" -NlPage "nl/index.md" -Ref "index"
Test-LanguagePair -EnPage "en/about.md" -NlPage "nl/over-mij.md" -Ref "about"
Test-LanguagePair -EnPage "en/contact.md" -NlPage "nl/contact.md" -Ref "contact"
Test-LanguagePair -EnPage "en/privacy-policy.md" -NlPage "nl/privacybeleid.md" -Ref "privacy-policy"
Test-LanguagePair -EnPage "en/cookies.md" -NlPage "nl/cookiebeleid.md" -Ref "cookies"

# Check all English pages have Dutch counterparts
Write-Host "`nChecking for missing translations..." -ForegroundColor Cyan
$missingTranslations = 0

Get-ChildItem -Path "en" -Filter "*.md" | ForEach-Object {
    $file = $_
    $content = Get-Content -Path $file.FullName -Raw
    if ($content -match "ref:\s*(.+)(\r?\n|\$)") {
        $ref = $matches[1].Trim()
        
        # Check if a Dutch page with this ref exists
        $dutchPageExists = $false
        Get-ChildItem -Path "nl" -Filter "*.md" | ForEach-Object {
            $dutchFile = $_
            $dutchContent = Get-Content -Path $dutchFile.FullName -Raw
            if ($dutchContent -match "ref:\s*$ref(\r?\n|\$)") {
                $dutchPageExists = $true
            }
        }
        
        if (-not $dutchPageExists) {
            Write-Host "❌ Missing Dutch translation for: $($file.Name) (ref: $ref)" -ForegroundColor Red
            $missingTranslations++
        }
    } else {
        Write-Host "⚠️ Missing ref in English page: $($file.Name)" -ForegroundColor Yellow
    }
}

# Check for required files and directories
Write-Host "`nChecking required components..." -ForegroundColor Cyan
$requiredFiles = @(
    "_data/i18n/en.yml",
    "_data/i18n/nl.yml",
    "_includes/language-switcher.html",
    "_includes/cookie-consent.html",
    "_includes/seo-meta.html",
    "_layouts/redirect.html"
)

foreach ($file in $requiredFiles) {
    if (Test-Path -Path $file) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n---------- Summary ----------" -ForegroundColor Cyan
if ($missingTranslations -gt 0) {
    Write-Host "Missing $missingTranslations Dutch translations" -ForegroundColor Yellow
} else {
    Write-Host "All English pages have Dutch translations" -ForegroundColor Green
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Run 'bundle exec jekyll serve' to test locally"
Write-Host "2. Check language switching functionality on all pages"
Write-Host "3. Verify GDPR compliance elements (cookie banner, privacy pages)"
Write-Host "4. Test contact form with hCaptcha"