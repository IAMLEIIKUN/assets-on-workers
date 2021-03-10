CloudFlare worker that serves assets from S3 bucket. Forked from signalnerve.

Check if asset in Cloudflare cache. 
If not, check if asset in S3 Bucket. 
If not, check if asset available on Origin. 
If not, check give respond error code. 
