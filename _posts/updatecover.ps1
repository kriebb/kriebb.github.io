#---------------------------------------------------------
# Update-CoverPaths.ps1
#  - Adjusts 'cover:' lines in _posts so they point to
#    /assets/images/blog/{slug}/{slug}.cover.jpeg
#---------------------------------------------------------

# CONFIG: adjust if your folders live elsewhere
$gitRoot  = "C:\git\kriebb.github.io"
$postsDir = Join-Path $gitRoot "_posts"

# Regex to match lines like:
#   cover: ./2022-12-25-my-slug.cover.jpeg
$rx = '^(?<indent>\s*cover:\s*)\./(?<slug>\d{4}-\d{2}-\d{2}-[^\s\/\\]+)\.cover\.jpeg\s*$'

Get-ChildItem -Path $postsDir -Filter '*.md' -Recurse | ForEach-Object {
    $mdFile = $_.FullName
    Write-Host "Processing $mdFile" -ForegroundColor Cyan

    $lines    = Get-Content $mdFile
    $modified = $false

    $newLines = $lines | ForEach-Object {
        if ($_ -match $rx) {
            $indent   = $matches['indent']
            $slug     = $matches['slug']
            $filename = "$slug.cover.jpeg"
            # build the new cover path
            $newCover = "$indent/assets/images/blog/$slug/$filename"
            $modified = $true
            Write-Host "  → Replacing cover with: $newCover" -ForegroundColor Green
            $newCover
        }
        else {
            $_
        }
    }

    if ($modified) {
        # overwrite the markdown file
        $newLines | Set-Content -Encoding UTF8 $mdFile
        Write-Host "  ✔ Updated $mdFile" -ForegroundColor Yellow
    }
    else {
        Write-Host "  – No cover line found or no change needed." -ForegroundColor DarkGray
    }
}
