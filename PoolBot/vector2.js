// @ts-check
"use strict";

class Vector2 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = 0;
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    copy() {
        return new Vector2(this.x, this.y, this.z);
    }

    dist(v) {
        return v
            .copy()
            .sub(this)
            .mag();
    }

    magSq() {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return x * x + y * y + z * z;
    }

    normalize() {
        var len = this.mag();
        // here we multiply by the reciprocal instead of calling 'div()'
        // since div duplicates this zero check.
        if (len !== 0) {
            this.mult(1 / len);
        }

        return this;
    }

    set(x, y, z) {
        if (x instanceof Vector2) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x = x[0] || 0;
            this.y = x[1] || 0;
            this.z = x[2] || 0;
            return this;
        }
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        return this;
    }

    add(x, y, z) {
        if (x instanceof Vector2) {
            this.x += x.x || 0;
            this.y += x.y || 0;
            this.z += x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x += x[0] || 0;
            this.y += x[1] || 0;
            this.z += x[2] || 0;
            return this;
        }
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
        return this;
    }

    sub(x, y, z) {
        if (x instanceof Vector2) {
          this.x -= x.x || 0;
          this.y -= x.y || 0;
          this.z -= x.z || 0;
          return this;
        }
        if (x instanceof Array) {
          this.x -= x[0] || 0;
          this.y -= x[1] || 0;
          this.z -= x[2] || 0;
          return this;
        }
        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;
        return this;
      }
      
    setMag(n) {
        return this.normalize().mult(n);
    }

    
    mult(n) {
        if (!(typeof n === 'number' && isFinite(n))) {
            throw "NaN"; 
          console.warn(
            'p5.Vector.prototype.mult:',
            'n is undefined or not a finite number ' + n
          );
          return this;
        }
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
      }
            
    static fromAngle(angle, length) {
        if (typeof length === 'undefined') {
            length = 1;
        }
        return new Vector2(length * Math.cos(angle), length * Math.sin(angle), 0);
    }

    static sub(v1, v2, target) {
        if (!target) {
            target = v1.copy();
        } else {
            target.set(v1);
        }
        target.sub(v2);
        return target;
    }

    static mult(v, n, target) {
        if (!target) {
            target = v.copy();
        } else {
            target.set(v);
        }
        target.mult(n);
        return target;
    };

    static div(v, n, target) {
        if (!target) {
            target = v.copy();
        } else {
            target.set(v);
        }
        target.div(n);
        return target;
    };
}

if (typeof module !== 'undefined') {
    module.exports = Vector2;
}
