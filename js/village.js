/**
 * HashMap - HashMap Class for JavaScript
 * @author Ariel Flesler <aflesler@gmail.com>
 * @version 2.4.0
 * Homepage: https://github.com/flesler/hashmap
 */

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof module === 'object') {
		// Node js environment
		var HashMap = module.exports = factory();
		// Keep it backwards compatible
		HashMap.HashMap = HashMap;
	} else {
		// Browser globals (this is window)
		this.HashMap = factory();
	}
}(function() {

	function HashMap(other) {
		this.clear();
		switch (arguments.length) {
			case 0: break;
			case 1: {
				if ('length' in other) {
					// Flatten 2D array to alternating key-value array
					multi(this, Array.prototype.concat.apply([], other));
				} else { // Assumed to be a HashMap instance
					this.copy(other);
				}
				break;
			}
			default: multi(this, arguments); break;
		}
	}

	var proto = HashMap.prototype = {
		constructor:HashMap,

		get:function(key) {
			var data = this._data[this.hash(key)];
			return data && data[1];
		},

		set:function(key, value) {
			// Store original key as well (for iteration)
			var hash = this.hash(key);
			if ( !(hash in this._data) ) {
				this.size++;
			}
			this._data[hash] = [key, value];
		},

		multi:function() {
			multi(this, arguments);
		},

		copy:function(other) {
			for (var hash in other._data) {
				if ( !(hash in this._data) ) {
					this.size++;
				}
				this._data[hash] = other._data[hash];
			}
		},

		has:function(key) {
			return this.hash(key) in this._data;
		},

		search:function(value) {
			for (var key in this._data) {
				if (this._data[key][1] === value) {
					return this._data[key][0];
				}
			}

			return null;
		},

		delete:function(key) {
			var hash = this.hash(key);
			if ( hash in this._data ) {
				this.size--;
				delete this._data[hash];
			}
		},

		type:function(key) {
			var str = Object.prototype.toString.call(key);
			var type = str.slice(8, -1).toLowerCase();
			// Some browsers yield DOMWindow or Window for null and undefined, works fine on Node
			if (!key && (type === 'domwindow' || type === 'window')) {
				return key + '';
			}
			return type;
		},

		keys:function() {
			var keys = [];
			this.forEach(function(_, key) { keys.push(key); });
			return keys;
		},

		values:function() {
			var values = [];
			this.forEach(function(value) { values.push(value); });
			return values;
		},

		entries:function() {
			var entries = [];
			this.forEach(function(value, key) { entries.push([key, value]); });
			return entries;
		},

		// TODO: This is deprecated and will be deleted in a future version
		count:function() {
			return this.size;
		},

		clear:function() {
			// TODO: Would Object.create(null) make any difference
			this._data = {};
			this.size = 0;
		},

		clone:function() {
			return new HashMap(this);
		},

		hash:function(key) {
			switch (this.type(key)) {
				case 'undefined':
				case 'null':
				case 'boolean':
				case 'number':
				case 'regexp':
					return key + '';

				case 'date':
					return '♣' + key.getTime();

				case 'string':
					return '♠' + key;

				case 'array':
					var hashes = [];
					for (var i = 0; i < key.length; i++) {
						hashes[i] = this.hash(key[i]);
					}
					return '♥' + hashes.join('⁞');

				default:
					// TODO: Don't use expandos when Object.defineProperty is not available?
					if (!key.hasOwnProperty('_hmuid_')) {
						key._hmuid_ = ++HashMap.uid;
						hide(key, '_hmuid_');
					}

					return '♦' + key._hmuid_;
			}
		},

		forEach:function(func, ctx) {
			for (var key in this._data) {
				var data = this._data[key];
				func.call(ctx || this, data[1], data[0]);
			}
		}
	};

	HashMap.uid = 0;

	// Iterator protocol for ES6
	if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
		proto[Symbol.iterator] = function() {
			var entries = this.entries();
			var i = 0;
			return {
				next:function() {
					if (i === entries.length) { return { done: true }; }
					var currentEntry = entries[i++];
					return {
						value: { key: currentEntry[0], value: currentEntry[1] },
						done: false
					};
				}
			};
		};
	}

	//- Add chaining to all methods that don't return something

	['set','multi','copy','delete','clear','forEach'].forEach(function(method) {
		var fn = proto[method];
		proto[method] = function() {
			fn.apply(this, arguments);
			return this;
		};
	});

	//- Backwards compatibility

	// TODO: remove() is deprecated and will be deleted in a future version
	HashMap.prototype.remove = HashMap.prototype.delete;

	//- Utils

	function multi(map, args) {
		for (var i = 0; i < args.length; i += 2) {
			map.set(args[i], args[i+1]);
		}
	}

	function hide(obj, prop) {
		// Make non iterable if supported
		if (Object.defineProperty) {
			Object.defineProperty(obj, prop, {enumerable:false});
		}
	}

	return HashMap;
}));


////////////////////////////////////////////


  
const village_map = new HashMap();

function print_map(){
    village_map.forEach(function(value, key) {
    console.log(key + " : " + value);
});

}

function add_villager(vill){
    if(!village_map.get(vill.id)){
        village_map.set(vill.id,vill);
        print_map();
    }else{
        alert('发现存在重复id');
    }
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
