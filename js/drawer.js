document.addEventListener("DOMContentLoaded", event => {
    const surface = document.getElementById("drawing_surface");
    const context = surface.getContext("2d");

    console.log(surface);
    console.log(context);

    const mouseMoveListener = function (e) {
        context.lineTo(e.clientX, e.clientY);
        context.stroke();
    };

    let isDrawing = false;

    surface.addEventListener("mousedown", e => {
        context.beginPath();
        context.moveTo(e.clientX, e.clientY);
        isDrawing = true;
        surface.addEventListener("mousemove", mouseMoveListener);
    });

    surface.addEventListener("mouseup", e => {
        surface.removeEventListener("mousemove", mouseMoveListener);
        isDrawing = false;
    });

    surface.addEventListener("mouseover", e => {
        if (isDrawing) {
            context.moveTo(e.clientX, e.clientY);
            surface.addEventListener("mousemove", mouseMoveListener);
        }
    });

    surface.addEventListener("mouseout", e => {
        if (isDrawing) {
            surface.removeEventListener("mousemove", mouseMoveListener);
        }
    });
});