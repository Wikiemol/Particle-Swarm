define(["utils", "exceptions", "test"], function(U, E, T) {
	function Vector(array) {
		if (arguments.length === 1) {
			this.position = array;
		} else {
			this.position = Array.prototype.slice.call(arguments);
		}
		this.assertState();
	}

	Vector.prototype.clone = function() {
		var clone = new Vector();
		clone.set(this.position.slice(0));
		return clone;
	}

	Vector.prototype.resetLength = function(size) {
		this.position = [];
		for (var i = 0; i < size; i++) {
			this.position.push(0);
		}
	}

	Vector.prototype.toString = function() {
		return this.position.toString();
	}

	Vector.prototype.set = function(array) {
		if (arguments.length === 1) {
			this.position = array;
		} else {
			this.position = Array.prototype.slice.call(arguments);
		}
	}

	Vector.prototype.x = function() {
		return this.at(0);
	}

	Vector.prototype.y = function() {
		return this.at(1);
	}

	Vector.prototype.z = function() {
		return this.at(2);
	}

	Vector.prototype.w = function() {
		return this.at(3);
	}

	Vector.prototype.at = function(i) {
		if (i >= this.length()) {
			throw new E.IndexOutOfBoundsException();
		}
		return this.position[i];
	}

	Vector.prototype.dot = function(vector2) {
		if (vector2.length() != this.length()) {
			throw new E.IllegalArgumentException("Vectors cannot be of different length in dot product");
		}

		var sum = 0;
		for (var i = 0; i < this.length(); i++) {
			sum += this.at(i) * vector2.at(i);
		}

		return sum;
	}

	Vector.prototype.multiply = function(scalar) {
		var result = this.clone();
		for (var i = 0; i < this.length(); i++) {
			result.position[i] *= scalar;
		}
		return result;
	}

	Vector.prototype.magnitude = function() {
		return Math.sqrt(this.dot(this));
	}

	Vector.prototype.sum = function(vector2) {
		if (vector2.length() != this.length()) {
			throw new E.IllegalArgumentException("Vectors cannot be of different length in sum");
		}
		var sum = [];
		for (var i = 0; i < this.length(); i++) {
			sum.push(this.at(i) + vector2.at(i));
		}
		var result = new Vector();
		result.set(sum);
		return result;
	}

	Vector.prototype.minus = function(vector2) {
		return this.sum(vector2.multiply(-1));
	}

	Vector.prototype.length = function() {
		return this.position.length;
	}

	//-- Implementing methods required for test --//
	Vector.prototype.assertState = function() {
		if (!Array.isArray(this.position)) {
			throw new E.IllegalStateException("Vector position must remain an Array.");
		}
	}

	Vector.tests = {
		dot : function() {
			var vector = new Vector(1, 2, 3);
			T.assert(vector.dot(new Vector(3, 2, 1)) == 3 + 4 + 3);
		},

		x : function() {
			var vector = new Vector(1, 2, 3);
			T.assert(vector.x() == 1);
		},

		y : function() {
			var vector = new Vector(1, 2, 3);
			T.assert(vector.y() == 2);
		},

		z : function() {
			var vector = new Vector(1, 2, 3);
			T.assert(vector.z() == 3);
		},

		w : function() {
			var vector = new Vector(1, 2, 3, 4);
			T.assert(vector.w() == 4);
		},

		at: function() {
			var vector = new Vector(1, 2, 3, 4);
			T.assert(vector.at(0) == 1);
			T.assert(vector.at(1) == 2);
			T.assert(vector.at(2) == 3);
			T.assert(vector.at(3) == 4);
			var error = null;
			try {
				vector.at(4);
			} catch (e) {
				error = e;
			}
			T.assert(error != null);
		},

		length: function() {
			var vector = new Vector(1, 2, 3, 4);
			T.assert(vector.length() == 4);
			vector = new Vector();
			T.assert(vector.length() == 0);
		},

		set: function() {
			var vector = new Vector(1, 2, 3, 4);
			vector.set([5, 6, 7, 8]);
			T.assert(vector.length() == 4);
			T.assert(vector.at(0) == 5);
			T.assert(vector.at(1) == 6);
			T.assert(vector.at(2) == 7);
			T.assert(vector.at(3) == 8);
			vector.set(0, 1, 2);
			T.assert(vector.length() == 3);
			T.assert(vector.at(0) == 0);
			T.assert(vector.at(1) == 1);
			T.assert(vector.at(2) == 2);
		}, 

		sum: function() {
			var vector =  new Vector(1, 2, 3);
			var vector2 = new Vector(4, 5, 6);
			var sum = vector.sum(vector2);
			T.assert(sum.at(0) == 5);
			T.assert(sum.at(1) == 7);
			T.assert(sum.at(2) == 9);
		},

		clone: function() {
			var vector =  new Vector(1, 2, 3);
			var newVector = vector.clone();
			T.assert(newVector.at(0) == 1);
			T.assert(newVector.at(1) == 2);
			T.assert(newVector.at(2) == 3);
			T.assert(newVector != vector);
		}
	}

	T.addTestable(Vector);
	return Vector;
})