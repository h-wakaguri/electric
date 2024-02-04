class TruthTable {
	constructor(inOutNum, tTable, option) {
		this.inOutNum = inOutNum;
		this.tTable = tTable;
		this.option = option;
		if(this.option === undefined) this.option = {};
		//this.option.ioLabelList: inputとoutputのラベル名のリスト
		
		this.inp2out = {};
		
		let inputNum = this.inOutNum[0];
		let outputNum = this.inOutNum[1];
		
		this.inpOutName = [[], []];
		for(let i = 0; i < inputNum; i ++) {
			let label = "";
			if(this.option.ioLabelList === undefined) {
				if(i < 26) {
					label = String.fromCharCode(i + 65);
				} else {
					label = String.fromCharCode(Math.floor(i / 26) + 65 - 1) + String.fromCharCode((i % 26) + 65);
				}
			} else {
				label = this.option.ioLabelList[i];
			}
			this.inpOutName[0].push(label);
		}
		for(let i = 0; i < outputNum; i ++) {
			let label = "";
			if(this.option.ioLabelList === undefined) {
				if(i < 26) {
					label = String.fromCharCode(i + 97);
				} else {
					label = String.fromCharCode(Math.floor(i / 26) + 97 - 1) + String.fromCharCode((i % 26) + 97);
				}
			} else {
				label = this.option.ioLabelList[i + inputNum];
			}
			this.inpOutName[1].push(label);
		}
		
		for(let i = 0; i < tTable.length; i ++) {
			let dt = tTable[i];
			if(dt.length != inputNum + outputNum) {
				throw new Error("Data length is invalid: line: " + i + ", " + dt);
			}
			let key = [""];
			for(let j = 0; j < inputNum; j ++) {
				var d = dt[j];
				if(d * 1 == 0 || d * 1 == 1) {
					for(let k = 0; k < key.length; k ++) {
						key[k] += d;
					}
				} else if(d == "?" || d == "*") {
					var repNum = key.length;
					for(let k = 0; k < repNum; k ++) {
						key.push(key[k] + "1");
						key[k] += "0";
					}
				} else {
					throw new Error("Invalid data charactor found: line: " + i + ", " + dt);
				}
			}
			let outList = [];
			for(let j = 0; j < outputNum; j ++) {
				outList.push(dt[j + inputNum]);
			}
			
			for(let j = 0; j < key.length; j ++) {
				let nowKey = key[j];
				if(this.inp2out[nowKey] === undefined) {
					this.inp2out[nowKey] = outList;
				} else {
					console.warn("key: " + nowKey + " is too many. skipped next output: ");
					console.warn(outList);
				}
			}
		}
	}
	
	printTruthTable(elm) {
		let inputNum = this.inOutNum[0];
		let outputNum = this.inOutNum[1];
		let htmlStr = "";
		htmlStr += "<table border=\"0\" style=\"border-collapse: collapse; border: 4px solid #000; \"><thead>";
		htmlStr += "<tr>";
		for(let i = 0; i < inputNum; i ++) {
			if(i == inputNum - 1) {
				htmlStr += "<th style=\"border: 1px solid #000; border-bottom: 4px solid #000; border-right: 4px solid #000;\">" + this.inpOutName[0][i] + "</th>";
			} else {
				htmlStr += "<th style=\"border: 1px solid #000; border-bottom: 4px solid #000;\">" + this.inpOutName[0][i] + "</th>";
			}
		}
		for(let i = 0; i < outputNum; i ++) {
			htmlStr += "<th style=\"border: 1px solid #000; border-bottom: 4px solid #000;\">" + this.inpOutName[1][i] + "</th>";
		}
		htmlStr += "</tr>";
		htmlStr += "</thead><tbody>";
		for(let i = 0; i < Math.pow(2, inputNum); i ++) {
			htmlStr += "<tr>";
			let str2 = i.toString(2);
			let strz = "0".repeat(inputNum - str2.length);
			let nowKey = strz + str2;
			let dt = nowKey.split("");
			for(let j = 0; j < dt.length; j ++) {
				if(j == dt.length - 1) {
					htmlStr += "<td style=\"border: 1px solid #000; border-right: 4px solid #000;\">" + dt[j] + "</td>";
				} else {
					htmlStr += "<td style=\"border: 1px solid #000;\">" + dt[j] + "</td>";
				}
			}
			
			if(this.inp2out[nowKey] !== undefined) {
				for(let j = 0; j < outputNum; j ++) {
					htmlStr += "<td style=\"border: 1px solid #000;\">" + this.inp2out[nowKey][j] + "</td>";
				}
			} else {
				for(let j = 0; j < outputNum; j ++) {
					htmlStr += "<td style=\"border: 1px solid #000;\">*</td>";
				}
			}
			htmlStr += "</tr>";
		}
		htmlStr += "</tbody></table>";
		
		elm.innerHTML = htmlStr;
	}
	
	getDisjunctiveCanonicalForm(findTrueFlg) {
		if(findTrueFlg) {
			//true側を加法標準形で返す
			return this.getTruthFormula1(findTrueFlg);
		} else {
			//false側を加法標準形で返す
			return this.getTruthFormula0(findTrueFlg);
		}
	}
	
	getConjunctiveCanonicalForm(findTrueFlg) {
		if(findTrueFlg) {
			//true側を乗法標準形で返す
			return this.getTruthFormula0(findTrueFlg);
		} else {
			//false側を乗法標準形で返す
			return this.getTruthFormula1(findTrueFlg);
		}
	}
	
	getTruthFormula1(findTrueFlg) {
		let inputNum = this.inOutNum[0];
		let outputNum = this.inOutNum[1];
		let lfStr = [];
		for(let i = 0; i < outputNum; i ++) {
			lfStr[i] = (findTrueFlg)? "0": "1";
		}
		for(let i = 0; i < Math.pow(2, inputNum); i ++) {
			let str2 = i.toString(2);
			let strz = "0".repeat(inputNum - str2.length);
			let nowKey = strz + str2;
			if(this.inp2out[nowKey] !== undefined) {
				for(let j = 0; j < outputNum; j ++) {
					if(this.inp2out[nowKey][j] * 1 == 1) {
						if(findTrueFlg) {
							if(lfStr[j] != "0") {
								lfStr[j] += " + ";
							} else {
								lfStr[j] = "";
							}
							let dt = nowKey.split("");
							for(let k = 0; k < dt.length; k ++) {
								let alp = this.inpOutName[0][k];
								if(dt[k] == 0) alp += "'";
								lfStr[j] += alp;
							}
						} else {
							if(lfStr[j] != "1") {
								lfStr[j] += " ・ (";
							} else {
								lfStr[j] = "(";
							}
							let dt = nowKey.split("");
							for(let k = 0; k < dt.length; k ++) {
								let alp = this.inpOutName[0][k];
								if(dt[k] == 0) alp += "'";
								lfStr[j] += alp;
								if(k != dt.length - 1) lfStr[j] += "+";
							}
							lfStr[j] += ")";
						}
					}
				}
			}
		}
		
		let res = [];
		for(let i = 0; i < lfStr.length; i ++) {
			let resStr = this.inpOutName[1][i];
			if(!findTrueFlg) resStr += "'";
			resStr += " = " + lfStr[i];
			res.push(resStr);
		}
		
		return res;
	}
	
	getTruthFormula0(findTrueFlg) {
		let inputNum = this.inOutNum[0];
		let outputNum = this.inOutNum[1];
		let lfStr = [];
		for(let i = 0; i < outputNum; i ++) {
			lfStr[i] = (findTrueFlg)? "1": "0";
		}
		for(let i = 0; i < Math.pow(2, inputNum); i ++) {
			let str2 = i.toString(2);
			let strz = "0".repeat(inputNum - str2.length);
			let nowKey = strz + str2;
			if(this.inp2out[nowKey] !== undefined) {
				for(let j = 0; j < outputNum; j ++) {
					if(this.inp2out[nowKey][j] * 1 == 0) {
						if(findTrueFlg) {
							if(lfStr[j] != "1") {
								lfStr[j] += " ・ (";
							} else {
								lfStr[j] = "(";
							}
							let dt = nowKey.split("");
							for(let k = 0; k < dt.length; k ++) {
								let alp = this.inpOutName[0][k];
								if(dt[k] == 0) alp += "'";
								lfStr[j] += alp;
								if(k != dt.length - 1) lfStr[j] += "+";
							}
							lfStr[j] += ")";
						} else {
							if(lfStr[j] != "0") {
								lfStr[j] += " + ";
							} else {
								lfStr[j] = "";
							}
							let dt = nowKey.split("");
							for(let k = 0; k < dt.length; k ++) {
								let alp = this.inpOutName[0][k];
								if(dt[k] == 0) alp += "'";
								lfStr[j] += alp;
							}
						}
					}
				}
			}
		}
		
		let res = [];
		for(let i = 0; i < lfStr.length; i ++) {
			let resStr = this.inpOutName[1][i];
			if(!findTrueFlg) resStr += "'";
			resStr += " = " + lfStr[i];
			res.push(resStr);
		}
		
		return res;
	}
	
	getInputOutputName() {
		return this.inpOutName;
	}
	
	getTruthTable() {
		return [this.inpOutName, this.inp2out];
	}
	
}

