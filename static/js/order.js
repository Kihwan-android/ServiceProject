function getOrders(cafeId) {
    console.log("test");
    let url = `/order/list?cafeId=${cafeId}`;

    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            $("#order_list").empty();
            makeOrders(response["orders"]);
        }
    })
}

function makeOrders(orders) {
    let returnHtml = ``;
    for (let i = 0; i < orders.length; i++) {
        returnHtml += ordersHtml(orders[i]);
    }
    $("#order_list").prepend(returnHtml);
}

function ordersHtml(orderInfo) {
    let customerInfo = orderInfo["customer"];
    let orderSheetInfo = orderInfo["orderSheet"];
    let bgColor, status;
    let btnHtml = ``;

    switch (orderInfo["orderStatus"]) {
        case -1:
            console.log("status = -1");
            bgColor = "palevioletred";
            status = "reject";
            break;
        case 0:
            console.log("status = 0");
            bgColor = "white";
            btnHtml = `
                <button type="button" onclick="accept('${orderInfo["cafeId"]}', '${orderInfo["orderId"]}')" class="btn btn-order-list btn-lg btn-block"
                        style="margin-left: 1em; margin-right: 1em" value="123">
                  주문 접수
                </button>
                <button type="button" onclick="reject('${orderInfo["cafeId"]}', '${orderInfo["orderId"]}')" class="btn btn-order-list btn-lg btn-block"
                        style="margin-left: 1em; margin-right: 1em">
                  주문 거부
                </button>`;
            status = "ready";
            break;
        case 1:
            console.log("status = 1");
            bgColor = "lightskyblue";
            btnHtml = `
                <button type="button" onclick="pickUp('${orderInfo["cafeId"]}', '${orderInfo["orderId"]}')" class="btn btn-order-list btn-lg btn-block"
                        style="margin-left: 1em; margin-right: 1em" value="123">
                  픽업 완료
                </button>`;
            status = "accept";
            break;
        case 2:
            console.log("status = 2");
            bgColor = "lightgreen";
            status = "pickedUp";
            break;
        default:
    }

    let sheetHtml = `
            <div class="well col-xs-10 col-sm-10 col-xs-offset-1 col-sm-offset-1 order-sheet ${status}" style="background-color: ${bgColor}; border-color: ${bgColor}">
              <div class="row">
                <div class="col-xs-6 col-sm-6 col-md-6" style="color: black">
                  <h1 style="color: black"><strong>주문자 정보</strong></h1>
                  <h5>${customerInfo["nickname"]} 님</h5>
                  <h5>${customerInfo["phoneNumber"]}</h5>
                  <h5>${customerInfo["pickUpTime"]}</h5>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6 text-right">
                  <p style="color: black">
                    <em>${orderInfo["orderTime"]}</em>
                  </p>
                  <p style="color: black">
                    <em>${orderInfo["orderId"]}</em>
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="text-center">
                  <h1 style="margin-left: 15px; margin-top: 10px; color: black"><strong>주문서</strong></h1>
                </div>
                <table class="table table-hover order-font" style="margin-left: 15px; margin-right: 0px; width: 95%;">
                  <thead>
                  <tr>
                    <th>메뉴</th>
                    <th class="text-center">수량</th>
                    <th class="text-center">단가</th>
                    <th class="text-center">금액</th>
                  </tr>
                  </thead>
                  <tbody>
                    ${getOrderMenus(orderSheetInfo["menus"])}
                  <tr>
                    <td>&nbsp</td>
                    <td>&nbsp</td>
                    <td>&nbsp</td>
                    <td>&nbsp</td>
                  </tr>
                  <tr>
                    <td>&nbsp</td>
                    <td class="text-right"><h4><strong>합</strong></h4></td>
                    <td class="text-right"><h4><strong>계:</strong></h4></td>
                    <td class="text-center"><h4><strong>${orderSheetInfo["totalPrice"]}</strong></h4></td>
                  </tr>
                  </tbody>
                </table>
                ${btnHtml}
              </div>
            </div>
    `;
    return sheetHtml;
}

function getOrderMenus(menus) {
    let returnHtml = ``;
    for (let i = 0; i < menus.length; i++) {
        returnHtml += orderMenus(menus[i]);
    }
    return returnHtml;
}

function getOrderMenuOptions(options) {
    let returnHtml = "<pre>Option : \n  ";

    for (let i = 0; i < options.length; i++) {
        if (i !== options.length - 1) {
            returnHtml = returnHtml + options[i]["types"]["name"] + " / ";
        } else {
            returnHtml = returnHtml + options[i]["types"]["name"] + "</pre>";
        }
    }

    return returnHtml;
}

function orderMenus(menu) {
    let returnHtml = `<tr>
                    <td class="col-md-9" style="font-weight: bold"><em>${menu["name"]}</em></h4>
                      ${getOrderMenuOptions(menu["options"])}
                    </td>
                    <td class="col-md-1 text-center">&nbsp&nbsp&nbsp&nbsp${menu["count"]}&nbsp&nbsp&nbsp&nbsp</td>
                    <td class="col-md-1 text-center">${menu["unitPrice"]}</td>
                    <td class="col-md-1 text-center">${menu["count"] * menu["unitPrice"]}</td>
                  </tr>`;

    return returnHtml;
}

function accept(cafeId, orderId) {
    let url = `/order/accept?cafeId=${cafeId}&orderId=${orderId}`;
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            console.log(response);
            if(response["code"] == 200) {
                location.reload();
            }
        }
    })
}

function reject(cafeId, orderId) {
    let url = `/order/reject?cafeId=${cafeId}&orderId=${orderId}`;
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            if(response["code"] == 200) {
                location.reload();
            }
        }
    })
}

function pickUp(cafeId, orderId) {
    let url = `/order/pick-up?cafeId=${cafeId}&orderId=${orderId}`;
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            if(response["code"] == 200) {
                location.reload();
            }
        }
    })
}

function viewOrders(status) {
    console.log("hide and show");
    switch (status) {
        case -1:
            $(".order-sheet").hide();
            $(".reject").show();
            break;
        case 0:
            $(".order-sheet").hide();
            $(".ready").show();
            break;
        case 1:
            $(".order-sheet").hide();
            $(".accept").show();
            break;
        case 2:
            $(".order-sheet").hide();
            $(".pickedUp").show();
            break;
        case 3:
            $(".order-sheet").show();
            break;
    }
}
