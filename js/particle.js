define(["vector", "test"], function(Vector, T) {
    function Particle(position) {
        this.position = position;
        this.velocity = new Vector();
        this.velocity.resetLength(position.length());
        this.acceleration = new Vector();
        this.acceleration.resetLength(position.length());
        this.friction = 1;
        this.assertState();
    }

    Particle.prototype.iterate = function() {
        this.velocity = this.velocity.sum(this.acceleration);
        this.velocity = this.velocity.multiply(this.friction);
        this.position = this.position.sum(this.velocity);
    };

    Particle.prototype.setAcceleration = function(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error("setAcceleration's argument must be a Vector");
        }
        if (vector.length() != this.position.length()) {
            throw new Error("acceleration vector must be the same length as position vector");
        }
        this.acceleration = vector.clone();
    };

    Particle.prototype.assertState = function() {
        T.assert(this.position.length() == this.velocity.length());
        T.assert(this.velocity.length() == this.acceleration.length());
    }

    Particle.tests = {
        constructor: function() {
            var particle = new Particle(new Vector(1, 2, 3));
            T.assert(particle.position.at(0) == 1);
            T.assert(particle.position.at(1) == 2);
            T.assert(particle.position.at(2) == 3);
            T.assert(particle.velocity.at(0) == 0 && particle.velocity.length() == 3);
            T.assert(particle.velocity.at(1) == 0);
            T.assert(particle.velocity.at(2) == 0);
            T.assert(particle.acceleration.at(0) == 0 && particle.velocity.length() == 3);
            T.assert(particle.acceleration.at(1) == 0);
            T.assert(particle.acceleration.at(2) == 0);
        },

        iterate: function() {
            var particle = new Particle(new Vector(1, 2, 3));
            particle.setAcceleration(new Vector(1, 1, 1));
            particle.iterate();
            T.assert(particle.position.at(0) == 2);
            T.assert(particle.position.at(1) == 3);
            T.assert(particle.position.at(2) == 4);
            T.assert(particle.velocity.at(0) == 1);
            T.assert(particle.velocity.at(1) == 1);
            T.assert(particle.velocity.at(2) == 1);
            particle.iterate();
            T.assert(particle.position.at(0) == 4);
            T.assert(particle.position.at(1) == 5);
            T.assert(particle.position.at(2) == 6);
            T.assert(particle.velocity.at(0) == 2);
            T.assert(particle.velocity.at(1) == 2);
            T.assert(particle.velocity.at(2) == 2);
        }
    };

    T.addTestable(Particle);
    return Particle;
})