class KarnaughGraph {
	constructor(truthTable) {
		this.truthTable = truthTable;
		//truthTable = [
		//	[[inputNameList], [outputNameList]], 
		//	{"inputBitsStr": [outputBitsList]}
		//]
		//console.log(truthTable);
		
		let inputNum = this.truthTable[0][0].length;
		if(inputNum >= 7) {
			throw new Error("Too many input: " + inputNum + ". This program is supported 7 inputs.");
		}
		let outputNum = this.truthTable[0][1].length;
		
		//カルノー図のサイズ計算 x方向、y方向、z:表数
		let inpXNum = Math.floor(inputNum / 2);
		if(inpXNum > 2) inpXNum = 2;
		let inpYNum = inputNum - inpXNum;
		if(inpYNum > 2) inpYNum = 2;
		let inpZNum = inputNum - inpXNum - inpYNum;
		
		//カルノー図のマトリクスデータの作成 this.startMatrix[output No.][z][y][x] = 0,1 or "*"
		this.startMatrix = [];
		for(let oNo = 0; oNo < outputNum; oNo ++) {
			let xCode = this.getAllGrayCode(inpXNum);
			let yCode = this.getAllGrayCode(inpYNum);
			let zCode = this.getAllGrayCode(inpZNum);
			let bitStrData = this.truthTable[1];
			
			let eachVector = [];
			for(let z = 0; z < zCode.length; z ++) {
				let eachMatrix = [];
				for(let i = 0; i < yCode.length; i ++) {
					let eachList = [];
					for(let j = 0; j < xCode.length; j ++) {
						let allCode = "";
						if(xCode.length > 1) allCode += xCode[j];
						if(yCode.length > 1) allCode += yCode[i];
						if(zCode.length > 1) allCode += zCode[z];
						//console.log(allCode);
						let dt = bitStrData[allCode];
						let val = (dt === undefined)? "*": dt[oNo];
						eachList.push(val);
					}
					eachMatrix.push(eachList);
				}
				eachVector.push(eachMatrix);
			}
			this.startMatrix.push(eachVector);
		}
		
		//カルノー図のボックス領域を探索して結果をthis.resultに代入
		this.result = [[], []];
		//console.log(this.startMatrix);
		for(let i = 0; i < this.startMatrix.length; i ++) {
			for(let j = 0; j < 2; j ++) {
				let karnaugh = this.calcKarnaugh(this.startMatrix[i], j);
				this.result[j].push(karnaugh);
			}
		}
		
		//描画の画像サイズ計算
		this.fontSize = 20;
		
		let fontSize = this.fontSize;
		let xAdd = fontSize * 2 * 0.8;
		let yAdd = fontSize * 2 * 0.8;
		
		let xSize = xAdd * (Math.pow(2, inpXNum) + 3);
		let ySize = yAdd * (Math.pow(2, inpYNum) + 3);
		if(inpZNum) ySize += yAdd * (Math.pow(2, inpYNum) + 1);
		if(inpZNum == 2) ySize += 2 * yAdd * (Math.pow(2, inpYNum) + 1);
		
		this.size = [xSize, ySize];
		
	}
	
