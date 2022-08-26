var furl, fname, fimg, ftext;


$.getJSON("/data.json", function (d) {
    console.log(d.data);
    
    $.each(d.data, function (key, val) {
        fname = val.name;
        furl = val.url;
        fimg = val.img;
        ftext = val.text;
        mb = `
        <a class="col-12 col-sm-6 col-lg-4 col-xxl-3 mb-3 text-decoration-none" href="${furl}">
            <div class="card text-dark bg-info overflow-hidden shadow" style="border-radius: 1rem;">
                <h5 class="card-header bg-warning text-center fw-bolder">${fname}</h5>
                <img src="${fimg}" class="card-img-top p-2" alt="img" style="height: 9rem;">
                <div class="card-body" style="height: 6rem;>
                    <p class="card-text">${ftext}</p>
                </div>
            </div>
        </a>
        `;
        $(".lbbox").append(mb);
    });
});


