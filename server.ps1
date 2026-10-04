$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"
$root = (Get-Location).Path

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        
        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($localPath) -or $localPath -eq '/') {
            $localPath = "index.html"
        }
        
        $filePath = Join-Path $root $localPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            $res.ContentType = $contentType
            $res.ContentLength64 = $bytes.Length
            $res.StatusCode = 200
            $res.AddHeader("Access-Control-Allow-Origin", "*")
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.ContentLength64 = $errBytes.Length
            $res.ContentType = "text/plain; charset=utf-8"
            $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
    } catch {
    } finally {
        if ($res) {
            try { $res.OutputStream.Flush(); $res.OutputStream.Close() } catch {}
        }
    }
}
