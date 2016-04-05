define(["utils", "vector", "test", "particle"], function(U, Vector, T, Particle) {
    function ParticleSwarm(args) {
        U.keyValuesDefined("numberOfParticles", "funct", "range", args);

        var range = args.range;
        this.dimension = range.length();
        this.funct = args.funct;
        this.bestPosition = new Vector();
        this.bestPosition.resetLength(this.dimension);
        this.bestFitness = null

        this.particles = [];
        this.localBestPosition = [];
        this.localBestFitness = [];

        //Initializing particles
        for (var i = 0; i < args.numberOfParticles; i++) {

            //Creating a new array representing the position vector of the particle
            var positionArray = [];
            for (var dimension = 0; dimension < range.length(); dimension++) {
                positionArray.push(Math.random() * range.at(dimension));
            }

            //Creating the vector from the positionArray
            var positionVector = new Vector();
            positionVector.set(positionArray);

            //Setting the bestFitness and bestPosition variables if necessary
            var fitness = this.getFitness(positionVector);

            //Creating the particle
            this.particles.push(new Particle(positionVector));
            this.particles[i].velocity = new Vector(Math.random() * 5, Math.random() * 5)

            //Initializing the particle's localBest
            this.localBestPosition.push(positionVector);
            this.localBestFitness.push(fitness);
        }

        T.assert(args.numberOfParticles == this.particles.length);
        this.assertState();
    }

    ParticleSwarm.prototype.getFitness = function(vector) {
        var fitness = this.funct(vector);
        if (this.bestFitness == null || Math.abs(fitness) < this.bestFitness) {
            this.bestFitness = Math.abs(fitness);
            this.bestPosition = vector.clone();
        }
        return fitness;
    }

    /**
     * Should only really be called by outside party who knows that the fitness function has changed
     */

    ParticleSwarm.prototype.reset = function() {
        this.bestFitness = Math.abs(this.funct(this.bestPosition));
        for (var particleKey in this.particles) {
            this.localBestFitness[particleKey] = this.getFitness(this.localBestPosition[particleKey]);
        }
    }

    ParticleSwarm.prototype.iterate = function() {
        for (var particleKey in this.particles) {

            var particle = this.particles[particleKey];
            var localBestPosition = this.localBestPosition[particleKey];
            var localBestFitness = this.localBestFitness[particleKey];
            var bestPosition = this.bestPosition;
            var accelerationArray = [];

            for (var dimension = 0; dimension < this.dimension; dimension++) {
                accelerationArray.push(Math.random() * 0.001 * (bestPosition.at(dimension) - particle.position.at(dimension)) 
                                     + Math.random() * 0.001 * (localBestPosition.at(dimension) - particle.position.at(dimension)));
            }
            particle.setAcceleration(new Vector(accelerationArray));
            particle.iterate();
            var fitness = this.getFitness(particle.position);
            if (Math.abs(fitness) < localBestFitness) {
                this.localBestFitness[particleKey] = fitness;
                this.localBestPosition[particleKey] = particle.position.clone();
            }

            if (this.localBestFitness[particleKey] < 1) {
                this.particles[particleKey].velocity = this.particles[particleKey].velocity.multiply(0.9);
            }
        }
    }

    ParticleSwarm.prototype.draw2d = function(context) {
        if (this.dimension != 2) {
            throw new E.IllegalStateException("Swarm is not 2 dimensional.");
        }
        for (var particleKey in this.particles) {
            var particle = this.particles[particleKey];
            context.fillStyle = "#ff0000";
            context.fillRect(particle.position.x(), particle.position.y(), 2, 2);
        }
    }

    ParticleSwarm.prototype.assertState = function() {
        T.assert(this.bestPosition.length() == this.dimension);
        T.assert(this.localBestPosition.length == this.particles.length);
        T.assert(this.localBestPosition.length == this.localBestFitness.length);
    }

    ParticleSwarm.tests = {
    };

    T.addTestable(ParticleSwarm);
    return ParticleSwarm;
});
