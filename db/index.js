var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
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

var ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    pv:{type:Number,default:0},
    comments:[{user:{type:ObjectId,ref:'User'},content:String,createAt:{type:Date,default:Date.now()}}],
    createAt:{type:Date,default:Date.now()},
    user:{type:ObjectId,ref:'User'}
});
mongoose.model('Article',ArticleSchema);
global.Model= function(modName){
    return mongoose.model(modName);
}
