import socket


def banner(ip,port):
    s = socket.socket()
    s.connect((ip, int(port)))
    banner_bin = s.recv(1024)


    #print(str(banner_bin))
    print(banner_bin)
    #print(type(banner_bin))
    #print(banner_bin.decode('unicode_escape'))


def main():
    ip = input("Enter IP Address: ")
    port = input("Enter Port: ")
    banner(ip,port)

main()