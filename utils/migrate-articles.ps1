param(
    [string]$sourceFolder = "backup-articles",
    [string]$targetFolder = "_posts",
    [string]$imageSourceFolder = "backup-articles/images",
    [string]$imageTargetFolder = "assets/images/blog"
)

# Initialize missing images array
$script:missingImages = @()

# Create target directories if they don't exist
New-Item -ItemType Directory -Force -Path $targetFolder
New-Item -ItemType Directory -Force -Path $imageTargetFolder

# Function to sanitize filenames
function Get-SanitizedFilename {
    param([string]$title)
    
    # Remove special characters and replace spaces with hyphens
    $cleanTitle = $title -replace '[^\w\s-]', '' -replace '\s+', '-' -replace '-+', '-' -replace '^-|-$', ''
    return $cleanTitle.ToLower()
}

# Function to extract date from frontmatter
function Get-FrontmatterDate {
    param([string]$content)
    
    if ($content -match "date:\s*([\d]{4}-[\d]{2}-[\d]{2})") {
        return $matches[1]
    }
    return $null
}

# Function to extract title from frontmatter
function Get-FrontmatterTitle {
    param([string]$content)
    
    if ($content -match "title:\s*[""'](.*?)[""']" -or $content -match "title:\s*(.+?)(\r?\n)") {
        return $matches[1].Trim()
    }
    return $null
}

# Process each markdown file in the source folder
$sourceFiles = Get-ChildItem -Path $sourceFolder -Filter "*.md" -Recurse 

foreach ($sourceFile in $sourceFiles) {
    Write-Host "Processing $($sourceFile.Name)..." -ForegroundColor Cyan
    
    $content = Get-Content $sourceFile.FullName -Raw -Encoding UTF8
    
    # Extract front matter
    if ($content -match "---\s*\n([\s\S]*?)\n---") {
        $frontMatter = $matches[1]
        
        # Extract date and title
        $date = Get-FrontmatterDate -content $frontMatter
        $title = Get-FrontmatterTitle -content $frontMatter
        
        if (-not $date) {
            Write-Warning "No date found in $($sourceFile.Name), using file creation date"
            $date = $sourceFile.CreationTime.ToString("yyyy-MM-dd")
        }
        
        if (-not $title) {
            Write-Warning "No title found in $($sourceFile.Name), using filename"
            $title = $sourceFile.BaseName
        }
        
        # Create clean title for filename
        $cleanTitle = Get-SanitizedFilename -title $title
        
        # Extract year and month for folder structure
        $year = $date.Substring(0, 4)
        $month = $date.Substring(5, 2)
        
        # Create year/month directories
        $yearMonthFolder = Join-Path -Path $targetFolder -ChildPath "$year/$month"
        New-Item -ItemType Directory -Force -Path $yearMonthFolder | Out-Null
        
        # Create target filename
        $newFilename = "$date-$cleanTitle.md"
        $targetPath = Join-Path -Path $yearMonthFolder -ChildPath $newFilename
        
        # Process image references
        $imagePattern = '!\[([^\]]*)\]\(([^)]+)\)'
        $processedContent = $content -replace $imagePattern, {
            param($match)
            $altText = $match.Groups[1].Value
            $imagePath = $match.Groups[2].Value
            
            # Skip external images (starting with http)
            if ($imagePath -match '^https?://') {
                return "![$altText]($imagePath)"
            }
            
            # Extract image filename
            $imageFilename = Split-Path -Leaf $imagePath
            
            # Create new directory structure for images
            $imageTargetDir = Join-Path -Path $imageTargetFolder -ChildPath "$year/$month/$cleanTitle"
            New-Item -ItemType Directory -Force -Path $imageTargetDir | Out-Null
            
            # Create new image path
            $newImagePath = "/assets/images/blog/$year/$month/$cleanTitle/$imageFilename"
            
            # Find and copy the image
            $foundImage = $false
            
            # Try different possible source locations
            $possibleSourcePaths = @(
                # Direct path as referenced
                $imagePath,
                # Join with source folder
                (Join-Path -Path $sourceFolder -ChildPath $imagePath),
                # Join with image source folder
                (Join-Path -Path $imageSourceFolder -ChildPath $imageFilename),
                # Look for file in image folder with same name
                (Join-Path -Path $imageSourceFolder -ChildPath $imageFilename)
            )
            
            foreach ($sourcePath in $possibleSourcePaths) {
                if (Test-Path $sourcePath) {
                    $targetImagePath = Join-Path -Path $imageTargetDir -ChildPath $imageFilename
                    Copy-Item -Path $sourcePath -Destination $targetImagePath -Force
                    $foundImage = $true
                    break
                }
            }
            
            if (-not $foundImage) {
                Write-Warning "Could not find image: $imagePath for post $newFilename"
                # Add this to a list of missing images to report later
                $script:missingImages += @{
                    Post  = $newFilename
                    Image = $imagePath
                }
            }
            
            # Return the updated image markdown
            return "![$altText]($newImagePath)"
        }
        
        # Save the processed content
        $processedContent | Out-File -FilePath $targetPath -Encoding UTF8
        
        Write-Host "   Saved to $targetPath" -ForegroundColor Green
    }
    else {
        Write-Warning "No front matter found in $($sourceFile.Name), skipping..."
    }
}

Write-Host "`nMigration complete!" -ForegroundColor Green
Write-Host "Posts have been organized into year/month folders with meaningful names."

# If there were missing images, report them
if ($script:missingImages.Count -gt 0) {
    Write-Host -ForegroundColor Yellow "`nThe following images could not be found and need attention:" 
    foreach ($item in $script:missingImages) {
        Write-Host -ForegroundColor Yellow "  - Post: $($item.Post), Missing image: $($item.Image)"
    }
}