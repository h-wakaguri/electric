window.onload = function() {
  showStart();
  return;
	
	let outputNum = 8;
	let truthTable = new TruthTable([5, outputNum], [
		[0, 0, 0, 0, "?",  0, 0, 0, 0, 1, 0, 0, 0], 
		[0, 0, 0, 1, 0,  0, 0, 0, 0, 1, 0, 0, 0], 
		[0, 0, 0, 1, 1,  1, 1, 0, 0, 1, 0, 1, 0],
		[0, 0, 1, 0, 0,  0, 0, 0, 0, 1, 0, 0, 0],
		[0, 0, 1, 0, 1,  0, 1, 0, 0, 1, 0, 1, 0],
		[0, 0, 1, 1, "?",  1, 1, 0, 0, 1, 0, 1, 0],
		[0, 1, 0, 0, "?",  0, 0, 1, 1, 0, 0, 0, 0],
		[0, 1, 0, 1, "?",  1, 1, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, "?",  0, 0, 1, 1, 0, 1, 0, 0],
		[0, 1, 1, 1, "?",  1, 1, 0, 0, 0, 1, 0, 0],
		[1, 0, 0, 0, "?",  0, 1, 0, 0, 0, 1, 0, 0],
		[1, 0, 0, 1, "?",  0, 0, 0, 1, 0, 0, 0, 0],
		[1, 0, 1, 0, "?",  0, 1, 0, 1, 0, 0, 0, 0],
		[1, 0, 1, 1, "?",  0, 1, 0, 1, 0, 1, 0, 0],
		[1, 1, 0, 0, "?",  0, 0, 1, 1, 1, 1, 0, 0],
		[1, 1, 0, 1, "?",  0, 1, 0, 0, 1, 1, 0, 0],
		[1, 1, 1, 0, "?",  0, 0, 0, 1, 1, 1, 0, 0],
		[1, 1, 1, 1, "?",  0, 1, 0, 1, 1, 1, 0, 1]
	], {
		"ioLabelList": ["A", "B", "C", "D", "F", 
			"A0", "A1", "B0", "B1", "D0", "D1", "CI", "CR"]
	});

};

