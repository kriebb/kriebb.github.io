# setup-prismjs.ps1
# Script to download and set up Prism.js files for CSHTML/Razor syntax highlighting

# Create directories if they don't exist
$assetsJsPath = "assets/js/prism"
$assetsCssPath = "assets/css/prism"

if (-not (Test-Path $assetsJsPath)) {
    New-Item -ItemType Directory -Path $assetsJsPath -Force
    Write-Host "Created directory: $assetsJsPath"
}

if (-not (Test-Path $assetsCssPath)) {
    New-Item -ItemType Directory -Path $assetsCssPath -Force
    Write-Host "Created directory: $assetsCssPath"
}

# URLs for Prism.js files
$prismJsUrl = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"
$prismCssUrl = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css"

# Additional components to include
$components = @(
    "markup", "clike", "javascript", "csharp", "css", "markup-templating", 
    "aspnet", "razor", "cshtml", "c", "cpp", "json", "yaml", "bash", "powershell"
)

# Download core PrismJS files
Write-Host "Downloading Prism.js core files..."
Invoke-WebRequest -Uri $prismJsUrl -OutFile "$assetsJsPath/prism.min.js"
Invoke-WebRequest -Uri $prismCssUrl -OutFile "$assetsCssPath/prism.min.css"

# Download component files
Write-Host "Downloading Prism.js components..."
foreach ($component in $components) {
    $componentJsUrl = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-$component.min.js"
    $componentFile = "$assetsJsPath/prism-$component.min.js"
    
    try {
        Invoke-WebRequest -Uri $componentJsUrl -OutFile $componentFile
        Write-Host "Downloaded $component component"
    } catch {
        Write-Host "Failed to download $component component: $_"
    }
}

# Create a combined js file
Write-Host "Creating combined prism.bundle.js file..."
$bundleContent = Get-Content "$assetsJsPath/prism.min.js"

foreach ($component in $components) {
    $componentPath = "$assetsJsPath/prism-$component.min.js"
    if (Test-Path $componentPath) {
        $bundleContent += "`n" + (Get-Content $componentPath)
    }
}

$bundleContent | Out-File "$assetsJsPath/prism.bundle.js"
Write-Host "Created prism.bundle.js with all components"

# Create a custom language definition for CSHTML/Razor if needed
$razorDefinitionPath = "$assetsJsPath/prism-razor-custom.js"
$razorDefinition = @"
(function (Prism) {
    // Extend the Razor syntax definition to better highlight ASP.NET Tag Helpers
    Prism.languages.razor = Prism.languages.extend('markup', {
        'razor-comment': {
            pattern: /@\*[\s\S]*?\*@/,
            alias: 'comment'
        },
        'razor-block': {
            pattern: /(@\{)[\s\S]*?(\})/,
            inside: {
                'razor-punctuation': /[@{}]/,
                rest: Prism.languages.csharp
            },
            alias: 'block'
        },
        'razor-directive': {
            pattern: /^@(page|model|using|inherits|inject|implements|namespace|functions|section|addTagHelper)[\s\S]*$/m,
            alias: 'keyword',
            inside: {
                'directive-name': {
                    pattern: /^@\w+/,
                    alias: 'keyword'
                },
                rest: Prism.languages.csharp
            }
        },
        'razor-expression': {
            pattern: /@[^\s{}*]+/,
            alias: 'variable',
            inside: {
                'razor-punctuation': /@/,
                'expression': {
                    pattern: /[\s\S]+/,
                    inside: Prism.languages.csharp
                }
            }
        },
        'tag-helper-attribute': {
            pattern: /\s+(asp-[a-z\-]+)="[^"]*"/i,
            inside: {
                'tag-helper-name': {
                    pattern: /^(asp-[a-z\-]+)/i,
                    alias: 'attr-name tag-helper'
                },
                'punctuation': /=|"|'/,
                'value': {
                    pattern: /[^"'=<>`\s]+/,
                    alias: 'attr-value'
                }
            }
        }
    });

    // Define cshtml as an alias of razor
    Prism.languages.cshtml = Prism.languages.razor;
}(Prism));
"@

$razorDefinition | Out-File $razorDefinitionPath
Write-Host "Created custom Razor language definition"

Write-Host "Prism.js setup complete!"