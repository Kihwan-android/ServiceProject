function login() {
    let userId = $("#input-id").val();
    let userPw = $("#input-pw").val();

    if (userId == "" || userPw == "") {
        alert("아이디 또는 비밀번호를 확인해주세요");
        return;
    }

    let url = `/login`;
    $.ajax({
        type: "POST",
        url: url,
        data: {"userId": userId, "userPw": userPw},
        success: function (response) {
            // console.log("response : " + response["code"]);
            switch (response["code"]) {
                case 200:
                    location.href = "order";
                    break;
                case 204:
                    alert("아이디 또는 비밀번호를 확인해주세요")
                    break;
                default:
            }
        }
    });
}