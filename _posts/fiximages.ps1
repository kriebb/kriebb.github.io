# Fix-ImagePaths.ps1
# Converts invalid absolute image paths to proper relative paths in markdown files

# Configuration
$rootPath = "C:\git\kriebb.github.io"
$postsDir = Join-Path $rootPath "_posts"

# Regex pattern to match invalid image paths
$pattern = @'
!\[.*?\]\(/c:\\git\\kriebb\.github\.io\\assets\\images\\blog[\\/]\d{4}[\\/]\d{2}[\\/]\d{2}-(\d{4}-\d{2}-\d{2}-[^\\/]+)[\\/]([^)]+)\)
'@

# Replacement pattern with correct relative path
$replacement = '![<ALT>](assets/images/blog/$1/$2)'.Replace('<ALT>','$2')

# Process all markdown files
Get-ChildItem $postsDir -Filter *.md -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Perform replacement with regex
    $updated = $content -replace $pattern, $replacement
    
    if ($updated -ne $content) {
        $updated | Set-Content $_.FullName -Encoding UTF8
        Write-Host "Updated $($_.Name)" -ForegroundColor Green
    }
    else {
        Write-Host "No changes needed for $($_.Name)" -ForegroundColor Gray
    }
}
