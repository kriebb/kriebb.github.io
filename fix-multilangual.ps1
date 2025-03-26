# PowerShell script to fix multilingual structure issues

# 1. Fix the Dutch index.md file
$nlIndexPath = "nl/index.md"
if (Test-Path $nlIndexPath) {
    $content = Get-Content -Path $nlIndexPath -Raw
    
    # Fix the language tag
    $content = $content -replace "lang: en", "lang: nl"
    
    # Write the corrected content back
    Set-Content -Path $nlIndexPath -Value $content
    
    Write-Host "✅ Fixed language tag in $nlIndexPath" -ForegroundColor Green
} else {
    Write-Host "❌ Dutch index file not found at $nlIndexPath" -ForegroundColor Red
}

# 2. Check all Dutch files for correct language tags
Get-ChildItem -Path "nl" -Filter "*.md" | ForEach-Object {
    $file = $_
    $content = Get-Content -Path $file.FullName -Raw
    
    if ($content -match "lang: en") {
        $content = $content -replace "lang: en", "lang: nl"
        Set-Content -Path $file.FullName -Value $content
        Write-Host "✅ Fixed language tag in $($file.FullName)" -ForegroundColor Green
    }
}

# 3. Check all Dutch files for correct permalinks
$dutchPages = @{
    "about" = "over-mij"
    "resume" = "cv"
    "services" = "diensten"
    "work-experience" = "werkervaring"
    "mission-vision" = "missie-visie"
    "privacy-policy" = "privacybeleid"
    "cookies" = "cookiebeleid"
    "thank-you" = "bedankt"
}

foreach ($englishRef in $dutchPages.Keys) {
    $dutchRef = $dutchPages[$englishRef]
    $filePath = "nl/$dutchRef.md"
    
    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw
        
        # Fix permalink if it's pointing to the English version
        if ($content -match "permalink: /$englishRef/") {
            $content = $content -replace "permalink: /$englishRef/", "permalink: /$dutchRef/"
            Set-Content -Path $filePath -Value $content
            Write-Host "✅ Fixed permalink in $filePath" -ForegroundColor Green
        }
    }
}

# 4. Verify all files have correct ref attributes
Get-ChildItem -Path "en", "nl" -Filter "*.md" | ForEach-Object {
    $file = $_
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract the basename without extension
    $filename = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    
    # Determine the correct ref
    $ref = $filename
    foreach ($englishRef in $dutchPages.Keys) {
        $dutchRef = $dutchPages[$englishRef]
        if ($file.Directory.Name -eq "nl" -and $filename -eq $dutchRef) {
            $ref = $englishRef
            break
        }
    }
    
    # Check if file has the ref attribute
    if (-not ($content -match "ref: $ref")) {
        # Extract the frontmatter
        if ($content -match "---\r?\n([\s\S]*?)\r?\n---") {
            $frontMatter = $matches[1]
            
            # Insert ref after first occurrence of lang:
            if ($frontMatter -match "lang:") {
                $updatedFrontMatter = $frontMatter -replace "(lang:.+?)(\r?\n)", "`$1`$2ref: $ref`$2"
                $content = $content -replace "---\r?\n([\s\S]*?)\r?\n---", "---`r`n$updatedFrontMatter`r`n---"
                Set-Content -Path $file.FullName -Value $content
                Write-Host "✅ Added ref: $ref to $($file.FullName)" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`nMultilingual structure fix completed!" -ForegroundColor Cyan