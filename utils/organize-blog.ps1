param(
    [string]$sourceFolder = "backup-articles",
    [string]$targetPostsFolder = "_posts",
    [string]$targetImagesFolder = "assets/images/blog"
)

# Ensure target folders exist
if (-not (Test-Path $targetPostsFolder)) {
    New-Item -ItemType Directory -Force -Path $targetPostsFolder | Out-Null
    Write-Host "Created target posts folder: $targetPostsFolder" -ForegroundColor Yellow
}

if (-not (Test-Path $targetImagesFolder)) {
    New-Item -ItemType Directory -Force -Path $targetImagesFolder | Out-Null
    Write-Host "Created target images folder: $targetImagesFolder" -ForegroundColor Yellow
}

# Function to sanitize filenames
function Get-SanitizedFilename {
    param([string]$title)
    $cleanTitle = $title -replace '[^\w\s-]', '' -replace '\s+', '-' -replace '-+', '-' -replace '^-|-$', ''
    return $cleanTitle.ToLower()
}

# Debug: Log the parameters
Write-Host "Source Folder: $sourceFolder" -ForegroundColor Yellow
Write-Host "Target Posts Folder: $targetPostsFolder" -ForegroundColor Yellow
Write-Host "Target Images Folder: $targetImagesFolder" -ForegroundColor Yellow

# Process each markdown file in the source folder
$sourceFiles = Get-ChildItem -Path $sourceFolder -Filter "*.md" -Recurse

# Debug: Log the number of files found
Write-Host "Found $($sourceFiles.Count) markdown files in $sourceFolder" -ForegroundColor Cyan

foreach ($sourceFile in $sourceFiles) {
    Write-Host "Processing $($sourceFile.FullName)..." -ForegroundColor Cyan
    
    $content = Get-Content $sourceFile.FullName -Raw -Encoding UTF8
    
    # Extract front matter using simple string operations instead of regex
    $frontMatterStart = $content.IndexOf("---") + 3
    $frontMatterEnd = $content.IndexOf("---", $frontMatterStart)
    
    if ($frontMatterStart -gt 2 -and $frontMatterEnd -gt $frontMatterStart) {
        $frontMatter = $content.Substring($frontMatterStart, $frontMatterEnd - $frontMatterStart)
        
        # Extract date using simple string operations
        $date = $null
        $dateLine = ($frontMatter -split "`n" | Where-Object { $_ -like "date:*" })[0]
        if ($dateLine) {
            $dateMatch = [regex]::Match($dateLine, '(\d{4}-\d{2}-\d{2})')
            if ($dateMatch.Success) {
                $date = $dateMatch.Groups[1].Value
            }
        }
        
        if (-not $date) {
            $date = $sourceFile.CreationTime.ToString("yyyy-MM-dd")
            Write-Host "No date found, using: $date" -ForegroundColor Yellow
        }
        
        # Extract title using simple string operations
        $title = $null
        $titleLine = ($frontMatter -split "`n" | Where-Object { $_ -like "title:*" })[0]
        if ($titleLine) {
            $titleMatch = [regex]::Match($titleLine, 'title:\s*[''"]?(.*?)[''"]?\s*$')
            if ($titleMatch.Success) {
                $title = $titleMatch.Groups[1].Value
            } else {
                $title = $titleLine.Substring($titleLine.IndexOf(":") + 1).Trim()
            }
        }
        
        if (-not $title) {
            $title = $sourceFile.BaseName
            Write-Host "No title found, using: $title" -ForegroundColor Yellow
        }
        
        # Debug: Log extracted date and title
        Write-Host "Extracted Date: $date" -ForegroundColor Green
        Write-Host "Extracted Title: $title" -ForegroundColor Green

        # Create clean title for filename
        $cleanTitle = Get-SanitizedFilename -title $title
        
        # Extract year, month, and day for folder structure
        $year = $date.Substring(0, 4)
        $month = $date.Substring(5, 2)
        $day = $date.Substring(8, 2)
        
        # Create target filename and folder structure
        $newFilename = "$date-$cleanTitle.md"
        $targetPostPath = Join-Path -Path $targetPostsFolder -ChildPath $newFilename
        $imageTargetDir = Join-Path -Path $targetImagesFolder -ChildPath "$year/$month/$day-$cleanTitle"
        
        # Debug: Log target paths
        Write-Host "Target Post Path: $targetPostPath" -ForegroundColor Green
        Write-Host "Image Target Directory: $imageTargetDir" -ForegroundColor Green

        New-Item -ItemType Directory -Force -Path $imageTargetDir | Out-Null
        
        # Process image references
        $processedContent = $content
        
        # Extract all image references with pattern: ![alt text](image path)
        $matches = [regex]::Matches($content, '!\[(.*?)\]\((.*?)\)')
        foreach ($match in $matches) {
            $originalImageMd = $match.Value
            $altText = $match.Groups[1].Value
            $imagePath = $match.Groups[2].Value
            
            # Skip external images
            if ($imagePath -match '^https?://') {
                Write-Host "Skipping external image: $imagePath" -ForegroundColor Yellow
                continue
            }
            
            # Extract image filename
            $imageFilename = Split-Path -Leaf $imagePath
            
            # Copy the image to the new location
            $sourceImagePath = Join-Path -Path $sourceFile.DirectoryName -ChildPath $imagePath
            $targetImagePath = Join-Path -Path $imageTargetDir -ChildPath $imageFilename
            if (Test-Path $sourceImagePath) {
                Write-Host "Copying image: $sourceImagePath to $targetImagePath" -ForegroundColor Green
                Copy-Item -Path $sourceImagePath -Destination $targetImagePath -Force
            } else {
                Write-Warning "Image not found: $sourceImagePath"
            }
            
            # Create the new image markdown and replace in content
            $newImageMd = "![$altText](/$targetImagesFolder/$year/$month/$day-$cleanTitle/$imageFilename)"
            $processedContent = $processedContent.Replace($originalImageMd, $newImageMd)
        }
        
        # Save the processed content
        try {
            Write-Host "Saving processed content to $targetPostPath" -ForegroundColor Green
            $processedContent | Out-File -FilePath $targetPostPath -Encoding UTF8
            Write-Host "? Post saved to $targetPostPath" -ForegroundColor Green
        } catch {
            Write-Error "Failed to save file: $_"
        }
    } else {
        Write-Warning "No front matter found in $($sourceFile.Name), skipping..."
    }
}

Write-Host "`nOrganization complete!" -ForegroundColor Green
Write-Host "Posts and images have been organized into the proper structure." -ForegroundColor Green