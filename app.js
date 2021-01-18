firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        let uid = user.uid;
        document.getElementById("register_div").style.display = "none";
        document.getElementById("login_div").style.display = "none";
        document.getElementById("userinfo").style.display = "flex";
        // ...
    } else {
        // User is signed out
        // ...
        //   let uid = user.uid;
        document.getElementById("register_div").style.display = "flex";
        document.getElementById("login_div").style.display = "flex";
        document.getElementById("userinfo").style.display = "none";
    }
});

function logoutUser() {
    firebase.auth().signOut();
}
function loginUser() {
    let email = document.getElementById("logemail").value;
    let password = document.getElementById("logpassword").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in 
            location.reload();
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage);
        });
}

function registerUser() {
    let email = document.getElementById("regemail").value;
    let password = document.getElementById("regpassword").value;
    let balance = document.getElementById("regbalance").value;
    let username = document.getElementById("regusername").value;
    function writeUserData(username, email, balance) {
        firebase.database().ref('users/' + username).set({
            username: username,
            email: email,
            balance: balance,
        });
    }
    var database = firebase.database();
    if (document.getElementById("regusername").validity.valid) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                // Signed in 
                // ...





                writeUserData(username, email, balance);
                firebase.auth().signOut()
                alert(email + " registered");

            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                // ..
                alert(errorMessage);
            });
    }
    else {
        alert("Username requiered");
    }
}

var starCountRef = firebase.database().ref('users/');
var user = firebase.auth().currentUser;
var email;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        if (user != null) {
            email = user.email;
        }
    }
    document.getElementById("usermessage").innerText = "Welcome " + email;
});
starCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    var list = document.getElementById("list");
    // var els = document.getElementById("list").document.getElementsByTagName("li");
    Object.keys(data).forEach(key => {
        
        if (email != data[key].email) {
            var newUsernameList = document.createElement("li");
            var newUserBalance = document.createElement("li");
            var userName = document.createTextNode(data[key].username);
            var userBalance = document.createTextNode(data[key].balance);
            newUsernameList.appendChild(userName);
            newUserBalance.appendChild(userBalance)
            list.appendChild(newUsernameList);
            list.appendChild(newUserBalance);
        }
    });
});
document.getElementById("transfer_option").addEventListener("click", function () {
    document.querySelector(".money_transfer").style.display = "flex";
})

document.querySelector(".close").addEventListener("click", function () {
    document.querySelector(".money_transfer").style.display = "none";
})

document.querySelector(".transfer_button").addEventListener("click", function () {
    var uname = document.querySelector(".transfer_to_username").value;
    var amount = document.querySelector(".transfer_amount").value;
    var firebaseRef=firebase.database().ref("users/").child(uname);
    firebaseRef.once("value").then(function(snapshot){
        var preAmount = snapshot.val();
        if (amount > 0) {
            firebase.database().ref("users/").child(uname).update({ 'balance': Number(amount)+Number(preAmount.balance)});
            document.querySelector(".money_transfer").style.display = "none";
            location.reload();
        }
        else {
            alert("Invalid input");
        }
    })

})
