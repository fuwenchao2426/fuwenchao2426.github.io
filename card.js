var furl, fname, fimg, ftext;



$.getJSON("/data.json", function (d) {
    console.log(d.data);
    $.each(d.data, function (key, val) {
        fname = val.name;
        furl = val.url;
        fimg = val.img;
        ftext = val.text;
        mb = `
        <div class="col mb-2">
        <a href="${furl}" class="text-decoration-none">
            <div class="fcard container shadow-sm overflow-hidden p-0">
                <div class="col fheader bg-warning text-center">${fname}</div>
                <div class="row h-100 p-3 bg-primary bg-opacity-50 text-white">
                    <div class="col-4"><img src="${fimg}" alt="" class="pic bg-success w-100"></div>
                    <div class="col-8">${ftext}</div>
                </div>
            </div>
        </a>
        </div>
        `;
        $(".lbbox").append(mb);
    });
});


