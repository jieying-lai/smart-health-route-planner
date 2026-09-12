import urllib.request
import json
import ssl

# Allow self-signed certs just in case
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

project_id = 'proj_8074cdfcfe8657ff8d03b1e8'
api_key = 'jamai_pat_fcc821f53ee8e94560c4ea16f6f522702ad1fa959344d576'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json',
    'X-Project-ID': project_id
}

url = 'https://api.jamaibase.com/api/v1/chat/completions'

print(f"Testing URL: {url}")

data = {
    "model": "ellm/gemini-2.5-flash",
    "messages": [
        {"role": "user", "content": "Hello, are you working?"}
    ],
    "max_tokens": 10
}

with open('test_output.txt', 'w', encoding='utf-8') as f:
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req, context=ctx) as response:
            f.write(f"Status: {response.status}\n")
            f.write(f"Response: {response.read().decode('utf-8')}\n")
    except urllib.error.HTTPError as e:
        f.write(f"HTTP Error: {e.code}\n")
        f.write(f"Reason: {e.reason}\n")
        f.write(f"Body: {e.read().decode('utf-8')}\n")
    except Exception as e:
        f.write(f"Error: {e}\n")
