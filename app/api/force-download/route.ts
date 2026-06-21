import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow longer execution time if deployed to Vercel

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  let filename = searchParams.get('filename') || 'media_download';

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    // Get Range header from client if browser is trying to resume download or stream
    const clientRange = request.headers.get('range');
    
    const fetchHeaders: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    };

    if (clientRange) {
      fetchHeaders['Range'] = clientRange;
    } else {
      // Force fetching the entire file if no range is specified
      fetchHeaders['Range'] = 'bytes=0-';
    }

    const response = await fetch(url, {
      headers: fetchHeaders,
      // prevent node-fetch from aborting prematurely
      signal: AbortSignal.timeout(300000) // 5 minutes timeout
    });

    if (!response.ok && response.status !== 206) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');
    
    if (contentType.includes('mpegurl') || url.includes('.m3u8')) {
       return NextResponse.redirect(url);
    }
    
    if (!filename.includes('.')) {
      if (contentType.includes('video/mp4')) filename += '.mp4';
      else if (contentType.includes('image/jpeg')) filename += '.jpg';
      else if (contentType.includes('image/png')) filename += '.png';
      else if (contentType.includes('audio/mpeg')) filename += '.mp3';
      else if (contentType.includes('video/webm')) filename += '.webm';
      else if (contentType.includes('image/webp')) filename += '.webp';
      else if (contentType.includes('video/')) filename += '.mp4';
      else filename += '.mp4';
    }

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    
    // Inline means browser plays it, attachment means force download
    // Since we want direct download, we keep attachment
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Must forward these for large files to prevent truncation
    if (contentLength) headers.set('Content-Length', contentLength);
    if (contentRange) headers.set('Content-Range', contentRange);
    headers.set('Accept-Ranges', 'bytes');
    
    // Prevent Next.js from caching the stream or buffering it completely
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new Response(response.body, {
      status: response.status === 206 ? 206 : 200,
      headers: headers
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.redirect(url);
  }
}
