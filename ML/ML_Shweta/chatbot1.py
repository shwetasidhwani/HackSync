# # import statements
# import wolframalpha
# import wikipedia
# import re


# # Wikipedia search function
# def search_wiki(keyword=''):
#     try:
#         # search in wikipedia
#         searchResults = wikipedia.search(keyword)
#         if not searchResults:
#             return "Sorry, No result from Wikipedia. Try again."
        
#         page = wikipedia.page(searchResults[0])
#         return str(page.summary)
#     except Exception as e:
#         return f"Error: {str(e)}"


# # Wolframalpha search function
# def search(text=''):
#     try:
#         res = client.query(text)
#         if not res['@success']:
#             return search_wiki(text)
            
#         pod0 = res['pod'][0]
#         pod1 = res['pod'][1]
        
#         if (('definition' in pod1['@title'].lower()) or 
#             ('result' in pod1['@title'].lower()) or 
#             (pod1.get('@primary','false') == 'true')):
#             return resolveListOrDict(pod1['subpod'])
#         else:
#             question = resolveListOrDict(pod0['subpod'])
#             question = question.split('(')[0]
#             return search_wiki(question)
#     except Exception as e:
#         return f"Error: {str(e)}"


# def resolveListOrDict(variable):
#     if isinstance(variable, list):
#         return variable[0]['plaintext']
#     else:
#         return variable['plaintext']


# # Bot activity function
# def activity(data):
#     if not data:
#         return True, "Please try again."
        
#     data = data.lower()
#     if re.search("are you|your name", data):
#         return True, "I'm Wiki-Bandaara. I have access to Wolfram|Alpha and Wikipedia."
#     elif re.search("help|you do", data):
#         return True, 'I have access to Wolfram|Alpha and Wikipedia. Ask anything. To get results from wikipedia, say so. To quit say bye or stop'
#     elif re.search("in wikipedia|from wikipedia", data):
#         result = search_wiki(data)
#         return True, result
#     elif re.search("stop|bye|quit", data):
#         return False, 'Bye\nListening stopped'
#     else:
#         result = search(data)
#         return True, result if result else "Please try again."


# # Text response function
# def response(data):
#     print('Bot:', data)
    

# ### main ###

# # Wolframalpha App Id
# appId = '88EJLQ-JTXAQ7984X'  # Replace with your Wolfram Alpha App ID
# # Wolfram Instance
# client = wolframalpha.Client(appId)

# def main():
#     print('Bot: Hi there, what can I do for you?')
#     listening = True
#     while listening:
#         user_input = input('User: ').strip()
#         listening, response_text = activity(user_input)
#         response(response_text)

# if __name__ == "__main__":
#     main()

import wolframalpha
import wikipedia
import re
import speech_recognition as sr
import pyttsx3

# Initialize speech recognition and text-to-speech
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Wolfram Alpha client setup
client = wolframalpha.Client('88EJLQ-3456EGYWAA')

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen():
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            print("Recognized:", text)  # Debug print
            return text
        except Exception as e:
            print("Error in speech recognition:", str(e))  # Debug print
            return ""

def search_wiki(keyword=''):
    try:
        keyword = re.sub(r'in wikipedia|from wikipedia', '', keyword).strip()
        print("Searching Wikipedia for:", keyword)  # Debug print
        result = wikipedia.summary(keyword, sentences=2)
        return result
    except Exception as e:
        print("Wikipedia error:", str(e))  # Debug print
        return "Could not find that on Wikipedia."

def wolfram_search(query):
    try:
        print("Querying Wolfram Alpha:", query)  # Debug print
        res = client.query(query)
        answer = next(res.results).text
        print("Wolfram response:", answer)  # Debug print
        return answer
    except Exception as e:
        print("Wolfram error:", str(e))  # Debug print
        raise e

def main():
    speak("Hello! How can I help you?")
    while True:
        query = listen()
        if not query:
            speak("I didn't catch that. Could you repeat?")
            continue
            
        print("You said:", query)
        
        if query.lower() in ['quit', 'exit', 'bye']:
            speak("Goodbye!")
            break
            
        try:
            if 'wikipedia' in query.lower():
                result = search_wiki(query)
            else:
                result = wolfram_search(query)
            print("Answer:", result)
            speak(result)
        except Exception as e:
            print("Error in processing:", str(e))  # Debug print
            speak("I couldn't find an answer to that.")

if __name__ == "__main__":
    main()
