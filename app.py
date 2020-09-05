from pymongo import MongoClient
import os
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.test

APP_ROOT = os.path.dirname(os.path.abspath(__file__))


@app.route('/')
def home():
    return render_template('login.html')


@app.route('/order')
def viewOrderStatus():
    return render_template('cafe-order.html')


@app.route('/menu')
def viewMenus():
    return render_template('cafe-menu.html')


@app.route('/contact')
def contact():
    return render_template('cafe-contact.html')


@app.route('/review')
def viewReviews():
    return render_template('cafe-review.html')


@app.route('/order/list', methods=['GET'])
def getOrders():
    cafeId = request.args.get("cafeId")

    orders = list(db.order.find({}, {"_id": False}))

    return jsonify({'orders': orders})


@app.route('/order/accept', methods=['GET'])
def acceptOrder():
    cafeId = request.args.get("cafeId")
    orderId = request.args.get("orderId")

    db.order.update_one({"cafeId": cafeId, "orderId": orderId}, {"$set": {"orderStatus": 1}})
    return jsonify({"code": 200})


@app.route('/order/reject', methods=['GET'])
def rejectOrder():
    cafeId = request.args.get("cafeId")
    orderId = request.args.get("orderId")

    db.order.update_one({"cafeId": cafeId, "orderId": orderId}, {"$set": {"orderStatus": -1}})
    return jsonify({"code": 200})


@app.route('/order/pick-up', methods=['GET'])
def pickUp():
    cafeId = request.args.get("cafeId")
    orderId = request.args.get("orderId")

    db.order.update_one({"cafeId": cafeId, "orderId": orderId}, {"$set": {"orderStatus": 2}})
    return jsonify({"code": 200})


@app.route('/menu/view', methods=['GET'])
def getMenus():
    cafeId = request.args.get('cafeId')

    menus = list(db.menu.find({}, {"_id": False}))
    return jsonify({"menus": menus})


@app.route('/category/list', methods=['GET'])
def getCategory():
    cafeId = request.args.get("cafeId")

    categories = list(db.category.find({}, {"_id": False}))
    return jsonify({"categories": categories})


@app.route('/category/add', methods=['POST'])
def addCategory():
    cafeId = request.form['cafeId']
    categoryId = request.form['categoryId']
    categoryName = request.form['categoryName']

    db.category.insert_one({"categoryId": categoryId, "categoryName": categoryName})
    return jsonify({"code": 200})


@app.route('/menu/add', methods=['POST'])
def addMenu():
    cafeId = request.form.get("cafeId")
    categoryId = request.form.get("categoryId")
    menuId = request.form.get('menuId')
    menuName = request.form.get('menuName')
    menuPrice = request.form.get('menuPrice')
    files = request.files.getlist("file")

    print(cafeId)
    print(categoryId)
    print(menuId)
    print(menuName)
    print(menuPrice)

    location = "..\static\img\coffee\\" + categoryId + "\\"

    target = os.path.join(APP_ROOT, "static\img\coffee\\" + categoryId + "\\")

    if not os.path.isdir(target):
        os.mkdir(target)

    print(files)

    # for file in request.files.getlist("file"):
    for file in files:
        filename = file.filename
        location += filename
        print(location)
        destination = "/".join([target, filename])
        file.save(destination)

    menuData = {
        "menuId": menuId,
        "name": menuName,
        "imageUrl": location,
        "category": categoryId,
        "options": [
            {
                "optionId": "option-0001",
                "name": "온도",
                "types": [
                    {
                        "name": "Hot",
                        "price": 0
                    },
                    {
                        "name": "Ice",
                        "price": 0
                    }
                ]
            },
            {
                "optionId": "option-0002",
                "name": "사이즈",
                "types": [
                    {
                        "name": "Tall",
                        "price": 0
                    },
                    {
                        "name": "Grande",
                        "price": 500
                    },
                    {
                        "name": "Venti",
                        "price": 1000
                    }
                ]
            }
        ],
        "price": menuPrice
    }
    db.menu.insert_one(menuData)
    return jsonify({"code": 200})


@app.route('/review/list', methods=['GET'])
def getReviews():
    cafeId = request.args.get("cafeId")
    reviews = list(db.review.find({}, {"_id": False}))

    return jsonify({'reviews': reviews})


@app.route('/login', methods=['POST'])
def login():
    userId = request.form['userId']
    userPw = request.form['userPw']

    try:
        pw = db.user.find_one({"userId": userId}, {"_id": False})["userPw"]
    except TypeError:
        return jsonify({"code": 204})

    if userPw == pw:
        return jsonify({"code": 200})
    else:
        return jsonify({"code": 204})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
