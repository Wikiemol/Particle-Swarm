var t;
define(["particleswarm", "utils", "vector", "test"], function main(ParticleSwarm, U, Vector, T) {
    t = T;
    var canvas = document.getElementById("canvas");
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.position = "absolute";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = "#000000";

    var ctx = canvas.getContext('2d');

    var target = new Vector(canvas.width / 2, canvas.height / 2);
    var particleswarm = new ParticleSwarm({
    	"numberOfParticles": 1000,
    	"funct": (function(position) { 
            var subtract = target.minus(position);
            return subtract.dot(subtract);
    	}), 
        "range": new Vector(canvas.width / 4, canvas.height / 4)
    });

    window.addEventListener("mousemove", function(e) {
        particleswarm.reset();
        target.position[0] = e.clientX;
        target.position[1] = e.clientY;
    }, false);

    var t = 0;
    var interval = setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particleswarm.iterate();
        particleswarm.draw2d(ctx);
        if (particleswarm.bestFitness == 0) {
            clearInterval(interval);
        }
        if (t % 100 == 0) {
            console.log(particleswarm.bestFitness)
        }
        t++;
    }, 33);
});