	getKarnaughResultFormula(findTrueFlg) {
		let findValue = (findTrueFlg)? 1: 0;
		let resList = [];
		for(let i = 0; i < this.result[findValue].length; i ++) {
			let karnaugh = this.result[findValue][i];
			let fStr = this.truthTable[0][1][i];
			if(findValue == 0) fStr += "'";
			fStr += " = " + karnaugh.res;
			resList.push(fStr);
			//console.log(this.truthTable[0][1][i] + " = " + karnaugh.res);
		}
		
		return resList;
	}
	
	calcKarnaugh(matrix, findTrueFlg) {
		//console.log(matrix);
		//countは使わない delIdはandListの中でいらないindex
		let hitIdData = {count: 0, andList: [], idData: {}, delId: {}, res:""};
		let usedData = {};
		let ret1 = Math.log2(matrix.length);
		let ret2 = Math.log2(matrix[0].length);
		let ret3 = Math.log2(matrix[0][0].length);
		//console.log(ret1 + ", " + ret2 + ", " + ret3);
			for(let j = ret2; j >= 0; j --) {
				let yLen = Math.pow(2, j);
				//console.log(yLen + ", " + xLen);
				for(let k = ret3; k >= 0; k --) {
					let xLen = Math.pow(2, k);
		for(let i = ret1; i >= 0; i --) {
			let zLen = Math.pow(2, i);
					for(let x = 0; x < matrix[0][0].length; x ++) {
						for(let y = 0; y < matrix[0].length; y ++) {
							for(let z = 0; z < matrix.length; z ++) {
								var res = this.checkBox(matrix, xLen, yLen, zLen, x, y, z, findTrueFlg);
								if(res == 1) {
									//usedData: 既にボックスで囲ってある場所の情報, matrix: カルノー図, 
									//xLen: 横の長さ, yLen: 縦の長さ, zLen: 奥行の長さ, x: 左端の位置, y: 上端の位置, z: 前端の位置
									if(this.isNewUseData(usedData, matrix, xLen, yLen, zLen, x, y, z, findTrueFlg)) {
										//ココを採用！
										//console.log("pos:(" + x + ", " + y + ", " + z + "), " + "lng:(" + xLen + ", " + yLen + ", " + zLen + "), res: " + res);
										var andKou = this.getKarnaughString(matrix, xLen, yLen, zLen, x, y, z);
										
										hitIdData.count ++;
										hitIdData.andList.push([[x, y, z], [xLen, yLen, zLen], andKou]);
										//いらないデータを除くためのデータの用意
										this.addHitIdData(hitIdData, matrix, xLen, yLen, zLen, x, y, z, findTrueFlg);
									}
								}
								if(i == ret1) break;
							}
							if(j == ret2) break;
						}
						if(k == ret3) break;
					}
				}
			}
		}
		this.reduceAndKow(hitIdData);
		//console.log(hitIdData);
		
		return hitIdData;
	}
	
