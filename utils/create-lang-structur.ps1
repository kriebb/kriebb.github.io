# PowerShell script to create language-specific folder structure

# Create language directories
New-Item -ItemType Directory -Force -Path "en"
New-Item -ItemType Directory -Force -Path "nl"

# Move/copy existing pages to English folder
Get-ChildItem -Path "." -Filter "*.md" | ForEach-Object {
    $file = $_
    
    # Skip if file already starts with underscores (Jekyll special files)
    if ($file.Name -like "_*" -or $file.Name -eq "README.md" -or $file.Name -eq "LICENSE.md") {
        return
    }
    
    # Skip if the file is in blog folder
    if (Test-Path -Path "blog/$($file.Name)") {
        return
    }
    
    # Create a language-specific copy for English
    $filename = $file.Name
    Copy-Item -Path $file.FullName -Destination "en/$filename"
    
    # Update frontmatter to include language and reference
    $content = Get-Content -Path "en/$filename" -Raw
    $refName = [System.IO.Path]::GetFileNameWithoutExtension($filename)
    
    # Check if the file already has frontmatter
    if ($content -match "^---\s*\r?\n") {
        # File has frontmatter, insert language and ref
        $content = $content -replace "^(---\s*\r?\n)", "`$1lang: en`r`nref: $refName`r`n"
    } else {
        # File doesn't have frontmatter, add it
        $content = "---`r`nlang: en`r`nref: $refName`r`n---`r`n" + $content
    }
    
    Set-Content -Path "en/$filename" -Value $content
}

# Create Dutch placeholders based on English files
Get-ChildItem -Path "en" -Filter "*.md" | ForEach-Object {
    $file = $_
    $refName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    
    # Determine Dutch filename (you might want to translate these)
    $nlFilename = ""
    switch ($refName) {
        "index" { $nlFilename = "index.md" }
        "about" { $nlFilename = "over-mij.md" }
        "contact" { $nlFilename = "contact.md" }
        "mission-vision" { $nlFilename = "missie-visie.md" }
        "resume" { $nlFilename = "cv.md" }
        "services" { $nlFilename = "diensten.md" }
        "work-experience" { $nlFilename = "werkervaring.md" }
        default { $nlFilename = "$refName.md" }
    }
    
    # Copy the English file as a starting point for Dutch
    Copy-Item -Path $file.FullName -Destination "nl/$nlFilename"
    
    # Update frontmatter to Dutch
    $content = Get-Content -Path "nl/$nlFilename" -Raw
    $content = $content -replace "lang: en", "lang: nl"
    Set-Content -Path "nl/$nlFilename" -Value $content
    
    Write-Host "Created $nlFilename from $($file.Name)"
}

Write-Host "Language structure created successfully!"