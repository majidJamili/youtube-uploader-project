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
    }, 
    formatDate: function (date, format) {
        return moment(date).utc().format(format)
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
          } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
          }
        } else {
          return ''
        }
      },
}