	addHitIdData(hitIdData, matrix, xLen, yLen, zLen, x, y, z, findTrueFlg) {
		let idData = hitIdData.idData;
		let zMax = matrix.length;
		let yMax = matrix[0].length;
		let xMax = matrix[0][0].length;
		for(let i = 0; i < zLen; i ++) {
			let zIndex = (z + i) % zMax;
			for(let j = 0; j < yLen; j ++) {
				let yIndex = (y + j) % yMax;
				for(let k = 0; k < xLen; k ++) {
					let xIndex = (x + k) % xMax;
					let val = matrix[zIndex][yIndex][xIndex];
					if(val == findTrueFlg) {
						if(idData[zIndex] === undefined) idData[zIndex] = {};
						if(idData[zIndex][yIndex] === undefined) idData[zIndex][yIndex] = {};
						if(idData[zIndex][yIndex][xIndex] === undefined) idData[zIndex][yIndex][xIndex] = {};
						idData[zIndex][yIndex][xIndex][hitIdData.andList.length] = true;
					}
				}
			}
		}
	}
	
	reduceAndKow(hitIdData) {
		let delId = hitIdData.delId;
		loop: for(let i = 1; i < hitIdData.andList.length; i ++) {
			for(let zIndex in hitIdData.idData) {
				for(let yIndex in hitIdData.idData[zIndex]) {
					for(let xIndex in hitIdData.idData[zIndex][yIndex]) {
						if(hitIdData.idData[zIndex][yIndex][xIndex][i]) {
							let findFlg = false;
							for(let id in hitIdData.idData[zIndex][yIndex][xIndex]) {
								if(id != i && !delId[id - 1]) {
									findFlg = true;
									break;
								}
							}
							//findFlgがtrueなら他のAnd boxと共有している
							if(!findFlg) continue loop;
						}
					}
				}
			}
			//ここに来たら全部の1が他のいずれかのAnd boxと共有していることになり、そのAnd boxは消してもよい
			delId[i - 1] = true;
		}
		
		for(let i = 0; i < hitIdData.andList.length; i ++) {
			if(!delId[i]) {
				if(hitIdData.res != "") hitIdData.res += " + ";
				hitIdData.res += hitIdData.andList[i][2];
			}
		}
		if(hitIdData.res == "") {
			hitIdData.res = (hitIdData.andList.length)? "1": "0";
		}
	}
	