//div内 HTMLの初期化
const showStart = () => {
  let elm = document.getElementById("main");
  let htmlStr = "<div>";
  htmlStr += "<table>";
  htmlStr += "<tr><td>入力数： </td><td><div id=\"inp-num-txt\"></div></td><td>";
  for(let i = 2; i <= 6; i ++) {
    htmlStr += "<input type=\"button\" value=\"" + i + "\" class=\"inp-num\">";
  }
  htmlStr += "</td></tr>\n";
  htmlStr += "<tr>";
  htmlStr += "<td>出力数： </td><td colspan=\"2\"><input type=\"text\" id=\"out-num\" size=\"2\" value=\"1\" maxlength=\"2\" ></td>";
  htmlStr += "</tr>\n";
  htmlStr += "</table>";
  htmlStr += "<h2>真理値表</h2>";
  htmlStr += "<div id=\"ttable\"></div>";
  htmlStr += "<div>&nbsp;</div>";
  htmlStr += "<div>";
  htmlStr += "<input type=\"button\" value=\"加法標準形\" class=\"exec\">";
  htmlStr += "<input type=\"button\" value=\"カルノー図\" class=\"exec\">";
  htmlStr += "<input type=\"button\" value=\"結果\" class=\"exec\">";
  htmlStr += "&nbsp;";
  htmlStr += "<input type=\"button\" value=\"加法標準形(not)\" class=\"exec\">";
  htmlStr += "<input type=\"button\" value=\"カルノー図(not)\" class=\"exec\">";
  htmlStr += "<input type=\"button\" value=\"結果(not)\" class=\"exec\">";
  htmlStr += "</div>";
  htmlStr += "<div id=\"result\"></div>";
  
  htmlStr += "</div>";
  
  elm.innerHTML = htmlStr;
  
  let initTruthTable = null;
  let resElm = document.getElementById("result");
  
  //入力数
  let inpNumElm = document.getElementsByClassName("inp-num");
  for(let i = 0; i < inpNumElm.length; i ++) {
    inpNumElm[i].addEventListener("click", function() {
      initTruthTable = getInitTruthTable(i);
      resElm.innerHTML = "";
      selectExec(-1);
    });
  }
  
  let outputNum = 1;
  let outNumElm = document.getElementById("out-num");
  outNumElm.addEventListener("change", function() {
    let newOutputNum = this.value * 1;
    if(isNaN(newOutputNum) || newOutputNum < 1 || newOutputNum >= 100) {
      alert("「出力数」が正しくないため、「1」に設定します");
      newOutputNum = 1;
    }
    newOutputNum = Math.floor(newOutputNum);
    if(outputNum !== newOutputNum) {
      outputNum = newOutputNum;
      initTruthTable = getInitTruthTable(initTruthTable[0][0] - 2);
      resElm.innerHTML = "";
      selectExec(-1);
    }
    outNumElm.value = outputNum;
  });
  
  //7segで無理やり初期化
  //initTruthTable = getInitTruthTable(0);
  initTruthTable = getExampleTruthTable();
  
  
  let execElm = document.getElementsByClassName("exec");
  for(let i = 0; i < execElm.length; i ++) {
    execElm[i].style.backgroundColor = "lightgray";
    if(i == 0) {
      execElm[i].addEventListener("click", function() {
        let truthTable = new TruthTable(initTruthTable[0], initTruthTable[1], {"ioLabelList": initTruthTable[2]});
        let lfList = truthTable.getDisjunctiveCanonicalForm(true);
        let htmlStr = "<hr><h2>加法標準形</h2>\n";
        for(let j = 0; j < lfList.length; j ++) {
          htmlStr += "<div>" + lfList[j] + "</div>";
        }
        resElm.innerHTML = htmlStr;
        selectExec(i);
      });
    } else if(i == 3) {
      execElm[i].addEventListener("click", function() {
        let truthTable = new TruthTable(initTruthTable[0], initTruthTable[1], {"ioLabelList": initTruthTable[2]});
        let lfList = truthTable.getDisjunctiveCanonicalForm(false);
        let htmlStr = "<hr><h2>加法標準形(not)</h2>\n";
        for(let j = 0; j < lfList.length; j ++) {
          htmlStr += "<div>" + lfList[j] + "</div>";
        }
        resElm.innerHTML = htmlStr;
        selectExec(i);
      });
    } else if(i == 1) {
      execElm[i].addEventListener("click", function() {
        let outputNum = initTruthTable[0][1];
        let truthTable = new TruthTable(initTruthTable[0], initTruthTable[1], {"ioLabelList": initTruthTable[2]});
        let kGraph = new KarnaughGraph(truthTable.getTruthTable());
        let size = kGraph.getSize();
        let htmlStr = "<hr><h2>カルノー図</h2>";
        for(let j = 0; j < outputNum; j ++) {
            htmlStr += 
                "<div><canvas class=\"test_canvas\" width=\"" + size[0] + 
                "\" height=\"" + size[1] + 
                "\" style=\"border:solid 1px;\">Sorry. Unsupported browser</canvas></div>";
        }
        resElm.innerHTML = htmlStr;
        selectExec(i);
        
        for(let j = 0; j < outputNum; j ++) {
          let ctx = document.getElementsByClassName("test_canvas")[j].getContext('2d');
          kGraph.showKarnaugh(ctx, j, 0, 0, true, "draw_region");
        }
      });
    } else if(i == 4) {
      execElm[i].addEventListener("click", function() {
        let outputNum = initTruthTable[0][1];
        let truthTable = new TruthTable(initTruthTable[0], initTruthTable[1], {"ioLabelList": initTruthTable[2]});
        let kGraph = new KarnaughGraph(truthTable.getTruthTable());
        let size = kGraph.getSize();
        let htmlStr = "<hr><h2>カルノー図(not)</h2>";
        for(let j = 0; j < outputNum; j ++) {
            htmlStr += 
                "<div><canvas class=\"test_canvas\" width=\"" + size[0] + 
                "\" height=\"" + size[1] + 
                "\" style=\"border:solid 1px;\">Sorry. Unsupported browser</canvas></div>";
        }
        resElm.innerHTML = htmlStr;
        selectExec(i);
        
        for(let j = 0; j < outputNum; j ++) {
          let ctx = document.getElementsByClassName("test_canvas")[j].getContext('2d');
          kGraph.showKarnaugh(ctx, j, 0, 0, false, "draw_region");
        }
      });
    } else if(i == 2) {
      execElm[i].addEventListener("click", function() {
        let truthTable = new TruthTable(initTruthTable[0], initTruthTable[1], {"ioLabelList": initTruthTable[2]});
        let kGraph = new KarnaughGraph(truthTable.getTruthTable());
        let results = kGraph.getKarnaughResultFormula(true);
        let htmlStr = "<hr><h2>結果</h2>\n";
        for(let j = 0; j < results.length; j ++) {
          htmlStr += "<div>" + results[j] + "</div>";
        }
        resElm.innerHTML = htmlStr;
        selectExec(i);
      });
    } else if(i == 5) {
      execElm[i].addEventListener("click", function() {
        let truthTable = new TruthTable(initTruthTable[0], initTruthTable[1], {"ioLabelList": initTruthTable[2]});
        let kGraph = new KarnaughGraph(truthTable.getTruthTable());
        let results = kGraph.getKarnaughResultFormula(false);
        let htmlStr = "<hr><h2>結果(not)</h2>\n";
        for(let j = 0; j < results.length; j ++) {
          htmlStr += "<div>" + results[j] + "</div>";
        }
        resElm.innerHTML = htmlStr;
        selectExec(i);
      });
    }
  }
  
  
};

