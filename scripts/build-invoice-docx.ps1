# Builds Robur-Invoice.docx (OOXML) in repo root. Run: powershell -ExecutionPolicy Bypass -File scripts/build-invoice-docx.ps1
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$outPath = Join-Path $root "Robur-Invoice.docx"
$temp = Join-Path $env:TEMP ("robur-invoice-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Force -Path "$temp\_rels", "$temp\word\_rels", "$temp\docProps" | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding $false
function Write-Utf8File([string]$Path, [string]$Content) {
    [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}

$ct = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
'@
Write-Utf8File (Join-Path $temp '[Content_Types].xml') $ct

$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
'@
Write-Utf8File (Join-Path (Join-Path $temp '_rels') '.rels') $rels

$docRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>
'@
Write-Utf8File (Join-Path (Join-Path (Join-Path $temp 'word') '_rels') 'document.xml.rels') $docRels

$core = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>Invoice - Robur Mining Solutions</dc:title>
<dc:creator>Fidisnky Tech Solutions</dc:creator>
<dcterms:created xsi:type="dcterms:W3CDTF">2026-05-04T12:00:00Z</dcterms:created>
</cp:coreProperties>
'@
Write-Utf8File (Join-Path (Join-Path $temp 'docProps') 'core.xml') $core

$app = @'
<?xml version="1.0" encoding="UTF-8"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
<Application>Robur Invoice Builder</Application>
</Properties>
'@
Write-Utf8File (Join-Path (Join-Path $temp 'docProps') 'app.xml') $app

function Xml-P {
    param([string]$Text)
    $esc = [System.Security.SecurityElement]::Escape($Text)
    return "<w:p><w:r><w:t xml:space=`"preserve`">$esc</w:t></w:r></w:p>"
}
function Xml-Cell {
    param([string]$Text)
    $esc = [System.Security.SecurityElement]::Escape($Text)
    return "<w:tc><w:tcPr/><w:p><w:r><w:t xml:space=`"preserve`">$esc</w:t></w:r></w:p></w:tc>"
}

$rows = @(
    @{ n = "Home"; f = "index.html" },
    @{ n = "About"; f = "about.html" },
    @{ n = "Who we are"; f = "who-we-are.html" },
    @{ n = "Contacts"; f = "contacts.html" },
    @{ n = "Investment opportunities"; f = "investment-opportunities.html" },
    @{ n = "Fire solutions"; f = "fire-solutions.html" },
    @{ n = "Fluid solutions"; f = "fluid-solutions.html" },
    @{ n = "Strata solutions"; f = "strata-solutions.html" },
    @{ n = "Mining technologies"; f = "mining-technologies.html" },
    @{ n = "Drilling tools"; f = "drilling-tools.html" }
)

$tblRows = New-Object System.Text.StringBuilder
[void]$tblRows.Append('<w:tr>')
foreach ($h in @("Description", "Qty", "Rate (USD)", "Amount (USD)")) {
    [void]$tblRows.Append((Xml-Cell $h))
}
[void]$tblRows.Append('</w:tr>')

foreach ($r in $rows) {
    $desc = "$($r.n) - $($r.f)"
    [void]$tblRows.Append('<w:tr>')
    [void]$tblRows.Append((Xml-Cell $desc))
    [void]$tblRows.Append((Xml-Cell "1"))
    [void]$tblRows.Append((Xml-Cell "200.00"))
    [void]$tblRows.Append((Xml-Cell "200.00"))
    [void]$tblRows.Append('</w:tr>')
}

[void]$tblRows.Append('<w:tr>')
[void]$tblRows.Append((Xml-Cell "Total due (USD)"))
[void]$tblRows.Append((Xml-Cell ""))
[void]$tblRows.Append((Xml-Cell ""))
[void]$tblRows.Append((Xml-Cell "2,000.00"))
[void]$tblRows.Append('</w:tr>')

$body = New-Object System.Text.StringBuilder
$w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
[void]$body.Append("<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?>")
[void]$body.Append("<w:document xmlns:w=`"$w`"><w:body>")
[void]$body.Append((Xml-P "Invoice"))
[void]$body.Append((Xml-P "Web development - Robur Mining Solutions site"))
[void]$body.Append((Xml-P ""))
[void]$body.Append((Xml-P "Bill to: Robur Mining Solutions"))
[void]$body.Append((Xml-P "From: Fidisnky Tech Solutions"))
[void]$body.Append((Xml-P "Invoice #: ROBUR-WEB-2026-001"))
[void]$body.Append((Xml-P "Date: 4 May 2026"))
[void]$body.Append((Xml-P ""))
[void]$body.Append("<w:tbl><w:tblPr><w:tblW w:w=`"5000`" w:type=`"pct`"/></w:tblPr>")
[void]$body.Append($tblRows.ToString())
[void]$body.Append("</w:tbl>")
[void]$body.Append((Xml-P ""))
[void]$body.Append((Xml-P "Terms: Net 30 days. USD 200 per webpage delivered for the Robur Mining Solutions website scope."))
[void]$body.Append("<w:sectPr><w:pgSz w:w=`"12240`" w:h=`"15840`"/><w:pgMar w:top=`"1440`" w:right=`"1440`" w:bottom=`"1440`" w:left=`"1440`"/></w:sectPr>")
[void]$body.Append("</w:body></w:document>")

Write-Utf8File (Join-Path (Join-Path $temp 'word') 'document.xml') $body.ToString()

Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $outPath) { Remove-Item $outPath -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($temp, $outPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Remove-Item -Recurse -Force $temp
Write-Host "Wrote $outPath"