	getAndParts(findTrueFlg) {
		let findValue = (findTrueFlg)? 1: 0;
		//console.log(this.result[findValue]);
		let andPatternCount = {};
		for(let i = 0; i < this.result[findValue].length; i ++) {
			let andList = this.result[findValue][i].andList;
			let delId = this.result[findValue][i].delId;
			for(let j = 0; j < andList.length; j ++) {
				if(delId[j]) continue;
				let andPattern = andList[j][2];
				if(andPatternCount[andPattern] === undefined) {
					andPatternCount[andPattern] = [];
				}
				andPatternCount[andPattern].push(i);
			}
		}
		
		for(let andPattern in andPatternCount) {
			console.log(andPattern + ": " + andPatternCount[andPattern]);
		}
	}
	
	getKarnaughString(matrix, xLen, yLen, zLen, x, y, z) {
		let xMax = matrix[0][0].length;
		let yMax = matrix[0].length;
		let zMax = matrix.length;
		let xLog2 = Math.log2(xMax);
		let yLog2 = Math.log2(yMax);
		let zLog2 = Math.log2(zMax);
		let andVal = Math.pow(2, yLog2 + xLog2 + zLog2) - 1;
		let orVal = 0;
		//console.log(andVal.toString(2) + ", " + orVal.toString(2));
		
		//四角で囲われた部分のグレイコードのandおよびorを計算する
		//andで1で残った部分とorで0で残った部分について論理式に論理積の形で残さないといけない
		for(let i = z; i < z + zLen; i ++) {
			let zGray = this.getGrayCode(i % zMax);
			let zCode = (zLog2 - zGray.length < 0)? "": "0".repeat(zLog2 - zGray.length) + zGray;
			for(let j = y; j < y + yLen; j ++) {
				let yGray = this.getGrayCode(j % yMax);
				let yCode = "0".repeat(yLog2 - yGray.length) + yGray;
				for(let k = x; k < x + xLen; k ++) {
					let xGray = this.getGrayCode(k % xMax);
					let xCode = (xLog2 - xGray.length < 0)? "": "0".repeat(xLog2 - xGray.length) + xGray;
					let nowVal = parseInt(xCode + yCode + zCode, 2);
					andVal &= nowVal;
					orVal |= nowVal;
					//console.log(yCode + xCode + "=" + nowVal + ", " + andVal.toString(2) + ", " + orVal.toString(2));
				}
			}
		}
		let andVal2 = andVal.toString(2);
		andVal2 = "0".repeat(zLog2 + yLog2 + xLog2 - andVal2.length) + andVal2;
		let orVal2 = orVal.toString(2);
		orVal2 = "0".repeat(zLog2 + yLog2 + xLog2 - orVal2.length) + orVal2;
		//console.log(andVal2 + ", " + orVal2);
		
		let inputNameList = this.truthTable[0][0];
		//残す部分を抽出
		let resStr = "";
		for(let i = 0; i < andVal2.length; i ++) {
			if(andVal2.charAt(i) == "1") {
				resStr += inputNameList[i];
			} else if(orVal2.charAt(i) == "0") {
				resStr += inputNameList[i] + "'";
			}
		}
		//console.log(resStr);
		return resStr;
	}
	
