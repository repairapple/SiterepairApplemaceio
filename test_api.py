import requests
import json

url = 'http://localhost:8000/api/contact'
data = {
    'name': 'Test User',
    'email': 'test@example.com',
    'phone': '11999999999',
    'service': 'iphone',
    'message': 'This is a test message.'
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
