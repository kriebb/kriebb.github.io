# generate-cover-images.ps1
#
# This script:
# 1. Analyzes post titles and tags
# 2. Finds suitable images or creates them
# 3. Creates properly sized cover images for each post

param(
    [string]$postsDirectory = "./_posts",
    [string]$imageBaseDirectory = "./assets/images/blog",
    [string]$templateImagesDirectory = "./assets/templates",
    [int]$width = 1200,
    [int]$height = 630
)

# Function to extract info from a blog post
function Get-PostInfo {
    param([string]$filePath)
    
    $content = Get-Content -Path $filePath -Raw
    $postInfo = @{
        Title = $null
        Tags = @()
        Date = $null
        Slug = $null
        HasCover = $false
        CoverPath = $null
    }
    
    # Get filename details
    $filename = [System.IO.Path]::GetFileName($filePath)
    if ($filename -match "^(\d{4}-\d{2}-\d{2})-(.+)\.md$") {
        $postInfo.Date = $matches[1]
        $postInfo.Slug = $matches[2]
    }
    
    # Extract frontmatter
    if ($content -match "---\s*\n([\s\S]*?)\n---") {
        $frontMatter = $matches[1]
        
        # Extract title
        if ($frontMatter -match "title:\s*[""']?(.*?)[""']?(\r?\n|\$)") {
            $postInfo.Title = $matches[1].Trim()
        }
        
        # Extract tags
        if ($frontMatter -match "tags:\s*\[(.*?)\]" -or $frontMatter -match "tags:\s*\n([\s\S]*?)(\n\w|$)") {
            $tagsString = $matches[1]
            $postInfo.Tags = $tagsString -split ',|\n' | ForEach-Object { $_.Trim(" -'""") } | Where-Object { $_ }
        }
        
        # Check if cover exists
        if ($frontMatter -match "cover:\s*(.+)") {
            $postInfo.HasCover = $true
            $postInfo.CoverPath = $matches[1].Trim()
        }
    }
    
    return $postInfo
}

# Function to get theme colors based on tags
function Get-ThemeColors {
    param([string[]]$tags)
    
    # Default theme
    $theme = @{
        Primary = "#004c8c"  # Blue
        Secondary = "#00b386"  # Green
        Background = "#f5f5f5"  # Light gray
    }
    
    # Define tag-based themes
    $tagThemes = @{
        "security" = @{ Primary = "#b32100"; Secondary = "#ff7b57"; Background = "#fff5f2" }  # Red theme
        "dotnet" = @{ Primary = "#5c2d91"; Secondary = "#68217a"; Background = "#f5f2ff" }  # Purple theme
        "azure" = @{ Primary = "#0072c6"; Secondary = "#00abec"; Background = "#f0f8ff" }  # Azure blue theme
        "career" = @{ Primary = "#107c10"; Secondary = "#2d7d9a"; Background = "#f2fff2" }  # Green theme
        "consulting" = @{ Primary = "#004c8c"; Secondary = "#0077d4"; Background = "#f0f7ff" }  # Blue theme
    }
    
    # Check if any tags match our theme keywords
    foreach ($tag in $tags) {
        $lowerTag = $tag.ToLower()
        
        foreach ($key in $tagThemes.Keys) {
            if ($lowerTag -match $key) {
                return $tagThemes[$key]
            }
        }
    }
    
    # Return default theme if no matches
    return $theme
}

# Function to get an icon based on tags
function Get-TagIcon {
    param([string[]]$tags)
    
    $tagIcons = @{
        "security" = "shield-alt"
        "privacy" = "user-shield"
        "dotnet" = "code"
        "azure" = "cloud"
        "certification" = "certificate"
        "career" = "briefcase"
        "personal" = "user"
        "oauth" = "key"
        "branching" = "code-branch"
        "consultancy" = "handshake"
        "password" = "key"
        "auth" = "lock"
        "json" = "file-code"
        "email" = "envelope"
        "configuration" = "cogs"
        "httpclient" = "exchange-alt"
        "token" = "id-badge"
        "devops" = "server"
        "error" = "exclamation-triangle"
    }
    
    foreach ($tag in $tags) {
        $lowerTag = $tag.ToLower()
        
        foreach ($key in $tagIcons.Keys) {
            if ($lowerTag -match $key) {
                return $tagIcons[$key]
            }
        }
    }
    
    # Default icon
    return "newspaper"
}