	isNewUseData(usedData, matrix, xLen, yLen, zLen, x, y, z, findTrueFlg) {
		let zMax = matrix.length;
		let yMax = matrix[0].length;
		let xMax = matrix[0][0].length;
		//console.log(xMax + ", " + yMax);
		//console.log(xLen + ", " + yLen);
		let findFlg = false;
		for(let i = 0; i < zLen; i ++) {
			let zIndex = (z + i) % zMax;
			if(usedData[zIndex] === undefined) {
				usedData[zIndex] = {};
			}
			for(let j = 0; j < yLen; j ++) {
				let yIndex = (y + j) % yMax;
				if(usedData[zIndex][yIndex] === undefined) {
					usedData[zIndex][yIndex] = {};
				}
				for(let k = 0; k < xLen; k ++) {
					let xIndex = (x + k) % xMax;
					let val = matrix[zIndex][yIndex][xIndex];
					if(!usedData[zIndex][yIndex][xIndex]) {
						if(val == findTrueFlg) findFlg = true;
						usedData[zIndex][yIndex][xIndex] = true;
					}
				}
			}
		}
		
		return findFlg;
	}
	
	//findTrueFlgが1のとき、0が含まれる場合: -1, "*"しか含まない場合: 0, 0を含まず1を1つ以上含む場合: 1を返す
	checkBox(matrix, xLen, yLen, zLen, x, y, z, findTrueFlg) {
		let findValue = (findTrueFlg)? 1: 0;
		let zMax = matrix.length;
		let yMax = matrix[0].length;
		let xMax = matrix[0][0].length;
		//console.log(xMax + ", " + yMax);
		//console.log(xLen + ", " + yLen);
		let findFlg = false;
		for(let i = 0; i < zLen; i ++) {
			for(let j = 0; j < yLen; j ++) {
				for(let k = 0; k < xLen; k ++) {
					let val = matrix[(z + i) % zMax][(y + j) % yMax][(x + k) % xMax];
					if(val == 1 - findValue) return -1;
					if(val == findValue) findFlg = true;
				}
			}
		}
		
		return (findFlg)? 1: 0;
	}
	
	getSize() {
		return this.size;
	}
	
	getGrayCode(val) {
		if(val == 0) return "0";
		
		var bitList = [];
		var bitLng = Math.floor(Math.log(val) / Math.log(2)) + 1;
		
		for (var i = 0; i < bitLng; i++) {
			bitList.push(val % 2);
			val = (val - val % 2) / 2;
		}
		
		var res = bitList.concat();
		for (var i = bitLng - 2; i >= 0; i--) {
			res[i] ^= bitList[i + 1];
		}
		
		return res.reverse().join('');
	}
	
	getAllGrayCode(bit) {
		if(bit == 0) return ["0"];
		
		var resCodes = [];
		var num = Math.pow(2, bit);
		for(let i = 0; i < num; i ++) {
			var gcode = this.getGrayCode(i);
			var zeroStr = "0".repeat(bit - gcode.length);
			resCodes.push(zeroStr + gcode);
		}
		
		return resCodes;
	}
	
