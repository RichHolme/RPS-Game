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

  // holds player num for function calls 
  var playerNum = 0;

  // hold names of players
  var p1 = null;
  var p2 = null;

  // holds player wins
  var p1Wins = 0;
  var p2Wins = 0;

  // holds player losses
  var p1Loss = 0;
  var p2Loss = 0;

  // hold choice picked
  var choice1 = null;
  var choice2 = null;

  // identify player screen
  var playerid = null;

  // hold round 
  var rounds = 0;

  // holds lines of chat
  var chatLines = 0;
  // var chatLines2 = 0;

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

    // chat refrence
    chat_ref = database.ref().child('chat');

    // clean out database on page reload
  	function playerClear(){
  		if(numName == 0){
  			database.ref("Player1").remove();
  			database.ref("Player2").remove();
        database.ref("chat").remove();
  		}
  	}

    // call clear
  	playerClear();

  // listen for any data changes
 	database.ref().on("value", function(snapshot) {

    // when player 1 is added
    if (snapshot.child("Player1").exists()){

    // increment to identify player function to call
    numName++;

    }

    // when payer 1 and 2 are added
 		if (snapshot.child("Player1").exists() && snapshot.child("Player2").exists()){

      // id choice1 is empty 
      if(choice1 == ""){

        // hilight player 1 for choice
        $("#player1Div").addClass('yellow');

        // if player 1
        if(playerid == 1){

          // display turn
          $("#turn").text('Your turn.');

          // show choices
          $("#player1choices").show();
        }
      
      // if player 2
      }else{

        // if choice2 empty
        if(choice2 == ""){

          // remove highlight from player 1
          $("#player1Div").removeClass('yellow');
          
          // hide player 1 choices
          $("#player1choices").hide();

          // display waiting status
          $("#turn").text('Wating for player 2.');

          // id player 2
          if(playerid == 2){

            // show choices
            $("#player2choices").show();

            // display turn
            $("#turn").text('Your turn.');
            
          }
        }
      }

    }

  	// If any errors are experienced, log them to console.
	  }, function(errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});

  // when chat updated
  database.ref('/chat/chat1').on("value", function(snapshot) {
    var chat = snapshot.val();
    console.log(chat);

    if(chat != null && chatLines == 0){
    
      chatLines++

      $("#textHere").text(p1.name +': ' + chat + '\n');

    }else if(chat != null && chatLines != 0){
    
        $("#textHere").append(p1.name +': ' + chat + '\n');
    }
    // $("#textHere").text(chat);
  });

  // when chat updated
  database.ref('/chat/chat2').on("value", function(snapshot) {
    var chat = snapshot.val();

    if(chat != null && chatLines == 0){
    
      chatLines++

      $("#textHere").text(p2.name +': ' + chat + '\n');

    }else if(chat != null && chatLines != 0){
    
        $("#textHere").append(p2.name +': ' + chat + '\n');
    }
    // $("#textHere").text(chat);
  });

  // when child added
  database.ref().on("child_added", function(snapshot) {
    
    // if not true
    if(!p1){

      // grab name
      p1 = snapshot.val();

      // display on both screens
      $("#player1").text(p1.name);

    // if not true 
    }else if(!p2 && p1){

      // grab name
      p2 = snapshot.val();

      // dispaly on both screens
      $("#player2").text(p2.name);
    }

  });

  // when choice for player 1 is made
  database.ref('/Player1/choice').on("value", function(snapshot) {
 
    // grab value
    choice1 = snapshot.val();

    // start game
    beginGame();

  });

  // when choice for player 2 is made
  database.ref('/Player2/choice').on("value", function(snapshot) {

    // grab value
    choice2 = snapshot.val();

    // if choice 2 not empty
    if(choice2 != null && choice2 != ""){

      // display choice 1
      $("#player1choose").text(choice1);
      $("#player1chose").show();

      // remove player 2 highlight
      $("#player2Div").removeClass('yellow');

      // hide player 2 choices
      $("#player2choices").hide();

      // display choice 2
      $("#player2choose").text(choice2);
      $("#player2chose").show();

      // hide turn status
      $("#turn").hide();

      // call to determine winner
      winner();
    }
    
  });

  // look for player 1 wins
  database.ref('/Player1/wins').on("value", function(snapshot) {

    // grab update
    var wins = snapshot.val();

    // display update
    $(".wLCount1").text('Wins: ' + wins + ' Losses: ' + p1Loss)

  });

  // look for player 1 losses
  database.ref('/Player1/losses').on("value", function(snapshot) {

    // grab update
    var losses = snapshot.val();

    // this prevents start screen from dispalying null
    if(losses == null){
      losses = 0;
    }

    // display update
    $(".wLCount1").text('Wins: ' + p1Wins + ' Losses: ' + losses)

  });

  // look for player 2 wins
  database.ref('/Player2/wins').on("value", function(snapshot) {

    // grab update
    var wins = snapshot.val();

    // display update
    $(".wLCount2").text('Wins: ' + wins + ' Losses: ' + p2Loss)
  });

   // look for player 2 losses
  database.ref('/Player2/losses').on("value", function(snapshot) {

    // grab update
    var losses = snapshot.val();

    // this prevents start screen from displaying null
    if(losses == null){
      losses = 0;
    }

    // display update
    $(".wLCount2").text('Wins: ' + p2Wins + ' Losses: ' + losses)

  });

  // listen for start button click
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

      // set object for database
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

      // call player 2 function
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
  	player2_ref.set({
      id: 2,
  		name: player,
      wins: 0,
      losses: 0,
      choice: ''
		})

    // set id
    playerid = 2;

  }

  // listen for choice clicks
  $(document).on('click', '.choice', function(event){

    // grab value
    var choice = $(this).text();
    
    // if player 1 already chosen
    if(choice1 != "" && choice1 != null){

      // update player 2 choice
      player2_ref.update({
        choice: choice
      })

      // hide choices and display choice
      $("#player2choices").hide();
      $("#player2choose").text(choice);
      $("#player2chose").show();

    // if player 1 not chosen 
    }else{

      // update player 2 choice
      player1_ref.update({
        choice: choice
      })

      // hide choices and display choice
      $("#player1choices").hide();
      $("#player1choose").text(choice);
      $("#player1chose").show();

    }

  });

  // listen for user chat
  $(document).on('click', '#addinput', function(event){

    event.preventDefault()

    // grab chat input
    var chat = $("#input").val().trim();
    // console.log(chat);
    $("#input").val(" ");

    if(playerid == 1){

      chat_ref.update({
        chat1: chat

      })

    }else{

      chat_ref.update({
        chat2: chat

      })
    }

  });

  // start game
  function beginGame(){

    // if player 1 coice made
    if (choice1 != null && choice1 != ""){

      // highlight player 2
      $("#player2Div").addClass('yellow');

      // remove highlight from player 1
      $("#player1Div").removeClass('yellow');

    } 
  }

  function winner(){

    // show winner
    $("#whoWon").show();

    // rock
    if(choice1 == 'Rock' && choice2 == 'Sissors'){

      // update winner
      $("#whoWon").text("Rock Beats Sissors. " + p1.name + " wins!");

      // update score
      p1Wins++;
      p2Loss++;

      // call to restart game
      reset();

    }else if(choice1 == 'Rock' && choice2 == "Paper"){

      // update winner
      $("#whoWon").text("Paper Beats Rock. " + p2.name + " wins!");

      // update score
      p2Wins++;
      p1Loss++;

      // call to restart game
      reset();

    }else if(choice2 == 'Rock' && choice1 == 'Sissors'){

      // update winner
      $("#whoWon").text("Rock Beats Sissors. " + p2.name + " wins!");

      // update score
      p2Wins++;
      p1Loss++;

      // call to restart game
      reset();

    }else if(choice2 == 'Rock' && choice1 == "Paper"){

      // update winner
      $("#whoWon").text("Paper Beats Rock. " + p1.name + " wins!");

      // update score
      p1Wins++;
      p2Loss++;

      // call to restart game
      reset();

    // sissors
    }else if(choice1 == 'Sissors' && choice2 == 'Paper'){

      // update winner
      $("#whoWon").text("Sissors Beats Paper. " + p1.name + " wins!");

      // update score
      p1Wins++;
      p2Loss++;

      // call to restart game
      reset();

    }else if(choice1 == 'Sissors' && choice2 == "Rock"){

      // update winner
      $("#whoWon").text("Rock Beats Sissors. " + p2.name + " wins!");

      // update score
      p2Wins++;
      p1Loss++;

      // call to restart game
      reset();

    }else if(choice2 == 'Sissors' && choice1 == 'Paper'){

      // update winner
      $("#whoWon").text("Sissors Beats Paper. " + p2.name + " wins!");

      // update score
      p2Wins++;
      p1Loss++;

      // call to restart game
      reset();

    }else if(choice2 == 'Sissors' && choice1 == "Rock"){

      // update winner
      $("#whoWon").text("Rock Beats Sissors. " + p1.name + " wins!");

      // update score
      p1Wins++;
      p2Loss++;

      // call to restart game
      reset();
         

    // sissors
    }else if(choice1 == 'Paper' && choice2 == 'Rock'){

      // update winner
      $("#whoWon").text("Paper Beats Rock. " + p1.name + " wins!");

      // update score
      p1Wins++;
      p2Loss++;

      // call to restart game
      reset();

    }else if(choice1 == 'Paper' && choice2 == "Sissors"){

      // update winner
      $("#whoWon").text("Sissors Beats Paper. " + p2.name + " wins!");

      // update score
      p2Wins++;
      p1Loss++;

      // call to restart game
      reset();

    }else if(choice2 == 'Paper' && choice1 == 'Rock'){

      // update winner
      $("#whoWon").text("Paper Beats Rock. " + p2.name + " wins!");

      // update score
      p2Wins++;
      p1Loss++;

      // call to restart game
      reset();

    }else if(choice2 == 'Paper' && choice1 == "Sissors"){

      // update winner
      $("#whoWon").text("Sissors Beats Paper. " + p1.name + " wins!");

      // update score
      p1Wins++;
      p2Loss++;

      // call to restart game
      reset();


      // ties
    }else if(choice1 == 'Rock' && choice2 == "Rock"){

      // update winner
      $("#whoWon").text("Tie");

      // call to restart game
      reset();

    }else if(choice1 == 'Sissors' && choice2 == "Sissors"){

      // update winner
      $("#whoWon").text("Tie");

      // call to restart game
      reset();

    }else if(choice1 == 'Paper' && choice2 == "Paper"){

      // update winner
      $("#whoWon").text("Tie");

      // call to restart game
      reset();

    }

    // call to set wins & losses
    setWins(p1Wins, p1Loss, p2Wins, p2Loss);

  }

  // restart game
  function reset(){

    // set time
    var time = 4;

    // start countdown
    var x = setInterval(function() {

      // decrement time
      time--;

      // when time runs out
      if(time <= 0){

        // stop countdown
        clearInterval(x);

        // reset choices
        var choice1 = null;
        var choice2 = null;

        player1_ref.update({
          choice: ""
        })

        player2_ref.update({
          choice: ""
        })

        $("#player1chose").hide();
        $("#player2chose").hide();

        // hide winner
        $("#whoWon").hide();

        // hilight player 1 for choice
        $("#player1Div").addClass('yellow');

        // display turn
        $("#turn").show();

        // if player 1
        if(playerid == 1){

          // display turn
          $("#turn").text('Your turn.');

          // show choices
          $("#player1choices").show();
        }else if(playerid == 2){

          // display turn
          $("#turn").text('Waiting for player 1.');

        }

      };

    }, 1000);
  }

  // setting wins & losses
  function setWins(){

    // update player 1
    player1_ref.update({
        losses: p1Loss,
        wins: p1Wins
      })

    // update player 2
    player2_ref.update({
        losses: p2Loss,
        wins: p2Wins
      })
  }

});