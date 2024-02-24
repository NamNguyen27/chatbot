from flask import Flask, render_template, request, redirect, url_for,jsonify
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from chatterbot.trainers import ListTrainer

app = Flask(__name__)


english_bot = ChatBot("Chatterbot", storage_adapter="chatterbot.storage.SQLStorageAdapter")

trainer = ChatterBotCorpusTrainer(english_bot)
trainBot = ListTrainer(english_bot)
logged_in = False

@app.route('/login', methods=['POST'])
def login():
        username = request.json['username']
        password = request.json['password']
        print(username,password)
        if username == 'admin' and password == 'password':
            return jsonify({"redirected": "true"})
        else:
            return jsonify({"redirected": "false"})

@app.route('/login')
def renderLogin():
    return render_template('login.html')

@app.route("/home")
def home():
    return render_template("base.html")

@app.route("/get")
def get_bot_response():
    user_text = request.args.get('msg')
    return str(english_bot.get_response(user_text))


@app.route('/train', methods=['POST'])
def train_chatbot():
    data = request.json
    trainBot.train(data)
    return "Training successful" 

@app.route('/export')
def export_chatbot():
    trainer.export_for_training('./my_export.json')
    return "Export successful"

@app.route('/delete',methods=['DELETE'])
def delete_chatbot():
    english_bot.storage.drop()
    return "delete successful"

@app.route('/auto-train')
def auto_train():
    trainer.train('chatterbot.corpus.english')
    return "Training successful" 
@app.route('/logout')
def logout():
    return redirect(url_for('login'))
if __name__ == "__main__":
    app.run(debug=True)