	//////////描画用メソッド
	//描画(only_frame: フレームのみ, draw_region: 単純化する位置情報も表示)
	showKarnaugh(ctx, oNo, x, y, findTrueFlg, funcType) {
		let findValue = (findTrueFlg)? 1: 0;
		let backCanvas = document.createElement('canvas');
		backCanvas.width = this.size[0];
		backCanvas.height = this.size[1];
		let backCtx = backCanvas.getContext('2d');
		
		this.drawKarnaughFrame(backCtx, oNo);
		if(funcType == "draw_region") {
			this.drawKarnaughPositions(backCtx, findValue, oNo);
		} else if(funcType == "only_frame") {
			//
		}
		
		ctx.drawImage(backCanvas, x, y);
	}
	
	drawKarnaughFrame(backCtx, oNo) {
		let inputNum = this.truthTable[0][0].length;
		let inpXNum = Math.floor(inputNum / 2);
		if(inpXNum > 2) inpXNum = 2;
		let inpYNum = inputNum - inpXNum;
		if(inpYNum > 2) inpYNum = 2;
		let inpZNum = inputNum - inpXNum - inpYNum;
		
		var xName = "";
		for(let i = 0; i < inpXNum; i ++) {
			xName += this.truthTable[0][0][i];
		}
		var yName = "";
		for(let i = inpXNum; i < inpYNum + inpXNum; i ++) {
			yName += this.truthTable[0][0][i];
		}
		var zName = "";
		for(let i = inpYNum + inpXNum; i < inputNum; i ++) {
			zName += this.truthTable[0][0][i];
		}
		
		let xCode = this.getAllGrayCode(inpXNum);
		let yCode = this.getAllGrayCode(inpYNum);
		let zCode = this.getAllGrayCode(inpZNum);
		let bitStrData = this.truthTable[1];
		
		let fontSize = this.fontSize;
		let xAdd = fontSize * 2 * 0.8;
		let yAdd = fontSize * 2 * 0.8;
		
		let outName = this.truthTable[0][1][oNo] + ":";
		
		backCtx.clearRect(0, 0, this.size[0], this.size[1]);
		
		let y = yAdd * 2;
		backCtx.fillStyle = "black";
		backCtx.font = fontSize + "px 'Helvetica'";
		
		let strWidth = backCtx.measureText(outName).width;
		backCtx.fillText(outName, (xAdd - strWidth) / 2, (yAdd * 1 + fontSize) / 2);
		
		for(let z = 0; z < zCode.length; z ++) {
			if(zName != "") {
				let zStr = zName + "=" + zCode[z]
				backCtx.font = fontSize / 2 + "px 'Helvetica'";
				let strWidth = backCtx.measureText(zStr).width;
				backCtx.fillText(zStr, 0, y + (yAdd * 4 + fontSize) / 2 - 2);
				backCtx.font = fontSize + "px 'Helvetica'";
			}
			
			backCtx.strokeStyle = "#aaaaaa";
			backCtx.strokeRect(xAdd, y - yAdd, xAdd, yAdd);
			backCtx.strokeStyle = "black";
			backCtx.beginPath();
			backCtx.moveTo(xAdd, y - yAdd);
			backCtx.lineTo(xAdd * 2, y);
			backCtx.closePath();
			backCtx.stroke();
			
			backCtx.font = fontSize / 2 + "px 'Helvetica'";
			strWidth = backCtx.measureText(yName).width;
			strWidth = backCtx.measureText(xName).width;
			backCtx.fillText(xName, 2 * xAdd - strWidth - 2, y - yAdd + fontSize / 2);
			backCtx.fillText(yName, xAdd + 2, y - yAdd / 2 + fontSize / 2);
			backCtx.font = fontSize + "px 'Helvetica'";
			
			for(let i = 0; i < yCode.length; i ++) {
				let x = xAdd * 2;
				for(let j = 0; j < xCode.length; j ++) {
					if(i == 0 && xCode.length > 1) {
						let nowCode = xCode[j];
						let strWidth = backCtx.measureText(nowCode).width;
						backCtx.fillText(nowCode, x + (xAdd - strWidth) / 2, y + (-yAdd + fontSize) / 2 - 2);
						backCtx.strokeStyle = "#aaaaaa";
						backCtx.strokeRect(x, y - yAdd, xAdd, yAdd);
						backCtx.strokeStyle = "black";
						//console.log(nowCode);
					}
					
					if(j == 0) {
						let nowCode = yCode[i];
						let strWidth = backCtx.measureText(nowCode).width;
						backCtx.fillText(nowCode, x + (- xAdd - strWidth) / 2, y + (yAdd + fontSize) / 2 - 2);
						backCtx.strokeStyle = "#aaaaaa";
						backCtx.strokeRect(x - xAdd, y, xAdd, yAdd);
						backCtx.strokeStyle = "black";
						//console.log(nowCode);
					}
					
					let allCode = "";
					if(xCode.length > 1) allCode += xCode[j];
					if(yCode.length > 1) allCode += yCode[i];
					if(zCode.length > 1) allCode += zCode[z];
					
					//console.log(allCode);
					let dt = bitStrData[allCode];
					let val = (dt === undefined)? "*": dt[oNo];
					let strWidth = backCtx.measureText(val).width;
					backCtx.fillText(val, x + (xAdd - strWidth) / 2, y + (yAdd + fontSize) / 2 - 2);
					backCtx.strokeRect(x, y, xAdd, yAdd);
					
					x += xAdd;
				}
				y += yAdd;
			}
			y += yAdd;
		}
	}
	
