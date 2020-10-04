class Verticle {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
        this.oldX = X;
        this.oldY = Y;
        this.accelerationX = 0;
        this.accelerationY = 0.05;
    }
}
class Edge {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.originalLength = Math.sqrt(Math.pow(a.X - b.X, 2) + Math.pow(a.Y - b.Y, 2));
    }
}
let edges = []
let verticles = []
let center = new Verticle(300, 300);
let current = new Verticle(200, 200);
let ccount = 18
for (let i = 0; i < ccount; i++) {
    let xx = current.X
    let yy = current.Y
    verticles.push(new Verticle(xx, yy))
    current.X -= center.X;
    current.Y -= center.Y;
    let angl = ((360 / ccount) * (Math.PI / 180));
    let oldCurX = current.X
    let oldCurY = current.Y
    current.X = oldCurX * Math.cos(angl) - oldCurY * Math.sin(angl)
    current.Y = oldCurX * Math.sin(angl) + oldCurY * Math.cos(angl)
    current.X += center.X;
    current.Y += center.Y;
}
for (let i = 0; i < ccount; i++) {
    for (let j = 0; j < ccount; j++) {
        if (i != j) {
            edges.push(new Edge(verticles[i], verticles[j]));
        }
    }
}


var canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var context = canvas.getContext("2d")
context.strokeStyle = "black"
context.fillStyle = "black"
context.fillRect(0, 0, canvas.width, canvas.height)
canvas.addEventListener('click', function (event) {
    for (var i = 0; i < verticles.length; i++) {

        verticles[i].Y += (event.clientY - verticles[i].Y) / 20;
        verticles[i].X += (event.clientX - verticles[i].X) / 20;

    }
})
window.requestAnimationFrame(function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < verticles.length; i++) {
        let aoX = verticles[i].X
        let aoY = verticles[i].Y
        verticles[i].X += verticles[i].X - verticles[i].oldX + verticles[i].accelerationX
        verticles[i].Y += verticles[i].Y - verticles[i].oldY + verticles[i].accelerationY
        if (verticles[i].X >= canvas.width)
            verticles[i].X = canvas.width - 0.1
        if (verticles[i].Y >= canvas.height)
            verticles[i].Y = canvas.height - 0.1
        if (verticles[i].X <= 0)
            verticles[i].X = 0.1
        if (verticles[i].Y <= 0)
            verticles[i].Y = 0.1
        verticles[i].oldX = aoX;
        verticles[i].oldY = aoY;
    }
    for (var i = 0; i < edges.length; i++) {
        let a = edges[i].a
        let b = edges[i].b
        let wantedLen = edges[i].originalLength
        let currLen = Math.sqrt(Math.pow(a.X - b.X, 2) + Math.pow(a.Y - b.Y, 2))
        let coef = currLen / wantedLen
        let onceCoef = 1 + ((1 - coef) / 200)
        let diff = new Verticle(a.X - b.X, a.Y - b.Y)
        edges[i].b.X = edges[i].a.X - diff.X * onceCoef;
        edges[i].b.Y = edges[i].a.Y - diff.Y * onceCoef;
        edges[i].a.X = edges[i].b.X + diff.X * onceCoef;
        edges[i].a.Y = edges[i].b.Y + diff.Y * onceCoef;

        context.beginPath();
        context.moveTo(edges[i].a.X, edges[i].a.Y);
        context.lineTo(edges[i].b.X, edges[i].b.Y);
        context.stroke();
    }
    window.requestAnimationFrame(loop)
})