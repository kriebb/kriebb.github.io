# Define source and destination roots
$sourceRoot = "C:\git\kriebb.github.io\old"
$destRoot   = "C:\git\kriebb.github.io\assets\images\blog"

# Find all .cover.jpeg files under the source root
Get-ChildItem -Path $sourceRoot -Filter '*.cover.jpeg' -File -Recurse |
ForEach-Object {
    # $_.FullName is like:
    # C:\git\kriebb.github.io\old\2023\01\15\2023-01-15-slug\2023-01-15-slug.cover.jpeg

    # Remove the source-root and the first three path segments (yyyy\mm\dd\)
    $relative = $_.FullName.Substring($sourceRoot.Length + 1) `
                 -replace '^\d{4}\\\d{2}\\\d{2}\\',''
    # $relative is now: 2023-01-15-slug\2023-01-15-slug.cover.jpeg

    # Build the target directory and file path
    $targetDir  = Join-Path $destRoot (Split-Path $relative -Parent)
    $targetFile = Join-Path $targetDir  $_.Name

    # Create the directory if it doesn't exist
    if (-not (Test-Path $targetDir)) {
        New-Item -Path $targetDir -ItemType Directory | Out-Null
    }

    # Copy the file into place
    Copy-Item -Path $_.FullName -Destination $targetFile -Force
}
