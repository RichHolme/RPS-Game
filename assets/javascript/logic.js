$(document).ready(function() {

	// name variable
	numName = 0;

  // hide choices and info until players added
  $("#player1choices").hide();
  $("#player2choices").hide();
  $("#player1chose").hide();
  $("#player2chose").hide();
  $("#playerInfo").hide();

  // empty holder for names
	var player = '';

  // holds player for function calls 
  var playerNum = 0;

  // hold names of players
  var p1 = null;
  var p2 = null;

  var choice1 = null;
  var choice2 = "";

  // identify player screen
  var playerid = null;

  // hold round 
  var rounds = 0;

	// Initialize Firebase
  	var config = {
    	apiKey: "AIzaSyCL1PCObmLnajeuDajY868n5ovpGMli70U",
    	authDomain: "rich-rps.firebaseapp.com",
    	databaseURL: "https://rich-rps.firebaseio.com",
    	projectId: "rich-rps",
    	storageBucket: "",
    	messagingSenderId: "6293674215"
  	};

  	firebase.initializeApp(config);

  	var database = firebase.database();

    // player 1 and 2 refrences
    player1_ref = database.ref().child('Player1');
    player2_ref = database.ref().child('Player2');

    // clean out database on reload
  	function playerClear(){
  		if(numName == 0){
  			database.ref("Player1").remove();
  			database.ref("Player2").remove();
        database.ref("game").remove();
  		}
  	}

    // call clear
  	playerClear();

  	
 	database.ref().on("value", function(snapshot) {

    if (snapshot.child("Player1").exists()){
     
     // increment to identify player function to call
     numName++;

    }

 		if (snapshot.child("Player1").exists() && snapshot.child("Player2").exists()){

      if(choice1 == ""){
        $("#player1Div").addClass('yellow');
        // $("#player1choices").show();
        if(playerid == 1){
          $("#turn").text('Your turn.');
          $("#player1choices").show();
        }
        // $("#turn").text('Your turn.');
      }else{
        if(choice2 == ""){
        $("#player1Div").removeClass('yellow');
        // $("#player2choices").show();
        $("#player1choices").hide();
        $("#turn").text('Wating for player 2.');
        if(playerid == 2){
          $("#player2choices").show();
          $("#turn").text('Your turn.');
          // $("#turn").text('Wating for player 2.');
        }
      }
      }

    }

    if (snapshot.child("game").exists()){

      // grab round
      rounds = snapshot.val().rounds;
      
      // $("#player1Div").addClass('yellow');
    }
 	 		
  	// If any errors are experienced, log them to console.
	  }, function(errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});

  database.ref().on("child_added", function(snapshot) {
    
    // if first name
    if(!p1){

      // grab name
      p1 = snapshot.val();

      // display on both screens
      $("#player1").text(p1.name);

    // if not p1 
    }else if(!p2 && p1){

      // grab name
      p2 = snapshot.val();

      // dispaly on both screens
      $("#player2").text(p2.name);
    }
  });

  database.ref('/Player1/choice').on("value", function(snapshot) {
 
    choice1 = snapshot.val();
    console.log(choice1);
    beginGame();
  });

  database.ref('/Player2/choice').on("value", function(snapshot) {
    choice2 = snapshot.val();

    if(choice2 != null && choice2 != ""){
      $("#player1choose").text(choice1);
      $("#player1chose").show();

      $("#player2Div").removeClass('yellow');
      $("#player2choices").hide();
      $("#player2choose").text(choice2);
      $("#player2chose").show();

      $("#turn").hide();
      winner();
    }
    
  });


  	$(document).on('click', '#start', function(event){

      // grab player name
  		player = $('.nameOf').val().trim();

      // clean out input
  		$('.nameOf').val(' ');
  		
      // calls player 1 function
  		player1();
  	});

  	// create player1
  	function player1(){
      
      // use first function
  		if(numName == 0){
        
        // hide input bar
        $("#playerName").hide();

        // show status
        $("#playerInfo").show();

        // update name and status
        $("#player").text('Hey ' + player + '! Your player 1.');
        $("#turn").text('Wating for player 2.');

        // player 1 object for database
  			// player1_ref = database.ref().child('Player1');
  			player1_ref.set({
          id: 1,
  				name: player,
          wins: 0,
          losses: 0,
          choice: ''
  			})

        // set id
        playerid = 1;
        
        // call player 2
  		}else{
        player2();
      }
  	}

  	// create player2
  	function player2(){
      
      // hide unput bar
      $("#playerName").hide();

      // show status
      $("#playerInfo").show();

      // update name and status
      $("#player").text('Hey ' + player + '! Your player 2.');
      $("#turn").text('Wating for player 1.');

      // player 2 object for database
  		// player2_ref = database.ref().child('Player2');
  			player2_ref.set({
          id: 2,
  				name: player,
          wins: 0,
          losses: 0,
          choice: ''
  			})

      // set id
      playerid = 2;

      // game object for database 
  		game_ref = database.ref().child('game');
      game_ref.set({
        rounds: 1
      })

      // $("#player1Div").addClass('yellow');
  	}

    $('.choice').click(function(event){
      var choice = $(this).text();
      // player1_ref.update({
      //   choice: choice
      // })
      if(playerid = 1 && choice1 != "" && choice1 != null){
        player2_ref.update({
          choice: choice
        })
        $("#player2choices").hide();
        $("#player2choose").text(choice);
        $("#player2chose").show();
      }else{
        player1_ref.update({
          choice: choice
        })
        $("#player1choices").hide();
        $("#player1choose").text(choice);
        $("#player1chose").show();
      }
    });

    function beginGame(){
      if (choice1 != null && choice1 != ""){
        $("#player2Div").addClass('yellow');
        $("#player1Div").removeClass('yellow');
      } 
    }

    function winner(){
      if(choice1 == 'Rock' && choice2 == 'Sissors'){
        $("#whoWon").text("Rock Beats Sissors." + p1.name + " wins!");
      }else if(choice1 == 'Rock' && choice2 == "Paper"){
        $("#whoWon").text("Paper Wins");
      }else if(choice1 == 'Rock' && choice2 == "Rock"){
        $("#whoWon").text("Tie");
      }else if(choice1 == 'Sissors' && choice2 == "Sissors"){
        $("#whoWon").text("Tie");
      }else if(choice1 == 'Paper' && choice2 == "Paper"){
        $("#whoWon").text("Tie");
      }else if(choice2 == 'Rock' && choice1 == 'Sissors'){
        $("#whoWon").text("Rock Wins");
      }else if(choice2 == 'Rock' && choice1 == "Paper"){
        $("#whoWon").text("Paper Wins");
      }else if(choice2 == 'Rock' && choice1 == "Rock"){
        $("#whoWon").text("Tie");
      }else if(choice2 == 'Sissors' && choice1 == "Sissors"){
        $("#whoWon").text("Tie");
      }else if(choice2 == 'Paper' && choice1 == "Paper"){
        $("#whoWon").text("Tie");
      }else if(choice1 == 'Sissors' && choice2 == 'Rock'){
        $("#whoWon").text("Sissors Beats Paper." + p1.name + " wins!");
      }else if(choice1 == 'Sissors' && choice2 == "Paper"){
        $("#whoWon").text("Paper Wins");
    }
  }

});