const getExampleTruthTable = () => {
  let inputNum = 4;
  let outputNum = 7;
  
  selectInput(inputNum - 2);
  document.getElementById("out-num").value = outputNum;
  let lst = [
    [0, 0, 0, 0,  1, 1, 1, 1, 1, 1, 0], 
    [0, 0, 0, 1,  0, 1, 1, 0, 0, 0, 0], 
    [0, 0, 1, 0,  1, 1, 0, 1, 1, 0, 1], 
    [0, 0, 1, 1,  1, 1, 1, 1, 0, 0, 1], 
    [0, 1, 0, 0,  0, 1, 1, 0, 0, 1, 1], 
    [0, 1, 0, 1,  1, 0, 1, 1, 0, 1, 1], 
    [0, 1, 1, 0,  1, 0, 1, 1, 1, 1, 1], 
    [0, 1, 1, 1,  1, 1, 1, 0, 0, 0, 0], 
    [1, 0, 0, 0,  1, 1, 1, 1, 1, 1, 1], 
    [1, 0, 0, 1,  1, 1, 1, 0, 0, 1, 1], 
    [1, 0, 1, 0,  1, 1, 1, 0, 1, 1, 1], 
    [1, 0, 1, 1,  0, 0, 1, 1, 1, 1, 1], 
    [1, 1, 0, 0,  1, 0, 0, 1, 1, 1, 0], 
    [1, 1, 0, 1,  0, 1, 1, 1, 1, 0, 1], 
    [1, 1, 1, 0,  1, 0, 0, 1, 1, 1, 1], 
    [1, 1, 1, 1,  1, 0, 0, 0, 1, 1, 1]
  ];
  
  return createTruthTable([[inputNum, outputNum], lst, null]);
};

//真理値表を初期化し、真理値表にイベントを追加する
const getInitTruthTable = (num) => {
  selectInput(num);
  let initTruthTable = getInitialTruthTable(num);
  return createTruthTable(initTruthTable);
};

