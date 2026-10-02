# build.ps1 — render a video's scenes and assemble it. One script for drafts and 4K finals.
# Usage (from the project root):
#   powershell -File scripts/build.ps1 -Video video1                       # 1080p silent draft -> video1/draft.mp4
#   powershell -File scripts/build.ps1 -Video video1 -Only secD            # re-render one scene
#   powershell -File scripts/build.ps1 -Video video1 -AssembleOnly
#   powershell -File scripts/build.ps1 -Video video1 -Final                # 4K + holds + narration -> video1/final_4k.mp4
# Reads <Video>/shots.json:  [["s01",5,""],["s02",8,"x"],["secC",28,"c"]]   name, seconds, join ("x"=0.6 s crossfade, "c"=cut)
# Optional <Video>/voiceover/holds.json: [[original_seconds, extra_seconds], ...] (written by scripts/retime.py)
param([Parameter(Mandatory)][string]$Video, [switch]$Final, [string]$Only = "", [switch]$AssembleOnly, [string]$Out = "")
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
Set-Location (Split-Path $PSScriptRoot -Parent)
$shots = Get-Content "$Video/shots.json" -Raw | ConvertFrom-Json
$scale = if ($Final) { 2 } else { 1 }
$crf = if ($Final) { "16" } else { "20" }
$dir = if ($Final) { "$Video/out4k" } else { "$Video/out" }
$XF = 0.6; $t0 = Get-Date
New-Item -ItemType Directory -Force $dir | Out-Null
if (-not $AssembleOnly) {
  foreach ($s in $shots) {
    if ($Only -and $s[0] -ne $Only) { continue }
    node scripts/render.mjs --scene=$Video/scenes/$($s[0]).html --duration=$($s[1]) --scale=$scale --workers=6 --out=$dir/$($s[0]).mp4
    if ($LASTEXITCODE) { Write-Error "render failed: $($s[0])"; exit 1 }
  }
  if ($Only) { exit }
}
# join: normalise every input (fps -> format -> settb, in that order), chain crossfades/cuts, track running length
$fc = ""; for ($i = 0; $i -lt $shots.Count; $i++) { $fc += "[$i]fps=30,format=yuv420p,settb=AVTB[i$i];" }
$cur = "i0"; $len = [double]$shots[0][1]
for ($i = 1; $i -lt $shots.Count; $i++) {
  $o = "v$i"; $d = [double]$shots[$i][1]
  if ($shots[$i][2] -eq "x") { $off = [math]::Round($len - $XF, 3); $fc += "[$cur][i$i]xfade=transition=fade:duration=$($XF):offset=$off[$o];"; $len += $d - $XF }
  else { $fc += "[$cur][i$i]concat=n=2:v=1:a=0,settb=AVTB[$o];"; $len += $d }
  $cur = $o
}
$inputs = $shots | ForEach-Object { "-i"; "$dir/$($_[0]).mp4" }
$joined = if ($Final) { "$dir/joined.mp4" } elseif ($Out) { $Out } else { "$Video/draft.mp4" }
ffmpeg -y -loglevel error @inputs -filter_complex $fc.TrimEnd(';') -map "[$cur]" -c:v libx264 -crf $crf -preset medium -r 30 -pix_fmt yuv420p -movflags +faststart -an $joined
Write-Output "joined: $joined (expected $len s)"
if ($Final) {
  $py = if (Test-Path .venv/Scripts/python.exe) { ".venv/Scripts/python.exe" } else { "python" }
  $silent = "$Video/final_4k_silent.mp4"
  if (Test-Path "$Video/voiceover/holds.json") { & $py scripts/apply_holds.py --holds "$Video/voiceover/holds.json" --in $joined --out $silent }
  else { Copy-Item $joined $silent -Force }
  & $py -W ignore scripts/voiceover.py --project $Video mux --video $silent --out "$Video/final_4k.mp4"
  Copy-Item "$Video/voiceover/captions.srt" "$Video/final_4k.srt" -Force -ErrorAction SilentlyContinue
  ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact "$Video/final_4k.mp4"
}
Write-Output ("{0} done in {1:N1} min" -f $Video, ((Get-Date) - $t0).TotalMinutes)
