# Define target folders
$vendorFolder = "vendor"
$cssFolder = "$vendorFolder\css"
$jsFolder = "$vendorFolder\js"
$fontsFolder = "$vendorFolder\fonts"

# Create folders if they don't exist
New-Item -ItemType Directory -Force -Path $cssFolder
New-Item -ItemType Directory -Force -Path $jsFolder
New-Item -ItemType Directory -Force -Path $fontsFolder

# Define files to download
$files = @{
    "https://unpkg.com/swiper@9.2.4/swiper-bundle.min.css" = "$cssFolder\swiper-bundle.min.css"
    "https://unpkg.com/aos@3.0.0-beta.6/dist/aos.css" = "$cssFolder\aos.css"
    "https://unpkg.com/swiper@9.2.4/swiper-bundle.min.js" = "$jsFolder\swiper-bundle.min.js"
    "https://unpkg.com/aos@3.0.0-beta.6/dist/aos.js" = "$jsFolder\aos.js"
}

# Download each file
foreach ($url in $files.Keys) {
    $outputFile = $files[$url]
    Write-Host "Downloading $url to $outputFile"
    Invoke-WebRequest -Uri $url -OutFile $outputFile
}

Write-Host "✅ Alle bestanden zijn lokaal opgeslagen in de vendor-map!"

# Download Google Fonts as woff2 (use Google Webfonts Helper for correct URLs)
$googleFonts = @(
    "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf",
    "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlf.ttf"
)

foreach ($fontUrl in $googleFonts) {
    $fontFile = Split-Path -Leaf $fontUrl
    $outputFont = "$fontsFolder\$fontFile"
    Write-Host "Downloading $fontUrl to $outputFont"
    Invoke-WebRequest -Uri $fontUrl -OutFile $outputFont
}

Write-Host "✅ Google Fonts opgeslagen als .woff2 bestanden!"
