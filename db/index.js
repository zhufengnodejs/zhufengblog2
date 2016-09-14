var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/zhufengblog2');
//定义schema
var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    avatar:String,
    email:String
});
mongoose.model('User',UserSchema);
global.Model= function(modName){
    return mongoose.model(modName);
}
