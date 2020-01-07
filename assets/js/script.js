$(document).ready(function () {

    // INITIALIZE FIREBASE
    firebase.initializeApp({
        apiKey: "AIzaSyAtpNH8cs9X843AIc7qA2aX3pjhlNZ63HU",
        authDomain: "message-board-620ca.firebaseapp.com",
        databaseURL: "https://message-board-620ca.firebaseio.com",
        projectId: "message-board-620ca",
        storageBucket: "message-board-620ca.appspot.com",
        messagingSenderId: "324044733313",
        appId: "1:324044733313:web:eb10114b6558ed5cbcc680",
        measurementId: "G-S1NC4Y46MM"
    });

    // REFERENCE CHATROOM DOCUMENT
    let docRef = firebase.firestore()
        .collection("chatrooms")
        .doc("chatroom1");
    // REFERENCE CHATROOM MESSAGES
    let messagesRef = docRef
        .collection("messages");

    // QUERY MESSAGES BY TIMESTAMP ORDERING
    let queryRef = messagesRef
        .orderBy("timeStamp", "asc");

    // REGISTER DOM ELEMENTS
    const $cardHeader = $('#card-header');
    const $messageField = $('#message-field');
    const $nameField = $('#name-field');
    const $messageList = $('#message-list');

    // SET CHAT ROOM TITLE
    docRef.get().then(function (doc) {
        $cardHeader.html(doc.data().name);
    });

    // LISTEN FOR KEYPRESS EVENT
    $messageField.keypress(function (e) {
        if (e.keyCode == 13) {
            //FIELD VALUES
            let senderName = $nameField.val();
            let message = $messageField.val();

            //SAVE DATA TO FIREBASE
            messagesRef.add({
                "senderName": senderName,
                "message": message,
                "timeStamp": Date.now()
            });

            // EMPTY INPUT FIELD
            $messageField.val('');
        }
    });

    // A RENDER SCREEN CALLBACK THAT IS TRIGGERED FOR EACH CHAT MESSAGE
    queryRef.onSnapshot(function (querySnapshot) {
        $messageList.html('');
        //MONITOR CHAT MESSAGE AND RENDER SCREEN
        querySnapshot.forEach(function (doc) {
            let senderName = doc.data().senderName || "anonymous";
            let message = doc.data().message;
            let messageItem = `
        <li class="message-item">
          <strong class="chat-username">${senderName}:</strong>
          ${message}
        </li>
        `;
            $messageList.append(messageItem);
        });

        //SCROLL TO BOTTOM OF MESSAGE LIST
        $messageList[0].scrollTop = $messageList[0].scrollHeight;
    });
}); $(function () {

    let App = {
        init: function () {
            this.firebaseConfig = {
                apiKey: "AIzaSyBWkL1ZDkWwGW8IaEVFEhniEJFfM284wwE",
                authDomain: "f2e2018-10e3d.firebaseapp.com",
                databaseURL: "https://f2e2018-10e3d.firebaseio.com",
                projectId: "f2e2018-10e3d",
                storageBucket: "f2e2018-10e3d.appspot.com",
                messagingSenderId: "315995849194",
                appId: "1:315995849194:web:5103d9e1d0bc2da0"
            };
            // Initialize Firebase
            firebase.initializeApp(this.firebaseConfig);
            this.dbRef = firebase.database().ref();
            // REGISTER DOM ELEMENTS
            this.$messageField = $('#messageInput');
            this.$nameField = $('#nameInput');
            this.$messageList = $('#example-messages');
            // BIND THIS
            this.onSaveMessage = this.onSaveMessage.bind(this);
            this.onShowMessage = this.onShowMessage.bind(this);
            // BIND EVENT
            this.bindEvent();
        },
        bindEvent: function () {
            this.$messageField.keypress(this.onSaveMessage);
            this.dbRef.limitToLast(10).on(
                'child_added',
                this.onShowMessage
            );
        },
        onSaveMessage: function (e) {
            console.log(this.dbRef);
            console.log(this.$nameField);
            console.log(this.$nameField.val());
            if (e.keyCode == 13) {
                //FIELD VALUES
                let username = this.$nameField.val();
                let message = this.$messageField.val();
                console.log(username);
                console.log(message);

                //SAVE DATA TO FIREBASE AND EMPTY FIELD
                this.dbRef.push({ name: username, text: message });
                this.$messageField.val('');
            }
        },
        onShowMessage: function (snapshot) {
            //GET DATA
            let data = snapshot.val();
            let username = data.name || "anonymous";
            let message = data.text;
            //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
            let $messageElement = $("<li>");
            let $nameElement = $("<strong class='example-chat-username'></strong>");
            $nameElement.text(username);
            $messageElement.text(message).prepend($nameElement);

            //ADD MESSAGE
            this.$messageList.append($messageElement)

            //SCROLL TO BOTTOM OF MESSAGE LIST
            this.$messageList[0].scrollTop = this.$messageList[0].scrollHeight;
        }
    };

    App.init();
});
