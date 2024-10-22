import socket

try:
    print(socket.gethostbyname('imap.gmail.com'))
except socket.gaierror as e:
    print(f"DNS resolution error: {e}")
