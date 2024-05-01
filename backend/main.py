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

# Create an instance of OpenAI with api_key parameter specified explicitly
client = op(api_key=openai_key)
def generate_response(prompt, history):
    # Define the prompt and template
    language_template = """As the hiring manager, your name is Rebecca, 
    and you represent DDILABS software company. In your role as an interviewer, 
    your task is to elicit information from the candidate. {context}
    If there is no previous history,
    please start by greeting the candidate and asking for their name."""

    # Create a prompt template
    language_prompt = PromptTemplate(
        input_variables=["context"],
        template=language_template
    )

    # Check if there's history
    if history:
        # If there's history, don't include the greeting
          # If there's history, don't include the greeting
        context = """In the previous question, you asked: {} 
        and the candidate answered {}. 
        Now respond to the previous answer (don't always say thank you, be a realistic judge) 
        and ask the next question (continue asking technical questions).
        Please do not greet. ask the next question as realistic. if the candiadte knows any specifc language
         ask theory questions from that language. Example: can you explain me about oop concepts.?""".format(history[-1], prompt)
    else:
        # If no history, include the greeting
        context = "Let's start the interview! Please greet the candidate and ask for their name."

    # Create an instance of LLMChain
    llm = LLMChain(llm=client, prompt=language_prompt)

    # Get the response from LLMChain
    results = llm.run({'context': context})

    return results
# def calculate_scores(conversation_history):
#     # Dummy function to calculate scores
#     scores = []
#     for item in conversation_history:
#         # Perform scoring logic based on conversation history
#         score = len(item['response'])  # Example scoring logic
#         scores.append({'prompt': item['prompt'], 'response': item['response'], 'score': score})
#     return scores

def calculate_scores(conversation_history):
       # Define the prompt and template
    language_template = """You are the interviwer. and you have done an interview. calculate the score based on the following interview. and output a number out of 100 .
    instructions:
    out put should be a just a single number out of 100 based on the score you give. because we are going to store the output you give in this prompt in a variable.  example:  10/100 (answermust be a digit no strings. the score should be the only output)
    here is the coverstion. {context}  """

    # Create a prompt template
    language_prompt = PromptTemplate(
        input_variables=["context"],
        template=language_template
    )


    # Create an instance of LLMChain
    llm = LLMChain(llm=client, prompt=language_prompt)

    # Get the response from LLMChain
    results = llm.run({'context': conversation_history})

    return results

from werkzeug.security import generate_password_hash, check_password_hash
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not username or not password or not email:
        return jsonify({'error': 'Missing username, password or email'}), 400

    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 409

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 409

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'username': username,
        'password': hashed_password,
        'isAdmin': False
    })
    return jsonify({'message': 'User created successfully'}), 201

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

@app.route('/get-user', methods=['POST'])
def get_user():
    user_email = request.json.get('email')
    user = users_collection.find_one({'email': user_email})

    if(user):
        serialized_user = json_util.dumps(user)
        return serialized_user, 200
    else:
        return jsonify({'error': 'User doesnt exist'}), 401 
@app.route('/update-user', methods=['POST'])
def update_user():
    user_email = request.json.get('email')
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastName')
    username = request.json.get('username')

    # Validate required fields
    if not user_email:
        return jsonify({'error': 'Missing email parameter'}), 400

    # Find the user by email
    user = users_collection.find_one({'email': user_email})

    # If user exists, update the fields
    if user:
        update_data = {'$set': {}}
        if first_name:
            update_data['$set']['firstName'] = first_name
        if last_name:
            update_data['$set']['lastName'] = last_name
        if username:
            update_data['$set']['username'] = username

        # Perform the update operation
        result = users_collection.update_one({'email': user_email}, update_data)

        # Check if any document was modified
        if result.modified_count > 0:
            return jsonify({'message': 'User updated successfully'}), 200
        else:
            return jsonify({'message': 'No changes detected'}), 200
    else:
        return jsonify({'error': 'User does not exist'}), 404

# # Initialize embeddings
# embeddings = OpenAIEmbeddings()

# # Initialize text splitter
# text_splitter = CharacterTextSplitter(separator="\n", chunk_size=800, chunk_overlap=200, length_function=len)

# @app.route('/analyze-cvs', methods=['POST'])
# def analyze_cvs():
#     uploaded_files = request.files.getlist('files')
#     requirement_file = request.files.get('requirementFile')
#     results = []
#     requirements = []

#     # Analyze CVs
#     for file in uploaded_files:
#         raw_text = ''
#         for page in PdfReader(file).pages:
#             raw_text += page.extract_text()

#         texts = text_splitter.split_text(raw_text)
#         document_search = FAISS.from_texts(texts, embeddings)

#         docs = document_search.similarity_search("list all industrial experiences in this cv owner with name, phone number, all technical, programming skills")
#         chain = LLMChain(llm=op(), prompt_language="stuff")

#         name_answer = chain.run(input_documents=docs, question="name of this cv owner")
#         phone = chain.run(input_documents=docs, question="simply give phone number of this cv owner")
#         skills = chain.run(input_documents=docs, question="list all the skills in this cv owner")
#         experiences = chain.run(input_documents=docs, question="list all industrial experiences in this cv owner with name, phone number, all technical, programming skills")

#         results.append((file.filename, experiences))

#     # Analyze company requirements
#     raw_text = ''
#     for page in PdfReader(requirement_file).pages:
#         raw_text += page.extract_text()

#     texts = text_splitter.split_text(raw_text)
#     document_search = FAISS.from_texts(texts, embeddings)