	drawKarnaughPositions(backCtx, findValue, oNo) {
		let colPalette = [
			"red", "darkorange", "hotpink", "violet", "mediumorchid", 
			"mediumseagreen", "darkviolet", "lightsalmon", "darkblue", "tomato", 
			"mediumblue", "firebrick", "darkmagenta", "cadetblue", "sandybrown", 
			"darkslategray", "forestgreen", "darkkhaki", "crimson", "rosybrown", 
			"mediumpurple", "olivedrab", "dimgray", "midnightblue", "magenta", 
			"darkgreen", "darkgoldenrod", "sienna", "maroon", "indigo", 
			"lightcoral", "burlywood"
		];
		
		let inputNum = this.truthTable[0][0].length;
		let inpXNum = Math.floor(inputNum / 2);
		if(inpXNum > 2) inpXNum = 2;
		let inpYNum = inputNum - inpXNum;
		if(inpYNum > 2) inpYNum = 2;
		let inpZNum = inputNum - inpXNum - inpYNum;
		
		let xCode = this.getAllGrayCode(inpXNum);
		let yCode = this.getAllGrayCode(inpYNum);
		let zCode = this.getAllGrayCode(inpZNum);
		
		let fontSize = this.fontSize;
		let xAdd = fontSize * 2 * 0.8;
		let yAdd = fontSize * 2 * 0.8;
		
		backCtx.font = fontSize / 2 + "px 'Helvetica'";
		
		let yS = yAdd * 2;
		let xS = xAdd * 2;
		
		let no = 0;
		for(let j = 0; j < this.result[findValue][oNo].andList.length; j ++) {
			if(this.result[findValue][oNo].delId[j]) continue;
			
			no ++;
			backCtx.fillStyle = colPalette[no - 1];
			let posLng = this.result[findValue][oNo].andList[j];
			//console.log(posLng[0]);
			//console.log(posLng[1]);
			
			for(let xNum = 0; xNum < posLng[1][0]; xNum ++) {
				for(let yNum = 0; yNum < posLng[1][1]; yNum ++) {
					for(let zNum = 0; zNum < posLng[1][2]; zNum ++) {
						let x = xS + xAdd * ((posLng[0][0] + xNum) % Math.pow(2, inpXNum)) 
							+ ((no - 1) % 6) * fontSize / 4;
						let y = yS + yAdd * ((posLng[0][1] + yNum) % Math.pow(2, inpYNum)) 
							+ yAdd * (yCode.length + 1) * ((posLng[0][2] + zNum) % Math.pow(2, inpYNum))
							- yAdd / 3 + Math.floor((no - 1) / 6) * fontSize / 3;
						
						backCtx.fillText(String.fromCharCode(no + 64), x, y + fontSize);
					}
				}
			}
		}
	}
}

