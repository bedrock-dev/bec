function getPosArray(p,time){
    var posPow = new Array();
    let temp = 1;
    for(var i = 0; i <= time+1;i++){
        posPow.push(temp);
        temp *= p;
    }    
    return posPow;
   
}

function comb(m,n){
    let res = 1;
    for(var i = 0;i <n ;i++){
        res *= (m-i);
    }


    for(var i = 0;i < n;i++){
        res /= (i+1);
    }
    return res;
}

/*
t 尝试次数
p 概率表
stage 目标状态
*/
function getStagePInTimes(t,p,np,stage){
    let res = 1;
    for(var i = 0; i< stage;i++){
        let pos_stage = comb(t,i) * p[i] * np[t-i];
        res -= pos_stage;
    }

    return res;
}



function calculate_data(){
    let randomTickingSpeed = parseInt( $('#rng-speed').val());
    let chunkHeight = parseInt($('#chunk-height').val());
    let growPosibility = parseFloat( $('#grow-pos').val());
    let stage = parseInt($('#grow-stage').val());
    let growTime = parseInt($('#grow-time').val());


    if(isNaN(randomTickingSpeed) || isNaN(chunkHeight) || isNaN(growPosibility) || isNaN(stage)){
        alert("你还有数据没有输入");
        return false;
    }

    if(randomTickingSpeed <= 0 || randomTickingSpeed > 9999){
        alert("不合法的随机刻速度");        
        return false;

    }

    if(chunkHeight <=0 || randomTickingSpeed > 8192){
        alert("不合法的区块高度");        
        return false;
    }

    if(growPosibility <=0.0 || growPosibility > 1.0){
        alert("不合法的生长概率");        
        return false;
    }

    if(stage <=0 || stage > 20){
        alert("不合法的生长阶段");        
        return false;
    }

    if(growTime <=0 || growTime >= 36000){
        alert("不合法的测试时间");
        return false;
    }
    

    //单刺选择的概率
    let singleSelectP = 1 / (chunkHeight * 256);
    console.log("单次选中的概率为: "+ singleSelectP);
    let selectTime = parseInt(2.5 * randomTickingSpeed * chunkHeight / 16);
    console.log("选择次数为: "+ selectTime);
    let p = getStagePInTimes(selectTime, getPosArray(singleSelectP,selectTime),getPosArray(1-singleSelectP,selectTime),1) * growPosibility;

    console.log("总的状态变化的概率为"+ p);

    let x = new Array();
    x.push(0);
    let y = new Array();
    y.push(0);

    let step = 40;
    let growGt = growTime * 20;
    let pAarray = getPosArray(p,growGt);
    let npParray = getPosArray(1-p,growGt);
    
    console.log("plen = "+pAarray.length)
    console.log("nplen = ",npParray.length)


    if(growGt / step > 60){
        step = parseInt(growGt / 60);
    }


    for(let i = step;i <= growGt;i+=step){
        if(i <= growGt){
            let r = getStagePInTimes(i ,pAarray,npParray,stage);
            console.log("R = "+r);
            x.push(i/20);
            y.push(r);
        }
    }

    let res = new Array()
    for (var i = 0;i < x.length;i++){
        res.push([x[i],y[i]])
    }
    return res

}

function plot_data(chart,d,ti,xlabel,ylabel){
     var  option = {
         title: {
          text: ti
        },
 xAxis: {
    name: xlabel,
  },
  yAxis: {
    name: ylabel,
    // ...
  },
  yAxis: {},
  series: [
    {
      data:d,
      type: 'line'
    }
  ]
};
                    chart.setOption(option);
        }

$(document).ready(function () {

  var rng_chart_1 = echarts.init(document.getElementById('rng-chart-1'));
  var rng_chart_2 = echarts.init(document.getElementById('rng-chart-2'));
                    // 指定图表的配置项和数据
    $('#rng-calculate').click(function () {
        data = calculate_data();
        console.log(data)
        plot_data(rng_chart_1,data,"生长概率图","时间(s)","概率");
        
    for (var i = 0;i < data.length;i++){
        data[i][1] /= data[i][0];
        data[i][1] *= 3600;
    }
        
        plot_data(rng_chart_2,data,"相对效率图","时间(s)","相对效率");

    });

});