param([Parameter(Mandatory=$true)][ValidatePattern('^[A-Za-z0-9_.-]+$')][string]$Owner)
$ErrorActionPreference='Stop'
$RepoName='flop-conformance-lab'
$Tag='v0.1.0-alpha'
$Description='Cross-system interoperability and protocol-drift testing for FLOP, TCLK, Technocore and FLOP routing implementations.'
$Expected="https://github.com/$Owner/$RepoName.git"
if(-not(Get-Command gh -ErrorAction SilentlyContinue)){throw 'DESKTOP_INTERACTIVE_AUTH_REQUIRED: GitHub CLI is not installed.'}
gh auth status 1>$null 2>$null
if($LASTEXITCODE-ne 0){throw 'DESKTOP_INTERACTIVE_AUTH_REQUIRED: GitHub CLI is not authenticated.'}
if((git branch --show-current)-ne'main'){throw 'Release must run from main.'}
if(git status --porcelain){throw 'Working tree must be clean before publication.'}
npm ci --ignore-scripts
npm run check
New-Item -ItemType Directory -Force -Path release|Out-Null
npm pack --pack-destination release|Out-Null
$Tarball=(Get-ChildItem -LiteralPath release -Filter 'flop-tools-conformance-lab-0.1.0.tgz' -File).FullName
$Hash=(Get-FileHash -LiteralPath $Tarball -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath release\SHA256SUMS -Encoding ascii -Value "$Hash  $([IO.Path]::GetFileName($Tarball))"
node dist\src\cli.js run --out release\example-report.json
$Origin=(git remote get-url origin 2>$null)
$Exists=$true;gh repo view "$Owner/$RepoName" 1>$null 2>$null;if($LASTEXITCODE-ne 0){$Exists=$false}
if($Origin-and($Origin-ne$Expected)-and($Origin-ne"git@github.com:$Owner/$RepoName.git")){throw "Refusing conflicting origin: $Origin"}
if($Exists-and-not$Origin){$Size=gh api "repos/$Owner/$RepoName" --jq '.size';if([int]$Size-ne 0){throw 'Refusing to attach an existing non-empty repository without prior origin configuration.'}}
if(-not$Exists){gh repo create "$Owner/$RepoName" --public --description $Description}
if(-not$Origin){git remote add origin $Expected}
gh repo edit "$Owner/$RepoName" --description $Description --add-topic flop --add-topic protocol --add-topic conformance --add-topic interoperability --add-topic tclk --add-topic technocore
git push -u origin main
$ExistingTag=(git rev-parse -q --verify "refs/tags/$Tag^{}" 2>$null)
if($ExistingTag-and($ExistingTag-ne(git rev-parse HEAD))){throw "$Tag exists at a different commit."}
if(-not$ExistingTag){git tag -a $Tag -m 'FLOP Conformance Lab v0.1.0-alpha'}
git push origin $Tag
gh release view $Tag --repo "$Owner/$RepoName" 1>$null 2>$null
if($LASTEXITCODE-ne 0){gh release create $Tag $Tarball release\SHA256SUMS release\example-report.json conformance\sources\manifest.json --repo "$Owner/$RepoName" --title 'FLOP Conformance Lab v0.1.0-alpha' --notes-file RELEASE_NOTES.md --prerelease}else{gh release upload $Tag $Tarball release\SHA256SUMS release\example-report.json conformance\sources\manifest.json --repo "$Owner/$RepoName" --clobber}
$Result=gh repo view "$Owner/$RepoName" --json url,visibility|ConvertFrom-Json
if($Result.visibility-ne'PUBLIC'){throw 'Repository visibility verification failed.'}
$Result|ConvertTo-Json
