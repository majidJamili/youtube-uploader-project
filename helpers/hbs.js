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
    editIcon: function (wcUser, loggedUser, wcId, floating = true) {
      console.log('Workstation Maker',wcUser.toString())
      console.log('Logged User',loggedUser.toString())
      console.log(loggedUser===wcUser)
      console.log('wcId', wcId.toString())
      // if (lineUser._id.toString() == loggedUser._id.toString()) {
      //   if (floating) {
      //     return `<a href="/lines/lineid/wc/" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      //   } else {
      //     return `<a href="/stories/edit/${wcId}"><i class="fas fa-edit"></i></a>`
      //   }
      // } else {
      //   return ''
      // }
    },
}