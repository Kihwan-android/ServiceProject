function sendMail(cafeId) {
    let url = `/contact/send`;
    let cafeName = $("#contact-cafe-name").val();
    let cafeEmail = $("#contact-cafe-email").val();
    let requireContent = $("#contact-require-content").val();

    let data = {
        "cafeId": cafeId,
        "cafeName": cafeName,
        "cafeEmail": cafeEmail,
        "require": requireContent
    };

    $.ajax({
        url: url,
        type: "POST",
        data: data,
        success: function (response) {
            if(response["code"] == 200) {
                location.reload();
            }
        }
    });
}