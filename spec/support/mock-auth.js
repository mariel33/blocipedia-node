module.exports = {

    // #1
      fakeIt(app){
    // #2
        let role, id, email, username;
    
    // #3
        function middleware(req,res,next){
    
    // #4
          role = req.body.role || role;
          id = req.body.userId || id;
          email = req.body.email || email;
          username = req.body.username || username;
    
    // #5
          if(id && id != 0){
            req.user = {
              "id": id,
              "email": email,
              "role": role,
              "username": username
            };
          } else if(id == 0) {
            delete req.user;
          }
    
          if( next ){ next() }
        }
    
    // #6
        function route(req,res){
          res.redirect("/")
        }
    
    // #7
        app.use(middleware)
        app.get("/auth/fake", route)
      }
    }