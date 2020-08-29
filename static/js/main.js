function main() {
    console.log("main");
    (function () {
        'use strict';

        $('a.page-scroll').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 40
                    }, 900);
                    return false;
                }
            }
        });


        // Show Menu on Book
        $(window).bind('scroll', function () {
            var navHeight = $(window).height() - 600;
            if ($(window).scrollTop() > navHeight) {
                $('.navbar-default').addClass('on');
            } else {
                $('.navbar-default').removeClass('on');
            }
        });

        $('body').scrollspy({
            target: '.navbar-default',
            offset: 80
        });


        // Hide nav on click
        $(".navbar-nav li a").click(function (event) {
            // check if window is small enough so dropdown is created
            var toggle = $(".navbar-toggle").is(":visible");
            if (toggle) {
                $(".navbar-collapse").collapse('hide');
            }
        });

    }());
}

main();

function getMenus(cafeId) {
    let url = `/menu/view?cafeId=${cafeId}`;

    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            // console.log("response : ");
            // console.log(response);
            let menus = response["menus"];
            // console.log("menus : ");
            // console.log(menus);
            for (let i = 0; i < menus.length; i++) {
                // console.log("menus[i] : ")
                // console.log(menus[i])
                $("#menu-board").append(makeMenuHtml(menus[i]));
            }

            if ($(".Juice").css("display") == "block") {
                console.log("block");
                $(".Juice").hide();
            } else {
                console.log("nonblock");
            }

            if ($(".menu-card").css("display") != "block") {
                $(".menu-card").show();
            }
        }
    })
}

function makeMenuHtml(menuInfo) {
    let menuHtml =
        `
        <div class="col-md-6 col-lg-4 col-xl-3 py-2 menu-card ${menuInfo["category"]}">
          <div class="card h-100" style="border: 1px solid darkslategrey">
            <img class="card-img-top img-fluid" src="${menuInfo["imageUrl"]}" alt="Card image cap">
            <div class="card-block" style="padding: 10px 0; background-color: #3b3636;">
              <p class="card-text" style="text-align: center; color: white; background-color: #3b3636">${menuInfo["name"]}</p>
              <p class="card-text" style="text-align: center; color: white; background-color: #3b3636">${menuInfo["price"]}원</p>
            </div>
          </div>
        </div>
        `;
    return menuHtml;
}

function getOrderLists(cafeId, status) {
    let url = `/order/list?cafeId=${cafeId}&status=${status}`;

    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            console.log("response : \n" + response);
            $("#order_list").empty();
            attachOrderList(response["orders"]);
        }
    })
}

function getOptionsHtml(options) {
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

function getMenusHtml(menu) {
    let returnHtml = `<tr>
                    <td class="col-md-9" style="font-weight: bold"><em>${menu["name"]}</em></h4>
                      ${getOptionsHtml(menu["options"])}
                    </td>
                    <td class="col-md-1 text-center">&nbsp&nbsp&nbsp&nbsp${menu["count"]}&nbsp&nbsp&nbsp&nbsp</td>
                    <td class="col-md-1 text-center">${menu["unitPrice"]}</td>
                    <td class="col-md-1 text-center">${menu["count"] * menu["unitPrice"]}</td>
                  </tr>`;

    return returnHtml;
}

function makeMenusHtml(menus) {
    let returnHtml = ``;
    for (let i = 0; i < menus.length; i++) {
        returnHtml += getMenusHtml(menus[i]);
    }
    return returnHtml;
}

function attachOrderList(orders) {
    let returnHtml = ``;
    for (let i = 0; i < orders.length; i++) {
        returnHtml += makeOrderListHtml(orders[i]);
    }
    $("#order_list").prepend(returnHtml);
}

function makeOrderListHtml(orderInfo) {
    let customerInfo = orderInfo["customer"];
    let orderSheetInfo = orderInfo["orderSheet"];
    let bgColor = "white";
    let btnHtml = ``;
    let status = "";

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
                <button type="button" onclick="acceptOrder('${orderInfo["cafeId"]}', '${orderInfo["orderId"]}')" class="btn btn-accept btn-lg btn-block"
                        style="margin-left: 1em; margin-right: 1em" value="123">
                  주문 접수
                </button>
                <button type="button" onclick="rejectOrder('${orderInfo["cafeId"]}', '${orderInfo["orderId"]}')" class="btn btn-reject btn-lg btn-block"
                        style="margin-left: 1em; margin-right: 1em">
                  주문 거부
                </button>`;
            status = "ready";
            break;
        case 1:
            console.log("status = 1");
            bgColor = "lightskyblue";
            btnHtml = `
                <button type="button" onclick="pickUp('${orderInfo["cafeId"]}', '${orderInfo["orderId"]}')" class="btn btn-accept btn-lg btn-block"
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
                <table class="table table-hover order-font" style="margin-left: 15px; margin-right: 15px">
                  <thead>
                  <tr>
                    <th>메뉴</th>
                    <th class="text-center">수량</th>
                    <th class="text-center">단가</th>
                    <th class="text-center">금액</th>
                  </tr>
                  </thead>
                  <tbody>
                  ${makeMenusHtml(orderSheetInfo["menus"])}
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

function acceptOrder(cafeId, orderId) {
    let url = `/order/accept?cafeId=${cafeId}&orderId=${orderId}`;
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            console.log(response);
        }
    })
}

function rejectOrder(cafeId, orderId) {
    let url = `/order/reject?cafeId=${cafeId}&orderId=${orderId}`;
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            console.log(response);
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
            console.log(response);
        }
    })
}

function viewOrderList(status) {
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

function viewMenu(categoryTagId) {

    console.log("hide and show");
    console.log($("#menu-side-nav").get(0).childElementCount);
    console.log($("#add-category").attr("value"));
    $(".menu-card").hide();
    $(categoryTagId).show();

}

function toggleCategory() {
    let addBox = $("#add-category-box");
    if (addBox.css("display") == "none") {
        addBox.show();
        $("#input-category").focus();
    } else {
        addBox.hide();
    }
}

function addCategory(cafeId) {
    let categoryName = $("#input-category").val();
    if (categoryName == "") {
        alert("카테고리 이름을 적어주세요!");
        return;
    }
    let cnt = Number($("#add-category").attr("value")) + 1;
    let categoryId = "category-00" + ("0" + cnt).slice(-2);
    console.log(categoryId);

    let url = `/category/add`;
    $.ajax({
        type: "POST",
        url: url,
        data: {"cafeId": cafeId, "categoryId": categoryId, "categoryName": categoryName},
        success: function (response) {

        }
    })


    $("#add-category").attr("value", cnt);
    let categoryHtml = `
       <div onclick="viewMenu('.'+${categoryId})" value="${categoryId}">${categoryName}</div>
    `;
    $("#blank-category").before(categoryHtml)
    $("#input-category").val("");
    $("#input-category").focus();
}

function getCategory(cafeId) {
    let url = `/category/list?cafeId=${cafeId}`;
    let blank = $("#blank-category");
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            console.log(response["categories"]);
            let categories = response["categories"];
            for (let i = 0; i < categories.length; i++) {
                blank.before(makeCategory(categories[i]));
            }
            $("#add-category").attr("value", categories.length);
        }
    })

}

function makeCategory(categoryInfo) {
    let categoryId = '.' + categoryInfo["categoryId"];
    let categoryHtml = `
      <div onclick="viewMenu('${categoryId}')" value="${categoryInfo['categoryId']}">${categoryInfo["categoryName"]}</div>
    `;

    return categoryHtml;
}


