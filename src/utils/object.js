
export function isSame(json1, json2) {
	return !isDiff(json1, json2)
}


export function isDiff(json1, json2) {
	if (!json1 && !json2) {
		return false;
	} else if (!isEmptyObject(json1) && isEmptyObject(json2)) {
		return true
	} else if (!isEmptyObject(json2) && isEmptyObject(json1)) {
		return true
	}
	for (let k in json2) {
		// 判断是否存在该字段
		if (json1[k] == undefined) {
			return true
		}
		// 判断数据类型是否一致
		if (getType(json2[k]) == getType(json1[k])) {
			// 比较 “Array”和“Object”类型
			if (getType(json2[k]) == 'Array' || getType(json2[k]) == 'Object') {
				let result = isDiff(json1[k], json2[k]);
				if (result) {
					return true
				}
			} else if (json1[k] != json2[k]) { // 比较其他类型数据
				return true
			}
		} else {
			return true
		}
	}
	for (let k in json1) {
		// 判断是否存在该字段
		if (json2[k] == undefined) {
			return true
		}
		// 判断数据类型是否一致
		if (getType(json2[k]) == getType(json1[k])) {
			// 比较 “Array”和“Object”类型
			if (getType(json1[k]) == 'Array' || getType(json1[k]) == 'Object') {
				let result = isDiff(json2[k], json1[k]);
				if (result) {
					return true
				}
			} else if (json1[k] != json2[k]) { // 比较其他类型数据
				return true
			}
		} else {
			return true
		}
	}
	return false;
}


/**
 * 未完善！！！
 * 比较两个json（新json与老json）的不同,并返回 不同时的旧值(old_val)和新值(new_val)
 * @param {*} json1 老json
 * @param {*} json2 新json 
 */
export function diff(json1, json2) {
	if (!json1 || isEmptyObject(json1) || !json2 || isEmptyObject(json2)) {
		return null;
	}
	let diffRes = {
		old_val: {},
		new_val: {}
	};
	for (let k in json2) {
		// 判断是否存在该字段
		if (json1[k] == undefined) {
			diffRes.old_val[k] = undefined;
			diffRes.new_val[k] = json2[k];
			continue
		}
		// 判断数据类型是否一致
		if (getType(json2[k]) === getType(json1[k])) {
			// 比较 “Array”和“Object”类型
			if (getType(json2[k]) === 'Array' || getType(json2[k]) === 'Object') {
				const diffData = diff(json1[k], json2[k]);
				if (!isEmptyObject(diffData)) {
					diffRes.old_val[k] = diffData.old_val;
					diffRes.new_val[k] = diffData.new_val;
				}
			} else if (json1[k] !== json2[k]) { // 比较其他类型数据
				diffRes.old_val[k] = json1[k];
				diffRes.new_val[k] = json2[k];
			}
		} else {
			diffRes.old_val[k] = json1[k];
			diffRes.new_val[k] = json2[k];
		}
	}
	// 若没有变化，返回null
	if (isEmptyObject(diffRes.old_val) || isEmptyObject(diffRes.new_val)) {
		return null;
	}
	return diffRes;
}


/**
 * 获取数据类型
 * @param {*} obj 
 */
export function getType(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object ([a-zA-Z]*)\]$/)[1];
}


/**
 * 判断是否是空对象
 * @param {*} obj 
 */
export function isEmptyObject(obj) {
	for (var key in obj) {
		return false;
	};
	return true;
}











