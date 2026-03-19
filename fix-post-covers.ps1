# fix-post-covers.ps1
#
# This script:
# 1. Ensures each blog post has a cover image path in frontmatter
# 2. Creates any missing blog post image directories
# 3. Creates or copies a default cover image for posts without one
# 4. Updates the post frontmatter to point to the correct image path

param(
    [string]$postsDirectory = "./_posts",
    [string]$imageBaseDirectory = "./assets/images/blog",
    [string]$defaultCoverImage = "./assets/images/blog/default-cover.jpg"
)

# Create the base image directory if it doesn't exist
if (-not (Test-Path $imageBaseDirectory)) {
    Write-Host "Creating base image directory: $imageBaseDirectory" -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $imageBaseDirectory | Out-Null
}

# Ensure we have a default cover image to use
if (-not (Test-Path $defaultCoverImage)) {
    Write-Host "Default cover image not found, creating a simple placeholder..." -ForegroundColor Yellow
    # We'd download a default image here, but for simplicity we'll just note it's missing
    Write-Host "Please manually place a default cover image at $defaultCoverImage" -ForegroundColor Red
}

# Function to extract date and slug from filename
function Get-PostInfo {
    param([string]$filename)
    
    if ($filename -match "^(\d{4}-\d{2}-\d{2})-(.+)\.md$") {
        return @{
            Date = $matches[1]
            Slug = $matches[2]
        }
    }
    
    return $null
}

# Function to sanitize directory names
function Get-SanitizedDirname {
    param([string]$path)
    
    # Remove special characters that might cause issues in paths
    return $path -replace '[<>:"/\\|?*]', ''
}

# Process each blog post
Get-ChildItem -Path $postsDirectory -Filter "*.md" | ForEach-Object {
    $postFile = $_
    $postInfo = Get-PostInfo -filename $postFile.Name
    
    if ($null -eq $postInfo) {
        Write-Host "Skipping file with invalid naming: $($postFile.Name)" -ForegroundColor Yellow
        continue
    }
    
    $content = Get-Content -Path $postFile.FullName -Raw
    $hasUpdates = $false
    
    # Check if the post already has a cover image in frontmatter
    $hasCover = $content -match "cover:\s*(.+)"
    $currentCoverPath = if ($hasCover) { $matches[1].Trim() } else { $null }
    
    # Define where the cover should be stored
    $yearMonth = $postInfo.Date.Substring(0, 7) # YYYY-MM
    $year = $postInfo.Date.Substring(0, 4)
    $month = $postInfo.Date.Substring(5, 2)
    $day = $postInfo.Date.Substring(8, 2)
    $sanitizedSlug = Get-SanitizedDirname -path $postInfo.Slug
    
    $targetDir = Join-Path -Path $imageBaseDirectory -ChildPath "$sanitizedSlug"
    $targetCoverPath = Join-Path -Path $targetDir -ChildPath "$($postInfo.Date)-$sanitizedSlug.cover.jpeg"
    $coverRelativePath = "/assets/images/blog/$sanitizedSlug/$($postInfo.Date)-$sanitizedSlug.cover.jpeg"
    
    # Create the post's image directory if it doesn't exist
    if (-not (Test-Path $targetDir)) {
        Write-Host "Creating image directory for $($postFile.Name): $targetDir" -ForegroundColor Cyan
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    }
    
    # Check if the cover image exists
    $coverExists = Test-Path $targetCoverPath
    
    # If no cover exists but we have a default, copy it
    if (-not $coverExists -and (Test-Path $defaultCoverImage)) {
        Write-Host "Copying default cover for $($postFile.Name)" -ForegroundColor Cyan
        Copy-Item -Path $defaultCoverImage -Destination $targetCoverPath -Force
        $coverExists = $true
    }
    
    # Update the frontmatter if needed
    if (-not $hasCover -and $coverExists) {
        Write-Host "Adding cover path to $($postFile.Name)" -ForegroundColor Green
        
        # Find where to insert the cover
        if ($content -match "---\s*\n([\s\S]*?)\n---") {
            $frontMatter = $matches[1]
            $updatedFrontMatter = $frontMatter.TrimEnd() + "`ncover: $coverRelativePath`n"
            $content = $content.Replace($frontMatter, $updatedFrontMatter)
            $hasUpdates = $true
        }
    } elseif ($hasCover -and $currentCoverPath -ne $coverRelativePath -and $coverExists) {
        Write-Host "Updating cover path in $($postFile.Name)" -ForegroundColor Green
        $content = $content -replace "cover:\s*(.+)", "cover: $coverRelativePath"
        $hasUpdates = $true
    }
    
    # Save the updated content
    if ($hasUpdates) {
        Set-Content -Path $postFile.FullName -Value $content -NoNewline
        Write-Host "Updated $($postFile.Name) with correct cover path" -ForegroundColor Green
    }
}

Write-Host "Cover image processing complete!" -ForegroundColor Green
Write-Host "Now run 'bundle exec jekyll serve' to see your updated blog" -ForegroundColor Cyan