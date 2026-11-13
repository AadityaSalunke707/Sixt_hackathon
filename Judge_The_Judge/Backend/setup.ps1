$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pythonLauncher) {
    $pythonExecutable = $pythonLauncher.Source
    & $pythonExecutable -3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)"
    if ($LASTEXITCODE -ne 0) {
        throw "Python 3.11+ is required. Install it, then rerun this script."
    }
    & $pythonExecutable -3 -m venv .venv
} else {
    $pythonExecutable = $null
    $pythonCore = "HKCU:\Software\Python\PythonCore"
    if (Test-Path $pythonCore) {
        $versions = Get-ChildItem $pythonCore | Sort-Object PSChildName -Descending
        foreach ($version in $versions) {
            $installKey = Join-Path $version.PSPath "InstallPath"
            if (-not (Test-Path $installKey)) {
                continue
            }
            $install = Get-ItemProperty $installKey
            $candidate = $install.ExecutablePath
            if (-not $candidate) {
                $candidate = Join-Path $install.'(default)' "python.exe"
            }
            if (Test-Path $candidate) {
                & $candidate -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)"
                if ($LASTEXITCODE -eq 0) {
                    $pythonExecutable = $candidate
                    break
                }
            }
        }
    }
    if (-not $pythonExecutable) {
        throw "Python 3.11+ is not installed. Install Python, then rerun this script."
    }
    & $pythonExecutable -m venv .venv
}
if ($LASTEXITCODE -ne 0) {
    throw "Could not create the virtual environment."
}

$venvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
& $venvPython -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)"
if ($LASTEXITCODE -ne 0) {
    throw "Python 3.11+ is required."
}
& $venvPython -m pip install -r (Join-Path $PSScriptRoot "requirements.txt")
if ($LASTEXITCODE -ne 0) {
    throw "Could not install Project 3 requirements."
}

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $PSScriptRoot ".env.example") $envFile
    Write-Output "Created .env. Set the endpoint, key and required model in your process environment."
}

Push-Location (Join-Path $PSScriptRoot "starter_pack")
try {
    & $venvPython score.py baseline_dev_verdicts.csv dev_pairs.jsonl
    if ($LASTEXITCODE -ne 0) {
        throw "Baseline score check failed."
    }
    & $venvPython -m unittest -v test_final_judge.py
    if ($LASTEXITCODE -ne 0) {
        throw "Offline judge tests failed."
    }
} finally {
    Pop-Location
}

Write-Output "Setup complete. Activate with: .\.venv\Scripts\Activate.ps1"
