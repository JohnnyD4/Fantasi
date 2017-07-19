// Import MySQL connection.
var connection = require("../config/connection.js")['connection'];

var orm = {

  ranking: function(table, cols, vals, year, cb) {
    
    var queryString = "SELECT `Time`, `Position`, `Rank`, `Player`, `Team` FROM " + table;

    queryString += " WHERE ";   
    for( var i = 0; i < cols.length; i++){
      queryString += cols[i] + " = " + "\"" + vals[i] + "\"" + " AND "
    }
    queryString += "`Season Type` = 'Regular Season' AND `Time` =" + year + " ORDER BY `Rank` ASC LIMIT 20;";
    
    console.log(queryString); 

    connection.query(queryString, function(err, result) {

       if (err) throw err;
          
        try{

          if(!result[0]) {
          
            throw new Error("Please enter Running Back, Quarterback, or Wide Receiver");
          
          }else {

            cb(result);

          }

        }catch(ex){

          console.log(ex.message);
          cb(ex.message);
        } 
    });
  },

  player: function(table, cols, vals, cb) {

    var positionString = "SELECT `Position` FROM " + table + " WHERE " + cols[0] + " = " + "\"" + vals[0] + "\" LIMIT 1;"

    connection.query(positionString, function(err, result) {

      if (err) throw err;

      try{

        if(!result[0]) {
        
          throw new Error("sorry player not found");
        
        }else {
         
          console.log(result[0].Position);
        
          if(result[0].Position === "Quarterback"){
            var category = "Passing";      
            var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Passer_Rating` AS PasserRating, `Yards_Per_Game_Average` AS YPG, `Interception`, `Time` FROM " + table;

          }else if(result[0].Position === "Running Back"){
            var category = "Rushing";
            var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`,`Touch Downs` AS TD, `Yards_Per_Game_Average` AS YPG, `Attempts_Per_Game` AS RushAttempts, `Average_Yards` AS AvgYards, `Time` FROM " + table;
           
          }else if(result[0].Position === "Wide Receiver"){
            var category = "Receiving";
            var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Yards`, `Yards_Per_Game_Average` AS YPG, `Receptions`, `Time` FROM " + table;
          
          }else if(result[0].Position === "Tight End"){
            var category = "Receiving";
            var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Yards`, `Yards_Per_Game_Average` AS YPG, `Receptions`, `Time` FROM " + table;
          }

          queryString += " WHERE ";   
          for( var i = 0; i < cols.length; i++){
            queryString += cols[i] + " = " + "\"" + vals[i] + "\"" + " AND "
          }

          queryString += "`Category` = " + "\"" + category + "\"" + " AND `Season Type` = 'Regular Season' ORDER BY Time ASC";
          
          console.log("query string", queryString); 

          connection.query(queryString, function(err, result) {

            if (err) throw err;

            cb(result);
        
          }); 
        } 

      }catch(ex){
        console.log("ex message", ex.message);
        cb(ex.message);
      }
    });    
  },

  addTeam: function(table, cols, vals, cb) {

    console.log("at orm addTeam");

    var queryString = "SELECT `favorite_teams` FROM " + table + " WHERE id = " + vals[1] + ";";

    connection.query(queryString, function(err, result) {

      if (err) throw err;

      if(result[0][cols[0]] == null){

        var updateString = "UPDATE " + table + " SET " + cols[0] + " = '" + vals[0] + "' WHERE id = '" + vals[1] + "';";
          
          connection.query(updateString, function(err, result) {

              if (err) throw err;
              var teamString = ("SELECT `Team`, `Time`, sum(`Touch Downs`) AS TD, sum(`Total_Points_Game_Average`) AS PPG, sum(`Sacked`) AS Sacked, sum(`Fumbles_Total`) AS Fumbles, sum(`Interception`) AS Interceptions FROM `nfl` WHERE `Team` = '" + vals[0] +"' AND `Season Type` = 'Regular Season' GROUP BY `TIME` DESC;");

              //console.log(teamString);

              connection.query(teamString, function(err, result){
                //console.log(result);
               cb(result) 
              })
              
          });

      }else{  

        var split = result[0][cols[0]].split(",")
        //trim
        //toUpperCase
        //check toLowerCase
        console.log(split);
        console.log(vals[0]);
        console.log(split.indexOf(vals[0]));
        // console.log(result[0][cols[0]] + ", " + vals[0]);
        if(split.indexOf(vals[0]) == -1){

          var updateString = "UPDATE " + table + " SET " + cols[0] + " = '" + result[0][cols[0]] + "," + vals[0] + "' WHERE id = " + vals[1] + ";";

          connection.query(updateString, function(err, result) {

              if (err) throw err;


              var teamString = ("SELECT `Team`, `Time`, sum(`Touch Downs`) AS TD, sum(`Total_Points_Game_Average`) AS PPG, sum(`Sacked`) AS Sacked, sum(`Fumbles_Total`) AS Fumbles, sum(`Interception`) AS Interceptions FROM `nfl` WHERE `Team` = '" + vals[0] +"' AND `Season Type` = 'Regular Season' GROUP BY `TIME` DESC;");

              //console.log(teamString);

              connection.query(teamString, function(err, result){
                //console.log(result);
               cb(result) 
              })
              

          });

        }else{

          cb("Team is already one of your favorites")
        }  
      }
    });
  },

  addPlayer: function(table, cols, vals, cb) {

    console.log("at orm addPlayer");

    var queryString = "SELECT `favorite_players` FROM " + table + " WHERE id = " + vals[1] + ";";

    connection.query(queryString, function(err, result) {

        if (err) throw err;

        if(result[0][cols[0]] == null){

          var updateString = "UPDATE " + table + " SET " + cols[0] + " = '" + vals[0] + "' WHERE id = '" + vals[1] + "';";
            
            connection.query(updateString, function(err, result) {

                if (err) throw err;

                var positionString = "SELECT `Position` FROM `nfl` WHERE `Player` = " + "\"" + vals[0] + "\" LIMIT 1;"

                connection.query(positionString, function(err, result) {

                  if (err) throw err;
                     
                      console.log("player position 207", result[0].Position);
                    
                      if(result[0].Position === "Quarterback"){
                        var category = "Passing";      
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Passer_Rating` AS PasserRating, `Yards_Per_Game_Average` AS YPG, `Interception`, `Time` FROM `nfl`";

                      }else if(result[0].Position === "Running Back"){
                        var category = "Rushing";
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`,`Touch Downs` AS TD, `Yards_Per_Game_Average` AS YPG, `Attempts_Per_Game` AS RushAttempts, `Average_Yards` AS AvgYards, `Time` FROM `nfl`";
                       
                      }else if(result[0].Position === "Wide Receiver"){
                        var category = "Receiving";
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Yards`, `Yards_Per_Game_Average` AS YPG, `Receptions`, `Time` FROM `nfl`";
                      
                      }else if(result[0].Position === "Tight End"){
                        var category = "Receiving";
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Yards`, `Yards_Per_Game_Average` AS YPG, `Receptions`, `Time` FROM `nfl`";
                      }

                      queryString += " WHERE ";   
                     
                      queryString += "`Player` = " + "\"" + vals[0] + "\"" + " AND "
                      
                      queryString += "`Category` = " + "\"" + category + "\"" + " AND `Season Type` = 'Regular Season' ORDER BY Time ASC";
                      
                      console.log(queryString); 

                      connection.query(queryString, function(err, result) {

                        if (err) throw err;

                        cb(result);

                      });
                  });    

            });

        }else{ 
          
            var split = result[0][cols[0]].split(",")
            
            console.log(split.indexOf(vals[0]));
            
          if(split.indexOf(vals[0]) == -1){

            console.log(result[0][cols[0]])
        
            var updateString = "UPDATE " + table + " SET " + cols[0] + " = '" + result[0][cols[0]] + "," + vals[0] + "' WHERE id = " + vals[1] + ";";

            connection.query(updateString, function(err, result) {

                if (err) throw err;

                var positionString = "SELECT `Position` FROM `nfl` WHERE `Player` = " + "\"" + vals[0] + "\" LIMIT 1;"

                connection.query(positionString, function(err, result) {

                  if (err) throw err;
                     
                      console.log("player position 207", result[0].Position);
                    
                      if(result[0].Position === "Quarterback"){
                        var category = "Passing";      
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Passer_Rating` AS PasserRating, `Yards_Per_Game_Average` AS YPG, `Interception`, `Time` FROM `nfl`";

                      }else if(result[0].Position === "Running Back"){
                        var category = "Rushing";
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`,`Touch Downs` AS TD, `Yards_Per_Game_Average` AS YPG, `Attempts_Per_Game` AS RushAttempts, `Average_Yards` AS AvgYards, `Time` FROM `nfl`";
                       
                      }else if(result[0].Position === "Wide Receiver"){
                        var category = "Receiving";
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Yards`, `Yards_Per_Game_Average` AS YPG, `Receptions`, `Time` FROM `nfl`";
                      
                      }else if(result[0].Position === "Tight End"){
                        var category = "Receiving";
                        var queryString = "SELECT `Player`, `Team`, `Position`, `Rank`, `Touch Downs` AS TD, `Yards`, `Yards_Per_Game_Average` AS YPG, `Receptions`, `Time` FROM `nfl`";
                      }

                      queryString += " WHERE ";   
                     
                      queryString += "`Player` = " + "\"" + vals[0] + "\"" + " AND "
                      
                      queryString += "`Category` = " + "\"" + category + "\"" + " AND `Season Type` = 'Regular Season' ORDER BY Time ASC";
                      
                      console.log(queryString); 

                      connection.query(queryString, function(err, result) {

                        if (err) throw err;

                        cb(result);
                    
                      }); 
                });                    
            });

           }else{

              cb("Player is already one of your favorites")
           }
        }      
    });
  },

  team: function(table, cols, vals, cb) {

      var queryString = "SELECT `Team`, `Time`, sum(`Touch Downs`) AS TD, sum(`Total_Points_Game_Average`) AS PPG, sum(`Sacked`) AS Sacked, sum(`Fumbles_Total`) AS Fumbles, sum(`Interception`) AS Interceptions FROM " + table;

      queryString += " WHERE " + cols[0] + " = " + "\"" + vals[0] + "\"";   
      
      queryString += " AND `Season Type` = 'Regular Season' GROUP BY `TIME` DESC;";

      console.log(queryString);    

      connection.query(queryString, function(err, result) {

        if (err) throw err;
          
          try{

            if(!result[0]) {
            
              throw new Error("sorry team not found");
            
            }else {

              cb(result);

            }

          }catch(ex){

            console.log(ex.message);
            cb(ex.message);
          }          
      })    
  },
  
  createUser: function(table, valName, valEmail, valPassword, cb) {

    var repeatString = "SELECT 1 FROM " + table;

    repeatString += " WHERE email_address = '" + valEmail + "';";
    console.log(repeatString);
    connection.query(repeatString, function(err, res) {
       
      if (err) throw err;
        
        if(res[0] == undefined){

          var queryString = "INSERT INTO " + table;

          queryString += " (name, email_address, password) VALUES ('" + valName + "',";
          
          queryString += " '"  + valEmail + "', '" + valPassword + "')";

          console.log(queryString);

          connection.query(queryString, function(err, result) {

            if (err) throw err;
           
            var idString = ("SELECT `id` FROM `user` WHERE `email_address` = '" + valEmail + "';");
            
            console.log(idString)
            connection.query(idString, function(err, result){

              if (err) throw err;
             
              cb(result[0].id);
              console.log("id of new user in orm", result[0].id);
            });

            
          });
          
        }else{

            cb("Email already exists");          
        }
    });
  },

  loginAs: function(table, valEmail, valPassword, cb) {

    var queryString = "SELECT id, name, favorite_players, favorite_teams FROM " + table;

    queryString += " WHERE email_address = '" + valEmail + "'";

    queryString +=  " AND password = '" + valPassword + "'";

    console.log(queryString);

    connection.query(queryString, function(err, result) {

      if (err) throw err;

        try{

          if(!result[0]) {
            
            throw new Error("Sorry email and password do not match");
          
          } else {
     
            cb(result[0]);
          }

        }catch (err) {
          console.error("179", err.message);
          cb(err.message);
      } 
    })
  },

  displayUser: function(table, id, cb) {

    var queryString = "SELECT * FROM " + table;

    queryString += " WHERE id = " + id;

    //console.log(queryString);

    connection.query(queryString, function(err, result) {

      if (err) throw err;
      console.log("orm 407", result[0].userPhoto);

      if (result[0].userPhoto == null){
          result[0].userPhoto = "../images/placeholder.png";
        }

      if(result[0].favorite_teams == null && result[0].favorite_players == null){
        result[0].favorite_players = "";
        result[0].favorite_teams ="";
        cb(result)

      }else{

        if (result[0].favorite_players == null) {
          result[0].favorite_players = "";
          cb(result);

        }else if(result[0].favorite_teams == null){
          result[0].favorite_teams ="";
          cb(result);
        }else{

        cb(result);
        }
      }
    })    
  },

  uploadPhoto : function(table, cols, vals, cb){

    var queryString = "UPDATE " + table + " SET " + cols[0] + " = '" + vals[0] + "' WHERE " + cols[1] + " = " + vals[1] + ";";

   console.log(queryString);

   connection.query(queryString, function(err, results) {
      if (err) throw err;

     var getIDstring = "SELECT * FROM " + table + " WHERE " + cols[1] + " = " + vals[1] + ";";

     connection.query(getIDstring, function (err, results) {
        if (err) throw err;

       // if (results[0].userPhoto == null){
        //   results[0].userPhoto = “http://via.placeholder.com/150x150“; (373B)


       // }
        console.log("post photo update user info", results[0].userPhoto);

        var splitPhoto = results[0].userPhoto.split("/")
        console.log("first", splitPhoto[0]);
        splitPhoto[0] = "..";
        console.log("split", splitPhoto[0]);
        var joinPhoto = splitPhoto.join("/");
        console.log(joinPhoto);
        var newString = "UPDATE user SET " + cols[0] + " = '" + joinPhoto + "' WHERE " + cols[1] + " = " + vals[1] + ";";

        connection.query(newString, function (err, data) {
          if (err) throw err;
          console.log(data);
          cb(data);
        })
        
      })
    })
    
 }
}

// Export the orm object for the model (models.js).
module.exports = orm;