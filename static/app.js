class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            sendTrainingButton: document.querySelector('.send__training__button'),
            chatTraining: document.querySelector('.chat__training'),
            autoTrainingBtn : document.querySelector('.auto_training_button'),
            deleteButton : document.querySelector('.delete_button'),
            exportButton : document.querySelector('.export_button'),
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton ,sendTrainingButton,chatTraining , autoTrainingBtn,deleteButton,exportButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        sendTrainingButton.addEventListener('click', () => this.submitTrainingData())

        autoTrainingBtn.addEventListener('click', () => this.onAutoTrainingButton())

        deleteButton.addEventListener('click', () => this.onDeleteButton())

        exportButton.addEventListener('click', () => this.onExportButton())

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })

        const nodeTraining = chatTraining.querySelector('.input__training');
        nodeTraining.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.submitTrainingData()
            }
        })

        var loggedIn = localStorage.getItem('loggedIn');
            if (loggedIn === 'false') {
                window.location.href = '/login';
            }
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch(`http://127.0.0.1:5000/get?msg=${text1}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.text())
          .then(r => {
            let msg2 = { name: "Sam", message: r };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    submitTrainingData() {
        var question = document.getElementById("question").value;
        var answer = document.getElementById("answer").value;
        console.log(question,answer);

        var data = [question, answer];

        fetch('http://127.0.0.1:5000/train', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert('Training data submitted successfully!');
            // Optional: Clear input fields after submission
            document.getElementById("question").value = "";
            document.getElementById("answer").value = "";
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting training data.');
        });
    }

    onAutoTrainingButton() {
        fetch(`http://127.0.0.1:5000/auto-train`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.text())
          .then(data => {
            console.log('Success:', data);
            alert('Training data submitted successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting training data.');
        });
    }

    onDeleteButton() {
        fetch(`http://127.0.0.1:5000/delete`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.text())
          .then(data => {
            console.log('Success:', data);
            alert('DELETE Training data successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while DELETE training data.');
        });
    }

    onExportButton() {
        fetch(`http://127.0.0.1:5000/export`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.text())
          .then(data => {
            console.log('Success:', data);
            alert('Export Training data successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while Export training data.');
        });
    }
}


const chatbox = new Chatbox();
chatbox.display();