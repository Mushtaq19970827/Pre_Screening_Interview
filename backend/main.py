from datetime import datetime
from bson import json_util
import json
from random import randint
from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import OpenAI as op
from langchain.chains import LLMChain
from pymongo import MongoClient
from langchain.prompts.prompt import PromptTemplate
from constants import openai_key
# from langchain_openai import  LLMChain 

# from langchain.embeddings import OpenAIEmbeddings
# from langchain.vectorstores import FAISS 
from langchain.text_splitter import CharacterTextSplitter
from PyPDF2 import PdfReader
app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient('mongodb://localhost:27017/')
db = client['interview'] 
collection = db['conversation_history']  
scores_collection = db['scores']
users_collection = db['users']
interviews_collection = db['interview']

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = users_collection.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'Logged in successfully', 'isAdmin': user['isAdmin'], 'email': email}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
    
