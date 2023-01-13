function mod(n, m) {
    return ((n % m) + m) % m;
}

class GaloisField {
    m = 281;
    p = (2 * this.m) + 1;

    constructor() {
        this.multiplicativeMatrix = [];
        let row = [];
        for (let i = 0; i < this.m; i++) {
            row = [];
            for (let j = 0; j < this.m; j++) {
                row[j] = this.matrixCondition(i, j) ? 1 : 0;
            }
            this.multiplicativeMatrix[i] = row;
        }
    }

    matrixCondition(i, j) {
        if (mod((Math.pow(2, i) + Math.pow(2, j)), this.p) === 1) {
            return true
        } else if (mod((Math.pow(2, i) - Math.pow(2, j)), this.p) === 1) {
            return true
        } else if (mod((-Math.pow(2, i) + Math.pow(2, j)), this.p) === 1) {
            return true
        } else if (mod((-Math.pow(2, i) - Math.pow(2, j)), this.p) === 1) {
            return true
        }

        return false;
    }

    circularLeftShift(element, i) {
        return element.slice(i).concat(element.slice(0, i));
    }

    toBinaryVector(number) {
        let binaryVector = [];
        let i = 0;

        while (number > 0) {
            binaryVector[i] = number % 2;
            number = Math.floor(number / 2);
            i++;
        }

        return binaryVector.reverse();
    }

    getFieldElement() {
        let random;
        let element = [];

        for (let i = 0; i < this.m; i++) {
            random = Math.random();
            if (random < 0.5) {
                element[i] = 1
            } else {
                element[i] = 0;
            }
        }

        return element;
    }

    add(element1, element2) {
        let result = [];

        for (let i = 0; i < this.m; i++) {
            result[i] = element1[i] ^ element2[i];
        }

        return result;
    }

    trace(element) {
        let result = [];
        let coefficient = 0;

        for (let i = 0; i < this.m; i++) {
            coefficient ^= element[i];
            result[i] = coefficient;
        }

        return result;
    }

    mul(element1, element2, param) {
        let result = [];

        if(param === 0){
            for (let i = 0; i < this.m; i++) {
                result[i] = 1;
            }
            return result
        }

        let temp = [];
        let element1Shifted;
        let element2Shifted;

        for (let i = 0; i < this.m; i++) {
            element1Shifted = this.circularLeftShift(element1, i);
            element2Shifted = this.circularLeftShift(element2, i);

            //element1 * multiplicativeMatrix
            let coefficient;
            for (let j = 0; j < this.m; j++) {
                coefficient = 0;

                for (let t = 0; t < this.m; t++) {
                    coefficient ^= element1Shifted[t] & this.multiplicativeMatrix[j][t];
                }

                temp[j] = coefficient;
            }

            //element1 * multiplicativeMatrix * element2
            coefficient = 0;
            for (let j = 0; j < this.m; j++) {
                coefficient ^= temp[j] & element2Shifted[j];
            }

            result[i] = coefficient;
        }

        return result;
    }

    pow(element, pow) {
        let result = [];
        pow = this.toBinaryVector(pow);

        for (let i = 0; i < this.m; i++) {
            result[i] = 1;
        }

        for(let i = 0; i < pow; i++){
            if(pow[i] === 1){
                result = this.mul(result, element);
            }
            result = this.circularLeftShift(result, 1);
        }

        return result;
    }

    quadratic(element){
        return this.circularLeftShift(element, 1);
    }

    inverse(element) {
        return this.pow(element, Math.pow(2, this.m) - 2);
    }
}

const inverseCheck = (element) => {
    return field.mul(element, field.inverse(element),0)
}

const field = new GaloisField();
const elem1 = field.getFieldElement();
const elem2 = field.getFieldElement();
const elem3 = field.getFieldElement();

console.log("ELEM1");
console.log(elem1);
console.log("ELEM2");
console.log(elem2);
console.log("ELEM3");
console.log(elem3);


console.log("ADD");
console.time('Add');
console.log(field.add(elem1, elem2));
console.timeEnd('Add');

console.log("MUL");
console.time('Mul');
console.log(field.mul(elem1, elem2));
console.timeEnd('Mul');


console.log("POW CHECK");
console.time('POW CHECK');
console.log(field.pow(elem1, Math.pow(2, field.m) - 1));
console.timeEnd('POW CHECK');

console.log("QUADRATIC");
console.time('QUADRATIC');
console.log(field.quadratic(elem1, 2));
console.timeEnd('QUADRATIC');


console.log("INVERSE CHECK");
console.time('INVERSE CHECK');
console.log(inverseCheck(elem1));
console.timeEnd('INVERSE CHECK');

console.log("(a+b)*c")
console.log(field.mul(field.add(elem1, elem2), elem3));

console.log("a*c + b*c")
console.log(field.add(field.mul(elem1, elem3), field.mul(elem2, elem3)));

console.log("MATRIX");
console.log(field.multiplicativeMatrix);