const createTruthTable = (initTruthTable) => {
  let truthTable = new TruthTable(initTruthTable[0], initTruthTable[1]);
  
  let tmpInOut = truthTable.getInputOutputName()
  initTruthTable[2] = tmpInOut[0].concat(tmpInOut[1]);
  
  truthTable.printTruthTable(document.getElementById("ttable"));
  
  let num = initTruthTable[0][0] - 2;
  
  const table = document.querySelector('#ttable table');
  let inpNumElm = document.getElementsByClassName("inp-num");
  let inpNum = inpNumElm[num].value;
  table.addEventListener('click', (event) => {
    if (event.target.tagName === 'TD') {
      const row = event.target.parentNode.rowIndex;
      const column = event.target.cellIndex;
      console.log(`行${row}のカラム${column + 1}がクリックされました。`);
      if(column >= inpNum) {
        const cellVal = event.target.innerHTML;
        let newBin = (cellVal * 1 == 0)? 1: 0;
        event.target.innerHTML = newBin;
        initTruthTable[1][row - 1][column] = newBin;
        document.getElementById("result").innerHTML = "";
        selectExec(-1);
      }
    }
    if (event.target.tagName === 'TH') {
      const row = event.target.parentNode.rowIndex;
      const column = event.target.cellIndex;
      console.log(`行${row}のカラム${column + 1}がクリックされました。`);
      
      const cellVal = event.target.innerHTML;
      event.target.innerHTML = "<input type=\"text\" size=\"1\" value=\"" + cellVal + "\">";
      
      const input = event.target.querySelector('input');
      input.focus();
      input.addEventListener('blur', () => {
        const newVal = input.value;
        event.target.innerHTML = newVal;
        initTruthTable[2][column] = newVal;
        
        document.getElementById("result").innerHTML = "";
        selectExec(-1);
      });
    }
    
  });
  
  table.addEventListener('mouseover', (event) => {
    if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
      const row = event.target.parentNode.rowIndex;
      const column = event.target.cellIndex;
      if(column >= inpNum || event.target.tagName === 'TH') {
        event.target.style.backgroundColor = 'lightgray';
      }
    }
  });
  
  table.addEventListener('mouseout', (event) => {
    if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
      const row = event.target.parentNode.rowIndex;
      const column = event.target.cellIndex;
      if(column >= inpNum || event.target.tagName === 'TH') {
        event.target.style.backgroundColor = 'white';
      }
    }
  });
  
  return initTruthTable;
};

const getInitialTruthTable = (num) => {
  let inputNum = num * 1 + 2;
  let outputNum = document.getElementById("out-num").value * 1;
  if(isNaN(outputNum) || outputNum < 1 || outputNum >= 100) {
    document.getElementById("out-num").value = 1;
    outputNum = 1;
  }
  
  outputNum = Math.floor(outputNum);
  
  let lst = [];
  for(i = 0; i < Math.pow(2, inputNum); i ++) {
    //let bin = (i >>> 0).toString(2).padStart(inputNum, "0").split("").push(...Array(outputNum).fill(0));
    let op0 = Array(outputNum).fill(0);
    let bin = (i >>> 0).toString(2).padStart(inputNum, "0").split("");
    bin.push(...op0);
    lst.push(bin);
  }
  
  return [[inputNum, outputNum], lst, null];
};

const selectInput = (num) => {
  document.getElementById("inp-num-txt").innerHTML = (num * 1 + 2) + ": ";
  let inpNumElm = document.getElementsByClassName("inp-num");
  for(let i = 0; i < inpNumElm.length; i ++) {
    let color = (i == num)? "gray": "lightgray";
    inpNumElm[i].style.backgroundColor = color;
  }
};

//実行ボタンの選択(-1のとき無選択)
const selectExec = (num) => {
  let execElm = document.getElementsByClassName("exec");
  for(let i = 0; i < execElm.length; i ++) {
    let color = (i == num)? "gray": "lightgray";
    execElm[i].style.backgroundColor = color;
  }
};

