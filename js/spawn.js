/*
density 上限
time 模拟次数
p 生成概率
*/
function simulate(time,density ,life_time,p){
    let res = []
    let totalSpawnNum = 0;
    let mobList = Array.apply(null, Array(life_time)).map(function (x, i) { return 0; })
    for(let i = 0;i <= time;i++){
        res.push([i,totalSpawnNum])
        let mobSum = mobList.reduce((a, b) => a + b, 0);
        mobList.pop();
        mobList.unshift(0);
        let rng =Math.random(); 
        if(rng <= p && mobSum < density){
            mobList[0] = 1;
            totalSpawnNum++;
        }
    }
    return res
}

function plot_data(chart, d,ti,x,y){
      var  option = {
         title: {
          text: ti
        },
    xAxis: {
    name: x,
    },
    yAxis: {
    name: y,  
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


function calculate_data(){
    let density = parseInt($('#density').val());
    let p = parseInt($('#pos').val());    
    let corr = parseFloat($('#corr').val());
    let life = parseInt($('#life').val());
    let time = parseInt($('#time').val());

    if(isNaN(density) || isNaN(p) || isNaN(corr) || isNaN(life) || isNaN(time)){
        alert("数据填充不完整");
        return;
    }

    if(density <=0 || p <=0 || corr <=0 || life <=0 || time <=0){
        alert("数据不合法(所有数据都需要正数)");
    }

    let spawnP = corr / p;
    let data = simulate(time,density,life,spawnP);
    return data    
}


$(document).ready(function () {

  var spawn_chart = echarts.init(document.getElementById('spawn-chart'));  
  // 指定图表的配置项和数据
    $('#spawn-sim').click(function () {
        let data = calculate_data()
        let step = 20;
        if(data.length / step > 100){
            step = parseInt(data.length / 100)
        }

        let d = []
        for(let i = 0;i < data.length;i+=step){
            d.push(data[i])
        }
        plot_data(spawn_chart,d,'生成数量图','时间(gt)','生成个数')        
    });


        $('#spawn-his').click(function () {  


        let m = {};
        for(var  i = 0; i < 1000;i++){
            let data = calculate_data();
            let n =  data[data.length-1][1]
            if (!m[n]) {
                m[n] = 0;
            }
            m[n] += 1;
        }
    
        d = []
       Object.keys(m).sort().forEach(function(num) {
            d.push([parseInt(num),m[num] / 1000])
        });
        
        d.sort((a,b)=>{ 
            if(a[0] < b[0])return 1;
            if(a[0] > b[0])return -1;
            return 0;
        });

    
        console.log(d)
        plot_data(spawn_chart,d,'生成频率图','生成个数','频率')        
    });


});
