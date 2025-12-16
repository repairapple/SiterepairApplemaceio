import urllib.request
import json

url = 'http://localhost:8000/api/contact'
data = {
    'name': 'Test User',
    'email': 'test@example.com',
    'phone': '11999999999',
    'service': 'iphone',
    'message': 'This is a test message from urllib.'
}

json_data = json.dumps(data).encode('utf-8')
headers = {'Content-Type': 'application/json'}

try:
    req = urllib.request.Request(url, data=json_data, headers=headers, method='POST')
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        print(f"Response: {response.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
