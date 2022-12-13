const moment = require('moment'); 

module.exports = {
    json: function(obj) {
        return JSON.stringify(obj);
    }, 
    section: function(name, options){
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this); 
        return null;
    }, 
    toUpperCase:function(str){
        return str.toUpperCase(); 
    }
}