Write-Host "Checking for posts without cover images..." -ForegroundColor Cyan

$postsWithoutCovers = @()

# Check all posts
Get-ChildItem -Path $postsDirectory -Filter "*.md" | ForEach-Object {
    $postFile = $_
    $postInfo = Get-PostInfo -filePath $postFile.FullName
    
    # Skip if the post already has a cover image
    if ($postInfo.HasCover -and (Test-Path (Join-Path -Path "." -ChildPath $postInfo.CoverPath.TrimStart('/')))) {
        return
    }
    
    # Add to the list if no cover image
    $postsWithoutCovers += @{
        File = $postFile
        Info = $postInfo
    }
}

Write-Host "Found $($postsWithoutCovers.Count) posts without proper covers" -ForegroundColor Yellow

# Check if we have any template images
if (-not (Test-Path $templateImagesDirectory)) {
    Write-Host "Template images directory not found. Creating..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $templateImagesDirectory | Out-Null
    
    # Note that we'd ideally download some template images here
    # For this example, we'll just indicate they need to be added manually
    Write-Host "Please add template background images to $templateImagesDirectory" -ForegroundColor Red
}

# Process each post without a cover
foreach ($post in $postsWithoutCovers) {
    $postInfo = $post.Info
    $postFile = $post.File
    
    Write-Host "Processing cover for: $($postFile.Name)" -ForegroundColor Cyan
    
    # Determine where to save the cover image
    $postSlug = $postInfo.Slug
    $targetDir = Join-Path -Path $imageBaseDirectory -ChildPath "$postSlug"
    
    # Create directory if it doesn't exist
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    }
    
    $coverFilename = "$($postInfo.Date)-$postSlug.cover.jpeg"
    $coverPath = Join-Path -Path $targetDir -ChildPath $coverFilename
    $coverRelativePath = "/assets/images/blog/$postSlug/$coverFilename"
    
    # Check if we already have a cover for this post
    if (Test-Path $coverPath) {
        Write-Host "Cover already exists at $coverPath" -ForegroundColor Green
    } else {
        Write-Host "Cover does not exist. Would need to generate one." -ForegroundColor Yellow
        
        # Here we would call a service to generate a cover image
        # For this example, we'll just note where it would go
        Write-Host "  Would generate cover at: $coverPath" -ForegroundColor Yellow
        
        # Note: In a real implementation, you would:
        # 1. Use an HTML canvas with JavaScript to generate images
        # 2. Use a PowerShell module like New-HtmlToImage
        # 3. Use an external API like Unsplash and overlay text
        
        # For the sake of this example, we'll create a text file with instructions
        $instructionsPath = Join-Path -Path $targetDir -ChildPath "cover-instructions.txt"
        $theme = Get-ThemeColors -tags $postInfo.Tags
        $icon = Get-TagIcon -tags $postInfo.Tags
        
        $instructions = @"
Cover Image Instructions for: $($postInfo.Title)
=========================================

1. Create an image with dimensions: ${width}x${height}px
2. Use these theme colors:
   - Primary: $($theme.Primary)
   - Secondary: $($theme.Secondary)
   - Background: $($theme.Background)
3. Include this title text: $($postInfo.Title)
4. Suggested icon: $icon
5. Tags: $($postInfo.Tags -join ', ')

Save the final image as: $coverFilename
"@
        
        Set-Content -Path $instructionsPath -Value $instructions
        Write-Host "  Created instructions file at: $instructionsPath" -ForegroundColor Green
    }
    
    # Update frontmatter with cover path
    $content = Get-Content -Path $postFile.FullName -Raw
    
    if (-not $postInfo.HasCover) {
        Write-Host "Updating frontmatter with cover path: $coverRelativePath" -ForegroundColor Green
        
        # Find where to insert the cover
        if ($content -match "---\s*\n([\s\S]*?)\n---") {
            $frontMatter = $matches[1]
            $updatedFrontMatter = $frontMatter.TrimEnd() + "`ncover: $coverRelativePath`n"
            $updatedContent = $content.Replace($frontMatter, $updatedFrontMatter)
            
            Set-Content -Path $postFile.FullName -Value $updatedContent -NoNewline
        }
    }
}

Write-Host "`nCover image processing complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create the actual cover images based on the instructions files" -ForegroundColor Cyan
Write-Host "2. Run 'bundle exec jekyll serve' to see your updated blog" -ForegroundColor Cyan