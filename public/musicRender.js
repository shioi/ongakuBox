function renderSheet(value) {
    const endpoint = "/getdata/" + value
    fetch(endpoint, {
        method: 'GET'
    })
        .then((response) => response.text())
        .then((data) => {
            var osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdContainer");
            osmd.setOptions({
                backend: "svg",
                drawTitle: true,
            });
            osmd
                .load(data)
                .then(
                    function () {
                        osmd.render();
                    }
                );
        })
}