import os
import subprocess
import time

project_path = os.path.expanduser("C:/Users/jonat/Documents/MATERIAL DE ESTUDO/Ciencia da Computação/Programação/Python/modelo-projeto-mobile/euempreendedor/")
api_path = os.path.join(project_path, "euempreendedor-api")
app_path = os.path.join(project_path, "euempreendedor-app")
python_venv = os.path.join(api_path, 'venv', 'scripts', 'python.exe')

process_api = None
process_app = None

    
try:
    print('Entrando na pasta e executando a API')
    
    process_api = subprocess.Popen([python_venv, 'manage.py', 'runserver', '0.0.0.0:8000'], cwd=api_path)
    
    time.sleep(5)
    
    print('API iniciada com sucesso! Vamos executar agora o APP')
    
    time.sleep(2)
    
    print('Iniciando o aplicativo no Expo Go')
    
    process_app = subprocess.Popen(['npx', 'expo', 'start'], cwd=app_path, shell=True)
    
    time.sleep(15)
    print('App no Expo Go iniciada com sucesso')
    print('Ambos os servidores estão rodando')
    
    while True:
        time.sleep(1)
        
    
except KeyboardInterrupt:
    print('Encerrando os processos')
    time.sleep(2)
finally:
    if process_api:
        process_api.terminate()
    if process_app:
        process_app.terminate()
    print('Processo encerrados com sucesso!')
    
    
    
