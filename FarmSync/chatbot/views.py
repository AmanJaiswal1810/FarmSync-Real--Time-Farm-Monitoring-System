# from django.shortcuts import render
# from django.http import JsonResponse
# import openai

# openai_api_key =''
# openai.api_key = openai_api_key

# def askopenai(message):
#    response = openai.Completion.create(
#    model="gpt-3.5-turbo",
#    prompt = message,
#    max_tokens =150,
#    n=1,
#    stop = None,
#    temperature =0.7,
#    )
#    print(response)
#    answer= response.choice[0].text.strip()
#    return answer

# def chatbot(request):
#    if request.method == "POST":
#       message = request.POST.get('message')
#    response = askopenai(message)
#    return JsonResponse({'message': message, 'response': response})
#    return render(request, 'chatbot.html')

# from django.shortcuts import render
# from django.http import JsonResponse
# import openai

# openai_api_key = ''
# openai.api_key = openai_api_key

# def askopenai(message):
#     response = openai.Completion.create(
#         model="gpt-3.5-turbo-instruct",
#         prompt=message,
#         max_tokens=150,
#         n=1,
#         stop=None,
#         temperature=0.7,  # Corrected parameter name
#     )
#     print(response)
#     answer = response.choices[0].text.strip()  # Corrected attribute access
#     return answer

# def chatbot(request):
#     if request.method == "POST":
#         message = request.POST.get('message')
#         response = askopenai(message)
#         return JsonResponse({'message': message, 'response': response})
#     return render(request, 'chatbot.html')

# from django.shortcuts import render
# from django.http import JsonResponse
# import openai

# openai_api_key = ''
# openai.api_key = openai_api_key

# def get_mock_soil_quality(location):
#     # Example mock function to generate soil quality data
#     # You can replace this with actual data or a function that generates realistic mock data
#     mock_ph_level = 6.5
#     mock_moisture_level = 35
#     return f"The mock soil quality in {location} is pH: {mock_ph_level}, Moisture: {mock_moisture_level}%."

# def askopenai(message):
#     response = openai.Completion.create(
#         model="text-davinci-003",
#         prompt=message,
#         max_tokens=150,
#         n=1,
#         stop=None,
#         temperature=0.7,
#     )
#     print(response)
#     answer = response.choices[0].text.strip()
#     return answer

# def generate_feedback(user_interactions):
#     # Process user interactions and generate feedback using OpenAI's API
#     # You can implement your own logic here to analyze interactions and provide feedback
    
#     # Example: concatenate user interactions into a single prompt for OpenAI
#     prompt = "\n".join(user_interactions)
    

# mainnn
# from django.shortcuts import render
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt  
# import openai


# openai_api_key = ''
# openai.api_key = openai_api_key

# def ask_openai(message):
#     try:
#         response = openai.Completion.create(
#             model="gpt-3.5-turbo",
#             prompt=message,
#             max_tokens=150,
#             n=1,
#             stop=None,
#             temperature=0.7,
#         )
#         print(response)
#         answer = response.choices[0].text.strip()  
#     except Exception as e:
#         answer = f"Error: {str(e)}"
#     return answer

# @csrf_exempt 
# def chatbot(request):
#     if request.method == "POST":
#         message = request.POST.get('message')
#         response = ask_openai(message)
#         return JsonResponse({'message': message, 'response': response})
#     else:
#         return render(request, 'chatbot.html')

import os
import logging
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openai
from myapp.models import *


openai_api_key = "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"
openai.api_key = openai_api_key


logger = logging.getLogger(__name__)

def ask_openai(message, data, username):
    try:
        
        # temperature = data.get('temperature', 'N/A')
        # pH_value = data.get('pHValue', 'N/A')
        # turbidity = data.get('turbidity', 'N/A')
        # dissolved_oxygen = data.get('dissolved_oxygen', 'N/A')
        # water_level_sensor = data.get('water_level_sensor', 'N/A')
        # moisture_sensor = data.get('moisture_sensor', 'N/A')
        # nitrogen = data.get('nitrogen', 'N/A')
        # phosphorous = data.get('phosphorous', 'N/A')
        # potassium = data.get('potassium', 'N/A')
        # print(potassium)

        prompt = f"message received:{message}"
        # prompt = f"Data received:\nTemperature: {temperature}\n" \
        #          f"pH Value: {pH_value}\nTurbidity: {turbidity}\n" \
        #          f"Dissolved Oxygen: {dissolved_oxygen}\n" \
        #          f"Water Level Sensor: {water_level_sensor}\n" \
        #          f"Moisture Sensor: {moisture_sensor}\n" \
        #          f"Nitrogen: {nitrogen}\nPhosphorous: {phosphorous}\n" \
        #          f"Potassium: {potassium}\n\nUser's Message: {message}\n\n" \
        #          "Response for improving Soil quality and tell pros and cons:"

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )
        logger.info(f"OpenAI Response: {response}")
        answer = response['choices'][0]['message']['content'].strip()  
    except openai.OpenAIError as e:
        logger.error(f"OpenAI Error: {e}")
        answer = "An error occurred while processing the request."
    except Exception as e:
        logger.error(f"Unexpected Error: {e}")
        answer = "An unexpected error occurred."

    return answer

@csrf_exempt
def chatbot(request, username):
    if request.method == "POST":
        message = request.POST.get('message')
        data = request.POST.dict()  # Convert POST data to dictionary
        if data:
            response = ask_openai(message, data, username)
            return JsonResponse({'message': message, 'response': response})
        else:
            return JsonResponse({'error': 'No data received'})
    else:
        return render(request, 'chatbot.html')


@csrf_exempt
def analysis(request, username):
    if request.method == "POST":
        lastData=IotData.objects.filter(username=username).order_by('-created_at').first()
        if lastData is not None:
            userData = {
            'username': lastData.username,
            'temperature': lastData.temperature,
            'pHValue': lastData.pHValue,
            'turbidity': lastData.turbidity,
            'dissolved_oxygen': lastData.dissolved_oxygen,
            'water_level_sensor': lastData.water_level_sensor,
            'moisture_sensor':lastData.moisture_sensor,
            'nitrogen': lastData.nitrogen,
            'phosphorous': lastData.phosphorous,
            'potassium': lastData.potassium,
            'created_at': lastData.created_at,
        }
        else:
            return None
        message=""
        message = message+ str(userData)
        message = message+ "Do the complete Analysis and give Response for improving Soil quality and tell pros and cons:"

        data =  {"message": userData}  # Convert POST data to dictionary
        
        if data:
            response = ask_openai(message, data, username)
            return JsonResponse({'message': message, 'response': response})
        else:
            return JsonResponse({'error': 'No data received'})
    else:
        return render(request, 'chatbot_analysis.html')





