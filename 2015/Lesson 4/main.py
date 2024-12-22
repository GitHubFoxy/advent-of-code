from itertools import count
from hashlib import md5    

for x in count(1):
    test = 'bgvyzdsv' + str(x)
    if md5(test.encode('utf-8')).hexdigest()[:6] == '000000':
        print(x)
        break