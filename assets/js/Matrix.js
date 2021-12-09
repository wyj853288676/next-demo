//自定义transform Matrix 类
/**
 *  a  c  e  
 *  b  d  f
 *  0  0  1
 */
const isArray = function (a) {
    return Object.prototype.toString.call(a) == '[object Array]';
}
const Matrix = function (a, b, c, d, e, f) {
    let params;
    if (arguments.length === 0 || arguments[0] === 'none' || arguments[0] === '' || arguments[0] === undefined || arguments[0] === null) {
        return new Matrix(1, 0, 0, 1, 0, 0);
    } else if (isArray(a)) {
        params = a;
    } else if (typeof a === 'string') {
        a = a.replace(/[^\d,.-]/g, '');
        params = a.split(',');
        for (var i in params) {
            params[i] = parseFloat(params[i]);
        }
    } else {
        params = [a, b, c, d, e, f];
    }
    if (this == window) {
        return "matrix(" + params.join(',') + ")";
    }
    this.a = params[0];
    this.b = params[1];
    this.c = params[2];
    this.d = params[3];
    this.e = params[4];
    this.f = params[5];
    return this;
};
Matrix.prototype = {
    clone: function (obj) {
        if (this instanceof Matrix) {
            Object.keys(this).forEach(function (v) {
                this[v] = obj[a];
            }, this);
            return this;
        }
        return new Matrix(obj.a, obj.b, obj.c, obj.d, obj.e, obj.f);
    },
    multi: function (m) {
        if (!(m instanceof Matrix)) {
            return false;
        }
        let arr = [
            this.a * m.a + this.c * m.b,
            this.b * m.a + this.d * m.b,
            this.a * m.c + this.c * m.d,
            this.b * m.c + this.d * m.d,
            this.a * m.e + this.c * m.f + this.e,
            this.b * m.e + this.d * m.f + this.f,
        ];
        return new Matrix(arr);
    },
    /** 2d 转换成 3d
     *  a  c  e    a  c  0  e
     *  b  d  f => b  d  0  f
     *  0  0  1    0  0  1  0
     *             0  0  0  1
     */
    transfer3d: function () {
        return new Matrix3d([
            this.a, this.b, 0, 0,
            this.c, this.d, 0, 0,
            0, 0, 1, 0,
            this.e, this.f, 0, 1,
        ]);
    },
    add: function (m) {
        if (!(m instanceof Matrix)) {
            return false;
        }
        return new Matrix([
            this.a + m.a,
            this.b + m.b,
            this.c + m.c,
            this.d + m.d,
            this.e + m.e,
            this.f + m.f,
        ]);
    },
    sub: function (m) {
        if (!(m instanceof Matrix)) {
            return false;
        }
        return new Matrix([
            this.a - m.a,
            this.b - m.b,
            this.c - m.c,
            this.d - m.d,
            this.e - m.e,
            this.f - m.f,
        ]);
    },
    toString: function () {
        let params = [this.a, this.b, this.c, this.d, this.e, this.f];
        return "matrix(" + params.join(',') + ")";
    }
}






const Matrix3d = function (params) {
    if (arguments.length == 0 || arguments[0] == null || arguments[0] == '' || arguments[0] == 'none' || arguments[0] == undefined) {
        return new Matrix3d([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    if (typeof arguments[0] == 'string') {
        return new Matrix3d(params.split(',').map(function (v) {
            return v = parseFloat(v.replace(/matrix.*\(/, ''));
        }));
    }
    for (var index in params) {
        let v = params[index];
        let x = index % 4,
            y = parseInt(index / 4);
        if (this[x] == undefined) {
            this[x] = [];
        }
        this[x][y] = v;
    }
    return this;
};
Object.assign(Matrix3d.prototype, {
    multi: function (m) {
        if (!m instanceof Matrix3d) {
            return this;
        };
        let matrix3d = new Matrix3d();
        for (var i in matrix3d) {
            for (j in matrix3d[i]) {
                matrix3d[i][j] =
                    this[i][0] * m[0][j] +
                    this[i][1] * m[1][j] +
                    this[i][2] * m[2][j] +
                    this[i][3] * m[3][j];
            }
        }
        return matrix3d;
    },
    clone: function (m) {
        if (!m instanceof Matrix3d) {
            return null;
        }
        let matrix3d = new Matrix3d();
        for (var i in matrix3d) {
            for (j in matrix3d[i]) {
                matrix3d[i][j] = m[i][j];
            }
        }
        return matrix3d;
    },
    toString: function () {
        let arr = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (arr[j] == undefined) {
                    arr[j] = [];
                }
                arr[j][i] = this[i][j];
            }
        };
        return 'matrix3d(' + arr.map(function (v) {
            return v.join(',');
        }).join(',') + ")";
    }
});

module.exports = {
    Matrix3d,
    Matrix
};