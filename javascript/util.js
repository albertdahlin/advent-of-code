
Array.isEqual = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

export function toInt(x) {
    return parseInt(x, 10);
}

export function parseNumbers(s) {
    return Array.from(s.matchAll(/[\d-]+/g).map(toInt));
}

Map.prototype.hasVec = function(v) {
    return this.has(v.join(','));
}

Map.prototype.getVec = function(v) {
    return this.get(v.join(','));
}

Map.prototype.setVec = function(v, val) {
    this.set(v.join(','), val);
}

Map.prototype.deleteVec = function(v) {
    this.delete(v.join(','));
}

Map.fromVec = function(arr) {
    return new Map(arr.map(a => [a.join(','), a]));
}

