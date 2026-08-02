import socket
import webbrowser
import time
import sys
import urllib.request
import urllib.error

def check_server(host, port):
    try:
        urllib.request.urlopen(f"http://{host}:{port}", timeout=2)
        return True
    except urllib.error.URLError:
        return False
    except Exception as e:
        print(f"Error checking server: {e}")
        return False

def main():
    host = "localhost"
    port = 8000
    url = f"http://{host}:{port}"
    
    print(f"Checking if server is accessible at {url}...")
    
    if check_server(host, port):
        print(f"✅ Server is running and accessible at {url}")
        print("Attempting to open your default browser...")
        try:
            webbrowser.open(url)
            print("Browser opening command sent.")
        except Exception as e:
            print(f"Failed to open browser: {e}")
    else:
        print(f"❌ Could not connect to {url}")
        print("Possible causes:")
        print("1. The server process died (check terminal).")
        print("2. Additional firewall blocking.")
        print("3. Port conflict (though it seemed fine before).")

    # Get local IP
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        print(f"\nYour local IP is: {local_ip}")
        print(f"Try accessing via: http://{local_ip}:{port}")
    except Exception:
        print("Could not determine local IP.")

if __name__ == "__main__":
    main()
