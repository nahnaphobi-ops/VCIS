Add-Type -AssemblyName System.Drawing

$galleryDir = Join-Path (Split-Path $PSScriptRoot -Parent) 'public\gallery'
if (-not (Test-Path $galleryDir)) {
    New-Item -ItemType Directory -Path $galleryDir -Force | Out-Null
}

$placeholders = @(
    @{ Name = 'students-group-formal.jpg';      Label = 'GROUP / FORMAL' }
    @{ Name = 'students-group-candid.jpg';      Label = 'GROUP / CANDID' }
    @{ Name = 'students-group-arms-crossed.jpg';Label = 'GROUP / ARMS' }
    @{ Name = 'students-group-studio.jpg';      Label = 'GROUP / STUDIO' }
    @{ Name = 'students-group-portrait.jpg';    Label = 'GROUP / PORTRAIT' }
    @{ Name = 'students-pair-girls.jpg';        Label = 'PAIR / GIRLS' }
    @{ Name = 'students-pair-boy-girl.jpg';     Label = 'PAIR / BOY+GIRL' }
)

# Brown backdrop colours sampled from the new photos
$backdropTop    = [System.Drawing.Color]::FromArgb(255, 145, 96, 76)
$backdropBottom = [System.Drawing.Color]::FromArgb(255, 102, 65, 50)

foreach ($p in $placeholders) {
    $width  = 1600
    $height = 1200
    $bmp    = New-Object System.Drawing.Bitmap $width, $height
    $gfx    = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.SmoothingMode    = 'AntiAlias'
    $gfx.TextRenderingHint = 'AntiAliasGridFit'

    # Gradient backdrop
    $rect    = New-Object System.Drawing.Rectangle 0, 0, $width, $height
    $brush   = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect, $backdropTop, $backdropBottom,
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )
    $gfx.FillRectangle($brush, $rect)
    $brush.Dispose()

    # Caption
    $font       = New-Object System.Drawing.Font 'Segoe UI', 48, ([System.Drawing.FontStyle]::Bold)
    $textBrush  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(220, 255, 245, 235))
    $text       = $p.Label
    $textSize   = $gfx.MeasureString($text, $font)
    $x          = [int](($width  - $textSize.Width)  / 2)
    $y          = [int](($height - $textSize.Height) / 2)

    # Soft shadow under the text so it reads against the backdrop
    $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(120, 0, 0, 0))
    $gfx.DrawString($text, $font, $shadow, ($x + 3), ($y + 3))
    $gfx.DrawString($text, $font, $textBrush, $x, $y)

    $subFont  = New-Object System.Drawing.Font 'Segoe UI', 22
    $subText  = 'placeholder — replace with photo'
    $subSize  = $gfx.MeasureString($subText, $subFont)
    $subBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 255, 245, 235))
    $gfx.DrawString(
        $subText, $subFont, $subBrush,
        [int](($width - $subSize.Width) / 2),
        [int]($y + $textSize.Height + 16)
    )

    $font.Dispose(); $textBrush.Dispose(); $shadow.Dispose(); $subFont.Dispose(); $subBrush.Dispose()
    $gfx.Dispose()

    $path = Join-Path $galleryDir $p.Name
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Created $path"
}