#     docs = document_search.similarity_search("list all requirements of this company")
#     chain = LLMChain(llm=op(), prompt_language="stuff")
#     req = chain.run(input_documents=docs, question="list all requirements of this company")

#     requirements.append((requirement_file.filename, req))

#     # Perform language model processing
#     language_template = """ who has best matches from this results '{result}' with this company requirements {requirements}. And name the candidates suitability from top to bottom. and the reason in one sentence in front of the name"""
#     language_prompt = PromptTemplate(input_variables=["result", "requirements"], template=language_template)
#     llm = op(temperature=0.8)
#     chain1 = LLMChain(llm=llm, prompt=language_prompt)

#     return jsonify(chain1.run({'result': results, 'requirements': requirements}))

@app.route('/users', methods=['GET'])
def get_all_users():
    users = users_collection.find({}, {'password': 0})  # Excluding the password from the result
    user_list = [{
        '_id': str(user['_id']),  # Convert ObjectId to string
        'firstName': user.get('firstName', ''),
        'lastName': user.get('lastName', ''),
        'email': user.get('email', ''),
        'isAdmin': user.get('isAdmin', '')
    } for user in users]
    return jsonify(user_list)

@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        result = users_collection.delete_one({'_id': ObjectId(user_id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except:
        return jsonify({'error': 'Invalid user ID format'}), 400
    
@app.route('/assign-interview', methods=['POST'])
def assign_interview():
    user_email = request.json.get('candidateName')
    interview_date = request.json.get('interviewDate')
    selected_position = request.json.get('selectedpostion')

    print(user_email)
    print(interview_date)
    print(selected_position)

        # Convert string date to datetime object (assuming 'YYYY-MM-DD' format)
    interview_date = datetime.strptime(interview_date, '%Y-%m-%d')


        # Creating the interview document
    interview_document = {
            'userEmail': user_email,
            'interviewDate': interview_date,
            'position':selected_position,
            'status': 'open',
            'score': '0',
            'assignedStatus': 'true'
        }

        # Inserting the document into the collection
    interviews_collection.insert_one(interview_document)
    return jsonify({'message': 'Interview assigned successfully'}), 201
    
    
@app.route('/get-all-interviews', methods=['POST'])
def get_all_interviews():
    user_email = request.json.get('user_email')
    interviews = list(interviews_collection.find())
    json_interviews = json_util.dumps(interviews)
    return json_interviews

@app.route('/assigned-interviews', methods=['POST'])
def get_all_assigned_interviews():
    user_email = request.json.get('email')
    interviews = list(interviews_collection.find({'userEmail': user_email}))
    json_interviews = json_util.dumps(interviews)
    return json_interviews

@app.route('/api/mark-attendance', methods=['POST'])
def mark_attendance():
    # Assuming the request body contains interview ID and attendance status
    data = request.json
    interview_id = data.get('interviewId')
    attended = data.get('attended')

    # Update the attendance status for the interview
    result = interviews_collection.update_one(
        {'interviewId': interview_id},
        {'$set': {'attended': attended}}
    )

    if result.modified_count:
        return jsonify({'message': 'Attendance marked successfully'}), 200
    else:
        return jsonify({'error': 'Failed to mark attendance'}), 400

@app.route('/calculate-score', methods=['POST'])
def calculate_score():
        # Extracting necessary information
    user_email =  request.json.get('email')
    user_position =  request.json.get('position')

    current_date = datetime.now()
    # Retrieve conversation history from MongoDB
    conversation_history = list(collection.find())
    random_score = randint(0, 100)
    # Calculate scores based on conversation history
    scores = calculate_scores(conversation_history)
    scores_document = {
            'email': user_email,
            'scores': random_score,
            'position':user_position,
            'date': current_date.strftime("%Y-%m-%d %H:%M:%S") 
        }

        # Inserting the document into the collection
    scores_collection.insert_one(scores_document)

    # Update the status and scores in the interview collection
    interview_filter = {'userEmail': user_email, 'position': user_position, 'status': 'open'}
    update_query = {'$set': {'status': 'closed', 'score': random_score}}
    interviews_collection.update_many(interview_filter, update_query)
    # Serialize scores to JSON
    serialized_scores = json.dumps(scores)

    # Return the serialized scores
    return serialized_scores, 200, {'Content-Type': 'application/json'}

@app.route('/scores', methods=['POST'])
def get_scores_by_email():
    email =  request.json.get('email')
    relevant_scores = list(scores_collection.find({'email': email}))

    # Check if scores were found
    if len(relevant_scores) == 0:
        return jsonify({'message': 'No scores found for the given email'}), 404

    # Serialize scores to JSON using custom encoder
    serialized_scores = json.dumps(relevant_scores, default=json_util.default)

    # Return the serialized scores
    return serialized_scores, 200, {'Content-Type': 'application/json'}


@app.route('/initial-response', methods=['POST'])
def get_initial_response():
    prompt = ""  
    results = generate_response(prompt, [])
    
    # Insert conversation into MongoDB
    collection.insert_one({'prompt': prompt, 'response': results})

    return jsonify({'results': results})

@app.route('/subsequent-response', methods=['POST'])
def get_subsequent_response():
    transcript = request.json.get('transcript')
    history = [item['response'] for item in collection.find()]

    print(history,transcript)
    
    # Generate response based on the user's name and conversation history
    results = generate_response(transcript, history)

    # Insert conversation into MongoDB
    collection.insert_one({'prompt': transcript, 'response': results})

    # You can add audio generation and saving logic here

    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True)
