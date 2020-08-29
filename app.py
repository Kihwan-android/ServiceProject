from pymongo import MongoClient

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.test


@app.route('/')
def home():
    return render_template('cafe-order-status.html')


@app.route('/order')
def viewOrderStatus():
    return render_template('cafe-order-status.html')


@app.route('/menu')
def viewMenus():
    return render_template('cafe-menu.html')


@app.route('/contact')
def contact():
    return render_template('cafe-contact.html')


@app.route('/review')
def viewReviews():
    return render_template('cafe-review.html')


@app.route('/open-info')
def viewRunningTime():
    return render_template('cafe-running-time.html')


@app.route('/order/list', methods=['GET'])
def getOrderList():
    cafeId = request.args.get("cafeId")
    status = request.args.get("status")

    print("test")

    if status == "3":
        orders = list(db.order.find({}, {"_id": False}))
    else:
        orders = list(db.order.find({"cafeId": cafeId, "status": status}, {"_id": False}).sort("orderTime", -1))

    return jsonify({'orders': orders})


@app.route('/order/accept', methods=['GET'])
def acceptOrder():
    cafeId = request.args.get("cafeId")
    orderId = request.args.get("orderId")

    db.order.update_one({"cafeId": cafeId, "orderId": orderId}, {"$set": {"status": 1}})
    return jsonify({"code": 200})


@app.route('/order/reject', methods=['GET'])
def rejectOrder():
    cafeId = request.args.get("cafeId")
    orderId = request.args.get("orderId")

    db.order.update_one({"cafeId": cafeId, "orderId": orderId}, {"$set": {"status": -1}})
    return jsonify({"code": 200})


@app.route('/order/pick-up', methods=['GET'])
def pickUp():
    cafeId = request.args.get("cafeId")
    orderId = request.args.get("orderId")

    db.order.update_one({"cafeId": cafeId, "orderId": orderId}, {"$set": {"status": 2}})
    return jsonify({"code": 200})


@app.route('/menu/view', methods=['GET'])
def getMenus():
    cafeId = request.args.get('cafeId')

    menus = list(db.menu.find({}, {"_id": False}))
    return jsonify({"menus": menus})


@app.route('/category/list', methods=['GET'])
def getCategory():
    cafeId = request.args.get('cafeId')

    categories = list(db.category.find({}, {"_id": False}))
    return jsonify({"categories": categories})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
