const moment = require('moment');
const Handlebars = require('handlebars'); 

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
    }, 
    formatDate: function (date, format) {
        return moment(date).utc().format(format)
    },
    bold:function(text){
      var result = "<b>" + Handlebars.escapeExpression(text) + "</b>";
      return new Handlebars.SafeString(result);
    },
    editIcon: function (wcUser, loggedUser, wcId,lineId, floating = true) {
      if (wcUser.toString() == loggedUser._id.toString()) {          
          return ` <div class="tool-c">
                      <a href='/lines/${lineId.toString()}/wc/${wcId.toString()}/edit' ><i class="fa-solid fa-pen-to-square" id="green"></i></a> 
                      <a href='/lines/${lineId.toString()}/wc/${wcId.toString()}/delete' id="red"><i class="fa-solid fa-trash" id="red"></i></a>
                      </div>`        
      } else {
        return ''
      }
    },
}