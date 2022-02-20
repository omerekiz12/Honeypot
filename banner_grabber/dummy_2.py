import telnetlib


ip = input("Enter IP Address: ")
port = int(input("Enter Port: "))

tn = telnetlib.Telnet(ip)

print(tn.read_until(b"WAP>").decode('ascii'))



