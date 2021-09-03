// gsap animation
var tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".home",
        start: "top center"
    }
});
tl.from(".text_home", { duration: 1, y: -50, opacity: 0 })
    .from(".img_home", { duration: 1, y: -50, opacity: 0 })

var tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".about",
        start: "top center"
    }
});
tl.from(".text_about", { duration: 1, y: 50, opacity: 0 })
    .from(".img_about", { duration: 1, y: 50, opacity: 0 })
    // MENU EFFECT
var tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".team",
        start: "top center"
    }
});
tl.from(".title_team", { duration: 1, y: -50, opacity: 0 })
    .from(".box", { duration: 1, y: -50, opacity: 0 })
    // MENU EFFECT
var tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".one_person",
        start: "top center"
    }
});
tl.from(".title", { duration: 1, y: -50, opacity: 0 })
    .from(".img_one", { duration: 1, y: -50, opacity: 0 })
    .from(".text_one", { duration: 1, y: -50, opacity: 0 })

// MENU EFFECT

var menu = document.querySelector(".menu");
var icon = document.querySelector(".icon");

icon.addEventListener("click", () => {
    menu.classList.toggle("active");
})

//  background animation
// 333333333333333333333333333333333333####################################################################################################33


// ----------------- //
// requestAnimFrame  //
// ----------------- //
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// ----------------- //
// variables         //
// ----------------- //

// get canvas DOM element
var canvas = document.getElementById("canvas");


// Initialize the context of the canvas
var ctx = canvas.getContext("2d");

// Set the canvas width and height to occupy full window
var W = window.innerWidth,
    H = window.innerHeight;
canvas.width = W;
canvas.height = H;

// Mouse
var mouse = { x: 0, y: 0 };

// Some vars for later use
var particles = [],
    minDist = 110,
    dist;

// ----------------- //
// Lauch             //
// ----------------- //
animate();
addListeners();



// ----------------- //
// Objects           //
// ----------------- //

// particle object
function Particle(x, y) {
    // coordinates
    this.x = x;
    this.y = y;

    // velocity factor
    this.vx = -1 + Math.random() * 2;
    this.vy = -1 + Math.random() * 2;


    // radius 
    this.radius = 3;
    //color and opacity
    this.color = { r: 87, g: 173, b: 238 };
    this.opacity = 1;

    // paint
    this.paint = function() {
        ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    //accelerate (not use here)
    this.accelerate = function(x, y) {
        var ax = x / 5000,
            ay = y / 5000;

        // acceleration on the particles
        this.vx -= ax;
        this.vy -= ay;

    }
}

// populate canvas with particle
for (var x = 0; x < W; x = x + W / 10) {
    for (var y = 0; y < H; y = y + H / 10) {
        var px = x + Math.random() * W / 20;
        var py = y + Math.random() * H / 20;
        p = new Particle(px, py);
        particles.push(p);
        particleAnimation(p); // THE tween touch :)
    }
}

// -------------- //
// Rendering      //
// -------------- //

// rendering loop
function render() {
    // paint canvas
    paintCanvas();

    // paint all particles in particles array 
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        p.paint();
    }

    //Finally call the update function
    update();
}

// each frames particles update
function update() {
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];

        // check particle/mouse distance
        var mouseDistance = getDistance(p, mouse);

        if (mouseDistance.d <= minDist) {

            // neighboring particles
            for (var j = i + 1; j < particles.length; j++) {
                p2 = particles[j];

                var distance = getDistance(p, p2);

                // not so far, process this one
                if (distance.d <= minDist) {
                    paintLine(p.x, p.y, p2.x, p2.y, distance.d);

                    p.accelerate(distance.dx, distance.dy);
                    p.opacity = 1;

                    p2.accelerate(distance.dx, distance.dy);
                    p2.opacity = 1;
                }
            }
        }

        if (p.opacity > 0) p.opacity -= .08;
    }
}

// -------------- //
// Utilitie       //
// -------------- //

// get distance
function getDistance(p1, p2) {
    var d,
        dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    d = Math.sqrt(dx * dx + dy * dy);

    // return an array with different metrics
    return {
        'd': d, // global distance
        'dx': dx, // x distance
        'dy': dy, // y distance
    };
}

// -------------- //
// Paints         //
// -------------- //

