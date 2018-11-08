document.addEventListener("DOMContentLoaded", event => {

    let mouseDown = false;

    document.body.onmouseup = function() {
        mouseDown = false;
    };
    document.body.onmousedown = function() {
        mouseDown = true;
    };

    let horizontalOffset = 0;

    const surface = document.getElementById("drawing_surface");
    const context = surface.getContext("2d");

    surface.height = 700;
    surface.width = 800;

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        surface.height = 700;
        surface.width = 800;
        horizontalOffset = (window.innerWidth - 800) / 2;
    }
    resizeCanvas();

    document.getElementById('stroke_control').onchange = function() {
        context.stroke();
        context.beginPath();
        context.lineWidth = document.getElementById('stroke_control').value / 10.0;
    };

    const pickr = Pickr.create({
        el: '.color-picker',

        components: {

            // Main components
            preview: false,
            opacity: false,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: true,
                save: true
            }
        },

        onSave(c, _) {
            context.stroke();
            context.beginPath();
            context.strokeStyle = c.toHEX().toString();
        }
    });

    document.getElementById('color').addEventListener('click', _ => {
        pickr.show();
    });

    function freehand() {

        let isDrawing = false;

        let points = [];
        let pointsCount = 0;

        const mouseMoveListener = function (e) {
            pointsCount++;
            points[pointsCount] = {x: e.clientX - horizontalOffset, y: e.clientY - 72};

            if (pointsCount === 2) {
                context.moveTo(points[0].x, points[0].y);
                context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
                context.stroke();

                points[0] = points[2];
                pointsCount = 0;
            }
        };

        surface.onmousedown = function(e) {
            context.beginPath();
            //context.moveTo(e.clientX, e.clientY);

            pointsCount = 0;
            points[0] = {x: e.clientX - horizontalOffset, y: e.clientY - 72};

            isDrawing = true;
            mouseDown = true;
            surface.onmousemove = mouseMoveListener;
        };

        surface.onmouseup = function(e) {
            // surface.removeEventListener("mousemove", mouseMoveListener);
            surface.onmousemove = function() {};
            isDrawing = false;
        };

        surface.onmouseenter = function (e) {
            if (!mouseDown) {
                isDrawing = false;
            }
            if (isDrawing) {
                points[0] = {x: e.clientX - horizontalOffset, y: e.clientY - 72};
                pointsCount = 0;
                surface.onmousemove = mouseMoveListener;
            }
        };

        surface.onmouseleave = function() {
            if (isDrawing) {
                // surface.removeEventListener("mousemove", mouseMoveListener);
                surface.onmousemove = function() {};
            }
        };
    }

    freehand();

    document.getElementById('freehand').addEventListener('click', freehand);

    document.getElementById('line').addEventListener('click', _ => {
       surface.onmousedown = function (e) {
           context.moveTo(e.clientX - horizontalOffset, e.clientY - 72);
       };

       surface.onmouseup = function (e) {
           context.lineTo(e.clientX - horizontalOffset, e.clientY - 72);
           context.stroke();
       }
    });

    document.getElementById('square').addEventListener('click', _ => {

        let startPoint = {x: 0, y: 0};

        surface.onmousedown = function (e) {
            startPoint = {x: e.clientX, y: e.clientY};
        };

        surface.onmouseup = function (e) {

            context.moveTo(
                startPoint.x - horizontalOffset,
                startPoint.y - 72
            );

            context.rect(startPoint.x - horizontalOffset, startPoint.y - 72, e.clientX - startPoint.x, e.clientY - startPoint.y );
            context.stroke();
        }
    });

    document.getElementById('circle').addEventListener('click', _ => {

        let startPoint = {x: 0, y: 0};

        surface.onmousedown = function (e) {
            startPoint = {x: e.clientX, y: e.clientY};
        };

        surface.onmouseup = function (e) {
            const width = e.clientX - startPoint.x;
            const height = e.clientY - startPoint.y;

            const offset = width > 0 ? width : 0;

            context.moveTo(
                startPoint.x - horizontalOffset + offset,
                startPoint.y - 72 + height / 2
            );

            context.ellipse(
                startPoint.x - horizontalOffset + width / 2,
                startPoint.y - 72 + height / 2,
                Math.abs(width / 2),
                Math.abs(height / 2),
                0, // rotation
                0, // start angle
                2 * Math.PI // end angle
            );

            context.stroke();
        }
    });
});