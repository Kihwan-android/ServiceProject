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
      <tr style="border: 2px solid white;">
        <td style="border: 2px solid white;">${date}</td>
        <td style="border: 2px solid white;">${nickname}</td>
        <td style="border: 2px solid white;">${score}</td>
      </tr>
      <tr style="border: 2px solid white;">
        <td rowspan="3" style="width: 15%; border: 2px solid white;">
          <img class="card-img-top img-fluid" src="${imageUrl}" style="height: auto"/>
        </td>
        <td rowspan="3" colspan="2">${description}</td>
      </tr>
    </table>
    `;

    return reviewHtml;
}