// Function to paint the canvas black
function paintCanvas() {
    ctx.fillStyle = "rgba(255,255,255,255)";
    ctx.fillRect(0, 0, W, H);
}
// Function to paint a line
function paintLine(x1, y1, x2, y2, opacity) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(87,173,238," + (1.2 + opacity / minDist) + ")";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = .4;
    ctx.stroke();
}


// -------------- //
// Events         //
// -------------- //
function addListeners() {
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mouseMove);
}

// Resize event
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}
// Mouse event 
function mouseMove(e) {
    var posx = posy = 0;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    mouse.x = posx;
    mouse.y = posy;
}

// -------------- //
// Animate        //
// -------------- //

// MAGIC !!
function particleAnimation(p) {
    TweenLite.to(p,
        3 + 1 * Math.random(), {
            x: p.x - 50 + Math.random() * 100,
            y: p.y - 50 + Math.random() * 100,
            ease: Back.easeInOut,
            onComplete: function() {
                particleAnimation(p);
            }
        });

}


function animate() {
    requestAnimFrame(animate);
    render();
}

// animation dev
//#################################################################################################################33


function fitElementToParent(el, padding) {
    var timeout = null;

    function resize() {
        if (timeout) clearTimeout(timeout);
        anime.set(el, { scale: 1 });
        var pad = padding || 0;
        var parentEl = el.parentNode;
        var elOffsetWidth = el.offsetWidth - pad;
        var parentOffsetWidth = parentEl.offsetWidth;
        var ratio = parentOffsetWidth / elOffsetWidth;
        timeout = setTimeout(anime.set(el, { scale: ratio }), 10);
    }
    resize();
    window.addEventListener('resize', resize);
}

var layeredAnimation = (function() {

    var transformEls = document.querySelectorAll('.transform-progress');
    var layeredAnimationEl = document.querySelector('.layered-animations');
    var shapeEls = layeredAnimationEl.querySelectorAll('.shape');
    var triangleEl = layeredAnimationEl.querySelector('polygon');
    var trianglePoints = triangleEl.getAttribute('points').split(' ');
    var easings = ['easeInOutQuad', 'easeInOutCirc', 'easeInOutSine', 'spring'];

    fitElementToParent(layeredAnimationEl);

    function createKeyframes(value) {
        var keyframes = [];
        for (var i = 0; i < 30; i++) keyframes.push({ value: value });
        return keyframes;
    }

    function animateShape(el) {

        var circleEl = el.querySelector('circle');
        var rectEl = el.querySelector('rect');
        var polyEl = el.querySelector('polygon');

        var animation = anime.timeline({
                targets: el,
                duration: function() { return anime.random(600, 2200); },
                easing: function() { return easings[anime.random(0, easings.length - 1)]; },
                complete: function(anim) { animateShape(anim.animatables[0].target); },
            })
            .add({
                translateX: createKeyframes(function(el) {
                    return el.classList.contains('large') ? anime.random(-300, 300) : anime.random(-520, 520);
                }),
                translateY: createKeyframes(function(el) {
                    return el.classList.contains('large') ? anime.random(-110, 110) : anime.random(-280, 280);
                }),
                rotate: createKeyframes(function() { return anime.random(-180, 180); }),
            }, 0);
        if (circleEl) {
            animation.add({
                targets: circleEl,
                r: createKeyframes(function() { return anime.random(32, 72); }),
            }, 0);
        }
        if (rectEl) {
            animation.add({
                targets: rectEl,
                width: createKeyframes(function() { return anime.random(64, 120); }),
                height: createKeyframes(function() { return anime.random(64, 120); }),
            }, 0);
        }
        if (polyEl) {
            animation.add({
                targets: polyEl,
                points: createKeyframes(function() {
                    var scale = anime.random(72, 180) / 100;
                    return trianglePoints.map(function(p) { return p * scale; }).join(' ');
                }),
            }, 0);
        }

    }

    for (var i = 0; i < shapeEls.length; i++) {
        animateShape(shapeEls[i]);
    }

})();


// #######################################################################333

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml16');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({ loop: true })
    .add({
        targets: '.ml16 .letter',
        translateY: [-100, 0],
        easing: "easeOutExpo",
        duration: 1400,
        delay: (el, i) => 30 * i
    }).add({
        targets: '.ml16',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });