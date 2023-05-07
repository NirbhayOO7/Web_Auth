// function to render homepage 
module.exports.home = function(req, res){
    return res.render('home',{
        title: 'Web Auth'
    });
}