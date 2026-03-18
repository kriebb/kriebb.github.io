$parentFolder = "C:\git\kriebb.github.io\assets\images\blog"

# Get all directories (folders) inside the parent folder (non-recursive)
$folders = Get-ChildItem -Path $parentFolder -Directory

foreach ($folder in $folders) {
    # Only rename if the folder name has more than 3 characters
    if ($folder.Name.Length -gt 3) {
        # Create the new folder name by removing the first 3 characters
        $newName = $folder.Name.Substring(11)

        # Build the full new path
        $newPath = Join-Path -Path $folder.Parent.FullName -ChildPath $newName

        # Rename the folder
        Rename-Item -Path $folder.FullName -NewName $newName

        Write-Host "Renamed '$($folder.Name)' to '$newName'"
    }
    else {
        Write-Host "Skipping folder '$($folder.Name)' because its name is less than or equal to 3 characters"
    }
}