
export function sortObject(obj) {
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = (obj[key] && typeof obj[key] === 'object') ? sortObject(obj[key]) : obj[key];
      return result;
    }, {});
  }
  