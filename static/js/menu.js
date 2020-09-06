function getCategories(cafeId) {
    let url = `/category/list?cafeId=${cafeId}`;
    let blank = $("#blank-category");
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
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
      <div onclick="viewMenus('${categoryId}')" value="${categoryInfo['categoryId']}">${categoryInfo["categoryName"]}</div>
    `;

    return categoryHtml;
}

function getMenus(cafeId) {
    let url = `/menu/view?cafeId=${cafeId}`;

    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            let menus = response["menus"];
            for (let i = 0; i < menus.length; i++) {
                $("#add-menu").before(makeMenus(menus[i]));
            }

            $("#add-menu").css("display", "none");
        }
    })
}

function makeMenus(menuInfo) {
    let menuHtml =
        `
        <div class="col-md-6 col-lg-4 col-xl-3 py-2 menu-card ${menuInfo["category"]}">
          <div class="card h-100" style="border: 1px solid darkslategrey; background-color: rgb(59, 54, 54)">
            <img class="card-img-top img-fluid" src="${menuInfo["imageUrl"]}" alt="Card image cap">
            <div class="card-block" style="padding: 10px 0; background-color: #3b3636; margin: auto 0">
              <p class="card-text" style="text-align: center; color: white; background-color: #3b3636">${menuInfo["name"]}</p>
              <p class="card-text" style="text-align: center; color: white; background-color: #3b3636">${menuInfo["price"]}원</p>
            </div>
          </div>
        </div>
        `;
    return menuHtml;
}

function viewMenus(categoryTagId) {
    $(".menu-card").hide();
    $(categoryTagId).show();
    if (categoryTagId == ".menu-card") {
        $("#add-menu").css("display", "none");
    } else {
        $("#add-menu").css("display", "block");
        $("#add-menu").attr("value", categoryTagId);
    }
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

    let url = `/category/add`;
    $.ajax({
        type: "POST",
        url: url,
        data: {"cafeId": cafeId, "categoryId": categoryId, "categoryName": categoryName},
        success: function (response) {
            if (response["code"] == 200) {
                $("#add-category").attr("value", cnt);
                let categoryHtml = `
                                   <div onclick="viewMenus('.${categoryId}')" value="${categoryId}">${categoryName}</div>
                                `;
                $("#blank-category").before(categoryHtml)
                $("#input-category").val("");
                $("#input-category").focus();
            }
        }
    });

}

function imageUpload() {
    $("#upload-image").click();
}

function setImage(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            $("#add-image").attr("src", e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function addMenu(cafeId) {
    let files = $("#upload-image")[0].files[0];

    let url = `/menu/add`;
    let data = new FormData();
    data.append("cafeId", cafeId);
    data.append("categoryId", $("#add-menu").attr("value").split(".")[1]);
    data.append("menuId", "menu-0017");
    data.append("menuName", $("#input-menu-name").val());
    data.append("menuPrice", $("#input-menu-price").val());
    data.append("file", files);

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response["code"] == 200) {
                location.reload();
            }
        }
    });
}