# Define the URLs of the logos
$logoUrls = @{
    "azure_developer_associate" = "https://learn.microsoft.com/en-us/media/certifications/badges/azure-developer-associate.png"
    "hogent_logo" = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/HoGent_Logo.png/800px-HoGent_Logo.png"
    "certified_scrum_master" = "https://www.scrumalliance.org/ScrumAllianceOrg/media/ScrumAlliance-Media/Certification-Logos/CSM/CSM_Logo_Color.png"
}

# Define the directory to save the logos
$saveDir = "certification_logos"

# Create the directory if it doesn't exist
if (-Not (Test-Path -Path $saveDir)) {
    New-Item -ItemType Directory -Path $saveDir
}

# Function to download and save a logo
function Download-Logo {
    param (
        [string]$url,
        [string]$savePath
    )
    try {
        Invoke-WebRequest -Uri $url -OutFile $savePath
        Write-Output "Downloaded $savePath"
    } catch {
        Write-Output "Failed to download $url"
    }
}

# Download each logo
foreach ($name in $logoUrls.Keys) {
    $url = $logoUrls[$name]
    $savePath = Join-Path -Path $saveDir -ChildPath "$name.png"
    Download-Logo -url $url -savePath $savePath
}
