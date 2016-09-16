var express = require('express');
var markdown = require('markdown').markdown;
var middleware = require('../middleware');
var router = express.Router();
//文章列表 1.读取文章列表 2. 渲染模板
router.get('/list', function (req, res) {
    var keyword = req.query.keyword;
    var pageNum = req.query.pageNum ? parseInt(req.query.pageNum) : 1;
    var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;
    var queryObj = {};
    if (keyword) {
        var regex = new RegExp(keyword);
        queryObj['$or'] = [{title: regex}, {content: regex}];
    }
    Promise.all([Model('Article').find(queryObj).count(), Model('Article').find(queryObj).sort({createAt:-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user')]).then(function (result) {
        var count = result[0];
        var articles = result[1];
        articles.forEach(function (article) {
            article.content = markdown.toHTML(article.content);
        });
        res.render('article/list', {
            articles,
            keyword,
            pageNum,
            pageSize,
            totalPages: Math.ceil(count / pageSize)
        });
    }).catch(function (err) {
        req.flash('error', '文章查询失败');
        res.redirect('back');
    });

});

router.get('/post', middleware.checkLogin, function (req, res) {
    res.render('article/post', {article: {}});
});

router.post('/post', middleware.checkLogin, function (req, res) {
    var article = req.body;
    var _id = article._id;
    if (_id) {//有值则意味着修改
        Model('Article').update({_id}, {
            title: article.title,
            content: article.content
        }).then(function (doc) {
            req.flash('success', '文章更新成功');
            res.redirect('/article/detail/' + _id);
        }).catch(function (err) {
            req.flash('error', '文章更新失败');
            res.redirect('back');
        });
    } else {
        article.user = req.session.user._id;
        //因为保存文档的时候，如果不删除，则会把空字符串作为ID来保存，保存失败
        //删除后mongodb认为你没有没有ID，会自动生成一个ID并保存
        delete article._id;
        Model('Article').create(article).then(function (doc) {
            req.flash('success', '文章发表成功');
            res.redirect('/');
        }).catch(function (err) {
            req.flash('error', '文章发表失败');
            res.redirect('back');
        });
    }
});

router.get('/detail/:_id', function (req, res) {
    var _id = req.params._id;
    Promise.all([Model('Article').update({_id},{$inc:{pv:1}}),
        Model('Article').findById(_id).populate('comments.user')
    ]).then(function (result) {
        var article = result[1];
        article.content = markdown.toHTML(article.content);
        res.render('article/detail', {article});
    }).catch(function (err) {
        req.flash('error', '文章查询失败');
        res.redirect('back');
    });


});

router.get('/delete/:_id', function (req, res) {
    var _id = req.params._id;
    Model('Article').remove({_id}).then(function (data) {
        req.flash('success', '删除成功');
        res.redirect('/');
    }).catch(function (err) {
        req.flash('error', '文章删除失败');
        //res.status(500).send('文章删除失败');
        res.redirect('back');
    });
});
router.get('/update/:_id', function (req, res) {
    var _id = req.params._id;
    Model('Article').findById(_id).then(function (article) {
        res.render('article/post', {article});
    }).catch(function (err) {
        req.flash('error', '文章修改失败');
        res.redirect('back');
    });
});

router.post('/comment', function (req, res) {
    var comment = req.body;
    Model('Article').update({_id: comment.articleId},
        {
            $push: {
                comments: {
                    user: req.session.user._id, content: comment.content
                }
            }
        }
    ).
    then(function () {
        res.redirect('/article/detail/' + comment.articleId);
    }).catch(function (err) {
        req.flash('error', '文章评论失败');
        res.redirect('back');
    });
});

module.exports = router;