from pymongo import MongoClient  # pymongo를 임포트 하기(패키지 설치 먼저 해야겠죠?)
import datetime

client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
testDb = client.test  # 'test'라는 이름의 db를 사용합니다. 'test' db가 없다면 새로 만듭니다.

customer = {
    "nickname": "테스터1",
    "phoneNumber": "010-1234-5678",
    "pickUpTime": ""
}

type1 = {
    "name": "Hot",
    "price": 0
}

option1 = {
    "name": "온도",
    "types": type1
}

type2 = {
    "name": "Large",
    "price": 500
}

option2 = {
    "name": "사이즈",
    "types": type2
}

options = [option1, option2]

menu = {
    "name": "아메리카노",
    "imageUrl": "이미지URL",
    "options": options,
    "unitPrice": 4600,
    "count": 2
}

menu1 = {
    "name": "Apple Juice",
    "imageUrl": "이미지URL",
    "options": options,
    "unitPrice": 4100,
    "count": 1
}

menus = [menu]

orderSheet = {
    "menus": menus,
    "totalPrice": 9200
}

order = {
    "orderId": "order-0001",
    "cafeId": "cafe-0001",
    "customer": customer,
    "orderSheet": orderSheet,
    "orderStatus": 0,
    "orderTime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

testDb.order.insert_one(order)
# cOrder = {"orders": list(testDb.order.find())}
# print(cOrder)
