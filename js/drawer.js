document.addEventListener("DOMContentLoaded", event => {

    let mouseDown = false;

    document.body.onmouseup = function() {
        mouseDown = false;
    };
    document.body.onmousedown = function() {
        mouseDown = true;
    };

    const surface = document.getElementById("drawing_surface");
    const context = surface.getContext("2d");

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        surface.width = window.innerWidth;
        surface.height = window.innerHeight - 72;

    }
    resizeCanvas();

    document.getElementById('stroke_control').onchange = function() {
        context.lineWidth = document.getElementById('stroke_control').value / 10.0;
        console.log(document.getElementById('stroke_control').value / 10.0);
    };

    console.log(surface);
    console.log(context);

    let isDrawing = false;

    let points = [];
    let pointsCount = 0;

    const mouseMoveListener = function (e) {
        //context.lineTo(e.clientX, e.clientY);
        //context.stroke();
        pointsCount++;
        points[pointsCount] = {x: e.clientX, y: e.clientY - 72};

        if (pointsCount === 2) {
            context.moveTo(points[0].x, points[0].y);
            context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
            context.stroke();

            points[0] = points[2];
            pointsCount = 0;
        }
    };

    surface.addEventListener("mousedown", e => {
        context.beginPath();
        //context.moveTo(e.clientX, e.clientY);

        pointsCount = 0;
        points[0] = {x: e.clientX, y: e.clientY - 72};

        isDrawing = true;
        mouseDown = true;
        surface.addEventListener("mousemove", mouseMoveListener);
    });

    surface.addEventListener("mouseup", e => {
        surface.removeEventListener("mousemove", mouseMoveListener);
        isDrawing = false;
    });

    surface.addEventListener("mouseenter", e => {
        if (!mouseDown) {
            isDrawing = false;
        }
        if (isDrawing) {
            points[0] = {x: e.clientX, y: e.clientY - 72};
            pointsCount = 0;
            surface.addEventListener("mousemove", mouseMoveListener);
        }
    });

    surface.addEventListener("mouseleave", e => {
        if (isDrawing) {
            surface.removeEventListener("mousemove", mouseMoveListener);
        }
    });
});