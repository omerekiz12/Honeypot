import socket
import sys

def getBanner(ip,port):
    try:
        s = socket.socket()
        s.connect((ip, port))
        banner_bytes = s.recv(1024)
        return banner_bytes
    except:
        return


def main():
    ip = input("Enter IP Address: ")
    port = int(input("Enter Port: "))
    banner = getBanner(ip,port)
    if banner:
        print(f'IP: {ip},\nPort: {port},\nBanner: {banner}')
        print(banner[1:])
        dummy = banner[1:]
        for by in banner:
            try:
                print(by.decode('ascii'))
            except:
                print('couldnt decode')
                
main()
