function getReviews(cafeId) {
    let url = `/review/list?cafeId=${cafeId}`
    $.ajax({
        type: "GET",
        url: url,
        data: {},
        success: function (response) {
            let reviews = response["reviews"];
            for (let i = 0; i < reviews.length; i++) {
                $("#review-board").prepend(makeReviews(reviews[i]));
            }
        }
    });
}

function makeReviews(review) {
    let nickname = review["nickname"];
    let date = review["time"];
    let score = review["score"];
    let imageUrl = review["menu"]["imageUrl"];
    let description = review["description"];

    let reviewHtml = `
    <table class="review-item">
      <tr>
        <td>${date}</td>
        <td>${nickname}</td>
        <td>${score}</td>
      </tr>
      <tr>
        <td rowspan="3" style="width: 15%;">
          <img class="card-img-top img-fluid" src="${imageUrl}" style="height: auto"/>
        </td>
        <td rowspan="3" colspan="2">${description}</td>
      </tr>
    </table>
    `;

    return reviewHtml;
}