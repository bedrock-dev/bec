var key = function(obj){
  // Some unique object-dependent key
  return obj.totallyUniqueEmployeeIdKey; // Just an example
};

const village_map = {};

function refresh_table(){
}

function print_map(){
    for (let key in village_map) {
    console.log(key); 
}


}

function add_villager(vill){
    if(!village_map[key(vill.id)]){
        village_map[key(vill.id)] = vill;
        print_map();
    }else{
        alert('存在重复id');
    }
}

function auto_gene_id(){
}


function collection_data(){
   
    let vill_name = $('#vill-name').val().replace(/\s/g, '');
    let id = parseInt($('#vill-id').val());
    let bed_str = $('#vill-bed').val();
    let x = parseInt(bed_str.split(',')[0]);
    let y = parseInt(bed_str.split(',')[1]);
    // let randomTickingSpeed = parseInt( $('#rng-speed').val());
   
    console.log(vill_name);

    if(vill_name.length == 0){
        alert("请填写村民名字");
        return;
    }

    if (isNaN(id)){
        console.log('将使用自增id');
        id = 12;
    }

    if(id < 0 ){
        alert('id必须是非负数且不能重复');
        return;
    }

    if( isNaN(x) || isNaN(y)){
        alert('床坐标不合法');
        return;
    }

    if(x <0 || x > 1000 || y < 0 || y >1000){
        alert('床坐标只能在 0 ~ 1000之内');
        return;
    }
    return{
        "name": vill_name,
        "id": id,
        "x": x,
        "y": y
    };


}

$(document).ready(function(){

    $('#add-vill').click(function () {
        let data = collection_data();
        console.log(data);
        add_villager(data);

    });

    const canvas = document.querySelector('.vill');

    const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0,0,width,height);


// ctx.fillStyle = 'rgb(255,0,0)';
// ctx.fillRect(50,50,100,150);

// ctx.fillStyle = 'rgb(0,255,0)';
// ctx.fillRect(75,75,100,100);

// ctx.fillStyle = 'rgba(255,0,255,0.75)';
// ctx.fillRect(25,100,175,50);

// ctx.strokeStyle = 'rgb(255,255,255)';
// ctx.lineWidth = 5;
// ctx.strokeRect(25,25,175,200);

});
