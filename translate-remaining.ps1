# Simple script to fix multilingual issues

# Add refs and langs to English pages
Write-Host "Fixing English pages..." -ForegroundColor Cyan
Get-ChildItem -Path "en" -Filter "*.md" | ForEach-Object {
    $file = $_
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    $refName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    
    # Check if the file has frontmatter
    if ($content.StartsWith("---")) {
        # Check if lang is missing
        if (-not ($content -like "*lang: en*")) {
            Write-Host "  Adding lang: en to $($file.Name)" -ForegroundColor Yellow
            # Insert after first --- line
            $lines = $content -split "`n"
            $newLines = @()
            $added = $false
            
            foreach ($line in $lines) {
                $newLines += $line
                # Add after first --- line
                if (-not $added -and $line.Trim() -eq "---") {
                    $newLines += "lang: en"
                    $added = $true
                    $modified = $true
                }
            }
            
            $content = $newLines -join "`n"
        }
        
        # Check if ref is missing
        if (-not ($content -like "*ref: *")) {
            Write-Host "  Adding ref: $refName to $($file.Name)" -ForegroundColor Yellow
            # Insert after first --- line or lang line
            $lines = $content -split "`n"
            $newLines = @()
            $added = $false
            
            foreach ($line in $lines) {
                $newLines += $line
                # Add after lang line or first --- if no lang
                if (-not $added -and ($line.Trim() -eq "lang: en" -or ($line.Trim() -eq "---" -and -not ($content -like "*lang: *")))) {
                    $newLines += "ref: $refName"
                    $added = $true
                    $modified = $true
                }
            }
            
            $content = $newLines -join "`n"
        }
    } else {
        # No frontmatter, add it
        Write-Host "  Adding frontmatter to $($file.Name)" -ForegroundColor Yellow
        $content = "---`nlang: en`nref: $refName`n---`n`n" + $content
        $modified = $true
    }
    
    # Save changes if modified
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
    }
}

# Dutch page translations
$translations = @{
    "index" = "index"
    "about" = "over-mij"
    "mission-vision" = "missie-visie"
    "resume" = "cv"
    "services" = "diensten"
    "work-experience" = "werkervaring"
    "contact" = "contact"
    "blog" = "blog"
    "privacy-policy" = "privacybeleid"
    "cookies" = "cookiebeleid"
    "thank-you" = "bedankt"
}

# Add refs and langs to Dutch pages
Write-Host "`nFixing Dutch pages..." -ForegroundColor Cyan
Get-ChildItem -Path "nl" -Filter "*.md" | ForEach-Object {
    $file = $_
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    
    # Find ref from filename
    $filename = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $refName = $filename
    foreach ($key in $translations.Keys) {
        if ($translations[$key] -eq $filename) {
            $refName = $key
            break
        }
    }
    
    # Check if the file has frontmatter
    if ($content.StartsWith("---")) {
        # Check if lang is missing
        if (-not ($content -like "*lang: nl*")) {
            Write-Host "  Adding lang: nl to $($file.Name)" -ForegroundColor Yellow
            # Insert after first --- line
            $lines = $content -split "`n"
            $newLines = @()
            $added = $false
            
            foreach ($line in $lines) {
                $newLines += $line
                # Add after first --- line
                if (-not $added -and $line.Trim() -eq "---") {
                    $newLines += "lang: nl"
                    $added = $true
                    $modified = $true
                }
            }
            
            $content = $newLines -join "`n"
        }
        
        # Check if ref is missing
        if (-not ($content -like "*ref: *")) {
            Write-Host "  Adding ref: $refName to $($file.Name)" -ForegroundColor Yellow
            # Insert after first --- line or lang line
            $lines = $content -split "`n"
            $newLines = @()
            $added = $false
            
            foreach ($line in $lines) {
                $newLines += $line
                # Add after lang line or first --- if no lang
                if (-not $added -and ($line.Trim() -eq "lang: nl" -or ($line.Trim() -eq "---" -and -not ($content -like "*lang: *")))) {
                    $newLines += "ref: $refName"
                    $added = $true
                    $modified = $true
                }
            }
            
            $content = $newLines -join "`n"
        }
    } else {
        # No frontmatter, add it
        Write-Host "  Adding frontmatter to $($file.Name)" -ForegroundColor Yellow
        $content = "---`nlang: nl`nref: $refName`n---`n`n" + $content
        $modified = $true
    }
    
    # Save changes if modified
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "`nChecking for missing Dutch translations..." -ForegroundColor Cyan
$missingCount = 0

# Get all English pages with their refs
$englishPages = @{}
Get-ChildItem -Path "en" -Filter "*.md" | ForEach-Object {
    $file = $_
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract ref from frontmatter if exists
    $ref = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    if ($content -like "*ref: *") {
        $lines = $content -split "`n"
        foreach ($line in $lines) {
            if ($line -match "ref:\s*(.+)") {
                $ref = $matches[1].Trim()
                break
            }
        }
    }
    
    $englishPages[$ref] = $file.Name
}

# Check if Dutch translations exist
foreach ($ref in $englishPages.Keys) {
    $dutchFilename = if ($translations.ContainsKey($ref)) {
        "$($translations[$ref]).md"
    } else {
        "$ref.md"
    }
    
    if (-not (Test-Path -Path "nl/$dutchFilename")) {
        Write-Host "  Missing Dutch translation for: $($englishPages[$ref]) (ref: $ref)" -ForegroundColor Yellow
        $missingCount++
    }
}

if ($missingCount -eq 0) {
    Write-Host "All English pages have Dutch translations! 🎉" -ForegroundColor Green
} else {
    Write-Host "Missing $missingCount Dutch translations." -ForegroundColor Yellow
    
    # Offer to create templates
    $createTemplates = Read-Host "Do you want to create template files for these translations? (y/n)"
    if ($createTemplates -eq "y") {
        foreach ($ref in $englishPages.Keys) {
            $dutchFilename = if ($translations.ContainsKey($ref)) {
                "$($translations[$ref]).md"
            } else {
                "$ref.md"
            }
            
            if (-not (Test-Path -Path "nl/$dutchFilename")) {
                $englishFile = "en/$($englishPages[$ref])"
                Write-Host "  Creating template for: $dutchFilename" -ForegroundColor Cyan
                
                # Read English content
                $englishContent = Get-Content -Path $englishFile -Raw
                
                # Create modified version for Dutch
                $dutchContent = $englishContent -replace "lang: en", "lang: nl"
                
                # Update permalink if exists
                $lines = $dutchContent -split "`n"
                $newLines = @()
                foreach ($line in $lines) {
                    if ($line -match "permalink:\s*(.+)") {
                        $permalink = $matches[1].Trim()
                        $dutchPath = if ($translations.ContainsKey($ref)) {
                            "/$($translations[$ref])/"
                        } else {
                            "/$ref/"
                        }
                        $newLines += "permalink: $dutchPath"
                    } else {
                        $newLines += $line
                    }
                }
                $dutchContent = $newLines -join "`n"
                
                # Write to file
                Set-Content -Path "nl/$dutchFilename" -Value $dutchContent
            }
        }
        
        Write-Host "`nTemplate files created. Next steps:" -ForegroundColor Cyan
        Write-Host "1. Edit each Dutch file to translate content"
        Write-Host "2. Test your multilingual site"
    }
}

Write-Host "`nScript completed! Your site should now be properly set up for multilingual support." -ForegroundColor Cyan